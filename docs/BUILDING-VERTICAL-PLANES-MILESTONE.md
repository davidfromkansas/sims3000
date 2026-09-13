# Vertical building edit planes

Players can construct or erase tall walls and openings in one selection using either vertical cross-section, alongside the existing horizontal floor editor. West–east sections select a fixed north–south row; north–south sections select a fixed west–east column. Vertical grids show layer 24 at the top and layer 1 at the bottom. Plane position is bounded to the appropriate 24 floors or 10 rows/columns and clamps when switching orientation.

Single blocks, lines, rectangular planes, preview, cancellation, keyboard construction and Undo/Redo operate on the selected cross-section. The 24-row vertical grid scrolls independently. Switching views does not change the model. Existing 120-schema city saves and version-5 building files already preserve the underlying occupied blocks, so no format change is needed.

Manual basis: page 143 describes Left, Right and Bottom edit planes, each exposing a selected cross-section of the full building model. This adaptation provides the same three axis families through a labeled selector and position control. The model preview does not yet overlay a colored selection plane, and the original block-shape catalog remains incomplete.

Validation: all 212 regression suites passed. Tests prove that every plane family covers all 2,400 possible blocks exactly once, check world coordinates and top-to-bottom heights, construct vertical walls and perpendicular cuts, reject invalid slices, and exercise 240-cell editor rebuilding/history. Browser testing cut 36 blocks spanning six floors: the tower changed from 656 to 620 blocks. Undo of the rectangle restored 655 (the initial focus click had already erased one block); Redo returned to 620. The perpendicular slice showed the same edited model, with no console errors. The draft was discarded and New Haven remained 224 residents / §42,500.

Feedback exercise: select a vertical plane, erase a tall rectangular opening, inspect it from the perpendicular plane, and compare Undo/Redo. Keyboard selection is useful for rectangles taller than the visible scroll area.

Cache building-vertical-planes-1. Source only; Sites publication remains pending explicit export authorization.
