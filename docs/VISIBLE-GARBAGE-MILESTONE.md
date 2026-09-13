# Visible uncollected garbage milestone

Uncollected rubbish now appears beside affected tiles in the normal City view and Waste map. Original shaded bags, discarded cartons, cans and loose paper show increasing backlog; real collection removes the props as waste is cleared. This implements the visible accumulation described on manual page 103.

The display uses one to four curbside props at thresholds of 1, 5, 15 and 40 waste units. These thresholds and shapes are presentation tuning, not changes to municipal waste amounts or a recovered original art set. Props are arranged on the visible curb edges to remain readable in all four views. They do not spread waste onto adjacent tiles, alter disposal capacity or introduce new occupied land. Landfill contents retain their separate existing display.

The renderer draws only visible tiles with a backlog. Static geometry requires no animation timer or bitmap allocation. Fire, rubble, radiation and water suppress the props; diagnostic views other than Waste omit them. Hiding buildings leaves the ground-level sanitation indicator visible. Save schema remains 119.

Feedback exercise: let a neighborhood accumulate garbage without collection, inspect the City and Waste views, then connect adequate landfill or other disposal. Assess whether the piles communicate the problem and visibly clear after a simulated collection month.

Validation covers bounded thresholds, stable prop geometry, hazard suppression, real monthly accumulation and landfill cleanup, full renderer integration across all four orientations and view-layer gating, and unchanged city serialization during drawing. Browser inspection also exposed camera buttons covered by the navigation map. The camera bar now sits at the upper left, with wrapping on narrow layouts; the browser confirmed the zoom buttons work and reach 148% without hitting the navigation map.

All 204 regression suites pass; the final camera-layout edit was browser-verified and the garbage renderer suite passed again. Local browser testing loaded a prepared backlog city, inspected piles at 148% and after rotation, then ran collection until Waste reached zero and the piles disappeared. No browser errors were recorded. The original New Haven city was restored from its named backup. Player feedback remains pending.

Source only; Sites publication remains pending explicit source-export approval.
