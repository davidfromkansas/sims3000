# SIMS3000 current fidelity audit

Reviewed 2026-09-13 against the supplied manual, the current `dist` modules, and the latest 112-suite regression run. Save schema: 89. This is a playable reconstruction with substantial incomplete scope, not verified full SimCity 3000 Unlimited parity.

The manual describes behavior but does not expose all simulation formulas. Numerical calibration, one-tile RCI buildings, the 48 × 48 map and adapted browser controls must not be presented as recovered original algorithms.

| Manual area | Current playable behavior and source evidence | Remaining fidelity work |
| --- | --- | --- |
| Starting and navigating a city, pp.10–42 | `terrain-generator.js`, `new-city-ui.js`, `navigation-map.js`, `save.js`: new terrain, difficulty/start year, mayor, paused restoration, navigation/data maps, validated portable saves | Larger map sizes, original shipped city collection and complete setup/presentation options |
| Roads, zones, terrain and power, pp.43–52, 97–101, 114–116 | `engine.js`, `landscape.js`, `power.js`: drag construction, RCI densities, power networks, capacity/aging/overload, terrain editing and technology dates | Original lot-size/building catalog and exact growth, demand and service rules; four-direction art |
| Water and garbage, pp.102–105, 117–120 | `utilities.js`, `conservation.js`: network-local supply, towers/desalination/treatment, conservation, landfill/recycling/incineration/waste-to-energy; `waste-accounting.test.mjs` checks flows | Original tuning and annual production histories; no hydrological pollution transport |
| Finance and neighbor deals, pp.86–92, 121 | `economy.js`, `region.js`, `business.js`: taxes, annual budgeting, funding, loans, actual utility trades, casino and toxic-waste offers/income/harm | Full neighboring tile-level cities, broader negotiation and business catalogs, complete original balance |
| Transport, pp.93–96 | `transport.js`, `rail.js`, `highway.js`, `tunnels.js`, `facilities.js`: road/bus/rail/subway/highway routes, bridges, tunnels, ports, airports; actual commuter loads drive vehicle visuals | Full geometric/bridge variations and original route rules. Visual cars and trains are samples, not individual schedules |
| Public safety, health, education and aura, pp.106–113 | `civic.js`, `health.js`, `education.js`: funding/strikes, coverage, jail effects, crime, fire risk, health targets, youth/adult education and policies | Individual and neighborhood demographic detail, complete ordinance/advisor/petition catalogs, original civic footprints/capacities |
| Disasters, pp.106–111 and disaster reference | `emergency.js`, `locusts.js`, `riots.js`, `space-junk.js`, `toxic-cloud.js`, `whirlpool.js`, `ufo.js`: all nine currently exposed disaster types, warnings where supported, response/recovery, seeded random events and saved continuity | Exact original event behavior, pacing and warning coverage. Current paths, chances and damage rules are tuned recreations |
| Rewards, landmarks and architecture | `rewards.js`, `landmarks.js`, `building-art.js`: three reward types, four landmarks, multiple original generated building sprites | Complete landmark/reward/building catalogs and architecture sets; original four-view building art |
| Snapshot albums, pp.63–65 | `snapshots.js`, `snapshot-frame.js`, `snapshot-files.js`: movable frames, captions, chronological album browsing, PNG download and portable album import/export | Original album-file compatibility; browser albums are separate from city files and bounded to 50 photos |
| Building replacement, pp.72–84 | `building-replacement-ui.js`, `building-art.js`, `building-designs.js`, `building-designer-ui.js`: previews, citywide substitution, custom tower creation, portable model files, revert and saved overrides | Four tower style slots with custom procedural models/import/export; original building-file compatibility, larger replacement library and free-form block editor |
| Reports, pp.64–71 | `reports.js`, `reports-ui.js`, `report-breakdowns.js`: data layers, 1/10/100-year histories, income/waste/power/workforce breakdowns | Annual water production and broader chart presentation. Historical implementation notes are not evidence of missing current maps |
| Scenarios and creator, pp.24–26, 155–197 | `scenarios.js`, `custom-scenarios.js`, `scenario-events.js`, `scenario-text.js`: five original prepared challenges, custom goals/streaks, repeated/conditional events, outcome messages, live values, portable challenge cities | Shipped scenario catalog, full variable/block/command language, remaining structure query types, scripted actions and general ranks/dialogs. Current editor is a subset |
| Presentation and sound | `renderer.js`, `game-audio.js`: original sprites, procedural traffic/disaster motion, muted-by-default effects and volume | Full soundtrack/effects, broader animation, four-facing sprites and continued visual/performance refinement |

## Evidence limits

The regression suites prove specific invariants, not complete manual fidelity. The latest run passed 112 suites, including real construction/simulation recovery exercises, save migration, event continuity and citywide replacement behavior. Separate browser checks cover selected rendered workflows: navigation, sound controls, photos, message insertion, skyline rendering, train pause and replacement previews. No blanket claim of cross-browser, mobile or whole-game acceptance follows from those checks.

Player acceptance is still pending. No silence or automatic continuation has been treated as positive feedback. The six in-game milestones provide exercises and locally saved notes; notes are not automatically transmitted.

## Next substantial fidelity priorities

