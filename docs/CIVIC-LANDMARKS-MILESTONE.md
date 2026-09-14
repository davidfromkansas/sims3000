# Civic landmarks milestone

Players can earn and place a Lighthouse at 15,000 residents and a Historic Statue at 35,000 residents, each requiring the original strong approval threshold normalized to this game's scale. Offers arrive at the next monthly evaluation, remain available, and allow rebuilding after destruction. The rewards dialog includes rotatable original models and placement controls.

The Lighthouse occupies 2×2 tiles, costs §5,000, provides eight jobs and adds 6,000 residential capacity. The free 1×1 Historic Statue provides one job and 10,000 capacity. Both need an intact powered footprint and road access for benefits. Lighthouse placement does not require shoreline. Local value and wellbeing effects stop when the reward stops operating.

Source: [Prima official guide, reward directory p.412](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide). Population, footprints, prices, jobs, capacity, sector value strengths and aura/pollution radii follow the directory. Pollution is divided by 100, aura normalized from the original scale. Land-value falloff radii use the aura radii (8/15) as explicit reconstruction tuning. Zero upkeep is a model assumption because the directory lists no maintenance charge. Original procedural art does not reproduce the original game's artwork.

Save schema 139 migrates missing new reward histories to unearned offers. It rejects new placed landmarks or forged new reward histories under older schemas. No other saved reward is reset.

Validation: focused tests cover unlock boundaries, durable offers, construction price, uniqueness, footprint, active jobs/capacity, neighborhood effects, emergency shutdown/rebuild, old-save migration and all four model rotations. Production rasterizer contact sheet inspected in four rotations. Interactive browser review remains pending because the Mac is locked. Full regression and ordinary-city audit results are recorded below when complete.

Publication remains pending explicit authorization to export this repository to the existing private Sites source repository following automatic approval review rejection. GitHub milestone publication is independently authorized.

Completed verification: 288 suites passed in the full run; the remaining reward fixture assumed every reward was at least 2×2. It was updated to demolish within the actual footprint and passed on rerun (289 suites total). In the existing ordinarily grown metropolis, migration followed by month 547 earned both rewards at 174,424 residents and approximately 98.03 approval. Normal placement charged §5,000 total and added exactly 16,000 capacity and nine jobs, leaving §16,389,458. No population edits or reward grants were used in that playthrough. Snapshot: `/tmp/sims3000-civic-landmarks-built-city.json` (local audit artifact, not committed).
