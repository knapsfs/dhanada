# Dhanada

Dhanada is a Frappe app for KNAPS. It supports a multi-product financial distribution business and includes the application code alongside the design reference for product, identity, family, and distribution operations.

## Documentation

The design set is in [docs/](docs/). Use it as a structured reference set rather than a collection of loosely related documents.

Start here:

- [docs/README.md](docs/README.md): architecture and reading order
- [docs/01-product/README.md](docs/01-product/README.md): scope and business context
- [docs/02-domain/README.md](docs/02-domain/README.md): business objects and relationships
- [docs/03-data-model/README.md](docs/03-data-model/README.md): implementation-facing model
- [docs/04-decisions/README.md](docs/04-decisions/README.md): ADRs and open questions
- [docs/05-examples/README.md](docs/05-examples/README.md): scenario-based examples

## Installation

Install with the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app dhanada
```

## Contributing

This repository uses `pre-commit` for formatting and linting. Install and enable it before making changes:

```bash
cd apps/dhanada
pre-commit install
```

The configured checks include:

- ruff
- eslint
- prettier
- pyupgrade

## CI

GitHub Actions is used for repository checks. The main workflows cover:

- application install and unit tests on the `develop` branch
- linting and security scanning for pull requests

## License

MIT
