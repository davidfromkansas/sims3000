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

For each exercise, assess controls, understandable cause/effect, recovery options and presentation. In-game Roadmap cards now have direct links to their respective feedback form.

## Checkpoint process

Each milestone is a reviewable playable release. Feedback can be submitted through each milestone's in-game review prompts while development continues. No feedback has been assumed. The overall goal stays active until the full requested reconstruction is verified; milestone delivery alone does not establish parity. First-town, utilities, finance, and civic-service feedback checkpoints remain available. Neighbor contracts are the current checkpoint; the rest of milestone 5 is still planned; full manual fidelity is still unfinished.


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
