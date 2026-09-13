# Freehand layered construction

The layered editor’s Freehand blocks tool now follows an entire drag, including turns, instead of placing only its starting block. The path is interpolated between pointer samples so quick drags do not leave holes. Both the edit grid and model guide preview the exact traveled path. Placement and erasing work on horizontal floors and both vertical cross-sections. A complete stroke is one undoable edit; Shift release, Escape and pointer cancellation discard it. Keyboard users can start with Shift+Enter, trace a path with arrows and commit with Enter.

Manual page 144 describes placing multiple single blocks by holding and dragging. The existing editor previously ignored movement in that mode. Line and Plane remain endpoint-based tools; freehand now retains each turn.

## Feedback checkpoint 7

Choose independent layers and an empty floor. With Freehand blocks, drag a bent path and release. Confirm the preview and built blocks follow the path, then Undo/Redo once. Repeat with Erase blocks and on a vertical edit plane. For keyboard input, use Shift+Enter, two Right arrows, Down and Enter to create a four-block bend.

## Verification

All 227 suites passed. Tests cover bent-path placement and erasure on all three planes, model guide agreement, one-step undo/redo, Shift cancellation and preservation of the original geometry before commit.

Browser: keyboard stroke on floor 15 added four blocks (656→660), Undo returned to 656 and Redo to 660. Pointer drag placed a continuous five-block row (662→667), and one Undo returned to 662. No browser errors or warnings. Discarded the test draft without altering the saved city.

Source milestone only; hosted publication remains pending the existing Sites export approval. No save-schema change. Local preview serves this milestone.
