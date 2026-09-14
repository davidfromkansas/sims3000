# SIMS3000 — playable feedback milestones

The aim is a manual-led reconstruction of SimCity 3000 Unlimited's systems with original generated art. This is a multi-milestone project, not a claim of finished game parity.

Source: https://excalet.com/technology/game_manuals/simcity_3000_unlimited.pdf

## Current playable feedback checkpoints

All six milestones contain playable functionality. None is a claim of full original-game parity, and player feedback is still pending. See [CURRENT-FIDELITY.md](CURRENT-FIDELITY.md) for implementation evidence and remaining scope.

| Milestone | Step-change in play | Acceptance exercise |
| --- | --- | --- |
| 1. Found a town | Create terrain, construct roads/RCI/power, navigate, inspect and save | Build from empty land, diagnose a stalled zone and restore an exported city |
| 2. Run essential utilities | Design water networks and choose waste-processing capacity | Grow dense housing, recover a dry district and compare recycling with disposal |
| 3. Balance the city | Taxes, service funding, loans, annual budgets, utility trades and business deals | Create a surplus and explain the cost and harm of a policy or business deal |
| 4. Serve residents | Civic coverage, strikes, recreation, education, health, crime and advisors | Improve a struggling neighborhood and explain changes with reports |
| 5. Connect and customize a metropolis | Bus/rail/subway/highway/bridge/tunnel networks, ports/airports, tower replacement and albums | Improve a busy route, customize a skyline and export a captioned album |
| 6. Face and author challenges | Nine disaster types, response/recovery, prepared scenarios and custom goals/events/messages | Recover from a disaster, then author and export a measurable challenge |

The latest milestone 6 authoring checkpoint adds goals during play through timed or conditional events. Try an initially hidden goal, save across its activation, then restart to restore the initial goal set.

For each exercise, assess controls, understandable cause/effect, recovery options and presentation. In-game Roadmap cards now have direct links to their respective feedback form.

## Checkpoint process

Each milestone is a reviewable playable release. Feedback can be submitted through each milestone's in-game review prompts while development continues. No feedback has been assumed. The overall goal stays active until the full requested reconstruction is verified; milestone delivery alone does not establish parity. First-town, utilities, finance, and civic-service feedback checkpoints remain available. Recent checkpoints include regional contract reviews, building customization, navigation maps, concurrent disaster response and pedestrians. Historical checkpoint notes below describe their release-time state and may be superseded by later work; full manual fidelity is still unfinished.


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

### Terrain setup checkpoint — 0.7.1
City desk → New city now provides a separate terrain preview, coastal edges, river/lake/mountain/dry profiles, hill/water/tree sliders, reproducible seeds and free pre-city sculpting. Accept begins play with selected mayor, year and difficulty funds; cancel preserves the current city. Feedback: can you create the landscape you want, and are the preview and starting choices clear? This extends the landscape portion of milestone 6; it does not complete overall manual fidelity.

### Nuclear recovery checkpoint — 0.7.2
Nuclear overload now leaves persistent radiation, immediate displacement and unusable development sites. Inspect plant load before failure; afterward use the marked map and Emergency report to relocate development. Feedback: are the warnings sufficient to prevent failure, and is it clear why contaminated zones cannot recover? This deepens milestone 6; other disasters and broader manual fidelity remain unfinished.

### City diagnosis checkpoint — 0.7.3
City desk → City data · maps & trends compares three metrics over 1, 10 or 100 years, with independent labeled scales and exact monthly tables. Aura, built density and water-pollution maps join existing overlays. Feedback: can you connect a budget or service change to later city outcomes? This extends management diagnostics across milestones 2–5; original demographic charts remain unfinished.

### Recreation checkpoint — 0.8.0
The Recreation category now contains the existing small park plus large park, fountain, ornamental pond, playground, marina, zoo and sports park. Seven original Imagegen sprites distinguish the additions. Larger sites occupy complete footprints; marina placement needs shoreline; recreation supports local value/health and zoos increase housing demand. Feedback: do the space, construction and upkeep tradeoffs make neighborhood planning more interesting? This extends milestone 4 and building variety in milestone 6.

