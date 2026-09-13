# SIMS3000 current fidelity audit

Current source: 183 regression suites, save schema 113. Publication after version 150 is pending explicit Sites source-export approval. This is a playable reconstruction with substantial incomplete scope, not verified full SimCity 3000 Unlimited parity. The opening table records the earlier schema-92 scope baseline; the implementation checkpoints below supersede its resolved gaps. A passing suite count does not establish complete manual fidelity.

The manual describes behavior but does not expose all simulation formulas. Numerical calibration, RCI lot-growth selection, selectable browser map sizes and adapted browser controls must not be presented as recovered original algorithms.

| Manual area | Current playable behavior and source evidence | Remaining fidelity work |
| --- | --- | --- |
| Starting and navigating a city, pp.10–42 | `terrain-generator.js`, `new-city-ui.js`, `navigation-map.js`, `save.js`: new terrain, difficulty/start year, mayor, paused restoration, navigation/data maps, validated portable saves | Dense-city performance acceptance, original shipped city collection and complete setup/presentation options |
| Roads, zones, terrain and power, pp.43–52, 97–101, 114–116 | `engine.js`, `landscape.js`, `power.js`: drag construction, RCI densities, power networks, capacity/aging/overload, terrain editing and technology dates | Original lot-size/building catalog and exact growth, demand and service rules; four-direction art |
| Water and garbage, pp.102–105, 117–120 | `utilities.js`, `conservation.js`: network-local supply, towers/desalination/treatment, conservation, landfill/recycling/incineration/waste-to-energy; `waste-accounting.test.mjs` checks flows | Original tuning and annual production histories; no hydrological pollution transport |
| Finance and neighbor deals, pp.86–92, 121 | `economy.js`, `region.js`, `business.js`: taxes, annual budgeting, funding, loans, actual utility trades, casino and toxic-waste offers/income/harm | Full neighboring tile-level cities, broader negotiation and business catalogs, complete original balance |
| Transport, pp.93–96 | `transport.js`, `rail.js`, `highway.js`, `tunnels.js`, `facilities.js`: road/bus/rail/subway/highway routes, bridges, tunnels, ports, airports; actual commuter loads drive vehicle visuals | Full geometric/bridge variations and original route rules. Visual cars and trains are samples, not individual schedules |
| Public safety, health, education and aura, pp.106–113 | `civic.js`, `health.js`, `education.js`: funding/strikes, coverage, jail effects, crime, fire risk, health targets, youth/adult education and policies | Individual and neighborhood demographic detail, complete ordinance/advisor/petition catalogs, original civic footprints/capacities |
| Disasters, pp.106–111 and disaster reference | `emergency.js`, `locusts.js`, `riots.js`, `space-junk.js`, `toxic-cloud.js`, `whirlpool.js`, `ufo.js`: all nine currently exposed disaster types, warnings where supported, response/recovery, seeded random events and saved continuity | Exact original event behavior, pacing and warning coverage. Current paths, chances and damage rules are tuned recreations |
| Rewards, landmarks and architecture | `rewards.js`, `landmarks.js`, `building-art.js`: three reward types, four landmarks, multiple original generated building sprites | Complete landmark/reward/building catalogs and architecture sets; original four-view building art |
| Snapshot albums, pp.63–65 | `snapshots.js`, `snapshot-frame.js`, `snapshot-files.js`: movable frames, captions, chronological album browsing, PNG download and portable album import/export | Original album-file compatibility; browser albums are separate from city files and bounded to 50 photos |
| Building replacement, pp.72–84 | `building-replacement-ui.js`, `building-art.js`, `building-designs.js`, `building-designer-ui.js`: previews, citywide substitution, custom tower creation, portable model files, revert and saved overrides | Four tower style slots with custom procedural models/import/export; original building-file compatibility, larger replacement library and free-form block editor |
| Reports, pp.64–71 | `reports.js`, `reports-ui.js`, `report-breakdowns.js`: data layers, 1/10/100-year histories, income/waste/power/workforce breakdowns | Broader chart presentation and browser acceptance. Manual p.68 specifies annual electricity and garbage totals, not an annual water chart. Historical implementation notes are not evidence of missing current maps |
| Scenarios and creator, pp.24–26, 155–197 | `scenarios.js`, `custom-scenarios.js`, `scenario-events.js`, `scenario-text.js`: five original prepared challenges, custom goals/streaks, repeated/conditional events, outcome messages, live values, portable challenge cities | Shipped scenario catalog, general variable/block/command execution and event-driven goal activation. Later checkpoints cover additional structure queries, ranks, presenters and scripted endings; the editor remains a subset |
| Presentation and sound | `renderer.js`, `game-audio.js`: original sprites, procedural traffic/disaster motion, muted-by-default effects and volume | Full soundtrack/effects, broader animation, four-facing sprites and continued visual/performance refinement |

## Evidence limits

The regression suites prove specific invariants, not complete manual fidelity. The earlier baseline run passed 116 suites, including real construction/simulation recovery exercises, save migration, event continuity and citywide replacement behavior. Separate browser checks cover selected rendered workflows: navigation, sound controls, photos, message insertion, skyline rendering, train pause and replacement previews. No blanket claim of cross-browser, mobile or whole-game acceptance follows from those checks.

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


### Larger agricultural estates — milestones 1 and 3

Farms can now occupy rectangular low-density industrial plots from 3 × 3 to 8 × 8 tiles. Initial development takes adjoining suitable zoning; an existing farm at least six months old may add one full eastern or southern row on quarterly checks. The barn retains its location and needs electricity/transport access. New fields require flat, vacant rural zoning, low land value/pollution, and fewer than three road-fronted sides. Fields retain the barn’s road-access exception. Growth will not consume developed lots or another farm.

A 3 × 3 farm retains 12 jobs, with one extra barn job per three additional tiles, up to 30. Tax, commuting and waste use that barn-only capacity. Queries show estate size and employment, and the Industry & farming guide explains expansion. The manual (pp.99,124) describes larger agricultural fields spreading beyond roads, but the 8-tile limit, rectangles, intervals and job scaling are reconstruction tuning. Farm formation also uses the barn’s local industrial demand support rather than borrowing inaccessible citywide market bonuses.

Variable-size estates retain farmRoot membership in schema 90; derived area is rebuilt on load. Original 3 × 3 farms remain valid. Missing fields or malformed rectangles dissolve the farm grouping; high value/pollution can convert it to manufacturing, and destructive disaster damage still affects the whole estate. Tests cover large formation, growth gates, remote fields, barn-only jobs, saved continuation, legacy cities, malformed groups and outer-field destruction. No browser acceptance test was performed.

Feedback exercise: zone a broad rural industrial district with roads near only its barn edge. Inspect a developed farm, add low-density zoning beyond its eastern/southern edge, and watch the agricultural tile and job counts over several months. Assess the pace and whether its footprint is easy to manage.


### Scenario calculations — milestone 6

Change scenario variable now offers a calculation between two operands, each selected as a constant or any current metric (including saved scenario variables). Supported operations are sum, subtraction, multiplication, division, percentage and an inclusive random integer range. Both inputs are read before the destination changes, allowing in-place calculations. Later grouped actions read earlier results. This permits relative-growth objectives, compound scores, ratios and reproducible random branches through existing conditions.

Results round to integers and saturate at ±1,000,000. Division/percentage by zero or unavailable/non-finite input records a skipped occurrence, retains the old variable, and shows the reason in event history. A later scheduled repeat can recover. Random endpoints round to integers and accept either order; the output derives from the saved city seed, month, destination and action index, preserving save/replay continuity without using global random state. As with other variable writes, the final result remains bounded.

The manual lists Add, Subtract, Multiply, Divide, Compute Percentage and Generate Random Number on pp.185–190. The operand picker, integer limits, error behavior and random generator are reconstruction choices. Schema 91 preserves calculation definitions and failure history. Existing set/add/copy events retain their behavior. This expands the structured editor, but is not the full original script VM: nested expressions, arbitrary blocks, additional variable slots and original-file compatibility remain unfinished.

Tests cover real grouped calculations and captured messages, metric/variable inputs, destination self-reference, rounding/saturation, zero-divisor saved failure and later recovery, inclusive deterministic random ranges, malformed definitions/history and older cities. No browser acceptance test was performed.

Feedback exercise: copy an initial population into Variable 1, repeatedly calculate current population as a percentage of Variable 1 into Variable 2, and set a goal of 150. Inspect the stored baseline and changing ratio in Scenario status. Try a zero baseline to assess the failure explanation.


### Named city library and larger-capacity storage — milestone 1

City desk → Saved city library stores up to 20 independent named snapshots, with load, download, rename, replacement and deletion. Loading validates the saved city and restores it paused, including a held emergency. Library labels are distinct from the actual city name. Save city and autosave retain their separate quick slots; they do not silently update a named snapshot. Players can keep alternative designs or several active cities without exporting every time they switch.

City persistence now uses IndexedDB instead of localStorage. City payloads and lightweight list metadata commit in one transaction; queued writes preserve save request order, and concurrent new entries cannot overfill the library. Existing localStorage quick/autosaves migrate only into empty slots; originals remain untouched, and an older copy never replaces a newer IndexedDB save. If database opening fails, startup can restore the legacy autosave with an explicit warning that it may be older and should be exported. Failed database writes show the existing Save failed message.

