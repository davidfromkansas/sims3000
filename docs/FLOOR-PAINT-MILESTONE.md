# Individual floor surface paint

Players can paint one visible floor tile without recoloring the whole wall. Preview Paint area defaults to Individual floor surface; Whole column side remains available. The eyedropper samples the actual visible material, including floor overrides. Dragged floor tiles form one undoable stroke in either height layouts or independent layers. Switching construction methods retains each draft’s paint.

This implements the single highlighted surface-tile paintbrush described on manual page 147. Original block-shape, texture, detail and prop catalogs remain incomplete; this milestone uses the existing five procedural materials.

## Feedback checkpoint 7

Open Building designer, select a block layout or independent layers, zoom in, select Paint visible surfaces and Brick, then click one wall floor tile. Sample that tile and the floor above; only the selected tile should be Brick. Undo and redo, switch construction methods, and export/reimport the design. Whole column side deliberately paints all levels on that side.

## Persistence and rendering

A bounded 12,000-character field stores overrides for 100 columns × 24 floors × 5 sides. Zero inherits existing column paint; the other five values explicitly select a material, including Original facade. Legacy designs remain unchanged. Painted designs use individual file format 6 and city schema 121. Formats 1–5 and older cities still import; falsely downgraded paint is rejected. The individual-file upload limit is 32 KB; the largest supported layered design with paint and a Unicode name fits. City saves and complete building sets retain paint.

Height-layout walls are split in their original painter order for precise picking. Only models carrying floor paint use split wall rendering; existing unpainted models retain their previous drawing. Independent layers already expose individual faces. Paint stays at its floor position when geometry is edited. Whole-column footprint brushes clear floor overrides on affected sides.

## Validation

All 224 suites passed. Added checks cover individually pickable floors in all four rotations, inheritance, explicit original facade, renderer material detail, file size/format validation, city migration, building-set retention, floor versus column strokes, undo/redo and draft mode changes.

Local browser playtest: at 195% zoom, painted East wall column 9, row 7, floor 5 Brick. Eyedropper read Brick there and Original facade immediately above. Undo restored Original facade, redo restored Brick, and conversion to independent layers retained Brick. No browser errors or warnings. The draft was discarded without altering the saved city.

Source milestone only. Hosted publication remains pending the existing Sites export approval; the local preview serves this change.
