# Calculation profile and choices

These choices are part of a result, not interchangeable defaults. Changing them can change a chart or its dates.

| Item | Choice in this package |
|---|---|
| Zodiac | Lahiri sidereal by default; Raman/Krishnamurti explicitly selectable |
| Ephemeris | Moshier through Swiss Ephemeris, offline; Swiss-file mode requires a path and rejects silent fallback |
| Positions | Geocentric apparent ecliptic longitude; no topocentric parallax adjustment |
| Nodes | Mean Rahu by default; true Rahu selectable; Ketu exactly opposite |
| Houses | Whole signs; actual ascendant longitude retained separately |
| Time | Explicit time zone/offset, proleptic Gregorian calendar, Swiss UTC-to-UT1 conversion |
| Sunrise | Upper limb, refraction enabled, 1013.25 hPa, 15 C, altitude 0 m; all configurable |
| Local horizon | No custom terrain obstruction model |
| Vedic weekday | Date of the last sunrise, not the civil date after midnight |
| Hora | 24 equal parts of sunrise-to-next-sunrise, PDF pp. 25–26 |
| Ghati in activity formula | Running ghati: floor(elapsed minutes / 24) + 1, PDF p. 175 |
| Time upagrahas | Middle of relevant segment; Gulika at Saturn midpoint, Maandi at its beginning, PDF p. 47 |
| Special lagnas | BL 1 degree/4 min, HL 1/2 degree/min, GL 5/4 degrees/min; sunrise Sun longitude |
| Varga variants | Exactly chapter 6's mappings; D-30 is unequal; D-60 starts from the occupied natal sign |
| Boundary assignment | Exact boundary belongs to the following interval; longitudes normalized to [0, 360) |
| Sign dignities | Sign flags retained alongside fine half-open degree zones for the seven classical bodies; no invented node degree zones |
| Natural relationships | Seven-planet table reconciled with its stated derivation; no invented node friendships |
| Chara karakas | Eight; Rahu reversed, Ketu excluded; exact ties retained with skipped ranks |
| Node aspects | Ordinary seventh aspect only; no additional node-specific graha aspects assumed |
| Rasi co-lords | Scorpio Mars/Ketu and Aquarius Saturn/Rahu, hierarchy from PDF pp. 183–186 |
| Co-lord dispositor | Classical seven-planet dispositor in the influence-count step, avoiding recursive co-lord selection |
| Equivalent dasha co-lords | Same-sign co-lords with equal comparison keys use the classical name; all numeric downstream results coincide |
| Varga strength tie-break | Uses original natal within-sign degree, reversed for nodes; not an invented physical longitude in a varga |
| Arudha exception | If projection lands in first/seventh, take tenth from that projection |
| Ashtakavarga variant | Book Tables 19–26 (Parasara); 1 denotes a favorable rekha |
| SAV | Sum of Sun through Saturn, excluding lagna BAV; invariant total 337 |
| Reduction occupancy | Seven classical bodies by default; nodes selectable. Equal occupied/empty pair reduces the empty value to zero (BPHS 68); legacy unchanged option explicit |
| Nakshatra dasha year | 360 fixed days by default; optional 365.2425 model is explicitly labelled |
| Rasi dasha year | Time for sidereal Sun to move 360 degrees; fractional years solved as solar arcs |
| Dasha intervals | Half-open [start, end); zero-length periods are retained as bookkeeping |
| First dasha | Full beginning before birth retained; balance is not mistaken for full MD when computing AD/PD |
| Narayana own-sign exception | Own sign gives 12 years; maximum confirmed by Rath, Narayana Dasa p. 39 |
| Narayana second cycle | 12 minus first-cycle length; 144-year arithmetic envelope, not an assertion of human lifespan |
| Saturn/Ketu seed conflict | Explicit precedence required if both occur; no unannounced winner |
| Kalachakra | Nine MDs from birth period; Uttara Bhadrapada Savya-2 / Revati Savya-1 confirmed by BPHS 46.56–65; bphs_confirmed default |
| Ashtottari applicability | Computable, but not automatically chosen over Vimsottari; the book discusses competing applicability rules |
| Kendradi/Sudasa/Drig subperiods | Strict default rejects depth above zero; explicit narayana_extension option enables the unsourced subdivision |
| Tajaka returns | Natal birthplace; annual 360-degree, monthly 30-degree, submonthly 2.5-degree exact solar arcs |
| Patyayini | Fixed 365.2425-day year, as printed on PDF p. 358; tied Krisamsas require a separate convention |
| Mudda/Varsha Narayana | Solar arcs, with 120:1 compression; partial first period retained |
| Sahams | A-B+C, add 30 degrees if C is outside the forward B-to-A arc; boundary endpoints count as inside |
| Tajaka house points | Ascendant degree plus whole-sign offsets, as used in Example 121 |
| Tajaka aspects | Both individual orbs must cover the other planet; actual speeds describe local application/separation |
| Aspect perfection | Current Ithasala pairs tracked with actual ephemerides, 0.125-day sampling up to 60 days, stopping at sign change; not a proof that no unsampled root was missed |
| Sensitivity | Finite sampling, reported step; no claim of exact rectification or proof that no intermediate boundary was missed |

