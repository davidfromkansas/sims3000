# Reward building garbage milestone

Major reward buildings now generate waste and use the city's existing recycling, incineration, landfill, freight and export systems. The Theme Park produces 144 units/month, University 88, Stadium 36, Country Club 10, Medical Research Center 2.88, Lighthouse and Performing Arts Center 1.6 each, and City Hall 1.44 while operating. Each entire building is charged once, including old smaller campuses. Other public structures and rewards without an established rate remain unfinished.

Source: [Prima official guide, table 14-2, pp.216–217](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide). The listed structure garbage weights are divided by 100 to map their relative loads to this simulation's monthly units. This is an explicit reconstruction normalization, not original tonnage or a claim that all zone/structure waste rates now match the original balance.

New waste is stored once at the building root. Collection uses the union of roads beside its whole footprint, so a 10×10 campus with an entrance on the opposite side can reach a landfill, recycler, burner, train-station freight transfer or garbage-export connection. No transport access is granted to unrelated city activity. A disconnected disposal network cannot collect its waste. New production stops when the reward stops operating; old waste can still be collected with a usable road connection. This milestone does not change existing disposal capacities, fees or zone production.

Building inspection now shows current generation and waiting garbage. The utilities panel lists each covered reward, its location, production and backlog, and explains how to connect disposal. Those contributions are included in total garbage production and the monthly conservation ledger.

The rate/route data are derived, so save schema remains 141. Prior historical waste records remain untouched; new months use the corrected generation. A backlog saved on the root survives reload and can be collected after restoration of access.

Focused tests cover once-per-footprint generation, far-side local disposal, recycling, incineration, rail-only landfill transfer, export, disconnected backlog/recovery, collection while operation is suspended, building/report inspection, save continuity and three conserved monthly ledger records. Interactive browser inspection remains pending the locked Mac. Live Sites publication remains pending explicit repository-export authorization following automatic approval review rejection.

Completed regression: 291 default suites passed in the full run; two extracted Utilities-dialog fixtures omitted the new report dependency. After injecting the real report function, both passed separately (293 suites total). The focused test additionally verifies unusable road conditions block campus collection access.

Ordinary-city audit: the existing month-549 metropolis had seven operating covered rewards producing 284.08 additional garbage units/month. It ran twelve ordinary months through month 561 with no added facilities, funding injections or state grants. Every monthly waste ledger conserved mass and every month ended with zero city and reward backlog. Population ended at 175,080 and treasury at §16,540,032. Snapshot: `/tmp/sims3000-reward-garbage-city.json` (local audit artifact). This establishes the tested year's disposal adequacy, not indefinite capacity or original-game balance.

The full month-561 city file also passed exact serialize→validate→serialize round-trip verification, preserving the generated ledger and city state.
