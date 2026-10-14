# Input formats

## Birth specification

```json
{
  "label": "Example input only",
  "datetime": "2000-04-28T05:50:00",
  "timezone": "America/New_York",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "settings": {"ayanamsa": "lahiri", "node": "mean", "engine": "moshier"}
}
```

An explicit offset in `datetime` is also accepted. Record uncertainty separately and run `sensitivity`. Do not replace a historical time zone with today's offset. Optional `colord_overrides` can contain `{"Sc":"Mars","Aq":"Saturn"}`; use only a reviewed choice with a reason. See `CALCULATION_PROFILE.md` for rule options.

## Rectification evidence

These are **synthetic format examples**, not facts about the user or the book's native. Replace them with independently documented events and hypotheses fixed before comparing candidate times.

```json
{
  "rules": [
    {"id":"r1", "event_type":"example_event", "varga":9, "activated_houses":[1,5,9], "weight":1}
  ],
  "events": [
    {"id":"e1", "type":"example_event", "datetime":"2020-03-01T12:00:00Z", "split":"train"},
    {"id":"e2", "type":"example_event", "datetime":"2021-03-01T12:00:00Z", "split":"holdout"}
  ]
}
```

A rule matches when the event's Vimsottari mahadasa lord occupies one of the specified natal divisional houses. This is a deliberately limited hypothesis feature, not a generally established event rule. Only training scores rank candidate times. Holdout scores are shown separately; ties stay visible. Events must be after birth and within the supported two-cycle dasha span. The run records a hash of inputs, rules and events; a hash alone does not authenticate when rules were written.

## Forecast evaluation

The following illustrates the schema with artificial data. It is not a forecast or a measured astrological probability.

```json
{
  "baseline_probability":0.5,
  "predictions":[
    {"id":"p1", "probability":0.8,
     "registered_at":"2020-01-01T00:00:00Z",
     "window_start":"2020-02-01T00:00:00Z",
     "window_end":"2020-03-01T00:00:00Z"}
  ],
  "observations":{"p1":1}
}
```

Define the binary outcome and its measurement independently before the window begins. The evaluator requires `registered_at < window_start < window_end`, unique IDs, finite probabilities from 0 to 1 and every prediction's observed outcome. It does not authenticate timestamps or check the real-world outcome. One small or retrospectively assembled sample cannot establish forecast accuracy. A baseline should be chosen from appropriate prior data, not adjusted after seeing results.

## Moola Dasa

Add this optional field to a complete birth specification:

```json
{"moola_options":{"profile":"rath_1999_table","cycles":2}}
```

Run `python -m vedic_toolkit dasha birth.json --system moola --output moola.json`. Depth defaults to zero. The separate `rath_1999_prose` profile preserves the conflicting adjustment in the source prose. `order_override` may contain all nine planet names in a reviewed sequence; it cannot violate the angular/panapara/apoklima grouping. Use it only with a recorded reason, not to fit an event. No antardasa formula is silently imported. `--exception-precedence Saturn` or `Ketu` resolves an exact simultaneous-ascendant precedence tie. `--year-model` declares civil-date conversion.

For the explicitly experimental software-derived subdivision, add `"subperiod_policy":"experimental_cycle1_weights"` inside `moola_options`, then use `--depth 1`, `2` or `3`. It rotates the first-cycle order to the parent lord and divides the parent by first-cycle weights, also in cycle two. The weights are normalized by their own sum, not automatically 120. This hybrid is not an authoritative Rath/Rao antardasa specification. A runnable input is `examples/book_example_118_moola_experimental_input.json`:

```bash
python -m vedic_toolkit dasha examples/book_example_118_moola_experimental_input.json --system moola --depth 1 --output experimental_moola.json
```

The CLI's separate `--subperiod-policy narayana_extension` flag belongs to the rasi-dasha extension; Moola's experimental option belongs in its JSON object.

## Electional review

```bash
python -m vedic_toolkit election-review task_time.json --task house_entry --natal birth.json --duration-days 360 --output review.json
```

`task_time.json` has the same datetime/location schema as a birth specification. Use the intended actual start of the activity. Omit `--duration-days` when the task has no declared maximum duration. The following **illustrates fields only**, not a recommendation or a universal favorable list:

```json
{
  "electional_options":{
    "allowed_yogas":["Siddha"],
    "allowed_karanas":["Bava"],
    "natal_hora_judgments":{"Jupiter":true,"Saturn":false},
    "task_strength_judgment":true,
    "first_dasa_judgment":false,
    "nakshatra_start":1
  }
}
```

Use the exact yoga/karana names returned by `chart`. These values must be supplied from an independently chosen convention and reviewed assessment; the example booleans are not computed conclusions. Omitted judgments remain `null`. Supported nakshatra starts are 1, 4, 5 and 8; the program does not infer which constellation is strongest for an alternative start.

Tasks with source-based chart contexts are `job_start`, `education_start`, `alphabet`, `vehicle_purchase`, `house_entry`, `real_estate_purchase` and `wedding`. All eight earlier Table 79 tasks are also accepted. When a table-only task lacks a stated chart context, supply `task_context`, for example `{"vargas":[1,24],"houses":[1,2,4,5],"references":["Asc"],"topic_house":4}` after reviewing that choice. A missing Table 79 row stays missing; no eligibility list is fabricated.

## Yoga nature choices

The chart JSON accepts `"yoga_mercury_policy":"majority"` (default) and `"yoga_mercury_tie":"unresolved"` (default). Equal nonzero benefic/malefic conjunction counts generate both nature scenarios; conflicting structural conclusions remain pending. `any_malefic` is a separately named alternative policy. Direct API callers can set `mercury_tie="benefic"` or `"malefic"` only as an explicit interpretive choice; no source authority is implied. This does not change the Raman strength profile's separately declared nature convention.

## Interpretation decisions

Use `python -m vedic_toolkit decide examples/interpretation_conflict_demo.json`. The object contains `topic`, `window`, `evidence` and optional `overrides`. Each evidence row needs a unique `id`, `polarity` (`supportive` or `adverse`), `met` (`true`, `false` or `null`) and `source`. Each override needs `by`, `target` and `source`; both IDs must exist. Cycles are rejected. A definite active exception can suppress its target, but an unknown or itself-suppressed exception cannot do so. These are evidence classifications, not predictions or calibrated probabilities.

## Cohort evaluation

Use `python -m vedic_toolkit evaluate-cohort examples/synthetic_cohort_demo.json`. The object contains `rows` and optionally `bootstrap_replicates` (default 2000) and `seed` (default 20261014). Each row needs a unique `id`, a `person_id`, `split` (`train` or `holdout`), observed binary `outcome` and finite `probability` from 0 to 1. No person may cross splits; training people and at least two holdout people are required. Missing follow-up cannot be entered as a non-event.

The fixed baseline is estimated from training people only. Losses are averaged within person before comparing holdout people, and people are the bootstrap units. This routine neither authenticates forecast dates nor verifies how outcomes were collected. Keep the prospective timestamp records required by the separate `evaluate` command as well. Read `PREDICTION_STUDY_PROTOCOL.md` before interpreting scores. All supplied cohort data are fictional arithmetic fixtures.
