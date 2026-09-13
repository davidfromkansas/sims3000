# Anchored two-way camera rotation milestone

The city-view controls now expose both clockwise and counterclockwise buttons, matching the manual’s navigation controls on pages 40–41. Existing bracket shortcuts remain available, including with hidden toolbars.

Rotating now preserves the screen position of the ground tile under the viewport center. This keeps a panned neighborhood in view while inspecting different building sides, instead of rotating it away around the center of the whole map. The picker accounts for raised terrain; both directions update the city view and shared navigation orientation. Zoom, simulation, buildings and saves remain unchanged. Active construction gestures are cancelled before either turn.

If the camera is entirely off-map, the middle map tile provides a finite fallback anchor. The exact camera-pivot choice is a reconstruction usability decision, not a recovered original algorithm. Save schema remains 119.

Feedback exercise: pan to a neighborhood far from the map center, zoom in, then use both rotation buttons and the [ / ] shortcuts. Verify that the neighborhood stays in place and construction previews do not retain a stale drag anchor.

Validation uses the actual renderer’s projection and picking across 48-, 96- and 256-tile maps, three zooms, raised terrain and all four orientations. It checks inverse turns, four-turn restoration, off-map fallback, unchanged city serialization and actual app button/gesture wiring. All 203 regression suites pass. Local browser testing inspected tile 21, 25 before and after both button directions at increased zoom; it remained under the same screen point, with no browser errors. The city remained paused at 224 residents and §42,500. Player feedback remains pending.

Source only; Sites publication remains pending explicit source-export approval.