1. Deepen the Scenario Creator with remaining state and structure queries, scripted actions and variable/block execution. Preserve current custom challenge compatibility.
2. Refine the connected age census, workforce, education and health model against manual behavior; preserve transparent calibration limits and expand neighborhood demographic detail.
3. Expand the original building, landmark, reward, business and ordinance catalogs while making building replacement/import useful beyond four tower styles.
4. Refine network, disaster, neighbor and simulation behavior against manual examples; retain explicit distinctions between documented rules and tuned coefficients.
5. Continue four-direction artwork, sound/music and performance/accessibility work alongside the gameplay systems.

These priorities do not narrow the original goal or redefine completion. Full completion remains unproven until every requested manual area has implementation and acceptance evidence.

## Ordinance scenario checkpoint
The creator now checks enacted/repealed state for every implemented ordinance, in goals and conditional events (manual p.188, “Ordinance Status Is”). State choices use labeled menus; sustained goals reset when a required policy changes. Policy states and conditions survive city export/import. The full scripting language and unimplemented ordinance catalog remain outstanding. Verified with scenario-ordinances tests and a browser-created conservation goal plus fire-code-repeal event.

## Neighborhood scenario checkpoint
Structure-count goals and event conditions can use a center coordinate and inclusive circular tile radius (manual p.186, Count Generic/Specific Structures Near). Supported counts cover developed RCI, farms, clean industry, occupied homes missing utilities, business buildings and landmarks. Farms and multi-tile landmarks/businesses count once at the origin. Separate neighborhoods may repeat a metric, while duplicate metric/area goals are rejected. Full generic/specific structure catalogs and original radius geometry remain unverified. Save schema 59 protects area semantics from older clients. Tests cover radius boundaries, local loss resetting a sustained goal, saved victory, local conditional fire, whole-farm counting and malformed areas; browser controls verified independent goal/event areas and coordinate conversion.

## Generic structure query checkpoint
Scenario goals, conditions and live message values can now count every currently implemented ploppable structure type, including civic services, water/waste utilities, power plants, transit stations, parks/recreation, rewards, business buildings, landmarks and developed airport/seaport plots. Counts work citywide or within the existing local radius. Placed buildings qualify without operating services, distinct from active-facility metrics. Multi-tile objects count once at their origin; rubble and radiation are excluded. Goal/condition menus group the enlarged catalog. Regression covers real construction, facility development, save restoration, local root counts and demolition. The abandoned-building query remains pending because ordinary RCI abandonment history is not yet preserved; vacant zoning must not be mislabeled as an abandoned building.

## Abandoned RCI checkpoint
Schema 60 retains abandoned development level separately from occupancy. Service loss, demand collapse and toxic-cloud evacuation preserve former RCI buildings; their sprites fade and show an A marker, while Inspect reports abandonment and zero occupancy. Growth clears the marker, demolition clears the building, and fire can destroy it. Empty zoning is not counted as abandonment. The creator supports citywide/local abandoned-RCI maximum goals and conditions, counting a farm once at its barn. This supersedes the earlier pending ordinary-RCI abandonment query note. Older saves cannot recover history they never stored and migrate without inventing it. Separate airport/seaport abandonment persistence remains unimplemented. Verified normal service-loss abandonment, restored-road/power/jobs recovery, saved continuation, bulldozing/fire destruction, evacuated tower art, validation/migration, and rendered faded tower markers.

## Scenario announcement checkpoint
The creator schedules plain-text news announcements with existing monthly conditions and repetition (manual p.189, Show a Newsticker). Messages support live-value expansion and are captured at delivery, shown in the news bar for at least ten seconds of subsequent non-emergency monthly updates, and retained as the latest message per event in Scenario status and schema 61 city saves. Delivery does not start an emergency or replay after loading. Event progress is autosaved on announcement delivery. Authoring text is limited to 500 characters and rendered expansions to 4,000; text is escaped in the report. This is the news action only, not full scripted popup dialogs or the complete VM. Verified actual monthly dispatch, repeated/conditional delivery, saved snapshots/no duplicate, plain-text report rendering and browser-created announcements.

## Neighborhood goal navigation checkpoint
Scenario status offers View goal area for each local objective. The map centers the actual world coordinate across rotation/elevation and highlights every included tile using the same inclusive-radius predicate as the count. A dismissible map control identifies center/radius; changing construction tools retains the guide, changing cities clears it. Snapshot capture excludes this temporary guide. This is player navigation, not the manual’s general scripted Move And Zoom action. Verified centering across 36 rotation/zoom/location combinations, immutable city state, status-to-map browser flow, rendered highlighted tiles and dismissal.

## Health and workforce checkpoint
The manual p.68 explicitly links longer life expectancy to a larger workforce. Transport allocation now uses a health-sensitive participation share instead of a constant half of residents: 50% at life expectancy 59, plus 0.4 percentage points per year, within validated life-expectancy bounds 45–90 (44.4–62.4% participation). These coefficients are original calibration, not recovered algorithms. Residents remain unchanged; additional workers compete for existing reachable jobs and can be unemployed. Population reports show the health contribution, and health guidance explains the relationship. Tests cover actual connected hospital care over time, changing participation and job-route loss, population accounting and save restoration. Full age cohorts, age-specific education and original retirement/participation behavior remain incomplete.

