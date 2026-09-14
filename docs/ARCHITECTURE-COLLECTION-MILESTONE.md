# Architecture collection — in progress

The intended player change is a broader choice of coherent building styles across city districts, with consistent camera rotations, matching lot footprints, working customization and reusable saved building sets. This release is not complete; the full architecture and landmark scope in the roadmap remains outstanding.

The initial 1–4 tile implementation introduced Limestone office block, a six-story commercial model rendered in Blender. It has native geometry for all 16 supported 1–4 tile width/depth combinations. Facades gain window bays as lots expand; story height and entrance details are not scaled up from a one-tile sprite. Each footprint has four views. Blender coordinates use game X and negative game Y; the rendered model turns by negative 90 degrees for each positive game-camera rotation.

Views load on demand, share crop bounds and stay in a rendering cache outside city saves. The renderer draws one building per lot, aligns its footprint with the ground, restores opacity, and gives saved custom designs priority. A matching procedural model remains visible during artwork loading. The replacement picker updates asynchronously without replacing a newer selection or a closed dialog.

Save schema 145 identifies the new style. Earlier saves continue to load; a file claiming an earlier version cannot contain new-style replacements or custom slots. Focused tests verify matching view selection, one-time decoding, common bounds, one draw per rectangular lot, footprint anchoring, unchanged city finances/population, custom priority and save continuity. All 301 regular regression suites passed. All 64 native renders passed transparency and clipping checks; their common crop metadata avoids pixel scanning during play. Browser checks applied the new style to 215 commercial buildings in a paused 204,544-resident city, with unchanged visible funds and population, and reviewed all four city rotations. A separate imported visual fixture covered one single-tile building and 15 multi-tile buildings across all supported footprints; the rotation sweep showed native rectangular geometry following the lot orientation. The fixture was saved through the game and reopened; the inspector retained the 3×3 lot and its selected Limestone office block replacement. These are functional and visual checks, not a performance benchmark.

Original model source and renders are under `art/architecture/commercial-midrise`. The earlier Imagegen sheet was rejected for inconsistent views and colored edge artifacts; it remains a reference rather than production artwork. Browser QA found and fixed a first-load preview exception: the procedural fallback now uses canonical building-slot keys, including the single-tile case. A focused regression covers that case. Additional architectural styles, catalog coverage, broader game-scale visual review, renderer performance and player feedback are still required before completing the broader release.

## City-wide building manager

Manual printed pages 79–81 describe selecting current or future building styles, filtering by type and footprint, and clearing the entire replacement set. City desk → City building styles now exposes those flows for the supported RCI catalog. Players can see the original and current appearance, count affected buildings, select a style before it develops, preview replacements, and return to the same filters after applying. Natural source styles are distinct from alternate replacement artwork. Saved custom slots remain represented in the catalog.

Restore all original artwork offers a backup action and confirmation, then clears replacements and custom models across every footprint. Import building set remains available from the manager. At this checkpoint, rewards, opportunity buildings and 5×5 customization were not supported; the five-tile expansion below supersedes the footprint limit.

Browser QA filtered to a nonexistent 2×3 residential mid-rise, applied Courtyard apartments, and verified the changed catalog entry with zero current buildings. Canceling the global reset preserved it. Confirming reset also removed commercial replacements in other footprints; the 3×3 commercial inspector catalog returned to original artwork and the reset button disabled. No browser errors were recorded in that playtest. Building-set tests cover filtered future-style entries, current counts, custom-model labels, unchanged simulation, atomic import and complete reset. The full 301-suite run above predates this manager addition; relevant building-set and directional-art tests pass after it.

## Independent replacement preview

Replacement previews now have clockwise and counterclockwise controls. The new office art, multi-tile procedural models and saved custom models rotate without moving the city camera or changing a save. Single-view legacy artwork is explicitly labeled and its rotation controls disabled when it is the selected replacement. Asynchronous image completion respects the current choice, orientation and dialog lifetime.

Browser checks cycled North, East, South and West and observed four distinct office preview images, then reversed direction. The directional-art regression also verifies that a preview orientation override leaves the renderer camera unchanged. An already-applied custom model disables the apply button until another supplied style is selected, preventing a preview-only visit from replacing the visible custom design with underlying stock artwork.

The custom-model browser check applied a tower design, opened it in the replacement manager, verified the apply button disabled, rotated and canceled, and confirmed the catalog still showed the custom model. Selecting legacy supplied artwork re-enabled applying and displayed fixed-view controls. No browser errors were recorded.

## Native industrial artwork

Sawtooth factory (existing style 79) now uses separately authored Blender geometry: brick walls, framed windows, loading doors, north-light roof bays and an asymmetric chimney. All sixteen supported footprints have four native views. The generalized staging script validates and records all 64 factory images before installation. Office and factory art now total 128 directional images; this count measures views, not distinct building designs.

The mixed-factory view preference now includes multi-tile low-rise dirty industry. Root and member tiles select the same deterministic appearance, and explicit replacements/custom designs retain priority. Clean industry and farms remain excluded. The style already existed in saves, so this visual upgrade does not add another save schema.

A browser fixture with one single-tile and fifteen multi-tile industrial buildings was imported and reviewed through a full rotation sweep. Roof orientation, rectangular lot alignment and the chimney remained consistent; no browser errors were recorded. Focused factory-art, directional-loading and building-lot renderer tests pass, including multi-tile variant consistency and explicit replacement priority. Broader visual/performance acceptance remains to be checked before releasing the architecture collection.

## Ordinary industrial playthrough

The normal 48×48 starter town ran for twelve monthly simulation steps without editing occupancy, finances or development levels. At month 12 it had 280 residents, §43,480 and three occupied factories selecting the new mixed artwork. The save was imported into the isolated browser preview. Tile 30,26 showed connected electricity and transport, twelve jobs and light development. The browser then ran at normal speed from January to September 1951, retaining 280 residents and reaching §44,116 before being paused. This verifies ordinary play alongside the earlier artificial footprint review; it is not a large-city performance measurement or a claim that the starter’s utility problems are solved.

