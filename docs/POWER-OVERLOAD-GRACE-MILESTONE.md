# Plan power expansion before overload becomes dangerous

Players now have 18 consecutive overloaded months without overload explosions. Each following month has increasing risk, reaching certain failure at month 30. Restoring enough supply on the affected grid resets the streak at the next monthly check. Disconnected spare generation cannot help, while connected generation and imports can.

Plant inspections and Electrical grids now show the current streak and next-month failure risk. The grid reports Failure risk once an overloaded plant has completed 18 months. Existing saves retain their accumulated streak; no save-schema change is needed (135).

## Source and approximation

[Prima official strategy guide, printed page 275](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide) establishes the 18-month grace period and certain failure at 30 months. The intervening linear probability curve is an explicit implementation approximation: (completed overloaded months − 18) / 12, clamped to 0–1. Seed, month and plant root produce a reproducible draw, so reloading the same city does not reroll its next failure. Plant prices, output, aging and overload supply remain approximations; the guide itself gives conflicting 110% and 120% supply figures in different sections.

## Verification and feedback

Focused checks cover all 18 protected months, probabilistic survival and failure afterward, guaranteed month-30 failure, identical saved continuation, restored connected capacity, import relief, isolated capacity, ignition and grid warning thresholds. All 283 default regression suites pass. The grid warning boundary also passes its focused check at 17 and 18 months.

Feedback focus: inspect an overloaded plant, plan connected replacement capacity, then run the month and verify the warning clears. Live browser review is pending while the Mac is locked. Sites publication remains blocked by automatic approval review pending explicit source-export authorization.