## Age-specific education checkpoint
Education now retains eight age-band EQ values (0–14, 15–24, ten-year adult bands through 65–74, and 75+), reports each, and moves learned knowledge forward through a monthly graduating intake. Schools/colleges teach the two young bands; libraries/museums slow decay in adult bands. City EQ is derived from the retained bands and continues driving crime and clean-industry conditions. Schema 62 saves the array; older saves initialize bands from their recorded youth/adult averages without inventing historical differences. This realizes the age-EQ chart and persistence described on pp.68,112–113. Band turnover, 25/75 aggregate weights and equal adult-band weighting are calibration; no population age census, births/deaths or age-specific employment allocation is claimed. Tests cover delayed propagation, retention, lasting schooling history, saved continuation, invalid values and migration. Browser report verified eight distinct values and labeled meters.

## Annual electricity checkpoint
Power allocation now records delivered domestic output, imports, exports and local demand served per connected grid. Source contributions are apportioned by available plant capacity within that grid; unused capacity does not count as delivered generation. Each simulated month records a supply snapshot before zone growth and waste processing, using the waste-to-energy fuel available for that step. Schema 63 history retains total and nine source fields. Reports show actual recorded last-12-month totals, source shares, trade flows and partial coverage; historical graph options expose those records. Missing older records remain missing. This addresses manual p.68 annual electricity output in game energy units; it does not claim kilowatt-hours, detailed generator dispatch economics or gross wasted thermal output. Tests verify conservation, islanded unused plants, demand conservation, proportional mixed sources, import/export balance, waste fuel and history roundtrip; rendered annual report verified.

## Scripted reward checkpoint
The creator implements Offer Reward from manual p.188 as a timed/conditional/repeating event for each implemented reward. It grants the existing persistent placement permission, leaving the player to choose location and pay construction/upkeep. Natural unlock conditions need not be met; already-earned offers are idempotent and retain their first grant date. Normal uniqueness, service benefits and rebuilding rules apply. Schema 64 saves event definitions and grant history. Tests cover early unlock, actual placement, no charge on offer, repeated/saved grants, rebuilding and policy conditions; browser-created Stadium offer verified in Rewards. This adds a documented reward action; no new reward assets/catalog entries or complete general script VM were added.


### Scripted business proposals
Manual p. 188 Offer Business Deal is supported for the two implemented businesses. Timed or conditional events present a casino or toxic-waste proposal without accepting it, placing a building, or paying income. Explicit repeats may reoffer declined proposals before natural eligibility; pending and accepted permits remain unchanged. This reoffer policy is original implementation tuning. Save schema 65 preserves definitions and proposal decisions. The full business catalog and scenario scripting language remain unfinished.


## Scenario popup checkpoint
Manual pp.163,188 Pop Up Message now supports authored timed/conditional/repeating plain-text popups with an optional Scenario status button. Delivery pauses normal play through the existing modal; emergencies wait while it is open. Expanded values are captured at delivery, retained in status, and saved before display. Unread messages return after loading; dismissal persists acknowledgement. Pending popups prevent later scripted events from overwriting them. Schema 66 validates acknowledgement history. Presenter portraits/moods, sub-month timing and the full script VM remain unfinished. Also removed an out-of-scope result reference from the emergency update loop, which could interrupt tornado/earthquake/fire updates.


## Scenario pace checkpoint
Manual p.189 Set Scenario Speed is represented by custom challenge starting pace (1×, 3×, 8×) and an optional running-pace lock. New authored challenges start at that pace after their briefing closes; imported/reloaded cities stay paused. Scenario status includes a resume action, keyboard resume uses the configured pace, disallowed speed buttons are disabled, and disaster recovery respects the active policy. Pause remains available for construction/reading as an explicit reconstruction choice. All running paces unlock after scenario completion. Schema 67 preserves policy and defaults earlier definitions to normal/unlocked. General script commands changing speed mid-scenario and exact original timing remain unfinished.


## Scenario sound checkpoint
Manual p.188 Play Sound is implemented as timed/conditional/repeating events selecting three original synthesized cues: civic bell, celebration and warning pulse. They use the existing audio unlock, volume, mute and hidden-tab rules. Emergency alerts take priority over simultaneous scripted sounds. A text notice and event history remain available when muted; delivery progress is autosaved and historical sounds never replay on load. Sound settings provide previews. Schema 68 retains selected cues. This does not include the original sound catalog, music or arbitrary audio imports.


## Scripted camera checkpoint
Manual p.188 Move And Zoom City View now supports timed/conditional/repeating camera events with a map location and 40–250% zoom. The actual terrain tile centers correctly across all four rotations, preserving orientation. Delivery switches to the city view and Inspect tool and cancels unfinished drag input. Players retain pan/zoom control; Scenario status can revisit the authored location without advancing event progress. Emergency framing takes priority over simultaneous camera events. Delivered history is saved; loading does not replay camera movement. Schema 69 retains targets. Smooth camera travel, associated advisor presentations and general sub-month scripting remain unfinished.


