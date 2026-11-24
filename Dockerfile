# syntax=docker/dockerfile:1
#
# One image for every environment. Environment configuration is injected at
# deploy time (compose + env files), never baked in.
#
# ERPNEXT_IMAGE must match the Frappe version the app targets. Override it in
# the build workflow with the repository variable ERPNEXT_IMAGE and pin it to a
# digest for reproducible builds. `develop` is a moving tag and is only a
# development default.
ARG ERPNEXT_IMAGE=frappe/erpnext:develop
FROM ${ERPNEXT_IMAGE}

USER frappe
ARG APP_COMMIT=unknown

# Install the app at the exact commit the pipeline checked out. The image is
# built once on merge to develop and promoted by digest; production never
# rebuilds from a different checkout.
RUN git clone --filter=blob:none https://github.com/knapsfs/dhanada.git /tmp/dhanada \
 && cd /tmp/dhanada \
 && git checkout "${APP_COMMIT}" \
 && cd /home/frappe/frappe-bench \
 && bench get-app /tmp/dhanada \
 && rm -rf /tmp/dhanada

LABEL org.opencontainers.image.source="https://github.com/knapsfs/dhanada" \
      org.opencontainers.image.revision="${APP_COMMIT}"

# bench build is deliberately not run here. The deployment stack's
# asset-syncer service builds and validates assets at deploy time, keyed to the
# image digest, so a rebuild of the same commit cannot reuse stale assets.
