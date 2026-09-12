# Milestone 1 validation

- Node simulation regression checks passed: unpowered growth gate, five-tile relay, shared-road growth, atomic rejected drags, full plant footprint removal, abandonment, disconnected road components, affordability, water construction constraints, save corruption rejection, save round trip, deterministic 120-month simulation.
- Browser checks passed: keyboard road placement debits §10; residential placement debits §10; simulation advances dates and grows population from 224 to 288; pause stops progression; reload restores autosave and starts paused; manual save restores the earlier city and treasury.
- Desktop and mobile layouts inspected. Mobile city menu exposes help, first-town guide, inspection, and overlays. Building atlas loaded with actual alpha. No browser console errors observed.
- WebMCP tools registered. City status read returned live game state; valid tool selection changed the same visible controls; invalid tool was rejected.
- Six-stage roadmap and milestone-specific feedback prompts verified in the browser.
- Prices, economy, growth formulas, road reach, and single-facing artwork remain milestone-1 approximations. No exact original simulation parity claim.

## Utilities update

Simulation tests pass for pump power/freshwater requirements, cardinal pipe continuity, seven-tile service boundary, no building-based water relay, pipe/surface independence, disconnected-network and finite-capacity behavior, water-gated density growth, water-loss regression, landfill shared-road access, overflow, decomposition, demolition restrictions, v1 migration, and v2 save validation/round trip. Original simulation checks also pass.

UI integration was source-checked; JavaScript syntax and local serving passed. This update was not interaction-tested in a browser; the current Sites skill permits that only on explicit request. Previous milestone browser evidence does not validate these new controls. The full goal remains incomplete.

## Finance/environment update

- Exact loan terms tested: permitted principal values, maximum ten, annual anniversaries, ten installments, 150% total repayment, removal at maturity, and prevention of malformed schedules on import.
- Tax/revenue/demand tradeoff tested with fixed population; invalid changes preserve state.
- Budget year boundaries and scheduled-loan subtraction tested. Monthly ledger reconciles treasury changes to actual receipts, upkeep, and due loan payments.
- Sustained road underfunding and funded repair tested, including loss/restoration of zone access.
- Park and pollution effects on land values/revenue, land-value density limits, and pollution-dependent pump capacity tested.
- v3 finance round trips and v1/v2 migration tested. The utilities density fixture now includes parks so it can isolate water availability while satisfying the new land-value requirement.
- UI syntax and local asset/module references checked. This update has not been browser interaction-tested; previous browser evidence covers only milestone 1.
- Full objective remains incomplete: services, transit, disasters/scenarios, utility alternatives, and wider manual parity are not proven.


## Milestone 4 civic checkpoint — 2026-09-12

- Four Node suites pass: existing core, utilities, finance, plus new civic tests. New checks exercise placement/operation, distance falloff and overlap, crime reduction, budget costs, jail adequacy, finite/shared hospital capacity, disconnected road networks, gradual learning/longevity, strikes and monthly recovery, ordinance effects/costs, monthly accounting, save round trips and migration.
- Syntax checked for application, renderer and new civic UI modules. Original generated civic atlas visually inspected as a standalone asset and integrated as eight alpha-trimmed sprites.
- New civic browser controls have not received interaction or responsive visual QA. Current Sites skill permits browser testing only when explicitly requested. Source review and local HTTP readiness are the validation for this checkpoint; no claim of full browser QA or original-game parity.


## Milestone 5 roads/buses checkpoint — 2026-09-12

All five Node suites pass. Transport suite verifies finite-job road routing, congestion, one-stop bus use, disconnected routes, traffic/pollution reduction, fares/upkeep, strike recovery, bridge network connection/costs, dry-bank/continuous-span rejection, affordability, migration, bridge direction validation and accounting. Application, renderer and transport UI syntax checks pass. Bus sprite inspected as a standalone image; slight halo remains from generation. Local HTTP readiness verified before publishing. New browser controls are not interaction-tested under the current Sites skill restriction; transport milestone completion is not claimed.


## Rail/subway checkpoint — 2026-09-12

