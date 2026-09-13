# Dense-city commute routing milestone

Dense cities advance their monthly simulation with less time spent repeatedly examining filled workplaces. The route destination index removes a workplace immediately after road or rail commuters exhaust its jobs. Ordered sets preserve the remaining target order; route costs, path ties, workplace allocation and vehicle counts are unchanged. This improves simulation responsiveness without changing city outcomes.

## Measured result

Sequential three-sample Node v22.19.0 runs on the same synthetic fixtures produced these medians:

| Map / occupied district | Population | Before month | After month |
| --- | ---: | ---: | ---: |
| 96 / 48 tiles | 30,720 | 109 ms | 115 ms |
| 256 / 96 tiles | 122,880 | 1,747 ms | 1,116 ms |

The dense 256-map case improved about 36%. Small-map results show no clear improvement. A prior exploratory run showed 1,479 ms before and 1,044 ms after; timing varies with runtime warm-up and machine load. These are synthetic simulation measurements, not organically grown-city or browser frame-rate acceptance. Raw samples are in [available-job-targets.json](performance/available-job-targets.json); the reproducible fixture remains `benchmarks/large-city-routing.mjs`.

The index lives for one recomputation and trades some temporary set storage for fewer failed destination checks. Saves remain schema 119; no persistent state changes.

## Validation and feedback

197 regression suites pass. The frozen pre-optimization router still matches every tile and statistic across scarcity, disconnected work markets, bus/carpool, rail/subway competition and dense fixtures. Additional seeded layouts check target exhaustion and iteration order. A separate whole-engine comparison against the pre-change module checkout matches complete serialized cities and statistics through two months on both 96 and 256 maps.

Feedback exercise: load a dense large city and advance several months while inspecting commute, employment and traffic reports. City outcomes should be unchanged, with less monthly processing delay. Browser interaction acceptance remains pending while the Mac is locked. Source milestone only; Sites publication still awaits explicit source-export approval.