The expanded full regression run found a stale replacement-UI expectation that applied the hidden stock style over an existing custom design. That test now asserts preservation during preview/disabled apply, followed by an explicit selection enabling a replacement. The corrected focused test and all 301 suites in the full rerun passed. The ordinary browser playthrough recorded no runtime errors.

## Five-tile customization

Manual printed page 81 includes footprint filters through 5×5. The editor and city-wide manager now offer all 25 combinations of 1–5 tile width and depth. City schema 146 supports larger RCI lot validation and saved customization; older saves remain loadable, while files claiming older schemas cannot contain five-tile slots or lots. Building-file version 9 carries five-tile models, including their layered shapes and surface data; files with smaller footprints retain existing format versions.

Focused checks cover a complete 25-member lot, model export/import, layered-shape round trips, invalid older-format rejection, city save restoration, ordinary monthly continuation and whole-lot demolition from the far corner. Projection bounds cover 5×1, 1×5 and 5×5 in every camera direction. In the browser, a 5×5 custom model was created, applied, saved and reopened through the filtered library with the custom artwork intact. A stale cached module caused the first reload to fail; the architecture asset version was advanced to load a consistent module set, after which the editor and restoration checks succeeded.

All additional renders completed, and both assets passed staging validation across 25 footprints and four views each: 200 images representing two building designs. Validation checks RGBA dimensions, visible/transparent pixels, unclipped margins and shared crop bounds. All 301 regression suites pass for schema 146. An imported 50-building visual fixture was reviewed from North, East and South, including inspection of a 5×5 factory with 25 occupied tiles. This artificial fixture tests rendering, not ordinary city development. The expanded West-facing screenshot and final browser error check remain pending: computer-use access on September 15 reported that the Mac is locked. The isolated QA server was stopped. Earlier complete four-view acceptance applies to the 1–4 tile set.

## Draw-order cost for larger buildings

`buildingLotPlacement` now selects the frontmost rectangle corner directly for the current quarter-turn rotation, replacing an allocation and full member sort on every footprint tile. The selected tile and centered draw position are unchanged. Regression compares against the previous sorted painter-order definition across all 24 multi-tile width/depth combinations, four rotations and 48/96/256-tile maps.

A local warmed microbenchmark used seven paired samples of 12,500 placement calls on a 5×5 building, verifying equal draw-position checksums. Median time was 29.22 ms for sorting and 0.15 ms for direct corner selection. This measures the placement helper only; it does not establish whole-game frame rate or large-city responsiveness. Existing actual-renderer and directional-art tests pass after the change.

The version-9 portable-model check now combines all 24 occupied layers, per-column materials, 12,000 painted surfaces, 12,000 detail entries and 2,400 shaped-block entries in a 5×5 footprint. Exact export/import round trip passes and the resulting file stays below 32 KB. This verifies that the expanded format retains the complete supported editor data, not only simple tower parameters.


## Artwork loading recovery

Failed image loads retain procedural artwork and retry on a later draw or preview request after a five-second cooldown. They do not issue another request every frame. A city renderer joining an in-flight request originally started by a replacement preview now subscribes to its completion, so paused cities also refresh once the artwork arrives. Each renderer subscribes once per request; the cache uses weak membership and remains outside saved game state.

Focused regression simulates a preview request shared by two city renderers over 120 frames, confirms only four image decodes, and verifies both renderers request redraw on completion. A separate simulated outage checks the cooldown and recovery. These loading checks pass after the full 301-suite run; browser network-failure injection has not been performed.


## Full-footprint library view

The manager now opens with all widths and depths visible, with a footprint column distinguishing each original style’s slots. Either dimension can be narrowed independently or reset to All. The filtered count includes its full-catalog denominator, following the manual’s printed page 81 selection-count behavior. Fourteen natural source styles across 25 footprints produce 350 slots; these are explicitly labeled building slots, not 350 distinct architectural designs. Configured alternate-source slots remain represented. Replacement selection and returning from it preserve the current filters.

Building-set checks verify unique all-footprint slots, custom models and replacements across different sizes, independent width/depth filtering and equivalence with filtering the complete catalog. Existing appearance-only import, save restoration and monthly-continuation checks pass. Browser interaction and layout acceptance for this expanded list remain pending while the Mac is locked. Reward/opportunity categories and full original catalog coverage remain unfinished.


## Hold-to-compare replacement preview

Manual printed page 77 describes holding the Peek-a-boo tab to reveal the original building, then restoring the replacement when released. The replacement dialog now offers Hold to view original in the selected preview area. Pointer capture supports release outside the control; cancellation, lost capture, keyboard release, Escape and focus loss restore the selected appearance. Space and Enter provide keyboard access, and the control reports its pressed state. Selecting another style clears comparison. Preview updates ignore a dialog that has been replaced, and asynchronously loaded artwork respects an active comparison.

Actual dialog-handler checks verify pointer hold/cancellation, Space release, Enter/focus loss and unchanged serialized city/custom model state. The existing footprint, save and replacement tests pass. Browser interaction/layout acceptance remains pending; the control uses a labeled button instead of reproducing the original folded-corner decoration.


## Custom-file replacement drafts

The replacement dialog now imports portable SIMS3000 building models directly, allowing rotation and original-art comparison before applying them across the selected style/footprint. Imported artwork remains an in-memory draft; Cancel leaves saved artwork untouched. Imports enforce the existing 32 KB size limit and exact footprint match. A failed import preserves the preceding valid draft, while request identity prevents an older file read or canceled dialog from installing a stale result.

Actual handler checks cover matching import, wrong-footprint rejection, draft preservation, explicit application, comparison/rotation without city mutation, out-of-order reads and cancellation during a pending read. The footprint/save suite passes. This removes the designer detour for importing a replacement; the manual’s separately managed multi-building Active List (printed pages 82–84) remains unfinished. Original SimCity building-file compatibility and browser acceptance remain outstanding.


## Reusable custom-building list

The replacement dialog now includes a saved custom-building list based on the manual’s Active List workflow (printed pages 82–84). Players add the previewed custom model, preview compatible saved models, remove entries, confirm replacement of duplicate names at the same footprint, save list edits, or discard them. List edits are staged independently of city artwork. Closing the dialog drops unsaved list edits. Removing a saved entry leaves already-applied city models intact.

