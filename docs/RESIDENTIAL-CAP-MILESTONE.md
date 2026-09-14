# Residential growth capacity

Residential development now needs room under a citywide population cap, in addition to demand, land value and services. The base is 25,000. The zone-development report includes population, total capacity, remaining room and a grouped breakdown of contributing buildings. Individual stalled sites explain capacity as a growth constraint.

Supported relief: small park 250; large park 2,250; fountain 250; pond 1,000; playground 1,000; marina 9,000; zoo 24,000; sports park 4,000; operating library 7,000; operating City Hall 9,000; operating stadium 125,000. Multi-tile facilities count once. Damaged recreational sites and inoperative civic/reward facilities cease contributing. Library operating requirements and existing reward service requirements are reconstruction choices.

Source: Prima Official Strategy Guide pp.163–165, https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide. It describes a 25,000 residential base and additive recreation relief. This milestone does not implement commercial/industrial caps, every original reliever, or original demand formulas. Other existing recreation demand modifiers remain calibration.

Positive residential demand is limited to zero at capacity. Existing residents are not forcibly removed for exceeding capacity, including cities loaded from older saves. Other poor conditions can still cause abandonment. Each monthly growth decision checks the population increment; a 2×2/3×3 new building needs room for all its residents. Smaller footprints can develop when a larger one will not fit. Capacity changes as households grow or leave during the month. Derived capacity is recomputed on load; schema remains 127.

Validation: the focused regression runs a real 96×96, 25,000-resident city through the monthly simulation, checks cap enforcement and no overshoot, then verifies a park restores capacity and positive underlying demand. Other checks cover four-tile growth costs, recreation damage, save/load, City Hall operation and report output. Browser review confirmed the expanded report at 224/26,000, with four small parks contributing 1,000; no city time was advanced. All 249 regression suites passed.

Feedback checkpoint: open City desk → Zone development and expand Residential growth capacity. In a large city near the limit, add recreation or an earned City Hall, then inspect the new capacity and allow growth if jobs and services are available.

Sites remains at version 150 pending explicit source-export authorization.
