# Jurisdictional Data

An open ontology of U.S. government — structured as JSON, versioned with Git.

## What This Is

Government is made of objects: jurisdictions contain agencies, agencies employ people, people hold positions, agencies provide services.
This repository models that structure as a domain-driven ontology of public civic data.

Each JSON file represents a single entity.
The directory structure reflects the natural hierarchy of government.
Anyone can contribute.
Any application can consume it.

## Directory Structure

```
jurisdictions/             # Geographic/political boundaries
  federal/                 #   The United States
  states/                  #   50 states + DC + territories
  counties/                #   ~3,200 counties and equivalents
  places/                  #   Cities, towns, villages, boroughs, CDPs
  school-districts/        #   Administrative school districts
  tribal/                  #   Tribal jurisdictions
agencies/                  # Government departments and organizations
bodies/                    # Governing bodies (councils, boards, commissions)
positions/                 # Roles linking people to agencies and bodies
people/                    # Public officials and government employees
services/                  # Public services provided by agencies
domains/                   # Government web domains (from dotgov registry)
schemas/                   # JSON Schema definitions for each entity type
```

Jurisdictions are organized by [Census geographic level](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html), using Census GEOIDs as the canonical identifiers.

## The Ontology

Government entities relate to each other in a clear hierarchy:

```
Jurisdiction (geographic boundary)
  └── Agency (department, bureau, office)
        ├── Service (permits, licenses, benefits)
        ├── Body (council, board, commission)
        │     └── Position (member seat)
        ├── Position (staff role)
        └── Domain (website)

Person ──holds──▶ Position
```

Each entity type has a [JSON Schema](schemas/) defining its fields and relationships.
Cross-references between entities use filenames (without `.json` extension).

## Use Cases

This data is designed to be consumed by any application that needs structured civic data:

- Civic tech platforms
- Government directories
- Open data portals
- Research and analysis
- AI and LLM grounding

Clone the repo, read the JSON, build on it.

## Contributing

We welcome contributions from anyone.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

The short version:

1. Fork this repository
2. Add or update `.json` files in the appropriate directory
3. Validate your JSON against the schemas in `schemas/`
4. Open a pull request with a description of your data source

All contributions must come from public, verifiable sources.
Every file includes a `_meta` object attributing the source.

## Data Sources

- [Census TIGER/Line](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) — Jurisdiction boundaries and GEOIDs
- [Dotgov Registry](https://github.com/cisagov/dotgov-data) — U.S. government domain names
- [data.gov](https://data.gov) — Federal open data
- Community contributions

## Git LFS

JSON files are tracked with [Git LFS](https://git-lfs.com/).
Install it before cloning:

```bash
git lfs install
git clone https://github.com/jurisdictional/jurisdictional-data.git
```

## License

U.S. government works are in the public domain.
Community contributions are licensed under [CC0 1.0 Universal](LICENSE).