The list persists up to 100 validated portable models in this browser, shared by cities on the same site origin. It does not sync to another browser; applied models remain in city saves and the designer’s building-file export supplies portable backups. Saved data is versioned, bounded and checked for duplicate identities and invalid models. Storage failures retain the editable draft, while an unreadable list is reported without overwriting it.

The new focused suite verifies persistence, invalid data, duplicate confirmation, independent preview copies, staged add/remove/reset, explicit save and quota failure recovery. Existing replacement/footprint handler checks also pass. It is registered in the main regression command; the last complete run predates this addition. Browser acceptance and a top-level list editor accessible outside a replacement remain outstanding, alongside reward/opportunity replacements and the wider catalog.


## Standalone list editor

City building styles → Edit custom building list now opens the reusable list independently of a replacement slot. Any supported footprint can be imported and previewed, with left/right rotation, named footprint information and explicit add/save controls. Returning to city building styles retains its filters. The existing replacement panel still restricts saved-model selection to matching footprints.

The list suite now exercises the actual standalone editor handlers: a 5×5 import, rotation, addition without persistence, explicit save, and leaving while another file is still being read. All pass. The earlier note that a top-level list editor was outstanding is superseded by this implementation; browser layout and interaction review remain pending.


## Integrated regression checkpoint — September 15

The complete `npm test` command finished with exit code 0 and 302 PASS records on architecture-collection-9 / city schema 146. This includes the all-footprint manager data, replacement comparison and import handlers, directional request sharing/recovery, standalone custom-building editor, reusable list storage and the existing simulation/save/late-game regressions. The logged temporary asset-outage warning comes from the deliberate recovery test. All relative static module imports also resolve.

No broader browser acceptance is inferred from this run. A fresh computer-use attempt still reported the Mac locked. The expanded West-facing fixture review and the new library/editor browser flows remain pending, as do the architecture catalog gaps. This is an integrated validation checkpoint within the unfinished architecture release, not a new release or publication.


## Native courtyard apartments

Existing replacement style 78 now has an original four-story apartment model with terracotta masonry, limestone surrounds, balconies, a planted open-air courtyard, entrance passage and asymmetric stair enclosure. All 25 footprints have four rendered views. A first-render facade transform error was found visually and corrected before the footprint batch; the accepted 1×1, 1×5 rear and 5×5 west views were inspected. All 100 images passed staging validation.

The shared directional registry integrates the new apartment views alongside the office and factory models, bringing native directional artwork to three distinct designs and 300 rendered images. The existing saved-custom-model precedence and footprint anchoring remain in effect; this upgrades an existing replacement style without changing simulation or save schema. Browser play/rotation review remains pending. The full 302-suite run predates this art addition; focused directional and footprint tests are the post-change checks.


## Revert remains a preview until applied

Manual printed page 77 places Revert before the final checkmark and states that Cancel leaves the city unchanged. The replacement dialog now follows that order: Revert selects original artwork in the preview, while Apply performs the city-wide restoration. Cancel preserves the existing replacement or custom model. Revert enables when the selected preview differs from the original and disables after selecting the original. Reverting also invalidates pending file reads so late imports cannot replace that choice.

Actual dialog-handler checks verify deferred restoration, explicit apply, custom-model preservation after revert/cancel and unchanged serialized city state during preview. The footprint suite passes after this correction. Browser review remains pending; a fresh computer-use check again reported the Mac locked.


## Transactional city-wide replacement set

The manager now follows the manual’s final-checkmark/Cancel behavior across multiple building selections. It edits copied appearance maps while retaining the city’s existing simulation for counts and previews. Selecting replacements, importing a set and confirming a whole-set reset update that draft. The final Apply building set validates and installs both appearance maps, then invokes normal city persistence; Cancel discards the draft. Filters and draft choices survive visits to the individual replacement or custom-list editor. Independently saved browser-library entries remain separate from city artwork.

The replacement and import dialogs identify manager-draft actions explicitly. Direct access to the standalone set importer retains its existing apply-to-city behavior. Actual manager-handler tests verify imported-set cancellation/application, reset cancellation/application and that persistence occurs only on final Apply. Existing footprint and import-dialog suites also pass. Browser acceptance remains pending, and earlier manager QA describing immediate application is historical.


## Architect keyboard rotation

The focused building preview now follows the manual’s Spacebar rotation shortcut. One press rotates clockwise by 90 degrees; key repeat does not spin continuously. Enter retains painting/selection behavior. Rotation buttons and the shortcut reset unfinished preview paint strokes before changing the view. The shortcut is attached to the canvas, so typing spaces into a model name remains normal.

The actual designer-handler check confirms the orientation change, ignored repeat and unchanged serialized city. The footprint suite passes. Browser keyboard and paint-stroke interaction acceptance remain pending.


## Designer import ordering

The building designer now invalidates pending file reads when a newer import starts, the selected slot changes, the player edits the model, applies/restores artwork, or closes the editor. Late file results and errors cannot replace newer work or another dialog’s state. Actual handler checks resolve two reads out of order and complete an import after a manual name edit; the newer model/edit remains intact. The footprint suite passes after the correction.


## Right-button construction eraser

The independent-layer editor now implements the manual’s right-button erase shortcut (printed page 151). Right-drag uses the selected freehand, line or plane shape to erase on the current cross-section, without changing the selected Place/Erase control. Erasure previews until release, Shift cancels it, and Undo/Redo treat it as one construction action. The grid suppresses its context menu for this interaction.

Actual handler checks exercise all three shapes across horizontal, XZ and YZ planes, including deferred changes, Shift cancellation, preserved construction selection and complete undo/redo. The voxel-editor suite passes. Browser pointer acceptance remains pending; the shortcut applies to the independent-layer construction grid.


## Construct-mode block selection

The layer editor now offers Select existing block, corresponding to the manual’s Construct-mode eyedropper (printed pages 151–152). Clicking an occupied cell selects its geometry and world orientation in the palette without editing the model or adding undo history. Empty cells preserve the existing palette choice and report that there is no block to sample. Players switch back to Place blocks to use the selection.

