# Remaining research — completed investigation and explicit limits

14 October 2026 · Toolkit 0.4.0 · Main source: the supplied 442-page Rao PDF.

The requested investigation, software corrections, diagnostic audits and documentation are complete for this release. This does **not** mean that all classical texts agree, every interpretation is uniquely determined, or forecasts have been validated. Unresolved textual choices are now identified precisely instead of being treated as missing arithmetic.

## Results

| Workstream | Completed now | What the evidence establishes |
|---|---|---|
| Full Shadbala discrepancies | Decomposed all 21 native total differences; compared 189 Kala and 105 Sthana subcomponents; traced circular-angle, hemisphere, interpolation, hora, nature and war differences | The disagreements are explainable. Full independent numerical equivalence remains unestablished. |
| Yoga audit | Exercised all 170 entries across 590 deterministic cases: 100,300 rule evaluations; both met/not-met observed for 165 entries; five remaining entries have demonstrated profile incompatibilities | Broad reproducible execution coverage, plus eight partial source-placement illustrations. This is not 170 independent validations. |
| Source corrections | Corrected majority-based Mercury classification, weakening-versus-cancellation, aspect-only requirements and unknown-karaka propagation | Code more closely represents the cited passages; undefined ties stay explicit. |
| Moola subperiod investigation | Checked Rath's article, Rao's class notes/software description and installed PyJHora 4.8.7; added an opt-in software-derived subdivision convention | Usable experimental interval arithmetic with separate provenance. A complete authoritative Rath/Rao subperiod specification was not located in the checked sources. |
| Interpretation policy | Added a sourced override graph, pending-state handling, conflict retention and a review row for every yoga | Consistent review behavior without arbitrary probability or majority voting. |
| Prediction evaluation | Added person-separated holdout evaluation, a training-only baseline, clustered bootstrap interval and sample-size planning; wrote a study protocol | The scoring infrastructure is ready. No real predictive performance estimate has been produced. |
| Book research | Documented overlapping books and software/corpus projects | An integrated contribution is plausible; a “first ever” or “best book” claim is not established. |

## 1. Strength reconciliation

`strength_audit_results.json` retains the unchanged PyJHora 4.8.7 comparison: only 4/21 native totals agree within the original diagnostic 0.05-virupa threshold. Its existing circular Dig routine agrees with the toolkit in 21/21 comparisons within 0.01 virupa. The reference was not edited.

`reconcile_strengths.py` now exposes the individual terms that contribute to every difference. All 21 decompositions close within 0.011 virupa, allowing for the reference's displayed rounding. This is accounting for disagreement, not a correctness tolerance for full Shadbala.

| Cause | Finding and decision |
|---|---|
| Dig | Native reference uses an unwrapped absolute longitude subtraction. Retain shortest-arc geometry and report the native failure. |
| Cheshta | A linear mean of longitudes can select the wrong midpoint across Aries; an unwrapped final difference can exceed the permitted range. The diagnostic applies our circular formula to the reference's own historical inputs, explicitly labeled as our diagnostic. |
| Ayana | The reference tests hemisphere before normalizing longitude plus ayanamsa. Four planetary inputs across the 1967/2000 cases exceed 360°, giving the wrong hemisphere. Smaller residuals also arise from inverse-Lagrange versus piecewise-linear interpolation. Both are traditional approximations, not actual physical declination. |
| Hora | Temporal day/night horas in this profile differ from the reference's elapsed civil-hour calculation. In the 2000 example this reallocates 60 points between Sun and Mars. |
| Paksha/nature | The Raman tithi-based Moon classification differs from the reference's waxing/waning classification. This accounts for a large Moon Paksha difference. Native unwrapped elongation also presents a formula risk, although these three samples show no Paksha range violation. |
| Planetary war | The reference's closest-pair selection lacks the profile's <1° eligibility test. In the 2000 example it assigns a Jupiter/Saturn transfer where our eligibility test does not. |
| Historical motion, rounding and Sthana | Input rates, epoch handling, degree zones and displayed rounding remain visible; no total is fitted to the book or the other engine. |

Primary numerical material remains Raman's *Graha and Bhava Balas*, including the printed inconsistencies retained in the earlier report. These findings concern the pinned reference package, not every release of PyJHora or Jagannatha Hora. Both strength engines share Swiss Ephemeris, so their comparison is independent implementation evidence for strengths, not an independent ephemeris.

## 2. Corrections to yoga handling

All page numbers below refer to the supplied PDF, not the printed page numbering.

| Passage | Correction |
|---|---|
| PDF 34–35 | For the yoga catalog, Mercury follows the majority of conjoined natural benefics/malefics. Equal nonzero counts remain unknown; both classifications are evaluated. The legacy any-malefic rule remains explicitly separate in the Raman strength profile. |
| PDF 112 | An angular malefic weakens Maalaa; an angular benefic weakens Sarpa. Neither is treated as automatic cancellation of the base placement. |
| PDF 122 | Vasumati's base placement and full-result qualifications are separate fields. |
| PDF 127, advanced rules 2–3 | “Aspected” is represented by aspect, rather than accepting conjunction as a substitute. |
| PDF 129, sambandha rule 15 | An unresolved AK cannot silently turn an otherwise possible alternative into False. |

The deterministic audit records witnesses and missing branches for every named condition. Of 316 reported condition/qualification fields, 313 have both True and False witnesses. The three remaining constant-false fields are included in the demonstrated incompatibilities below. Coverage of a reported field is not exhaustive coverage of every internal Python branch, every possible chart, or all combinations of premises.

