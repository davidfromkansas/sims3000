# Falling space junk checkpoint

The manual names Space Junk as a disaster (p. 58) and exposes Start Space Junk to scenario scripts (p. 189). Players can now choose an impact area from Emergency, or schedule it in a custom scenario with the existing conditions and repeats.

Six fragments fall at four-response-step intervals. The first hits the selected tile; later targets scatter deterministically within six tiles of the origin, clamped to the map. A marker and Imagegen satellite sprite show the next impact location. A struck building is removed as a whole footprint, surface road/rail/highway/power lines break, and adjacent combustible structures ignite. Water impacts do no damage. Buried pipes/subway survive; struck exposed tunnel portals collapse. These timing/damage rules are original calibration, not exact recovered engine coefficients.

Calendar time stays paused until the fall and all fires finish. Firefighters handle secondary fires, not impacts. The siren currently protects against tornadoes only. Space junk can also occur randomly when enabled in Emergency. The default is off. The 0.30% monthly chance is original calibration; a deterministic hash of city seed and month chooses the outbreak and target. Scripted events run first, and an active emergency prevents overlapping random disasters. Schema 43 persists the opt-in setting; prior saves default to off.

Schema 42 preserves the origin, next impact, response age and cumulative counts, with earlier saves defaulting to no space junk. Verification includes deterministic continuation after a save, complete building destruction, surface/buried network distinction, water impacts and scenario scheduling.

Feedback: trigger a fall near a developed area, contain the fires, then rebuild. Are the incoming-fragment marker and response timing clear enough to act on?