Actual pointer-handler checks cover all three edit planes, oriented wedges, unchanged model/write count, empty cells and untouched undo history. The voxel-editor suite passes. This covers selecting the supported cube/wedge geometry; the complete fourteen-type block palette and browser acceptance remain unfinished.


## Detail eyedropper

The model preview now offers Select existing detail, extending the manual’s mode-specific selection tool to the supported windows, doors, vents and ledges. Pointer or Enter selects the detail at the visible floor surface without modifying paint or geometry. Blank surfaces preserve the current detail choice. Players switch to Place building details to use it.

Actual preview-handler checks verify pointer/keyboard sampling, unchanged complete model data and blank-surface behavior. The preview-paint suite passes; browser acceptance and the wider original detail catalog remain pending.


## Integrated editor validation — architecture-collection-17

The complete regression command finished with exit code 0 and 302 PASS records after courtyard integration, transactional manager changes, designer import ordering, keyboard rotation, right-button erasure and block/detail sampling. Static import resolution and presence of all 300 directional images with their inspection records were also checked. The expected simulated image-outage warning remains part of recovery coverage.

This supersedes the earlier architecture-collection-9 full-run checkpoint for source compatibility. It does not establish browser usability, actual large-city frame rate, completed catalog coverage or publication. Those remain separate requirements for the unfinished architecture milestone.


## Helsinki Cathedral model draft

An original cathedral model has been authored from parish and architectural references, with the characteristic central dome, four smaller domes, white porticoes and steps. Four-view coordinate/bounds checks pass, but offline visual inspection exposed column/portico occlusion in the shared landmark painter. Depth-correct rendering is the next required fix. The model is not in the playable catalog, which remains at six landmarks; no new save schema or completed-landmark claim is made.


## Cathedral depth rendering

The shared cached-miniature rasterizer now supports a configurable viewport/projection, allowing the cathedral’s 512×848 landmark view to use per-pixel depth instead of average face ordering. Columns now appear in front of their walls. Visual review also found and corrected reversed roof-face winding. Four development renders were saved; views 0 and 2 were inspected after correction.

The new cathedral test verifies finite geometry, nonclipped occupied pixels/depth in every rotation, front-surface visibility independent of face submission order and the actual drawing path. Existing tree and landmark suites pass after the shared raster change. The cathedral remains outside the playable catalog pending migration and gameplay integration.

## Helsinki Cathedral placement integration

Helsinki Cathedral is now the seventh catalog landmark, using the original four-view model described above. Players can select it in the landmark gallery, place it immediately for free on a clear 3×3 footprint, count it in scenario objectives, demolish any member tile and rebuild it. It follows the shared one-per-city rule and adds no jobs or direct income. The 3×3 size is an authored reconstruction choice, not a recovered original-game dimension.

Schema 147 preserves the new landmark and rejects its presence in earlier-version payloads; version 146 cities without it remain supported. Cache graph architecture-collection-19. Focused placement/save/projection checks pass. The complete regression run finished with 303 PASS records and exit code 0; log: `/tmp/sims3000-helsinki-integration-tests.log`. Browser acceptance is pending because the Mac remains locked. This is part of the broad architecture milestone, not a separate milestone commit or publication.

## Rotate landmarks before placement

The landmark gallery now displays the same cached city models for all five modeled landmarks, with independent clockwise/counterclockwise controls and accessible North/East/South/West labels. Preview images fit projected geometry bounds without changing the city rendering anchor, which makes low buildings such as Helsinki Cathedral legible alongside towers. Eiffel Tower and Great Pyramid retain their existing illustrations until directional models are authored. Selecting a preview changes no city data; the Place action selects the construction tool and already-placed entries remain disabled.

Five focused suites pass, including a new test exercising actual gallery handlers, four-view wrapping, source/destination bounds, aspect ratio, unchanged saved state, placed-item protection and shared preview/city raster caching. Cache architecture-collection-20; schema 147 unchanged. The last full regression remains 303 suites at cache 19; the test command now includes the new gallery suite. Browser visual review is pending because the Mac is locked.

## Directional artwork for every current landmark

Eiffel Tower and Great Pyramid now use original depth-rendered geometry in the city and gallery. All seven catalog landmarks therefore rotate with the map and can be inspected from four directions before placement. The Eiffel Tower's 3×3 and Great Pyramid's 4×4 footprints, placement rules and saved types are preserved; no save-schema change is required. Geometry and references are recorded under `art/architecture/eiffel-tower` and `art/architecture/great-pyramid`. This completes directional coverage of the current seven-entry catalog, not the full original landmark catalog.

Six focused suites pass at cache architecture-collection-21. The new renderer test executes the actual structure branch for every tile of every landmark and verifies one centered draw per footprint in each map direction, without static-sprite fallback. New raster checks verify finite geometry, unclipped transparent bounds and actual drawing output. Gallery, uniqueness/rebuilding, save continuation, alien targeting and scenario counting checks also pass. The test command now includes 305 suites; the most recent full run is still 303 suites at cache 19. Offline model review is partial as specified in the asset READMEs; browser review remains pending. No separate milestone commit or publication has been made.

## Landmark inventory coverage checkpoint

A source-linked development inventory and executable runtime comparison now make remaining catalog work explicit. The inventory retains 74 standard candidates, 25 Unlimited additions and the existing downloadable extension separately. Current runtime mappings cover seven entries; 93 are unmapped. CN Tower's absence from the guide extraction, paired components, ambiguous names and the single-pyramid composition are recorded for further verification. The coverage script completed successfully. No game behavior or release status changed at this checkpoint.

## American memorial landmark batch

Washington Monument, Gateway Arch, Jefferson Memorial and Lincoln Memorial are now selectable with original four-view models and rotatable gallery previews. Washington Monument uses an authored 3×3 footprint; the other three use authored 4×4 footprints. Original-game dimensions remain unverified. Shared free placement, uniqueness, demolition/rebuilding, alien preference and scenario metrics apply. Sources and visual-review limits are recorded in `art/architecture/us-memorials/README.md`.

