# Faster large-city simulation — milestone 3 performance checkpoint

Large cities now avoid commuter route searches once no unfilled workplace is reachable. This improves monthly simulation and the recalculations used after construction without changing job capacity, worker order, route costs, travel limits or traffic effects.

Profiling a synthetic occupied district found commuter routing dominated a slow monthly update. The old allocator continued exploring road networks after their available jobs were exhausted. A transient availability index now counts workplaces with remaining capacity, globally and per connected street network. Both rail and road allocations update the same index. It tracks open workplaces rather than summing fractional job counts, avoiding residual floating-point totals. No persisted cache or stale cross-month state is introduced.

Three sequential samples per fixture on this Mac, Node v22.19.0, measured these medians without a CPU profiler:

| Map / synthetic occupied district | Population after month | Previous month | Optimized month | Previous recalculation | Optimized recalculation |
| --- | ---: | ---: | ---: | ---: | ---: |
| 96×96 / 48×48 district | 30,720 | 362 ms | 111 ms | 102 ms | 46 ms |
| 256×256 / 96×96 district | 122,880 | 6,829 ms | 1,489 ms | 1,365 ms | 295 ms |

These are synthetic routing workloads, not organically grown-city or browser-frame benchmarks. Timing depends on hardware, occupancy, network layout and job supply; the measurements are not a universal speed guarantee. The larger fixture improved about 4.6×. Full-city renderer performance and browser responsiveness still require direct acceptance testing.

Reproduce current measurements with `node benchmarks/large-city-routing.mjs`. To compare another source checkout, pass its absolute `dist/engine.js` path. [Raw samples and baseline commit](performance/large-city-routing.json) preserve the measured evidence. The baseline is c5a5b196, before this optimization.

A frozen copy of the prior route allocator is used as a differential oracle. Tests compare the complete route statistics and every tile’s derived fields for no jobs, scarce/abundant capacity, buses/carpooling, disconnected job markets, real rail/subway competition, fractional funding and a dense district. Separate whole-engine comparisons used the preserved baseline checkout and matched full serialized cities plus statistics through two monthly ticks after save restoration on both 96×96 and 256×256 maps. Existing simulation rules and save schema116 are unchanged.

Feedback exercise: load a large occupied city, construct a road or utility connection, advance several months and compare responsiveness. Inspect unemployment and traffic to confirm the results remain understandable. This milestone adds no controls; it reduces waiting in existing city-building actions.

Browser interaction/performance acceptance is still pending. The most recent computer-use attempt found the Mac locked. Sites source export/publication remain pending explicit authorization after automatic approval rejection, and were not retried.

All 189 regression suites passed. Cache graph: large-city-routing-1.