For direct API access, the sign order is `Ar Ta Ge Cn Le Vi Li Sc Sg Cp Aq Pi`, indexed 0–11. A call such as `core.lon('Sc', 12, 58)` uses exact rational arithmetic. Ephemeris-derived inputs remain floating-point astronomical estimates; exact arithmetic cannot remove their observational uncertainty.

All returned dates can carry microseconds because the datetime format supports them. This is **computational precision, not evidence of microsecond astronomical or birth-time accuracy**. Fixed 360-day years are implemented as elapsed 24-hour days; leap seconds can produce a few seconds' distinction from a civil-calendar hand calculation.


## Added profiles in version 0.2.0

| Item | Choice and scope |
|---|---|
| Ashtakavarga formula | `pvr_2001` replacement default; `bphs_translation` subtraction alternative for larger empty sign. Profile returned with every result. |
| Vimsopaka | BPHS chapter 7 weights, each group sums to 20; own/friendship viswa scores. Default temporary-relationship frame D1; `varga` available. Exaltation is not silently treated as own sign. |
| Shadbala | Raman/Sripati component formulas, all intermediate values exposed; scores are traditional units, not physical forces. |
| Shadbala Saptavargaja | Default own 30, great friend 22.5, friend 15, neutral 7.5, enemy 3.75, great enemy 1.875; moolatrikona 45 only in D1. `bphs_translation` changes this point table only. |
| Shadbala relationships/nature | D1 compound relationships; Moon benefic from tithi 8 through 23 (`raman_tithi8_to23`); Mercury nature depends on conjunction. Other chart modules use the separately disclosed waxing-Moon convention. |
| Directional strength | Actual MC and ascendant axes, not a whole-sign substitution for MC. |
| Ayana and Cheshta | Raman's approximate kranti curve and historical mean/seeghrochcha inputs. Sun Ayana and Moon Paksha doubled; their separate Cheshta entry is zero to avoid double counting. |
| Historical mean motions | Default `raman_linear_chapter`, restricted to 1800–2100. `raman_linear_table` changes Venus secular coefficient; caller-supplied motion inputs supported. All coordinates shifted consistently to the selected sidereal frame. |
| Strength time lords | Raman's condensed ahargana, 360-/30-day cycles; 12 daytime and 12 nighttime temporal horas. This differs intentionally from the book's ordinary panchanga hora. |
| Planetary war | Default Raman longitude winner for the five eligible bodies within 1 degree; traditional fixed disc constants; simultaneous pair transfers use one pre-war baseline. Exactly tied longitudes require a decision. API can omit war scoring explicitly. |
| Required Shadbala | BPHS minimum virupas Sun/Moon/Mars/Mercury/Jupiter/Venus/Saturn = 390/360/300/420/390/330/300; Raman minimum profile changes Sun to 300. |
| Combustion | Separation strictly below limit: Moon 12°, Mars 17°, Mercury 14° (12° retrograde), Jupiter 11°, Venus 10° (8° retrograde), Saturn 16°. These are conventional thresholds. |
| Additional avasthas | `literal_all` Mudita default; `any_condition` option. Lajjita uses any listed malefic; Kopita uses combustion to specify closeness. |
| Natal yoga catalog | D1 only, with individual D9 dependencies where stated; classical house lords. Unknown conditions produce `conditions_pending`. |
| Yoga planet set | Nodes included where generic affliction language is used; Nabhasa shapes/counts use the seven classical bodies. API `include_nodes` controls the general set. |
| Nabhasa occupancy | Every listed house must be represented; other Nabhasa formations suppress Sankhya. This strict occupancy interpretation is a declared policy. |
| Yoga strength/deep exaltation | Chart workflow uses Shadbala ≥ its requirement; standalone API accepts a declared strength map. Deep exaltation tolerance defaults to exactly zero. |
| Tajaka Panchavargeeya | `pvr_tajikasara`: constant twofold friendship plus PVR's Parasari D3 ruler. Historical twofold/threefold/fivefold profiles use Chaldean decans. Maximum 20. |
| Tajaka Dwadasavargeeya | PVR D1..D12, constant twofold friendship; own/exalted precedence over other sign relations. |
| Year lord | Benefic-aspect pool first, then malefic, then strength ≥15, then first candidate. Highest strength wins; tie tolerance default zero; more candidacies breaks a tie, unresolved ties stay unresolved. |
| Monthly lord | Adds separately selected annual lord as sixth candidate. The same monthly selection treatment for submonthly returns is an extension, not independently verified as a separate textbook procedure. |
| Tajaka Nakta / Duhphali / Durupha | Defaults PVR applying-to-both / historical slower-strong / literal dusthana-plus-impairment; standalone API exposes alternatives. |
| Bhavishya | Separate static-orb candidates where outside present orb by at most 1 degree; fixed-partner approximation disclosed. Future ingress positions and strengths are actually recomputed for Gairi-Kamboola/Thambira. |
| Exact aspect instant | `track_perfection` recognizes perfection at start. The application classifier uses strictly closing/separating motion, so an exact instant need not be in its current-applying candidate list. |
| Calendar | New-moon-based amanta Table 4 naming. Solar ingresses identify adhika, subsequent nija and omitted-month/kshaya cases; civil festival observance is separate. |
| Electional | Eight Table 79 presets; parenthesized entries opt-in; sampled instants only. Day starts at sunrise. |
| Rectification evidence | Vimsottari MD lord's natal varga house is the declared feature; training scores rank; holdout scores do not. No exact-time or probability claim. |
| Forecast evaluation | Binary Brier score and preselected fixed baseline; every forecast needs an outcome. Timestamp declarations are not independently authenticated. |