This advances the manual’s save/load workflow and removes the localStorage capacity bottleneck discovered while auditing larger maps. Map size remains 48 × 48; dynamic-grid simulation, coordinate-aware scenarios/rendering and larger-file limits are still required before larger maps ship. The browser library is local to this site/profile and is not cloud synchronization. Clearing site data removes it; portable JSON downloads remain available. No city schema change (91).

Tests use fake-indexeddb as a development-only dependency and verify real transactions through its IndexedDB implementation: migration, playable restoration, independent snapshots, rename/replace/delete, queued save order, concurrent capacity, reopening, malformed inputs and unavailable storage. All 115 suites pass. No browser acceptance test was performed.

Feedback exercise: save two different city layouts with distinct library labels, switch between them, replace one snapshot, and download it. Check whether it is clear which actions update a snapshot versus quick-save/autosave.


### Larger playable maps — milestone 1

New city setup now offers 48 × 48, 96 × 96, 128 × 128 and 256 × 256 maps. Terrain generation/sculpting, construction selection, fixed footprints, utility/transport networks, border connections, farm barns, map rotation, pointer picking and the navigation map use each city’s dimensions. Cities of different sizes can coexist in tests and library snapshots without shared mutable indexing. Starter-town views center on their developed homes.

Custom scenarios retain their map size. Goals, local conditions, ranks and camera coordinates validate against that map; structure/farm count limits scale with available tiles. Embedded starting snapshots and replay preserve dimensions. Schema 92 explicitly stores city size; earlier saves migrate as 48 × 48 without reshaping their terrain or indexes. City-file imports now accept up to 64 MB, and library metadata identifies map dimensions. Quick-save/autosave use the preceding IndexedDB milestone.

Rendering constructs and sorts only a conservative viewport region. Pointer picking checks a bounded area around the inverse projection and matches exhaustive picking on elevated terrain across rotations. These changes keep larger maps from requiring a complete map scan for every pointer movement or sorting every tile for every frame.

Measured on this development machine: a lightly occupied 256 × 256 city serialized to about 32 MB, with roughly 0.5 seconds per simulation month and 0.4 seconds for a save reload in an isolated starter test. A separate Node drawing-command exercise took roughly 6–11 ms per view, but used a stub Canvas and excluded rasterization/artwork cost; this is not a browser frame-rate claim. Dense cities, high-speed play and mobile performance remain unverified. Larger maps require more memory and may simulate more slowly.

All 116 suites passed. New integration checks exercise every map size, construction and utilities beyond the old boundary, regional demand routes, save continuation, old-city migration, simultaneous differently sized cities, large-map farm identifiers, scenario replay, rotated navigation and terrain-aware picking. No browser acceptance test was performed.

Feedback exercise: create a 96 × 96 city, build a serviced district near its far edge, connect a neighbor, save it to the library and load a compact city. Then return to the larger city and compare navigation and simulation pace. Try 256 × 256 when you want more room and assess responsiveness on your device.


### Large-city simulation responsiveness — milestone 1

Water coverage now visits each covered tile once per network using a multi-source eight-direction search. It preserves the seven-tile Chebyshev radius and nearest-pipe/tile-index allocation priority, including disconnected and overlapping networks. Road commuting reuses search arrays across households with per-search visitation markers; route costs, congestion, job allocation and household order remain unchanged. No save schema change (92).

A reproducible synthetic 256 × 256 grid with 1,472,256 residents, 1,617,840 jobs and pipes on every tile took about 5.5 seconds per month before these changes and 2.3 seconds afterward on this development machine. Recompute alone fell from about 1.35 seconds to 0.68 seconds. Run `node benchmarks/dense-city.mjs 256` to repeat the workload. This is an intentionally dense, unpowered routing/coverage stress fixture, not a naturally grown fully serviced city or a browser FPS measurement. Simulation still runs on the main thread; larger cities can still pause interaction, and high-speed/browser/mobile acceptance remains unfinished.

An offline differential check compared old/new transport and water functions across nine dense layouts (48/96/128 maps, three road spacings), with identical returned statistics and every tile property. The new coverage regression independently computes nearest-pipe distance and verifies priority, edges, duplicate/empty sources and scratch-state isolation through 256 tiles. Full regression coverage is 117 suites.

Feedback exercise: load a developed large city, advance several months, and compare the delay between updates. Check a water-short neighborhood and busy roads to assess service continuity. This is a continuation of the larger-map milestone, not a claim of complete simulation fidelity or AAA performance.


### Emergency location navigation — milestone 6

During an emergency, Next emergency appears beside the map navigation controls and cycles between the active main disaster and separate burning areas. Emergency → Active emergency locations lists each target with map coordinates and burning-tile count for direct selection. Neighboring fires, including diagonals, form one area. Selection uses current positions, so moving hazards can be revisited; extinguished areas disappear from the next selection. Navigation retains the selected response tool, cancels an unfinished drag, switches to the city layer and centers the actual tile across map rotation/zoom. It does not change the held/running emergency state.

This addresses the Go to Disaster navigation described on manual p.57. The current simulation still permits one main non-fire disaster at a time, potentially with many fire areas. The main disaster appears first; fires are ordered by their oldest currently burning tile, with tile order breaking ties. This is not a persisted history of original incident start times: spreading, merging, splitting and extinguishing can change fire-area identity/order. Full simultaneous independent main disasters and original chronology remain unfinished. Save schema stays 92; active saved fires require no migration and navigation position is transient.

Regression coverage includes scattered/diagonal fires beyond the original map boundary, wrapping/direct navigation, moving and extinguished targets, changed fire anchors, new city/incident reset, saved-city restoration and centering at all rotations and three zoom levels without changing saved gameplay state. The full suite now contains 118 suites; no browser visual acceptance claim is made.

Feedback exercise: ignite two separated developed districts in a saved copy, open Emergency to select either area, then use Next emergency on the map while dispatching crews. Check whether you can keep track of both areas as fires spread and are contained.


### Scenario message presenters — milestone 6

Popup events can now include an authored presenter name and role, an original generated planning-advisor portrait, or an uploaded PNG/JPEG portrait. The editor previews the presenter with literal message text; normal live-value expansion still occurs at delivery. Image uploads are limited to 5 MB, decoded by the browser, center-cropped to 256 × 256 and encoded as PNG. Inline saved portraits are bounded to 300 KB and 512 × 512 with PNG header checks; remote image URLs and SVG are not accepted. Failed uploads retain the prior portrait, and a late upload cannot overwrite a later reset.

Presenter data is retained with the event definition, included in downloaded/library cities, and preserved for unread/repeated popups and scenario replay. Dismissal and Scenario status retain their existing acknowledgement behavior. Author names/roles are escaped as text. Schema 93 accepts earlier cities, with missing presenters defaulting to plain messages. The default portrait is original Imagegen artwork, not an original-game advisor likeness.

This advances the presenter/custom-bitmap workflow on manual pp.177–180. Each of the four available popup event rows defines its own presenter; a reusable presenter library, multiple moods/expressions, the full original advisor/petitioner cast and general scripting VM remain unfinished. No animation or voice is claimed. Tests cover real event delivery, repetition and acknowledgement, saved/unread/replayed portraits, legacy migration, input bounds/text escaping, upload crop arguments and stale-upload/reset behavior. Full regression coverage is 119 suites; no browser acceptance test was performed.

Feedback exercise: author two popup messages with different names and roles, use the planning advisor on one and upload your own portrait for the other. Preview them, begin the challenge, save before reading a message, and reload to check its presentation and acknowledgement.


### Authored goals and stage reveals — milestone 6

Scenario authors can give each objective a name (60 characters) and instructions (1,500 characters). Instructions support existing live-value placeholders and are expanded when Scenario status opens. A named goal still displays its measurable requirement and current value. All authored goal text is escaped, with instruction line breaks preserved.

Later sequential goals may be revealed only when their stage becomes active. The first stage and simultaneous goals must remain visible. Revealed completed stages remain visible; unreached goals are shown in the final debrief. The overall stage count stays visible throughout. Hidden goals remain in the definition and still govern completion: this is a player-facing reveal, not concealment from someone inspecting an exported JSON file. Save schema 94 retains text and reveal settings; old goals migrate to generated metric names and visible stages. Replay restores the original reveal progression.

This advances the Goal Manager name/text and delayed-goal presentation described on manual pp.178–179. Reveals currently follow sequential stage progression, not arbitrary Add/Remove Goal script commands. Full dynamic scripting remains unfinished. Tests exercise actual monthly progression through hidden goals, no early victory, save/replay, final debrief, live values, escaped Scenario status and older saves. Full regression coverage is 120 suites; no browser acceptance test was performed.

Feedback exercise: create three sequential goals, write a short instruction for each, and mark goals two and three to reveal when active. Complete the first goal and assess whether the next stage arrives clearly without exposing its instructions early.


### Roadless Paradise tutorial adaptation — milestone 6

The prepared challenge catalog now includes Roadless Paradise, based on the Scenario Creator tutorial on manual pp.157–168. Keep the road count at zero for 24 months; a road present at a monthly check ends the scenario as Loser, including on the final month. Reaching month 24 with no road violation at a check awards Winner. Removing a road after a losing check does not undo the result. Removing it before the next check leaves that sample roadless. Highway tiles are not road tiles in this rule.

