# Earthquake strength in scenarios — milestone 6 checkpoint

Scenario creators can choose an integer earthquake magnitude from 1 to 100 in scheduled event rows and structured routine actions. The scheduled event report, routine history, active city label and Emergency panel show the chosen magnitude. The value is a game strength control, not a Richter-scale measurement.

The manual’s Start an Earthquake command explicitly specifies the 1–100 range (p.189). It does not specify damage formulas. This implementation uses original tuning: magnitude50 exactly preserves the prior damage probabilities and eight outward response bands. Other magnitudes use ceil(8 × magnitude / 50) bands, from one to sixteen. Destruction chance scales with strength and distance; secondary-fire chance also scales with strength. Ground infrastructure and tunnel damage still use actual impacted tiles; multi-tile buildings retain whole-building destruction rules. This does not claim physically modeled seismic waves or the original game’s executable behavior.

The chosen magnitude is saved with an active quake. Schema115 validates it and checks progress against that magnitude’s band count. Schema114 and earlier quakes migrate to magnitude50, retaining their old progress. Unspecified scripted magnitude, manually triggered quakes and random quakes use50. Existing scenarios retain their behavior. A saved disaster resumes from the next unprocessed band rather than replaying damage.

The calendar remains held while the emergency runs. Scheduled goals wait for the disaster to finish; a structured routine waits before executing its following action. Firefighting and post-disaster reconstruction retain their existing controls. A small quake may cause no damage, depending on the city seed and affected tiles.

Validation covers invalid values without mutation, the unchanged default formula, strictly increasing infrastructure losses across seeded 1/25/50/100 comparisons, unaffected tiles beyond each radius, sixteen-step continuation saved after step12, missing/malformed current-save magnitude, older-save migration, scenario victory held during response and routine continuation after save/reload. Actual form handlers validate and submit magnitude in both authoring interfaces.

Feedback exercise: use the same saved starting city and epicenter for magnitude25 and magnitude100 scenarios. Inspect the reported strength, handle the resulting emergency, compare broken roads/utilities, and save halfway through the stronger quake before continuing. Judge whether the range offers useful difficulty control and communicates its effects clearly.

Browser interaction and visual acceptance remain pending because the Mac is locked. Sites publication is still blocked by the separate source-export approval requirement; it has not been retried.

All 187 regression suites passed. Cache graph: earthquake-magnitude-1.