### Chart JSON options versus direct Python options

`chart` accepts `ashtakavarga_options`, `relationship_frame` (Vimsopaka only), `mudita_policy`, `strength_motion_model`, and `strength_motion_inputs`. `return` additionally accepts `tajaka_profile`, `year_lord_tie_tolerance`, and `track_tajaka` (default true). More specialized policies are arguments of `strengths.shadbala`, `yogas.evaluate` and `tajaka_yogas.evaluate`; they are not all exposed as CLI flags.

Example extra fields in a birth JSON:

```json
{
  "ashtakavarga_options":{"profile":"pvr_2001","include_nodes":false,"equal_one_occupied":"zero"},
  "relationship_frame":"rasi",
  "mudita_policy":"literal_all",
  "strength_motion_model":"raman_linear_chapter",
  "tajaka_profile":"pvr_tajikasara",
  "year_lord_tie_tolerance":0,
  "track_tajaka":true
}
```

These are fields to add to a complete birth specification, not a standalone chart input. Record any change to a policy before interpreting the resulting difference.

## Added profiles in version 0.3.0

| Item | Declared choice |
|---|---|
| Strength audit | Three charts, seven planets, six components and total compared with unmodified PyJHora 4.8.7; numerical discrepancies retained. `0.05` is a diagnostic tolerance, not proof of full equivalence. |
| Moola scope | Rath's 1999 Lagna Kendradi Graha Dasa; D1 mahadasas only; first full period starts at birth. |
| Moola duration | `rath_1999_table` default reproduces the worked table; `rath_1999_prose` exposes the opposite dignity adjustment. Negative first durations use absolute value; zero resets to the full Vimshottari allotment. A negative second-cycle complement raises an error. |
| Moola nodes | Duration targets Aquarius for Rahu and Scorpio for Ketu, as this article specifies; other chart modules retain their own published dignity table. |
| Moola ranking | Occupancy, best occupant dignity, modality, greatest degree advancement, then dispositor dignity; natural friendship for intermediate dignities; unspecified node friendship gets a disclosed neutral rank. These details are operational choices where the article is incomplete. Nodes use reversed advancement except the explicit Saturn/Ketu ascendant-precedence comparison. |
| Moola ambiguity | Exact ties require reviewed order/precedence. An order override must contain all nine planets and respect the house-group order. Its use and ranking evidence are returned. |
| Moola year conversion | CLI defaults to solar arcs as a project choice; `--year-model savana360` or `365.2425` is available. The source article does not specify civil-date conversion. |
| Raaja closeness | Degree advancement gap at most 6 degrees, matching the author's approximate guide; `yoga_close_orb` changes it explicitly. Wide association weakens, rather than erases, the base combination. |
| Functional nature | Table 30, PDF 153, transcribed from the page image. Variable Moon classification retained for Aries, Libra and Capricorn; nodes remain unclassified. |
| Yoga review | Seven named exception/interaction summaries; selected participant evidence and lunar/day-night guidelines. No generic weighted hierarchy resolves every simultaneous indication. |
| Tajaka modifiers | Explicit Radda-to-Duttota example takes precedence when no other adverse modifier competes. Other mixed configurations remain for review. Ephemeris failure to establish perfection stays visible. |
| Personal tara | Janma is mixed, not automatically good; 3/5/7 adverse and 2/4/6/8/9 good. Both `good` and `not_adverse` are exposed. |
| Task timing | Known task duration compresses the full 120-unit sequence to supplied elapsed days, with a full first MD (PDF 410–411). Without a duration, ordinary lunar balance and the 360-day year apply. |
| Electional judgments | Exact per-task yoga/karana lists, natal-hora assessment, overall chart strength and first-dasha favorability remain caller-declared where the PDF provides no unique formula. Omission means unknown, not approval. |
| Divisional strength evidence | Dn house lord/occupancy/aspect evidence is accompanied by the physical D1 Shadbala ratio; no invented Dn physical longitude or separate physical Shadbala is created. |

