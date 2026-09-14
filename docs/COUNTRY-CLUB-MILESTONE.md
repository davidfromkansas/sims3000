# Country Club milestone

Players can earn the Country Club at 125,000 residents with strong approval, then place its 5×5 golf-course lot for §25,000. It supplies 75 accessible civic jobs and residential capacity relief of 37,500 while operating. The new original procedural model has fairways, striped greens, flags, bunkers, a pond and a clubhouse in all four map rotations; the Rewards dialog provides its preview and placement controls.

The site improves nearby residential/commercial value and wellbeing. Its air-cleaning effect is accompanied by water pollution, making placement near a water supply a tradeoff. The reward description explains this, and zone inspection attributes its value contribution separately. An intact, powered footprint and nearby usable road are required. Its earned offer survives demolition and destruction; rebuilding is charged again.

Source: [Prima official guide, reward directory p.409](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide). The original population, approval, footprint, price, jobs and residential relief are represented. Sector value strengths are 20/25/0; air cleanup and water pollution are 2,500 over 15 tiles, represented as 25 on this simulation's scale. Aura is 1 over 15 tiles, normalized to the local scale. Value falloff also uses radius 15 as explicit reconstruction tuning. Zero upkeep is an assumption because no maintenance charge was established from this entry. This is not the original game artwork or exact pollution model.

Save schema 140 introduces an unearned Country Club history when older cities load and rejects placed clubs or nonempty club history mislabeled as older saves. Other earned rewards remain available.

Focused tests cover population/approval boundaries, durable offers, construction charge, unique footprint, 75 reachable jobs, capacity, cleanup/pollution tradeoff, value/aura reporting, damage/rebuild, legacy saves and four-view rendering. The production rasterizer contact sheet was visually inspected. Interactive browser review is still pending the locked Mac. Live Sites publication remains blocked pending explicit repository-export authorization following automatic approval review rejection.

Ordinary-city audit: the migrated metropolis earned the offer on its next monthly evaluation, month 548 at 174,424 residents. Four new power-line tiles cost §20; the 5×5 club at (90,85) cost §25,000. All 75 jobs filled, capacity increased exactly 37,500, and 18 residential tiles received direct value benefits. Treasury remained §16,385,711. No reward grants, population edits or funding injections were used. Snapshot: `/tmp/sims3000-country-club-built-city.json` (local audit artifact, not committed).

Full regression: all 291 default suites passed after integration.
