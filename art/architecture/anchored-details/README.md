# Anchored-detail feedback exercise

Import `cornice-pavilion.building.json` in Building Architect with a one-tile footprint. The original model contains wide windows and cornices on four walls. `four-view-review.png` is the inspected runtime geometry render of those placements, rasterized with Pillow; it is not a browser screenshot.

1. Rotate all four ways and inspect how each window spans several wall tiles.
2. Choose Place anchored wall detail, select Cornice, and choose width 3 and height 1. Point at a wall: its highlighted tile supplies the lower-left anchor.
3. Place a detail near an edge, then inspect its cropped end. Try another placement and cancel with Shift on release.
4. Use Select anchored detail on a visible part of the placement. Verify its design and size are copied without changing the model.
5. Erase a placement, Undo, then Redo. Paint the wall beneath another detail and check that the detail remains.
6. Rename the model, Apply, export/import, and restore the saved city. Check that anchored details remain in their wall positions.

Feedback: Are the anchor, size, cropped result and erase target understandable? Do keyboard placement and Undo behave as expected?

Current limits: 32 anchored wall placements, tile-snapped anchors, five original authored designs, and numeric size controls. Variable-size roof details and the original game's complete detail catalog are not implemented. Placement changes are cosmetic and remain drafts until Apply. The latest interactive browser acceptance is pending.
