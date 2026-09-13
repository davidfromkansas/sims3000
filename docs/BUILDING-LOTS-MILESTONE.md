# Larger RCI building lots — integrated source milestone

The integrated milestone is complete in source with 161 passing regression suites and save schema 109. The implementation checkpoints below retain development history; the final checkpoint supersedes their pending work. Sites publication and browser acceptance remain pending their separately requested approvals.

## Evidence and scope

The manual describes replacement buildings by tile size and requires a replacement to match the queried building's tile size (printed pp.73–74; extracted manual lines 2572–2599). Building Architect also starts by selecting a tile size (p.140). The manual does not expose original lot-growth selection algorithms or per-footprint occupancy formulas.

Implement coherent rectangular RCI buildings with shared identity and lifecycle. Preserve the existing per-tile population, jobs, tax, pollution and utility accounting across their members, rather than multiplying capacity accidentally at both root and member level. Describe this as reconstruction tuning, not recovered original formulas. Farms, airports, seaports and fixed civic/power/recreation footprints already have distinct lifecycle rules and must remain separate.

## Current foundation

`dist/building-lots.js` provides read-only candidate lookup, atomic lot formation, rectangular/root validation, shared lifecycle updates, member lookup and dissolution. Groups use a `lotRoot` input on members and a derived `buildingLots` map on the city. The module supports rectangular dimensions up to four tiles per side; production growth currently tries 3×3 for dense zoning and then 2×2 for medium/dense zoning, falling back to a single tile if no rectangle qualifies. This is an explicit reconstruction choice. Candidate formation currently requires vacant, matching medium/dense zoning, flat land, road access, power and water on all members. Existing occupied buildings are not silently consolidated.

`node tests/building-lots-foundation.test.mjs` passes: all four map sizes and three RCI sectors, 3×2 rectangular footprints, root uniqueness, shared lifecycle updates, atomic rejection, obstacles/utilities, malformed groups and dissolution. These fixtures deliberately prepare simulation inputs; they do not prove normal game growth, saved continuation or user interaction. The foundation and lifecycle tests are now included in the branch test command. The last merged release still contains 157 suites; this branch has 160.

## Required before this milestone can merge

- Integrate formation into the real growth loop. Process a group once and synchronize age, stress, level, abandonment, historical state and clean-industry conversion. Existing single-tile cities must continue unchanged unless new qualifying zoning develops.
- Add versioned save fields and strict group validation before normalization; derive maps on load. Cover legacy migration, worker structured clones, construction undo, named saves and custom challenge start-city export/replay.
- Make whole-building demolition and historical designation work from any member, with deduplicated preview/cost and full-footprint fire protection. Density changes and de-zoning must not tear a building apart. Preserve underground networks when appropriate.
- Extend fire/disaster destruction, toxic evacuation and radiation handling to maintain group consistency and count displaced occupants exactly once. Review every direct level mutation, not only the growth loop.
- Render each building once at its footprint center from the correct depth-order tile; preserve picking, query, missing-service indicators, building visibility, overlays and snapshots. Support all camera rotations and map sizes.
- Query any member as one building: report dimensions and total occupants/jobs, and describe local service coverage clearly. Counts of buildings in scenario queries must count roots; population and capacity metrics must still count occupants/jobs across members. Spatial building queries need a documented anchor/intersection rule.
- Extend the replacement/designer library to carry tile size and enforce matching footprints, as the manual requires. Do not silently stretch a saved one-tile custom building over a larger lot or allow a replacement to alter simulation capacity.
- Add real playthrough tests for formation, upgrades, abandonment/recovery, demolition, historical protection, fire/toxic/radiation handling, save/replay, replacement and four-view rendering. Run the full regression set after integration. Inspect an offline visual fixture; browser acceptance remains separately pending authorization.
- Update the user feedback milestone, fidelity audit, release graph stamp and schema only when the integrated behavior is ready. Commit, PR and merge once for the playable milestone under the user's standing GitHub authorization. Sites publication remains blocked pending explicit source-export approval.

## Known integration locations

- `dist/engine.js`: tile initialization, `recompute`, `planBuild`, `build`, growth/abandonment in `tick`, `validateSave`.
- `dist/industry.js`: `normalizeIndustry`, per-tile clean conversion and farm exclusion.
- `dist/emergency.js`: `destroy` and `contaminate`; `dist/toxic-cloud.js`: per-tile evacuation.
- `dist/historical.js`, `dist/save.js`, custom scenario starting-city serialization/replay.
- `dist/renderer.js`: ordinary zone branch; `dist/app.js`: `showQuery`.
- `dist/building-art.js`, `dist/building-designs.js`, building designer/replacement UI and portable file validation.
- `dist/scenario-metrics.js`, `dist/scenario-structures.js`: building counts and area semantics.

Preserve the unrelated untracked `tests/scenario-comparisons.test 2.mjs`.

## Integration checkpoint — lifecycle completed, presentation pending

The branch is at save schema 109 (release graph stamp deliberately remains unchanged until the complete milestone is ready). New tiles store `lotRoot: null`; schema 108 and earlier saves migrate to single-tile buildings. Strict lot validation runs before normal recomputation, and derived Maps are rebuilt on load. Embedded challenge snapshots accept the historical key table and migrate through the same validator.

The real growth loop forms a lot only when a successful growth roll encounters a complete eligible rectangle. Members retain distributed capacity but share age, stress, upgrades, abandonment and historical state. Industrial clean conversion is shared. Bulldozing any member clears the whole footprint while retaining zoning and underground networks; a drag crossing multiple members charges once per building. Re-zoning or de-zoning a larger building requires demolition first. Fire on any member protects the whole group from construction or historical edits.