### Industrial development checkpoint — 0.9.0
City desk → Industry & farming explains rural farm development and education-driven clean industry. Light industrial blocks can become farms with remote fields and barn-based jobs; education and clean-water incentives can convert manufacturing into cleaner technology. Feedback: can you maintain a rural district or guide an industrial district toward cleaner development? This links zoning, transport, land value, education and taxes across milestones 1–5.

### City rewards checkpoint — 0.10.0
City desk → Rewards shows progress toward the Mayor's House, stadium and university. Maintain qualifying population/approval/education/budget conditions to earn offers, then place them when ready. Rewards have costs, upkeep, power/road requirements, local amenities and selected demand/education benefits. Three original Imagegen sprites mark the achievement. Feedback: do the requirements provide worthwhile goals, and are the offers and ongoing costs clear? This adds milestone 6's first reward set; the full catalog and business opportunities remain unfinished.

### Mountain routes checkpoint — 0.11.0
Drag road, rail or highway across a qualifying ridge to receive a tunnel quote. Tunnels preserve surface development, connect portals to networks, carry commuters/freight, and add maintenance. View underground routes from Transport → View tunnels or City data. Three Imagegen portal sprites distinguish modes. Feedback: can you locate viable portal sites and judge tunnel cost against building around the hill? This extends milestone 5's transport choices.

## Earthquake recovery checkpoint — milestone 6
Manually choose an earthquake epicenter or enable optional random quakes. Damage spreads across eight response steps, destroys complete buildings, displaces residents, breaks road/rail/pipe/subway/highway links and can collapse tunnels or ignite fires. The emergency panel links to recovery maps. Feedback: can you identify why neighborhoods lost services and restore them after the disaster? This extends challenge gameplay; the remaining disaster catalog and sirens are unfinished.

## Technology progression checkpoint — milestones 5–6
Start in 1900 and plan transport around subway (1912), airport (1915), bus (1920) and highway (1940) availability. City desk → Technology timeline displays current and future choices across transport and utilities; January unlock notices and toolbar year labels guide expansion. Feedback: does the timeline make early-city planning and later network upgrades clear?

## Compact controls usability checkpoint
Narrow screens now show separate scrolling rows for categories and construction tools, followed by readable instructions. Selecting an offscreen tool from a report brings it into view; the map is no longer covered by introductory display text. Feedback: can you find tools and read their instructions comfortably in a narrow window? This improves access to all existing gameplay milestones.

## New-city setup usability checkpoint
Terrain settings and preview appear together on wide screens, with Accept/Cancel above the map. Narrow screens show the preview first. Feedback: can you understand and choose your starting landscape without losing track of the preview? A browser playthrough confirmed creating an empty town, placing roads/zones/power/disposal, resident growth and restoration after reload.

## Annual budget review checkpoint — milestone 3
Review the completed year’s revenue, expenses, loan repayments, contract penalties and closing treasury before resuming play. Auto Budget preserves current settings and skips the annual window while funds remain nonnegative. Feedback: does the annual pause help you adjust spending before financial trouble, and is Auto Budget clear?

## Historical preservation checkpoint — milestone 1
Inspect → Make historical protects selected RCI buildings from replacement, rezoning and demolition while leaving underground utility maintenance available. Abandoned historical buildings retain their appearance and can recover when services return. Feedback: can you preserve a favorite neighborhood while still managing its needs?

### Milestone 6 feedback checkpoint: tornado recovery
Start a tornado from Emergency, follow its path, dispatch firefighters to secondary fires, then reconnect surface routes and rebuild. Random tornadoes are optional and off initially. Feedback: is the damage readable, and does rebuilding feel manageable?

### Milestone 6 feedback checkpoint: prepare before impact
Tornadoes begin with an approaching-storm warning. Sound the early warning siren, then continue the emergency. Timely warnings protect buildings and reduce displacement; repeated false alarms weaken public response. Feedback: does preparation feel consequential and is the warning clear?

