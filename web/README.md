# Jyotish Daily

**Live app: [https://chethandvg.github.io/vedic-astrology-toolkit/](https://chethandvg.github.io/vedic-astrology-toolkit/)**

A private Vedic astrology web app: your birth chart and Vimsottari dashas, plus daily, weekly,
monthly and yearly guidance from classical rules (Tara bala, Chandra bala, Chandrashtama, gochara
with vedha and ashtakavarga, Sade Sati, Muntha, panchanga cautions), with sunrise-based timings
(Rahu Kalam, choghadiya, horas) for wherever you are today. Every result shows its reasons and
their classical sources, in plain, original wording.

The app is a static site (GitHub Pages) and works offline once it has loaded. It is the browser
companion of the Python toolkit in the repository root, which follows P. V. R. Narasimha Rao's
*Vedic Astrology: An Integrated Approach*.

> Traditional Jyotish indications computed from classical rules. They are not validated
> predictions and are not medical, legal or financial advice.

## Privacy

- Everything is computed on your device, in a Web Worker. Birth details, profiles and settings
  are kept only in this browser's `localStorage`; there is no server, account, analytics or
  tracking. The only requests the app makes are for its own files.
- The city search runs over a table bundled with the app (`public/data/cities.json`), so typed
  place names never leave the device.
- After the first visit a service worker keeps the app, the engine and the city table cached,
  so it also works offline.
- "Export for astrologers" writes the birth file of the Python toolkit to your downloads; nothing
  is uploaded.

## Running it

Needs Node 24 and npm. From this folder:

```bash
npm ci                         # install exactly the locked dependencies
npm run dev                    # development server: http://localhost:5173/vedic-astrology-toolkit/
npm test                       # unit and parity tests (Vitest, Node)
npm run typecheck              # TypeScript, strict
npx playwright install chromium   # once, for the end-to-end tests
npm run e2e                    # Playwright: phone and desktop on the dev server, then the production build
npm run build                  # type-check and build into dist/ (with the service worker)
npm run preview                # serve dist/ locally
```

`npm run e2e` starts two servers itself: the dev server (port 5180) for the phone and desktop
projects, and `vite build` + `vite preview` (port 5195) for `e2e/preview/`, which checks offline
use and the time budgets (Today under 1.5 s from a cold start, a year under 3 s; the tests fail at
twice that). Run only those with `npx playwright test --project=preview --no-deps`. A server
already running on either port is reused, so stop a stale preview before testing a new build.

Other scripts: `npm run fixtures` regenerates the golden fixtures from the Python toolkit
(`python web/scripts/compare_fixtures.py` from the repository root checks them), and
`npm run cities` rebuilds the city table from GeoNames.

## Architecture

```
UI (React, main thread)                     Engine (Web Worker)
src/pages, src/ui  ── src/ui/forecast/data.ts ── src/lib/engine.ts ══ Comlink ══ src/worker/engine.worker.ts
  hooks keyed by birth + settings + place        shared worker, result cache,        src/engine/api.ts
                                                 restart on a crash                  └ predict, extras, chart, dasha,
                                                                                       muhurta, events ... → swe.ts
                                                                                         └ wasm/swisseph.wasm
```

- **Swiss Ephemeris in WebAssembly.** `wasm/` holds Swiss Ephemeris 2.10.03 compiled with
  Emscripten (Moshier mode, no data files), built from the same C sources as the pyswisseph the
  Python toolkit uses; see `wasm/README.md` to rebuild it.
- **Engine** (`src/engine/`, pure TypeScript, no DOM): time and sunrise, chart casting with the
  vargas, Vimsottari dashas, transit events, Saturn phases, ashtakavarga, muhurta timings, the
  Moon's daily factors, gochara and the forecasts (`predict.ts`). Interpretation texts live in
  `src/content/`. `src/engine/types.ts` is the contract between engine and UI.
- **Worker API** (`src/engine/api.ts`): `chart(birth, settings)`, `dayTimings(date, lat, lon,
  zone)` and `forecast(birth, settings, place, horizon, anchor)`, which returns the forecast and
  the extras the day and year screens draw. Forecast contexts are memoised on birth, settings and
  place, so the chart is cast once and every computed day is reused by the week, month and year.
- **Main thread** (`src/lib/engine.ts`): one shared worker, started while the profile form is
  filled in; results cached by request so returning to a view is instant; the week, month and
  chart are prepared in the background once a day is shown. A worker that crashes, aborts or stops
  answering is replaced on the next request; a failed start offers "Try again".
- **Parity with the Python toolkit.** `tests/fixtures/*.json` are generated from the toolkit
  (`scripts/gen_fixtures.py`) and the unit tests check positions, vargas, panchanga, sunrise,
  dashas, ashtakavarga, Tara bala and time conversion against them; CI also regenerates them to
  make sure they still match.
- **Routing and storage.** Hash routes (`#/p/<id>/today`) so the static host needs no rewrites;
  the date shown is kept in `?date=`. Settings (preset, ayanamsa, nodes, dasha year) apply to every
  profile and recompute everything; "Popular software" uses solar-year dashas, "Book" Rao's
  360-day years.

## Licences

- The app is free software under the **GNU Affero General Public License, version 3 or later**
  (AGPL-3.0-or-later); see `LICENSE.txt` in the repository root.
- **Swiss Ephemeris** is © Astrodienst AG and is used under the GNU AGPL (its dual-licence
  option), which is why this app is AGPL as well.
- **City data** in `public/data/cities.json` is derived from [GeoNames](https://www.geonames.org/)
  and licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/);
  the changes made are listed in `public/data/ATTRIBUTION.md`.
- The fonts (Inter, Fraunces, via Fontsource) are under the SIL Open Font License 1.1.
