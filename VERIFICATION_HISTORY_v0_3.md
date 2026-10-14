# Historical verification record — 0.3.0

Preserved without numerical revision. Implementation scope and test counts below describe 13 October 2026, not the current release. Read RESEARCH_CLOSEOUT.md and the current verification report for 0.4.0 changes.

# Vedic calculation toolkit — verification and resolution report

**Version 0.3.0: 196 tests passed, zero failures, zero errors. Separate independent astronomy benchmark: 67/67 comparisons passed.** Prepared 13 October 2026.

The identified arithmetic errors have been corrected. Primary texts resolve several former uncertainties; genuine differences between traditions are exposed as named options. This does **not** mean all interpretation is settled, every rule has an independent fixture, or predictive accuracy has been demonstrated. The four-item completion audit and current resolution ledger follow the verification results below.

## Source and reproducibility

Main source: P. V. R. Narasimha Rao, *Vedic Astrology: An Integrated Approach*, supplied 442-page PDF; first published 2001 / reprint 2004. PDF SHA-256: `94a9c79b77c9396c337274a45a2e3e8fd90566c4242a23cf040ccb3a8888ecfb`.

Page references to this book are PDF pages. Text was extracted from all pages; relevant calculation tables, disputed passages and selected charts were also inspected visually. This is not independent verification of every case history or image-only chart. The original PDF is not duplicated in the scripts package.

Runtime: Python 3.12.14, PySwissEph 2.10.3.2 / Swiss Ephemeris 2.10.03, default Moshier, Lahiri and mean nodes. Calculations use the book's Example 118, not the user's personal birth data.

```bash
python -m pip install -r requirements.txt
python verify.py
```

`verification_results.json` records test IDs and outcomes. `verification_metrics.json`, `extension_metrics.json`, `strength_audit_results.json` and `independent_astronomy_results.json` contain numerical results. `file_manifest.json` records file hashes. The README explains each command and optional benchmark setup.

## Verification results

| Test group | Tests | What is checked |
|---|---:|---|
| Book arithmetic | 61 | Worked divisions, upagrahas, lagnas, panchanga, arudhas, karakas, aspects, avasthas and boundaries |
| Ashtakavarga | 6 | Chart 6 arrays, totals, reductions, pindas and kakshyas |
| Natal dashas | 17 | Balances, sequences, subdivision and date/interval arithmetic |
| Original Tajaka | 9 | Harsha/Uchcha, sahams, annual periods and aspect direction |
| Astronomy/time | 13 | Solar example, analytical Sun check, time zones, sunrise, polar handling and transitions |
| Added strengths | 16 | Raman component fixtures, degree zones, combustion, war transfer, Vimsopaka and explicit missing-input handling |
| Source resolutions | 10 | Corrected groups/caps/reductions, explicit alternatives, year-lord example, stations and equal-speed edge case |
| Added yoga conditions | 10 | Selected corrected definitions, unknowns, ties, overlap, Nakta variants and future-orb visibility |
| Calendar/evidence | 8 | 1999 intercalary-month example, electional entries, event ranking and forecast evaluation integrity |
| Integration | 6 | CLI outputs, schema/coverage, bad-input rejection and all five new workflows |
| Completion work | 40 | Moola source durations, yoga interactions, electional timing, strength audit and new CLI paths |
| **Total** | **196** | **All passed** |

These are test methods, many with multiple assertions. They are not 196 independent predictive validations. Some are invariants or software integration checks. The 170 yoga conditions and sixteen Tajaka names are coverage counts, not independent validation counts.

### Independent astronomical comparison

Reference implementation: **Skyfield 1.55 with JPL DE440s**, compared with Swiss/Moshier. Reference kernel SHA-256: `c1c7feeab882263fc493a9d5a5b2ddd71b54826cdf65d8d17a76126b260a49f2`.

