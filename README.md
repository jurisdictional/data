# Jurisdictional Data

Open public data about U.S. government jurisdictions, agencies, services, and officials.
This repository stores structured JSON files tracked with [Git LFS](https://git-lfs.com/).

## Purpose

This is the open data layer for [Jurisdictional](https://github.com/jurisdictional/jurisdictional), a crowd-sourced civic data platform.
Anyone can contribute by submitting JSON files that describe government entities.

## Directory Structure

```
jurisdictions/   # Geographic/political boundaries (states, counties, cities)
agencies/        # Government departments and organizations
bodies/          # Governing bodies (councils, boards, commissions)
positions/       # Roles linking people to agencies and bodies
people/          # Public officials and government employees
services/        # Public services provided by agencies
```

## Contributing

We welcome contributions from anyone.
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting data.

The short version:

1. Fork this repository
2. Add or update `.json` files in the appropriate directory
3. Validate your JSON against the schemas in `schemas/`
4. Open a pull request with a description of your data source

All contributions must come from public, verifiable sources.
Please include source attribution in your data files.

## Data Sources

Data in this repository comes from public sources including:

- [Census TIGER/Line](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) — Jurisdiction boundaries
- [data.gov](https://data.gov) — Federal open data
- [Dotgov Registry](https://github.com/cisagov/dotgov-data) — U.S. government domain names
- Community contributions

## Git LFS

JSON files in this repository are tracked with Git LFS.
Make sure you have [Git LFS installed](https://git-lfs.com/) before cloning:

```bash
git lfs install
git clone https://github.com/jurisdictional/jurisdictional-data.git
```

## License

This repository contains public data from U.S. government sources.
U.S. government works are in the public domain.
Community contributions are licensed under [CC0 1.0 Universal](LICENSE).
