# Prediction validation protocol — proposed, not registered

14 October 2026. No participants, real outcomes or empirical accuracy results are bundled.

## Question and endpoint

Proposed first study: among consenting adults currently in paid employment, does a frozen chart-based model improve prediction of starting work for a **different legal employer within the next 12 months**, compared with ordinary baseline information? Define an outcome as 1 only when a dated start is verified under the protocol; internal title changes, offers without a start, and self-employment require separate predeclared treatment. Do not widen the endpoint after seeing predictions. Missing follow-up remains missing, not 0.

This endpoint is a proposed measurable research question, not a claim the present interpreter can already forecast it. The current code does not contain a trained/calibrated job-change probability model. Traditional evidence classification cannot be relabeled as a percentage.

## Data and source assessment

| Candidate | What was established in this research | Suitability decision |
|---|---|---|
| Supplied textbook examples | Published demonstrations already used to derive and test the rules | Training/illustration only; using them as blind holdout would leak answers. |
| Astro-Databank | Official search results describe public birth/event records and XML export; direct copyright/download/rating pages hit access or browser checks | A candidate, not an acquired or license-verified dataset in this release. Celebrity selection and missing event coverage would also need review. |
| Renay Oshop's public research repository | Public repository with project materials and a displayed CC0 license | Candidate materials only. Upstream rights, complete denominators, birth-time provenance, event labeling and prior exposure must be checked project by project before reuse. No reported effect was independently replicated here. |
| A prospective volunteer cohort | Could record both event and non-event follow-up and keep forecasts sealed | Best fit for the proposed question, but recruitment, consent, records and future observation are not supplied by this research session. |

Official sources checked: [Astro-Databank](https://www.astro.com/astro-databank/Main_Page), [XML format](https://www.astro.com/astro-databank/Help%3AXML_export_format), [research repository](https://github.com/renayo/big_astrology_book). Access limitations are not interpreted as permission to bypass site controls or to claim data quality has been verified.

## Freeze before holdout access

Record the eligible population, recruitment dates, complete denominator, duplicate handling, birth-time documentation and its uncertainty interval. Unknown time, disputed timezone and rectified times are separate strata or predeclared exclusions. Never rectify a holdout person's birth time against the event being predicted.

Freeze the ephemeris/version, ayanamsa, nodes, house/varga methods, strength and dasha profiles, year model, outcome window, input features, feature scaling, calibration method and all hyperparameters. A source disagreement cannot be resolved separately for each successful example. If several profiles are tested, one must be primary and all comparisons disclosed.

An interpretable candidate feature set can be specified during training, but neither rule weights nor a probability mapping should be invented as established knowledge. Estimate any mapping/calibration on training or internal validation people only. Keep entire people, relatives where dependence matters, and repeated windows out of cross-split leakage. Public famous-person data may already be known to a language model; it should not be described as blinded merely because a file says “holdout.”

An external registration or independent custodian should preserve the plan and sealed prediction file before outcomes are accessed. A local SHA-256 digest proves content identity when compared with a retained copy; it does not authenticate when a prediction was first made. [OSF's official guide](https://help.osf.io/article/330-welcome-to-registrations) explains preregistration and fixed study plans. No account action or public registration has been performed.

## Comparators and negative controls

Use at least a fixed training-prevalence baseline, and a stronger ordinary-information baseline including predeclared age, employment tenure, geography, industry and calendar conditions when legitimately collected. To test incremental astrological information, compare the latter with the same model plus chart features. The delivered evaluator implements the fixed-prevalence comparison; it does not claim the richer comparator has been fitted without data.

Predeclare negative controls that preserve relevant nuisance structure: shuffled chart-to-person assignments within suitable strata, shifted birth times within the stated uncertainty model, and a simple non-astrological calendar model. Shuffling cannot mix unequal employment populations indiscriminately. Report every predeclared control, even when its result is inconvenient. No control result has been manufactured here.

## Metrics and independence

Primary score: Brier loss, the mean squared difference between a declared probability and observed binary outcome. Report loss improvement over the baseline, not just the percentage of events “hit.” Brier skill can be undefined when baseline loss is zero; the code reports null in that case.

The delivered evaluator averages a person's windows, gives each person equal weight, and reports an approximate percentile bootstrap interval for mean loss improvement by resampling people. Small samples, dependence between people and selection bias are not cured by bootstrapping. Report calibration, event prevalence, missingness, birth-time sensitivity, coverage and relevant subgroup performance in the actual study. Any post-hoc analyses must be labeled exploratory.

`sample_size` provides a two-sided normal approximation for independent person-level paired loss differences. Example assumptions of mean improvement 0.1, SD 0.2, alpha 0.05 and power 0.8 produce approximately 32 people. **Those are invented planning assumptions, not an estimated effect or a recommended sufficient study size.** A real design needs an external pilot, multiplicity/dependence adjustment, expected attrition and simulation where the approximation is poor.

## Reproducible software demonstration

```bash
python -m vedic_toolkit evaluate-cohort examples/synthetic_cohort_demo.json
```

The demonstration's two holdout people and two training people are fictional. Its favorable numeric score verifies arithmetic only. `synthetic_cohort_result.json` carries that label. `evaluate_predictions` remains available for declared prospective windows, and its timestamps are likewise unauthenticated assertions.

A defensible empirical conclusion requires a complete real cohort, predictions fixed before holdout disclosure, results for all eligible participants, a suitable baseline, uncertainty estimates and independent replication. None is inferred from passing calculation tests.