## Grouped scenario actions checkpoint
New editor challenges default to grouped eligible actions, allowing camera, popup, sound, reward and business actions in one simulation month. Equal due dates follow authored row order. All delivered occurrences persist; multiple popups are acknowledged sequentially and hold future groups. The last camera, sound and news action per group is presented. All reward/business offers apply. A triggered disaster ends dispatch for the month; remaining actions wait until a later simulation month after emergency recovery. Existing definitions without eventMode use the former one-per-month scheduler and retain distinct starting months. Schema 70 preserves this compatibility boundary. This is grouped monthly scheduling, not full script blocks or sub-month execution.


## Harbor animation checkpoint
Operating seaports now show original procedurally drawn isometric cargo vessels, using open-water paths to a map edge. Hulls, shaded container stacks and bridge superstructures follow the map projection through rotation; moving vessels show a wake. One visual vessel per port, capped at 12, loads at endpoints and travels at a linear quarter tile per visual second. Existing vehicle time freezes with pause, dialogs, hidden tabs, disasters and reduced motion. Routes are cached by recomputed statistics identity and disappear on lost service or blocked water access. Bridges are conservatively excluded from visual navigation because vessel clearance is not modeled; this does not alter the existing seaport economic eligibility rule. These vessels visualize operation, not a new cargo simulation or income stream. No new save fields.


## Harbor recovery scenario checkpoint
A fifth original prepared challenge, The harbor wakes, introduces the operating harbor and shipping visuals through a real broken water connection. The fixed starting city has 224 residents, §12,500, a developed coastal harbor, freshwater pump, pipe route with one missing tile, and waste collection. Restoring the pipe at displayed coordinates 20,21 activates the harbor immediately. Victory requires the original harbor, 400 residents and §5,000 for six consecutive months within 36 months; service loss resets the streak. The local goal links to the harbor on the map. Schema 71 supports the new scenario identifier. Tests include a full winning playthrough with ordinary construction and monthly ticks, saved victory, deterministic restart, interruption and deadline loss. This is original scenario content, not a shipped SimCity scenario.


## Population age census checkpoint
Schema 72 retains eight population age cohorts and the latest balanced monthly demographic flow. Aging transfers survivors between bands; fertility produces births; mortality depends on age and life expectancy. Net migration reconciles the resulting population with occupied housing. Reports show eight integer counts whose sum equals current population, plus fractional average births/deaths/arrivals/departures from the latest recorded month. Between ticks, current housing changes are projected read-only and their migration is recorded next month. Save/reload continues the same history; older saves initialize estimated ages without invented demographic records. Initial age mix, fertility, mortality and arrival mix are original calibration. Age-specific employment and population-weighted education are not yet connected; the existing health-sensitive workforce and separate EQ cohorts remain in place. Tests cover 120 monthly census balances, health effects, housing shrinkage/extinction, saved continuation and malformed/migrated records.


## Age-sensitive workforce checkpoint
The saved census now drives actual potential worker totals before road/transit job allocation. Under-15 participation is zero; age bands have distinct adult/older participation, with health scaling those rates. Calibration preserves 50% participation for the initial age mix at life expectancy 59; it is not a recovered SimCity formula. Population changes are reconciled before computing participation once per transport pass. Monthly demographic updates trigger refreshed routes so current statistics, saved restoration and reports agree. The workforce report shows rates/workers by age and separates age-mix effects from health effects. Age groups remain uniformly distributed across housing; age-specific education weighting is still pending. Schema 73 prevents older clients from silently using obsolete participation rules.


## Census-weighted education checkpoint
Education averages now weight each saved age-band EQ by that band’s current population. Youth and adult summaries use their respective resident counts; empty bands preserve their EQ history without contributing to city averages. Civic recomputation refreshes these values before crime/aura calculations. Teaching and adult-retention capacity divide by current youth/adult shares instead of the former fixed 25/75 split. The education report shows resident counts beside EQ and explains weighting. Schema 74 identifies this changed simulation behavior. Learning/turnover rates and the within-youth school/college split remain original calibration; each age band still shares citywide access rather than individual student histories.


### Harbor recovery: persistent abandoned facilities

Developed airports and seaports now retain their buildings after six months without required services. They appear faded and marked Abandoned; restoring road, power, water and the required facility conditions for six months reopens them. Bulldozing and disasters clear the entire footprint. Empty zoning is never counted as an abandoned building. A separate abandoned-facilities scenario metric supports local recovery goals; generic structure goals count standing abandoned facilities once at their origin. Save schema 75 preserves this state; older saves do not invent missing history. Timing and artwork remain original interpretations.

Feedback checkpoint: play The harbor wakes, let the port lose services, then repair its missing pipe. Is the difference between empty zoning, an abandoned port and an operating harbor clear?


## Census-linked education checkpoint
Manual pp.112–113 explains how childhood schooling follows Sims through life, with adult environments retaining knowledge. Monthly education now moves with the same surviving residents and graduating counts used by the age census. A large incoming cohort changes its destination EQ more than a small one; an empty age band cannot lend its former knowledge to new residents. Mortality and departures remove proportional knowledge, newborns enter at 30 EQ and migrants at 30 youth/40 adult EQ. These rates and entry values are original calibration, not documented original formulas. Teaching/retention runs before movement; final reports, crime and workforce-facing aggregates recompute afterward. Schema 76 preserves existing age EQ and census when migrating; no historical recalculation is invented.

