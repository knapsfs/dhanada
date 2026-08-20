ARG FRAPPE_VERSION=v16
FROM frappe/erpnext:${FRAPPE_VERSION}

USER root

RUN apt-get update \
    && apt-get install -y iputils-ping \
    && rm -rf /var/lib/apt/lists/*

USER frappe

# Install Frappe CRM (v16-compatible)
RUN bench get-app --branch develop https://github.com/frappe/crm.git

# Copy Dhanada into the production image
COPY --chown=frappe:frappe dhanada /home/frappe/frappe-bench/apps/dhanada

# Register Dhanada with the bench
RUN python3 -c "from pathlib import Path; p=Path('/home/frappe/frappe-bench/sites/apps.txt'); names=p.read_text().splitlines(); names=[n for n in names if n]; names.append('dhanada') if 'dhanada' not in names else None; p.write_text('\n'.join(names) + '\n')"

COPY docker/frappe/entrypoint.sh /usr/local/bin/entrypoint.sh

USER root
RUN chmod +x /usr/local/bin/entrypoint.sh

USER frappe

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["bench", "worker"]