# Independent solid paint review

`color-court.building.json` is an original importable model with four independently chosen colors for walls, roofs, ground and a path. Its four-view render was inspected. Plain painted surfaces intentionally have no automatic windows; details can be applied afterward. The model roundtrips through portable format 14 and city saves.

Regenerate with `node scripts/render-solid-paint-review.mjs`, then `python3 scripts/assemble-solid-paint-review.py`.

Player exercise:

1. Import the model and select the Solid paints set.
2. Choose a new color and paint one wall, a roof and a ground square.
3. Sample each painted surface and confirm its hex color and selected swatch.
4. Undo the stroke, then undo the color addition; redo both.
5. Change the whole-building facade color. Independently painted surfaces should retain their chosen colors.
6. Apply, export, reopen and restore a city save. Confirm the palette and painted surfaces remain.

The 28-custom-color limit is authored, not a claim about the original palette size. A palette slot used by surfaces or editing history cannot be reassigned. Applying and reopening clears editing histories when an unused color needs reclaiming. Actual browser layout, input and keyboard acceptance remain pending.