### Milestone 4 feedback checkpoint: shape the city with policy
Enact or repeal carpool incentives and clean-air regulations through Budget → Ordinances. Compare road traffic, air pollution, jobs and operating costs. Feedback: are policy benefits and recurring costs clear enough to guide a decision?

### Milestones 3–4 feedback checkpoint: revenue versus satisfaction
Enable Parking fines under Budget → Ordinances, compare its monthly/yearly revenue estimate with the aura penalty, and inspect the separate income line in Budget. Transit and carpooling reduce receipts. Repeal the policy to remove both effects. Feedback: is this a useful tradeoff, and does the preview make the consequence clear?

### Milestone 2 feedback checkpoint: diagnose contaminated supply
Look for brown water, open the water-pollution map from Utilities, and inspect water sources to distinguish pollution losses from aging and treatment benefits. Feedback: can you tell whether to clean a water network, replace an old source, or relocate polluting uses?

### Milestone 3 feedback checkpoint: business offers
An eligible city can accept a casino proposal, defer placement, and receive a monthly stipend while the facility stands. Compare the income with local crime, police response and demolition. Feedback: are the offer terms clear, and is the income worth the neighborhood impact?

### Milestones 3–4 feedback checkpoint: crime, property and revenue
Inspect a neighborhood’s crime-related land-value loss, add policing or Neighborhood watch, and compare land value and taxes. Casino income now comes with an indirect property-value cost as well as crime. Feedback: are those consequences visible and useful when deciding where to build?

### Milestones 2 and 5 feedback checkpoint: population and power charts
Open City desk → City data, expand the population and electricity charts, and compare employment access and dependence on each plant type. Feedback: do these breakdowns help identify transport or utility investment needs?

### Milestone 6 feedback checkpoint: shoreline recovery
Choose Emergency → Start a whirlpool, then select water near a bridge or seaport. Four surges threaten connected surface water and its immediate shore. Wait for the current to settle, rebuild crossings, and check disconnected neighborhoods. Custom challenges can schedule whirlpools at the nearest water to their selected coordinates. Feedback: is the current readable, and does rebuilding the shoreline create a satisfying recovery task?

### Milestone 6 feedback checkpoint: natural waterfront threats
Enable random whirlpools under Emergency → Random disaster settings. Consider alternative road and rail crossings so one incident cannot isolate a district. Dry maps cannot generate whirlpools; water maps use a 0.3% monthly chance. Feedback: does optional waterfront risk make transport planning more interesting?

### Milestone 6 feedback checkpoint: visitors from above
Choose Emergency → Start an alien attack, select a district, then sound the early warning siren before continuing. Watch the craft move between targets and charge its beam; clear rubble and reconnect neighborhoods after six strikes. Compare trusted siren preparation with an unprepared copy of the city. Feedback: is the warning readable, and does preparation feel useful?

### Milestone 6 feedback checkpoint: unexpected visitors
Enable random alien attacks under Emergency → Random disaster settings. When a craft arrives during normal play, the warning panel holds the countdown so you can sound the siren before continuing. Feedback: is preparation clear when the event is unexpected?

### Milestones 5–6 feedback checkpoint: signature skyline
Open City desk → Landmarks or the Landmarks toolkit category to place the Eiffel Tower or Great Pyramid. Inspect or demolish any part of a landmark; only one of each can stand. Alien craft are attracted to them. Feedback: do the landmarks give the city a stronger identity, and do their footprints fit naturally into your street plan?

### Milestone 6 feedback checkpoint: rebuild the skyline
In a custom challenge, select Standing Eiffel Tower or Standing landmarks, schedule an alien attack, and require the goals to hold for two consecutive months. Complete the attack and rebuild what was lost. Feedback: do named landmark objectives make recovery challenges more personal?