Six simulation suites pass. Railway tests cover station requirements at each end, track break/recovery, no-road employment, transfer-only cross-mode links and transfer usage, separate underground removal, strikes, bridge axis/separate spans, save roundtrip and v5 migration. Existing suites continue to cover road/bus, civic, finance and utilities. New UI and renderer syntax checked; transit atlas visually inspected as an asset. Local HTTP readiness checked. Browser interaction/visual QA remains unperformed under the Sites skill restriction, so controls and layout are not claimed verified.


## Highway checkpoint — 2026-09-12

Seven Node suites pass. New coverage verifies road/highway crossing isolation, two-ramp access, ramp demolition breaking the link, independent elevated removal preserving the lower road, faster highway route preference, maintenance accounting, highway bridge price/axis, save roundtrip/migration and routing priority order. Application/renderer syntax checks and local HTTP readiness pass. Browser interaction and layout checks remain unperformed under current Sites instructions.


## Airport/seaport checkpoint — 2026-09-12

Eight simulation suites pass. Facility tests verify minimum dimensions, six-month power/water/road-gated growth, rejection of landlocked shoreline, water path to boundary, six-month abandonment, whole-building demolition, actual pump/pipe/coal integration, demand benefit, upkeep and save roundtrip. Application/renderer syntax checked. Generated facilities atlas inspected; runtime clipping separates its offset silhouettes before trimming. Starter save is about2.05MB, under the3MB import limit. Local HTTP readiness passes; browser interactions and layout remain unverified under current Sites instructions.


## Regional contract checkpoint — 2026-09-12

Nine suites pass. Regional tests exercise connected power/water deficit imports, isolated networks, minimum bills, ledger conservation, duplicate-resource rejection, cancellation and annual free termination, native export surplus and supply-failure penalties, pipe disconnection, actual garbage export billing, fixed imports into local landfill, rail freight transfers, dry-border constraints, save roundtrip and canonical contract prices. UI syntax and local HTTP readiness checked. Browser interaction/visual QA remains unverified under current Sites restrictions. Seaport/highway freight share the graph-backed path logic but have no dedicated regional integration test yet.


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

### 0.7.1 — terrain setup
All 18 Node test suites pass. Added checks for deterministic seeds, distinct seeds, coastal/freshwater profiles, zero-water/zero-tree controls, elevation and slope limits, difficulty balances, technology gates by starting year, save round trips and migration. JavaScript syntax checked. Browser interactions and visual layout have not been verified; no browser testing was requested.

### 0.7.2 — nuclear fallout
All 19 Node suites pass. Radiation tests cover immediate displacement, affected land value, persistent abandonment, cleanup/build/landscape restrictions, multi-tile foundations, unaffected construction, save/load/migration and conventional-plant isolation. Existing overload tests verify the six-month trigger and recovery by additional capacity/imports. Syntax checks pass. Browser layout and interaction remain unverified.

### 0.7.3 — data maps and trends
All 20 Node suites pass. New checks cover snapshots, per-home aura, 12/120/1,200-month windows, retained history/save size, missing fields, negative series, invalid/duplicate chronology and rolling history. Syntax checked for all modules. Browser graph interaction and visual layout remain unverified.

### 0.8.0 — recreation
All 21 Node suites pass. New tests cover all seven structures, exact footprint/cost/upkeep, no unintended power generation, saves/malformed footprints, whole-site demolition, marina cardinal shoreline/slope rules, local value/health, zoo demand and closure/destruction in fires. Syntax checks pass. Generated 1774×887 RGBA atlas was visually inspected with seven separated silhouettes and transparent margins. Browser interaction/layout remains unverified.

### 0.9.0 — industry
All 22 Node suites pass. New checks cover rural patches, fields beyond road range surviving monthly simulation, barn-only jobs, agricultural saves/conversion, education threshold and clean conversion, reduced pollution, incentive tax effects, old-save migration and damaged farm normalization. All JavaScript syntax checks pass. Browser interaction/layout remains unverified.
The selected five-column 2172×724 Imagegen atlas has verified alpha and was visually inspected without exterior halos. Rejected earlier outputs were not included. Browser rendering remains unverified.

