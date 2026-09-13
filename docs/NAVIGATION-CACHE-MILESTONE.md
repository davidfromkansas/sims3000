# Large-map navigation rendering

The navigation map now reuses its terrain and service-ring image while the city simulation is unchanged. Camera outlines and keyboard selection remain live. Construction, recomputation, city replacement, rotation, layer selection and resolution changes rebuild the image. Closing the map skips drawing; reopening uses the latest city state.

A 256 × 256 map previously submitted 65,536 tile fills on every navigation refresh. Camera-only refreshes now reuse one canvas image. The backing resolution is an integer multiple of map size (192 for 48/96 maps; 256 for 128/256 maps), preserving the existing CSS dimensions. This avoids fractional-tile transparency differences between canvas render paths. No save schema or simulation-rule changes.

Validation: all 217 suites passed. Tests verify exact tile-color/position sequences across rotations, 20 camera-only refreshes without new terrain fills, actual construction/recompute invalidation, city/layer/resolution changes, and integral resolution for every supported map size. Browser checks verified layer changes, rotation, keyboard camera navigation and no console errors in the existing paused city.

Browser benchmark on this machine: a 65,536-tile rendering fixture, four rotations and three layers, yielded zero differing channels between uncached and cached whole-pixel images. Median refresh time was 12.57 ms uncached versus 0.64 ms cached, including canvas readback (five batches of ten). This measures navigation rendering only, not full-game FPS, simulation throughput or cross-device performance. Initial cache construction still paints the map once.

Reproduce the browser benchmark by serving the repository root with `python3 -m http.server 4388 --bind 127.0.0.1` and opening `/tests/browser/navigation-benchmark.html`. It does not touch city storage. Timing depends on the browser and machine; regression tests use operation counts rather than brittle speed thresholds.

Feedback checkpoint: pan and rotate a large city with the navigation map open, then switch service layers and verify map changes stay responsive.

Source only; Sites publication remains pending explicit export authorization. Dense-city whole-frame profiling remains required.
