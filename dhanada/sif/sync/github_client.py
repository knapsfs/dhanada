import csv
import io
import json
import logging
import os
import re
from typing import Any

import frappe
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from .constants import AMFI_SIF_NAV_URL
from .logger import log_error, log_warning

logger = logging.getLogger("sif_sync")


def parse_amfi_sif_nav_text(text: str) -> dict[str, str]:
	"""
	Parses AMFI SIF_NAVAll.txt text into an ISIN -> SIF code dictionary.
	Field 0: SIF code (e.g. SIF-01)
	Field 1: ISIN Div Payout / ISIN Growth
	Field 2: ISIN Div Reinvestment
	"""
	isin_to_sif: dict[str, str] = {}
	if not text:
		return isin_to_sif

	for line in text.splitlines():
		line = line.strip()
		if not line or ";" not in line:
			continue
		parts = [p.strip() for p in line.split(";")]
		if len(parts) < 3:
			continue
		sif_code = parts[0]
		if sif_code.lower() in ("scheme code", "code") or not re.match(r"^SIF-\d+$", sif_code, re.IGNORECASE):
			continue

		isin1 = parts[1]
		isin2 = parts[2]

		if isin1 and isin1 != "-" and isin1.upper() != "NAN":
			isin_to_sif[isin1] = sif_code
		if isin2 and isin2 != "-" and isin2.upper() != "NAN":
			isin_to_sif[isin2] = sif_code

	return isin_to_sif


