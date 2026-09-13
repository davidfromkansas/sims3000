# Independent building surface details

Building designer now has Place building details with framed windows, entrance doors, vent grilles and windows with ledges. Players place or drag details onto individual visible surface tiles, and choose Remove detail to erase them. Paint and connected fills operate beneath these details. Wall details replace the automatic window in that tile; vent grilles also fit roofs. Each gesture is one undoable edit in either construction mode.

This follows the independent detail layer described on manual pages 147–149. The four procedural designs are original artwork. They are a first palette, not the full original catalog: larger multi-tile decals, catalog groups and props remain unfinished. Current decals fit inside a single surface tile.

## Feedback checkpoint 7

Create a block layout or independent layers. Zoom in, select Place building details and Window with ledge, then click a wall tile. Fill that wall with Brick and verify that the detail remains visible. Remove the detail, undo once, switch construction methods, and export/reimport the design. Try a vent on a roof; doors and windows are restricted to walls.

## Persistence and verification

Details have their own bounded 12,000-character surface field, independent of paint. Detailed building files use format 7; older formats still import, while files pretending to be older cannot silently carry details. City schema 122 preserves details; older cities migrate and falsely downgraded details are rejected. Complete building sets preserve the field. The maximum layered model with both full paint and detail fields, a 4×4 footprint and a Unicode name fits the existing 32 KB individual-file limit.

All 226 suites passed. New checks cover placement/removal without altering paint, roof restrictions, bounded decal polygons, rendering above materials, file bounds, city migration, complete building sets, gesture controls and undo/redo in both editors.

Local browser: placed a window with ledge on the east wall of the stepped tower, filled its 64-tile wall with Brick, and visually confirmed the ledge remained. Removed it, undid removal and converted to independent layers; the detail persisted. No browser errors or warnings. Discarded the draft without changing the saved city.

Source milestone only; hosted publishing remains pending the existing Sites export approval. Local preview serves this change.
