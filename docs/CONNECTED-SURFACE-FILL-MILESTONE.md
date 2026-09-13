# Connected model surface fill

The model preview now offers Fill connected surface. Hover highlights the same-material region, and click or Enter fills it in one undoable edit. Walls connect horizontally and vertically on one plane; roofs connect across tiles at the same elevation. Gaps, corners, steps and material boundaries stop the fill. This follows the Paint Mode Fill description on manual page 146.

The tool works with height layouts and independent layers, all preview rotations and zoom/pan. It uses the existing floor-paint data and file formats. Pending fills can be canceled with Shift on release, Escape, pointer cancellation, camera changes or a model/paint replacement. Paint area is disabled during Fill because the connected plane defines the area.

## Feedback checkpoint 7

Open Building designer, choose a block layout, zoom in, select Fill connected surface and Brick, then click a wall. Verify that adjacent perpendicular walls and stepped upper walls retain their materials. Undo/redo once. Paint a separating stripe with the individual-floor brush, then fill either side of it. Try a roof and a layered design containing gaps.

## Verification

All 225 test suites passed. Geometry tests cover all rotations, wall and roof adjacency, material stripes, diagonal separation, roof height changes and gaps between independent layers. Controller checks cover pending fills, Shift cancellation, keyboard fill and cancellation when paint changes mid-gesture.

Local browser: filled the 64-tile lower east wall of the default stepped tower at 195% zoom. The upper east wall and lower south wall remained unchanged. Eyedropper read Brick, Original facade after one Undo, and Brick after Redo. No browser errors or warnings. Discarded the draft without changing the saved city.

Source milestone only. Hosted publication remains pending the existing Sites export approval. The local preview serves this milestone.