Schema 148 accepts the batch; earlier-version payloads containing these types are rejected, while ordinary schema 147 cities migrate. The focused batch suite passed, including four-view raster bounds, documented column counts, far-corner demolition/rebuilding and saved monthly continuation. One initial test expectation incorrectly omitted normal bulldozer fees and was corrected; construction itself is free. All current-landmark placement, gallery and renderer checks passed before the full regression run was started. The full regression completed with 306 PASS records and exit code 0 at cache architecture-collection-22; log `/tmp/sims3000-memorial-batch-tests.log`.

There are now eleven runtime landmark mappings, leaving 89 inventory entries unmapped. This is part of the ongoing architecture release group; it has not been separately committed or published. Browser acceptance remains pending because the Mac is locked.

A validated 96×96 review city containing all eleven landmarks is saved at `/tmp/sims3000-landmark-review-city.json` for the pending browser walkthrough.

## Architect reference-block preview

Manual printed pages 143–145 describe a yellow reference location in the edit plane and model before construction begins. Independent-layer editing now highlights the hovered or keyboard-focused cell before a click, using the existing 3D plane guide. The highlight follows all three cross-section orientations, clears on leaving/focus exit, Escape or slice changes, and yields to a pending drag preview. Repeated motion within one cell avoids redundant redraws.

Three focused editor/guide/designer suites pass, including actual pointer/focus/keyboard handlers, unchanged draft and undo history, pending drag preservation, per-plane cell mapping and invalid reference rejection. Cache architecture-collection-23; schema 148 unchanged. The last full regression remains the 306-suite cache-22 run committed in draft PR #192. These follow-up edits are uncommitted and await browser review. The manual image confirms a scrolling block palette but does not identify all fourteen shapes; full block and prop catalogs remain outstanding.

## Prop model and renderer foundation — controls unfinished

Manual printed pages 149–150 describe rotatable props placed on ground/building surfaces, clipping at the model boundary, and persistence after the support block is removed. Custom block/layer designs now validate and preserve up to 64 independent prop records. The first original geometry types are a garden tree and parked car. Physical dimensions stay independent of lot aspect ratio; the renderer uses building faces as depth-only occluders before drawing the prop overlay. Imported prop models render in existing design previews and city caches.

Portable building format 10 stores compact prop tuples; city schema 149 preserves records and rejects props in older-version cities. Older model formats remain supported. A maximum 5×5 model with full voxel occupancy, all paint/details/geometry and 64 props fits the existing 32 KB portable-file limit. `/tmp/sims3000-prop-model.json` is prepared for visual review.

Focused prop, footprint, building-set, custom-library, tree-raster and cathedral-raster checks pass. They cover invalid records, deep copies, support-independent positions, saved simulation continuity, four-view occlusion, rooftop/floating visibility, model-space bounds and portable roundtrips. Cache architecture-collection-24; the last full regression remains 306 suites at cache 22.

This is unfinished infrastructure, not a complete prop-placement tool. Next work must connect model/ground picking, a category/rotation picker, placement/removal and undo/redo to the designer; handle construction-mode switches coherently; verify cropping near walls; and visually review original prop assets and their game-scale rendering. Broader prop categories remain missing. These changes are uncommitted and not part of draft PR #192.

## Architect prop placement controls

The designer now offers Place props, with the first original Flora/Vehicle entries, a separate four-direction selector, a projected size outline, visible ground/roof picking and a placed-prop removal list. Click release commits one draft edit; Shift release, Escape, pointer cancellation or intervening camera/model changes discard a pending placement. Arrow keys move the target and Enter places. Props share each construction editor’s undo/redo history. Applying or exporting the building preserves props; changing a name or color does not discard them.

Removing every supporting block leaves a valid prop-only building, as manual printed page 150 describes. A completely empty model still cannot be applied/exported. Switching between height layout and independent layers retains the latest prop edits independently of remembered construction geometry; a regression caught and fixed stale props being restored from the old height-layout snapshot. Switching to parametric towers asks the player to remove props first and leaves the current model/history intact.

The five focused prop/editor/construction/designer suites passed. The new prop UI suite is included in npm test. Cache architecture-collection-25, schema 149; all 308 registered regression suites passed with 309 PASS records and exit code 0 in `/tmp/sims3000-prop-editor-tests.log`. Placement tests also cover all four model views, both rectangular lot orientations and zoom/pan transforms. A fresh computer-use check still reports the Mac locked, so no browser visual acceptance is claimed. The broader eight-category palette, near-wall cropping fidelity and game-scale appearance remain unfinished. This is continuing architecture work, not a new small milestone commit or a published release.

## Eight-category original prop collection

The prop palette now has a category selector and twelve original models spanning the manual’s eight groups. Added models include the specifically mentioned family station wagon and blue pickup truck, plus an arch, column, clock, bench, lamp, picnic table, storage tank and ventilation unit. These are authored originals; category coverage does not establish the full original prop inventory. All forty-eight enlarged directional review images were inspected, with a reversed arch face corrected and shared world-space lighting added. See `art/architecture/building-props/README.md` for reproduction and limits.

An actual-scale raster test exposed a thin lamp disappearing on a 1×5 lot. Prop rendering now samples at four times resolution within only the affected bounds, then downsamples with alpha coverage. Model dimensions remain unchanged. Every prop/orientation/view combination now produces visible coverage on square and both narrow rectangular lots. Seven focused collection, prop, editor, construction, designer-save and custom-library suites pass. The new collection suite is registered in npm test (309 commands); the last full run remains the 308-suite cache-25 run.

Cache architecture-collection-26; schema 149 and portable model 10 remain unchanged because this prop capability is still unpublished, uncommitted work following draft PR #192. Full shipped-palette parity, adjacent-wall physical cropping and browser appearance remain outstanding. No separate small milestone commit or Sites publication was made.

## Prop surfaces cropped against construction

Props now subtract the occupied volume of height-layout columns and independent cubes/wedges before drawing. Clipping is performed in model space, separately from camera occlusion, so the geometry stays consistent when rotated. It respects all four wedge directions, rectangular lots, overhangs and empty layer gaps. Props exactly on a roof retain their contact surfaces. Saved prop geometry is unchanged; removing construction restores the cropped surfaces. This is an explicit geometric reconstruction of the manual’s cropping behavior, not evidence of the original program’s exact clipping algorithm.