### 0.10.0 — rewards
All 23 Node suites pass (22 regression suites plus reward suite). Tests cover qualification/reset, monthly idempotence, retained offers, locked/duplicate placement, operating flags/demand, upkeep, loss of benefits with disconnected roads, rebuilding, save round trips and migration. All JavaScript syntax checks pass. Three-sprite 2172×724 atlas has alpha and was visually inspected for complete silhouettes and clear margins. Browser interaction/layout remains unverified.

### 0.11.0 — tunnels
All 24 Node suites pass. Tunnel tests cover three modes, surface preservation, costs, full route distance, earthwork/subway protection, atomic affordability, removal, rail commuters and save validation. Existing road/highway/rail/freight regression suites pass after graph changes. All module syntax checked. Three-portal 2172×724 Imagegen atlas has verified alpha and visually inspected complete silhouettes. Browser rendering and quote interactions remain unverified.

## Earthquake recovery checkpoint
Added focused coverage for staged damage, interrupted-save continuity, road/rail/highway/pipe/subway destruction and repair, complete plant destruction, displaced residents, secondary fires, radius bounds, all three tunnel modes collapsing from interior damage, legacy save migration and optional random events. Browser layout/interaction behavior has not been verified in this checkpoint.

All 25 simulation suites passed across the verification run and targeted rerun after correcting legacy-version assertions and stable emergency-field serialization order. JavaScript syntax, local entrypoint references, diff whitespace and local HTTP readiness passed.

## Technology timeline checkpoint
Focused tests check every dated technology at December/January boundaries, atomic rejection without spending, correct unlock notices, highway tunnel gate enforcement and removal of legacy infrastructure. Existing construction prerequisites still apply after technology unlocks. Browser layout and interactions are not verified in this checkpoint.

All 26 simulation suites passed. Changed JavaScript syntax, diff whitespace and local HTTP readiness passed.

## Narrow-screen browser verification
Inspected the live local game at approximately 731 × 861 pixels. The nine category buttons wrapped vertically into the construction tools; corrected the compact layout to separate horizontal category and tool rows and expose tool instructions. Removed the decorative map caption. Verified the corrected layout visually, opened City desk → Technology timeline, checked current/future availability rendering, selected Subway rail and verified the underground view and automatic scrolling of the selected tool into view. Increased compact tool/instruction type to 14px. CSS/app entrypoint query revisions force browsers to load these changes. JavaScript syntax and diff whitespace passed. No simulation logic changed, so the 26-suite run from the preceding checkpoint remains applicable. This is targeted browser verification, not a complete playthrough or a claim that all viewport sizes have been tested.

## New-city browser playthrough
Used an isolated localhost origin at 1280 × 720 to avoid replacing the separate 127.0.0.1 city. Opened/cancelled setup, then named and accepted a generated empty city. Placed ten road tiles, residential/commercial/industrial lots and a coal plant with canvas focus, arrow keys, shortcuts and Enter. Advanced time; garbage accumulation caused abandonment. Added a road-adjacent landfill, advanced again and observed zero uncollected waste and eight residents. Reload preserved the name, date, funds and population. Technology notifications appeared as dates advanced. This verifies a small creation/construction/service/growth/save journey, not every simulation feature.
The terrain preview was originally below the long settings form. Changed setup to columns on wide screens, preview-first on narrow screens, with acceptance controls above the preview and correctly sized coast checkboxes. Visually verified the final wide layout. Fixed duplicate light-zone price text and inaccurate initial single-road news. Syntax, entrypoint/module references and diff whitespace passed; no simulation logic changed. Narrow new-city layout has not yet been visually checked.

## Annual budget review verification
All 27 simulation suites passed. Added tests for calendar boundaries, duplicate suppression, yearly totals, unchanged Auto Budget funding/taxes, negative-funds override, save continuity, legacy migration and malformed review data. Browser test on isolated localhost toggled annual review on, ran from January 1962, observed the Year-end budget · 1962 window with twelve recorded months (§108 revenue, §768 expenses, §35,621 treasury), then closed it and verified January 1963 remained paused. Pending review behind an emergency follows the existing emergency-first UI branch; this combination has not been browser tested. JavaScript syntax, local module references and diff whitespace passed.