### Milestone 5 feedback checkpoint: living streets
Run a populated city and watch the road traffic. Busy links show more vehicles; congestion slows them. Pause to inspect the same positions, then compare traffic after adding transit or changing road connections. Feedback: does visible traffic help you recognize the busiest corridors without opening an overlay?

### Milestones 3–4 feedback checkpoint: clinics and youth programs
Open Civic services and compare Free Clinics and Junior Sports with the current monthly budget. Enable either program, run the city, and inspect health, education and crime. Their costs grow with population. Feedback: do the benefits justify these recurring costs compared with investing in service buildings?

### Milestones 2–3 feedback checkpoint: conserve before expanding
In Civic services, compare Power Conservation and Water Conservation with the cost of another supply building. Review demand savings in Utilities, and check whether a stressed network can now serve its existing lots. Feedback: is the tradeoff between recurring policy costs and new infrastructure clear?

### Milestone 5 feedback checkpoint: a city scrapbook
Frame your skyline, then open City desk → City snapshots. Capture the view, add a caption, and return after the city has grown to take another. Compare photos with Previous/Next, enlarge them, or download a PNG. Feedback: does the album make growth and recovery milestones easier to appreciate?

### Milestone 5 feedback checkpoint: compose a district photo
Open City desk → City snapshots → Frame on map. Move the frame over a district, select Small, Medium or Large (or cycle with Space), then click the map or Take photo. Escape cancels. The saved 4:3 photograph excludes the frame and controls. Pan, zoom and rotate before entering photo mode. Feedback: do the frame sizes make it easy to photograph both a neighborhood and a skyline?

### Milestone 4 feedback checkpoint: recover a farm
Start a fire on a developed farm and let it burn, then clear the rubble across its 3×3 plot. The industrial zoning remains, so a new farm can develop if demand, power, road access, low land value and clean surroundings still qualify. Damage counts one farm lost and cannot turn surviving crop tiles into factories. Feedback: is the recovery path clear when agricultural land is hit?

### Milestone 6 feedback checkpoint: protect the harvest
Create a challenge with Developed farms as a goal and require two consecutive successful months. Farm counts track barns, not every crop tile. Add a locust event with a farm-count condition to threaten a growing agricultural sector, or combine Clean industrial buildings with an air-pollution goal for an industrial transition challenge. Feedback: do these goals support the kind of rural or clean-economy city you want to build?

### Milestone 5 feedback checkpoint: share a city album
Open City snapshots → Share or restore an album. Export the selected city album, then import that JSON file in another browser to restore photos, captions and city details. Imports add copies and never overwrite local photos. The 50-photo browser capacity applies to imports too; a batch that will not fit leaves the album unchanged. Feedback: does sharing an album convey your city’s story?

### Milestone 6 feedback checkpoint: messages about your city
In the challenge editor, expand Briefing and outcome messages. Select a message and a live value, insert it at the cursor, and preview it. For example: “{city} now houses {population} residents and has {farms} farms.” Scenario status resolves the values from the player’s current city; exported challenges retain the template. Feedback: do these messages help make player-authored challenges feel responsive?

### Milestone 1 feedback checkpoint: navigate the whole city
Use the Navigation map in the lower-left corner to jump between districts. Its data selector is independent of the main view: inspect power, water, traffic, pollution, crime, value, service coverage or waste while keeping buildings visible. The map follows camera rotation; the white outline approximates the visible ground area. Arrow keys and Enter also navigate. Collapse the map to recover screen space; it starts collapsed on narrow screens. Feedback: is it easier to find areas that need attention?

### Milestone 5 feedback checkpoint: hear city actions
Open City desk → Sound settings, enable effects and set a comfortable volume. Preview construction and emergency cues, then place and bulldoze a tile. New emergencies play a single alert; visual notifications remain available when muted. Sound pauses in hidden tabs, and settings stay in the browser. Feedback: are the cues useful and comfortable during extended play?

