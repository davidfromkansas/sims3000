# Water network diagnostics milestone

Utilities now reports each connected water network separately: available supply after trades, actual delivery, demand reachable by its pipes and currently unwatered demand-bearing tiles. View shortage and View uncovered area move the map to an affected location in Water view with the query tool selected. A maintenance table lists water facilities, their age and efficiency, output, pollution losses and rebuild costs, with Inspect facility links.

Manual pp.117–118 describes source aging, local water shortages, pipe coverage and treatment. This diagnostic interface lets players distinguish insufficient capacity from absent pipes and source problems. It does not change allocation or claim an original-game report layout.

## Interpretation

Reachable demand includes undeveloped zoning because the simulation reserves water for it. It uses the same seven-tile coverage and conservation demand as allocation. Disconnected networks may cover the same tile: reachable demand must not be summed, and a tile supplied by any network is not shown as dry. Delivered amounts remain the allocator's actual per-network values. Uncovered tiles lie outside every pipe service area.

Maintenance values are current observations, not forecasts. Treatment facilities show their operational state instead of a misleading pumping output. Rebuild prices exclude demolition. No additional state is saved; diagnostics reconstruct from the current simulation, under schema 118.

## Feedback exercise

Build two separate pipe networks, one with spare supply and one with an aging source serving a dense district. Open Utilities and select View shortage. Join the networks and reopen the report to confirm recovery. Place distant zoning to exercise View uncovered area; select an old source's Inspect facility link to compare aging and pollution losses.

## Validation and availability

194 regression suites pass. Dedicated tests cover a local shortage despite citywide surplus, joining pipes, uncovered homes, overlapping networks, isolated sources, imported water, maintenance fields, save reconstruction and read-only navigation. The actual utilities-dialog function and water navigation callback are executed in the test harness. This is not browser visual acceptance; that remains pending while the Mac is locked.

GitHub source milestone only. Sites publication awaits explicit source-export approval; the live site remains version 150.