Verified actual intake to an empty adult band, monthly idempotence, knowledge conservation through births/deaths and both migration directions, normal monthly saved continuation and older-save migration. The age-education regression now advances the actual census while checking lasting school history. Full regression: 98 suites.

Milestone 4 feedback exercise: expand schooling, run several years and compare age EQ with the census. Education should spread gradually with graduates while adult retention remains dependent on libraries and museums.


## Airport activity checkpoint
Operating airports now generate periodic original procedural aircraft overflights along the long axis of their footprint. Aircraft and terrain-following shadows render separately, with the aircraft maintaining a fixed world altitude through all four camera rotations. The existing visual clock respects pause, modal dialogs, emergencies and hidden tabs; reduced-motion settings omit aircraft. Routes are sampled at 1.2 tiles/second, with an eight-second gap and a maximum of eight airport streams. Flights fade outside the map at their boundaries. Service failure or demolition removes the stream, and restoring a still-developed facility resumes it.

These are activity indicators, not individual passenger schedules, takeoff/landing simulation or recovered original flight paths. Existing airport economic rules are unchanged. Browser inspection verified composition, rotation, movement and service-loss removal; automated tests cover real development/recovery, held-clock positions, map bounds, cadence, nonmutation and terrain-independent projection in four views.

Milestone 5 feedback exercise: develop an airport, run the city and pause while a flight crosses the map. Compare its readability with road traffic, trains and harbor ships.


## Milestone 6: sequential challenge stages
The creator now offers simultaneous goals or sequential stages. In sequential mode, the one-to-four goal rows are completed in order; repeated metrics allow increasing targets. The hold period applies independently to every stage, one stage can finish per monthly check, and missed active goals reset only the current hold. Completed stages retain their completion month even if the city later regresses. The shared deadline still applies, including victory on its final month. Required scheduled events still gate final victory.

Completed scenario stages is available to event conditions and live message values. Events observe stage changes on the following monthly check, so intermediate completions can introduce the next phase. Scripts stop at victory; authors use the win message for the final outcome. This is an original structured authoring interface toward the manual’s stateful scenario design, not an implementation of its full variable/block language. Schema 77 preserves stage history and migrates old definitions to simultaneous behavior. Goal-count help is collapsed so the author can reach setup controls sooner.

Verification: browser-authored two-stage challenge advanced one stage per month and won after the second; automated checks cover retained achievements, hold reset, duplicate metrics, stage-triggered news through normal ticks, save continuity, validation/migration, final-month victory and deadline loss. Feedback exercise: create a population stage followed by a treasury or cleanup stage and check whether the transition and retained achievement are clear.


## Building creation and reuse milestone
City desk → Building designer creates original procedural tower models with 4–24 floors, independent proportions, three roof choices, facade/window/accent colors and a four-direction preview. Models apply citywide to one of the four existing high-density residential/commercial style slots, including future development. Occupancy, jobs, costs and zoning remain simulation-owned. Models rotate with the world, retain abandonment fading, disappear with rubble, and can be reverted to original artwork. Selecting an existing library replacement clears the custom override.

Schema 78 carries the bounded model library in city saves. A separate compact SIMS3000 building JSON file can export/import a model; imports remain a draft until the player applies them. Inputs are validated and do not execute code or fetch assets. Earlier city saves get an empty custom library. Rendered models are cached as transparent sprites for each design/direction, with a bounded 16-entry cache, so dense cities do not rebuild geometry every frame.

This advances the manual’s building creation/replacement functionality, using an original model format and parameterized towers. Original game building-file compatibility, free-form block construction, additional building classes and the full original catalog remain unfinished. Browser verification covered editing dimensions/floors, rotating the preview, applying across a city, and rotating the resulting skyline. Automated tests cover file/city roundtrips, appearance-only behavior, saved simulation continuation, four-view geometry bounds, abandonment/rubble/replacement interactions, malformed files and legacy migration.

Feedback exercise: design a tower, apply it, rotate the city, export the design and reuse it in another city. Evaluate whether creating and managing the skyline feels clear and useful.


## Building layout milestone: editable height blocks
The building designer now supports a 10 × 10 north-up footprint with independent column heights from 0–24 floors. Zero erases a square, allowing courtyards, wings, disconnected sections and stepped masses. A parameterized tower can seed the footprint, and switching construction methods retains the current block draft. Mouse/touch strokes paint multiple squares as one undo step; keyboard arrows move the active square and Enter/Space paints. The layout has 20 undo snapshots, a clear action and a reset to the tower footprint. The preview remains beside desktop editing controls.

The geometry builder emits only exposed portions of walls, omitting faces hidden by equal or taller neighboring columns. Existing four-direction sprite caching, citywide style assignment, abandonment handling and original-artwork restoration apply. Block layouts use building-file version 2; existing parameter files remain version 1. Imports reject incompatible version/layout combinations instead of silently dropping geometry. City schema 79 retains the layout. Empty drafts can be edited but cannot be applied/exported until at least one square is occupied.

