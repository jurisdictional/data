# Jurisdictional data: Solano County sample

Every government responsible for an address in Solano County, California, with its agencies, governing bodies, seats and current officeholders.
It is exported from [jurisdictional.org](https://jurisdictional.org) by `mix data.export.stack --within county:06095 --ndjson`.

## Files

Each file holds one entity type, one JSON record per line, sorted by `id`.

| File | Records |
|---|---|
| `jurisdictions.ndjson` | the county and the cities, census-designated places and school districts inside it |
| `agencies.ndjson` | departments and offices of each jurisdiction |
| `bodies.ndjson` | councils, boards and commissions |
| `positions.ndjson` | seats on each body, with the current holder and the page that shows them |
| `people.ndjson` | the people who hold those seats |
| `meetings.ndjson` | meetings of each body |
| `manifest.json` | counts per file, the layers exported, the license and the source |

There is no geometry: boundaries come from Census TIGER, joined by the GEOID in each jurisdiction's id.

## Ids

- A jurisdiction is `<level>:<geoid>`, such as `place:0681554` (Vacaville).
- A body, agency or seat adds a slug under its owner: `place:0681554/city-council`, `place:0681554/city-council/mayor`.
- A body's slug names its kind; its full name is in `name`.
- Seats that share a label on one body (at-large members) are numbered: `council-member-1`, `council-member-2`.
- A person is `ocd-person/<uuid>`.
- Ids are assigned once and stay the same when a name changes.
- Every record lists its jurisdictional.org id, and any public ids (Census GEOID, OCD-ID), in `identifiers`.

## Get more

Need another county or state, or a different format such as CSV or Open Referral HSDS?
Write to [support@jurisdictional.org](mailto:support@jurisdictional.org?subject=Get%20the%20data) with who you are, what you're building, which area and which format.

## License

The database is open under the [Open Database License (ODbL) 1.0](LICENSE), and the contents of each record under the [Database Contents License (DbCL) 1.0](https://opendatacommons.org/licenses/dbcl/1-0/).
Use it for anything, commercial use included, with credit and share-alike.
Credit: "Contains information from Jurisdictional (https://jurisdictional.org), made available under the ODbL 1.0."
A commercial license waives share-alike and attribution for closed products, and newsrooms, nonprofits and governments can apply for one at no cost: see https://jurisdictional.org/license.
U.S. government works are in the public domain, and facts from upstream sources keep their own terms.
