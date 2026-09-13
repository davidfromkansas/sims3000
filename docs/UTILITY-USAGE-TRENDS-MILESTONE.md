# Utility usage planning milestone

City data now includes power and water supply usage, demand, available local supply and unmet demand histories. An expandable Utilities summary shows current values and provides three comparison shortcuts: power demand/supply/unserved, water demand/supply/unserved, or both usage percentages. Players can compare current shortages with 1-, 10- and 100-year records.

Manual page 69 names Power % and Water % usage graphs. This reconstruction defines usage as delivered local supply divided by available local capacity after actual imports and exports. With zero available supply it records zero percent; the table says No supply and unserved demand remains visible. This convention is explicit rather than a recovered original formula. The other series and shortcuts explain that percentage to the player.

Totals include distinct networks, so a low citywide usage percentage can coexist with a local outage. Unserved demand uses actual delivery, not merely demand minus total capacity. Overlapping pipe catchments do not double-count consumption. The detailed Utilities report remains the place to inspect individual network shortages.

New values are recorded from the next month. Older values are not inferred. Optional history fields require no save schema change (119). The existing delivered-electricity history retains its monthly accounting semantics; these new planning values use the end-of-month network state consistently.

Feedback exercise: compare power demand, available supply and unmet demand. Build a spare plant on an isolated grid, then connect it. Verify that adding capacity alone does not erase the outage. Repeat with water sources and pipes; compare utilization before and after conservation or utility trade changes.

Validation covers real overloads, disconnected reserves, delivered imports, overlapping pipe catchments, zero supply with unmet demand, monthly recording, exact save continuation and missing old records. Actual report handlers select all three presets and render their graphs.

All 200 regression suites pass. Local browser testing verified the summary and all three shortcuts across eight recorded months with no browser errors. Utility percentages use a fixed 0–100 scale for comparison. The pre-test city is restored from its named library backup after QA. Player feedback remains pending.

GitHub source milestone only. Sites publication remains pending explicit source-export approval.
