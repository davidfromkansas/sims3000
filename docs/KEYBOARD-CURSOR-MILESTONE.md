# Stable keyboard construction cursor

After arrow-key navigation, passive pointer motion or leaving the canvas no longer changes or erases the selected tile. Enter builds at the displayed keyboard cursor. Clicking the map explicitly resumes pointer control; Escape, blur and gesture cancellation release keyboard ownership. A replaced city cannot inherit ownership from the previous city. Keyboard ranges retain their existing behavior. Help explains how to return to mouse construction.

The pre-fix reproduction executed the actual pointerleave handler after moving to tile (21,20), which cleared renderer.hover and prevented Enter from building. The pointermove handler could similarly replace the selection with its mouse hit test. The fix gives keyboard input ownership of hover until an explicit handoff, scoped to the current city.

Validation: focused regression executes the application's actual pointer handlers and verifies that keyboard placement is preserved, the unwanted mouse tile is untouched, explicit pointerdown resumes mouse control, and cancellation/city replacement release ownership. Existing rotated keyboard/range tests pass. Browser QA rapidly moved to tile 48,24, immediately built a park and inspected the same tile. All 252 suites passed: the full run passed 251, and the toolbar fixture passed after its extracted-handler harness was given the new release helper.

Feedback checkpoint: choose a tool, move with arrows, move the pointer outside the map, then press Enter. The selected tile should remain stable. Click the map to switch back to mouse construction.

Save schema remains 128. This is a browser control adaptation, not a claim about the original game's keyboard design. Sites publication remains at version 150 pending explicit source-export authorization.
