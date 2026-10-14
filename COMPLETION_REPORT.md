# Completion report — requested items 1–4

**Historical release record: version 0.3.0.** The counts and scope below describe the previous release. For the current 0.4.0 research, 225-test result, five yoga profile conflicts, strength reconciliation and experimental Moola subdivisions, read `RESEARCH_CLOSEOUT.md`. The original record is retained to make changes traceable.

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
