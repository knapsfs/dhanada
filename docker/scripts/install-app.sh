#!/bin/bash
set -e

APP_NAME="$1"

if [ -z "$APP_NAME" ]; then
    echo "ERROR: App name is required."
    exit 1
fi

echo "Installing ${APP_NAME}..."

if [ ! -d "apps/${APP_NAME}" ]; then
    echo "ERROR: App ${APP_NAME} is not present in the image."
    exit 1
fi

if ! grep -qxF "${APP_NAME}" sites/apps.txt; then
    echo "${APP_NAME}" >> sites/apps.txt
fi

echo "Installing ${APP_NAME} on site ${SITE_NAME}..."

bench --site "${SITE_NAME}" install-app "${APP_NAME}"

echo "${APP_NAME} installation completed successfully."