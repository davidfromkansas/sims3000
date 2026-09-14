# Section study — Construct navigation feedback

Import `section-study.building.json` into Building Architect, choose independent layers, then select Move layered edit planes. This original stepped model has eight- and twelve-layer sections. The review image pairs actual runtime workspace and overview drawing commands at 200% zoom in each rotation; it is not a browser screenshot.

1. Drag the green floor handle up/down. Confirm the grid, floor number, slider and highlighted model plane move together.
2. Drag the red west–east and blue north–south handles. Confirm that each selects the corresponding vertical cross-section without editing blocks.
3. Zoom in and rotate through four views. All three handles should remain reachable. Handles moved to the preview edge have connectors to their projected positions.
4. Drag a handle beyond the preview boundary. Further pointer motion should pan the model while keeping the drag active. Release must stop it.
5. Check that the hexagonal overview follows panning. Clicking the overview should not recenter Construct view; switch to Pan camera and confirm overview recentering works again.
6. Use arrow keys to move the selected plane and Shift+arrow for five positions. Apply and save without placing blocks: navigation must not alter the building.

Review focus: predictable direction, visible and distinct handles, useful cross-section feedback, comfortable zoom and reliable cancellation. Browser interaction, text enlargement and player acceptance are pending. The hexagon proportions and dedicated web tool activation are authored adaptations of the manual.
