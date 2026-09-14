# Civic garbage milestone

All eight public-service building types now generate garbage while operating: police and fire stations 2.7 units/month each, hospitals 2.16, schools 3.6, jails 5.76, colleges 5.04, and libraries and museums 1.2 each. Each whole building is counted once, including older single-tile service buildings. This joins their operating footprint to the collection system introduced for reward campuses.

Source: [Prima official guide, table 14-2, pp.216–217](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide). Original structure garbage weights are divided by 100 as explicit reconstruction normalization. Rates are fixed per operating building, not scaled by funding, patients or enrollment. Exact original tonnage and the full waste balance remain unfinished.

Generation uses the same live readiness function as civic service coverage. Strikes, zero funding, power loss, damage and unusable roads stop new generation. Existing waste remains collectable through usable roads beside any part of the footprint, including via local facilities, freight and export. The shared readiness function moved to the footprint module without changing its rules.

Inspecting a service building shows current production and waiting garbage. The utilities report groups totals by service type and shows building counts, operating counts, production and backlog. Garbage contributes to the existing monthly generation and conservation ledger. Save schema remains 141; earlier histories are preserved.

Focused tests cover all eight rates, one charge per footprint, far-side road access, isolated disposal and recovery, suspended-service cleanup, strikes, power loss, damage, demolition/rebuild, saved backlog, older single-tile schools and conserved save replay. The production-scale and empty-map progression audit results are recorded below when complete.

Browser review remains pending the locked Mac. Live Sites publication remains pending explicit repository-export authorization following automatic approval review rejection. Other public structures such as power plants, transit stations and recreation still need their waste rates integrated.

Completed checks so far: all 294 regular suites passed. The empty-map acceptance route was re-baselined for the corrected waste behavior, without changing construction or weakening its checks: month 72 now reaches 6,672 residents, month 96 reaches 5,776, and month 144 reaches 32,128 with §883,460. The updated acceptance test passed with no loans, no backlog, served power/water and exact final-year replay. The earlier 32,296 figure describes the previous waste model.

The existing metropolis completed twelve ordinary months from 561 through 573 with 241.92 additional civic waste units/month, on top of reward and zone waste. Every monthly ledger conserved mass and ended with zero backlog. It finished at 175,080 residents and §16,798,037. Its full city file passed an exact serialize/validate/serialize round trip. Snapshot: `/tmp/sims3000-civic-garbage-city.json` (local audit artifact). This verifies the audited year, not indefinite disposal adequacy.

The full fresh 256×256 acceptance run also passed without changing its construction plan: 151,672 residents in month 345, treasury §14,056,342, no loans, no garbage backlog, fully served electricity/water and an exact city-save round trip. This replaces the older numerical baseline for the tested current code while keeping the original 150,000 target intact. The public-service waste change therefore has both short- and large-city ordinary-construction evidence.
