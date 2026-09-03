ARG FRAPPE_VERSION=v16

# ==========================================
# Stage 1: Build React Assets
# ==========================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app
COPY . .

# Build SIF
RUN cd frontend && npm ci && npm run build

# Build KNAPS
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

RUN bench get-app --branch develop https://github.com/frappe/crm.git

# Copy backend application code
COPY --chown=frappe:frappe . /home/frappe/frappe-bench/apps/dhanada

# Install Dhanada as a Python package

RUN cd /home/frappe/frappe-bench/apps/dhanada && /home/frappe/frappe-bench/env/bin/pip install -e .
# Copy the built assets securely from the Node build stage
# The vite configs output to <repo-root>/dhanada/public, so they reside at /app/dhanada/public in the builder
COPY --chown=frappe:frappe --from=frontend-builder /app/dhanada/public /home/frappe/frappe-bench/apps/dhanada/public



RUN python3 -c "from pathlib import Path; p=Path('/home/frappe/frappe-bench/sites/apps.txt'); names=p.read_text().splitlines(); names=[n for n in names if n]; names.append('dhanada') if 'dhanada' not in names else None; p.write_text('\n'.join(names) + '\n')"

# Build bundled assets
RUN bench build --production



# Retain existing entrypoint logic
COPY docker/frappe/nginx-template.conf /templates/nginx/frappe.conf.template
COPY docker/frappe/entrypoint.sh /usr/local/bin/entrypoint.sh

USER root
RUN chmod +x /usr/local/bin/entrypoint.sh

USER frappe

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["bench", "worker"]
