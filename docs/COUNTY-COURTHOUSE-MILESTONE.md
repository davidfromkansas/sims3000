# County Courthouse reward

The reward catalog now includes the County Courthouse. Grow to 25,000 residents with strong approval to earn its offer on the next monthly evaluation. Placement is free on a clear 3×3 lot. The courthouse supplies 135 jobs through the finite commuter pool and reduces nearby crime while powered, road-connected and undamaged. A new procedural masonry building with a colonnade and copper cupola supports all four city views and the rotating reward preview.

The official Prima directory (printed p.410) specifies population 25,000, aura 100, footprint 3×3, price zero, 135 jobs and crime reduction 30/radius 30. Aura is normalized from the manual’s −127…127 range to the existing 0–100 approval model. The crime effect uses linear falloff, matching the reconstruction’s City Hall approach; this curve is tuning. The original separate residential/commercial land-value bonuses are not yet implemented. Crime reduction indirectly improves land value through the existing crime penalty. No direct aura bonus or pollution is added.

Schema 134 introduces the reward. Older cities receive an unearned entry; old saves containing the new building or an earned offer are rejected. Offers remain after conditions decline, and demolition permits rebuilding. The courthouse contributes one job pool regardless of its nine tiles; damage to any member or failed road service removes jobs and crime relief.

Feedback checkpoint: does placing the courthouse near a troubled neighborhood give you a useful new way to manage crime?

Validation: 273 automated suites pass. Focused checks cover eligibility boundaries, monthly offers, free/unique construction, 135 filled commuter jobs, local crime reduction and radius, noncompounding recomputation, damage/road loss, rebuilding and migration. All five reward models pass geometry bounds, four distinct views, caching and production once-per-footprint rendering. The new courthouse’s four raster views were visually inspected offline; browser review remains pending while the Mac is locked. Sites publication remains blocked pending explicit export authorization.

Source: https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide
