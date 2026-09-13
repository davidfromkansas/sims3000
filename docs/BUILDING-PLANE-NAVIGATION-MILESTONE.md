# Building cross-section navigation

The layered editor now provides a Move edit plane slider, Previous/Next slice buttons, wheel navigation over the editing grid, and Page Up/Down. All controls update the existing number field, grid and colored model guide together. Horizontal floors span 1–24; both vertical orientations span 1–10. Changing orientation clamps the slice, and moving slices discards unfinished construction without creating an undo entry.

This follows the plane widget and wheel navigation described on manual pages 143–144. The slider provides the draggable plane control in the settings panel; the model guide itself is not a draggable widget yet. Wheel input accumulates small trackpad deltas, handles pixel/line/page units and leaves Ctrl/Meta zoom gestures to the browser.

## Feedback checkpoint 7

Open independent layers and drag Move edit plane to inspect successive floors. Use Previous/Next, then switch to a vertical cross-section. While the grid is focused, use Page Up/Down. Roll the wheel over the grid to move through slices. Begin a construction stroke and change the slice; verify that the unfinished stroke is discarded.

## Verification

All 227 suites passed. Extended layered editor checks cover slider/number synchronization, orientation bounds, disabled end buttons, keyboard movement, cancellation of pending strokes, accumulated wheel input in all three delta units, browser zoom passthrough and unchanged model data.

Local browser: moved slider to floor 16 and Next to 17; switching to the vertical plane clamped to row 10 and disabled Next. Page Down moved to row 9 with the original 656 blocks unchanged. Colored model guide updated; no errors or warnings. Discarded the draft. Wheel semantics were checked with controller tests, not a physical browser wheel gesture.

Source milestone only; hosted publication remains pending the existing Sites export approval. No save schema change. Local preview serves this milestone.