The supplied town is an original layout with 120 residents, two active rail stations, connected workplaces, solar power, pipes, water towers and §25,000. Real transit and utility systems support it; disabling transit funding interrupts its train commuters. A baseline 24-month run retained 120 residents and a positive treasury. Waste collection still requires roads in this reconstruction and its uncollected waste/pollution remain real; the briefing explains that constraint. No extra population or cash requirement was added to the manual tutorial’s road-count/time ending logic.

The manual refers to a separate original city file that is not supplied by the PDF. The new map is not that original city. The original script checks roads weekly, whereas this adaptation uses the existing monthly simulation boundary. Both differences are disclosed in the chooser/briefing; it is not claimed as an exact shipped-scenario reproduction. Save schema 95 recognizes the new prepared scenario and its Winner/Loser outcomes; prior scenarios remain compatible.

Tests cover the serviced rail-only start, actual two-year continuation and victory, road loss including at the deadline, terminal results after demolition, removal before a check, saved continuation, transit funding dependence, migration and the correct early-loss explanation. Full regression coverage is 121 suites; browser acceptance remains pending.

Feedback exercise: choose Roadless Paradise from Scenarios. Inspect rail commuting and utilities, run the town for a few months, and try expanding around stations. In a separate attempt, place a road and advance a month to assess whether the loss rule is clear.


### Background monthly simulation — milestone 1

Maps of 96 × 96 or larger calculate normal simulation months in a module worker. The visible city stays at its last complete month until a complete result arrives, then its data is replaced while preserving city identity. The map can pan/zoom/rotate during calculation; left-drag temporarily pans, and speed/pause requests remain available. Construction and other mutating commands wait for the month to finish so they cannot be overwritten. A month already in progress completes after Pause. The time display identifies calculation in progress. No new month starts during a construction drag or while another month is running.

Only monthly simulation moves to the worker. Emergency response steps, construction recomputation, saving and rendering still run on the main thread. Compact maps keep the original foreground path. Worker startup/transport failures fall back to foreground calculation; a reported simulation error pauses without applying partial worker state. A result for a replaced city is discarded. Save schema remains 95.

Actual worker-thread regression checks compare three background months with foreground results, statistics and serialized state, along with single-flight operation, visible-state isolation, cancellation and error/fallback behavior. A Node synthetic dense 256 × 256 run took about 3.2 seconds including worker startup and data copying; the main thread executed 137 timer callbacks while waiting, with a longest observed timer gap of 114 ms. These are Node coordination measurements, not browser frame rates. Copying city data adds time/memory and can still cause short pauses; browser/mobile acceptance remains unfinished. Repeat with `node benchmarks/background-month.mjs 256`.

Full regression coverage is 122 suites. Feedback exercise: run a developed 96 × 96 or larger city and pan/zoom during Calculating next month. Request Pause and verify that the in-flight month completes once, then construction becomes available. Compare camera responsiveness with earlier releases.


### Background-update keyboard correction — milestone 1 follow-up

The background calculation lock now permits Tab focus traversal, native Enter/Space activation on camera and speed controls, and the navigation map’s summary, select and keyboard jump controls. Mutating clicks and construction shortcuts remain blocked. Space on a native button or summary keeps its native activation instead of also toggling global simulation speed. Map Space retains the existing pause/pan gesture.

This corrects an accessibility regression in the background-simulation milestone; it does not add another save format or simulation rule. Policy tests cover allowed camera/pause/navigation interaction and blocked construction actions, with 123 regression suites in total. Browser interaction testing has been requested from the user and remains pending authorization.

Feedback exercise: during a large-city calculation, use Tab to focus Pause or a zoom button and activate it with Enter/Space. Open the navigation map and use its arrow/Enter controls to move the view.


### Individual civic-service inspection — milestone 4

Querying a hospital, school, college, library or museum now reports its operating conditions, department funding, upkeep contribution, connected occupied homes/residents, age-weighted demand, funded operating capacity contribution and combined local coverage. The report distinguishes the building’s contribution from coverage supplied by overlapping facilities and explains inactive power/road/funding/strike conditions. Police/fire queries show their funding-scaled response radius; jail queries show citywide capacity adequacy. Each panel links to department funding and services.

This exposes existing service calculations rather than changing eligibility, allocation, prices or save schema (95). School and college capacity contributions use the existing 65%/35% weighting; young/adult local demand is estimated using the city’s age mix, not a new per-neighborhood census. Capacity is coverage support, not tracked appointments or actual student enrollments. Upkeep contributions are aggregated and rounded at department level. The manual pp.112–114 and p.125 recommends querying service effectiveness; exact original grades/algorithms are not claimed.

Tests exercise real connected homes and isolated residents, funding-sensitive hospital coverage, education demand, overlapping coverage, strikes, road closure, emergency-service radius, jail adequacy and save reconstruction. Full regression coverage is 124 suites. Browser acceptance remains pending.

Feedback exercise: inspect a hospital, lower healthcare funding, and inspect it again. Compare its contribution with combined coverage, then inspect a school or library to see how demand differs by age. Use the department link to address a reported shortfall.


### Scenario calculation editor correction — milestone 6

Variable events now reveal the correct fields when switching among Set, Add, Copy metric and Calculate. The event-type handler previously replaced the operation handler, leaving calculation operands hidden and copy/value fields stale. Refreshing the operation fields from the shared handler restores authoring across all four event rows and preserves selected operands when switching event types.

The regression harness runs the real editor setup and assigned handlers, submits a multiplication challenge, advances its simulation and checks save reconstruction. It reproduces the old failure when the fix is removed. All 125 regression suites pass. This is a correction to the existing calculation milestone; save schema 95 and simulation formulas are unchanged. Node control tests do not establish browser layout or native input acceptance, which remains pending.

Feedback exercise: create a challenge, choose a Variable event, then Calculate. Select a live metric or constant for each operand, switch through Copy and Add, and return to Calculate before beginning the challenge.


### Use data maps while building — milestones 2, 4 and 5

The report map table now offers separate Show in city and Use as map actions. Use as map opens the navigation map with the selected layer while retaining the main city layer, construction tool and camera position. This implements the manual p.66 navigation-map workflow. Tunnels remain a city-view-only reconstruction layer.

Navigation now includes approval/aura, built density, flammability, rail usage and subway usage alongside existing utility, pollution and service maps. Empty or nonresidential land is neutral on the approval map. Density distinguishes empty zoning from built levels. Rail/subway maps distinguish used and unused tracks and operating/inactive stations, including routes beneath water. Water pollution remains visible on water tiles instead of being replaced by their ordinary blue color. Legends retain navigation instructions and explain each scale.

Tests run the actual report actions and installed navigation controller, check that selecting layers opens a collapsed map without changing city state, camera or construction tools, and verify the new data encodings. The full regression set has 126 suites. Browser/native-input and visual acceptance remain pending. Save schema 95 and simulation rules are unchanged.

Feedback exercise: open City data, use Flammability as the navigation map, then return to construction in the normal city view. Compare risk areas with Fire coverage. Switch to Rail or Subway usage to locate inactive stations and unused routes.


### Police and fire precinct maps — milestone 4

Police/crime and fire/flammability navigation maps now show each station as a dot surrounded by its current operating service limit. The radius uses the same helper as the coverage simulation and facility query: the base radius times the square root of department funding. Underfunding strikes, lost power/roads, closed roads or zero funding remove the ring while keeping an orange inactive-station marker. Operating markers are pale white. The main city heatmaps show P/F station markers for inspection; precinct rings are on the navigation map.

This implements the station-and-circle data-map presentation described on manual pp.66–67. The ring is the outer service limit, not uniform coverage: effectiveness falls toward its edge, overlapping contributions accumulate, and jail adequacy affects police strength. It does not show emergency dispatch-unit reach. Coverage coefficients remain reconstruction tuning.

Tests compare every tile’s actual fire coverage with the displayed radius at 25%, 100% and 150% funding; verify rotated/scaled ring centers, inactive markers, strike/road/funding changes, unchanged city data and saved-state reconstruction. All 127 regression suites pass. Browser visual acceptance remains pending. Save schema 95 and service rules are unchanged.

Feedback exercise: choose Fire coverage as the navigation map and change fire funding. Compare the changing precinct ring with the heatmap, then inspect an orange station to resolve its operating problem.


### Rotating recreation scenery — milestone 4 visual checkpoint

Fountains, playgrounds and sports parks now use original polygon geometry rendered into cached, transparent textures for all four city orientations. The models include a tiered fountain, climbing tower with slide/swings/sandbox, and a marked sports field with goals, seating, lights and a clubhouse. Existing footprints, costs, upkeep and recreation effects are unchanged; other recreation buildings retain their generated sprites.

Fountain streams use the existing scene clock. Their droplets advance while the city runs, freeze on pause/dialog/hidden-tab/emergency holds, and use a static pose under reduced motion or on data layers. Closed fountains have no jets. Canvas drawing is used because these are world objects within the existing renderer, not DOM interface transitions; no new animation library or timer is installed. Static geometry is cached once per model/orientation. This is original stylized scenery, not an exact original-game asset reconstruction or a claim of AAA visual parity.