## Historical preservation verification
All 28 simulation suites passed; historical/fire/earthquake suites were rerun after ensuring abandoned preserved buildings remain combustible. Focused tests compare ordinary growth against historical height retention, check atomic construction rejection, underground maintenance, abandonment, unmarking, disaster destruction, saves and legacy migration. On isolated localhost, inspected residential Tile 34,24, checked Make historical, verified the checked state, and attempted demolition: the game rejected it with the historical-designation message while keeping eight residents and unchanged funds. Syntax and module-reference checks passed. Abandoned sprite appearance and all category variants have not been browser verified.

### Tornado checkpoint
All 29 suites pass. New coverage checks movement duration, surface damage, underground preservation, tunnel portal versus buried-span damage, secondary fires, recovery, deterministic interrupted-save continuation, migration and opt-in events. Browser QA in an isolated localhost city verified the Emergency controls, manual placement and rendered tornado sprite; calendar and ordinary speed controls enter emergency mode. Full disaster playthrough remains covered by simulation tests rather than browser automation.

### Early warning checkpoint
The siren suite compares identical storms with full-trust warning, no warning and exhausted trust; tests pre-impact safety, reduced damage, duplicate/late rejection, trust recovery, malformed saves and exact continuation after loading during the warning. Browser QA at a narrow viewport verified false-alarm trust 100→80, automatic pre-impact panel, timely warning recovery to 85, shelter status and disabled duplicate action. Warning panel remained readable with Continue emergency visible.

All 30 simulation suites pass after the warning-system changes.

### Environmental policies checkpoint
All 31 simulation suites pass. Policy comparisons verify lower vehicle load without lost employment, bus/fare preservation, repeal, disconnected-route behavior, reduced air emissions with unchanged water pollution, monthly cost accounting, saves and migration. Browser QA verified Budget → Ordinances, yearly/monthly prices, selecting and applying both policies, and §35/month spending. The forecast now identifies itself as a spending estimate because policy effects can also alter taxes.

### Parking-fine checkpoint
All 32 simulation suites pass. New comparisons verify additional income without extra expense or lost workers, aura reduction, monthly treasury and annual history accounting, transit/carpool reductions, repeal, empty and disconnected cases, draft nonmutation and save migration. Browser QA in the isolated test city verified enactment, aura 18→15, income §1/month (§12/year), and balance −§89→−§88.

### Water-quality feedback checkpoint
All 32 suites pass. Expanded water-structure assertions verify clean capacity, pollution losses, recovered output and zero benefit when treatment is unpowered. Browser QA verified Utilities → Water pollution map and inspected the resulting overlay. Source diagnostic calculations are covered by simulation tests; a heavily contaminated brown-water scene was not separately exercised in the browser.

### Business-deal checkpoint
All 33 suites pass. The new suite covers eligibility, decline delay, acceptance without immediate income, deferred placement, free/unique footprint, stipend ledger, local crime, demolition and disaster loss, rebuilding and save validation/migration. Browser QA verified Budget → Business deals, the separate income row, and readable eligibility/contract terms. Accept/place actions are covered by simulation tests; the existing isolated browser city is below the offer threshold.

The casino sprite was also checked in a temporary isolated render fixture on city tiles; the fixture was removed before publication. Original transparent artwork retained because edit attempts produced opaque checkerboards. A soft exterior glow remains at source resolution but is unobtrusive at game scale.

### Crime/property checkpoint
All 34 suites pass. New tests verify property loss, recovery from police and Neighborhood watch, casino effects and demolition, repeat-call stability, save-derived values and the radiation floor. The park/tax test uses a dense occupied lot so revenue differences exceed whole-currency rounding. Syntax and static checks pass; no new browser interaction test was performed for the additional inspector text.

### Report-breakdown checkpoint
The new breakdown suite and existing reports suite pass. Checks cover population sums and empty cases, plant-root counting, aging, wind elevation, waste fuel and demolition. Browser QA expanded both charts and verified 8 residents / 4 workers, 50% workforce share, and one coal plant contributing 500 capacity units. Existing simulation suites were not rerun for this read-only reporting change.
