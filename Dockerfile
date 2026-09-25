ARG FRAPPE_VERSION=v16

# ==========================================
# Stage 1: Build React Assets
# ==========================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app
COPY . .

# Build KNAPS (Unified Frontend)
RUN cd frontend/knaps && npm ci && npm run build

# ==========================================
# Stage 2: Final Dhanada Image
# ==========================================
FROM frappe/erpnext:${FRAPPE_VERSION}

USER root

RUN apt-get update \
    && apt-get install -y iputils-ping \
    && rm -rf /var/lib/apt/lists/*

USER frappe

RUN bench get-app --branch develop https://github.com/frappe/crm.git && \
    git -C /home/frappe/frappe-bench/apps/crm fetch --depth=50 upstream develop && \
    git -C /home/frappe/frappe-bench/apps/crm reset --hard cb46d9bf3a98aac794c40f849bf47321c1488e88

# Copy backend application code
COPY --chown=frappe:frappe . /home/frappe/frappe-bench/apps/dhanada

# Install Dhanada as a Python package

RUN cd /home/frappe/frappe-bench/apps/dhanada && /home/frappe/frappe-bench/env/bin/pip install -e .
# Copy the built assets securely from the Node build stage
# The vite configs output to <repo-root>/dhanada/public, so they reside at /app/dhanada/public in the builder
COPY --chown=frappe:frappe --from=frontend-builder /app/dhanada/public /home/frappe/frappe-bench/apps/dhanada/public

# Remove development-only frontend source code from runtime image
RUN rm -rf /home/frappe/frappe-bench/apps/dhanada/frontend

RUN python3 -c "from pathlib import Path; p=Path('/home/frappe/frappe-bench/sites/apps.txt'); names=p.read_text().splitlines(); names=[n for n in names if n]; names.append('dhanada') if 'dhanada' not in names else None; p.write_text('\n'.join(names) + '\n')"

# Build bundled assets
RUN bench build --production

# Resolve relative symlinks in sites/assets to actual physical files
RUN mkdir /tmp/assets && \
    cp -aL /home/frappe/frappe-bench/sites/assets/. /tmp/assets/ && \
    rm -rf /home/frappe/frappe-bench/sites/assets && \
    mv /tmp/assets /home/frappe/frappe-bench/sites/assets



# Retain existing entrypoint logic
COPY docker/frappe/nginx-template.conf /templates/nginx/frappe.conf.template
COPY docker/frappe/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/scripts /docker/scripts

USER root
RUN chmod +x /usr/local/bin/entrypoint.sh && chmod -R +x /docker/scripts

USER frappe

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["bench", "worker"]
