# Large electrical grid performance

## Player-visible improvement

Power allocation no longer calculates each tile’s nearest source repeatedly inside every sort comparison. Sparse grids compute the distance once per consumer; dense multi-source grids use an exact two-pass Manhattan distance field. Construction recalculations and simulation months use the same improved allocation path.

Allocation order, equal-distance ties, capacity-limited blackouts, power trade entry points and electrical connectivity are unchanged. No simulation rule or save schema changed. Small disconnected grids use storage proportional to their consumer count.

## Evidence

The same synthetic 256 × 256 fixture with 65,536 tiles and 484 generators was recomputed three times before and after the change on this machine. Before: 1,689 / 1,411 / 1,357 ms. After: 950 / 510 / 415 ms. The median improved about 2.8×, with an identical SHA-256 digest of the complete JSON city state: a343260a32992510e63c6d0b56e4b61d6379f86cfa8010997628fd2ae3d8d5ba. Run `node scripts/benchmark-power-grid.mjs` to reproduce the current fixture; timing varies by machine and load.

The browser worker fixture completed one month on 65,536 tiles in about 4.8 seconds with `background: true`. The interface accepted a button click while the month was running, and the original city remained at month zero until the returned city reached month one. This is a synthetic stress city, not balanced-city gameplay or sustained FPS acceptance.

Regression coverage compares the exact legacy order on sparse and dense grids from 8 × 8 to 256 × 256, absent/single/many sources, shuffled ties and limited-supply selection. The full regression outcome is recorded in CURRENT-FIDELITY.md.

## Feedback checkpoint

Continue building a larger city with several connected power sources. Compare construction response and month completion while panning, zooming and inspecting neighborhoods. Check blackout maps near capacity limits. This improvement does not establish that all large-city systems are fast enough; routing, full-month throughput and rendering still need broader acceptance.

Local benchmark page: `tests/browser/power-grid-benchmark.html`, served from the repository root. It never accesses saved cities. Save schema125 is unchanged. GitHub and local preview receive this milestone; Sites publication remains pending source-export approval.
