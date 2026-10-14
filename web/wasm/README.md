# Swiss Ephemeris for the browser

`swisseph.wasm` and `swisseph.mjs` are Swiss Ephemeris 2.10.03 compiled to WebAssembly (Moshier mode, no data files). The C sources come from the pyswisseph 2.10.3.2 source distribution, the same library the Python toolkit uses, so both engines share one code base. The tests reproduce the Python planet longitudes to 9 decimal places.

Rebuild (needs Docker), from this folder:

```bash
docker run --rm -v "$PWD:/src" -w /src emscripten/emsdk:6.0.12 sh build.sh
```

`SHA256SUMS` and `EMCC_VERSION` record the committed build. Swiss Ephemeris is © Astrodienst AG and is used under the GNU AGPL, so this web app is AGPL-3.0-or-later as well.
