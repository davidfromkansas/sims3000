# Fire protection and property value

## Playable change

Operating fire stations now improve nearby land value as described by the manual’s public-safety introduction (p.106). The benefit follows actual coverage, including its distance falloff, overlapping coverage cap, station power and road access, department funding and strikes. Tile inspection reports the actual gain separately from value lost to crime.

The existing tax and development calculations receive the resulting property values. Station upkeep remains an expense; this does not imply that a station pays for itself.

## Feedback checkpoint

Inspect a home near a road and power, note its land value, then build a nearby fire station. Query the same home to compare its fire coverage and value gain. Inspect a more distant home, then compare the coverage map. In Civic services, reduce or restore fire funding and inspect the change. Evaluate whether the local benefit makes station placement and funding consequences clear.

## Evidence

All 243 regression suites pass. New coverage verifies actual construction, distance falloff, increased residential revenue, funding changes, strikes and monthly service recovery, demolition, saved restoration and noncompounding recalculation. Radiation remains at the existing low-value floor; water gains no fire-protection bonus. The property-value ceiling remains 100 and inspection reports only the actual capped gain.

Browser QA built a station at tile 21,22 and inspected the home at 21,21. It showed 89% fire coverage, a 7.1-point gain and land value 67/100. This ran on the separate QA origin; the normal player city was untouched.

## Fidelity and delivery limits

The positive relationship comes from the manual; the maximum eight-point benefit is explicit reconstruction tuning. The change does not claim recovered original coefficients, full balance parity or a new fire-spread model. It is derived from current state, so save schema remains 125. GitHub and local preview receive the milestone; Sites publication remains pending explicit source-export approval.
