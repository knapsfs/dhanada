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

RUN git clone https://github.com/frappe/crm.git /home/frappe/frappe-bench/apps/crm && \
    git -C /home/frappe/frappe-bench/apps/crm checkout cb46d9bf3a98aac794c40f849bf47321c1488e88 && \
    /home/frappe/frappe-bench/env/bin/pip install -e /home/frappe/frappe-bench/apps/crm && \
    cd /home/frappe/frappe-bench/apps/crm && yarn install --check-files && \
    python3 -c "from pathlib import Path; p=Path('/home/frappe/frappe-bench/sites/apps.txt'); names=p.read_text().splitlines(); names=[n for n in names if n]; names.append('crm') if 'crm' not in names else None; p.write_text('\n'.join(names) + '\n')"

RUN git clone https://github.com/frappe/blog.git /home/frappe/frappe-bench/apps/blog && \
    git -C /home/frappe/frappe-bench/apps/blog checkout ed1ed4019c7f167c41b80f8ea92da60680c2112d && \
    /home/frappe/frappe-bench/env/bin/pip install -e /home/frappe/frappe-bench/apps/blog && \
    python3 -c "from pathlib import Path; p=Path('/home/frappe/frappe-bench/sites/apps.txt'); names=p.read_text().splitlines(); names=[n for n in names if n]; names.append('blog') if 'blog' not in names else None; p.write_text('\n'.join(names) + '\n')"

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

# Resolve relative symlinks in sites/assets to actual physical files and keep baked assets in sync
RUN mkdir /tmp/assets && \
    cp -aL /home/frappe/frappe-bench/sites/assets/. /tmp/assets/ && \
    rm -rf /home/frappe/frappe-bench/sites/assets && \
    mv /tmp/assets /home/frappe/frappe-bench/sites/assets && \
    rm -rf /home/frappe/frappe-bench/assets && \
    cp -a /home/frappe/frappe-bench/sites/assets /home/frappe/frappe-bench/assets

# Build-time asset validation to guarantee all manifest references exist physically
RUN python3 - <<'PY'
import json
import os
import sys

for base in ['/home/frappe/frappe-bench/sites/assets', '/home/frappe/frappe-bench/assets']:
    manifest = os.path.join(base, 'assets.json')
    if not os.path.exists(manifest):
        print(f"ERROR: Manifest {manifest} not found!")
        sys.exit(1)
    with open(manifest) as f:
        assets = json.load(f)
    missing = 0
    for k, v in assets.items():
        file_path = os.path.join(base, v.replace('/assets/', ''))
        if not os.path.exists(file_path):
            print(f"ERROR: Asset {v} referenced in {manifest} not found at {file_path}!")
            missing += 1
    if missing > 0:
        print(f"ERROR: Build validation failed! {missing} missing files in {base}.")
        sys.exit(1)

print("Build-time asset validation passed: all manifest assets exist physically.")
PY



# Retain existing entrypoint logic
COPY docker/frappe/nginx-template.conf /templates/nginx/frappe.conf.template
COPY docker/frappe/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/scripts /docker/scripts

USER root
RUN chmod +x /usr/local/bin/entrypoint.sh && chmod -R +x /docker/scripts && \
    mkdir -p /mnt/assets_vol && chown -R frappe:root /mnt/assets_vol && chmod 775 /mnt/assets_vol

USER frappe

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["bench", "worker"]
