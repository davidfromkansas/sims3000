# Manual fidelity implementation history

**For current status, use [CURRENT-FIDELITY.md](CURRENT-FIDELITY.md).** The entries below are historical checkpoints. Their version-specific descriptions and future-work statements can be superseded by later work; they are retained as implementation provenance.

Source: [SimCity 3000 Unlimited manual](https://excalet.com/technology/game_manuals/simcity_3000_unlimited.pdf). Page numbers below are the printed manual numbers (the PDF has a one-page offset).

## Documented behaviors represented in milestone 1

| Manual location | Behavior | Implementation |
| --- | --- | --- |
| pp. 10–11 | Start/load paused; isometric city view, toolbars, time/population/funds/demand | Paused startup and restored cities; right toolbar and bottom information bar; responsive alternative |
| p. 12 | Drag straight roads; preview; cancel with Shift on release | Atomic placement with cost/footprint preview; Shift-release and Escape cancellation |
| pp. 13–15 | RCI zoning; coal plant 4 × 4; electricity before development | Rectangular light RCI zoning; 4 × 4 coal footprint; powered growth |
| pp. 98–100 | Demand, density limits, transportation and power; light zones may grow without water | Light-density implementation; shared road network; demand affects growth |
| p. 115 | Buildings/zones relay power within five tiles; lines radiate five tiles and cross water | Electrical components over conductive tiles within a five-tile Chebyshev neighborhood; connected-component capacity |
| pp. 114, 116 | Loss of power causes residents to leave; limited plant capacity | Sustained service-loss abandonment; component-local generation allocation |

## Explicit approximations

The manual is not a simulation source-code specification. Do not present these numbers as original SimCity 3000 rules:

- 48 × 48 city and deterministic coastal terrain.
- Four-tile Chebyshev road-access range; road components must service residential and at least one employment zone. This is a simplified commuting model.
- Prices, starting treasury, monthly tax income/upkeep, 500-unit coal capacity, and power use per lot.
- Four months to service-loss abandonment, seeded probabilistic monthly growth; light lots contain eight residents / six shop jobs / twelve industrial jobs, with density multipliers detailed below.
- RCI demand and economy are calibrated approximations. Local land value and pollution now affect development; unemployment, wealth, and public-service simulation remain incomplete.
- Electrical distance uses a square radius; exact original geometric/routing and priority rules are not published in this manual.
- Park sprites also stand in for undeveloped vegetation in this initial artwork pass. Parks have upkeep, local land-value benefits, and pollution reduction.
- Rotation repositions map tiles; sprites retain one facing. Four-direction building art is future work.
- One-tile RCI lots with three density-stage sprites per sector; one sprite facing regardless of camera rotation.
- Device-local saves only. No cloud saves or multiplayer.

## Utilities milestone implementation

- Manual pp. 16–17, 117–118: pumps require power and fresh water within two tiles; cardinally connected pipe networks carry water; service reaches seven tiles from pipes, never through relay by watered buildings. Separate networks cannot borrow disconnected capacity. Selecting pipes opens the underground overlay.
- Water pipes are an independent tile layer. Surface demolition leaves pipes; Remove pipes leaves surface buildings and roads.
- Medium/dense designation increases the density ceiling. Growth above light density requires water; prolonged water loss causes regression to light density. Generated apartment, tower, office, factory, and plant sprites now represent these stages.
- Manual p. 103: landfill needs connected roads, fills up, decomposes slowly, cannot be bulldozed, and can be de-zoned after it empties. Local waste backlogs inhibit development and eventually cause occupants to leave.
- Water and garbage overlays, utility reports, contextual tile queries, and a four-step utilities checklist support diagnosis and feedback.
- Save schema v2 stores pipes, density, and waste. Existing v1 cities migrate without invented prior garbage debt.

### Additional explicit approximations

Pump footprint is one tile; output is 500 water units. Water uses a square seven-tile radius; zones consume 1 plus three units per occupancy multiplier. Allocation favors lots closest to connected pipes, breaking ties by tile index. No exact original pressure/flow algorithm is claimed. Pollution reduces pump capacity; aging is not yet modeled.

Residential/commercial/industrial occupancy scales by 1, 3, and 8 for light/medium/dense development. Growth rate, density prices, immediate down-zoning behavior, landfill capacity (200 per tile), decomposition (0.5 units/month), production rates, garbage stress threshold, and fiscal costs are approximations. Garbage health and pollution effects await their corresponding systems.

Generated landfill art is `dist/assets/landfill.png`; the full built-in Imagegen brief is `docs/landfill-prompt.txt`. Existing pump and all density sprites from the original atlas are reused.

## Finance and environment milestone implementation

- Manual pp. 87–90: RCI taxes fund the treasury, affect sector demand, and depend on population and land values. Monthly operating charges continue below zero cash. Budget preview separates operating balance from annual loan commitments and projects year-end funds using current conditions.
- Manual p. 91: maximum ten outstanding loans; principals in §5,000 increments up to §25,000; ten annual payments of 15% of original principal; no early repayment; removal after payment ten. Each loan uses its issue-month anniversary.
- Manual pp. 88–89: road maintenance funding affects road condition and access; excess funding cannot improve fully maintained roads. Other service budgets await their services.
- Manual pp. 100–105: parks and shoreline improve land values; coal/industry/landfill and uncollected waste cause pollution and reduce desirability; land value constrains density; polluted water reduces pumping efficiency.
- History charts include treasury, population, actual monthly tax receipts and operating charges, land value, and air pollution. Annual loan payment amounts are saved separately, and cash-conservation tests reconcile them against each month's ledger.
- Version-3 saves preserve tax rates, road funding/condition, loan schedules, paid amounts, and finance milestone state. Versions 1 and 2 migrate with 7% sector taxes, 100% road funding/condition, and no loan debt.

### Finance/environment approximations still requiring calibration

Tax revenue is summed per lot as tax rate × occupants/jobs × land value × 0.12. The constant and environmental spatial model are not original-game formulas. Tax bounds (0–20%), demand response, road funding range (0–150%), road condition decay/repair and shared failure threshold, pollution emissions/radii, land-value thresholds, upkeep, and water-pollution efficiency loss are explicit model choices. No bank interest rate is invented: the manual's fixed total repayment is used directly.

Crime, schools, hospitals, transit, ordinances, cleaner industrial technology, utility aging, health effects, and broader fiscal calibration remain unfinished. Population growth in budget forecasts is held constant and disclosed, not predicted. Large original-map behavior and exact original economy parity are not verified.

## Deferred documented systems

Water towers/desalination/treatment, recycling/incineration, utility aging and environmental remedies, business/neighbor deals, remaining service budgets, services, advisors/petitioners beyond contextual guidance, ordinances, neighbor deals, traffic/transit, scenarios/disasters, rewards, terrain editing, plant aging, technology availability, and building/scenario editors remain future milestones. See MILESTONES.md. No feature parity claim is made.

## Asset provenance

Original atlas generated with built-in Imagegen. Source bitmap: `dist/assets/city-atlas.png` (1536 × 1024 RGBA). Full saved brief: `docs/sprite-prompt.txt`. Twelve isometric buildings/structures in a 4 × 3 layout. Runtime source rectangles are alpha-trimmed for rendering; generated alpha is preserved. No original game artwork is redistributed. Original first result retained; rejected correction attempts are not shipped.


## Milestone 4 civic-service core (2026-09-12)

Manual printed pp.106–113 describes police/fire proximity and overlapping coverage, funding, insufficient jails, water reducing flammability, healthcare, education, libraries/museums, and aura. Implemented relationships follow those descriptions; numerical formulas are original approximations, not extracted game code.

- Police/fire base radius 9, radius scales with square root of funding; linear distance falloff, additive station coverage capped at 100. Missing jail capacity reduces policing to 60% effectiveness. Estimated jail need is 1% of population; jail capacity 200 at full funding. Each nearby jail reduces residential land value by 8 within five tiles.
- Hospitals (1,000 capacity), schools (300), colleges (500), libraries (1,000), museums (1,500) share capacity over residents connected to the same road component. Capacity scales with funding. Education combines school/college/library/museum contributions with weights .55/.30/.08/.07. Road proximity four tiles; electricity load eight units per civic building. Water is not required to operate these buildings in this version.
- Funding 0–150%; six months below 50% triggers department strikes; restoring 100% and advancing one month resumes service. Maintenance charges continue while disconnected or on strike. Funding sliders and preview live in Civic services; expenses also appear in the main Budget.
- Citywide education starts at 40; life expectancy starts at 59. Targets depend on service access and pollution. Education approaches target over a 36-month time constant and health over 48 months. There are no age cohorts yet. Aura reflects education, health, crime, pollution, land value, and residential taxes, influencing residential demand.
- Crime changes with policing, education, density, land value, and neighborhood watch. Flammability changes with building use, water and fire code. Station coverage is separate from flammability; actual fires/dispatch/suppression are deferred to milestone 6.
- Three provisional original ordinance entries model the manual's general policy relationships: Neighborhood watch (-15% crime, §10/month), Fire safety code (-20% flammability, §15/month), Reading campaign (+5 education target, §10/month). Names and costs are not claimed as verified original ordinance entries. Full catalog, population-based pricing, tradeoffs and availability gates remain unfinished.
- Eight civic structures use compact one-tile footprints and generated sprites. These footprints, costs, capacity and visual scale require future fidelity refinement; they are not asserted to match the original game.
- Advisor and petition cards reflect live service deficiencies and select relevant building tools. No original advisor portraits/dialogue or scripted petition sequences are reproduced. Civic saves use schema 4, validating all civic state; versions 1–3 migrate with baseline civic settings.


## Milestone 5 first transport slice (2026-09-12)

Manual pp.48–50 and 94–97: road/rail/highway bridges span straight between dry banks with an engineer quote; bus stops must adjoin roads and are required only for boarding; traffic/pollution and maintenance matter; transit funding can trigger strikes.

- Implemented road bridges as directional road tiles on water, §100/water tile versus §10/land tile, atomic span validation and user-facing construction quote. No sideways intersections over water. All road-dependent services use connected bridge paths. Bridge type selection, support terrain, 3D causeway/suspension structures and whole-span demolition are not yet reproduced. Current coast has narrow inlets that can be spanned vertically; no terrain editing yet.
- Residents supply four commuters per occupancy unit; commercial/industrial buildings provide 6/12 jobs per unit. Each developed home searches cardinal roads to nearest available developed workplaces, allocating finite jobs. Walking attachment is within four tiles. Vacant zones retain basic road connectivity for initial growth. No congestion-aware path weights yet; route tie-breaking is deterministic.
- Road load is commuters minus bus passengers plus buses at one vehicle per twenty passengers. Capacity 40; congestion depresses residential demand (two points per congested tile, capped at 35) and traffic contributes local air pollution. Actual trip timing, intersection queues, return commutes and traffic's direct health effect remain approximations/missing.
- Stops cost §150, upkeep §5/month at 100%; require a cardinally adjacent dry-land road, within three tiles of homes, connected to the actual departure road component. No destination stop needed. Bus share is 65% at full condition and funding (80% maximum with funding), scaled by equipment condition. Fares are §0.03 per passenger rounded monthly. All are provisional simulation constants.
- Transit funding 0–150%. Under 100% deteriorates condition; full funding repairs five condition points/month. Six months below 50% triggers strike; restoration to 100% plus a month ends it. Transit upkeep is paid even during strikes and fares depend on ridership. Main budget includes both.
- Schema 5 validates transit state and bridge direction; legacy saves migrate to full transit condition/funding. Rail, subway, highways, ports, airports, neighbor connections/deals and transport technology gates remain unfinished.


## Milestone 5 rail/subway continuation (2026-09-12)

Manual pp.49–50,96: rail requires adjacent stations; subway stations work above/adjacent to underground track; a rail–subway connection needs both networks. Those topology rules now govern actual commuter paths.

- Separate rail and subway networks, cardinal connections. Above-ground rail can cross a road without becoming a road connection. Rail bridges need straight dry-bank spans; §150/water tile. Independent subway can pass under buildings, roads, water and pipes. Separate removal tools preserve other layers. Surface bulldozing removes surface rail but preserves pipes and subway.
- Stations near each end are required for rides; service reach is three tiles. Transfer stations link adjacent rail and over/adjacent subway, only when transit is operating. Simply crossing networks does not connect them. Station/track queries and overlays show real allocated passengers; transfer stations count transfers.
- Rail-connected zones can develop without a road, although garbage and civic buildings still need roads. Finite developed jobs are shared with road commuters. When both modes exist, 65% first try rail/subway; when no road is available, all workers may use it. Funding and condition scale willingness. Route length is an unweighted cardinal path; no service timetable, rail capacity constraint or congestion-aware mode choice yet.
- Prices/upkeep are approximate: rail §20/tile and §0.2/month, subway §100/tile and §0.4/month; rail/subway stations §500 and §10/month, transfer §1000 and §20/month. Fares §0.05/passenger. Transit funding applies to upkeep and strikes apply to rail as well as bus. No technology gates yet (all games currently start in 1950).
- Three original Imagegen station sprites use compact one-tile footprints rather than original game dimensions. Schema 6 validates rail/subway booleans and rail bridge direction; legacy saves start without new track.
- Highways, ports, airports, neighbor deals, terrain and disasters remain incomplete. This checkpoint does not establish full transport parity.


## Milestone 5 highways continuation (2026-09-12)

Manual pp.94–95 describes elevated high-capacity roads, ordinary-road access only through on-ramps placed beside crossing corners, and highway bridges. The simulation now distinguishes ground roads and elevated highway nodes, connecting them through active ramp buildings placed diagonally beside a crossing. Both entry and exit ramps are needed between separated access roads. Zones, civic services and garbage reach the combined network through ordinary roads only.

- Highways cost §60/tile, bridges §250/water tile, ramps §150. Maintenance uses the road budget: §0.8/highway tile/month and §1/ramp/month. Highway traffic capacity is 160 vs 40 road. These are calibration approximations.
- Road commute routing now uses a priority queue weighted by road cost 1, highway cost .45, two units per level transition, and a surcharge above capacity. Assignments occur sequentially against current allocated traffic; this is not a fully converged traffic model. Highway traffic contributes pollution and congestion affects residential demand.
- Highway layer can cross roads and rail, but only ramps connect road traffic vertically. Dedicated highway removal preserves lower layers. Surface bulldozing removes both elevated and surface structures at the selected tile. Separate bridge spans are required for different systems.
- Functional elevated route geometry renders highway paths, supports, ramp links and traffic colors. This is not original-game causeway/suspension artwork. Highways use one-tile width and same-level highway junctions connect directly; multi-level highway interchanges, directionality, original dimensions and terrain elevation remain unfinished.
- Schema 7 validates highway presence/direction; saves through schema 6 migrate without highways. No full milestone-5 or manual-parity claim.


## Milestone 5 airport/seaport continuation (2026-09-12)

Manual pp.47 and99 specifies minimum airport 3×5 and seaport 2×6 zoning, electricity, water and roads, and seaport shoreline access to the map edge. These development gates are implemented. The manual gives conflicting airport availability years (1930 on p.47 vs1915 on p.99); current game begins in1950 so this does not affect availability yet.

- Zone airport/seaport for §50/tile. The rectangular plot finder accepts either orientation; larger zones are partitioned into minimum-sized facilities, leaving unmatched tiles vacant. Full contiguous-zone expansion and original asset variety remain approximate.
- All plot tiles need power and water; any member may provide road proximity. Each consumes three electricity and three water units. Six continuously supplied months develop a facility. Service loss stops market benefits immediately; six months removes developed level. These time/capacity constants are approximations.
- Seaport shore must adjoin a cardinal water component reaching a map boundary. Both rivers and coastal water qualify. This establishes navigability, not a signed neighbor garbage contract; regional deals remain unfinished.
- Each operating airport adds20 commercial and5 industrial demand; seaport adds8 commercial and20 industrial, capped40 per sector. Developed sites cost §30/airport or §20/seaport monthly, and add local pollution. These numerical economics are not original-game code.
- Developed facilities must be bulldozed before de-zoning; selecting one developed tile removes the whole plot. Generated multi-tile sprite uses its original facing while the map rotates, matching the current art limitation. Existing RCI de-zoning behavior still requires a separate fidelity correction.
- Schema8 adds allowed facility types; saved tile levels/age are retained and plot assignments rebuilt. Full goal remains incomplete: neighbor contracts, terrain, disasters, utility alternatives/aging, scenarios and other manual features are still absent.


## Milestone 5 neighbor-contract continuation (2026-09-12)

Manual pp.62–63,97,107,119–120 describes required border connections, connected-network deficits for purchased utilities, fixed quantities for sold utilities, excess garbage export after local disposal, fixed garbage import, minimum bills, cancellation and failure penalties. Those relationships are implemented.

- Dry-border power lines/pipes/roads/highways/rail become explicit §100 connections through Neighbors. Operating seaports can connect via the navigable-water rule. Completing links is a dedicated panel action after construction rather than an automatic engineer popup. Synthetic neighbor names are original. Land transport links add3 commercial/industrial demand each, capped15.
- Imports add exactly the electrical-component or pipe-network deficit at the connection. Disconnected districts receive no service. Exports subtract the promised surplus after reserving capacity for domestic demand; inadequate connected capacity fails the deal. Power and water can each have one citywide contract; no import/export arbitrage or multi-neighbor splitting.
- Power prices: import §.5/unit (minimum10/month), export §.4/unit. Water: import §.3/unit (minimum10), export §.2/unit. Fixed contracts offer25/50/100 units. Prices and unlimited neighbor supply are approximations; neighbors are not independently simulated.
- Garbage imports add the fixed amount at the connection and pay §2/unit. Garbage exports remove connected excess after local landfill collection, costing §2/unit with §15 minimum. Road/highway connections use the actual street graph; rail freight uses connected surface tracks and road-accessible stations; seaports use facility road IDs. Overloaded imports can accumulate waste, even while the contract pays income.
- Voluntary cancellation before month12 costs12 times the larger of minimum fee or quantity×rate. Voluntary termination is free after twelve months; no automatic repricing. Broken connections or failed utility exports cancel at monthly settlement with the full penalty. UI rejects already-unfulfillable exports and displays fees before acceptance/cancellation.
- Utility fees use connected delivery; garbage bills use actual monthly collection. Budget previews use the last garbage bill and identify that limitation. Ledger history separates cancellation penalties from ordinary expense and loan payments. Schema9 validates/canonicalizes contract data, including unforgeable rate constants on import; old cities have no invented debts/deals.
- Remaining: dynamic petitioner offers, independent neighbor demand, full renegotiation, precise original prices and schedules, and advanced freight capacity. These contracts complete a playable core, not full original-game parity.


## Fire response checkpoint — milestone 6

Players can start a fire from Emergency, dispatch one volunteer unit plus one per fire station, reposition units, clear firebreaks, and bulldoze rubble to rebuild. Optional random fires default off. Fire coverage and water-related flammability affect suppression and damage; stations do not prevent ignition. Whole power plants can be destroyed. Active emergencies save and restore held until resumed. Normal speed controls lock during response.

Ten simulation suites pass, including containment, unit limits/cycling, flammability, damage/displacement, rubble recovery, whole-plant loss and emergency saves. Generated flame/rubble art is integrated. Browser layout and interaction remain unverified.

Manual references: printed pages 22–23, 56–57 and 108–110. Response proceeds at fixed 700ms steps with the calendar held; spread/damage formulas are approximations. Other disasters, warning sirens, terrain editing, rewards and scenarios remain outstanding. Feedback checkpoint: try starting a fire, placing units beside it and rebuilding afterward; assess clarity, response time and difficulty.


Recovery correction: demolition retains RCI/airport/seaport zoning and density. De-zone rejects occupied buildings, matching the manual’s separate demolition/de-zoning workflow (printed page45). Active flames reject surface construction and de-zoning. Tests cover retained underground utilities, whole-airport demolition, removal of empty zoning, and serviced residential redevelopment after rubble clearance. All ten suites pass; browser checks remain unperformed.


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

### New-city setup and terrain editor — 0.7.1
Manual printed pages 28–31 guide city/mayor naming, difficulty funds, technology-dependent start dates, terrain profiles, coastal edges, sliders, regeneration and free pre-city sculpting. Implemented with a deterministic original generator, separate draft and explicit acceptance. Save schema 16 persists mayor, start year and difficulty; previous files retain 1950. Selected start year drives technology gates, calendar and loan dates. Current limits: fixed 48 × 48 map, four start-year presets, difficulty changes only initial funds (original balancing not reproduced), top-down preview, no regional terrain continuity, visual style or building-set selector. Prepared starter towns use their existing map. Terrain tools share the game's slope and protected-water constraints.

### Nuclear fallout — 0.7.2
Manual printed pp.51 and 123 describe overload-related nuclear meltdown and radiation preventing residents from returning. Nuclear overload explosions now contaminate a radius of five tiles around the plant center, abandon affected RCI/facilities, lower affected land value to 1, and block construction and landscaping. Rubble/infrastructure removal remains possible but cannot remove radiation. Existing infrastructure outside the blast remains present. Save schema 17 persists tile contamination; earlier saves load without it. Radius, permanent duration, construction exclusion and immediate displacement are reconstruction choices, not recovered original formulas. No airborne radiation simulation or cleanup system is claimed. Conventional plant failures remain ordinary explosions.

### Data maps and long-term graphs — 0.7.3
Manual printed pp.66–69 describe aura/density/pollution maps and simultaneous trends at 1-, 10- and 100-year scales. The City data panel now provides three aligned graphs and exact values, keeping 1,200 monthly records. Added records include approval, average road traffic, job capacities, commuting workers, power/water capacity, garbage production and map-wide water pollution. Older missing observations remain absent. Aura exposes the same per-home happiness formula used in global approval; density shows occupied zone levels. Values and geographic averaging are reconstruction approximations. Job capacity is explicitly labeled and not presented as actual sector employment. Original age distributions, population cohorts, utility production breakdowns and combined global pollution are still missing.

### Parks and recreation — 0.8.0
Manual printed p.55 lists small/large parks, fountain, pond, playground, marina, zoo and sports park, linking recreation to health/happiness and specifically zoos to residential demand. All are now available. Seven new structures use original Imagegen assets; larger sites have shared roots, full-footprint placement/demolition/fire/save checks. Marina needs cardinal-adjacent water beside a dry, flat footprint. Ornamental ponds do not replace terrain freshwater. Recreation improves local amenities, some vegetation reduces pollution, and local exercise/recreation raises the long-term health target (maximum five years across overlapping sites). Each open zoo adds 15 demand, capped at 30. Fire/radiation removes benefits. Existing small parks now also support health. Prices, square footprints, radii, health/demand tuning and immediate operation without utility/access requirements are approximations. Marina art has a fixed water-edge orientation. Save schema 18 adds recreation types using existing footprint roots; prior cities remain supported.

### Farming and industrial transition — 0.9.0
Manual printed pp.99,105,124 describes low-density agricultural land, fields beyond normal road range, later replacement as value/pollution rise, educated/newer cities attracting cleaner industry, and clean-water tax incentives. This reconstruction grows 3×3 agricultural patches on flat low-density industrial zoning with fewer than three road-fronted sides. Barns need normal power/transport, fields inherit barn access for growth and have no separate jobs. Fixed patches, 12 barn jobs, environmental thresholds and stochastic conversion rates are approximations. Farms create 3% of equivalent manufacturing pollution per tile and generate waste at the barn. Higher value/pollution or broken patches revert to manufacturing. Existing qualifying factories can convert after six months of age; the EQ threshold decreases with calendar year. Clean factories retain jobs with 90% less industrial air/water pollution. Clean-water incentives cost §10/month, lower the EQ threshold by ten and reduce clean firms' tax contributions by 15%. These are explicit tuning choices, not original formulas. Crop dusters/locusts, large dynamic farm parcels and differentiated high-tech productivity remain unfinished. Schema 19 stores industry kind/farm root and migrates older ordinances.

### Reward offers — 0.10.0
Manual pp.56,124,209 describes gifts/opportunities, news offers and deferred placement, naming the Mayor's House; stadium and university are mentioned elsewhere. The first implemented set is Mayor's House (256 residents/50 aura for 3 months, free, §5 upkeep), stadium (1,000 residents/55 aura/positive balance for 6 months, §5,000/§25 upkeep), university (500 residents/65 EQ/operating college for 6 months, §4,000/§40 upkeep). These requirements, prices, footprints and effects are original reconstruction tuning. Offers persist; only one of each may exist; rebuilding after demolition/destruction is allowed at its construction price. Structures need all footprint tiles powered and a nearby road for benefits. Operating stadium adds 20 residential demand; university adds 10 commercial demand and 10 EQ to education target; all improve nearby amenities. No claim to the full original reward or business-opportunity catalog. Schema 20 persists earned month, qualifying streaks and last processed month, preventing double counting and migrating prior cities.

### Mountain tunnels — 0.11.0
Manual p.48 and transport chapter describe automatically proposed road/highway/rail tunnels, six underground tiles minimum, engineer quotes and portal approaches. Implemented straight equal-elevation portals with at least six buried tiles and at least one interior tile two height steps above portal level. User drags the entire intended span; automatic exit search from a single entrance is not yet implemented. Construction preserves surface buildings. Interior costs are §100 road/§150 rail/§250 highway per tile plus two approaches; upkeep follows corresponding route funding. These costs and geology are approximate. Portal edges carry full distance in weighted pathfinding, while surface-nearby zones cannot access tunnel interiors. Rail neighbor freight follows tunnels. Removing either portal removes the underground connection and keeps the far surface approach. Existing cover is protected against terraforming, and intersecting tunnels/subways are rejected. Fixed-facing portal art, no underground junctions/grade changes and no animated interior traffic remain limitations. Schema 21 stores validated tunnel records; earlier saves load with none.

## Earthquakes (schema 22)
The manual lists player-triggered earthquakes (printed p.58) and explains that emergency units cannot stop quake damage, although they can fight resulting fires (p.111). This checkpoint implements a deterministic eight-tile-radius event advancing in eight response steps, followed by any surviving fires. Whole building footprints are destroyed together, zoning remains for recovery, transport and buried utilities can break, and any hit tunnel segment closes that tunnel. Roads/lines leave clearable rubble; pipes/tracks are removed and can be replaced. No terrain deformation or quake-induced nuclear fallout is modeled. Radius, damage probabilities, secondary fire chance, and optional random frequency (0.5% per eligible month) are original tuning, not recovered formulas. Random earthquake controls are independent of random fires; both default off. Saves retain ring progress and event count; older saves migrate with earthquakes disabled. The existing Imagegen fire/rubble assets display consequences; a text marker identifies the active epicenter without forced camera shake. Other disasters, magnitude selection and warning sirens remain unfinished.

## Shared technology timeline
Construction now uses one availability catalog for existing power/water/waste dates and newly enforced transport dates. Manual printed p.48 specifies highways in 1940; p.49 bus stops in 1920; p.50 subway rail/stations in 1912. Transfers follow subway availability and ramps follow highways (inferred dependencies). Airport dates conflict: p.46 says 1930 while p.99 says 1915; this implementation follows the transportation chapter (1915). The gate applies before tunnel proposals, so highway tunnels cannot bypass it. Removal and previously saved infrastructure remain supported; changing a loaded save date does not erase facilities. The timeline and January announcements use the same catalog as construction.

## Annual budget review (schema 23)
Manual printed p.29 defines Auto Budget as maintaining the status quo and showing the year-end window only if available funds are negative. Implemented the same condition. New cities default to annual review; versions 3–22 import with Auto Budget enabled to preserve their uninterrupted flow. The completed year is reviewed at the January boundary, after its twelfth monthly settlement. Pending reviews persist and wait behind disasters or open dialogs; opening Budget acknowledges the review and leaves play paused. Reports sum recorded monthly income/expenses and separately list loans and penalties. Construction outlays are reflected in closing treasury rather than the operating expense total. The state records processed boundaries to prevent duplicate prompts. This does not add automatic tax changes or borrowing.

## Historical designation (schema 24)
Manual printed p.39 describes historical protection while allowing abandonment; p.54 requires removing the designation before demolition. Implemented Inspect → Make historical for occupied residential, commercial and non-farm industrial buildings. The saved historicalLevel preserves the selected sprite and caps redevelopment height; occupancy can fall and later recover up to that level. Clean-industry conversion is suspended for preserved factories to retain appearance. Demolition/rezoning/surface changes are rejected atomically until unmarked; pipes and subway maintenance remain available. Disasters can destroy the building and clear its designation, including after abandonment. The renderer uses a faded original sprite for an empty historical structure and an H marker. Agricultural patches and public/special buildings do not offer designation in this reconstruction.

### Tornado checkpoint
The manual lists tornadoes in Start Disaster (printed p. 58); the scenario editor also exposes location, direction, intensity and speed. This implementation supplies manual placement and optional random events, with a single original Imagegen funnel sprite. Cardinal travel initially points toward the center and lasts up to 24 response steps. A three-by-three footprint always hits its center, with 55% neighboring damage and a further 12% ignition band. These rates, duration and protected buried utilities are original simulation tuning, not recovered formulas. Wind removes surface infrastructure and whole buildings; exposed tunnel portals can close a tunnel while covered spans survive. Fires continue on the disaster clock. Calendar time waits until storm and fires end. Schema 25 preserves storm position/direction/progress and migrates older saves with tornadoes disabled. Warning sirens and other disaster types remain unfinished.

### Early warning siren checkpoint
Manual printed p.111 describes mayor-controlled warnings that reduce disaster damage and false alarms that undermine response. Tornadoes now have eight warning steps before movement, with an automatically opened Emergency panel holding time for a deliberate response. Siren use during this window reduces each candidate building-damage or ignition hit with probability 0.6 × trust / 100. Trees and exposed infrastructure remain vulnerable. Trust starts at 100, loses 20 per false alarm, and recovers 5 after a timely warning; protection uses trust before recovery. These numeric rules are original tuning. Duplicate warnings and post-impact use are rejected. State persists in schema 26; older active storms migrate without a new grace period. Warning support for other disaster types remains unfinished. This supersedes earlier statements that warning sirens are wholly missing.

### Environmental policy checkpoint
Manual printed p.65 specifies ordinance controls, yearly costs and Budget access; pp.104–105 describe traffic/industry pollution and clean-air ordinances, and the advice section explicitly mentions carpooling. Carpool incentives now reduce private vehicle load by 30% without removing workers, jobs, bus or train passengers. Clean-air regulations reduce traffic and industrial air emissions by 20%; other emission sources and water pollution are unchanged. Costs of §15 and §20/month, respectively, are original tuning, as are the percentages. Policy repeal restores the baseline immediately. Schema 27 migrates older saves with these two ordinances disabled. This is not the full original ordinance catalog.

### Revenue-generating ordinance checkpoint
The manual names parking fines in its Ordinances introduction (printed p.65) and explains that some ordinances bring money to the treasury (p.91). Parking fines now earn floor(0.5 × reachable private-car commuters), with a 30% carpool reduction and bus/train passengers excluded. The global residential aura penalty is three points, clamped by the existing aura range. These rates and the penalty are original tuning, not recovered game formulas; receipts approximate enforcement from commuting rather than simulate individual parking violations. Revenue enters monthly and annual accounts, appears separately in Budget, and is estimated monthly/yearly before enactment. No income is generated by empty or disconnected cities. Schema 28 preserves the policy and defaults older saves to off.

### Visible water-quality checkpoint
Manual printed p.105 describes water turning brown with severe pollution and pump efficiency falling. Surface-water colors now interpolate from fresh/salt blue-green toward brown above pollution 20/100, reaching brown at 100. The threshold and gradient are original visual tuning. Water source inspection exposes the difference between age-adjusted clean output and actual output, and the capacity regained versus untreated output. These values are derived from the existing source/network formulas, not additional simulated resources. Treatment modifies local water quality according to the existing network model; there is still no hydrological flow or downstream contaminant transport.

### Casino business deal checkpoint
Manual printed pp.90 and 92 describe petitioner-proposed facilities paying a stipend while standing, with crime/pollution tradeoffs. Printed p.106 names casinos as crime-attracting buildings. The casino here is a free 3×3 original Imagegen structure, one per city, paying §150/month even when utilities are unavailable because the contract is tied to the standing building. It adds up to 18 pre-police crime points with an eight-tile linear falloff from its center. Offers require six elapsed months, at least 128 residents and a negative operating balance. Declining postpones reconsideration for 12 months; accepting reserves a rebuildable permit. Those numeric choices, footprint and permit behavior are original tuning. Demolition or disaster destruction ends income and the crime source. Schema 29 persists offer/acceptance state and validates unique authorized placement. This is the first business deal; the complete catalog remains unfinished.

### Crime and property-value checkpoint
The manual (printed p.106) states that high crime lowers land value. Each developed or zoned tile now loses 0.2 land-value points per crime point, bounded by the existing minimum of one. The coefficient is original tuning. Crime is computed from environmental value before this penalty, avoiding recursive feedback; resulting values feed tax revenue and density decisions. Civic recomputation restores the environmental baseline, then applies jail proximity before crime in a consistent order. Police and Neighborhood watch reduce the value loss through their existing crime effects. These are derived fields; save schema remains 29.

### Population and electricity charts
The manual’s Charts section (printed p.68) describes workforce share and power-source breakdowns. City data now shows current employed workers, workers without reachable jobs, other residents, plant counts and each type’s share of domestic capacity. Counts come from current simulation state, with fixed-footprint roots counted once and waste-to-energy fuel output included. These snapshots do not invent age cohorts or annual production. Life-expectancy-driven workforce participation and education by age still require simulation work; annual utility production records remain unfinished.


## Larger RCI lots and footprint-matched architecture

Source checkpoint: 161 regression suites, schema 109. Vacant serviced medium/dense zoning can form 2×2 buildings; dense zoning first tries 3×3. Every member shares growth, abandonment, history and destruction, while occupancy and utility demand remain distributed across tiles. Any member opens the shared building query or whole-lot demolition. Scenario building counts use the northwest root; population remains the sum of occupants.

The manual requires replacement tile-size matching (pp.73–74) and Building Architect tile-size selection (p.140). Style libraries and portable v4 designs now enforce this, preserving legacy 1×1 files. Original procedural models cover larger footprints in four views with constant physical floor height. Lot-selection probabilities, capacity tuning, footprint catalog and artwork are reconstruction choices rather than recovered original algorithms. See BUILDING-LOTS-MILESTONE.md for validation; full original fidelity and browser acceptance remain incomplete. Publication beyond v150 is still pending approval.


## Branching scenario routines

Source checkpoint:168 suites, schema110. Form-authored routines now support ordered action blocks, nested If/Else, reusable nonrecursive subroutine calls and repeated scheduled entries. Conditions read city state when reached; chosen paths survive popup/emergency suspension. Actual primitive actions share dispatch with existing events. Program history, city-file and named saves, worker execution, goal provenance and starting-city replay are integrated.

Manual pp.188–189 specify If/If Else action blocks, Subroutine and Repeat Regular. Runtime bounds, completion-relative repeat timing and the structured browser format are reconstruction choices. Binary original scenario files, unrestricted recursion and the full original instruction catalog remain unsupported. The routine popup form supports advisor presentation; custom portrait files can be preserved from imported routines but new file selection uses the existing standalone popup editor. Browser acceptance and Sites publication after v150 remain pending. See SCENARIO-PROGRAMS-MILESTONE.md.


## Multi-neighbor contracts

Source checkpoint:172 suites, schema111. Cities can sign one contract per resource with each neighbor (four power, four water and five garbage pairs). Utility imports combine finite supplier surplus only on the connected network; exports use local surplus, with older contracts attempted first. Garbage shipments retain route-local conservation. Lower-priced imports/disposal are used first, but every idle backup contract retains its minimum fee. Renewals cannot silently break another existing deal.

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

Scripted neighbor-contract checkpoint: scenario events and routines can create or end real agreements, recording results and normal termination fees with save/load continuity. See [neighbor contract milestone](SCENARIO-NEIGHBOR-DEALS-MILESTONE.md). Schema114; 184 regression suites passed. Manual parameter/fee semantics are an explicit interpretation. Not yet hosted.

Reward inspection checkpoint: rotate previews of the Mayor’s House, Stadium and University before placement, with matching four-sided models in the city. See [reward building inspection](REWARD-MODELS-MILESTONE.md). All 186 regression suites passed; schema114, cache reward-building-models-1. Not yet hosted.

Earthquake scenario checkpoint: choose magnitude1–100 in timed events and routines, inspect the chosen strength during response, and preserve it across saves. Default50 retains previous behavior; other damage/radius scaling is explicit reconstruction tuning. See [earthquake magnitude](EARTHQUAKE-MAGNITUDE-MILESTONE.md). All 187 regression suites passed; schema115, cache earthquake-magnitude-1. Not yet hosted.

Tornado scenario checkpoint: configure direction, intensity, distance, travel speed and early warnings in timed events and routines. Saved storms preserve movement pauses and siren preparation. See [authored tornado paths](TORNADO-CONTROLS-MILESTONE.md). Schema116; cache tornado-controls-1. Manual-named controls use explicitly documented reconstruction ranges and damage tuning. Not yet hosted.

Large-city routing checkpoint: stop commuter searches when reachable jobs are exhausted, preserving exact route allocation. A synthetic 122,880-resident fixture improved from 6.83s to 1.49s per monthly tick (three-sample medians on this Mac). See [large-city routing](LARGE-CITY-ROUTING-MILESTONE.md) for limits and raw measurements. All 189 regression suites passed; schema116 unchanged, cache large-city-routing-1. Not yet hosted.

Viewed-neighborhood traffic checkpoint: camera-local car/highway sampling and visible train budgeting prevent off-screen routes from consuming the display caps. Cached routes refresh with camera and city changes. See [visible neighborhood traffic](VISIBLE-TRAFFIC-MILESTONE.md). All 190 regression suites passed; schema116 unchanged, cache visible-city-traffic-1. Not yet hosted.

Scenario storytelling checkpoint: timed events and routines can replace current instructions and victory/loss messages with captured live values. Saves preserve the updates; restart restores original text. See [changing scenario dialogs](SCENARIO-DIALOG-TEXT-MILESTONE.md). All 191 regression suites passed; schema117, cache scenario-dialog-text-1. Not yet hosted.

Building utility checkpoint: scenario goals now count unpowered and unwatered buildings across eligible workplaces, facilities and services, once per footprint. See [building utility goals](BUILDING-UTILITY-GOALS-MILESTONE.md). Source only; publication pending.

Sanitation health checkpoint: uncollected garbage now directly lowers exposed residents’ health target, and the Population report explains the penalty and recovery through collection. See [garbage and health](GARBAGE-HEALTH-MILESTONE.md). Source only; publication pending.

Water diagnostics checkpoint: Utilities now identifies shortages by pipe network, locates uncovered zones, and opens source maintenance queries. See [water network diagnostics](WATER-GRID-DIAGNOSTICS-MILESTONE.md). Source only; publication pending.

Rail landfill checkpoint: garbage can reach remote landfill sidings through surface rail from road-connected stations or rail imports. See [rail landfill delivery](LANDFILL-RAIL-FREIGHT-MILESTONE.md). Source only; publication pending.

Water continuity checkpoint: previously supplied buildings retain their water requirement through shrinkage and abandonment, with saved interruption progress and repair/reoccupation behavior. See [water-service continuity](WATER-SERVICE-CONTINUITY-MILESTONE.md). Source only; publication pending.

Dense routing checkpoint: filled workplaces leave the route destination index immediately, reducing the measured dense 256-map month from 1.75 s to 1.12 s while preserving exact city outcomes. See [available job targets](AVAILABLE-JOB-TARGETS-MILESTONE.md). Source only; publication pending.

Waste artwork checkpoint: recycling, incineration and waste-to-energy now use distinct four-view models, with throughput-driven smoke that respects pause and reduced motion. See [waste facility artwork](WASTE-FACILITY-MODELS-MILESTONE.md). Source only; publication pending.

Employment trends checkpoint: compare actual filled Commerce and Industry jobs with workforce unemployment over time. See [employment trends](EMPLOYMENT-TRENDS-MILESTONE.md). Source only; publication pending.
