# Using the book with the calculation toolkit

The book's central method is to combine the relevant divisional chart, house, planet, strength, timing system, and transit. A single lookup is not a complete reading. The toolkit supplies traceable numbers for that process.

## A repeatable reading

1. Establish the birth input and its uncertainty. Preserve the original time zone and how reliable the recorded time is. Generate `chart.json`, then run sensitivity over the plausible interval.
2. Choose the topic before inspecting timing. The book connects career with D-10, marriage with D-9, residence/property with D-4, children with D-7, and learning with D-24. Keep the D-1 context too. These are traditional associations, not measured causal relationships.
3. Inspect the relevant houses and their lords from Ascendant, Moon, and Sun. Review graha/rasi aspects, dignity, arudhas, chara karakas, argala and Ashtakavarga. Separate actual computed positions from an interpretation of what they signify.
4. Read the applicable mahadasa, antardasa and, if warranted, pratyantardasa. Record the year model. Use the book's main Vimsottari and appropriate divisional Narayana as distinct timing views. Do not select whichever system retrospectively fits one event and call that validation.
5. Inspect transits against the chosen natal varga. The supplied transit command compares transit D1 positions with the natal varga, corresponding to the book's discussion. It does not treat the transiting D1 ascendant as the person's new natal ascendant.
6. For an annual analysis, calculate the solar return and examine the annual chart, sahams, annual dashas, strength profile and selected year lord. Inspect each Tajaka configuration and its perfection-tracking status. Consider the full natal context. A favorable annual placement does not establish an event by itself.
7. Report converging indications, conflicting indications, and results that change across the birth-time interval. Give a bounded time window tied to actual period dates. Do not convert traditional symbolism into a numerical probability without evidence.

## What I should retain for future readings

Keep the birth JSON, its input hash, the calculation profile, tool version, output JSON, and the exact source pages used for an interpretation. If a convention changes, regenerate the outputs and explain the difference. Do not silently mix mean and true nodes, different D-60 conventions, or 360-day and solar-arc years.

Fine divisions require particular care. If D-60 or its ascendant changes within a plausible birth-time interval, its interpretation is conditional. Even if the samples stay stable, finite sampling is not a mathematical guarantee that no boundary occurs between them.

## Calculation verification versus prediction validation

The test suite establishes that particular formulas reproduce specified numerical results and that the software handles selected edge cases. It cannot establish that those formulas predict career, marriage, wealth, or other life events.

To assess prediction accuracy, define an outcome and window in advance, freeze the chart settings and decision rules, record predictions before events, and evaluate on unseen cases against a baseline. Use calibration/error metrics suitable for the outcome and account for multiple comparisons. The book's retrospective examples are useful arithmetic fixtures but cannot serve as an unbiased out-of-sample evaluation.

## Source reading map

| Need | PDF pages |
|---|---|
| Basic angular conventions, panchanga, ayanamsa | 13–28 |
| Planetary dignities and relationships | 34–43 |
| Upagrahas and special lagnas | 44–52 |
| All 20 divisional mappings and varga groups | 53–65 |
| Houses, karakas, arudhas, aspects, argala | 66–105 |
| Yoga interpretation | 106–132 |
| Ashtakavarga | 133–151 |
| Integrating a chart | 152–164 |
| Longevity discussion, strengths and avasthas | 165–187 |
| Natal dasha systems | 189–280 |
| Transits | 282–329 |
| Tajaka and annual timing | 331–371 |
| Birth-time uncertainty/rectification discussion | 374–390 |
| Rationality and interpretation cautions | 391–398 |

Text was extracted from all 442 pages, but extraction is not equivalent to verifying every image-only chart. Tables used in the implemented arithmetic were checked visually and against numerical examples. This package does not claim independent verification of every case history or philosophical claim in the book.


## Using the new checks responsibly

Review `yogas.rules` as condition evidence: `conditions_met`, `conditions_not_met`, or `conditions_pending`. A hit is a structural match, not a promised outcome. The strength threshold used by the chart workflow is explicitly operational; the full Shadbala total still needs independent cross-validation. A missing strength computation leaves relevant rules pending rather than making the planet automatically weak.

The `rectify` command accepts documented events and rules using `INPUT_FORMATS.md`. Its narrow feature is the active Vimsottari mahadasa lord's natal divisional house. Fix rules and splits first, rank with training data only, and inspect holdout results without reusing them to choose a time. Multiple tied candidates are a real result. Even a unique best score is not proof of the true birth time.

The `evaluate` command scores predeclared binary forecasts against observations and a fixed baseline. Its Brier skill score is descriptive; it does not correct biased sampling, verify registration timestamps or supply statistical significance. No forecast validation has been performed on real outcomes in this release.

Do not manufacture numerical probabilities from yoga counts or strength totals. If reliable probability estimates are eventually learned from data, evaluate calibration and discrimination on unseen cases. Keep calculation correctness, source interpretation and empirical prediction performance as separate claims in any reading.

## Using the completed review tools

Read `chart.yoga_review` beside the structural catalog. It shows functional nature, close/wide Raaja associations, dignity/combustion/avastha evidence and explicit exceptions. Favorable and adverse evidence can coexist. Tajaka returns now include `tajaka_yogas.qualification`; review its modifiers and actual-motion check together.

For a proposed activity start, use `election-review`, supply the real natal chart if personal tara/hora matters, and inspect topic houses in both D1 and the relevant division. Review the first dasha and declared duration. The same book chart appears as both inputs in the delivered demo only to show the format; it is not an actual recommendation.

Moola output must retain the named Rath profile, ordering evidence and year model. Its published table fixture verifies arithmetic, not a historical event, lifespan or curse. The strength audit is complete as an audit; unresolved total equivalence must remain visible in future interpretations.

## Research additions in version 0.4.0

Use the catalog's `profile_notice` and Mercury nature scenarios before interpreting a combination. Five rules have incompatible premises under the current profile; they are not confirmed absent from every possible school of astrology. `decision_rules.resolve` records a declared topic/window and explicit sourced overrides. It retains mixed or pending evidence instead of inventing a single favorable answer.

The new `evaluate-cohort` command keeps entire people out of cross-split leakage, uses a training-only baseline and bootstraps people. These checks support a future study; they do not establish that a dataset was blinded or that a prediction was registered beforehand. The demonstration is entirely synthetic.

Read `PREDICTION_STUDY_PROTOCOL.md` for the proposed endpoint, controls, registration and reporting requirements; `RESEARCH_CLOSEOUT.md` for the completed investigations and open evidence dependencies; and `BOOK_LANDSCAPE.md` for the limits of publication and novelty claims. Experimental Moola subdivisions must remain labeled even if they happen to fit a retrospective event.
