# Authored tornado paths — milestone 6 checkpoint

Scenario authors can now set the direction, intensity, travel distance, speed and early-warning option for a tornado. Both scheduled event rows and structured routine actions expose these controls. Event reports and routine history show the complete settings; the active city label and Emergency panel show response progress.

The manual (p.189, Start a Tornado) names all five controls but does not specify ranges or formulas. This implementation offers eight compass directions plus the existing automatic inward direction, intensity1–100, travel distance1–256 tiles, and slow/normal/fast speeds. The starting tile counts toward the path distance and storms end when they leave the map. Diagonal movement visits successive diagonal tile positions, applying the existing three-by-three damage footprint at each position. These ranges and damage coefficients are explicit reconstruction choices.

Normal speed affects one path position per response step. Fast affects two successive positions, including all intermediate damage. Slow waits one response step between positions without repeating wind damage. Secondary fires continue responding to their own existing clock. Intensity scales surface destruction and secondary-fire chances; intensity50 preserves prior wind behavior. Buried pipes and subway tunnels retain their protection; exposed tunnel portals can still collapse.

With early warning enabled, eight response steps pass before wind damage begins. Players can sound the existing siren to seek shelter during that interval. With warnings off, damage begins at the first response step; siren preparation cannot be applied after impact. The existing trust and shelter rules are unchanged.

Schema116 saves intensity, distance, speed and the slow-movement waiting phase with the active storm. Earlier saves migrate to intensity50, distance24, normal speed and no pending movement pause, preserving their warning countdown and path direction. Old scripted actions without settings, manual storms and random storms retain automatic direction, intensity50, distance24, normal speed and early warnings.

Validation covers eight path directions, invalid settings without mutation, seeded intensity differences, identical wind-damaged road tiles at all three speeds, complete intermediate fast damage, no repeated slow damage, buried utility survival, map-edge exit, eight-step warnings and siren behavior, saved slow-phase continuation, old-save migration and strict current-state validation. A playable scheduled diagonal storm holds victory during response and wins after saved continuation. A structured storm routine likewise resumes its next action only after the emergency ends. Actual editor handlers submit all five settings.

Feedback exercise: author a short diagonal storm with warnings off, then compare the same path at slow and fast speeds with warnings on. Save during a slow movement pause, reload and continue. Assess whether the controls make storm difficulty, preparation time and recovery goals understandable.

Browser acceptance remains pending with the Mac locked. Sites source export and deployment remain blocked pending explicit authorization; neither was retried.

Validation completed: all 188 regression suites passed. Cache graph: tornado-controls-1.