### Milestone 5 feedback checkpoint: a more varied skyline
Grow high-density residential and commercial zones to their highest development level. Terraced apartment towers and stepped glass offices now mix with the original buildings. Variants stay consistent for each lot and retain their selected form through historical vacancy and save/reload. Feedback: does the mature skyline make growth feel more rewarding and districts easier to distinguish?

### Milestone 5 feedback checkpoint: watch the railway
Connect homes and jobs with stations and track, then run the city. Three-car train samples move along passenger-carrying surface routes in City and Rail views. They follow bends, respect bridge axes and pause with the city. Remove a vital link and the empty route stops showing trains. Feedback: does visible rail activity make transit investment easier to understand?

### Milestone 5 feedback checkpoint: customize a building style
Inspect a fully developed residential or commercial tower, then choose Replace building style. Compare the original and replacement previews, apply the choice to every instance of that original style, or revert it later. The style mapping travels with city exports and applies to future matching buildings. Feedback: is the citywide scope clear before applying a replacement? The initial library has two residential and two commercial styles; building-file import and the larger catalog remain unfinished.

### Milestone 6 feedback: ordinance choices
Create a challenge requiring Power conservation to stay enacted, with a fire conditional on Fire safety code being repealed. Check that the state menus and goal status make the policy tradeoff understandable. Existing milestone feedback controls remain available in the game.

### Milestone 6 feedback: neighborhood challenges
Choose Developed residential buildings and open Count location. Require growth around one coordinate, then add another goal for a different neighborhood. Check that development elsewhere cannot satisfy the local goal. The same area controls apply to supported structure conditions for scheduled disasters.

### Milestone 6 feedback: civic and utility construction goals
In the Structure counts group, choose a placed school, police station, power plant or another building. Add a local radius if needed. Compare a placed airport goal with an operating airport goal: constructing and developing the airport satisfies the first, while utility and road service are still needed for the second.

### Milestones 2 and 6 feedback: abandonment and recovery
Cut service to a developed neighborhood and run the city until buildings empty. Inspect an A-marked building, restore service and jobs, and watch redevelopment clear the marker. In the creator, set Abandoned RCI buildings to 0 for that neighborhood to make recovery a challenge objective. New empty zoning does not count.

### Milestone 6 feedback: scenario announcements
Choose Announcement under Schedule events. Write a reminder using {funds} or {population}, optionally add a condition, and run the city. Check the news bar and reopen Scenario status to review the delivered message. Repeated announcements capture new values each time.

### Milestone 6 feedback: find the goal neighborhood
Open Scenario status for a local goal and choose View goal area. Build within the highlighted tiles, then reopen status to check progress. Pan or rotate while using the guide, and use Hide when finished. The map guide is excluded from photo snapshots.

### Milestones 4 and 5 feedback: healthier residents, larger workforce
Connect and fund healthcare, let life expectancy improve, then compare workforce participation in Reports. Add reachable jobs and transport for the additional workers. Check whether the population report explains why healthcare can increase both available labor and pressure on employment.

### Milestone 4 feedback: education across ages
Open Reports → Education and compare age bands. Fund schooling for several years: younger EQ should improve first, then carry into adult groups. Cut schooling and compare new learners with previously educated adults. Libraries and museums should preserve older knowledge.

### Milestones 2 and 3 feedback: yearly electricity supply
Run a year, then open Reports → Electricity. Compare available capacity with delivered annual output, and inspect imports/exports. Try an isolated plant or a conservation ordinance and check the recorded contribution. Older or shorter records show a partial year explicitly.

### Milestone 6 feedback: scenario reward offers
Schedule Offer reward and select University, Stadium or Mayor’s House. Optionally require a city condition. When the offer arrives, open City desk → Rewards and choose where to place it. The offer does not pay construction costs or build automatically.


### Milestones 3 and 6 — scripted business proposals
Create a challenge with an Offer business deal event in month 1. Advance one month, open City desk → Business deals, then decline or accept the proposal. Acceptance enables choosing a site; income starts only after placement. Try a repeated offer after declining and export/import the pending proposal. Feedback: are the decision, environmental tradeoff, and income timing clear?