This advances the manual’s Building Architect functionality through height-column editing. Overhangs, sculpting arbitrary individual voxels, per-block textures, original building-file formats and the complete catalog remain unfinished. Automated checks cover immutable painting, parameter conversion, courtyards, exposed-wall bounds, four-view projection, city/model roundtrips, unchanged simulation outcomes, saved continuation and malformed layouts. No new browser interaction or visual acceptance claim is made for this checkpoint.

Feedback exercise: choose Paint a block layout, erase a courtyard, paint a taller wing, undo a stroke, then apply and rotate the city. Assess footprint editing and the resulting shape.


## Building surface painting milestone
Manual pp.145–147 describes surface paints, textures, brushes and contiguous fills. The block designer now has a surface brush and connected-fill tool, with original facade, brick, stucco, glass and roof-tile materials. Choose north/east/south/west wall or roof and paint a footprint cell; this applies to the exposed portion of that column's selected face. World-oriented materials remain on the same side when preview/city rotation changes. Fill follows touching faces of equal column height and original material; wall fills stay in one plane, roof fills can turn around obstacles. Hidden faces cannot be painted. This is column-face painting, not the manual's individual wall-tile editor.

Height and surface edits share the existing 20-step undo history. Construction-method switching preserves the block model and its paint draft. Clear and tower-reset clear paint, and undo restores both. Height edits retain paint for the column, including temporarily hidden faces. Procedural materials use the existing cached sprite renderer. Brick/stucco retain windows; glass and tile surfaces replace them. The palette is original artwork and is not the complete manual texture catalog.

Building-file version 3 and city schema 80 retain a validated 500-entry surface map; versions 1 and 2 remain importable without invented materials. Painting still changes appearance only. Tests cover coplanar and roof flood-fill boundaries, hidden faces, material barriers, geometry in all views and at maximum height, strict format validation, unchanged simulation and saved continuation. Full regression: 110 suites. No browser or visual acceptance test was performed this checkpoint.

Feedback exercise: paint a brick wing, fill a glass facade, add tiled roofing, undo a paint stroke, then apply and rotate the city. Compare the surface choices and editing workflow. Arbitrary voxels/overhangs, individual floor painting, detail/prop placement, original-file compatibility and the broader architect catalog remain unfinished.


## Stateful scenario variables milestone
The creator now defines four named integer variables, each with an initial value. Change scenario variable events can set, add/subtract or copy a citywide metric into a slot. Copy rounds to the nearest integer; all values saturate at ±1,000,000. Goals and conditions select Scenario variable 1–4, and messages use {variable1}–{variable4}. Status lists the author names and current values; event history retains the latest before/after values. Grouped events see earlier variable changes before testing later conditions. Existing occurrence limits, intervals, emergency pauses, popup acknowledgement and terminal scenario behavior apply.

This provides persistent counters and metric snapshots toward the manual's Variables Manager, Set Variable, Assign and arithmetic commands. It remains an original bounded authoring interface, not the original script VM. Four slots/actions, integer-only storage, no expressions, loops, arbitrary blocks, variable-to-variable arithmetic or configurable ranks remain limitations. A copied spatial metric is citywide; authors cannot select a copy region yet.

City schema 81 preserves variables and action history. Older definitions initialize four zero counters without inventing past actions; modern definitions missing saved values are rejected. Tests exercise an actual three-month counter victory, grouped dependent messages, population snapshots, save continuation, arithmetic limits, malformed definitions/history and legacy migration. Full regression: 110 suites. No browser acceptance test was performed.

Milestone 6 feedback exercise: name variable 1 Successful months, schedule a repeated Add 1 action conditional on a healthy city metric, and make the goal variable 1 ≥ 3. Add a message when it reaches 2. Check that progress remains recorded even when the qualifying city condition later fails.


## Authored scenario ranks milestone
Manual p.182 describes multiple ratings according to achievement and rank-specific result text. The creator now supports up to four ordered named ranks. Each applies to victory, deadline loss or either outcome, and can require one-to-four metric conditions using all/any, including local structure counts, saved variables and the new Elapsed challenge months metric. Empty conditions make a fallback. The first eligible rank is awarded after normal victory/loss resolution; ranks do not alter terminal conditions. If none match, existing completion-time ranks remain.

A 500-character result message expands live values at award time. Rank and expanded message remain fixed even if later city state changes. Scenario status shows the result and a collapsed list of available rank criteria; author text is escaped. City schema 82 preserves the selected rank index/message alongside the existing rank name, rejects incompatible award records and migrates older scenarios to an empty rank list with their standard rating retained.

Tests cover first-match priority, all/any conditions, real monthly early/deadline victory and loss, fallback/either outcomes, frozen messages, portable save restoration, escaping, malformed definitions/awards and legacy migration. Full regression: 110 suites. No browser acceptance test was performed. General-purpose script blocks and arbitrary scripted terminal commands remain unfinished; this is an original structured rank editor rather than original-file compatibility.

Milestone 6 feedback exercise: create a first victory rank requiring completion within six months, a second unconditional victory rank, and a loss rank recognizing partial progress via a saved counter. Compare the outcome message and available-ranks list after playing.


