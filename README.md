### Dhanada

Investment Platform for KNAPS 

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app dhanada
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/dhanada
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade
### CI

GitHub Actions runs tests and linters on every pull request, and builds the
application image when a change lands on `develop`.

- **CI** — installs the app and runs unit tests on PRs and on `develop`.
- **Linters** — [Frappe Semgrep Rules](https://github.com/frappe/semgrep-rules) and [pip-audit](https://pypi.org/project/pip-audit/) on every pull request.
- **PR Title Check** — semantic title and issue reference.

### Deployment

One image per commit, promoted by digest:

```
merge to develop -> build once -> deploy to development -> smoke
                 -> release tag -> promote the same digest -> approve -> production
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full flow, the required
secrets and the rollback procedure. The receiving pipeline (servers, Ansible,
`erp-deploy`) lives in the `knapsfs/deployment` repository.


### License

mit