Fire destruction dissolves and destroys a group once, counts one destroyed building and totals displaced residents across all members. Toxic exposure evacuates the entire group and preserves its abandoned identity. A radioactive strike destroys the whole affected building; radiation remains limited to the existing radius rather than spreading over the entire footprint.

`tests/building-lots-lifecycle.test.mjs` passes with real seeded 3×3 growth (72 residents across nine members), twelve months of deterministic saved continuation, corner-based historical edits and demolition, deduplicated cost, retained pipes, exact disaster displacement, starting-city replay and old snapshot migration. The actual simulation worker handler was exercised with structured-cloned 96×96 input/output: it preserves the derived Map, matches direct ticking, and leaves the visible source city unchanged. The foundation test also passes after integration.

All 157 pre-existing regression suites passed against these runtime edits. The two new suites pass in targeted runs. No browser tests, release commit, PR or publication has occurred for this milestone.

Next: renderer draws each lot only once; queries aggregate lot details; scenario counts count roots with explicit area semantics; designer/replacement files enforce tile-size matching. Complete these and their integration checks before changing the release docs/counts/stamp and merging.

## Presentation checkpoint — basic rendering and queries completed

`dist/building-lot-view.js` computes one depth-order draw tile for a rectangular footprint in all four rotations and produces a shared building report. Any member opens that report with dimensions, total residents/job capacity, tile-based electricity/water/transport coverage, total waste, average land value and pollution. The actual query's historical checkbox applies to the entire lot and preserves the normal undo/save/update flow.

The renderer currently draws the root's default zoned sprite once at the footprint center, scaled by mean width/height, with an aggregate missing-power indicator and historical/abandoned marker. Off-screen vertical margins account for the lot size and root artwork. This is a provisional default-art presentation: legacy 1×1 replacements/custom designs are intentionally not stretched over larger lots. A footprint-matched renderer/library is still required before release, particularly to render rectangular models with the correct aspect ratio. Do not present the current scaled default sprite as final geometric fidelity or new four-view RCI art.

Scenario developed/abandoned/clean-industry building counts now count roots. Area checks use the northwest origin, matching existing fixed-footprint structure counts. Occupied homes lacking power or water count a building once if any member lacks the service. Capacity and population accounting remain distributed across members. The scenario editor explains this distinction.

The new `tests/building-lots-view.test.mjs` exercises rectangular placement at large-map coordinates across all rotations, exact shared report content, aggregate residents, real renderer single-draw behavior and missing-power markers, root-based scenario area counts and actual query/historical handlers. All 160 branch suites passed. A subsequent root-art culling correction and historical-handler test passed targeted larger-lot and city-view visibility reruns.

## Next implementation: footprint-matched customization

The existing library uses numeric style keys (14 slots) and portable format versions 1–3 implicitly mean 1×1. Preserve those meanings. Extend keys to distinguish source style AND footprint, so changing a 1×1 style cannot alter a 3×3 building. Add explicit validated dimensions to new portable files, with a version that supports tower, block and material designs; legacy files remain 1×1. Reject mismatched application atomically.

Designer selection needs both style and footprint, with clear import behavior and unchanged drafts until Apply. Replacement UI should count roots of the matching style/footprint, retain original-style fallback and support returning to the queried lot. `baseZonedSprite` must use root coordinates for member identity if any member reaches the replacement/designer flow.

For custom rendering, normalize model X/Y by footprint width/height and largest side before projection, then scale the cached canvas back to the lot's extent. Preserve physical floor height instead of multiplying it with lot area. Both parameterized towers and block/material models need the same transform, including rectangular rotation. Keep cache memory bounded; do not allocate a large bitmap per lot tile. Build and inspect offline model fixtures before the final full regression run and milestone PR.

## Final integrated checkpoint

Footprint-scoped style keys preserve legacy numeric 1×1 slots and use explicit dimensions for larger lots. Portable building format 4 carries validated dimensions for tower, block and material designs; versions 1–3 remain 1×1. The designer offers independent style/footprint selection, preserves drafts until Apply and rejects mismatched imports without losing the draft. Replacement queries count matching building roots, apply/revert only that footprint and preserve capacity and costs.

Larger lots now draw original procedural residential/commercial models and block-based industrial complexes once from the depth-order member, centered over the footprint. Shared projection scales the two ground axes independently and preserves physical floor height. Rectangular block columns sort by projected depth. Legacy custom models are never silently enlarged. Cache remains capped at 64 canvases. These are authored models, not the original game's building collection.

All 161 suites passed after renderer integration. Subsequent targeted checks also pass for actual replacement handlers and a real outage/recovery playthrough: demolishing the power source abandons the entire building after four months; rebuilding it permits coherent recovery. Existing saves, worker transfer, challenge replay, disaster displacement, any-member historical designation and demolition are covered. The offline 20-view contact sheet `previews/building-lot-models.png` was inspected. No browser test or live publication is claimed.


## Working follow-up: service and station building counts

Local source now counts a multi-tile occupied residential building or workplace once in civic-facility and station inspection reports. Any reached member identifies the building, including when its origin is outside the station walking range. Resident/job totals still include only the reached members, preserving the actual service and transport simulation. Report text explains this distinction. This corrects presentation inherited from single-tile zoning; it does not alter routing, capacity or simulation coefficients.

Validated with the new lot-service-counts suite (48/96 maps, full and partial catchments, origins outside the range, disconnected and abandoned lots, read-only reports and save restoration), plus the existing civic-facility-inspection and station-inspection suites. These three suites pass. The release command now contains 175 suites; the most recent full release run remains 174. This follow-up is uncommitted and not live; retain it for the next milestone-sized release.


The working service-count follow-up above is now included in the education service planning release. See [education service maps](EDUCATION-SERVICE-MAPS-MILESTONE.md) for the combined milestone and acceptance exercise.