class GitHubClient:
    def __init__(self):
        self.repo_url = frappe.conf.get("sif_sync_github_repo_url", "https://github.com/Satyam4755/AMFI_Fetcher")
        self.branch = frappe.conf.get("sif_sync_github_branch", "main")
        self.token = frappe.conf.get("sif_sync_github_token")

        self.session = requests.Session()
        retry = Retry(
            total=3,
            read=3,
            connect=3,
            backoff_factor=0.3,
            status_forcelist=(500, 502, 503, 504)
        )
        adapter = HTTPAdapter(max_retries=retry)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        headers = {"Accept": "application/vnd.github.v3+json"}
        if self.token:
            headers["Authorization"] = f"token {self.token}"
        self.session.headers.update(headers)

        # Dedicated session for downloading raw files to prevent
        # API headers from interfering and to reuse connections.
        self.dl_session = requests.Session()
        self.dl_session.mount("http://", adapter)
        self.dl_session.mount("https://", adapter)
        if self.token:
            self.dl_session.headers.update({"Authorization": f"token {self.token}"})

        if self.repo_url:
            self._owner, self._repo = self._parse_repo_url(self.repo_url)
        else:
            self._owner, self._repo = None, None

    def _parse_repo_url(self, repo_url: str):
        base_url = repo_url.rstrip("/")
        if "api.github.com" in base_url:
            parts = base_url.split("/")
            return parts[-2], parts[-1]

        parts = base_url.replace("https://github.com/", "").split("/")
        if len(parts) >= 2:
            return parts[0], parts[1]
        raise ValueError(f"Invalid github repo url: {repo_url}")

    def _get_api_url(self, path: str) -> str:
        if not self._owner or not self._repo:
            raise ValueError("sif_sync_github_repo_url is not configured in site_config.json")
        return f"https://api.github.com/repos/{self._owner}/{self._repo}/contents/{path}?ref={self.branch}"

    def _get_local_fallback_path(self, path: str) -> str | None:
        candidates = [
            frappe.conf.get("amfi_fetcher_path"),
            frappe.conf.get("sif_data_path"),
            os.environ.get("SIF_DATA_PATH"),
            os.environ.get("AMFI_FETCHER_PATH"),
            frappe.get_site_path("sif_data"),
        ]
        for base in candidates:
            if base and isinstance(base, str):
                target = os.path.realpath(os.path.abspath(os.path.join(base, path)))
                if os.path.exists(target):
                    return target
        return None

    def _list_directory(self, path: str) -> list[dict[str, Any]]:
        """Lists files in a GitHub directory using Contents API with local fallback on rate limit."""
        url = self._get_api_url(path)
        try:
            # Using tuple timeout: 5s connect, 30s read. Prevents 2-minute IPv6 deadlocks.
            response = self.session.get(url, timeout=(5.0, 30.0))
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and "message" in data:
                log_warning(f"GitHub API Error listing {path}: {data['message']}")
                local_dir = self._get_local_fallback_path(path)
                if local_dir and os.path.isdir(local_dir):
                    return [
                        {"name": f, "download_url": f"file://{os.path.join(local_dir, f)}"}
                        for f in os.listdir(local_dir)
                    ]
                return []
            else:
                log_warning(f"Path {path} is not a directory or returned unexpected format.")
                return []
        except (requests.exceptions.HTTPError, requests.exceptions.RequestException) as e:
            local_dir = self._get_local_fallback_path(path)
            if local_dir and os.path.isdir(local_dir):
                log_warning(f"GitHub API error ({e}); falling back to local files at {local_dir}")
                return [
                    {"name": f, "download_url": f"file://{os.path.join(local_dir, f)}"}
                    for f in os.listdir(local_dir)
                ]
            if isinstance(e, requests.exceptions.HTTPError) and e.response.status_code == 404:
                log_warning(f"Directory not found on GitHub: {path}")
                return []
            log_error(f"Error listing {path}: {e}", exc_info=True)
            raise

    def _download_file(self, download_url: str) -> bytes:
        """Downloads a raw file from GitHub or reads from local fallback URL."""
        if download_url.startswith("file://"):
            local_file_path = os.path.realpath(os.path.abspath(download_url[7:]))
            with open(local_file_path, "rb") as f:  # nosemgrep: frappe-security-file-traversal
                return f.read()
        try:
            # Reusing dl_session with connection pooling.
            # Tuple timeout (5.0, 30.0) ensures dead IPv6 resolves fail quickly.
            response = self.dl_session.get(download_url, timeout=(5.0, 30.0))
            response.raise_for_status()
            return response.content
        except requests.exceptions.RequestException as e:
            log_error(f"Failed to download file from {download_url}: {e}", exc_info=True)
            raise

    # 1. SCHEME DETAILS DISCOVERY
    def fetch_scheme_details(self) -> list[dict[str, Any]]:
        directory = "data/sif/scheme/details"
        logger.info(f"Using repository: {self.repo_url} (branch: {self.branch})")
        logger.info(f"Fetching scheme details from directory: {directory}")

        files = self._list_directory(directory)
        json_files = [f for f in files if f.get("name", "").endswith(".json")]

        logger.info(f"Discovered {len(json_files)} JSON files in {directory}")

        parsed_schemes = []
        skipped = 0

        for file_info in json_files:
            try:
                content = self._download_file(file_info["download_url"])
                data = json.loads(content)
                parsed_schemes.append(data)
            except Exception as e:
                skipped += 1
                log_error(f"Failed to fetch or parse scheme detail file {file_info.get('name')}: {e}", exc_info=True)

        logger.info(f"Successfully parsed {len(parsed_schemes)} scheme files. Skipped {skipped}.")
        return parsed_schemes

    # 2. DAILY NAV DISCOVERY
    def fetch_latest_nav(self) -> list[dict[str, Any]]:
        directory = "data/sif/scheme/nav/daily"
        logger.info(f"Using repository: {self.repo_url} (branch: {self.branch})")
        logger.info(f"Fetching latest NAV from directory: {directory}")

        files = self._list_directory(directory)
        csv_files = []
        for f in files:
            name = f.get("name", "")
            if re.match(r"^\d{8}\.csv$", name):
                csv_files.append(f)

        if not csv_files:
            log_warning(f"No matching YYYYMMDD.csv files found in {directory}")
            return []

        # Sort files descending to find the latest date
        csv_files.sort(key=lambda x: x["name"], reverse=True)
        latest_file = csv_files[0]

        logger.info(f"Latest NAV file selected: {latest_file['name']}")

        parsed_rows = []
        try:
            content = self._download_file(latest_file["download_url"])
            text = content.decode("utf-8")
            reader = csv.DictReader(io.StringIO(text))

            for row in reader:
                if "sif_code" in row and "nav_date" in row and "nav" in row:
                    parsed_rows.append(row)
                else:
                    log_warning(f"Skipping malformed row in {latest_file['name']}: {row}")

            logger.info(f"Successfully parsed {len(parsed_rows)} NAV rows from {latest_file['name']}.")
        except Exception as e:
            log_error(f"Failed to fetch or parse NAV CSV {latest_file['name']}: {e}", exc_info=True)

        return parsed_rows

    # 3. PERFORMANCE DISCOVERY
    def fetch_performance(self) -> list[dict[str, Any]]:
        directory = "data/sif/scheme/performance"
        logger.info(f"Using repository: {self.repo_url} (branch: {self.branch})")
        logger.info(f"Fetching performance data from directory: {directory}")

        files = self._list_directory(directory)
        json_files = [f for f in files if f.get("name", "").endswith(".json")]

        logger.info(f"Discovered {len(json_files)} JSON performance files in {directory}")

        parsed_performance = []
        skipped = 0

        for file_info in json_files:
            try:
                content = self._download_file(file_info["download_url"])
                data = json.loads(content)
                parsed_performance.append(data)
            except Exception as e:
                skipped += 1
                log_error(f"Failed to fetch or parse performance file {file_info.get('name')}: {e}", exc_info=True)

        logger.info(f"Successfully parsed {len(parsed_performance)} performance files. Skipped {skipped}.")
        return parsed_performance

    # 4. AMFI ISIN -> SIF CODE DISCOVERY
    def fetch_amfi_isin_mapping(self) -> dict[str, str]:
        """
        Fetches the authoritative AMFI SIF_NAVAll.txt feed and returns an ISIN -> SIF code mapping.
        """
        url = frappe.conf.get("sif_amfi_nav_url", AMFI_SIF_NAV_URL)
        logger.info(f"Fetching authoritative AMFI SIF NAV feed for ISIN mapping from: {url}")
        try:
            response = self.dl_session.get(url, timeout=(5.0, 30.0))
            response.raise_for_status()
            text = response.content.decode("utf-8", errors="ignore")
            mapping = parse_amfi_sif_nav_text(text)
            logger.info(f"Successfully parsed {len(mapping)} ISIN -> SIF mappings from AMFI feed.")
            return mapping
        except Exception as e:
            log_warning(f"Failed to fetch or parse AMFI SIF NAV feed from {url}: {e}")
            return {}

    # 4. HEATMAP DISCOVERY
    def fetch_heatmap_performance(self) -> list[dict[str, Any]]:
        """
        Fetches all yearly heatmap CSV files from data/sif/scheme/heatMap/.
        Returns list of parsed row dictionaries containing sif_code, year, jan..dec.
        """
        directory = "data/sif/scheme/heatMap"
        logger.info(f"Using repository: {self.repo_url} (branch: {self.branch})")
        logger.info(f"Fetching heatmap data from directory: {directory}")

        files = self._list_directory(directory)
        csv_files = [f for f in files if f.get("name", "").endswith(".csv")]

        logger.info(f"Discovered {len(csv_files)} CSV heatmap files in {directory}")

        all_heatmap_rows = []
        for file_info in sorted(csv_files, key=lambda x: x.get("name", "")):
            try:
                content = self._download_file(file_info["download_url"])
                text = content.decode("utf-8")
                reader = csv.DictReader(io.StringIO(text))
                for row in reader:
                    if "sif_code" in row and "year" in row:
                        all_heatmap_rows.append(row)
                    else:
                        log_warning(f"Skipping malformed row in {file_info.get('name')}: {row}")
            except Exception as e:
                log_error(f"Failed to fetch or parse heatmap CSV {file_info.get('name')}: {e}", exc_info=True)

        logger.info(f"Successfully parsed {len(all_heatmap_rows)} heatmap rows across {len(csv_files)} files.")
        return all_heatmap_rows


    # 5. HISTORICAL NAV DISCOVERY
    def fetch_historical_nav(self) -> list[dict[str, Any]]:
        """
        Fetches all historical NAV CSV files from data/sif/scheme/nav/historical/.
        Returns list of scheme datasets:
        [
            {
                "sif_code": "SIF-2",
                "rows": [{"sif_code": "SIF-2", "nav_date": "09-Jul-2026", "nav": "10.902"}, ...]
            },
            ...
        ]
        """
        directory = "data/sif/scheme/nav/historical"
        logger.info(f"Using repository: {self.repo_url} (branch: {self.branch})")
        logger.info(f"Fetching historical NAV data from directory: {directory}")

        files = self._list_directory(directory)
        csv_files = [f for f in files if f.get("name", "").endswith(".csv")]

        logger.info(f"Discovered {len(csv_files)} historical NAV CSV files in {directory}")

        all_schemes_hist: list[dict[str, Any]] = []
        for file_info in sorted(csv_files, key=lambda x: x.get("name", "")):
            filename = file_info.get("name", "")
            base_name = os.path.splitext(filename)[0]
            fallback_code = base_name.upper().replace("_", "-")

            try:
                content = self._download_file(file_info["download_url"])
                text = content.decode("utf-8")
                reader = csv.DictReader(io.StringIO(text))
                scheme_code = None
                rows = []
                for row in reader:
                    if not scheme_code and row.get("sif_code"):
                        scheme_code = row.get("sif_code").strip().upper()
                    rows.append(row)

                resolved_code = scheme_code or fallback_code
                all_schemes_hist.append(
                    {
                        "sif_code": resolved_code,
                        "rows": rows,
                    }
                )
            except Exception as e:
                log_error(f"Failed to fetch or parse historical NAV CSV {filename}: {e}", exc_info=True)

        logger.info(f"Successfully parsed historical NAV across {len(all_schemes_hist)} scheme files.")
        return all_schemes_hist

    # 6. BACKWARD COMPATIBILITY
    def fetch_json(self, path: str) -> dict[str, Any]:
        """
        Fetches a JSON file from the configured GitHub repository.
        Preserved for backward compatibility with older importer logic.
        """
        url = self._get_api_url(path)
        try:
            headers = {"Accept": "application/vnd.github.v3.raw"}
            if self.token:
                headers["Authorization"] = f"token {self.token}"
            response = requests.get(url, headers=headers, timeout=(5.0, 30.0))
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            log_error(f"HTTP Error fetching {path} from GitHub: {e}", exc_info=True)
            raise
        except requests.exceptions.RequestException as e:
            log_error(f"Network Error fetching {path} from GitHub: {e}", exc_info=True)
            raise
        except ValueError as e:
            log_error(f"Failed to parse JSON from {path}: {e}", exc_info=True)
            raise

    def fetch_all_data(self) -> dict[str, Any]:
        """
        Preserved for backward compatibility with `run_sync` in `scheduler.py`.
        """
        paths_config = frappe.conf.get("sif_sync_json_paths", "data.json")
        paths = [p.strip() for p in paths_config.split(",")]

        combined_data = {}
        for path in paths:
            try:
                data = self.fetch_json(path)
                if isinstance(data, dict):
                    for k, v in data.items():
                        if k in combined_data and isinstance(combined_data[k], list) and isinstance(v, list):
                            combined_data[k].extend(v)
                        else:
                            combined_data[k] = v
                else:
                    log_warning(f"Expected dict from {path}, got {type(data)}. Skipping merge.")
            except Exception as e:
                raise Exception(f"Failed to fetch required data from {path}") from e

        return combined_data