The eight source-placement checks use prose illustrations from PDF 107, 108 and 112. Unspecified planets are explicitly synthetic filler. Other directed cases are constructed from definitions; randomized cases are software probes. Such arrangements may be astronomically impossible. They are never presented as birth charts or independent historical evidence.

## 3. Five mathematically incompatible combinations under the selected profile

`audit_profile_conflicts.py` supplies finite checks and `profile_conflicts.json` records them. The chart output also flags these entries.

| Entry | Why it cannot become operative under the current combination of conventions | What would need a separately justified alternative |
|---|---|---|
| Gola | Seven bodies in one sign necessarily share a modality. An Ashraya yoga therefore always suppresses Gola under literal all-Nabhasa precedence. | Precedence or participating-body interpretation. |
| Advanced Raaja 7 | The selected D2 maps Asc and planets only to Cancer/Leo. Full graha aspects connect neither the same nor these adjacent signs, so an aspect in all six charts fails in D2. | Hora mapping or the meaning of aspect in this passage. |
| Advanced Raaja 13 | Exchanging fourth/tenth lords occupy opposite signs. No classical full-aspect set can reach both from one planet. | Whether different fifth/ninth lords may separately aspect the two targets, instead of one lord aspecting both. |
| Advanced Raaja 17 | Opposite Rahu/Ketu cannot both belong to houses {3,6,11}. | Whether the passage excludes nodes. |
| Kulavardhana | Requiring Sun and Moon themselves to satisfy the fifth-from-reference rule constrains the allowed targets so they cannot contain opposite nodes. | Whether “each planet” means only the seven classical bodies. |

These are conditional mathematical conclusions. They do not prove the historical authors intended impossible yogas. The proper result is to expose incompatible premises, retain the literal selected profile, and avoid silently inventing a favorable reading. `include_nodes=False` is already available in the Python yoga API for explicit seven-body exploration, but does not solve the unrelated Hora, precedence or wording questions.

## 4. Moola subperiods: useful arithmetic, separate authority

[Rath's Mula Dasa article](https://srath.com/jyoti%E1%B9%A3a/dasa/mula-dasa/) establishes the selected mahadasa profile and exposes its table/prose differences. The checked article does not provide antardasa instructions. Rao's [Volume II class notes](https://www.vedicastrologer.org/classes/book2-for-CD.pdf), especially Lesson 47, discuss Moola usage without completing that specification; its software warning is historical. The [Jagannatha Hora feature page](https://www.vedicastrologer.org/jh/features.htm) describes functionality but is not an algorithm specification.

Installed PyJHora 4.8.7 `jhora/horoscope/dhasa/graha/moola.py` documents a concrete convention: rotate the first-cycle order to the parent lord and partition the parent by first-cycle duration weights. We implement only that subdivision convention on top of our separately selected Rath mahadasas. This **hybrid is experimental** and is not claimed to reproduce PyJHora's complete Moola system or Jagannatha Hora.

For the source sign/order fixture, first-cycle weights total 83. A ten-year Jupiter parent therefore gives Jupiter/Jupiter = 100/83 years, rather than 100/120. Its six-year second-cycle Jupiter parent gives 60/83. Fractions preserve partition sums exactly, including zero-length second-cycle parents. These are arithmetic examples, not independently published Moola predictions.

The default still rejects Moola depth >0 unless `subperiod_policy="experimental_cycle1_weights"` is explicitly supplied. See `INPUT_FORMATS.md` and the labeled example output.

## 5. Interpretation and prediction research

`decision_rules.resolve` requires a declared topic/window and sourced evidence. It retains supportive, adverse and unknown information; it never derives probability from the number of yoga hits. Only an explicitly sourced, definitely met override suppresses a target. Cyclic overrides are rejected and a suppressed exception cannot suppress another rule.

`cohort_validation.evaluate` prevents a person from appearing in both training and holdout. It uses training prevalence for its fixed baseline, averages repeated predictions within person, and bootstraps people. It refuses missing outcomes, duplicate IDs and invalid probabilities. A favorable score is descriptive and does not authenticate registration or prove predictive validity. The included cohort is completely invented for software testing.

`PREDICTION_STUDY_PROTOCOL.md` documents dataset suitability, outcome definitions, freezing choices, controls, leakage, reporting and sample-size assumptions. No suitable real cohort was assembled or scored in this release. This is an evidence dependency, not a missing personal detail from the user.

Astronomical accuracy remains a different question: the existing Skyfield/JPL benchmark has 67 passing comparisons. No coordinate algorithm changed in this release, so that benchmark is retained rather than presented as newly rerun. Lunar nodes are orbital intersection points; precession changes coordinate references. Astronomy cannot by itself decide textual interpretation, assign event probabilities, or select one traditional dignity table as physically correct. Supporting astronomy references: [NASA lunar orbit](https://svs.gsfc.nasa.gov/5326/) and [ESO precession](https://www.eso.org/public/videos/cs0004e/).

## What remains genuinely open

1. A trustworthy independent full-strength benchmark under exactly matching conventions.
2. Textual adjudication of the five incompatible convention combinations, plus independently published examples for all rules. The execution audit is complete; independent rule validation is not.
3. Authoritative, complete Moola subperiod instructions if we want to remove the experimental designation.
4. A properly sourced/blinded empirical cohort, externally recorded protocol, subsequent observations and replication before assigning predictive accuracy.

These cannot honestly be replaced by more confidence or synthetic examples. The scripts, evidence, source disagreements and limits are now documented and reproducible.