### Milestone 6 — scenario popup messages
Schedule a Popup message in month 1, optionally include Scenario status, and advance time. Read the paused message, return to the city, or inspect your goals. Try saving before dismissal and reloading; unread text returns, acknowledged text does not. Feedback: is the message interruption clear and useful? Presenter portraits and moods are still pending.


### Milestone 6 — authored scenario pace
Create a challenge at 3× and lock its running pace. Close the briefing, pause to build, and use Space or Scenario status to resume. Other running speeds should be unavailable. Export/import should preserve the lock while loading paused. Feedback: does the authored pace suit the challenge, and are pause/resume controls clear?


### Milestone 6 — scripted sound cues
Enable sound in Sound settings and preview the three new cues. Create a month-1 Play sound event, then start the challenge. Try a conditional or repeated cue and reload after delivery; old sounds should not replay. Muting should leave a visible event notice and history. Feedback: are the cues distinct and appropriately balanced?


### Milestone 6 — scripted city views
Create a Move and zoom city view event for month 1, choose a location and 150% zoom, and begin the challenge. Pan elsewhere, then use View location in Scenario status to return. Try a rotated map and elevated target. Feedback: does the framing make the intended location clear, and is returning to free city navigation easy?


### Milestone 6 — coordinated scenario actions
Create a grouped month-1 camera move, popup and sound cue. Advance one month and check that the view, message and sound arrive together. Add a reward as the fourth action and confirm it appears in Rewards. Try two popups and reload while one is unread. Feedback: does this support a clear opening sequence, and is message order predictable?


### Milestone 5 — harbor activity
Develop a supplied seaport beside open water connected to the map edge, then run the city. Watch the cargo ship load, depart and return; pause and rotate the map to inspect its hull and containers. Cut a utility or block the visual channel and check that traffic stops. Feedback: is the harbor activity legible at your normal zoom, and does its pace feel appropriate?


### Milestones 2 and 5 — The harbor wakes
Open Scenarios & status → The harbor wakes. Repair the missing pipe at 20,21 in Water view, then return to City view and run time to see cargo vessels. Expand homes and workplaces while preserving six months of harbor operation, 400 residents and §5,000. Use the local goal’s View goal area button to find the harbor. Feedback: does the opening repair teach water connectivity, and is the recovery challenge balanced?


### Milestone 4 — population age census
Open History → Population · age census and movement after running the city. Compare the age bands over time and check monthly births, deaths and migration. Build or remove housing, then run another month to record its population effect. Save/reload should preserve the census. Feedback: are the age table and distinction between housing totals and demographic flows clear? Workforce and education weighting are still separate models.


### Milestone 4 — age and labor supply
In History, compare the age census with Workforce by age. An aging population changes the number of workers seeking reachable jobs; health affects participation within each band. Watch unemployment and transit demand as the city evolves. Feedback: do the age and health explanations make workforce changes understandable? Education weighting remains the next demographic connection.


### Milestone 4 — census-weighted education
Compare resident counts and EQ in Education · learning across ages. Overall education now reflects the size of each age band, and teaching/retention capacity responds to young/adult shares. As the city ages, watch how school access, adult knowledge and the city average change. Feedback: are the numbers consistent and useful for planning schools, colleges, libraries and museums?


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

### Author-controlled background events (source checkpoint; publication pending)

Create a custom challenge and turn off random disasters, automatic business offers, or both. Scheduled hazards and proposals remain playable, and the rules survive replay. After the outcome the normal city settings take effect again. Feedback target: do these controls make your authored challenge predictable, and is it clear that existing business permits and manually started disasters remain available?

### Customize a whole neighborhood (source checkpoint; publication pending)

City desk → Building designer now targets homes, shops and industrial buildings across all 14 existing non-farm RCI styles. Create a one-floor shop, a block-built courtyard or a factory, apply it citywide, export it and restore the original artwork. Feedback target: does the expanded library let you establish a recognizable neighborhood style, and are the citywide scope and unchanged simulation values clear?