Analytic tests compare remaining polygon areas against known cube/wedge intersections, including vertical surfaces and rectangular lots, and check gaps, contact, immutability and support removal. A sixteen-view enlarged geometry diagnostic was inspected at `art/architecture/building-props/clipping/contact-sheet.png`; regenerate with `node scripts/render-prop-clipping-review.mjs` then `python3 scripts/assemble-prop-clipping-review.py`. The browser still needs actual-scale acceptance.

Cache architecture-collection-27; schema 149 unchanged. The full 310-command regression passed with 312 PASS records and exit code 0 in `/tmp/sims3000-prop-clipping-tests.log`. A one-pass stress diagnostic with 64 rooftop arches on a fully occupied 24-layer model took 86/59/52/42 ms across four view rasters on this Mac. These are individual raster timings, not browser FPS; repeated editor-hover rendering should reuse unchanged prop frames in the next performance pass.

## Reuse unchanged prop preview frames

Building Architect retains at most four directional prop frames per drawing context for the current model content. Cursor/guide/camera redraws reuse the unchanged artwork. Content fingerprints include prop records, blocks/layers, wedge geometry and footprint dimensions, so even in-place edits invalidate stale views. Clearing props draws no retained artwork; unrelated name or facade edits leave the prop layer reusable. Weakly held contexts allow discarded previews to be collected.

Four focused cache/designer/clipping/editor suites passed, including byte-for-byte pixel equivalence, fifty repeated redraws, all four view reuse, actual changed geometry and independent destinations. The cache suite is registered (311 test commands); the last full regression remains the 310-suite cache-27 run. Cache architecture-collection-28, schema 149 unchanged.

A stress diagnostic with 64 rooftop arches on a fully occupied 24-layer model measured cold frame preparation at 79.836/58.114/47.262/38.892 ms across four views; one hundred reused calls per view averaged 0.009/0.008/0.008/0.008 ms. This uses a mocked drawing context and measures frame preparation only; it excludes actual browser compositing, the rest of building rendering and input processing, so it is not a browser FPS claim. Browser acceptance is still pending. Changes remain grouped in the ongoing architecture work.

## Inspect the selected prop before placement

The prop palette now includes a fitted visual preview driven by the same model geometry and world-space lighting as placement. It follows both the selected prop’s physical direction and the building camera, with a caption and accessible image label naming each. Category, prop, direction and camera changes refresh the image; cursor-only redraws reuse it. The preview is intentionally enlarged to help choose small objects, independently of actual building scale.

Four focused collection/editor/designer/cache suites pass. Every one of twelve models is tested through all sixteen direction/view combinations for visible coverage and transparent framing margins; actual controls verify labels and unchanged-preview reuse. The cache graph is architecture-collection-29, schema 149 unchanged. The last full regression remains the 310-suite cache-27 run. A fresh computer-use availability check still reported the Mac locked, so no browser visual acceptance was performed. This continues the architecture milestone without a separate small commit or publication.

## Erase props directly from the model

The manual tutorial (printed page 133) names Erase and Undo for removing props. A new Erase props preview mode now selects the frontmost visible prop surface and removes the corresponding record through the existing shared construction undo path. It also supports the preview cursor’s arrows/Enter and the existing Shift/Escape cancellation. Placement choices are disabled while erasing; the selected prop receives a removal highlight. The list-based removal option remains useful for completely hidden props.

Picking uses clipped model-space prop geometry and building surfaces, projected with per-surface depth rather than selecting a bounding rectangle. It respects walls, all camera rotations, zoom/pan, rectangular lots and equal-depth overlapping props. Cached pick geometry refreshes when relevant model content changes. Four focused picking/editor/designer/paint suites pass, including the actual erase control and cancelling a removal. The picking suite is registered (312 test commands). Cache architecture-collection-30; schema 149 unchanged. Last full regression remains the 310-suite cache-27 run; browser acceptance is pending.

## Skyline landmark batch

Empire State Building and CN Tower now join the playable landmark gallery with original four-view miniatures, authored 3×3 footprints, free unique placement and the existing scenario/save/demolition behavior. The inventory now maps thirteen runtime landmarks and leaves 87 entries unmapped. CN Tower retains its directory-evidence discrepancy flag. Architectural sources, original geometry scope, condensed detail and footprint/scale limits are documented in `art/architecture/skyline-landmarks/README.md`.

All eight enlarged model views were inspected. Focused skyline, collection, gallery, city-renderer and landmark lifecycle checks pass. Test fixtures now accommodate the larger collection while still checking every placed landmark exactly once in each map direction; old fixed raster-cache counts were replaced with current catalog counts. A validated 96×96 review city containing all thirteen is at `/tmp/sims3000-skyline-review-city.json`.

Cache architecture-collection-31; schema 149 covers this continuing unpublished architecture follow-up, and version 148 payloads containing the new types are rejected. The full 313-command regression passed with 318 PASS records and exit code 0 in `/tmp/sims3000-skyline-batch-tests.log`, including the recent prop preview/cache/erase work. Browser review remains pending. No separate small landmark commit or Sites publication was made.

## Find landmarks in the growing collection

The gallery now searches landmark names and locations, matching multiple words case-insensitively and ignoring common accent differences. Availability filters distinguish all, available-to-place and already-placed landmarks. Live result counts, an explicit empty state and a Clear filters control make filtering recoverable. Cards retain their independent preview rotation when hidden and shown; browsing does not change the city or grant another copy of a placed landmark.

The actual gallery-control suite passes name/location, combined-word, accent, availability, no-result and clear/focus checks alongside existing gallery/city raster reuse and placement protection. One initial test mistakenly assumed “state” would not match “United States”; the test now uses the unambiguous query “empire york.” Cache architecture-collection-32, schema 149 unchanged; the last full regression remains 313 suites at cache 31. Browser layout/accessibility acceptance remains pending. This is part of the architecture release group, without a separate small commit.

## Prop selection and drag erasing

Manual printed pages 151–152 describe a read-only eyedropper that selects a prop in its palette, plus dragging to erase multiple items. Select existing prop now copies the visible prop’s category, type and physical direction without changing the building. The player then chooses Place props to reuse it. Empty selection leaves the current palette intact.