`moola_options` and `electional_options` are accepted in the input JSON. See `INPUT_FORMATS.md` for examples. Each electional report is evidence for review; negative guideline checks are not converted into claims that an event will fail.

## Added or clarified profiles in version 0.4.0

| Item | Declared choice |
|---|---|
| Yoga Mercury nature | Source majority convention; equal nonzero conjunction counts remain unresolved and generate both scenarios. Raman strengths retain their separate `any_malefic` convention, now identified in metadata. |
| Maalaa/Sarpa/Vasumati | Base placement is distinct from weakening/full-result qualifications. A weakening condition no longer erases a structurally present combination. |
| Advanced Raaja 2–3 | Benefic aspect is required; conjunction is not substituted. |
| Five incompatible entries | Gola, Advanced Raaja 7/13/17 and Kulavardhana carry profile notices. Finite proofs are conditional on the selected precedence, D2, aspects and node policies. No silent source emendation. |
| Catalog review | All 170 entries receive a review row. This does not imply a complete participant-strength model for every branch. |
| Interpretation decisions | `retain_conflicts_v1`: no numerical voting; sourced overrides must be acyclic and definitely active. Unknown conditions stay pending. |
| Moola subdivisions | Strict default remains mahadasas only. Opt-in `experimental_cycle1_weights` uses first-cycle order/weights recursively through depth 3, including second-cycle parents. This is a software-derived hybrid, not verified Rath/Rao authority. |
| Strength reconciliation | Native reference totals remain unchanged. Recomputed circular terms are labeled diagnostics and are not substituted as an independent benchmark. |
| Cohort scoring | Whole-person train/holdout split; training-person-average prevalence baseline; equal weight per holdout person; approximate percentile bootstrap across people. No automatic validity label. |

The 0.3.0 Moola scope statement above is historical; the 0.4.0 opt-in adds experimental arithmetic without changing the default. `RESEARCH_CLOSEOUT.md` records the evidence and exact remaining dependencies.