A four-view contact sheet was rendered from the model polygons and inspected locally. That review caught and corrected ground surfaces covering the field and playground equipment. The preview is `docs/previews/recreation-models.png`; browser compositing and feel acceptance remain pending. Tests cover geometry bounds, distinct views, cache reuse, closed fountains, the real scene clock’s pause/reduced-motion policy and unchanged saved simulation continuation. All 128 regression suites pass; save schema remains 95.

Feedback exercise: place the three recreation structures, rotate the city through all four views, and pause/resume beside a fountain. Compare whether the equipment, field and water remain legible at your usual zoom.


### Electrical-grid diagnosis and replacement planning — milestone 2

The utilities report now includes electrical grids with domestic capacity, delivered imports/exports, demand served, signed reserve margin and unpowered demand-bearing lots. View blackout centers the power map on an affected lot; other rows link to their grid. Grid membership is recorded from the actual power-allocation traversal, so disconnected surplus cannot disguise a local shortage. IDs are temporary derived values rebuilt after construction or loading.

A plant table orders stressed and aging plants first, reports current/new capacity and a 12-month aging-only estimate, and links directly to each plant’s query. Plant queries include their grid’s local balance. The forecast holds elevation fixed and assumes survival; it does not predict demand, construction, fuel or trade changes. Waste-to-energy remains in grid totals based on actual recent throughput but is excluded from the plant aging forecast. Rebuild cost excludes demolition.

This extends the manual p.116 query-based blackout and aging workflow. Allocation priorities, output curves and service rules are unchanged. Tests verify a real islanded blackout despite citywide surplus, connecting those grids, restoring an overloaded grid, capacity forecasts, imports/exports, report navigation and saved continuation. The 129-suite regression set passes. Save schema remains 95; network metadata is derived, not serialized. Browser acceptance remains pending.

Feedback exercise: isolate a small plant and several developed homes from a larger plant. Use the report to locate the local blackout, join the grids with power lines, and confirm that the shortage disappears. Inspect an older plant from the replacement table before choosing where to add capacity.


### Concurrent disaster response — milestone 6

Different major disaster types can now overlap in one emergency response session, alongside multiple fire areas. The Emergency panel’s Add another disaster section offers types that are not already active. One instance of each major type is supported. Adding a hazard preserves firefighters, police squads, the return-to-play speed and the ongoing session; type-specific counters still record each event. Use Next emergency location or the direct location list to move among threats. The calendar resumes only after all hazards and fires are resolved.

Every active hazard advances during a response step, including fires during an earthquake. Tornado and alien-attack warning protection belongs to the individual hazard. Sounding a new warning does not remove earlier protection, departure of one hazard does not clear another’s shelter response, and the panel reports which threat has been warned. Repeating an already-active disaster type is rejected without replacing it. Random-disaster checks and scenario event groups keep their existing monthly scheduling; they do not automatically manufacture overlapping incidents.

This addresses the manual pp.56–57 multiple-disaster workflow. Save schema 96 preserves per-hazard warnings and concurrent states; older single-hazard saves migrate their warning protection. Old schema versions reject concurrent states rather than silently losing hazards. Damage order is deterministic (alien, whirlpool, cloud, debris, riot, locusts, tornado, quake, fires), and the existing per-type damage models remain approximations. Simultaneous repeated instances of the same major type remain unsupported.

The new regression runs all eight major types plus fires concurrently, preserves all three response-unit groups, validates saves through the response, compares deterministic continuation and checks final completion. It also tests duplicate rejection, staggered warnings, legacy migration and the actual panel’s add-hazard controls. All 130 regression suites pass; browser interaction acceptance remains pending.

Feedback exercise: start a fire, dispatch firefighters, then add a tornado from Emergency. Sound the warning, switch between locations and verify your firefighters remain deployed. Add an alien attack later and confirm its warning can be sounded independently.


### Emergency navigation in start order — milestone 6

Go to Disaster now cycles through mixed hazards and separate fire areas in the order they began, following manual p.57. Starting another instance after its predecessor resolves puts it at the end. Removing the current and earlier threats does not skip the next remaining incident. Direct location buttons still follow moving hazards.

Schema 97 records a session-local start sequence. Fire spread inherits its source sequence, so extinguishing the original ignition tile does not move the surviving fire front to the end of the list. Connected fire areas use the earliest remaining lineage and retain their existing oldest-burning-tile camera anchor. Per-tile records are bounded by map size and reset when a new response session starts. Older saves never recorded cross-hazard chronology; migration retains their former deterministic type/age order rather than inventing exact timestamps.

Regression exercises real starts, a real seeded fire spread, resolved and repeated hazards, save/load continuation, invalid order metadata and response resets. The complete regression set has 131 suites. Browser interaction acceptance remains pending. Damage, warnings and response speed are unchanged.

Feedback exercise: start a fire, then an earthquake, then a separate fire and an alien attack. Use Next emergency location to follow that sequence. Save and reload during the response and check the same ordering.


### Play preferences — milestones 1, 5 and 6

City desk now exposes browser-wide Play preferences, implementing the general disaster-camera option on manual p.36 and the vehicle/decorative presentation controls on p.35. Auto Go To Disasters is enabled by default. Disabling it prevents random and scenario-triggered emergencies from changing the camera or main map layer; their warnings, response panels and essential indicators remain. Manual location navigation and explicitly placed disasters still focus their targets.

Show vehicles controls decorative road cars, surface trains, ships and aircraft without changing commuting, transport capacity or traffic data. Traffic visibility can also be limited to 100% or 150% and closer zooms, adapting the manual’s zoom-dependent control to the continuous browser camera; all zoom levels remains the default. Animate scenery currently controls fountain motion; a disabled fountain uses its static pose. These switches do not hide essential disaster graphics. System reduced-motion, pause, hidden-tab, dialog and emergency holds keep their existing precedence. Disabling both decorative categories also stops the shared scene clock and its high-frequency refresh demand.

Preferences persist separately from city files and apply across cities in the same browser. Storage failures still apply changes for the session and report that they could not be saved. The tests run real dialog handlers and Canvas renderer dispatch, check visible cars/trains versus hidden sampling, static/animated fountain draws, essential alien graphics, reduced motion, clock holds and unchanged serialized city data. All 132 regression suites pass; browser interaction and visual acceptance remain pending. Save schema 97 is unchanged. The original full animation/sound catalog is still incomplete.

Feedback exercise: open City desk → Play preferences, hide vehicles and stop decorative scenery, then restore them. Disable Auto Go To Disasters before a scripted emergency and compare the retained camera view with manually choosing Next emergency location.


### Neighborhood pedestrians — milestones 1 and 5

Original procedural pedestrians now walk along usable streets near occupied, accessible homes. Up to 96 short routes are sampled across the map, with at most 180 visible people distributed among them. Paths follow adjacent dry-land roads at the same elevation; they exclude fire, rubble, radiation and highways. Residents walk out and back with a short endpoint pause. These are decorative activity samples, not extra residents, individual schedules or additional commute demand.

Route geometry is cached until city statistics change, while current road/home safety is checked before drawing. Street-edge paths preserve continuous movement through turns and endpoint reversals. Head, torso, arms, legs and shadows are drawn procedurally with the city camera; limb motion follows the projected travel direction at all four orientations. The offline magnified pose sheet is `docs/previews/pedestrians.png`. It was inspected for silhouette and pose legibility; browser compositing and normal-zoom visual acceptance remain pending.

Play preferences adds Show pedestrians and a separate zoom threshold (100% and closer by default). Pedestrians clear during emergency response so they do not obscure dispatch indicators. They share the existing scene clock, freezing on pause, hidden tabs, dialogs and reduced motion; reduced motion also uses a neutral limb pose. The scene clock may now run for pedestrians even when vehicles and fountains are disabled. This expands the manual p.35 Sims Visible presentation area without claiming a complete original crowd or riot-animation catalog.

Tests exercise real starter-town routes, blocked roads/elevation changes, empty towns, large-map sampling/caps, continuous motion over turns, all camera orientations, actual renderer visibility and cache refresh, saved continuation and unchanged city state. The full regression set has 133 suites; schema 97 is unchanged.

Feedback exercise: zoom into the starter town’s occupied residential streets, pause and resume, then rotate the camera. Hide vehicles while leaving pedestrians on, and compare the separate zoom thresholds under City desk → Play preferences.


### Event-driven scenario goals — milestone 6

The creator now supports the manual’s Add At Startup and Add Goal workflow (printed pp.179 and 185). Uncheck Add at startup on a goal, then target it with a timed or conditional Add Goal event. Inactive objectives remain hidden in Scenario status until activated. The news ticker reports an Add Goal action. Goal menus use the actual authoring rows and labels; blank rows do not shift a target to a different goal. Invalid targets and inactive goals without an activation event are rejected.

Automatic victory checks active simultaneous objectives, required timed events, emergencies and sustained progress. An empty active objective list cannot win. Conditional activation events remain optional like other conditional events: if they never trigger, another active goal can still grant victory; an unconditional activation event is required when the new goal must become part of the challenge. Adding a simultaneous requirement resets the hold streak, and the activation month participates in the new check. Repeating activation is idempotent. Sequential stages wait for activation and previous stages; activating a later stage does not reset the current stage’s hold.

Schema 98 stores first activation months separately from immutable goal definitions. Loading checks activation against startup policy and recorded events, rejects impossible pre-activation holds/stage completions, and restores older all-startup challenges. Replay restores the initial active set. Existing four-goal/four-event limits and monthly scheduling remain; this is not the full original script interpreter.

