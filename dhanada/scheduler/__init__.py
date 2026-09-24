# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

"""
Modular AMFI scheduler package.
Architecture:
- Shared repository helper: dhanada.scheduler.amfi_repository.ensure_amfi_repository_updated()
- NAV scheduler (daily): dhanada.scheduler.sync_nav_data.sync_nav_data
- NAV Performance scheduler (daily + monthly heatmap): dhanada.scheduler.sync_nav_performance.sync_nav_performance
- Scheme Details scheduler (weekly): dhanada.scheduler.sync_scheme_details.sync_scheme_details
"""

import logging

from dhanada.scheduler.amfi_repository import (
	clean_github_url,
	clean_repo_subpath,
	ensure_amfi_repository_updated,
	get_local_amfi_repo_path,
)
from dhanada.scheduler.sync_nav_data import sync_nav_data
from dhanada.scheduler.sync_nav_performance import sync_nav_performance
from dhanada.scheduler.sync_scheme_details import sync_scheme_details

logger = logging.getLogger("sif_sync")


def run_sync_pipeline():
	"""
	Manual/programmatic utility helper to run scheme, NAV, and performance sync sequentially.
	Not scheduled in hooks.py.
	"""
	logger.info("Executing manual SIF sync pipeline...")
	sync_scheme_details()
	sync_nav_data()
	sync_nav_performance()
	logger.info("Completed manual SIF sync pipeline.")


__all__ = [
	"clean_github_url",
	"clean_repo_subpath",
	"ensure_amfi_repository_updated",
	"get_local_amfi_repo_path",
	"run_sync_pipeline",
	"sync_nav_data",
	"sync_nav_performance",
	"sync_scheme_details",
]
