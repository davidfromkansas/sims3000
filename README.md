# SIMS3000

Playable browser city-builder reconstruction guided by the SimCity 3000 Unlimited manual. Six feedback milestones cover founding a city, utilities, finance, civic services, transport, and scenarios/disasters. Current gameplay includes city growth, service networks, budgets, transit, airports/ports, nine disaster types, five prepared challenges, a custom scenario editor, saved cities, photos, and original generated and procedural art. This is substantial work in progress, not verified full parity with the original game.

[Play the hosted game](https://sims3000-city-lab.davidfromkansas.chatgpt.site). See [current fidelity and remaining work](docs/CURRENT-FIDELITY.md), [feedback milestones](docs/MILESTONES.md), and [development workflow](docs/DEVELOPMENT.md). The current regression set contains 183 suites; save schema is 113.

Run `npm start` and open http://127.0.0.1:4387. The website has no runtime npm dependencies or build step. Run `npm ci` before regression tests; IndexedDB tests use the development-only `fake-indexeddb` emulator. The authored static website is in `dist/`.

Run `npm test` for simulation regression checks. See `docs/MILESTONES.md` for the playable roadmap and `docs/manual-fidelity.md` for documented rules, approximations, and omissions.

Saves are local to the browser and origin. Export a city before switching URLs or browsers. Manual saves and autosaves are separate; import validates data before changing the current city. Supported older schemas migrate without inventing missing history.

Art is in `dist/assets/city-atlas.png`; the built-in Imagegen prompt is in `docs/sprite-prompt.txt`.


## Historical checkpoint notes

The notes below record earlier development states. Use the current fidelity document above for current scope and validation.

## Fire response checkpoint — milestone 6

Players can start a fire from Emergency, dispatch one volunteer unit plus one per fire station, reposition units, clear firebreaks, and bulldoze rubble to rebuild. Optional random fires default off. Fire coverage and water-related flammability affect suppression and damage; stations do not prevent ignition. Whole power plants can be destroyed. Active emergencies save and restore held until resumed. Normal speed controls lock during response.

Ten simulation suites pass, including containment, unit limits/cycling, flammability, damage/displacement, rubble recovery, whole-plant loss and emergency saves. Generated flame/rubble art is integrated. Browser layout and interaction remain unverified.

Manual references: printed pages 22–23, 56–57 and 108–110. Response proceeds at fixed 700ms steps with the calendar held; spread/damage formulas are approximations. Other disasters, warning sirens, terrain editing, rewards and scenarios remain outstanding. Feedback checkpoint: try starting a fire, placing units beside it and rebuilding afterward; assess clarity, response time and difficulty.


## Scenario checkpoint — milestone 6

Scenarios & status offers three original challenges: A town takes root (400 residents, occupied-lot electricity and nonnegative treasury within 60 months); After the sirens (scheduled month-3 fire, containment, rubble clearance and 224 residents within 24 months); The road back (repair neglected streets and sustain population, cash and operating surplus for six consecutive months within 36 months). A briefing precedes replacement of the current city, with an export option. Live objectives appear in the sidebar and status panel. End-of-month evaluations produce persistent win/loss and rank, pause for the result, and offer retry or sandbox continuation. Schema11 preserves scenario progress and migrates earlier saves to sandbox.

Manual structure: printed pages34 and66 describe prepared cities with goals, a scenario selection screen and a status report. These maps, thresholds, deadlines and ranks are original authored challenges, not reconstructed shipped scenarios or the full Scenario Creator. They reuse existing Imagegen buildings and the actual simulation.

Eleven simulation suites cover the prior city systems plus scheduled fire timing, containment victory, viable road-repair victory, deadline loss and exact-boundary success, consecutive-month reset, duplicate-evaluation protection, terminal outcomes, save validation and legacy migration. Browser layout and interaction remain unverified. Feedback: are briefing, progress, time pressure, outcomes and retry/continuation clear? Full manual fidelity remains incomplete.


## Water infrastructure checkpoint

Utilities now includes inland water towers, coastal desalinization plants (available in 1960), and pipe-connected water treatment plants. Sources need electricity. New maps distinguish a saltwater coast from a freshwater lake at tile39,10; saves from schema11 and earlier preserve freshwater behavior. Source/treatment age advances monthly; replacement resets age while retaining pipes. Inspect reports age, capacity, electricity, source suitability, pollution and pipe connection. Original Imagegen sprites represent the three new structures.

Manual printed pages52,117–118 define source distinctions, the 1960 unlock, connected treatment and aging. Approximate implementation: one-tile footprints; tower120/desalination350/pump500 base capacity; pump freshwater radius2; desalination adjacency radius1; treatment reduces connected-grid pollution by50% per powered plant, capped80%; efficiency declines after20years to a15% floor. Towers are more pollution-sensitive. Prices/upkeep and these numeric curves are authored approximations. Regional contracts can use the resulting network capacity.

Twelve simulation suites pass, including inland supply, fresh/salt separation, technology gating, connected/powered treatment, disconnection, aging, replacement, upkeep, save migration and regression coverage. Browser interaction/layout remains unverified. Feedback: can you choose an appropriate source, diagnose reduced output, and restore an aging or polluted grid? Full manual fidelity remains incomplete.


## Waste management checkpoint

Utilities now offers recycling centers (1970), incinerators (1920) and waste-to-energy incinerators (2000), each with original Imagegen artwork. Recycling reduces newly produced waste on connected roads and needs electricity. Trash Presort is available in Civic services. Incinerators process remaining delivered garbage before landfill/export, create pollution and lose capacity with age. Waste-to-energy output depends on actual combustion, can supply an isolated electrical grid, and falls to zero when fuel stops. Inspection and the utility report expose capacity, age, output and last-month throughput.

Manual printed pages53 and103–104 establish technology dates, finite recycling capacity, presort, road delivery, incineration pollution, aging and waste-derived power. Approximate values: one-tile facilities; capacities60/100/180; recycling share30%, presort45% with50% capacity increase; electricity2 per burned unit capped360. Incinerators operate without external electricity in this model. Prices/upkeep, pollution and age curves are provisional. Regional garbage imports feed the same disposal chain, and exports remove its residual waste.

Thirteen simulation suites pass, including recycling share/presort, power and road isolation, capacity, pollution, age/replacement, actual fuel-to-grid generation, fuel exhaustion, residual landfill priority and schema13 migration. Browser layout/interaction remains unverified. Feedback: do disposal choices create clear tradeoffs, and can you diagnose exhausted capacity or lost waste-to-energy output? Full manual reconstruction remains incomplete.


## Save reliability update

Autosave, manual save, export, replacement backups and construction undo now serialize authoritative state rather than derived networks/coverage/statistics. A developed sample shrank from2,435,174 to797,984 bytes. Existing full snapshots remain readable; load recomputes derived state. Random seeds are validated and restored, avoiding divergent development after loading a non-default seed. Failed autosaves show a notification and Save failed button state, with export guidance.

Fourteen suites pass. Save-specific checks cover nonmutation, compact size, deterministic36-month continuation, active fire and scenario state, layered infrastructure, old snapshots and invalid seeds. Browser interaction and actual storage quota behavior remain unverified.


## Power technology checkpoint

Power now includes coal, oil, gas, nuclear, wind, solar, microwave and fusion, alongside the existing waste-to-energy facility. Invention dates follow manual pp51–52:1900 coal/oil,1955 gas,1965 nuclear,1980 wind,1990 solar,2020 microwave,2050 fusion. Plant footprints, upkeep, local pollution and connected-grid capacity differ. Output declines with age; inspection shows current/potential output. Entire footprints are removed by demolition/fire, and save validation checks their integrity. Seven original Imagegen sprites extend the existing coal artwork.

Capacities/prices/footprints/age curves are approximations: wind1×1,gas3×3,others4×4; output declines after20years to a15% floor. Nuclear/microwave accidents, overload explosions and hill-dependent wind output are still unimplemented and disclosed in the plant inspector. These gaps prevent a full power-system fidelity claim.

Fifteen simulation suites pass. Power-specific coverage exercises all technology gates, cost, multi-tile construction, emissions/upkeep, grid supply, aging blackouts, disconnected districts, demolition/fire damage, save roundtrips and invalid footprints. Browser layout/interaction remains unverified. Feedback: can you compare plant options and diagnose declining output before expanding your city?


## Power overload checkpoint

Connected electrical demand now determines plant load. Inspect shows load and consecutive overload months; advisor/news warnings call for added capacity or imports. Six consecutive overloaded months destroy the plant footprint and ignite adjacent combustible tiles, reusing the fire response and rubble recovery systems. Restoring enough connected capacity resets the streak. Imported electricity relieves native load; failed export contracts add no fictitious demand. Countdown state survives saves through plant stress.

The manual’s printed page116 describes blackouts and destruction from prolonged overuse. The six-month threshold, shared load ratio across plants and one-tile ignition perimeter are approximations. Nuclear radiation/meltdown consequences remain absent; nuclear plants currently have the same structural failure and fire behavior as other plants. Wind terrain effects remain absent.

Sixteen suites pass, including saved overload countdown, six-month failure, adjacent fires, capacity recovery, disconnected spare capacity, import relief and export accounting. Browser interactions remain unverified. Feedback: do warnings arrive early enough, and can you identify which grid needs more supply?


## Landscape checkpoint

Landscape offers Raise, Lower, Level, Surface Water and Plant Trees. Height changes propagate to neighboring terrain to maintain one-step slopes and reject the entire edit if buildings, utilities, bridges or ponds would be affected. Level uses the first selected tile, including reverse drags. Previews include propagated tiles and costs. Freshwater ponds on undeveloped elevation-zero land feed pumps. Repeated tree placement advances three maturity stages with original Imagegen sprites and stronger environmental benefit. Elevation moves terrain and buildings in the isometric view; pointer selection accounts for elevation in all rotations. Multi-tile power plants and airport/seaport development require level footprints. Wind output gains10% per height step. Compact schema15 saves retain elevation and maturity, with earlier saves restored at heightzero.

Manual printed page44 supplies the landscape tool behavior. This is an eight-step terraced approximation; free pre-city terrain generation, negative elevations, smooth slopes, detailed road/rail grading and broader terrain options are unfinished. Costs and wind/forest effect curves are provisional. Browser visual inspection remains unperformed.

Seventeen simulation suites pass: propagation/cost, atomic protected edits, reverse leveling, flat foundations, pond-fed pumps, underground protection, tree maturity/environment, hilltop wind, save migration and pure geometry checks for raised-tile picking in four rotations. Feedback: can you predict the affected area, level a build site and use ponds/trees/hills in city planning?

0.7.1 adds City desk → New city terrain previews, profile sliders, coast selection, seeds, free sculpting, mayor names, starting-year technology gates and difficulty funds. See the terrain setup feedback checkpoint in docs/MILESTONES.md.

0.7.2 adds persistent nuclear fallout after overload failure, marked contaminated land, displacement, development exclusion, inspection warnings and Emergency reporting.

0.7.3 adds City desk → City data · maps & trends, three-metric comparisons, 100-year history and aura/density/water-pollution overlays.

0.8.0 adds seven recreation structures and Imagegen sprites, shoreline marinas, full footprints, health/value effects and zoo demand boosts. Find them in Recreation.

0.9.0 adds agricultural patches, educated clean industry, clean-water tax incentives and City desk → Industry & farming diagnostics.

0.10.0 adds City desk → Rewards, persistent offers for the Mayor's House, stadium and university, and three new Imagegen sprites.

0.11.0 adds road, highway and rail tunnels beneath qualifying ridges, construction quotes, underground route view and three original portal sprites.

### Earthquake recovery checkpoint
Open City desk → Emergency & disasters → Choose earthquake epicenter, then click land. The quake breaks buildings and transport/utility links in eight response steps; resulting fires keep the emergency running. Clear rubble, reconnect services and let zones rebuild. Random earthquakes are optional and off by default. Active-quake saves resume with processed damage preserved.

### Technology timeline checkpoint
City desk → Technology timeline shows dated power, water, waste and transport options. Start in 1900 to unlock subways in 1912, airports in 1915, buses in 1920 and highways in 1940. January notices announce newly available options.

### Annual budget review
New cities pause for a budget review after each completed year. Budget → Auto Budget keeps your current settings and skips reviews while year-end funds are nonnegative. Negative funds always prompt review. Older saves with finance data migrate with Auto Budget enabled.

### Historical buildings
Inspect an occupied residential, commercial or non-farm industrial building and check Make historical. Its appearance is retained and surface redevelopment is blocked. Uncheck it before demolition. Service failures can still cause abandonment, and disasters can destroy it.

Tornado checkpoint: Emergency now offers manual and optional random tornadoes with original Imagegen artwork, moving surface damage, secondary fires and recovery.

Early warning checkpoint: approaching tornadoes now open Emergency before impact. Sound the siren to reduce building damage; false alarms lower public trust.

Policy checkpoint: Budget → Ordinances now opens civic policy controls, including carpool incentives and clean-air regulations with annual and monthly costs.

Revenue-policy checkpoint: Parking fines generate commuting-based income with a residential aura penalty. Budget reports ordinance revenue separately.

Water-quality checkpoint: polluted surface water turns brown; source inspection reports output lost to pollution and recovered by treatment. Utilities links directly to the pollution map.

Business-deal checkpoint: casino petitioners offer a monthly stipend for a crime-attracting facility. Accept or decline through Budget → Business deals, and place an accepted offer when ready.

Public-safety checkpoint: crime now lowers property values and the tax base. Inspect a tile to see its value loss; police and Neighborhood watch can help it recover.

Report checkpoint: City data now includes current workforce/employment and domestic power-source breakdowns with labeled shares and counts.

Garbage-report checkpoint: City data records monthly generation, imports, disposal methods, exports and remaining waste. Its yearly total labels partial history explicitly; older saves begin recording on their next month.

Health checkpoint: Civic services explains the long-term life-expectancy target. Both air and water pollution around occupied homes now reduce health, weighted by the residents exposed.

Education checkpoint: schools and colleges teach young residents; libraries and museums preserve adults’ knowledge. Civic services and City data show separate education groups and their monthly trends. Older cities preserve their current education when migrated.

Locust checkpoint: Emergency offers a moving locust swarm and up to three crop dusters. Spray its route to protect trees and farms; affected farms retain zoning for recovery.

Locust follow-up: optional random plagues arrive at map edges. Emergency displays each crop duster’s assignment and remaining spray time; new orders reuse ready aircraft first.

Riot checkpoint: Emergency now offers riots and police dispatch. Disperse moving crowds using local coverage and police squads, then extinguish any resulting fires.

Unrest checkpoint: enable condition-driven riots in Emergency. Six consecutive months of high crime or low wellbeing create outbreak risk; improving conditions resets it. The panel reports the warning period and current chance.

Scenario creator checkpoint: City desk → Scenarios → Create a challenge lets you set up to four goals and a deadline for the current city. Export the city after beginning to share a playable starting state with its objectives.

Scenario events checkpoint: custom challenges can schedule up to four fires, earthquakes, tornadoes, locust plagues or riots. Event progress appears in scenario status and survives city-file export.

Conditional scenario events: authors can require a metric threshold before a disaster triggers. Conditions are checked monthly from the chosen month, fire once, and can be avoided without blocking victory.

Scenario storytelling checkpoint: authors can add a briefing and separate win/loss messages. Text travels with the challenge city and appears in scenario status at the appropriate stage.

Repeating scenario events: choose up to twelve occurrences and a month interval for each event. Required series must finish before victory; conditional series recheck the threshold each time.

Scenario feedback checkpoint: combine up to four disaster conditions with AND/OR. Try making a riot depend on both high crime and low funds, then prevent it by improving either factor.

Infrastructure challenge checkpoint: set goals for operating airports/seaports, active bus stops, actual bus/rail commuters, and occupied homes lacking power or water. These metrics also work as disaster conditions.

Disaster checkpoint: falling space junk is playable from Emergency or as a scheduled scenario event. Six satellite impacts damage surface structures and start fires; dispatch firefighters, clear rubble and restore services.

Space-junk follow-up: optional random falls are available in Emergency (off by default), with deterministic monthly checks and saved settings.

Emergency response checkpoint: current-disaster dispatch controls appear first, with quick police, crop-duster and tornado-siren actions when relevant. Guidance and settings are grouped into expandable sections.

Toxic cloud checkpoint: start drifting gas from Emergency or schedule it in a challenge. Affected zones empty and can redevelop afterward; infrastructure remains.

Toxic-cloud prevention: optional random outbreaks now depend on local pollution at occupied dirty factories. Emergency shows risk and source coordinates; clean industry and pollution reduction can remove the risk.

Business-deal checkpoint: a Toxic Waste Conversion Plant can be offered alongside the casino. It pays §300/month but pollutes nearby land/water and can originate enabled toxic-cloud outbreaks.

Budget checkpoint: expand Business income breakdown to see each facility’s payment, permit/placement status and local effects. The total reconciles with current business revenue.

Scenario checkpoint: business income and facility counts can now be goals or disaster conditions, including a no-toxic-waste objective.

Prepared scenario: A cleaner legacy starts with a toxic-waste plant and challenges you to retire it, grow to 400 residents, keep pollution at 15 or below and retain §5,000 for six consecutive months.

Scenario authoring: choose a consecutive-month holding period for all goals. The progress screen tracks the streak; missed goals reset it, and saves preserve it.

Whirlpools can now be started from Emergency or scheduled in custom scenarios. A procedural isometric current uses rotating foam, depth shading and a reduced-motion static form. Four expanding pulses over 24 response steps destroy exposed bridges and shoreline structures; buried pipes/subway and inland development survive. Save schema 50 preserves active incidents and migrates older cities. Manual pages 58, 111 and 189 establish the disaster and ineffective emergency dispatch; radius, timing and damage rules are original reconstruction tuning, not verified legacy coefficients. General siren protection remains unfinished.

Optional natural whirlpools: Emergency → Random disaster settings now allows a saved, default-off 0.3% monthly chance when surface water exists. Targets are selected only from water; dry cities are immune. Active emergencies prevent overlap and setting changes. The rate is original tuning; schema 51 migrates older saves with this threat disabled.

Alien attacks (schema 52): Emergency can start a UFO at a chosen tile; custom challenges can schedule one. An Imagegen craft hovers above an animated beam, gives eight warning steps, then makes six 3×3 surface strikes across 24 attack steps. The early warning siren now protects against alien attacks according to saved public trust. Buried pipes and subway survive. Manual pages 58, 111 and 189 establish the attack, dispatch limitations and siren; target selection, strike count, timing and protection rates are reconstruction tuning. Legacy-specific effects beyond the implemented attacks remain unfinished.

Optional random alien attacks (schema 53) are disabled by default. Eligible cities with occupied zones or constructed facilities have a 0.2% monthly chance when enabled. Each incident opens the emergency warning panel before attack progression, allowing the siren to be used. Empty cities do not attract attacks. The chance is reconstruction tuning, not a verified legacy coefficient.

Landmarks (schema 54): City desk → Landmarks opens an illustrated collection; the toolkit also provides a Landmarks category. Original Imagegen Eiffel Tower and Great Pyramid sprites can be placed immediately, one per type, on clear level footprints. Both are free with no upkeep or direct simulation bonus. Save imports reject duplicates, demolition removes whole footprints, and alien craft prioritize standing landmark roots. Manual pages 56 and 124 establish availability, uniqueness and alien attraction; the first two-building collection is not the full legacy catalog. Footprints and pricing are reconstruction choices.

Custom landmark goals (schema 55): challenge goals and event conditions support total standing landmarks, Eiffel Tower and Great Pyramid individually. Destruction removes them from the count; rebuilding qualifies again. Required events and emergency response still gate victory, and consecutive-month requirements can enforce sustained recovery. This is a reconstruction scenario-editor extension, not a claim of complete legacy scripting fidelity.

Living traffic: procedural shaded vehicle samples now reflect computed road/highway loads, with more vehicles on busier segments and slower motion above capacity. Only connected neighboring surface links are drawn; bridge axes and elevated highway height are respected. Vehicles remain in place on pause, during emergencies, while a dialog is open, and with reduced motion. Sampling is capped at 180; these are visual traffic indicators rather than individually simulated trips. No save schema change.

Civic programs (schema 56): Junior Sports adds three points to the youth education target and reduces crime by 5%; Free Clinics adds three years to the long-term health target. Both start disabled and can be enacted/repealed in Civic services. Monthly costs are population-based, rounded up: §0.015/resident for sports and §0.02/resident for clinics. The ordinance UI and budget use the same cost helper; health reports show clinics separately. Empty cities incur no cost or demographic change. Manual p.112 supports pro-health policies; the [archived game text](https://gamefaqs.gamespot.com/pc/190488-simcity-3000/faqs/54518) identifies both programs and their population-based costs and effects. Coefficients are reconstruction tuning.

Conservation policies (schema 57): Power Conservation and Water Conservation each reduce modeled demand by 10%, with population-funded monthly costs of §0.02 and §0.015 per resident respectively, rounded up. Network allocation, plant overload and actual deficit imports use the reduced demand. Civic services and Utilities report city demand and savings, including unserved zones. Source: [archived game text](https://gamefaqs.gamespot.com/pc/190488-simcity-3000/faqs/54518), ordinance descriptions for Power and Water Conservation. Exact rates are reconstruction tuning. Existing saves migrate with both disabled.

City snapshots: City desk → City snapshots captures the current map viewport at 640, 1024 or 1600-pixel maximum width, without the construction hover. PNGs retain city/mayor/date/population/funds metadata and editable 500-character captions in a browser-local IndexedDB album, grouped by city name. Browse chronologically, enlarge, download PNGs or delete individual photos. A transactional 50-photo limit prevents unbounded storage; city save files do not include albums. Manual pp.63–65 is the source. Cursor-based crop framing and importing shared albums remain unfinished. Browser QA verified capture, caption persistence in a new tab, chronological navigation, enlargement and deletion. No city save schema change.

Photo mode: City snapshots now includes a movable 4:3 camera frame with three frame sizes, Space cycling, click capture and Escape cancellation. The selected output resolution is an upper limit; small crops retain their native detail. Albums remain local to the browser.

Farm disaster recovery: destructive fire, impact, wind and quake damage treats a developed 3×3 farm as one property, consistent with the existing crop-loss model. Rubble retains industrial zoning; clearing it permits redevelopment under normal farm conditions. This footprint rule is reconstruction tuning; the manual does not give a per-field damage formula.

Scenario industry goals: Developed farms counts one developed barn per farm; Clean industrial buildings excludes vacant and dirty industrial sites. Both support goals, consecutive-month streaks, disaster conditions and city-file exports. The farm-count objective follows the manual’s Variable Manager example (printed page 181).

Portable photo albums: export a selected city album to SIMS3000 JSON and import it into another browser. Photos, saved captions and metadata travel together; local database IDs do not. Imports validate metadata and PNG dimensions, decode every image, and add the entire batch in one transaction subject to the 50-photo capacity. Maximum archive size is 100 MB. These are this website’s album files, not original SC3KU files or playable city saves.

Live scenario messages: briefing, success and failure text support named placeholders for city, mayor, calendar year and every scenario metric. The editor includes cursor insertion and a plain-text preview. Scenario status resolves current values and escapes the resulting text. Unknown placeholders stay literal; substitutions do not execute code or expand recursively. Templates persist in challenge exports.

Navigation map: clickable overhead map with independent data layers, rotation-aware targeting, keyboard navigation and a projected ground-view outline. Recentring accounts for terrain elevation. Inspired by the manual’s Navigation Panel (page 40) and data-map navigation (page 64); the rectangular overhead presentation is adapted for this website.

Sound effects: optional synthesized Web Audio cues for successful construction, bulldozing, rejected construction and new emergency incidents. City desk provides enable/mute, volume and previews. Settings are browser-local; muted startup creates no audio context, hidden tabs stay silent, and loaded emergencies do not replay historical alerts. This is an original effects layer; the original music and complete sound library remain unimplemented.

Skyline artwork: two additional original Imagegen sprites, a terraced residential tower and stepped glass commercial skyscraper, vary high-density RCI lots deterministically by coordinates and city seed. The selection preserves historical appearance through vacancy within this artwork set and requires no city-save schema change. Tall-zone culling accounts for sprite height. Both transparent PNGs were visually checked in a dense renderer fixture.

Rail motion: procedural three-car trains follow connected surface-track paths with positive computed passenger loads. Bends, loops and bridge axes are respected; disconnected routes with no riders show no trains. Motion uses the existing pause/hidden-tab/reduced-motion clock and is visible in City and Rail views. These are capped decorative traffic samples, not individual simulated train schedules; underground tunnel spans are not drawn.

Building replacement: Inspect high-density residential/commercial towers to preview and apply a citywide replacement of their original style, including future occurrences. Revert restores that style; replacements do not chain into other mappings. The initial library offers two styles per sector. Schema 58 saves the citywide mapping; prior saves migrate to no overrides. Gameplay and simulation statistics are unchanged. This follows the manual’s query-driven replacement scope (pages 74–77); imported building files and the full catalog remain incomplete.

Current scope and evidence: [docs/CURRENT-FIDELITY.md](docs/CURRENT-FIDELITY.md) is the current fidelity audit. Older entries in the manual-fidelity and milestone journals are historical. The in-game Roadmap now reflects all six playable checkpoints and links each card directly to its feedback form. Full manual parity remains incomplete.

Scenario background rules: custom challenge authors can suspend random disasters and new automatic business proposals until the outcome. Scripted events, existing offers/permits/income, manual disaster tools and infrastructure failures continue. Random preferences are preserved and restored to effect after the challenge. Save schema 103 retains these rules through import and replay; older definitions default to allowing both. This checkpoint is merged source work; publication after live version 150 remains pending authorization.

Neighborhood building designer: all 14 existing non-farm RCI styles now support custom models and same-zone-family artwork replacement, including homes, shops and dirty/clean industrial buildings. Parametric designs allow 1–24 floors; block designs and surface paints work across the expanded library. Historical and abandoned buildings retain their models. Schema 104 saves the expanded library. This source checkpoint is not yet published.

Disaster relief: catastrophic response sessions now receive a single recovery grant when every overlapping hazard and fire ends. The amount reflects recorded destruction, displacement, infrastructure loss and locust crop/vegetation loss, weighted by residential fire/water preparedness captured at the start. Emergency and Budget show the assessment and transparent original calibration; one-time grants appear separately in year-end accounts and do not inflate recurring revenue. Schema 105 preserves pending assessments and prevents duplicate awards after loading. This checkpoint is not yet published.

Four-view civic buildings: police, fire, hospital, school, jail, college, library and museum now use distinct original procedural models that rotate with the city. Per-pixel depth resolves overlapping wings, roofs and details before caching each view as a sprite. Service footprints, funding, capacities and simulation behavior remain unchanged. All 32 views are documented in docs/previews/civic-building-models.png; this source checkpoint is not yet live.

City view layers: the sidebar and City desk now open the manual’s six above-ground element controls, a terrain-grid toggle, view selector and Apply/Default View actions. Visibility settings persist in this browser across cities. Data and underground views retain their diagnostic content; hidden buildings still occupy their lots, and hazards, damage and construction previews remain visible. Save schema stays 105. This source checkpoint is not yet live.

Unobstructed city view: Hide in the map controls, City desk → Hide toolbars, or H hides the header, toolkit, information bar and navigation controls. A persistent Show controls button, H or Escape restores them. Hotkeys remain usable, focus returns to the canvas, and active construction drags are cancelled before resizing. The camera center, zoom and rotation are retained. This is an in-page view, not browser fullscreen; it resets on reload and does not change city saves. This source checkpoint is not yet live.

The [ and ] keys rotate the city counterclockwise and clockwise, including with toolbars hidden and during background monthly updates. Modified, editing and repeated key presses are guarded.

Scenario calendar queries: custom goals, event/rank conditions, variable copies/calculations and message values can now read Calendar date, Calendar year and Calendar month. Date thresholds use month/year inputs with contextual defaults and readable reports; named months support seasonal checks. Date variables use year × 12 + zero-based month, so date subtraction gives elapsed months. Schema 106 preserves these definitions. This source checkpoint is not yet published.

Keyboard construction: arrow navigation follows map rotation and keeps the selected tile visible on every map size. Shift + Enter anchors a road or area selection; arrows extend it, Enter builds through the normal construction rules, and Escape cancels. This source checkpoint is not yet published.

Economic scenario queries: goals, event/rank conditions, messages and variable operations can inspect average land value, each RCI tax rate, and remaining loan payments including interest. Debt shares the Budget calculation. Decimal rates remain exact in comparisons; existing integer variables round copied rates. Schema 107; publication pending.

Environmental scenario queries: authors can test water pollution, average road traffic, citywide power/water surplus and uncollected garbage in goals, conditions and messages. Surplus is supply after trade minus demand; it does not prove local connectivity. Pollution and traffic match Reports. Schema 108; publication pending.

Water facility models: pumps, water towers, desalination and treatment plants now use original geometry rendered in four orientations. Sixteen cached views preserve existing footprint, simulation and water-overlay behavior. See docs/previews/water-facility-models.png. Publication pending.

Power plant models: all eight technologies now have original four-view geometry, including coal yards, oil tanks, gas turbines, nuclear cooling towers, wind rotors, solar arrays, microwave receivers and fusion domes. Thirty-two cached views scale to the existing plant footprints. Preview: docs/previews/power-plant-models.png. Publication pending.

Wind turbine motion: rotors turn continuously using the existing scenery clock, with an eight-second revolution. Vector blades pass correctly in front of or behind the cached tower by map rotation. Pause, dialogs, hidden tabs, emergencies and reduced-motion settings hold the clock; scenery preferences and diagnostic views select static artwork. Preview: docs/previews/wind-turbine-motion.gif. Publication pending.

Latest source milestone: import another exported city’s complete building set with a change review, backup and cancellation. See [building-set import](docs/BUILDING-SET-IMPORT-MILESTONE.md). Not yet published to the hosted game.

Latest source milestone: separate school, college and adult learning service maps, with larger-building service counts. See [education service planning](docs/EDUCATION-SERVICE-MAPS-MILESTONE.md). All 177 regression suites pass; this source release is not yet hosted.

Latest source milestone: saved landscape and grove artwork choices, including 36 original modeled tree views. See [city appearance](docs/CITY-APPEARANCE-MILESTONE.md). All 180 suites pass. Not yet hosted.

Latest source milestone: select landscape/grove artwork and inherit the current building set while founding a city. See [new-city artwork](docs/NEW-CITY-ARTWORK-MILESTONE.md). The full 181-suite regression run passed; not yet hosted.

Latest source milestone: require specific neighbor connections and import/export deals in scenario goals, conditions and routines. See [neighbor status challenges](docs/SCENARIO-NEIGHBOR-STATUS-MILESTONE.md). All 183 suites pass; not yet hosted.

Scripted neighbor-contract checkpoint: scenario events and routines can create or end real agreements, recording results and normal termination fees with save/load continuity. See [neighbor contract milestone](docs/SCENARIO-NEIGHBOR-DEALS-MILESTONE.md). Schema114; 184 regression suites passed. Manual parameter/fee semantics are an explicit interpretation. Not yet hosted.

Reward inspection checkpoint: rotate previews of the Mayor’s House, Stadium and University before placement, with matching four-sided models in the city. See [reward building inspection](docs/REWARD-MODELS-MILESTONE.md). All 186 regression suites passed; schema114, cache reward-building-models-1. Not yet hosted.

Earthquake scenario checkpoint: choose magnitude1–100 in timed events and routines, inspect the chosen strength during response, and preserve it across saves. Default50 retains previous behavior; other damage/radius scaling is explicit reconstruction tuning. See [earthquake magnitude](docs/EARTHQUAKE-MAGNITUDE-MILESTONE.md). All 187 regression suites passed; schema115, cache earthquake-magnitude-1. Not yet hosted.

Tornado scenario checkpoint: configure direction, intensity, distance, travel speed and early warnings in timed events and routines. Saved storms preserve movement pauses and siren preparation. See [authored tornado paths](docs/TORNADO-CONTROLS-MILESTONE.md). Schema116; cache tornado-controls-1. Manual-named controls use explicitly documented reconstruction ranges and damage tuning. Not yet hosted.

Large-city routing checkpoint: stop commuter searches when reachable jobs are exhausted, preserving exact route allocation. A synthetic 122,880-resident fixture improved from 6.83s to 1.49s per monthly tick (three-sample medians on this Mac). See [large-city routing](docs/LARGE-CITY-ROUTING-MILESTONE.md) for limits and raw measurements. All 189 regression suites passed; schema116 unchanged, cache large-city-routing-1. Not yet hosted.