The 135-suite regression set covers real editor submission, sparse-row targeting, timed and conditional activation, grouped variable→goal actions, repeated activation, delayed victory, empty-list deadline loss, sequential waits, save/load, replay and legacy migration. Browser acceptance remains pending.

Feedback exercise: create a funds goal active at startup and a population goal initially inactive. Add the second goal in month 3, save during the attempt, and inspect Scenario status before and after activation. Restart the challenge and verify the second goal begins hidden again.


### Exact and strict scenario comparisons — milestone 6

Numeric conditions now offer at least, at most, greater than, less than, exactly and not equal to. Named states offer Is and Is not. These comparisons work in event conditions, compound AND/OR groups and outcome-rank conditions, including Add Goal event conditions. They extend the manual’s equality, Greater Than and Not Equal command behavior (printed pp.186–188) through the existing condition editor. They do not implement arbitrary nested blocks or a general script interpreter.

Comparisons use unrounded simulation values. An unavailable/nonfinite metric never satisfies a condition, including not-equal. Event reports retain the selected operator; state inequalities use readable labels. Schema 99 prevents earlier clients from silently interpreting newly supported operators as inclusive thresholds. Earlier saved conditions retain their semantics.

Tests cover every operator below/at/above a boundary, fractional values, unavailable values, real grouped exact/strict announcements, outcome ranks, saved continuation and state inequalities. The existing real editor harness also verifies operator menus on primary, secondary and rank condition rows. All 136 suites pass; browser acceptance remains pending.

Feedback exercise: increment a scenario variable each month, announce when it is exactly 2, and add a second announcement when it is greater than 2. Check that the messages arrive in different months and retain their conditions after export/import.


### Goal-status scenario conditions — milestone 6

Event and outcome-rank conditions can now query the status of an individual objective, following the manual’s Goal Status Is command (printed p.187). The condition picker exposes Goal row 1–4 status with Inactive, Unsatisfied, Satisfied and Locked choices. Authoring references resolve to the actual validated objective order, including forms with blank goal rows. Missing targets are rejected.

Simultaneous goals report their current requirement result, matching their status checkboxes; the separate all-goal hold streak is not itself a goal status. Sequential stages report Satisfied after completing their hold, retain that result, and report Locked for later active stages. Inactive goals remain distinct from locked stages. Grouped events observe changes from earlier actions in the same batch. Ordinary monthly events run before stage progress is updated, so a just-completed stage is observed on the following monthly event check.

Status queries are condition-only and cannot become objective criteria, preventing self-referential goal evaluation. They do not implement the separate Mark Goal Status command or a general script interpreter. Schema 100 preserves the new condition references; no new simulation counters are required.

The 137-suite regression set covers live and retained statuses, activation followed by status checks, goal-conditioned announcements and ranks, saved continuation, undefined/self-referential rejection, and actual editor submission with sparse goal rows. Browser acceptance remains pending.

Feedback exercise: make an Add Goal event conditional on the first goal being Satisfied. In a sequential challenge, add an announcement for the first stage’s Satisfied status and compare its arrival with the stage-completion month.


### Scripted goal status and all-goal checks — milestone 6

The creator now exposes Mark Goal Status with Satisfied and Unsatisfied actions, plus the All active goals satisfied condition. These extend the manual’s Mark Goal Status and All Goals Met commands (printed pp.188 and 185). A mark overrides an objective’s live metric result until another mark changes it; status details identify that override. Marking does not activate a hidden goal. Add Goal remains the separate activation action.

Explicit marks are visible to subsequent actions in the same group, so a script can mark a goal and immediately evaluate an ending condition. All active goals satisfied excludes inactive goals and returns false when none is active. Explicit satisfaction is distinct from the reconstruction’s stage-order/hold requirements: automatic victory still waits for required stage progress, hold time, timed events and emergency response; an explicit End scenario action retains its existing override behavior. Marking a completed sequential stage unsatisfied reopens it and clears later stage completion. Repeating the same satisfied mark updates event history without restarting its hold.

Schema 101 saves marked status and the last mark month, validates them against triggered Mark Goal events, rejects completed stages that remain explicitly unsatisfied, and restores older metric-driven challenges with no overrides. Replay clears marks to the initial state. The condition-only goal queries cannot become self-referential objective metrics. The full original scripting language and unbounded block execution remain incomplete.

Tests cover reopening and re-completing a sequence, repeated marks, all-goal checks, same-batch scripted endings, hidden marks, save continuation, replay, legacy migration and malformed history. The real editor harness verifies mark-action controls and target mapping with sparse rows. All 138 suites pass; browser acceptance remains pending.

Feedback exercise: mark an objective unsatisfied after an initial achievement, then satisfy it through another event. In a scripted-ending challenge, place an End scenario event after Mark Goal Status and condition it on All active goals satisfied.


## Recreation collection views checkpoint
Large parks, ornamental ponds, marinas and zoos now use original footprint-relative polygon models in all four camera orientations. Together with the existing fountain, playground and sports park models, all seven structures in `RECREATION` have rotating geometry. The separate small-park tile remains on its existing renderer. Parks include walks, planting and a pavilion; ponds include an irregular stone bank and lilies; marinas include docks and static sailboats; zoos include fenced habitats and miniature animals. These are original visual interpretations of the manual p.55 catalog, not recovered original models or new boating/animal simulation. Static textures are cached per type/orientation; existing placement, cost, upkeep, recreation effects and save schema remain unchanged.

Validation: actual model geometry rendered offline into `docs/previews/recreation-collection.png` and inspected in all 16 new views; regression builds every modeled recreation type (including a correctly water-adjacent marina), checks projection bounds and texture reuse, and verifies unchanged saved simulation. Browser scene composition and player visual acceptance remain pending. Feedback exercise: place the four facilities, rotate the city through all four views, and assess readability at normal play zoom.


## Separate school and college capacity checkpoint
Schools now provide teaching places for the 0–14 census band and colleges for the 15–24 band. Each uses its full funded capacity divided by the road-connected population in that band. Extra schools cannot cover a college shortage, or vice versa. Each young band's retained EQ moves toward its own access-based target; existing graduation flows carry learning forward into adulthood. Combined teaching and education coverage still aggregate the groups by their census shares, preserving existing map, scenario and report meanings.

This replaces the old pooled 65% school / 35% college capacity weights. The manual pp.54–55 and 112–113 calls for sufficient schools and colleges with limited capacity; our age boundaries, full-band demand and learning coefficients are explicit reconstruction calibration. Schools serving all ages 0–14 include children younger than normal school age because the current census has no finer age split. The city age mix is still distributed uniformly among homes.

Facility inspections now report the appropriate age-group demand and combined local coverage; the education report distinguishes school and college access. Civic advice and student petitions point to the missing type, without generating teaching requests for empty age groups. Save schema remains 101: new coverage fields are derived, and existing age education history persists. Loading an older city recalculates access under the new allocation rules.

Validation: 139 suites, including independent age learning, repeated schools failing to replace colleges, funded capacity, strikes, disconnected homes, facility reports and actual monthly save continuation. Browser acceptance remains pending. Feedback exercise: serve a neighborhood with schools first, inspect the remaining college demand, then connect a college and follow the two youth EQ bands over time.


## Original soundtrack and music choices checkpoint
Sound settings now offer three original synthesized background scores: Morning permits, Riverside steps and After the last train. Each has a 32-bar arrangement with a quieter introduction/outro, chord progression, bass and melodic section; the first two include a filtered brush pulse. Keys, sine leads/bass and a lightly detuned pad use Web Audio with a short scheduling window. No original game recordings, copied melodies or external samples are used.

Following manual p.36, players independently enable music, set its volume, preview a track and choose which tracks enter random playback. Immediate repeats are avoided when another selected track exists; a single selection repeats, and an empty selection stays silent. Previewing works with background music off. Finishing/stopping a preview returns to the enabled selection. Browser preferences persist separately from effects and city saves. Muted startup allocates no audio resources; saved enabled preferences require a click/key to unlock sound. Music continues during paused city planning and pauses on a hidden tab, retaining its position on return. Muting cancels pending previews as well as scheduled sound.

Validation: 140 suites, including score bounds and conservative peak gain, randomized selection membership, one scheduler across track changes, hidden-tab voice cancellation/resume, preview completion, rapid preview/mute races, persistence and actual music-settings handlers. Existing effect regressions pass. Browser playback, subjective sound quality, ambient city audio, the original soundtrack catalog and hardware 3D sound remain unverified or incomplete. Feedback exercise: open City desk → Sound settings, preview all three tracks, then leave only your preferred selections enabled while building.


## Causeway and suspension bridge checkpoint
Manual p.95 distinguishes short causeways and long suspension bridges. Engineering proposals now list each water span’s style, length and bank coordinates before the existing cost approval. Road, rail and highway crossings render causeway piers/railings or suspension towers, cables and hangers in all four orientations. Rail bridges gain a visible deck; elevated highway piers reach the water surface. Data layers omit the decorative overhead structures. Six water tiles is an original classification threshold, not a recovered original rule.

