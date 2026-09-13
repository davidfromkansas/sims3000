# Building edit guides in the model preview

Players can see the selected cross-section on the 3D model before editing. Horizontal floors use a green guide, west–east slices red and north–south slices blue. A pending line or plane appears in yellow on both the grid and the model, and rotates with the model preview. Changing the slice moves the guide immediately; cancelling removes the pending highlight without changing the model.

This follows the colored selection-plane and reference-block feedback described on manual pages 143–145. Guides are transparent overlays, so the selected section remains visible through the building. They are drawn only by the designer UI, never into cached city artwork, building exports or saved model data. No schema change.

Validation: all 213 regression suites passed. Tests cover every position in all three plane families, coplanar highlighted cells, four rotations, all footprint extrema, drawing-state restoration and selection lifecycle callbacks. Browser inspection confirmed a nine-cell pending rectangle on the grid and the model in North and East views; Escape cancelled it and the design remained 656 blocks. No console errors. The draft was discarded without changing the city.

Feedback exercise: choose a vertical slice, start a rectangular edit, rotate the preview before committing, then cancel and compare. Check whether the guide makes the edit's location clear.

Cache building-plane-guides-1. Source only; Sites publication remains pending explicit export authorization.
