# Resolution ledger — version 0.4.0

Updated 14 October 2026. Earlier release findings are preserved below; the final section records 0.4.0 changes and supersedes older implementation-scope statements. See `RESEARCH_CLOSEOUT.md` for the current status and remaining evidence dependencies.

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

## New adjudications in 0.4.0

| Source or question | Finding | Treatment and remaining limit |
|---|---|---|
| PyJHora 4.8.7 total mismatch | All 21 differences decomposed; 189 Kala and 105 Sthana terms compared | Accounting closes within 0.011 virupa. Native agreement remains 4/21 at the original 0.05 threshold. This is explanation, not full independent validation. |
| Reference Ayana | Hemisphere is tested before reducing longitude plus ayanamsa modulo 360; four inputs have the wrong hemisphere | Record exact inputs. Smaller differences also reflect interpolation, not a comparison with actual physical declination. |
| Reference timing/nature/war | Different horas, Moon classification and war eligibility contribute materially | Preserve named conventions and native output. No fitting of scores to a desired total. |
| PDF 34–35 | Mercury follows the majority of conjoined benefics/malefics | Correct yoga default; nonzero ties remain unknown. Strength scoring retains its separately disclosed convention. |
| PDF 112, 122 | Weakening/full-result qualifiers had been mixed with base presence | Separate Maalaa, Sarpa and Vasumati qualification fields. |
| PDF 127, 129 | Aspect is not conjunction; unresolved AK is not False | Correct advanced Raaja 2–3 and sambandha 15. |
| Five yoga entries | Selected premises make Gola, advanced Raaja 7/13/17 and Kulavardhana inoperative | Finite proofs and chart notices document the conflict. Intended textual alternatives remain unadjudicated. |
| All 170 yoga entries | 590 deterministic cases; 165 have positive/negative witnesses; five conflicts proven | 313/316 reported condition fields have both Boolean witnesses. This is execution coverage, not every internal branch or independent rule validation. |
| Moola AD specification [S12–S14] | Complete Rath/Rao instructions not located in checked sources; installed software supplies a definite subdivision | Add explicit experimental first-cycle-weight hybrid. Keep strict default; do not claim full PyJHora/JHora equivalence. |
| Simultaneous interpretations | No universal sourced numerical weighting identified | Preserve conflicts; allow sourced, acyclic overrides and pending states. No invented probability. |
| Empirical prediction | No suitable real blinded cohort assembled | Deliver scorer and proposed protocol; no accuracy result or preregistration claim. |
| Book originality | Existing books/software cover substantial parts | Document overlap; do not claim first-ever integration or universal superiority. |

- **S14:** Rao's [Volume II class notes](https://www.vedicastrologer.org/classes/book2-for-CD.pdf), Lesson 47, and [Jagannatha Hora features](https://www.vedicastrologer.org/jh/features.htm). Checked for Moola specification; not a complete subperiod algorithm.
- **S15:** [OSF registration guidance](https://help.osf.io/article/330-welcome-to-registrations). Supports a proposed external registration workflow; no registration was made.
- **S16:** [NASA lunar orbit](https://svs.gsfc.nasa.gov/5326/) and [ESO precession](https://www.eso.org/public/videos/cs0004e/). Astronomical geometry does not adjudicate traditional life-event interpretations.

`RESEARCH_SOURCES.json` records access limits and installed source hashes. `RESEARCH_CLOSEOUT.md` is the current completion statement. Four evidence dependencies remain: a matching independent full-strength benchmark, textual adjudication and independent rule fixtures, authoritative Moola subperiod instructions, and a real prospective/blinded prediction study with replication. They are not silently marked resolved.
