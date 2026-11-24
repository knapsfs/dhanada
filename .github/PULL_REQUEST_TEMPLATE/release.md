## Release Checklist

- [ ] All PRs merged to `develop` and CI green
- [ ] The commit was deployed to development and passed `erp-smoke`
- [ ] Version bumped in `dhanada/__init__.py` (`__version__`)
- [ ] `Release` workflow run: `vX.Y.Z` tag created on the built commit
- [ ] `Promote to production` run with the same digest, and approved
- [ ] Production smoke check passed

## What's in this release

<!-- Summary of changes -->

## Digest

<!-- sha256:... from the Build image / Release run summary -->

## Breaking Changes

<!-- None. If a migration is not backward compatible, say so here and plan the restore path. -->