| Quantity | Comparisons | Largest absolute difference | Acceptance tolerance |
|---|---:|---:|---:|
| Seven classical body longitudes | 35 | 1.20154 arcseconds | Moon 30; others 10 arcseconds |
| Ascendant | 20 | 0.001256 arcseconds | 2 arcseconds |
| Geometric sunrise | 12 | 0.004748 seconds | 5 seconds |
| **Total** | **67** | **All within tolerance** | |

Body positions span five dates in 1900, 1967, 2000, 2020 and 2026. Ascendants cover Jodhpur, London, Sydney and Quito on the five dates; sunrise uses three dates at those four locations. Longitudes are tropical, apparent, geocentric and referred to the ecliptic/equinox of date. Both sides receive the same UT1; their own TT-minus-UT1 models are retained. Mars/Jupiter/Saturn use JPL system barycentres.

Sunrise compares the **solar centre at a geometric horizon with refraction disabled**. It does not validate the real atmosphere, terrain, upper-limb sunrise defaults, or a fraction-of-a-second birth time. Ascendant agreement checks geometry, not the correctness of a particular ayanamsa. These finite fixtures do not establish accuracy at every location or historical epoch, nor do they validate Shadbala scores or astrology's life-event claims.

Benchmark sources: [JPL planetary ephemerides](https://ssd.jpl.nasa.gov/planets/eph_export.html), [Skyfield coordinates](https://rhodesmill.org/skyfield/coordinates.html), [Swiss programming manual](https://www.astro.com/swisseph/swephprg.htm). Run `benchmark_astronomy.py` with the optional dependencies/kernel as described in the README.

### Source-example comparisons

| Fixture | Result |
|---|---|
| Example 118 annual return | 8 March 2000, 04:41:11.969815 UTC+05:30, about 9.030 seconds earlier than printed 04:41:21 |
| Example 118 natal Sun | 22.453 arcseconds below the printed value under declared modern settings |
| Solar-return root residual | About 1.43 × 10⁻⁹ degrees; numerical convergence, not physical certainty |
| Example 120 | **Mars selected as year lord; Panchavargeeya 13.7303**, versus printed 13.7 |
| Chart 6 SAV and Mercury pinda | All twelve SAV values match; sum 337. Mercury Sodhya Pinda 152 matches. |
| Raman Saptavargaja | All seven printed component totals match exactly |
| Raman Drik | All seven agree within 0.02 virupa |
| Raman Cheshta | Five examples agree within 0.006 virupa |
| Raman Dig | Selected Sun/Saturn checks agree within 0.04/0.01 virupa |
| Calendar example, 1999 | May/June Jyeshtha identified as adhika then nija; first new moon within the fixture's 60-second tolerance |

Raman's source values have finite precision and some inconsistent totals. The program does not alter formulas simply to force every printed total to match. Automatic Shadbala's historical motion reconstruction remains an explicitly limited model, and its aggregate has now been compared with an independent implementation without establishing complete agreement; see the audit below.


---

## Requested work 1–4: completion audit

Version 0.3.0, 13 October 2026. **196 tests pass; 153 full-strength arithmetic/range checks pass.** The existing independent astronomy benchmark contains 67 passing comparisons. These counts refer to calculations and software behavior, not verified prediction accuracy.

| Requested work | Delivered | Status and limit |
|---|---|---|
| 1. Full planetary-strength verification | Reproducible six-component audit, printed-table arithmetic review, and unmodified PyJHora comparison | Audit complete. Full independent numerical agreement is **not established**. |
| 2. Yoga cancellation and qualification | Explicit source exceptions, functional nature, Raaja magnitude, selected participant evidence and Tajaka modifying rules | Implemented and tested within the documented D1/source scope. Overall interpretive weighting remains qualitative. |
| 3. Moola Dasa | Separately sourced Rath 1999 mahadasa calculation, both dignity profiles, sequence evidence and two cycles | Implemented; nine published durations reproduced. The source does not provide antardasa instructions. |
| 4. Electional/date-selection rules | Chapter 36 review of five limbs, tara, natal hora, topic charts, first dasha and compressed task periods | Calculable evidence implemented. Undefined eligibility conventions and qualitative judgments remain explicit review items. |

## 1. Strength audit

`audit_strengths.py --external` runs the toolkit and unmodified PyJHora 4.8.7 on three public/source inputs: Raman's 1918 example, Rao's Example 118, and its year-2000 return instant. It records 147 component/total comparisons. Both implementations use Swiss Ephemeris for astronomy, so this is independent strength code, not an independent astronomical ephemeris.

All **153** internal checks pass: component sums, six-part totals, virupa/rupa conversion, required-strength ratios, angular ranges, natural-strength sum and conservation of planetary-war transfers. These are consistency checks, not independent proof of every formula.

Only **4 of 21 full totals** agree within the diagnostic 0.05-virupa threshold. The external native output contains **nine Dig** and **four Cheshta** values above the formulas' 60-point maximum. Its already-existing circular Dig alternative agrees with ours in **21/21** comparisons within 0.01 virupa, but it is reported separately and never substituted into the external total. Other differences include temporal hora, declination/Ayana, historical motion and war conventions. No reference code was edited and no tolerance was expanded to declare all totals correct.

The Raman scan itself has inconsistencies on printed pages 89–90:

| Printed entry | Independent arithmetic finding |
|---|---|
| Sun total 424.24 | Displayed components add to 424.94. |
| Mars Kala 33.06 | Earlier value 30.06 restores the printed total 298.14. |
| Jupiter total 433.71 | Displayed components add to 433.77. |
| Saturn natural strength 8.37 | Formula is 60/7, about 8.57; this restores the displayed total 389.21. |
| Mercury 8.85 rupas | 537.02/60 is 8.950333…, not 8.85. |

These are reasoned corrections, not author-issued errata. Every original number and discrepancy remains in `strength_audit_results.json`. Full numerical equivalence needs a reliable comparison using matching conventions; this release does not claim that remaining condition is satisfied.

## 2. Yoga qualifications and interactions

`interpretation.py` adds Table 30 functional classifications for all twelve ascendants, phase-dependent Moon handling, Raaja degree closeness, afflictions, combustion, dignity, avasthas and ten-varga favorable counts. The PDF 125 Mercury/Venus example is tested at both wide and close separations. A wide association remains present but carries weakening evidence.

Seven named interaction summaries cover the Kemadruma angular exception, Sankhya subordination, the Gaja-Kesari lagna alternative, Vasumati full-result qualifications, and three Daridra relief/reversal cases. Lunar/navamsa/day-night guidance is also represented. The 170-rule structural catalog remains separate from selected participant qualification; not every branch of every rule has an independent fixture or a complete participant model.

Tajaka qualification now reports supporting and adverse configurations for each Ithasala pair. The specific Radda-to-Duttota example is implemented and tested. Manahoo's conjunction requirement is tested. Other simultaneous modifiers are retained for review, and failure to establish angular perfection is not overridden by a favorable label. Sources: Rao PDF 108–116, 122–126, 131–132, 152–154 and 352–355.

## 3. Moola Dasa

The uploaded book omits its computation, so the implementation uses [Sanjay Rath's 1999 article](https://srath.com/jyoti%E1%B9%A3a/dasa/mula-dasa/) as a separately named profile. It exposes the disagreement between the prose dignity adjustment and the worked table, rather than pretending both agree.

The table profile reproduces the published sequence durations: Jupiter 10, Moon 10, Mars 3, Saturn 14, Sun 1, Venus 12, Rahu 17, Ketu 3 and Mercury 13 years. The first cycle totals **83** and its complements total **37**. Source signs and the printed order validate this fixture; exact degrees were not supplied, so placeholder degrees are not presented as historical positions. Automatic degree ranking is tested separately with synthetic inputs.

The code retains ties, accepts a reviewed order, discloses ranking conventions, applies the stated zero/negative rules and rejects negative second-cycle complements. It emits mahadasas only. Date conversion is a declared project choice. Traditional illustrative narratives do not constitute evidence that the periods predict events.

## 4. Electional calculation and review

`election-review` supplements the existing sampled Table 79 search. It reports:

- Panchanga limbs and the source table's available eligibility checks.
- Personal tara classification and natal hora ownership/placement, including the source's house-entry warning pattern.
- Topic houses, lords, occupants, aspects and arudhas in D1 and the relevant D4/D9/D10/D16/D24 context.
- First-dasha evidence, including the D10 eighth-lord warning for job starts.
- Exact compressed interval partitions for tasks with a supplied duration. The first period is full: the source's 360-day example gives Sun 18 days regardless of the traversed fraction of its nakshatra.
- Wedding seventh-house evidence with the stated benefic/strong-yoga exception kept open for review.

The PDF does not specify complete per-task yoga/karana acceptance lists or a unique numerical definition of an overall strong election. Accordingly, these remain unknown unless the caller declares a reviewed convention or judgment. Such inputs are attributed to the caller. The program never silently treats missing decisions as favorable and never guarantees success. It reviews supplied instants; the separate search still samples instants rather than certifying continuous windows.

## Verification and use

The 40 new tests comprise 10 Moola, 11 natal qualification, 4 Tajaka interaction, 12 electional and 3 audit/CLI tests. The original 156 tests also pass, for **196 total**. The existing 67 astronomy comparisons remain applicable; this release did not change the coordinate engine. `verification_results.json` lists every test.

```bash
python -m pip install -r requirements.txt
python verify.py
python -m vedic_toolkit dasha examples/book_example_118.json --system moola --output moola.json
python -m vedic_toolkit election-review examples/book_example_118.json --task house_entry --duration-days 360 --output election_review.json
```

To reproduce the optional comparison, install `requirements-audit.txt` and run `python audit_strengths.py --external`. `generate_examples.py` regenerates the supplied outputs. The README, input guide and resolution ledger explain the remaining choices.

The remaining limits are specific: full Shadbala equivalence, unsupported source details such as Moola subperiods, qualitative interpretive judgments, and empirical forecast validation. None can honestly be converted into a verified conclusion merely by writing more arithmetic code.

---

## Resolution ledger — version 0.3.0

Prepared 13 October 2026. References to Rao's supplied book use **PDF page numbers**. This ledger documents the contradictions identified in this project; it is not an assertion that every sentence in 442 pages has been proved free of error. Corrections below are reasoned adjudications, not a published list of author-approved errata.

## Corrected arithmetic, labels and omissions

| Source location | Conflict | Resolution and reason |
|---|---|---|
| PDF 39 | Mars's degree-specific moolatrikona paragraph says Leo; its table says Aries | Aries, 0–12 degrees. Mars's own sign and the degree rule agree there. Fine degree zones now implemented. |
| PDF 41 | Mars is duplicated/misplaced in Jupiter's relationship row and omitted in Venus's neutral row | Mars is Jupiter's friend and Venus's neutral planet, following the stated relationship derivation. |
| PDF 47, Exercise 7 | Upaketu answer contradicts Sun minus 30 degrees | Sun 13°19′ Taurus gives Upaketu **13°19′ Aries**. |
| PDF 48, Example 7 | Bhava Lagna adds 766 minutes as degrees, despite 1 degree per four minutes | Add 191°30′. Corrected Bhava Lagna is **5°47′ Leo**. |
| PDF 56, Example 15 | D8 reasoning gives Libra, conclusion says Leo | Mercury is in **Libra**. |
| PDF 58, Example 23 | Tenth sign from Libra is called Leo | It is **Cancer**; use the printed portion and counting rule. |
| PDF 64, Example 27 | Jupiter 29°49′ Sagittarius is listed in Libra D3 | The third drekkana gives **Leo**. The favorable-varga counts are unchanged. |
| PDF 78, Table 14 | Lowest-degree karaka row repeats Venus | It is **Saturn**, whose input degree is 2°28′. |
| PDF 109 | Adhi definition requires benefics in 6/7/8 from Moon; Taurus-Moon illustration puts them in 4/5 | Implement the definition and flag the illustration as inconsistent. Do not invent replacement natal positions. |
| PDF 111 | Jupiter's Mahapurusha paragraph calls the yoga Ruchaka | The name is **Hamsa**; Ruchaka belongs to Mars. |
| PDF 131 | Pisces Dhana condition omits the planet required in the eleventh | Restore **Saturn**, confirmed by BPHS 41.8 [S5]. |
| PDF 191, Example 50 | Printed end date is a day earlier than its 360-day arithmetic | 2.24875 × 360 = 809.55 elapsed days; the stated starting instant gives **16 July 2002, 19:02**, not 15 July. |
| PDF 211–212 | Own-sign exception plus exaltation increment could give Mercury in Virgo 13 years and a negative second cycle | Use **12 years**. Rath's explicit Narayana maximum confirms the cap [S6]. |
| PDF 263, Table 45 | Uttara Bhadrapada omitted; Revati put in Savya-2 | **Uttara Bhadrapada: Savya-2; Revati: Savya-1**, confirmed by BPHS 46.56–65 [S3]. Formerly a reconstruction; now supported by another primary text, though not an author-issued erratum. |
| PDF 339–341 | Panchavargeeya table has no neutral column | Use the historically attested **constant twofold relationship** table for the default. A missing neutral score need not be an omission. Threefold/fivefold alternatives have separate profiles [S7]. |
| PDF 341 | Strength above 20 is described, although maximum terms sum to 80 then divide by four | The implemented maximum is **20**. No above-20 category is possible with these formulas. |
| PDF 349 | Bhavishya illustration calls same-sign Moon/Venus a sextile and mixes Leo/Libra labels | Compute geometry from actual input. The 7°45′ degree gap is valid; a sextile requires compatible different signs. Keep this a label/placement inconsistency, not a silently rewritten chart. |
| PDF 351–352 | Nakta/Yamaya introductions require an aspect; their examples have no direct aspect | Permit an intermediary when the original pair lacks direct application/separation. Preserve the further historical Nakta difference below. |
| PDF 352 | Pisces-to-Cancer Manahoo example is called a sextile | It is a **trine**. The Moon/Jupiter application and Saturn conjunction condition are still testable. |
| PDF 354 | Duhphali definition makes faster planet strong; example makes slower planet strong | Default to **slower strong, faster weak**, supported by Hayanaratna 3.12 [S8]. Literal reversed wording remains selectable. |

The original nine arithmetic fixtures remain in the suite. New fixtures also check the Kalachakra assignments, Narayana cap, missing Saturn, Hamsa name and the annual example's Mars strength/year lord.

## Genuine variants and explicit choices

A consistent program needs one declared procedure per result. Historical disagreement does not become a unique physical fact merely because one procedure is coded.

| Issue | Default and alternatives | Status |
|---|---|---|
| Ashtakavarga: equal occupied/empty pair | Empty value becomes zero, following BPHS 68 [S4]. Former v0.1 `unchanged` remains an explicit alternative. | Source-supported completion of an omitted case. |
| Ashtakavarga: empty value larger than occupied | PVR replaces it with the occupied value; the BPHS translation subtracts the occupied value. Example 5 and 2 becomes 2 versus 3. | Genuine formula difference; `pvr_2001` / `bphs_translation`. |
| Ashtakavarga node occupancy | Seven classical bodies by default; `include_nodes=True` selectable. | Not conclusively specified by the passages checked. |
| Nakta intermediary | Default PVR applies to both; historical translation-of-light separates from one and applies to the other [S9]. | Both profiles retained. |
| Durupha | Default requires both dusthana placement and impairment, as the definition states; the example only satisfies impairment. | `pvr_literal` / `pvr_example_impairment`; no fabricated universal settlement. |
| Lajjita | Interpret the listed malefics as alternatives. Requiring Rahu and Ketu together in one sign is geometrically impossible. | Operational reading recorded in output. |
| Mudita additional avastha | Literal conjunction of conditions by default; an any-condition reading is selectable. | Ambiguous conjunctions remain disclosed. |
| Shadbala components | Raman/Sripati scoring default; separate point-table and minimum-strength options. Sun minimum 390 by BPHS or 300 by Raman. | Traditions differ; changing only the point table is not a complete alternative Shadbala school. |
| Cheshta inputs | Raman chapter's Venus coefficient 0.001/year; table caption 0.0001/year available separately. | Historical text discrepancy, not empirically resolved by a modern longitude check. |
| Vimsopaka relationships | Temporary relationship evaluated in D1 by default; per-varga option available. | Declare the relationship frame. |
| “Strong”, “similar”, “deep” | D1 yoga strength uses Shadbala requirement; year-lord tie tolerance is zero unless supplied; deep exaltation exact unless an API tolerance is supplied. | Reproducible operational thresholds, not uniquely mandated meanings. |
| Kendradi/Sudasa/Drig subperiods | Strict mode rejects unspecified subdivisions; Narayana extension requires explicit opt-in. | No longer silently presented as a directly sourced rule. |

## Work completed beyond the disputed text

The package now calculates fine dignities and combustion, four Vimsopaka groups, all six Shadbala components with intermediate values, additional avasthas, 170 natal D1 rule conditions, all sixteen Tajaka structural configurations, annual lord selection, post-ingress conditions, aspect tracking, amanta calendar names and eight electional table screens. It also supplies event-based candidate ranking and prospective forecast scoring.

These additions have different levels of evidence. Seven Saptavargaja and seven Drik results reproduce Raman's printed component examples; five Cheshta results and selected Dig results agree within documented rounding tolerances. **The full automatic total has now been compared with unmodified PyJHora 4.8.7. Only 4/21 totals agree within 0.05 virupa; complete equivalence remains unestablished.** The audit identifies circular-angle defects in the reference and preserves other convention differences. See `COMPLETION_REPORT.md`. The 170-rule inventory describes coverage, not 170 separate source-chart validations.

## What remains unresolved or outside this release

| Item | What would be needed |
|---|---|
| Exhaustive yoga correctness and synthesis | Explicit source exceptions and qualifying evidence are implemented. Independent fixtures for every branch, universal relative weighting and higher-divisional reinterpretation are not supplied. Current catalog is D1. |
| Complete Shadbala equivalence | Audit completed; numerical agreement remains open. It needs an independent implementation with matching mean-motion, war, relationship, time-lord and strength conventions, free of the identified angular-wrap defects. |
| Exact birth-time rectification | Reliable dated personal events, uncertainty in the recorded time, predeclared rules and unseen checks. Current ranking is hypothesis fit, not certification. |
| Predictive accuracy | Prospectively recorded outcomes, defensible baselines, adequate sample sizes and independent evaluation. No such dataset was supplied. |
| Moola beyond the sourced scope | Rath 1999 mahadasas are now implemented. Antardasas and unspecified ranking refinements require additional source decisions; the article does not settle all Moola traditions. |
| Qualitative muhurta and other applications | Chapter 36 calculations and evidence are implemented. Final suitability and unspecified per-task yoga/karana lists require declared judgments. Regional calendars, mundane interpretation, remedies and automated longevity judgments are outside this release. |
| Unspecified textual choices | Node occupancy, some avastha wording and alternative historical doctrines remain choices, not newly discovered facts. |

## Mathematical, astronomical and historical interpretation

The mathematical audit checks units, boundaries, circular angles, interval partitions and contradictions. Astronomy independently checks apparent positions and horizon geometry. Historical comparison identifies which texts define which scoring systems. These are complementary tasks with different standards of evidence.

Geocentric coordinates are a legitimate way of describing the sky; their use does not imply that the Sun physically orbits Earth. Rahu/Ketu are opposite lunar orbital nodes, not additional physical planets. Precession and a chosen sidereal origin affect coordinate labels. Ayanamsa choice and traditional dignity scores are not gravitational forces. Consequently, accurate astronomy cannot by itself decide between symbolic rules or validate a forecast about a person's life.

## Supporting primary sources

The uploaded Rao PDF is the main source. The following texts fill omissions or compare traditions; online editions/translations are witnesses, not proof of a uniquely correct recension.

- **S1:** [BPHS chapter 7](https://jyotishvidya.com/ch7.htm), divisional weights and Vimsopaka.
- **S2:** [BPHS chapter 27](https://jyotishvidya.com/ch27.htm), strength components and requirements.
- **S3:** [BPHS chapter 46](https://jyotishvidya.com/ch46.htm), verses 56–65, Kalachakra groups.
- **S4:** [BPHS chapter 68](https://jyotishvidya.com/ch68.htm), Ekadhipatya reductions.
- **S5:** [BPHS chapter 41](https://jyotishvidya.com/ch41.htm), verse 8, Pisces wealth combination.
- **S6:** Sanjay Rath, *Narayana Dasa* (2004), p. 39.
- **S7:** Balabhadra, *Hayanaratna*, Martin Gansten's 2020 translation, [2.4 friendship](https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500895.html) and [2.5 five dignities](https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500896.html).
- **S8:** Same translation, [3.12 Duhphali](https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500914.html).
- **S9:** Same translation, [3.5 Nakta](https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500907.html) and [3.16 Durupha](https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500918.html).
- **S10:** B. V. Raman, *Graha and Bhava Balas*, 13th edition (1992), originally 1940. Chapters III–VIII supply strength fixtures; disputed numbers were checked against scan pages.
- **S11:** [Swiss Ephemeris programming manual](https://www.astro.com/swisseph/swephprg.htm), [Skyfield coordinate documentation](https://rhodesmill.org/skyfield/coordinates.html), and [JPL planetary ephemerides](https://ssd.jpl.nasa.gov/planets/eph_export.html).


## New adjudications in 0.3.0

| Source | Issue | Treatment |
|---|---|---|
| Raman, printed pp89–90 | Five arithmetic/display discrepancies in the final tables | Preserve original numbers in `audit_strengths.py`; independently recompute sums. Do not tune formulas to erroneous totals. |
| PyJHora 4.8.7 | Native Dig and Cheshta can exceed 60 through unwrapped arithmetic | Keep unmodified comparison results. Report its already-existing circular Dig alternative separately; do not substitute it into its total. |
| Rath 1999 [S12] | Dignity rider in prose and worked table have opposite effects | Default `rath_1999_table` reproduces all nine worked durations; alternate prose profile explicitly selectable. |
| Rath 1999 [S12] | One sentence starts Moon; the worked sequence starts Jupiter | Follow the worked sequence and preceding strength explanation. No historical truth claim about the illustrative chart. |
| PDF 125–126 | Strong amsa count conflicts with weak/wide/afflicted association | Show both. An individual favorable factor never automatically overrides all adverse ones. |
| PDF 354 | Radda can be modified by Duttota | Implement the explicit example; unrelated simultaneous modifiers remain for review. |
| PDF 410–411, 421 | Compressed task dasha may be confused with a natal balance | Full first MD when compressed; lunar remainder only in the ordinary uncompressed calculation. |
| PDF 315–316, 418 | “Good tara” versus “not bad” includes different treatment of Janma | Return both classifications. Comprehensive favorable screen uses the stricter `good` value. |
| PDF 418–422 | Qualitative suitability and incomplete eligibility lists | Report unknowns with the calculated evidence; allow explicitly attributed caller judgments. |

- **S12:** Sanjay Rath, [Mūla Daśā, 1999 article](https://srath.com/jyoti%E1%B9%A3a/dasa/mula-dasa/). Separately sourced timing profile.
- **S13:** [PyJHora source](https://github.com/naturalstupid/PyJHora/blob/main/src/jhora/horoscope/chart/strength.py); installed version 4.8.7 and source hash recorded in `strength_audit_results.json`. This is a comparison target, not an infallible standard.