## Replayable authored challenges milestone
Beginning a custom challenge captures its exact simulation starting state, including terrain, buildings, treasury, calendar, policies, census, custom building art and history. Scenario status now offers Restart this challenge, Export playable start and Export current progress. Restart has an in-game replacement confirmation and export action, restores the original state paused, clears construction undo and resets goals, events, variables and rank progress. Export playable start produces a normal portable city file ready to replay, without altering the current attempt.

The embedded baseline shares tile field names across a compact value matrix (about 318 KB for a starter city, versus 1.13 MB for its ordinary city JSON). It contains no nested scenario; authoring over an existing challenge captures only the current simulation. Decode uses the normal full city validator and rejects nested baselines, wrong dates, malformed tile matrices and unexpected keys. City schema 83 retains this snapshot across progress exports. Older challenges without a snapshot stay playable but cannot reconstruct a missing original start.

Tests verify exact authored-state restoration after demolition, treasury changes and months of progress, portable deterministic replay, independent nonmutating exports, reset event/variable progress, bounded nonrecursive replacement and malformed/legacy behavior. Full regression: 110 suites. No browser acceptance test was performed. This advances reusable scenario distribution/replay using an original city-file representation; original scenario-file compatibility remains unfinished.

Milestone 6 feedback exercise: author a challenge, play several months, export progress, restart and compare the initial city. Export playable start and import it to confirm a fresh attempt while retaining the original challenge rules.


## Scripted scenario endings milestone
The manual's End Scenario command ends script execution and presents results. Authors can now schedule a one-time End scenario action with victory/loss, a result message, and existing all/any conditions. It stops remaining actions in the current group and further script delivery. The message captures live values when triggered. Monthly resolution applies the chosen outcome even if goals or stages remain incomplete, then awards the configured outcome rank. Random disaster checks are skipped on that terminal resolution.

Completion rule selects automatic goal victory (with ending events able to override) or scripted-only victory. Scripted mode still tracks progress goals; satisfying them alone does not win. An ending may run on the deadline itself. If no eligible ending triggers, the deadline remains a loss. Messages, outcome history and rank awards survive save/reload; replay clears the ending and restores the authored start. Schema 84 retains completion rules and validates terminal outcome/date against the recorded ending. Older definitions default to goal completion.

Tests cover real monthly conditional wins/losses, same-group variable-dependent ending, suppression of later earthquake/news actions, incomplete-stage victory, ranked outcome, saved messages, replay, exact-deadline victory, unmet-condition timeout, malformed progress and legacy behavior. Full regression: 110 suites. No browser acceptance test was performed. Conditions run on monthly simulation checks, not arbitrary original VM instruction timing; arbitrary block scripts remain unfinished.

Milestone 6 feedback exercise: use scripted completion, add a conditional victory and an early-loss condition, and place a later event after the ending. Confirm the result message, rank and halted event list.


## Ordinance petitioner decisions milestone
Manual pp.60–61 describes petitioners, advisor impact analysis, accepting/rejecting proposals and temporary dismissal. Civic services now opens eight original condition-driven policy petitions: free clinics, reading, neighborhood watch, fire code, clean air, power/water conservation and repeal of parking fines. They depend on resident population, current city conditions, applied policy and previous responses. Existing service-building briefings remain available.

Advisor analysis clones and recomputes the current city with only the proposed policy changed, presenting current/projected monthly operating balance, crime, aura, long-term health target and power/water demand. It advances no months and changes no live state. Accept applies the ordinance immediately; charges remain recurring monthly costs. Reject suppresses the request for 12 months, dismiss for six; an accepted request reversed manually can recur after six months if its condition persists. These periods, thresholds and petitioner identities are original tuning, not recovered original data. Latest decisions persist in schema 85 and in scenario starting snapshots; older cities initialize no decision history. All decisions clear construction undo so an unrelated undo cannot restore an outdated response.

Tests cover current conditions, nonmutating analysis, actual acceptance/repeal effects and cost timing, saved cooldowns through monthly ticks, manual policy resolution, empty cities, replay restoration and malformed/legacy records. Full regression: 110 suites. No browser acceptance test was performed. The complete original petitioner/advisor dialogue and ordinance catalogs remain unfinished.

Milestone 4 feedback exercise: open Civic services → Meet policy petitioners, compare free-clinic impacts, accept a proposal, dismiss another, and revisit after six months. Compare the budget preview with the enacted policy and health's gradual response.


## Regional neighbor economies milestone
Manual pp.62–63 describes neighbor populations and deals responding to both cities' needs. Four neighboring cities now retain population, treasury, power/water generation capacity, disposal capacity/storage and the latest monthly trade balance. Overseas ports have a separate aggregate disposal economy without a population. The regional table shows population, cash and available supplies. Neighbor residents receive utility capacity first; imports into the player city are limited to remaining surplus. Garbage exports reserve capacity for the neighbor's own monthly net waste; undelivered waste remains local. Imported garbage is limited to available neighbor waste, with payment based on actual delivered quantity. New offers are rejected when the neighbor has no applicable supply/capacity.

Regional settlement transfers contract payments into neighbor trade ledgers. Once per city month, neighbors receive local tax revenue, pay capacity upkeep, produce/process waste and grow or shrink with service availability. Connected cities have a modest growth benefit. High utilization prompts capacity investment from their own treasury. Recompute and reports never advance these economies. Neighbor shortage reduces delivered amounts without a player breach penalty; minimum buying fees remain in effect. Player export shortfall and broken-connection penalties are unchanged.

