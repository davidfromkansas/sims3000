# Script-selected scenario ranks

## Confirmed manual requirement

Manual printed page 187 describes End Scenario as ending with a specified ranking. The Rank Manager on printed page 182 describes multiple degrees of success and results text. The existing implementation lets ending actions choose victory/loss but always selects the first matching rank rule afterward. Set Scenario Speed was checked during this audit: page 189 describes starting speed and player locking, which the current initial-speed policy already implements; no new timed-speed behavior is inferred from that text.

## Player-facing milestone

Author distinct endings for story branches and choose the rank each ending awards. Keep automatic rank matching as the default for old and new challenges. Both scheduled endings and routine action blocks should offer named rank choices. Sparse rank rows must map correctly, renaming must retain references, and deleting/clearing a referenced row must not silently redirect the ending. Results messages and selected awards survive saving and replay.

## Runtime work

Optional rankIndex on ending actions selects an existing compatible outcome rank. Explicit selection bypasses automatic rank conditions, because the script branch itself chooses that rank. Definition validation checks scheduled and nested routine selections. Saved outcome validation requires the award to match the triggered ending. Schema 159 gates the new field. Endings that omit rankIndex retain first-matching automatic behavior.

Focused tests pass for scheduled selection, two routine branches, automatic fallback, frozen expanded rank text, saved continuation, forged-award rejection, replay, missing/incompatible ranks and old-schema rejection. Existing ending and rank suites also pass. No browser or editor acceptance is claimed yet.

Remaining: scheduled/routine editor selectors, sparse rank mapping and copied-step references, result/report explanation, current-version test updates, cache refresh, full regression, feedback exercise, browser playthrough and milestone PR. Work is on codex/scripted-ending-ranks from merged main e8f0f7b2 (PR #194). Sites publication remains separately pending source-export authorization.

## Editor and browser checkpoint

Scheduled endings and routine actions now offer automatic rules or a named rank. Sparse rank rows map to compact definitions on submission. Renaming retains the selected row; clearing a referenced row shows an explicit missing-row option and rejects submission instead of silently selecting a different award. Routine copies and internal copied steps preserve row references. Copying a source routine with an explicit award requires a matching named destination rank and remaps it to that row.

The full editor regression submitted ranks in rows two and four, retained a renamed row four, rejected its empty state, then awarded the correct compact rank index one. Routine editor tests cover the equivalent sparse mapping, renamed choices, missing-row rejection, copied steps and source-routine imports.

Browser tab 71 authored Ordinary recovery in row two and Harbor rescuer in row four, selected row four in a month-one ending, renamed it Coast guardian, and observed the missing-row warning after replacing its name with whitespace. After restoring the name, the challenge awarded Coast guardian despite the earlier automatic rank. The chosen message appeared; reload preserved the award. Restart restored the pending ending at 0/1 occurrences. The browser is left paused at that replayed start. The status dialog was visually inspected at 1280×720. Branching endings and copied-step behavior have focused regression coverage, not an additional browser branch playthrough.

Checkpoint 8 adds an ending-rank exercise while preserving existing feedback keys. Cache key: scripted-ending-ranks-1. Current-version assertions now expect schema 159; historical schema assignments and compatibility gates remain unchanged. Full regression is running in /tmp/sims3000-ending-ranks-tests.log (session 75084). A supplemental source-rank-copy test passed separately after the run started.

Remaining: full regression outcome and milestone PR/merge. This is not complete game or Scenario Creator fidelity.

## Validation complete

All 336 registered test commands passed, with 375 PASS records and exit code 0 in /tmp/sims3000-ending-ranks-tests.log. The supplemental source-rank-copy test also passed separately. No runtime changes followed this full run.

A further browser draft selected Coast guardian in a routine ending action. At 390×844 the page width was 390 and both dialog/content widths were 350, without horizontal overflow. The screenshot at that scroll position showed the rank-definition fields rather than the routine action; no claim of a separate mobile routine-action screenshot is made. The viewport was restored and the draft exited without applying it.

The milestone is ready for its PR. The broader goal remains incomplete, and publishing the updated Site remains separately pending authorization.
