# Building utility goals milestone

Scenario authors can now require restoration of power or water across buildings, using **Buildings without power** and **Buildings without water** in the existing goal, condition, variable and routine controls.

The manual's page 186 lists Count Unpowered Buildings and Count Unwatered Buildings. These queries implement that building-wide capability using this reconstruction's network requirements, not an inferred original-game consumption formula. Existing occupied-home goals retain their previous meaning.

Each RCI lot, farm, airport/seaport or fixed footprint counts once if any eligible member lacks service. Local queries select the building's origin. Standing abandoned buildings remain eligible; empty zoning, rubble, radiation and nonconsumers are excluded. Public services, water sources, recycling, rewards and businesses count for electricity where the simulation requires it. The current water model consumes water for RCI and ports only, so these queries do not invent a water dependency for civic buildings.

Power and water allocation now share their unchanged base-demand functions with these queries. Save schema 118 prevents older builds from silently losing new goal definitions. The browser module cache is refreshed.

## Feedback exercise

Create a challenge in a city with an occupied workplace and an unpowered school. Add both building utility goals with targets zero. Restore electricity and supply the workplace with pipes and a water source. The challenge can now finish only after both services recover. Compare this with an occupied-home-only goal in the same city.

## Validation and availability

192 regression suites pass. Dedicated coverage exercises partial multi-tile outages, each footprint identity, local origin selection, empty zoning, abandonment, unchanged home counts, read-only queries, saved progress and a playable restoration/restart challenge. Network regression coverage checks that extracting consumption formulas preserves existing allocation behavior. Browser interaction acceptance remains unverified while the Mac is locked.

GitHub source milestone only. Publication remains pending explicit Sites source-export approval; the live site remains version 150.
