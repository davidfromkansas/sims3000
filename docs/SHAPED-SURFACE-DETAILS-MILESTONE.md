# Details on sloped building blocks

Triangular wedge walls now accept brick/glass/roof-material patterns and all four wall detail types. Stamps keep a rectangular wall frame, then their polygons are clipped to the actual wedge boundary, including default facade windows. Details cannot spill above the slope. Sloped roofs retain their existing vent-only detail rule. Existing rectangular faces retain the same rendering.

This completes the triangular-wall decoration gap recorded in the sloped-block milestone. It does not complete the manual’s fourteen-block palette or original material/detail catalogs. Schema 125 and building format 8 are unchanged; detail placement still uses the existing floor-surface storage and undo workflow.

Validation: automated coverage applies all four details and materials across every wedge orientation and camera view, verifies every clipped vertex against the wall boundary, checks hidden stamps, preserves rectangular behavior, and roundtrips detail data. An isolated temporary browser rendering page displayed window and door stamps on all four orientations using the production renderer; clipping was visually verified. The temporary page was removed. No normal-city data changed.

Feedback: place a wedge in Building Architect, select Place building details, and stamp a window or door on its triangular wall. Try brick or glass beneath it, rotate the model, then remove the detail. The clipped portion follows the slope.

Local/GitHub only; Sites publication awaits explicit source-export approval.
