# Vedic calculation toolkit — current research and verification report

**Version 0.4.0 · 14 October 2026 · 225 tests passed, zero failures, zero errors.**

The remaining investigation and software work for this release are complete. Source conflicts, experimental extensions and missing empirical evidence are explicitly identified. This is not a claim that every traditional rule is uniquely settled or that life-event prediction accuracy has been demonstrated.

## What changed

- Corrected yoga definitions and Mercury classification; all 170 entries now have documented execution coverage or a conditional mathematical incompatibility.
- Explained all 21 native Shadbala total differences against pinned, unmodified PyJHora 4.8.7 without disguising them as agreement.
- Added explicitly experimental Moola subdivisions, sourced interpretation overrides and person-separated forecast evaluation.
- Documented a proposed empirical study, source-access limits and overlapping books/projects. No real cohort or completed book is claimed.

## Source and reproducibility

Main source: P. V. R. Narasimha Rao, *Vedic Astrology: An Integrated Approach*, supplied 442-page PDF, first published 2001 / reprint 2004. PDF SHA-256: `94a9c79b77c9396c337274a45a2e3e8fd90566c4242a23cf040ccb3a8888ecfb`. Book references use 1-based PDF pages. All pages were text-extracted; relevant calculation tables and disputed passages were also checked visually. This is not independent verification of every historical case or image-only chart. The source PDF is not duplicated in the package.

Delivered runtime: Python 3.12.14; PySwissEph 2.10.3.2 / Swiss Ephemeris 2.10.03. The examples use public book material and explicitly synthetic fixtures, not the user's private birth data.

```bash
python -m pip install -r requirements.txt
python verify.py
python audit_yogas.py
python audit_profile_conflicts.py
```

Optional strength reproduction requires `requirements-audit.txt`: run `python audit_strengths.py --external`, then `python reconcile_strengths.py`. The README contains calculation commands and the separate JPL benchmark setup. `RESEARCH_SOURCES.json` records checked sources and pinned reference hashes; `file_manifest.json` records package hashes.

## Verification scope

| Check | Result | What it means |
|---|---:|---|
| Original and earlier-release test methods | 196 passed | Selected source fixtures, edge cases, arithmetic and integration |
| New research test methods | 29 passed | 10 yoga/source checks, 5 Moola checks, 6 decision-policy checks, 8 cohort checks |
| **Current automated suite** | **225 passed** | Software/calculation checks, not 225 predictive validations |
| Yoga execution audit | 590 cases; 100,300 evaluations | 165 entries have met/not-met witnesses; five selected-profile incompatibilities documented |
| Partial source-placement checks | 8/8 passed | Source prose placements with synthetic filler; not complete independently verified charts |
| Reported condition/qualification fields | 313/316 have both Boolean witnesses | The other three are constant-false premises in the documented conflicts; not exhaustive internal branch coverage |
| Strength discrepancy accounting | 21/21 close within 0.011 virupa | Explains native differences, allowing displayed rounding; does not establish correct full totals |
| Native independent strength total agreement | 4/21 within 0.05 virupa | Original benchmark result retained; full equivalence remains unestablished |
| Earlier strength arithmetic/range audit | 153 passed | Retained consistency checks |
| Earlier independent astronomical benchmark | 67/67 passed | Retained Skyfield/JPL DE440s comparison; coordinate algorithms did not change this release |

The current test list and outcomes are in `verification_results.json`. The astronomy benchmark compares 35 body longitudes, 20 ascendants and 12 geometric solar-centre sunrise times; its respective largest differences are 1.20154 arcseconds, 0.001256 arcseconds and 0.004748 seconds. Those finite results do not establish global, historical, atmospheric or birth-time accuracy. They do not adjudicate astrological symbolism. The earlier detailed benchmark and source-example results are preserved in `VERIFICATION_HISTORY_v0_3.md`.

The sections below contain the completed research, proposed study, book comparison and current decision ledger. Prior reports are retained in the toolkit as historical records, with their old counts and implementation limits clearly labeled.

