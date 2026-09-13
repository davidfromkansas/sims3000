# Dense-city frame geometry

The main renderer now reuses tile projections and depth ordering while camera and recomputed city state remain unchanged. At a 960 × 540 viewport and 65% zoom, the dense 256-map fixture previously prepared 13,689 candidates on every frame. Buildings, data colors, vehicles and effects still run through their normal drawing paths; this cache contains geometry, not the rendered city image.

The cache is replaced after pan, zoom, rotation, viewport size, candidate bounds, city/tiles, projection methods or recomputed statistics change. Terrain elevations therefore update after normal simulation recomputation. One cache belongs to each renderer and is replaced rather than accumulating camera views. No save or simulation-rule changes.

All 218 suites passed. New tests compare the exact former projection/sort output across all four map sizes, four rotations and four zoom levels, including elevated terrain. Twenty unchanged animation frames add no projection calls. Camera, terrain, city and empty-view invalidation are covered.

A browser rendering fixture with loaded artwork matched every pixel between fresh and reused geometry in 12 camera cases. Seven-sample median JavaScript/canvas submission times on this machine were:

| Rotation | Zoom | Fresh geometry | Reused geometry |
| --- | --- | --- | --- |
| North | 65% | 7.1 ms | 4.6 ms |
| East | 65% | 5.8 ms | 4.3 ms |
| South | 65% | 7.9 ms | 6.7 ms |
| West | 65% | 7.9 ms | 6.5 ms |
| North | 120% | 2.4 ms | 1.8 ms |
| North | 200% | 2.1 ms | 0.9 ms |

These are stationary rendering measurements with animations disabled, not sustained FPS or simulation throughput. Camera moves and simulation updates still prepare fresh geometry. Browser screenshot inspection and console checks passed. The fixture does not use city storage.

Reproduce by serving the repository root on localhost and opening `/tests/browser/city-render-benchmark.html`; wait for artwork, then measure. Pixel comparison uses the actual main renderer. Timing is informative rather than a fixed test threshold.

Feedback checkpoint: watch a dense city's animation while stationary, then pan, rotate and edit terrain to check that the view remains correct.

Source only. Sites publication still requires explicit export authorization. Whole-game simulation and sustained frame-pacing acceptance remain incomplete.
