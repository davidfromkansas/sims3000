# Stadium districts and match-day activity

Operating stadiums now create local pollution and crime pressure, reduce nearby residential land value, improve nearby commercial value, and add a small direct aura benefit. The earlier uniform amenity bonus is removed. Their existing 200 jobs, residential demand bonus and 125,000-resident capacity relief remain. Reward and inspection text explain the neighborhood tradeoff.

A cosmetic match appears on an operating stadium’s pitch. Two small teams and a ball move on the existing scenery clock; pause and modal/background holds retain the current positions. Reduced motion or disabled scenery animation uses a static formation. Utility layers hide the activity, and loss of power, road access or any footprint tile stops it. This is operating-state indication, not a separate sports simulation.

The existing Canvas renderer draws the activity with no added animation library or timer. Cached stadium depth buffers mask the moving pixels behind stands and other structures in every camera direction. No keyboard control receives a transition. Match geometry is original artwork and does not affect city simulation or saved state.

## Source and approximations

[Prima guide, printed page 416](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide) lists land-value effects −20/14/0, air 1,500 within 15 tiles, water 2,000 within 15 tiles, crime 20 within 16 tiles, aura 2 within 20 tiles and 200 jobs. Pollution is divided by 100 and aura is normalized to the game’s 0–100 scale. Linear spatial falloff, a 16-tile land-value radius and police mitigation are reconstruction tuning. Existing upkeep and demand coefficients remain approximate.

## Verification and feedback

Focused checks cover neighborhood effects, policing, damage, radiation, save reconstruction, all four match projections, depth masking, scenery controls and repeatability at a paused clock value. All 286 default suites pass after updating two renderer fixtures for the optional match-state argument. Eight rasterized views show two moments from every rotation. The ordinary metropolis placed its earned Stadium for §75,000, filled 200 jobs, enabled match activity and reached residential capacity of 481,000. Browser motion feel and large-city frame performance remain unverified while the Mac is locked.

Feedback focus: place an earned Stadium away from sensitive housing, inspect its operating effects, then run and pause the city while viewing the pitch. Check the scenery-animation setting and reduced-motion preference. Save schema remains 136. Sites export/publication still awaits explicit authorization after automatic approval review rejected it.
