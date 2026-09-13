# Close-up building inspection

Players can zoom the designer preview from 50% to 600%, drag to pan, rotate in either direction and reset the camera. Wheel zoom preserves the model point under the cursor. With the canvas focused, plus/minus zoom, arrow keys pan (Shift increases the step), and Home or Escape resets. Zoom interrupts a pending drag rather than letting a later pointer movement undo the zoom. Browser-modified wheel gestures are left alone.

The same view transform covers the model and construction guides. Preview controls never change model dimensions, city artwork or file data. Loading a different style/footprint or importing a draft resets framing. Apply/import/export actions now share the settings column, so the preview remains visible while reaching bottom actions; the canvas adapts to shorter desktop windows.

Manual basis: page 152 describes model navigation using zoom, both rotation directions and pan. This is an adapted browser camera rather than the original highlight-frame/widget navigation.

Validation: all 214 regression suites passed. Camera tests cover anchored zoom across limits, CSS-to-canvas coordinates, pan cancellation, gesture interruption, keyboard controls and button boundaries. The actual designer-handler test checks balanced canvas transforms and confirms camera movement leaves serialized city data unchanged. Browser checks verified 244% zoom, drag, counterclockwise rotation and Home reset, with no console errors. After the layout correction the whole canvas occupied y=82…466 at 1280×720 while bottom actions were accessible. The draft was discarded without applying it.

Feedback exercise: zoom into facade details, pan to the roof, rotate both ways, and reset. Repeat while a layered edit guide is visible. Camera state is temporary and does not travel in a building file.

Cache building-preview-navigation-2; save schema 120 unchanged. Source only; Sites publishing remains pending explicit export authorization.
