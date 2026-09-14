# Recent development on the city map

## Player capability
New or expanded residential, commercial and industrial buildings display small amber finishing-work barriers for the first two simulation months after development. The original procedural props have shaded faces and rotate with single-tile or rectangular building footprints. Inspect explains the cue. City desk → Play preferences → Show recent development can hide it.

The details are static, with no transition or motion clock. They remain legible while paused and under reduced motion. They appear only in City view, respect hidden zoned buildings, and do not cover data maps. Fires, rubble, radiation, farms, historical and abandoned buildings do not receive this cue.

## Fidelity and limits
This is an original visual aid for the manual's zone-development loop (pp.97–99), not a claim to reproduce an original construction phase. Occupancy and services begin according to the existing simulation. Growth resets building age, and the props use that existing age; authored or saved young buildings may also show them. No simulation state or save schema is added. The finishing-work period is a visual design choice.

## Feedback checkpoint
1. Run a city until a zone develops and look for the amber barriers around its building base.
2. Pause and rotate the view to compare new development with older buildings.
3. Inspect the site, or switch off Show recent development in Play preferences.

## Validation
The initial full run passed 232 suites and found two fixtures requiring updates: the added preference key/control count, and the renderer hook used by the rectangular-lot test. Both affected suites passed after those fixture updates, yielding 234 passing suites across the final validation. New coverage checks age expiry, hazards, farms, all four projected orientations, state preservation, data-layer exclusion and preference persistence.

Browser playtesting on the separate 4388 origin grew three homes in February 1950 (224 to 248 residents), showed their barriers, verified a rotated view and confirmed the preference removed the details. No browser errors or warnings were reported. The user's normal 4387 city was not advanced or saved. Test tabs were closed afterward.

Save schema remains 122. GitHub/local-preview milestone only; Sites publication awaits explicit source-export authorization.
