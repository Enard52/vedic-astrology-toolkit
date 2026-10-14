# Data attribution

`cities.json` is derived from the [GeoNames](https://www.geonames.org/) gazetteer
(`cities15000`, `admin1CodesASCII` and `countryInfo` from
https://download.geonames.org/export/dump/), licensed under
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).

Changes made: kept places with at least 15,000 people plus every Indian place in
the file; kept the name, a short selection of Latin-script alternate names,
first-level division, country, coordinates rounded to 4 decimals, IANA time zone
and population rounded to thousands; re-encoded as compact JSON. Rebuild with
`python -I web/scripts/build_cities.py` from the repository root.

The data is provided by GeoNames "as is", without warranty. Coordinates and time
zones are those of a city's reference point; check them for births far from it.