Erase props now gathers visible props across a drag and removes them in a single construction edit on release; Shift/Escape cancellation discards the pending removal. One Undo restores the entire stroke. Existing depth/clipping picking still prevents selecting hidden props. Selection and erase outlines are blue, while new placement stays yellow. The manual’s full blue hue/tint treatment is not yet reproduced; the current highlight is a bounding outline.

Four focused prop-editor/construction/paint/designer suites pass, including unchanged state/history on selection, palette copying, empty selection, delayed multi-prop commit, cancellation and whole-stroke undo/redo. Cache architecture-collection-33, schema 149 unchanged. Last full regression remains 313 suites at cache 31. Full fourteen-block shape coverage, exact prop/texture/detail catalogs, navigation-panel parity and browser visual acceptance remain outstanding.

## Visible-surface blue prop highlighting

Select/Erase now tint the existing prop’s visible surfaces blue, retaining geometry shading, instead of outlining its bounds. Pending drag erases tint every marked prop. The overlay includes all construction and other prop surfaces in the depth test, so it cannot show through walls or overlapping props. Equal-depth ordering matches ordinary rendering. Color coverage is downsampled per sample to avoid bleeding the tint into unselected props. This supersedes the earlier outline-only gap; exact original tint colors and browser appearance are still unverified.

Separate bounded overlay caches keep selection changes from evicting normal prop artwork. Six focused highlight/cache/editor/clipping/designer/model suites pass, including exact visible coverage, shaded blue channels, wall/prop occlusion, equal-depth overlap, per-prop sample ownership, unchanged models and actual multi-prop overlay drawing. The new highlight suite is registered (314 test commands). Cache architecture-collection-34; schema 149 unchanged. Last full regression remains 313 suites at cache 31.

## Whole-model overview navigator

The Building Architect navigation reference (printed page 152) describes a complete model preview with the current visible area highlighted and click-to-pan navigation. The designer now includes a small whole-model overview and visible-area frame. Clicking recenters the main view without changing zoom; arrow keys move the center, Shift increases the step, and Home resets. The frame is derived from the inverse camera transform and clipped to the overview bounds, so zoomed-out views still show a full frame. Cached artwork refreshes on model/rotation changes and is reused for camera movement.

Three focused overview/camera/actual-designer suites pass, covering CSS-scaled pointer coordinates, inverse viewport dimensions, keyboard/recenter/reset, maintained zoom, model preservation and raster reuse. Test DOM canvases now model the overview as a separate context, preventing overview scaling from corrupting the mock main-canvas scale. The overview suite is registered (315 test commands). Cache architecture-collection-35, schema 149 unchanged; last full regression remains 313 suites at cache 31.

The overview uses the rectangular main-preview viewport across modes. The manual’s special Construct-mode hexagonal frame/widget behavior is not reproduced, and actual browser layout/accessibility acceptance remains pending. Desktop main-preview sizing now reserves space for the overview controls.

## Architecture feedback exercise and grouped checkpoint

In-game checkpoint 7 now covers construction, paint, portable models, prop placement/selection/group erasing, overview navigation, custom-model reuse and landmark browsing/placement. Its original three step identifiers and texts are preserved, so prior player checkmarks retain their meaning; four new exercises start unmarked. The feedback dialog provides direct Building Architect, Building Library and Landmark launch controls. Notes remain browser-local until the player downloads and shares them; no feedback is assumed. Actual feedback controls and app routing are tested, including opening the menu before menu-owned tools.

This checkpoint groups the post-PR-192 architecture work: twelve original props with editing, clipping, previews and highlights; the overview navigator; two additional landmarks; gallery filtering; and updated feedback exercises. Cache architecture-collection-36, schema 149. The full 315-command regression passed with 324 PASS records and exit code 0 in `/tmp/sims3000-architecture-feedback-tests.log`. The GitHub PR remains draft pending browser visual acceptance. A fresh computer-use check again reported the Mac locked; Sites source-export/publication authorization remains separately pending.

## Visual construction block palette

The Construct editor now displays clickable projected previews for its existing cube and four directional wedge choices, replacing the text-only geometry selector. Native buttons expose the selected shape through aria-pressed; labels name each wedge's rising direction. Selecting a shape cancels an unfinished construction stroke without changing the model. Sampling an occupied block updates the selected preview, and the subsequent construction stroke uses that geometry. The palette retains the current Place/Erase/Sample tool choice.

The five generated geometry previews were visually inspected in `/tmp/sims3000-block-palette.png`. Focused palette, actual voxel-editor, block-geometry, three-edit-plane and actual-designer/footprint suites all passed with exit code 0. The palette suite is registered, bringing the regression command inventory to 316; the last full regression remains 315 commands at cache 36. Cache architecture-collection-37, schema 149 unchanged. Browser layout and keyboard acceptance remain pending; projected asset inspection is not browser acceptance.

Manual printed pages 144–145 describe visual block selection and fourteen block types with four rotations. This change improves selection of the currently supported cube and wedge; it does not claim the remaining original block types have been identified or implemented. This work remains local for the next grouped architecture checkpoint; it has not been published.

## Grass and asphalt surface materials

The manual's Paint section (printed page 145) explicitly names grass and asphalt alongside brick and stucco. Both now appear in the shared material palette and work on block walls, rooftops, per-floor overrides and connected fills. They use original procedural grain and grass marks. Automatic facade windows are suppressed for these materials in both height-layout and independent-layer renderers; explicitly placed details still render over the texture. Bare-ground painting is not yet implemented, so this does not complete the manual's walls/rooftops/ground scope.

Portable building format 11 preserves these materials with or without optional props; older palettes retain their previous export versions. City schema 150 accepts ordinary schema-149 saves but rejects new material identifiers mislabeled as older saves. Column-paint and per-floor encodings independently enforce this boundary. The registered landscape-material suite exercises fill, override, optional prop roundtrips, both downgrade gates and all four views in both construction representations. Focused landscape/material/floor-paint/prop suites passed. The preliminary eight-frame rendered review exposed inherited windows, which were fixed and covered by renderer assertions; final revised visual review remains pending.