### Recover with disaster assistance (source checkpoint; publication pending)

Respond to a destructive emergency, then review the recovery grant in Emergency or Budget. Overlapping hazards receive one combined assessment. Compare a city with established fire/water protection against an unprepared city, rebuild using the one-time funds, and check the separate recovery-grant line in year-end accounts. Feedback target: does the payment help recovery without obscuring the ongoing cost of running the city, and is the assessment understandable?

### Read civic districts from every direction (source checkpoint; publication pending)

Build a civic district and rotate the map: all eight service buildings now show their actual sides, roofs and grounds. Compare the fire-engine bays, hospital wing, school courtyard and jail perimeter, then inspect their operating status. Feedback target: can you recognize each service at normal play zoom and keep your bearings as you rotate the city?

### Build through a dense city (source checkpoint; publication pending)

Open City view layers, hide zoned or other buildings, and inspect the ground and networks beneath them. Toggle roads, poles, trees, zone colors and the terrain grid independently; use Default View then Apply to restore the city. Hidden buildings still block occupied lots, and emergency indicators stay visible. Feedback target: do the controls make crowded areas easier to understand without making construction targets ambiguous?

### Play with an unobstructed city view (source checkpoint; publication pending)

Press H or choose Hide to expand the city across the game area. Pan, zoom, use construction hotkeys and pause with Space; restore the interface with Show controls, H or Escape. Hiding cancels an unfinished drag. Feedback target: can you comfortably play and inspect the city with the interface hidden, and is returning to the toolkit effortless?

The [ and ] keys rotate the city counterclockwise and clockwise, including with toolbars hidden and during background monthly updates. Modified, editing and repeated key presses are guarded.

### Author calendar-based challenges (source checkpoint; publication pending)

Choose Calendar date for a goal or event/rank condition, or Calendar month for a seasonal rule. Use {date}, {year} and {monthOfYear} in messages; copy dates to variables when calculating elapsed months. Save and replay a challenge that crosses New Year. Feedback target: can you schedule dated objectives and understand which game month will trigger each condition?

### Build roads and neighborhoods with the keyboard (source checkpoint; publication pending)

Focus the map, choose R or a zone hotkey, and move with arrows. Press Shift + Enter to start a range, extend it with arrows, and press Enter to build. Try this near a map edge and after rotating; Escape cancels without spending. Feedback target: can you confidently lay out roads and zoning rectangles without switching to a mouse?

### Create tax and debt challenges (source checkpoint; publication pending)

Author a challenge requiring all loan payments to clear while keeping residential taxes below a chosen rate. Add a land-value objective or announce remaining debt in a scheduled message. Save and replay it. Feedback target: are the financial targets clear, and can you distinguish remaining loan obligations from available treasury funds?

### Author utility and cleanup challenges (source checkpoint; publication pending)

Create a challenge requiring spare power and water capacity, then build the supply to satisfy it. Combine these targets with occupied homes without service to catch disconnected neighborhoods. Add pollution, traffic or uncollected-garbage limits and show their current values in messages. Feedback target: do the targets distinguish insufficient capacity, missing connections and environmental cleanup clearly?

### Read water infrastructure from every direction (source checkpoint; publication pending)

Build the four water facilities and rotate the map. Compare their silhouettes, inspect their capacities and switch to the water overlay to trace connections. Feedback target: are storage, pumping, desalination and treatment easy to distinguish at normal play zoom? An offline contact sheet is available at previews/water-facility-models.png.

### Recognize your energy mix from every direction (source checkpoint; publication pending)

Place the available power technologies, rotate the map and compare plant silhouettes at normal zoom. Inspect capacity and age, then switch to the power overlay to find their grids. Feedback target: can you distinguish each technology and understand its footprint without opening a query? Preview: previews/power-plant-models.png.

### Watch the wind farm operate (source checkpoint; publication pending)

