# Changing scenario instructions and results — milestone 6 checkpoint

Scenario authors can now change the text players see in Scenario status while a challenge runs. Set progress dialog text replaces the current instructions. Set result dialog text selects the victory message, loss message or both. Both commands are available as scheduled/conditional/repeating events and as structured routine actions.

These actions implement the manual’s Make Dialog Text (p.188) and Set Results Dialog (p.189) capabilities. They update the stored status/result text without opening an additional popup. Authors can place a separate popup when immediate attention is needed. Text actions may run on the deadline month, before the ordinary victory/loss check.

Each action accepts up to 1,500 characters of plain text. Named live values are expanded when the action runs, following the existing announcement convention; the captured result is bounded to 4,000 characters. Set a result message near the ending when it needs final city figures. Captured text is not re-expanded later. Unknown placeholders remain literal. Display escapes markup and preserves line breaks. A value that expands to empty text can clear the displayed instructions/result. Control characters introduced by a substituted value are removed.

The original scenario definition stays unchanged. Schema117 saves the current text overrides independently from capped routine message history. Overrides must match the targets of executed text commands; missing, unsupported or malformed fields are rejected. Loading does not rerun commands. Repeating an action captures fresh values each time, and later actions replace earlier text for their selected targets. Restart/playable-start export uses the original briefing and result definitions, with no runtime overrides. Schema116 and older challenges without these commands load with their original messages.

Validation includes captured values, escaping/line breaks, no popup side effect, independent/both outcome targets, deadline loss text, repeated replacement, unchanged definitions, save continuation, replay reset, an empty captured value, a bounded long expansion, text surviving eviction from a long routine’s 32-message history, malformed overrides and missing execution provenance. Actual editor handlers submit both text actions with the appropriate text length and outcome selector. All 191 regression suites passed, plus the subsequent long-expansion check.

Feedback exercise: start with a construction briefing, change it after a first objective is achieved, then set a result message immediately before a scripted ending. Save during the challenge and reload; confirm the current instructions remain. Restart and check that the original briefing returns.

Browser visual/interaction acceptance remains pending. Sites source-export/publication authorization is still pending following automatic approval rejection; neither was retried. Cache graph: scenario-dialog-text-1.