Inspecting an existing bridge reports its full water span, missing deck count/first gap and bank-approach connections. Span geometry derives from the channel between land banks, so demolition does not reclassify surviving suspension pieces as a short causeway. Repair uses the existing matching-route drag between dry banks. Cached profiles refresh with recomputed city statistics. Costs, transport capacities, terrain-stability rules, deck elevations, ship clearance and disaster behavior remain the existing model; this is not a full bridge-physics reconstruction. No persistent fields or save-version changes.

Validation: 141 suites, including all three transport modes, both world axes, the style boundary, four camera views, demolition/repair, cache invalidation and save restoration. The actual application proposal handlers were exercised for cancellation without spending and accepted construction. Offline draws from the actual road/rail/highway renderer were inspected in `docs/previews/bridge-structures.png` (24 views). Browser composition and player acceptance remain pending. Feedback exercise: build a short crossing and a long one, rotate the camera, remove a middle deck tile, then use Inspect to find the gap and rebuild between banks.


## Nested scenario conditions checkpoint
Events and outcome ranks now accept nested AND/OR condition trees, matching the manual pp.188–189 block-condition concept. Rules can combine requirements such as a funds threshold AND either a population threshold OR a goal-status check. Validation allows up to 16 leaf checks and eight group levels, rejects cycles, empty/sparse groups and malformed leaves, and validates local areas and goal references recursively. Existing flat all/any rules remain compatible. Schema 102 identifies the expanded condition format.

The editor keeps four visible condition rows per event/rank and adds optional Advanced logic, for example `1 AND (2 OR 3)`. AND has precedence over OR; parentheses override it. Every selected row must be used, empty rows cannot be referenced, and repeated references count toward the 16-check bound. A nonempty expression disables the ordinary Match menu. The current challenge remains intact on an invalid expression. Imported definitions can contain up to 16 distinct checks; the editor still exposes four distinct rows. This is nested Boolean logic, not the full If/Else action language, subroutines or a general script VM.

Validation: 142 suites, including nested truth tables, precedence, real repeated event/ending/rank progression, saved continuation and deterministic restart, recursive areas/goal references, malformed/circular trees and actual editor submission with sparse goal rows. Browser acceptance remains pending. Feedback exercise: define three conditions, use `1 AND (2 OR 3)`, then arrange for condition 1 and just one alternative to succeed and observe the event or rank.


## Local city ambience checkpoint — publication pending
Sound settings now include an independent ambient-sound switch and volume, following manual p.36’s nearby-city sound behavior. At zoom above 100%, a bounded eight-tile radius around the camera center samples current traffic, powered occupied industry, green space/farms and water. Distance and zoom weight the mix; projected positions supply stereo placement through camera rotation. Four original filtered-noise textures represent these environments. They are not individual vehicle/animal recordings or hardware 3D audio.

Ambience fades to silence while city time is paused, a dialog is open, a data layer is shown, or an emergency is active. Hidden tabs and disabling the preference stop and disconnect the looped sources and scheduling timer. Audio resources are allocated only after activation; preferences persist separately from music, effects and city saves. The local sampler reads without changing city state and runs four times per second while enabled.

Validation: 143 suites, including the actual camera projection/picking with nearby and distant sources, stereo reversal under rotation, zoom/operating gates, resource cleanup, asynchronous mute, preference persistence and actual settings handlers. Browser listening/subjective quality remain pending. Feedback exercise once published: enable ambient sound, close Sound settings, run the city and zoom into a busy street, an industrial district and a quiet waterfront.

