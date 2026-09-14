# Neighborhood aura and traffic

## Playable milestone

Nearby traffic now lowers residential aura directly, alongside its existing air-pollution effect. The manual (p.113) explicitly identifies traffic as a cause of poor neighborhood happiness. Inspection of occupied homes, including tiles in larger buildings, now offers “Why residents feel this way,” breaking down education, health, crime, pollution, property value, taxes, parking fines and traffic.

The same shared calculation drives actual resident aura and the inspection report. Factors add to the result, with an explicit adjustment when the 0–100 limit applies. Citywide aura retains resident weighting. Existing aura maps, advisor policy comparisons and reward checks use the updated result.

## Feedback exercise

Inspect homes near busy roads and open the aura breakdown. Compare a quieter neighborhood. Meet Moe and compare carpool incentives or improve transit routes, then inspect the homes again. Check whether the report explains the actual pressures: a transport improvement may help traffic while high taxes or crime remain the larger problem. Use the civic milestone feedback checkpoint to record notes.

## Verification

245 suites passed in aggregate: the full run passed 244, then the larger-building query harness was updated to supply the new imported report dependency and passed its rerun. New tests verify factor totals, local traffic independently of pollution, distance and highway normalization, the penalty cap, actual carpool improvements, matching policy previews, saved continuation and noncompounding calculation.

Browser inspection at tile 21,21 displayed 28.1 aura with separate tax (−15.0), crime (−11.6), property (+5.2) and traffic (−0.2) factors. The full table expanded correctly on the isolated QA origin. Normal player city was untouched.

## Fidelity limits

Two-tile exposure, distance weighting and an eight-point maximum penalty are explicit reconstruction tuning. The busiest nearby road/highway determines pressure, normalized to each route’s capacity. This models a documented relationship, not an original recovered traffic-noise algorithm or full aura parity. Save schema125 remains unchanged because aura is recalculated from current conditions. GitHub/local delivery only while Sites source-export approval is pending.