## Completed investigation and remaining evidence dependencies

14 October 2026 · Toolkit 0.4.0 · Main source: the supplied 442-page Rao PDF.

The requested investigation, software corrections, diagnostic audits and documentation are complete for this release. This does **not** mean that all classical texts agree, every interpretation is uniquely determined, or forecasts have been validated. Unresolved textual choices are now identified precisely instead of being treated as missing arithmetic.

### Results

| Workstream | Completed now | What the evidence establishes |
|---|---|---|
| Full Shadbala discrepancies | Decomposed all 21 native total differences; compared 189 Kala and 105 Sthana subcomponents; traced circular-angle, hemisphere, interpolation, hora, nature and war differences | The disagreements are explainable. Full independent numerical equivalence remains unestablished. |
| Yoga audit | Exercised all 170 entries across 590 deterministic cases: 100,300 rule evaluations; both met/not-met observed for 165 entries; five remaining entries have demonstrated profile incompatibilities | Broad reproducible execution coverage, plus eight partial source-placement illustrations. This is not 170 independent validations. |
| Source corrections | Corrected majority-based Mercury classification, weakening-versus-cancellation, aspect-only requirements and unknown-karaka propagation | Code more closely represents the cited passages; undefined ties stay explicit. |
| Moola subperiod investigation | Checked Rath's article, Rao's class notes/software description and installed PyJHora 4.8.7; added an opt-in software-derived subdivision convention | Usable experimental interval arithmetic with separate provenance. A complete authoritative Rath/Rao subperiod specification was not located in the checked sources. |
| Interpretation policy | Added a sourced override graph, pending-state handling, conflict retention and a review row for every yoga | Consistent review behavior without arbitrary probability or majority voting. |
| Prediction evaluation | Added person-separated holdout evaluation, a training-only baseline, clustered bootstrap interval and sample-size planning; wrote a study protocol | The scoring infrastructure is ready. No real predictive performance estimate has been produced. |
| Book research | Documented overlapping books and software/corpus projects | An integrated contribution is plausible; a “first ever” or “best book” claim is not established. |

### 1. Strength reconciliation

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

### 2. Corrections to yoga handling

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

### 3. Five mathematically incompatible combinations under the selected profile

`audit_profile_conflicts.py` supplies finite checks and `profile_conflicts.json` records them. The chart output also flags these entries.

| Entry | Why it cannot become operative under the current combination of conventions | What would need a separately justified alternative |
|---|---|---|
| Gola | Seven bodies in one sign necessarily share a modality. An Ashraya yoga therefore always suppresses Gola under literal all-Nabhasa precedence. | Precedence or participating-body interpretation. |
| Advanced Raaja 7 | The selected D2 maps Asc and planets only to Cancer/Leo. Full graha aspects connect neither the same nor these adjacent signs, so an aspect in all six charts fails in D2. | Hora mapping or the meaning of aspect in this passage. |
| Advanced Raaja 13 | Exchanging fourth/tenth lords occupy opposite signs. No classical full-aspect set can reach both from one planet. | Whether different fifth/ninth lords may separately aspect the two targets, instead of one lord aspecting both. |
| Advanced Raaja 17 | Opposite Rahu/Ketu cannot both belong to houses {3,6,11}. | Whether the passage excludes nodes. |
| Kulavardhana | Requiring Sun and Moon themselves to satisfy the fifth-from-reference rule constrains the allowed targets so they cannot contain opposite nodes. | Whether “each planet” means only the seven classical bodies. |

These are conditional mathematical conclusions. They do not prove the historical authors intended impossible yogas. The proper result is to expose incompatible premises, retain the literal selected profile, and avoid silently inventing a favorable reading. `include_nodes=False` is already available in the Python yoga API for explicit seven-body exploration, but does not solve the unrelated Hora, precedence or wording questions.

### 4. Moola subperiods: useful arithmetic, separate authority

