# Traffic in the viewed neighborhood — milestone 3 visual checkpoint

Busy neighborhoods far across a large city now show cars, highway vehicles and trains when the player pans to them. Previously, the display caps were filled by routes near the beginning of the entire map; off-screen samples could leave a busy visible district apparently empty.

Road/highway samples now come from connected, loaded segments within the camera’s padded view. A stable spatial ranking spreads the shared 180-vehicle display budget around that neighborhood. A bounded selection heap retains at most 180 candidate templates, including while zoomed out. The existing direction, lane, color, congestion speed and motion phase formulas are retained, so repeated paused draws remain identical. Moving the camera changes which decorative samples are shown, not simulated commuters or traffic loads.

Train routes are traced from the same passenger-carrying rail network as before. Coaches outside the view no longer consume the 72-coach display budget. Actual path bends, bridge alignment, travel/dwell timing and cab direction remain unchanged. All coach positions use the shared scenery clock.

Road templates are reused until the camera or simulation data changes. Rail paths are reused between simulation changes and filtered for the current view as coaches move. Panning, zooming, rotating, resizing, constructing/removing routes, recomputing city loads and switching cities refresh or discard the appropriate data. Switching cities also releases old traffic references when vehicle display is disabled. Existing minimum-zoom and vehicle-visibility controls remain effective.

These are decorative samples driven by actual computed loads, not individual schedules or additional residents. Simulation state and schema116 are unchanged. The exploratory JavaScript draw profile used a no-op canvas; it does not establish browser frame times or GPU performance. This checkpoint fixes visible activity and avoids repeated route preparation, without claiming an FPS improvement.

Validation executes the actual city renderer against a 256×256 fixture whose original whole-map vehicle budgets are exhausted in the opposite corner. The viewed district receives more than 100 road/highway samples plus trains through all four rotations, with samples spread across at least three quadrants. Tests verify deterministic pause positions, moving phases, cache reuse, camera invalidation, actual bulldozing/recalculation clearing obsolete traffic, city switching while vehicles are hidden, minimum zoom, unchanged saved state, and bounded selection matching a full-sort reference. Existing traffic and rail motion/bridge tests remain in the regression suite.

Feedback exercise: pan between busy neighborhoods on opposite sides of a large city, rotate and zoom, then pause. Look for local activity in each view and stable paused positions. Remove a loaded route and confirm its traffic disappears after the city recalculates.

Browser visual acceptance remains pending. The most recent computer-use check found the Mac locked. Sites export/publication still require explicit authorization following automatic approval rejection; neither was retried.

All 190 regression suites passed. Cache graph: visible-city-traffic-1.