Population mixes, resource rates, prices, growth, costs and investment rules are original aggregate calibration, not recovered SimCity algorithms. Full neighboring tile maps, broader negotiated pricing and original regional trade dynamics remain unfinished. Schema 86 retains the economies; older saves initialize present-day neighbor estimates without inventing past growth.

Tests cover finite imports, waste retained locally, actual incoming-waste payment, neighbor ledgers, independent growth/investment, once-monthly advancement, mutation-free recomputation, rejection of unavailable offers, deterministic saved continuation and malformed/legacy data. Full regression: 110 suites. No browser acceptance test was performed.

Milestone 3 feedback exercise: connect to a neighbor, compare its surplus and disposal space, then observe its population and budget over time. Keep local reserve capacity so your city can tolerate lower import availability.


## Regional contract reviews milestone
New offers now use one of three price bands based on the neighbor's own capacity utilization: abundant below 10%, normal below 80%, tight at or above 80%. Base unit rates are multiplied by 0.8, 1 or 1.25 and rounded to cents. Prices remain fixed for signed contracts despite later changes in the neighboring economy. This is original calibration toward the manual's periodically updated deals, not recovered original prices.

After twelve months, Review new terms compares the existing rate with a new offer and allows a quantity of 25, 50 or 100. Keeping the current terms changes nothing; voluntary termination is already free after this point. Accepting renews the twelve-month term without an upfront fee, preserving the contract identity and connection. The new rate/quantity govern future deliveries and termination fees. A disconnected route, absent neighbor supply, invalid quantity or unfulfillable local export causes no renewal. The local capacity check recomputes the proposed contract and rolls back the exact prior region on failure.

Schema 87 stores the accepted price band and derives its rate on import. Old contracts without a band retain standard prices; arbitrary imported rate values cannot change the calculated rate. UI proposals and reviews share the same quote function. Active incoming-garbage receipts show actual deliveries.

Tests cover scarcity/surplus quotes, immutable existing rates, annual eligibility, exact failed-renewal rollback, preserved identity/funds, reset cancellation terms, saved price persistence, malformed bands, forged rate normalization and legacy contracts. Full regression: 110 suites. No browser acceptance test was performed. Fully negotiated prices, automatic neighbor-initiated offers and original trade formulas remain unfinished.

Milestone 3 feedback exercise: keep a deal for a year, compare its locked rate with current regional capacity, then review a smaller or larger quantity. Check whether keeping, ending or renewing the deal is clear.


### Connected outside markets — transport feedback checkpoint

Commercial and industrial plots now receive outside-market demand support only through reachable paid road/highway border routes, active stations on connected surface rail, or operating airports/seaports on their road network. Highway crossings require ramps. Broken routes, inactive stations and facility service failures remove support. Multiple routes to one land neighbor count once. Business queries identify reachable markets; Transport reports connected versus zoned plots. The city demand meter averages access across the sector, while monthly development uses each plot’s own access. With no sector zoning, the meter shows available potential.

Manual page 97 describes exporting industrial goods and bringing commercial customers through connections. The route allocation, station catchment, demand points and averaging are reconstruction rules, not recovered original formulas. This does not simulate cross-border commuters or individual cargo shipments. Schema 88 recomputes derived access on load; older city files remain supported.

Feedback exercise: inspect a business on a disconnected road, join that road to a paid border connection, inspect again, then remove a connecting segment. Check whether the access explanation and Transport totals make the economic effect clear. This advances milestones 3 and 5. Automated tests cover isolated/duplicate/broken connections, highway ramps, active rail stations, facility operation and save migration. No new browser visual acceptance claim is made.


### Expanded landmark collection — milestone 5

The landmark gallery now includes the Statue of Liberty and Big Ben alongside the Eiffel Tower and Great Pyramid. Both additions use original Imagegen gallery illustrations and separate original low-poly city models with four map orientations. The gallery explicitly distinguishes the illustration from the city model. The generated cutout attempts retained backgrounds and were not used as map sprites. Cached procedural drawings keep the city terrain visible and avoid per-frame mesh construction; tall-landmark culling preserves the upper structure when its base is below the viewport.

Both landmarks occupy 3 × 3 level, clear land, are available immediately, cost nothing, and have no upkeep or direct job/income effect. Each may appear once; whole-footprint demolition and disaster damage allow rebuilding. Named landmark scenario goals and the total-landmark count include all four types. Schema 89 recognizes the expanded tile catalog. Earlier cities remain loadable.

Manual pp.56 and 124 supply the landmark placement/uniqueness behavior; the choice of these additions, footprints and simplified artwork are reconstruction decisions. This is not the full original catalog or original game artwork. Offline Canvas-path renders were inspected in all four orientations and a tower-window occlusion issue was corrected. Regression tests cover placement, duplicate rejection, rebuilding, scenario metrics, saves and projection bounds. No browser acceptance check was performed.

Feedback exercise: place both landmarks, rotate the city four times, inspect them, then demolish and rebuild one. Try a custom challenge requiring both named monuments. Assess the silhouettes at normal game zoom and whether their size suits the surrounding neighborhoods.
