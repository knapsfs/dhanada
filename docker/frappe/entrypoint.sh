#!/bin/bash
set -e

export PYTHONPATH="/home/frappe/frappe-bench/apps:${PYTHONPATH}"

exec "$@"