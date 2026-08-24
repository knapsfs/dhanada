ARG FRAPPE_VERSION=v16
FROM frappe/erpnext:${FRAPPE_VERSION}

USER root

RUN apt-get update \
    && apt-get install -y iputils-ping \
    && rm -rf /var/lib/apt/lists/*

USER frappe

RUN bench get-app --branch develop https://github.com/frappe/crm.git

COPY --chown=frappe:frappe . /home/frappe/frappe-bench/apps/dhanada
COPY --chown=frappe:frappe public /home/frappe/frappe-bench/sites/assets/dhanada

ENV PYTHONPATH="/home/frappe/frappe-bench/apps"

RUN python3 -c "from pathlib import Path; p=Path('/home/frappe/frappe-bench/sites/apps.txt'); names=p.read_text().splitlines(); names=[n for n in names if n]; names.append('dhanada') if 'dhanada' not in names else None; p.write_text('\n'.join(names) + '\n')"

COPY docker/frappe/entrypoint.sh /usr/local/bin/entrypoint.sh

USER root
RUN chmod +x /usr/local/bin/entrypoint.sh

USER frappe

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["bench", "worker"]