Build wind turbines and run the city. Rotate the view, pause and resume, then toggle scenery animation or reduced motion. Feedback target: does rotor motion make the wind farm feel active without distracting from construction or data overlays? Offline motion preview: previews/wind-turbine-motion.gif.


### Grow and customize whole city blocks (source checkpoint; publication pending)

Zone a serviced 2×2 medium-density or 3×3 dense area and let it develop. Inspect an outside corner, preserve the whole building, interrupt and restore its utilities, then try footprint-matched artwork in the Building designer. Feedback target: are whole-building boundaries, service needs, historical protection and demolition clear? Can you customize one footprint without unexpectedly changing smaller buildings? Offline preview: previews/building-lot-models.png.


### Author branching city challenges (source checkpoint; publication pending)

Create a routine that increments a variable, chooses an If/Else path, shows a popup and calls a second routine to activate a goal or offer a reward. Schedule it to repeat. Save while the popup is pending, reload and continue; inspect Routine history to see the saved branch choice. Copy routines from the current challenge into a new draft. Feedback target: are action order, branch choices, routine calls and pauses understandable without writing code?


### Diversify supply and trade with several neighbors (source checkpoint; publication pending)

Connect two neighbors to a power or water network and sign import contracts with both. Inspect each delivery and minimum fee, then interrupt one supplier or separate a district from the grid. Sell genuine surplus through another network, or combine disposal contracts for excess garbage. Feedback target: can you distinguish supplier shortages from missing local connections, understand backup costs and review one contract without affecting the others?


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

Utility planning checkpoint: compare power/water usage, available supply, demand and actual unmet demand over time, with report shortcuts. See [utility usage trends](UTILITY-USAGE-TRENDS-MILESTONE.md). Source only; publication pending.

Water recovery challenge: restore a broken utility connection and sustain six months of supply, population and cash stability. See [Water under pressure](WATER-RECOVERY-SCENARIO-MILESTONE.md). Source only; publication pending.

Scenario inspection checkpoint: preview actual prepared-city layouts, starting figures and utility/rail service before loading a challenge. See [starting-town previews](SCENARIO-START-PREVIEW-MILESTONE.md). Source only; publication pending.

Camera inspection checkpoint: rotate both directions while keeping the panned neighborhood in view. See [anchored camera rotation](CAMERA-ROTATION-MILESTONE.md). Source only; publication pending.

Visible sanitation checkpoint: rubbish piles now reveal uncollected waste in City view and disappear with actual collection. See [visible garbage](VISIBLE-GARBAGE-MILESTONE.md). Source only; publication pending.

Disposal planning checkpoint: locate aging recycling and incineration facilities, compare current and future capacity, and inspect them directly. See [disposal maintenance](DISPOSAL-MAINTENANCE-MILESTONE.md). Source only; publication pending.

## Reward progress checklist

Current values, missing requirements and consecutive-month guidance now explain how to earn each reward. Earned and placed states explain deferred placement and rebuilding. See [milestone details](REWARD-PROGRESS-MILESTONE.md). Feedback: is the next action needed to earn a reward clear?

## University reward progression

University offers now depend on education alone, arrive on the next qualifying month and cost nothing to place. Saved offers and campuses are preserved. See [milestone details](UNIVERSITY-PROGRESSION-MILESTONE.md).

## Full university campus

Reserve 100 tiles for a new university, with campus-wide placement, service checks, rendering and transport access. Old campuses retain their boundaries. See [milestone details](UNIVERSITY-CAMPUS-MILESTONE.md).

## Stadium as a major city project

Grow to 150,000 residents with strong approval, then fund a 75,000 stadium on a 5×5 lot. Existing offers and stadiums are preserved. See [milestone details](STADIUM-PROJECT-MILESTONE.md).

## County Courthouse reward

Earn a courthouse at 25,000 residents with strong approval, then place it to supply civic jobs and reduce nearby crime. Includes a new four-view building model. See [milestone details](COUNTY-COURTHOUSE-MILESTONE.md).
