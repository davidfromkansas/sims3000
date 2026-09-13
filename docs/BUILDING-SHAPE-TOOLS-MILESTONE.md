# Building construction lines, planes and Redo

Players can shape building wings, walls and courtyards by dragging a Line or Plane in the 10×10 footprint editor. A yellow footprint outline previews the affected squares; release commits the selected height once. Height zero erases. Hold Shift while releasing, press Escape, or cancel the pointer to discard a pending shape.

Keyboard users choose Line or Plane, focus a footprint square, press Shift+Enter, extend with arrows and press Enter to commit. Escape cancels. Freehand and surface painting remain available.

Redo restores undone layout and material changes. Every completed line or plane is one history entry. A new edit clears the redo branch; switching design or construction mode clears editing history. Drafts still require Apply to city. Existing city and portable building formats preserve the resulting height grid without a schema change.

Manual reference: pages 144–145 describe previewed line/plane placement and Shift cancellation; page 152 describes Undo/Redo. This is an adaptation to the existing height-field editor: lines use an integer raster path and planes are horizontal footprint rectangles set to a chosen height. Arbitrary 3D edit planes, overhangs and the original fourteen block shapes remain outside this implementation.

Validation: all 208 regression suites passed. New tests cover all 10,000 line endpoint pairs, reversed planes, nonmutating previews, single-action undo/redo with materials, cancellation, keyboard placement, new-edit redo invalidation, erasure and portable building roundtrip. Browser dragging created 20 occupied squares, Undo restored one, Redo restored 20; keyboard line construction extended the result to 21. No console errors. The test stayed a draft and the original city remained 224 residents / §42,500.

Feedback exercise: build two wings with Plane, join them with Line, erase a courtyard with height zero, then compare Undo and Redo. Cache building-shape-tools-1; schema 119 unchanged. Source only; publication awaits Sites export authorization.
