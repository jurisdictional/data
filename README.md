# jurisdictional/data

Open data about who governs each place in the United States, exported from [jurisdictional.org](https://jurisdictional.org).
Every file is one entity, as pretty-printed JSON with sorted keys.
The same source data always produces byte-identical files, so every diff is a real change.

## Layout

| Folder | One file per | `id` |
|---|---|---|
| `jurisdictions/<level>/<geoid>.json` | government or district | `<level>:<geoid>` (Census GEOID) |
| `bodies/<level>/<geoid>/<slug>.json` | council, board or commission | `<jurisdiction id>/<slug>` |
| `positions/<level>/<geoid>/<body>/<slug>.json` | seat, with its current holder | `<body id>/<slug>` |
| `people/<uuid>.json` | office holder | `ocd-person/<uuid>` |
| `agencies/<level>/<geoid>/<slug>.json` | department or office | `<jurisdiction id>/<slug>` |
| `meetings/<level>/<geoid>/<body>/<slug>.json` | meeting | `<body id>/<slug>` |
| `stacks/<address>.json` | address | the ids of every layer that governs it |

References between files use these ids.
Other identifiers (`ocd_id`, `census_geoid`, `jurisdictional`) are listed in each file's `identifiers`.
Ids are frozen: an entity keeps its id and path when its name changes.

There is no geometry.
Boundaries can be joined from Census TIGER by GEOID.

## Producing it

```bash
# in the jurisdictional app
mix data.export.stack --address "300 Hemlock St, Vacaville, CA 95688" --out ../jurisdictional-data-v2 --commit
```

The export reads only the public jurisdictional.org API and commits each layer separately.

## License

CC0 1.0.
