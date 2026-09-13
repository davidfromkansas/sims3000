# Underground water planning

Players can distinguish roads, vacant zones, developed zones and open terrain while laying water pipes. Actual supplied water takes precedence over surface colors; geometric pipe coverage alone does not turn a zone blue. Water terrain and radioactive ground use dark brown. This follows the water-pipe view described on manual page 118; the palette is original, not recovered original game artwork. Existing facility models and pipe connections remain visible.

The toolkit now preserves child heights while scrolling, preventing longer construction instructions from overlapping Map View controls.

Validation: 206 regression suites passed. The new test constructs a real powered tower, connects and removes pipes, checks supply transitions, renders all four orientations with surface-color override checks, and verifies no city-state changes from rendering. Browser inspection confirmed dry zone colors and the corrected toolkit at 1280×720; instruction box height 124.5 px contains its 123 px scroll content. No simulation formulas or save schema changes. Cache: underground-water-reading-2.

Feedback exercise: open Water view, compare empty and developed zoning, then connect a powered source. Check whether the visible surface use makes pipe placement easier. Broader mobile visual acceptance is still pending.

The founding play-test in qa/2026-09-14-founding-playtest.md is included with this milestone. Source only; publication remains pending Sites source-export authorization.