[Rath's Mula Dasa article](https://srath.com/jyoti%E1%B9%A3a/dasa/mula-dasa/) establishes the selected mahadasa profile and exposes its table/prose differences. The checked article does not provide antardasa instructions. Rao's [Volume II class notes](https://www.vedicastrologer.org/classes/book2-for-CD.pdf), especially Lesson 47, discuss Moola usage without completing that specification; its software warning is historical. The [Jagannatha Hora feature page](https://www.vedicastrologer.org/jh/features.htm) describes functionality but is not an algorithm specification.

Installed PyJHora 4.8.7 `jhora/horoscope/dhasa/graha/moola.py` documents a concrete convention: rotate the first-cycle order to the parent lord and partition the parent by first-cycle duration weights. We implement only that subdivision convention on top of our separately selected Rath mahadasas. This **hybrid is experimental** and is not claimed to reproduce PyJHora's complete Moola system or Jagannatha Hora.

For the source sign/order fixture, first-cycle weights total 83. A ten-year Jupiter parent therefore gives Jupiter/Jupiter = 100/83 years, rather than 100/120. Its six-year second-cycle Jupiter parent gives 60/83. Fractions preserve partition sums exactly, including zero-length second-cycle parents. These are arithmetic examples, not independently published Moola predictions.

The default still rejects Moola depth >0 unless `subperiod_policy="experimental_cycle1_weights"` is explicitly supplied. See `INPUT_FORMATS.md` and the labeled example output.

### 5. Interpretation and prediction research

`decision_rules.resolve` requires a declared topic/window and sourced evidence. It retains supportive, adverse and unknown information; it never derives probability from the number of yoga hits. Only an explicitly sourced, definitely met override suppresses a target. Cyclic overrides are rejected and a suppressed exception cannot suppress another rule.

`cohort_validation.evaluate` prevents a person from appearing in both training and holdout. It uses training prevalence for its fixed baseline, averages repeated predictions within person, and bootstraps people. It refuses missing outcomes, duplicate IDs and invalid probabilities. A favorable score is descriptive and does not authenticate registration or prove predictive validity. The included cohort is completely invented for software testing.

`PREDICTION_STUDY_PROTOCOL.md` documents dataset suitability, outcome definitions, freezing choices, controls, leakage, reporting and sample-size assumptions. No suitable real cohort was assembled or scored in this release. This is an evidence dependency, not a missing personal detail from the user.

Astronomical accuracy remains a different question: the existing Skyfield/JPL benchmark has 67 passing comparisons. No coordinate algorithm changed in this release, so that benchmark is retained rather than presented as newly rerun. Lunar nodes are orbital intersection points; precession changes coordinate references. Astronomy cannot by itself decide textual interpretation, assign event probabilities, or select one traditional dignity table as physically correct. Supporting astronomy references: [NASA lunar orbit](https://svs.gsfc.nasa.gov/5326/) and [ESO precession](https://www.eso.org/public/videos/cs0004e/).

### What remains genuinely open

1. A trustworthy independent full-strength benchmark under exactly matching conventions.
2. Textual adjudication of the five incompatible convention combinations, plus independently published examples for all rules. The execution audit is complete; independent rule validation is not.
3. Authoritative, complete Moola subperiod instructions if we want to remove the experimental designation.
4. A properly sourced/blinded empirical cohort, externally recorded protocol, subsequent observations and replication before assigning predictive accuracy.

These cannot honestly be replaced by more confidence or synthetic examples. The scripts, evidence, source disagreements and limits are now documented and reproducible.

## Proposed prediction study — not registered or executed

14 October 2026. No participants, real outcomes or empirical accuracy results are bundled.

### Question and endpoint

Proposed first study: among consenting adults currently in paid employment, does a frozen chart-based model improve prediction of starting work for a **different legal employer within the next 12 months**, compared with ordinary baseline information? Define an outcome as 1 only when a dated start is verified under the protocol; internal title changes, offers without a start, and self-employment require separate predeclared treatment. Do not widen the endpoint after seeing predictions. Missing follow-up remains missing, not 0.

This endpoint is a proposed measurable research question, not a claim the present interpreter can already forecast it. The current code does not contain a trained/calibrated job-change probability model. Traditional evidence classification cannot be relabeled as a percentage.

### Data and source assessment

| Candidate | What was established in this research | Suitability decision |
|---|---|---|
| Supplied textbook examples | Published demonstrations already used to derive and test the rules | Training/illustration only; using them as blind holdout would leak answers. |
| Astro-Databank | Official search results describe public birth/event records and XML export; direct copyright/download/rating pages hit access or browser checks | A candidate, not an acquired or license-verified dataset in this release. Celebrity selection and missing event coverage would also need review. |
| Renay Oshop's public research repository | Public repository with project materials and a displayed CC0 license | Candidate materials only. Upstream rights, complete denominators, birth-time provenance, event labeling and prior exposure must be checked project by project before reuse. No reported effect was independently replicated here. |
| A prospective volunteer cohort | Could record both event and non-event follow-up and keep forecasts sealed | Best fit for the proposed question, but recruitment, consent, records and future observation are not supplied by this research session. |

Official sources checked: [Astro-Databank](https://www.astro.com/astro-databank/Main_Page), [XML format](https://www.astro.com/astro-databank/Help%3AXML_export_format), [research repository](https://github.com/renayo/big_astrology_book). Access limitations are not interpreted as permission to bypass site controls or to claim data quality has been verified.

### Freeze before holdout access

Record the eligible population, recruitment dates, complete denominator, duplicate handling, birth-time documentation and its uncertainty interval. Unknown time, disputed timezone and rectified times are separate strata or predeclared exclusions. Never rectify a holdout person's birth time against the event being predicted.

Freeze the ephemeris/version, ayanamsa, nodes, house/varga methods, strength and dasha profiles, year model, outcome window, input features, feature scaling, calibration method and all hyperparameters. A source disagreement cannot be resolved separately for each successful example. If several profiles are tested, one must be primary and all comparisons disclosed.

An interpretable candidate feature set can be specified during training, but neither rule weights nor a probability mapping should be invented as established knowledge. Estimate any mapping/calibration on training or internal validation people only. Keep entire people, relatives where dependence matters, and repeated windows out of cross-split leakage. Public famous-person data may already be known to a language model; it should not be described as blinded merely because a file says “holdout.”

An external registration or independent custodian should preserve the plan and sealed prediction file before outcomes are accessed. A local SHA-256 digest proves content identity when compared with a retained copy; it does not authenticate when a prediction was first made. [OSF's official guide](https://help.osf.io/article/330-welcome-to-registrations) explains preregistration and fixed study plans. No account action or public registration has been performed.

### Comparators and negative controls

Use at least a fixed training-prevalence baseline, and a stronger ordinary-information baseline including predeclared age, employment tenure, geography, industry and calendar conditions when legitimately collected. To test incremental astrological information, compare the latter with the same model plus chart features. The delivered evaluator implements the fixed-prevalence comparison; it does not claim the richer comparator has been fitted without data.

Predeclare negative controls that preserve relevant nuisance structure: shuffled chart-to-person assignments within suitable strata, shifted birth times within the stated uncertainty model, and a simple non-astrological calendar model. Shuffling cannot mix unequal employment populations indiscriminately. Report every predeclared control, even when its result is inconvenient. No control result has been manufactured here.

### Metrics and independence

Primary score: Brier loss, the mean squared difference between a declared probability and observed binary outcome. Report loss improvement over the baseline, not just the percentage of events “hit.” Brier skill can be undefined when baseline loss is zero; the code reports null in that case.

The delivered evaluator averages a person's windows, gives each person equal weight, and reports an approximate percentile bootstrap interval for mean loss improvement by resampling people. Small samples, dependence between people and selection bias are not cured by bootstrapping. Report calibration, event prevalence, missingness, birth-time sensitivity, coverage and relevant subgroup performance in the actual study. Any post-hoc analyses must be labeled exploratory.

`sample_size` provides a two-sided normal approximation for independent person-level paired loss differences. Example assumptions of mean improvement 0.1, SD 0.2, alpha 0.05 and power 0.8 produce approximately 32 people. **Those are invented planning assumptions, not an estimated effect or a recommended sufficient study size.** A real design needs an external pilot, multiplicity/dependence adjustment, expected attrition and simulation where the approximation is poor.

### Reproducible software demonstration

```bash
python -m vedic_toolkit evaluate-cohort examples/synthetic_cohort_demo.json
```

The demonstration's two holdout people and two training people are fictional. Its favorable numeric score verifies arithmetic only. `synthetic_cohort_result.json` carries that label. `evaluate_predictions` remains available for declared prospective windows, and its timestamps are likewise unauthenticated assertions.

A defensible empirical conclusion requires a complete real cohort, predictions fixed before holdout disclosure, results for all eligible participants, a suitable baseline, uncertainty estimates and independent replication. None is inferred from passing calculation tests.

## Book landscape and possible contribution

Research checked 14 October 2026. This is a targeted comparison, not an exhaustive bibliography of every language, edition or privately circulated work.

**We cannot substantiate that we would be the first to combine astrology, computation, source criticism and empirical testing.** Existing books and projects overlap substantially. A useful contribution would be an unusually transparent integration with original audits and clearly labeled evidence.

| Work | Relevant overlap | Limit of the comparison |
|---|---|---|
| P. V. R. Narasimha Rao, *Vedic Astrology: An Integrated Approach* | Broad integration of chart analysis, dashas, annual methods and applications; the primary source of this toolkit | The uploaded edition is not a Python package or a completed controlled validation study. [Author's book resources](https://www.vedicastrologer.org/articles/astro_books.htm). |
| Renay Oshop, *The Big Astrology Book of Research* | Describes a collection of 48 research projects; companion repository contains data/code/text and discusses mixed/null results | Website/repository claims were inspected; the experiments and data quality were not independently replicated. [Book site](https://bigastrologybook.com/) · [Repository](https://github.com/renayo/big_astrology_book). |
| Martin Gansten, *The Jewel of Annual Astrology* (2020) | Parallel Sanskrit-English critical edition of Balabhadra's *Hayanaratna*; substantial historical and source comparison for Tajaka | A specific scholarly edition, not a general Vedic Python validation toolkit. [University publication record](https://portal.research.lu.se/en/publications/the-jewel-of-annual-astrology-a-parallel-sanskrit-english-critica/). |
| PyJHora | Open Python implementations of many Jyotisha computations and software tests | A software project, not an independently validated prediction system. Our pinned 4.8.7 comparison found errors and convention differences. [Repository](https://github.com/naturalstupid/PyJHora). |
| Jyotisha Corpus | Public project emphasizing provenance, classical-source rules and preservation of differences between schools | Source quotation verification is not verification of an interpretation or a future event. The project is not a single comprehensive book. [Repository](https://github.com/maximally0/jyotisha-corpus). |

These works are evidence against a broad novelty claim. Finding no exact match in this limited search would not prove that no such work exists.

### A defensible book proposition

An auditable companion to integrated Jyotisha: each implemented rule has an edition/page reference, precise variables, declared conventions, runnable code, worked numerical examples, sensitivity limits and a record of disagreement. The new five-rule feasibility analysis and component-level strength discrepancy audit are examples of concrete contributions that can be demonstrated without claiming universal superiority.

A possible organization is: (1) history and limits of the sources; (2) time, coordinates and astronomical calculation; (3) classical mathematical systems and alternative conventions; (4) yoga detection and mathematical feasibility; (5) interpretation with conflicts and unknowns; (6) empirical study design; (7) reproducible appendices and error ledger.

Separate historical narrative from verifiable calendar facts. Legendary illustrative charts, reconstructed dates, and modern birth records have different evidentiary status. Do not use precise-looking computed degrees to authenticate a legendary person's birth time. Nor does a historical astronomical model establish a physical mechanism for modern event predictions.

Before making publication claims, the manuscript would still need specialist Sanskrit/textual review, an expanded bibliography, independent code review and any real empirical results it proposes to advertise. A completed manuscript, peer review and market-wide originality certification have not been delivered in this research release.

## Resolution ledger and prior source findings

Updated 14 October 2026. Earlier release findings are preserved below; the final section records 0.4.0 changes and supersedes older implementation-scope statements. See `RESEARCH_CLOSEOUT.md` for the current status and remaining evidence dependencies.

Prepared 13 October 2026. References to Rao's supplied book use **PDF page numbers**. This ledger documents the contradictions identified in this project; it is not an assertion that every sentence in 442 pages has been proved free of error. Corrections below are reasoned adjudications, not a published list of author-approved errata.

### Corrected arithmetic, labels and omissions

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

### Genuine variants and explicit choices

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

### Work completed beyond the disputed text

The package now calculates fine dignities and combustion, four Vimsopaka groups, all six Shadbala components with intermediate values, additional avasthas, 170 natal D1 rule conditions, all sixteen Tajaka structural configurations, annual lord selection, post-ingress conditions, aspect tracking, amanta calendar names and eight electional table screens. It also supplies event-based candidate ranking and prospective forecast scoring.

These additions have different levels of evidence. Seven Saptavargaja and seven Drik results reproduce Raman's printed component examples; five Cheshta results and selected Dig results agree within documented rounding tolerances. **The full automatic total has now been compared with unmodified PyJHora 4.8.7. Only 4/21 totals agree within 0.05 virupa; complete equivalence remains unestablished.** The audit identifies circular-angle defects in the reference and preserves other convention differences. See `COMPLETION_REPORT.md`. The 170-rule inventory describes coverage, not 170 separate source-chart validations.

### What remains unresolved or outside this release

| Item | What would be needed |
|---|---|
| Exhaustive yoga correctness and synthesis | Explicit source exceptions and qualifying evidence are implemented. Independent fixtures for every branch, universal relative weighting and higher-divisional reinterpretation are not supplied. Current catalog is D1. |
| Complete Shadbala equivalence | Audit completed; numerical agreement remains open. It needs an independent implementation with matching mean-motion, war, relationship, time-lord and strength conventions, free of the identified angular-wrap defects. |
| Exact birth-time rectification | Reliable dated personal events, uncertainty in the recorded time, predeclared rules and unseen checks. Current ranking is hypothesis fit, not certification. |
| Predictive accuracy | Prospectively recorded outcomes, defensible baselines, adequate sample sizes and independent evaluation. No such dataset was supplied. |
| Moola beyond the sourced scope | Rath 1999 mahadasas are now implemented. Antardasas and unspecified ranking refinements require additional source decisions; the article does not settle all Moola traditions. |
| Qualitative muhurta and other applications | Chapter 36 calculations and evidence are implemented. Final suitability and unspecified per-task yoga/karana lists require declared judgments. Regional calendars, mundane interpretation, remedies and automated longevity judgments are outside this release. |
| Unspecified textual choices | Node occupancy, some avastha wording and alternative historical doctrines remain choices, not newly discovered facts. |

### Mathematical, astronomical and historical interpretation

The mathematical audit checks units, boundaries, circular angles, interval partitions and contradictions. Astronomy independently checks apparent positions and horizon geometry. Historical comparison identifies which texts define which scoring systems. These are complementary tasks with different standards of evidence.

Geocentric coordinates are a legitimate way of describing the sky; their use does not imply that the Sun physically orbits Earth. Rahu/Ketu are opposite lunar orbital nodes, not additional physical planets. Precession and a chosen sidereal origin affect coordinate labels. Ayanamsa choice and traditional dignity scores are not gravitational forces. Consequently, accurate astronomy cannot by itself decide between symbolic rules or validate a forecast about a person's life.

### Supporting primary sources

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


### New adjudications in 0.3.0

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

### New adjudications in 0.4.0

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