Publication note: nested scenario conditions (PR #44) and this ambient milestone are local/GitHub progress beyond deployed version 150. Automatic approval review rejected Sites source export despite verified owner-private access and a matching payload. No further Sites export will be attempted until explicit authorization arrives.


## Station network inspection checkpoint — publication pending
Train stations, subway stations and rail–subway connections now have detailed inspections built from the same connected track groups used by passenger allocation. The report lists connected stations, operating state, passenger activity, rail/subway tile counts, nearby occupied homes/residents and developed workplaces/job places. It distinguishes missing tracks, no destination station, absent homes/jobs at the other end, zero funding, poor equipment condition and strikes. Links open rail/subway maps or transit funding.

This supports the manual pp.94–96 requirement for convenient public transit near both homes and workplaces. The existing three-tile square station access range is still reconstruction calibration. Nearby jobs can already be filled and overlapping catchments are not additive; station activity includes boarding/alighting/transfers, not unique citywide riders. Connected tracks alone do not guarantee a journey. No new routing or fare rules are claimed.

Derived network summaries are computed during normal simulation and only retained for components containing stations. Inspecting reads these summaries and never reruns the mutating rail allocator. Save schema stays 102; summaries and station group IDs are recomputed on load. Validation: 145 suites, including mixed rail/subway transfers, broken/repaired destination routes, funding/condition/strike reasons, exact passenger activity, read-only inspection, saved restoration and actual inspection-map/funding handlers. Browser acceptance remains pending. Feedback exercise once published: connect homes and jobs through a transfer, inspect their stations, remove a subway segment and use the report to diagnose the lost destination.

### Scenario background rules — source checkpoint (publication pending)

Manual p.186 motivates author control of unscripted disasters and business deals. The editor now has separate rules for random disaster generation and future automatic business proposals, applied while a custom challenge is playing. Scripted events bypass these gates; saved random preferences, existing offers, accepted permits and income remain intact. Manual disaster tools and infrastructure failures remain available. The rules persist through save/import/restart and release on victory or loss. This is a bounded authoring feature, not complete DisableBusinessDeals / EnableDisableDisasters VM command fidelity. It does not revoke pre-existing unscripted offers or disable individual neighbor contracts. Schema 103; 145 suites. Browser testing and publication remain pending authorization.

### Neighborhood building customization — source checkpoint (publication pending)

The manual pp.78–81 describes citywide building replacement across building types. The supported library expands from four tower slots to all 14 existing non-farm RCI art styles: four residential, four commercial and six dirty/clean industrial styles. Custom models, block layouts and surface paints work in every slot; parametric floors now range 1–24. Replacement artwork stays within the zone family and does not change simulation inputs. Historical and abandoned buildings retain applicable designs; farms, empty lots, rubble and radiation are excluded. Schema 104; 146 suites. Actual draw commands rendered offline in `previews/neighborhood-building-designer.png` cover three sample low-rise designs in all rotations. This does not establish browser acceptance, provide original building-file compatibility or complete the original building/lot-size catalogs. Publication remains pending.

### Disaster relief — source checkpoint (publication pending)

Manual p.91 describes possible cleanup assistance after catastrophic disasters and better treatment for prepared mayors. Recovery grants now settle once per complete response session, including overlapping hazards and power-plant failures. Saved starting counters measure destroyed buildings/trees, displaced residents, infrastructure damage and locust vegetation/crop losses. Fire coverage and water service across occupied residential lots determine a frozen preparedness score. Qualification thresholds, damage rates, the 50–100% preparedness multiplier and §25,000 cap are original tuning, explicitly shown in Emergency and Budget; they are not recovered legacy formulas. Grants credit the treasury immediately on settlement, are booked separately in the next monthly history entry and annual accounts, and leave recurring income forecasts unchanged. Schema 105 retains the pending assessment, total, most recent result and unbooked receipts; older active incidents get no fabricated retrospective assessment. Real overlapping-disaster and locust playthroughs, save/resume equivalence, single payment, annual accounting, preparedness, immediate plant failures and malformed imports are tested. 147 suites. Browser acceptance and publication remain pending authorization.

### Four-view civic buildings — source checkpoint (publication pending)

All eight service types now use original footprint-relative geometry: a tiered police station, engine-bay fire station, hospital with a rooftop landing marker and emergency wing, courtyard school, fenced jail, college hall, glazed library and columned museum. Geometry is rasterized with a per-pixel depth buffer into 32 cached 512×512 transparent textures, eliminating the intersecting-roof artifacts found in the first painter-order contact sheet. Vehicles, playground equipment and rooftop markers are static scenery, not additional dispatch or service mechanics. The existing inactive-service indicator and data-layer fades remain. `previews/civic-building-models.png` shows all actual cached views and was inspected offline. One local Node run rasterized all views in 367 ms; this is not browser frame-time acceptance. Geometry/raster bounds, determinism, cache reuse, actual construction and saved simulation continuation are covered. 148 suites; schema remains 105. Original civic footprints and exact artwork are not claimed. Browser testing and publication remain pending authorization.

### City view layers — source checkpoint (publication pending)

Manual pp.41–42 specifies transportation, power-line, flora, zoned-building, other-building and zone toggles, terrain grid, Apply and Default View. The sidebar and City desk now expose all six above-ground controls plus the grid and view selection. Transportation covers roads, tracks, highways, ramps, tunnel portals and moving vehicles/pedestrians; station buildings remain under Other buildings. Flora covers standalone landscape trees; vegetation embedded in building models remains part of those buildings. Zoned buildings includes RCI and developed airport/seaport plots. Above-ground filters apply in City view; diagnostic/underground views retain their normal network displays, and the grid preference applies everywhere. Rubble, fires, radiation, response units and construction previews are preserved. Settings are browser-local, applied atomically and survive storage errors for the session. Actual renderer and control-handler tests verify hiding, diagnostic restoration, unchanged tile picking/construction plans/city state and Apply/Cancel/Default behavior. 149 suites, schema remains 105. Browser layout and visual acceptance remain pending, as does publication.

### Unobstructed city view — source checkpoint (publication pending)

Manual p.42 describes hiding the information/main toolbars while retaining hotkeys. A map button, City desk action and H shortcut now hide the header, footer, toolkit, map controls and navigation map, letting the canvas occupy the game area. A persistent Show controls button, H or Escape restores the interface. The existing map overlays, notifications and dialogs stay available. Changing layout cancels pointer capture and construction preview before resizing; focus returns to the canvas so Space pause/play remains usable. Input fields, editable content, composition, modifiers, held keys and open dialogs are guarded. Restoration and H remain allowed during background monthly processing. Actual controller and renderer ResizeObserver tests cover recovery, focus, cancellation, guarded hotkeys and preservation of camera/city state. Styling allows wrapped map controls at narrow widths, but browser layout acceptance is unverified. This is session-only in-page toolbar hiding, not the browser fullscreen API. 150 suites; schema remains 105. Publication remains pending authorization.

The [ and ] keys rotate the city counterclockwise and clockwise, including with toolbars hidden and during background monthly updates. Modified, editing and repeated key presses are guarded.

### Scenario calendar queries — source checkpoint (publication pending)

Manual pp.187,190 includes Get Current Date. Calendar date, year and named month queries now work in custom goals, nested event/rank conditions, variable copies/calculations and live text. Date thresholds use native month inputs, with On/Before/After comparison labels and an initial date one year after the current city date. Year defaults also use the next year. Reports and messages format dates as month/year; the existing {year} token keeps ungrouped year text. Saved numeric dates use year × 12 + zero-based month; this month-index representation supports exact subtraction within the current integer variable range and is explicitly documented in the editor. It does not claim binary compatibility with the original script date type or sub-month time precision. Tests cover all four starting years, year rollovers, six comparisons, a real dated objective/event/variable playthrough, save/replay, contextual controls, actual editor submission and malformed/out-of-range dates. 151 suites, schema 106. Full conditional action blocks remain outstanding; this checkpoint adds documented query capability. Browser input/layout acceptance and publication remain pending authorization.

### Keyboard construction — milestone 1 follow-up

Replaces the hard-coded tile 25,25 cursor with a visible-center starting point and city-size-aware bounds. Arrows move along the rotated view grid; minimal camera panning keeps the selected elevated tile in view. Shift + Enter starts a normal road/area preview, arrows extend it, Enter commits through existing selection and construction rules, and Escape cancels. Tool changes, mouse gestures and window blur clear keyboard ranges; stale anchors cannot carry into another city. Single buildings and disaster actions remain single selections. A polite status announces coordinates and terrain/building type. Tests use actual renderer geometry on all four sizes/rotations, actual app key handlers, real large-map construction and background-update guards. 152 suites, schema 106 unchanged. Browser interaction and accessibility acceptance remain pending; publication remains pending source-export approval.

### Economic scenario queries — milestone 6 follow-up

Manual p.187 Get Land Value, Get RCI Tax Rates and Get Total Debt are exposed as five metrics throughout the custom challenge editor. Goals, nested event/rank conditions, live text and variable operations read current land value, three sector tax rates and remaining contractual loan payments. Debt includes future interest and shares the exact Budget helper; this representation is explicit rather than a claim to recover the original internal debt algorithm. Its maximum is 375,000 (ten 25,000 loans with 150% total repayments). Tax thresholds allow decimals and range 0–20; integer variables retain existing rounding when copying a rate. A real final-payment challenge, save/replay, all six comparisons, maximum debt, malformed thresholds, text, variable copy and actual editor submission are covered. 153 suites, schema 107; no new simulation balance or loan terms. Broader scripting and remaining city queries, browser acceptance and publication remain outstanding.

### Environmental scenario queries — milestone 6 follow-up

Manual p.187 surplus power/water, traffic density and water-pollution queries now appear in goals, event/rank conditions, live text and variable operations. Water pollution is the full-map mean and traffic the road-tile mean, sharing definitions with Reports. Power surplus sums signed electrical-grid margins after delivered imports/exports; water surplus subtracts all city water demand from capacity after trade. Positive totals do not guarantee service in disconnected neighborhoods. Uncollected garbage exposes current units awaiting collection; no original garbage-pollution index is claimed. Tests cover actual disconnected supply, deficits, delivered imports, shared averages, waste accumulation, read-only evaluation, validation, actual editor submission and a saved/replayed challenge completed by constructing utility capacity. 154 suites, schema 108. Full script control flow and original pollution/traffic calibration remain incomplete. Browser acceptance and publication remain pending.

### Water facility models — milestone 2 presentation follow-up

All four water utilities replace fixed-view sprites with original geometry: brick pump houses and equipment, elevated storage towers, desalination halls and tanks, and circular treatment basins with access bridges. Each rotates in the city and uses a cached transparent depth raster. The shared rasterizer also preserves all eight civic model outputs; tests cover bounds, deterministic distinct rotations, caching, actual renderer placement/fading, construction, save continuity and simulation. The offline 16-view contact sheet is docs/previews/water-facility-models.png. Existing one-tile footprints, water capacities, operation rules and overlay alpha values remain. These models are static and do not establish AAA or browser performance acceptance. 155 suites; schema 108 unchanged. Browser acceptance and publication remain pending.

### Power plant models — milestone 2 presentation follow-up

All eight power technologies replace fixed-view sprites with original procedural models and 32 cached depth rasters. Models scale to the existing 1×1, 3×3 and 4×4 footprints and render once at the footprint center from the correct depth-order tile in each map orientation. Original geometry includes coal yards, oil storage, gas equipment, cooling towers, wind rotors, inclined solar panels, concave microwave receivers and fusion domes. The inspected offline contact sheet is docs/previews/power-plant-models.png. Tests cover geometry bounds, distinct transparent views, caching, real plant construction, saved simulation/aging continuity and the actual multi-tile renderer branch across all footprint tiles/rotations. These models are static; costs, pollution, capacities, technology dates and failure rules are unchanged. 156 suites, schema 108 unchanged. Browser visual/performance acceptance and publication remain pending.

### Wind rotor motion — milestone 2 presentation follow-up

Wind turbines now indicate running scenery through a constant, eight-second rotor revolution. Three vector blades rotate rigidly over four cached tower images, with their plane placed behind the tower in views 0/3 and in front in views 1/2. No animated bitmap-frame cache or per-frame depth buffer is allocated. The existing scenery clock holds during pause, dialogs, hidden tabs and emergencies; reduced-motion, disabled scenery, diagnostic views and damaged turbines use static artwork. This visual speed is original tuning and does not change power output or model weather. Tests cover continuous geometry, depth order, fixed cache size across frames, actual scene-clock holds, preferences and unchanged city state. Offline keyframes were inspected and a GIF is at docs/previews/wind-turbine-motion.gif. 157 suites, schema 108 unchanged. Browser motion/performance acceptance and publication remain pending.


## Larger RCI lots and footprint-matched architecture

Source checkpoint: 161 regression suites, schema 109. Vacant serviced medium/dense zoning can form 2×2 buildings; dense zoning first tries 3×3. Every member shares growth, abandonment, history and destruction, while occupancy and utility demand remain distributed across tiles. Any member opens the shared building query or whole-lot demolition. Scenario building counts use the northwest root; population remains the sum of occupants.

The manual requires replacement tile-size matching (pp.73–74) and Building Architect tile-size selection (p.140). Style libraries and portable v4 designs now enforce this, preserving legacy 1×1 files. Original procedural models cover larger footprints in four views with constant physical floor height. Lot-selection probabilities, capacity tuning, footprint catalog and artwork are reconstruction choices rather than recovered original algorithms. See BUILDING-LOTS-MILESTONE.md for validation; full original fidelity and browser acceptance remain incomplete. Publication beyond v150 is still pending approval.


## Branching scenario routines

Source checkpoint:168 suites, schema110. Form-authored routines now support ordered action blocks, nested If/Else, reusable nonrecursive subroutine calls and repeated scheduled entries. Conditions read city state when reached; chosen paths survive popup/emergency suspension. Actual primitive actions share dispatch with existing events. Program history, city-file and named saves, worker execution, goal provenance and starting-city replay are integrated.

Manual pp.188–189 specify If/If Else action blocks, Subroutine and Repeat Regular. Runtime bounds, completion-relative repeat timing and the structured browser format are reconstruction choices. Binary original scenario files, unrestricted recursion and the full original instruction catalog remain unsupported. The routine popup form supports advisor presentation; custom portrait files can be preserved from imported routines but new file selection uses the existing standalone popup editor. Browser acceptance and Sites publication after v150 remain pending. See SCENARIO-PROGRAMS-MILESTONE.md.


## Multi-neighbor contracts

Source checkpoint:177 suites, schema111. Cities can sign one contract per resource with each neighbor (four power, four water and five garbage pairs). Utility imports combine finite supplier surplus only on the connected network; exports use local surplus, with older contracts attempted first. Garbage shipments retain route-local conservation. Lower-priced imports/disposal are used first, but every idle backup contract retains its minimum fee. Renewals cannot silently break another existing deal.

Manual pp.119–120 supports multiple neighbor connections, network-local deficit supply, minimum fees and fixed export obligations. Allocation priorities and one-resource-per-neighbor limits are explicit reconstruction tuning. Tests cover real networks, monthly garbage ledgers, penalties, separate neighbor budgets, save/replay/worker, UI handlers and strict contract bounds. Full neighboring tile cities and browser acceptance remain incomplete; Sites publication afterv150 is pending approval. See MULTI-NEIGHBOR-TRADE-MILESTONE.md.


## Complete building-set import checkpoint — milestone 5

City desk → Import building set reads an exported SIMS3000 city and previews all visible changes by source style and tile footprint, including the number of current buildings affected. Apply replaces both the custom-model library and style replacements together; omitted styles return to original artwork. Cancel leaves the city untouched, and Export current city as backup is available before applying. New growth uses the imported set too. The destination terrain, population, finances, scenario and simulation inputs stay intact; its existing save format already persists the two artwork maps (schema 111).

Manual printed pp.81–82 describes importing a saved city's complete Building Set into the current city and either accepting or cancelling. This implementation uses exported SIMS3000 city files, not original game binary files. It supports the currently implemented 14 RCI style families and footprint variants, not the original complete building catalog.

Two new regression suites verify atomic/deep-copy imports, complete resets, malformed-file rejection, legacy migration, save/monthly continuation and actual dialog handlers for preview, backup, cancellation, oversized files, stale asynchronous reads and one-time application. Full source regression count: 174. Browser layout and user acceptance remain unverified. Publication remains pending explicit Sites source-export approval; this checkpoint is not live.

Feedback exercise: customize two styles in one city and export it. In another city with its own model, import the first city's building set. Review the restored and imported styles, cancel once, reopen and apply, then save/load. Assess whether the preview makes the extent of the city makeover clear.


## Education service planning checkpoint — milestones 4 and 5

School access (ages 0–14), College access (15–24), and Adult learning access (25+) now have separate city and navigation maps. The maps use the existing per-home road-connected capacity coverage; schools cannot mask college shortages, and library/museum capacity remains separate from youth teaching. Occupied homes show red-to-green service coverage. Nonresidential tiles and age groups with no current demand are gray. Operating/inactive facility markers identify the relevant schools, colleges, libraries and museums; these capacity services have no invented radial service rings.

Players can open the maps from Civic services, City data or City view layers, keeping their construction tool. Navigation retains City as its default. These maps show access to places, not attained EQ. Demand uses the current citywide age mix distributed across homes, so this does not claim neighborhood-specific demographics. The manual pp.112–114 describes separate education services and diagnostic views; the three named layers are an authored browser adaptation, not a recovered original map catalog.

This release also corrects civic and station inspections to count each multi-tile home/workplace once when any member is reached. Resident/job totals still include only reached members, matching simulation allocation. A lot whose origin is outside the catchment is still counted when its edge is reached.

Feedback exercise: provide schools to a neighborhood but leave colleges absent. Compare the separate maps, build a connected college, then compare the adult map and add a library or museum. Reduce education funding, observe coverage and facility markers, then restore it. Inspect a station beside a multi-tile building and assess whether building counts and partial service totals are understandable.

Validation: three new suites cover real construction and coverage, disconnected homes, funding/strikes, zero-age demand, exact navigation/city colors through all four renderer rotations, relevant facility markers, actual Civic/City data/City view handlers, partial larger-lot catchments, read-only behavior and save restoration. Schema remains 111; no simulation inputs or save fields change. Browser visual acceptance and player feedback remain pending. Not published to Sites; source-export approval remains pending.


## Saved landscape and tree appearance checkpoint — milestone 5

City desk → Landscape & trees offers four landscape palettes (classic, lush grassland, dry grassland and cool highlands), the original grove artwork, and three original modeled tree families: broadleaf, evergreen and palm. Each modeled family has three planting densities and four distinct camera views. The preview rotates, changes remain a draft until applied, and restoring the original appearance is also previewed before application. The actual city renderer uses the chosen ground/coast/water/elevation colors and grove models, while the flora visibility preference still works.

Schema 112 saves the two appearance choices with each city, including custom challenge starting snapshots. Schema111 and earlier migrate to the original appearance. All tree-cover, environmental, demographic, building and utility simulation inputs remain unchanged. The actual large-map worker retains the selected appearance through monthly continuation. The current New City setup keeps the original visual defaults; players change appearance after accepting the terrain. Navigation remains a schematic map with its existing diagnostic colors.

Manual p.29 describes saved landscape/tree/building graphics choices and changing them during play. These palettes and botanical models are original artwork, not recovered original graphics sets; custom building choices remain in the separate designer and replacement workflow. The full original building/landmark catalog and browser visual/performance acceptance remain unfinished.

Validation: all 180 regression suites pass. New tests cover 36 distinct finite bounded tree views, deterministic transparent rasterization, actual four-view renderer integration, visibility controls, preview/apply/cancel/default handlers, bounded reusable 256px tree sprites, all appearance combinations, strict save validation, legacy migration, exact unchanged simulation, scenario starting snapshots and real worker continuation. The offline art sheet was rendered and visually inspected: [tree styles](previews/tree-styles.png). This is not a browser screenshot or browser acceptance result.

Feedback exercise: open Landscape & trees, compare a palm grove on dry grassland with evergreens in cool highlands, rotate the preview, then apply. Rotate the city, hide/show flora, save and reload, and restore the original appearance. Assess tree scale, readability and whether the visual settings feel coherent with the rest of the city.

This source milestone is not live. Explicit Sites source-export authorization remains pending after automatic approval review blocked publication.


## New-city artwork checkpoint — milestones 1 and 5

New City now includes landscape and grove choices with the same rotating artwork preview as City desk. Players can also reuse their current city's complete custom building set when founding either an empty city or a prepared starter town. The set applies to matching style/footprint variants immediately and to future growth. It is copied independently; the source city's simulation and artwork remain untouched.

Changing visual choices or toggling building-set reuse preserves terrain sculpting and starting funds. Regenerating the terrain retains the selected artwork, while deliberately rebuilding the terrain as before. Unchecking reuse returns the draft to original building artwork. Export current city remains available before accepting; Cancel discards the whole draft. The top-down terrain preview uses the selected landscape palette and continues to mark woodland schematically. The separate isometric sample previews actual grove models.

Manual p.29 places graphics and user-made building choices in New City Options; pp.81–82 describes carrying building sets between cities. This checkpoint extends the prior saved-appearance and building-set milestones to city creation. Reuse in the new-city window uses the currently open city; importing another exported city remains available through City desk. No new save fields or simulation coefficients are introduced (schema112).

The new regression suite covers empty/starter cities on 48/96 maps, matching terrain/population/capacity/funds against default generation, isolated model copies, save restoration, invalid option rejection, and actual setup controls for sculpting, artwork selection, rotation, reuse, regeneration, unchecking, backup, acceptance and cancellation. Browser visual acceptance and user feedback remain pending. These original graphics choices are not the full original game catalog.

Feedback exercise: customize a building in your current city, open New City, select a landscape/tree style and enable building-set reuse. Sculpt a hill, change the artwork and verify the hill remains. Accept and inspect the new city's appearance, then save/load. Assess whether the distinction between visual choices, terrain regeneration and the current city's data is clear.

Not published to Sites; explicit source-export authorization remains pending.


## Neighbor status scenario checkpoint — milestone 6

The scenario creator now exposes active/inactive goals and conditions for a specific neighbor connection or trade deal (manual p.188: Neighbor Connection Status Is / Neighbor Deal Status Is). The 47 queries cover five boundary connection types for each of the four land neighbors, the overseas seaport connection, and each supported neighbor/resource/import-or-export contract. The state menus work in goals, event conditions and ranks; shared conditions also work in structured scenario routines.

A connection is active when it has been registered and its exact boundary route still exists, or its seaport is operating. A deal is active when a signed, non-failed contract matches the neighbor, resource and direction and its connection is available. Idle imports still count as active contracts. Connection status does not promise local supply or transport access; authors can combine status with existing supply and service goals. Numeric text insertion and variable reads use 0/1, consistent with other state queries; goal and condition labels show Inactive/Active.

Two new suites verify all 47 definitions, every land connection and contract direction, operating/failed seaports, cancelled/failed/idle deals, neighbor specificity, invalid state targets, actual editor controls, and a real two-month import challenge that loses its streak after disconnection, recovers, saves and wins. A repeating routine uses the state in an If branch, and direct versus actual worker continuation agrees on a 96×96 city. Replay restores the original disconnected city. All 183 regression suites pass. Schema113 identifies this creator capability; schema112 cities still load. Cache graph: scenario-neighbor-status-1.

This adds status queries, not the remaining Enable/Disable Neighbor Deal scripting commands or a full original scenario virtual machine. Those remain fidelity work.

Feedback exercise: author a two-month goal requiring an eastern power connection and eastern power-import deal. Build/register the route, sign an import, interrupt it, then recover. Assess the Active/Inactive descriptions and whether the streak reset makes the challenge understandable.

Local preview update: the installed Sites 0.1.62 portable workflow permits local browser verification; the earlier restriction applied to the old/cloud workflow. The local server returned HTTP200, but the computer-use tool reported that the Mac is locked and automatic unlock failed. No browser interaction or visual acceptance was completed. The local server was stopped afterward. Unlocking the Mac is the current browser-check prerequisite; the earlier pending browser-testing permission question is superseded by these current skill instructions.

Not published to Sites. The separate automatic approval rejection of repository source export still requires explicit user authorization and has not been retried.