There are now 317 registered regression commands, cache architecture-collection-38. A full run is active in terminal session 99388, logging to `/tmp/sims3000-landscape-material-tests.log`; do not count it as passed until terminal completion. That run began before the automatic-window fix, which has separate focused verification. These changes and the visual block palette remain local for the next grouped checkpoint. Browser acceptance and Sites publication remain pending.


Landscape-material verification closeout: terminal session 99388 completed with exit code 0, all 317 registered commands and 326 PASS records. The log is `/tmp/sims3000-landscape-material-tests.log`. The final texture variation and preview-handler assertions also passed separately in focused material/landscape/preview suites; the full run began before those final edits, so its result is supplemented by these checks rather than claimed as a frozen final-source run. The revised eight-view geometry render `/tmp/sims3000-landscape-materials-revised.png` was inspected after removing automatic windows and replacing rigid texture rows with deterministic staggered marks. Bounds and repeatability are asserted. These are rendered-art and handler checks, not interactive browser acceptance. Bare-ground painting remains the next Paint-mode functionality gap.

## Ground painting

Paint mode now offers Paint ground, Fill connected ground, Sample ground material and Restore original ground. A separate 10×10 ground layer spans the building lot, draws below the model and props, and uses the shared seven-entry material palette. Brush strokes stage until release, Shift/Escape cancel, arrow keys move the target and Enter applies or samples. Picking rejects points covered by rendered building faces or props. Fill follows adjacent ground squares of the same material and uses each square's center to detect a ground-level building barrier; this grid resolution and barrier rule are reconstruction choices, not a claim of the original editor's exact algorithm.

Ground edits join the active block/layer undo history and the latest ground paint survives construction-method changes. The current controls require a block layout or independent layers; tower-parameter models can retain/render imported ground paint but direct ground editing in tower mode is not enabled. Ground paint is independent from rooftop and wall materials. New portable format 12 and city schema 151 preserve the layer; mislabeled older files are rejected, and older cities without ground paint migrate. The lot's simulation behavior is unchanged by the artwork.

Focused ground geometry/format/editor, block history, voxel history and actual-designer/footprint suites passed. `/tmp/sims3000-ground-review.png` was visually inspected, showing a lawn/path composition in all four rotations using the runtime renderer. These checks do not establish browser pointer/layout acceptance. There are 319 registered regression commands; last full regression was 317 commands before ground support. Current cache architecture-collection-39. Full current regression, browser acceptance and publication remain pending. This remains local with the visual block palette and landscape materials for a grouped architecture checkpoint.


Ground integration verification: custom-library encode/decode and whole building-set transfer preserve ground paint with props. A fully populated five-tile design with 64 props, all surface layers and ground paint remains below 32 KB and roundtrips exactly. Actual preview handlers reject clicks through visible props. These focused tests passed, local module imports resolve, and diff whitespace checks pass. A fresh browser availability check still reported the Mac locked. The 319-command full regression is running in terminal session 14633, logging to `/tmp/sims3000-ground-paint-tests.log`; wait for terminal completion before recording a pass or preparing the grouped GitHub checkpoint.


Review artifact: `art/architecture/ground-paint/garden-court.building.json` is a validated importable one-tile model with lawn and a paved path. The adjacent README provides six concrete player exercises, and `four-view-review.png` preserves the inspected runtime geometry rendering. PR 192 was rechecked: open/draft at commit 25ec369bc85bb3089f2d985aca76c5f909c9153b. The 319-command regression continues in session 14633; the source files have not changed since that run started. The review artifact and documentation were added while it runs.


Grouped painting checkpoint verified: the full 319-command regression at cache architecture-collection-39/schema 151 completed with exit code 0 and 328 PASS records in `/tmp/sims3000-ground-paint-tests.log` (session 14633 closed). Product source was unchanged during this run. This closes automated verification for visual block selection, landscape surface materials and ground painting together. Browser acceptance and publication remain pending; PR 192 stays draft.

## Visual Paint palette and ground-preservation correction

The manual's printed page 147 describes selecting a texture/paint from a visual palette organized into sets. The designer now shows seven clickable runtime texture swatches, grouped as All materials, Facades, Roofing and Landscape. These set names and memberships are authored organization of the current material inventory, not a reconstruction of the original complete palette catalog. Selection uses native buttons with aria-pressed; sampled selections outside the filtered group reveal themselves by returning to All materials. Swatches follow editable facade/glass colors and cache unchanged artwork. Ground restore mode updates disabled controls immediately.

Inspection also found a real integration omission: the designer's field-to-draft read function discarded groundPaint, despite the format and editor layers preserving it. It now carries groundPaint through name/color edits, Apply and imported drafts. The actual designer suite now asserts these paths for both block and voxel representations. This corrects a bug present in the previous GitHub checkpoint; the fix is currently local.

Focused material-palette, actual designer/footprint, preview-paint and ground-editor suites passed. The seven swatch renderings were inspected in `/tmp/sims3000-material-swatches.png`. Current cache architecture-collection-40, schema 151 unchanged, 320 registered test commands. Last full regression remains 319 commands at cache 39 before these changes; browser acceptance and publication remain pending. The full original paint/color catalog remains incomplete.


Composed painting acceptance: the actual Building Architect controls are now exercised together for block and voxel models. Tests choose a material swatch, paint a visible ground square, prove the city remains unchanged before Apply, rename the draft, apply, sample the ground, erase/undo, apply again and restore a serialized city. Both representations preserve the lawn through the entire sequence. This is handler-based acceptance with an in-memory DOM, not browser visual acceptance. Checkpoint 7 now adds an eighth exercise for material previews and ground-paint/save continuity; all seven earlier step identities remain unchanged and the new check starts unmarked. Focused composed-designer, palette and feedback suites passed. Cache architecture-collection-41, schema 151 unchanged.


Paint-palette follow-up verified: all 320 registered regression commands passed with 329 PASS records and terminal exit 0 in `/tmp/sims3000-paint-palette-tests.log` (session 66956 closed). Product source remained unchanged during the run. Cache architecture-collection-41/schema 151. This checkpoint includes the visual material palette, the designer ground-paint preservation correction, composed painting/Apply/save coverage and the eighth architecture feedback exercise. Browser acceptance and publication remain pending.
