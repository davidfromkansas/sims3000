# Reward building inspection — milestone 4 visual checkpoint

City desk → Rewards now lets players inspect and rotate the Mayor’s House, Stadium and University before earning or placing them. Each preview has four distinct views. Existing placement controls, eligibility descriptions and benefits remain in the panel.

The actual city renderer now uses these same original depth-rasterized models. A Mayor’s House has a columned porch, wing, paths and garden; the stadium has stepped open stands, playing-field markings, scoreboard and floodlights; the university has a courtyard, teaching wings and clock tower. Multi-tile buildings draw once at the footprint center in each camera rotation. Layer fading and building visibility retain the existing renderer rules.

All twelve views are generated from authored geometry and cached on first use. They need no external models or runtime network calls. This adds approximately 12 MiB of canvas pixel storage once every view has been inspected; the cache is bounded by three types and four camera directions. No continuous animation or new timers are introduced. The original Imagegen artwork remains elsewhere in the city.

Unlocks, costs, upkeep, construction footprints, operating conditions and simulation benefits are unchanged. Schema114 remains sufficient and older cities gain the models automatically. This is original artwork improving the playable reward experience, not recovered original game graphics or completion of the full reward catalog.

Validation: inspect the twelve-view contact sheet in [reward-building-models.png](previews/reward-building-models.png). Automated tests check bounded geometry, distinct deterministic rasters, cache reuse, real earned placement/save/monthly continuation, and the actual renderer’s once-per-footprint placement through four rotations. Actual Rewards panel handlers rotate without mutating the city and retain placement selection. Browser visual and interaction acceptance is still pending: computer use reported that the Mac was locked.

Feedback exercise: open Rewards, rotate each preview, earn or script an offer, place the building, then rotate the city. Assess recognizability, detail at ordinary zoom, and whether the panel preview makes placement more satisfying.

This source milestone is not hosted. The separate Sites source-export rejection still needs explicit authorization; no deployment was retried.

Full regression result: 186 suites passed. Cache graph: reward-building-models-1.
