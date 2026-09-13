# Disposal facility maintenance milestone

Utilities now lists every recycling center and incinerator, ordered by greatest age-related capacity loss. Each row shows location, operating status, age, current and new processing capacity, capacity in twelve months, last-month throughput, upkeep, rebuild cost and a direct Inspect facility action.

Manual page 103 states that both incinerator types lose efficiency as they age and can be queried for capacity. Existing simulation and individual queries already modeled this. The new citywide planning table makes it possible to find aging facilities without searching the map one at a time. Recycling uses its existing aging behavior and includes the current Trash Presort setting in both current and new capacity.

The forecast isolates aging with unchanged ordinance settings. It is not a prediction of garbage production, supply interruptions or future construction. Throughput remains distinct from capacity, and separate networks may not share garbage. Rebuild prices exclude demolition; the guidance recommends adding replacement capacity before removing the old plant. Waste-to-energy’s dependence on fuel actually burned is explained. Landfill storage remains separate.

Feedback exercise: build several disposal facilities, inspect the oldest row, and compare its twelve-month estimate with replacement cost. Add capacity or replace a facility, then return to Utilities to confirm the list updates. This planning view does not alter construction or processing rules; save schema remains 119.

Validation covers actual current/future aging, ordering, presort, missing power, real processed amounts, save/load, ordinary demolition/rebuild, invalid inspection targets and full Utilities-to-query control wiring. All 205 regression suites pass. The final compact-table update also passed the maintenance suite. Local browser testing verified three differently aged facilities, the current/new and twelve-month columns, and the oldest incinerator’s inspection link opening its live 50-year/25-unit query. No browser errors were recorded. The original local city was restored from its named backup. Player feedback remains pending.

Source only; Sites publication remains pending explicit source-export approval.
