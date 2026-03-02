# Contributing to Jurisdictional Data

Thank you for contributing to an open ontology of U.S. government.
This guide explains how to submit data to this repository.

## Quick Start

1. Fork this repository
2. Clone your fork (make sure Git LFS is installed)
3. Add or update `.json` files in the appropriate directory
4. Validate your JSON against the schemas in `schemas/`
5. Commit and push your changes
6. Open a pull request

## Where to Put Files

### Jurisdictions

Jurisdictions are organized by Census geographic level.
Place your file in the subdirectory matching its level:

```
jurisdictions/federal/united-states.json
jurisdictions/states/california.json
jurisdictions/counties/los-angeles-county-ca.json
jurisdictions/places/los-angeles-ca.json
jurisdictions/school-districts/lausd-ca.json
jurisdictions/tribal/navajo-nation.json
```

Include the state abbreviation in county and place filenames to avoid collisions (e.g., `springfield-il.json` vs `springfield-mo.json`).

### Other Entities

```
agencies/us-department-of-education.json
services/federal-student-aid.json
bodies/los-angeles-city-council.json
people/jane-doe.json
positions/mayor-of-los-angeles.json
domains/ed.gov.json
```

### Naming Convention

- Lowercase, hyphen-separated
- Descriptive enough to identify the entity at a glance
- Include state abbreviation for sub-state entities to avoid name collisions

## JSON Format

Every data file must include a `_meta` object with source attribution:

```json
{
  "_meta": {
    "source": "https://example.gov/data",
    "retrieved_at": "2026-03-02",
    "contributor": "your-github-username"
  },
  "name": "Example Agency",
  "...": "..."
}
```

See the `schemas/` directory for the full JSON Schema for each entity type.

## Data Quality Guidelines

- **Public sources only** — All data must come from publicly available, verifiable sources.
- **Include attribution** — Always include the `_meta.source` field linking to the original data.
- **One entity per file** — Each JSON file describes a single entity in the ontology.
- **Use existing fields** — Follow the schemas.
  If you think a new field is needed, open an issue first.
- **UTF-8 encoding** — All files must be valid UTF-8.
- **Pretty-printed JSON** — Use 2-space indentation for readability.

## What to Contribute

We especially welcome:

- State and local government agencies not yet in the dataset
- Contact information for government offices
- Public services offered by agencies
- Elected officials and appointed positions
- Governing bodies (city councils, school boards, commissions)
- Corrections to existing data (with a source)

## Pull Request Process

1. Describe what data you are adding or changing
2. Link to the public source of the data
3. One PR per data source or logical set of changes is preferred
4. A maintainer will review and merge your contribution

## Code of Conduct

Be respectful and constructive.
This is a nonpartisan project focused on accurate, factual civic data.
