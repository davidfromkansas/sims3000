# Hospital patient capacity

Players can inspect hospital beds, funded doctors, patient demand and unmet care. Funding restores staffing; another connected hospital supplies additional beds. Pollution can overload hospitals without population growth.

## Rules and evidence

The [official Prima guide, pp.338–340](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide) specifies 1,500 beds, 100 doctors at full funding, 15 patients per doctor, a base hospitalization rate of 5%, and pollution-related increases. Extra funding does not add beds.

The reconstruction now shares a finite care capacity across each hospital’s road catchment. Effective capacity is the lower of beds and funded doctors × 15. Global air/water exposure increases patient demand using the existing pollution scale conversion. Reports use the same calculations as the simulation.

Remaining approximations: doctors scale linearly above 110% funding; original hospital grades and health-age cohorts are not implemented. Existing costs, strike rules, one-tile civic footprints and direct pollution effects on life expectancy remain. Full civic footprints require a separate placement and legacy-save migration; no buildings are moved by this update.

## Feedback checkpoint

Inspect a hospital and compare 50%, 100% and 150% healthcare funding. In an overcrowded catchment, add a second connected hospital and compare coverage. Assess whether the report clearly distinguishes staffing shortages from bed shortages.

## Validation

Focused scenarios cover finite capacity, funding, pollution, overlapping/disconnected catchments, damage and save reconstruction. The existing facility-inspection and civic capacity fixtures now assert patient capacity. Browser visual review remains pending while the Mac is locked. This milestone is not published to Sites while the existing publication approval remains unresolved.
