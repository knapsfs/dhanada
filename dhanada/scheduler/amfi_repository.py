# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import hashlib
import logging
import os
import re
import subprocess
from typing import Any

import frappe

from dhanada.sif.sync.github_client import GitHubClient, parse_amfi_sif_nav_text

logger = logging.getLogger("sif_sync")


def get_local_amfi_repo_path() -> str:
	"""
	Returns the persistent absolute path to the local AMFI_Fetcher cloned repository.
	Resolution order:
	1. Configured via site_config (amfi_fetcher_local_path) or environment variable (AMFI_FETCHER_LOCAL_PATH).
	2. Container bind mount: /home/frappe/amfi_fetcher_repo (in Docker containers where ./amfi_fetcher_repo is mounted).
	3. Local host / dev environment: sibling to docker-compose.yml in dhanada app root.
	4. Fallback: persistent site folder (amfi_fetcher_repo).
	"""
	configured = frappe.conf.get("amfi_fetcher_local_path") or os.environ.get("AMFI_FETCHER_LOCAL_PATH")
	if configured and isinstance(configured, str):
		return os.path.realpath(os.path.abspath(configured))

	# Standard Docker container mount point (mounted from ./amfi_fetcher_repo on host)
	container_mount = "/home/frappe/amfi_fetcher_repo"
	if os.path.exists(container_mount) or os.path.exists("/.dockerenv"):
		return os.path.realpath(container_mount)

	# Local dev: sibling of docker-compose.yml in dhanada app root
	try:
		app_path = frappe.get_app_path("dhanada")
		app_root = os.path.abspath(os.path.join(app_path, ".."))
		if os.path.exists(os.path.join(app_root, "docker-compose.yml")):
			return os.path.realpath(os.path.join(app_root, "amfi_fetcher_repo"))
	except Exception:
		pass

	return os.path.realpath(frappe.get_site_path("amfi_fetcher_repo"))


def clean_github_url(raw_url: str | None) -> str:
	"""
	Normalizes GitHub URL by stripping trailing slashes, /tree/ subpaths, etc.
	"""
	if not raw_url:
		return ""
	url = str(raw_url).strip()
	if "/tree/" in url:
		url = url.split("/tree/")[0]
	return url.rstrip("/")


def clean_repo_subpath(raw_path: str | None) -> str:
	"""
	Converts either a full GitHub web URL (e.g. https://github.com/owner/repo/tree/main/data/...)
	or a relative repository subpath (e.g. data/sif/scheme/details) into a clean relative path.
	"""
	if not raw_path:
		return ""
	path = str(raw_path).strip()
	if "github.com" in path and "/tree/" in path:
		parts = re.split(r"/tree/[^/]+/", path)
		if len(parts) > 1:
			path = parts[1]
		else:
			path = path.split("/tree/")[1]
	elif path.startswith("http://") or path.startswith("https://"):
		path = ""

	return path.strip("/")


def compute_files_hash(file_paths: list[str]) -> str:
	"""Computes a combined SHA-256 hash of a list of file paths and their contents."""
	hasher = hashlib.sha256()
	for fpath in sorted(file_paths):
		fname = os.path.basename(fpath)
		hasher.update(fname.encode("utf-8"))
		if os.path.exists(fpath):
			try:
				with open(fpath, "rb") as fp:
					while chunk := fp.read(65536):
						hasher.update(chunk)
			except OSError:
				pass
	return hasher.hexdigest()


def load_local_amfi_isin_mapping(repo_path: str) -> dict[str, str]:
	"""
	Attempts to read the AMFI SIF_NAVAll.txt feed from the local repository first,
	falling back to the authoritative network feed if not found locally.
	"""
	possible_paths = [
		os.path.join(repo_path, "data", "sif", "SIF_NAVAll.txt"),
		os.path.join(repo_path, "data", "SIF_NAVAll.txt"),
		os.path.join(repo_path, "SIF_NAVAll.txt"),
	]
	for p in possible_paths:
		if os.path.exists(p):
			try:
				with open(p, encoding="utf-8", errors="ignore") as f:
					return parse_amfi_sif_nav_text(f.read())
			except Exception as e:
				logger.warning(f"Failed reading local SIF_NAVAll.txt at {p}: {e}")

	try:
		return GitHubClient().fetch_amfi_isin_mapping()
	except Exception as e:
		logger.warning(f"Failed fetching ISIN mapping: {e}")
		return {}


def ensure_amfi_repository_updated() -> str:
	"""
	Shared repository helper: ensures the local AMFI_Fetcher repository is cloned/pulled and ready.
	Called by all data-processing schedulers on every run.
	Returns the validated local repository path (str).
	"""
	logger.info("Checking and updating local AMFI_Fetcher repository...")

	settings = frappe.get_single("Dhanada Settings")
	raw_url = getattr(settings, "github_amfi_fetcher_url", None)
	repo_url = clean_github_url(raw_url)

	if not repo_url:
		err_msg = "github_amfi_fetcher_url is not configured in Dhanada Settings."
		logger.error(err_msg)
		frappe.cache().set_value("amfi_fetcher_repo_ready", 0)
		raise ValueError(err_msg)

	local_path = get_local_amfi_repo_path()
	os.makedirs(os.path.dirname(local_path), exist_ok=True)

	is_existing_git = os.path.isdir(os.path.join(local_path, ".git"))

	try:
		if not is_existing_git:
			logger.info(f"Cloning AMFI_Fetcher from {repo_url} into persistent location {local_path}...")
			if os.path.exists(local_path):
				import shutil

				shutil.rmtree(local_path, ignore_errors=True)

			subprocess.run(
				["git", "clone", repo_url, local_path],
				check=True,
				capture_output=True,
				text=True,
				timeout=180,
			)
			logger.info(f"Successfully cloned AMFI_Fetcher repository into {local_path}")
		else:
			logger.info(f"Pulling latest updates for AMFI_Fetcher repository at {local_path}...")
			subprocess.run(
				["git", "remote", "set-url", "origin", repo_url],
				cwd=local_path,
				check=True,
				capture_output=True,
				text=True,
				timeout=30,
			)
			subprocess.run(
				["git", "pull", "--ff-only"],
				cwd=local_path,
				check=True,
				capture_output=True,
				text=True,
				timeout=120,
			)
			logger.info(f"Successfully updated AMFI_Fetcher repository at {local_path}")

		if not os.path.exists(local_path) or not os.path.isdir(local_path):
			raise RuntimeError(f"Local repository path is invalid after clone/pull: {local_path}")

		frappe.cache().set_value("amfi_fetcher_repo_ready", 1)
		frappe.cache().set_value("amfi_fetcher_repo_path", local_path)
		return local_path

	except subprocess.CalledProcessError as e:
		frappe.cache().set_value("amfi_fetcher_repo_ready", 0)
		err = e.stderr or e.stdout or str(e)
		logger.error(f"Git operation failed for AMFI_Fetcher ({repo_url}): {err}")
		raise RuntimeError(f"Git clone/pull failed for AMFI_Fetcher: {err}") from e
	except Exception as e:
		frappe.cache().set_value("amfi_fetcher_repo_ready", 0)
		logger.error(f"Unexpected error in ensure_amfi_repository_updated: {e}", exc_info=True)
		raise
