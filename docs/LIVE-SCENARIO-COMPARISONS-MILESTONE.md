# Compare live scenario values

## Manual evidence and player functionality

The command reference on printed page 187 describes Equal as comparing two values. The current condition model previously required one metric and a fixed numeric threshold. This milestone lets authors compare a city measure or saved counter with another live measure/counter, for example current population versus a recorded starting population. The existing six comparisons apply, with constants still the default. This is an adapted structured interface, not original script-file compatibility.

## Runtime foundation

A condition can now contain right: {metric, area?} instead of target. The existing left metric and optional area remain unchanged. Validation rejects ambiguous constant-plus-live operands, unknown metrics and invalid spatial areas. Each operand is evaluated when the condition runs; unavailable/nonfinite values make the condition false, including Not equal. Reports name the second metric instead of displaying a numeric threshold.

Variable-reference traversal and deletion now include the right operand. Goal-status reference validation checks both sides. Schema 160 rejects live comparisons in files claiming an earlier version.

Focused checks pass for changing saved targets, same-group counter updates, a scheduled ending, a routine branch, save/reload continuation, replay, all six comparison operators at equality, invalid/ambiguous operands, variable removal/remapping and undefined goal references. Existing constant-comparison and variable suites also pass.

Remaining: second-operand controls in scheduled/rank conditions and routine branches, sparse goal-row mapping on both operands, variable-selector refresh/deletion integration, spatial-operand authoring checks, cache/current-version updates, full regression, browser playthrough, feedback exercise and milestone PR. No editor or browser acceptance is claimed yet.

Branch codex/live-scenario-comparisons starts from merged main 82a33e81 (PR #195). Sites publication remains separately pending source-export authorization.

## Editor integration

Scheduled-event and rank condition rows now offer Fixed threshold or Another city/scenario value. Both operands can use their own spatial area when supported. Switching back retains the numeric threshold. Routine branches offer equivalent controls and retain the last selected live operand when toggling modes. Goal-status references on either side map through occupied goal rows; variable collection refresh/removal includes the second operand.

Actual editor-handler tests pass for live conditional dispatch, independent left/right areas, retained thresholds and sparse goal references. Routine-editor checks cover mode changes without ambiguous target fields, preserved live choices, right-side variable removal guards and right-side goal mapping. A real landmark fixture compares one neighborhood against another; building/demolishing a landmark changes the right-side count independently.

Cache key: live-scenario-comparisons-1. Current-version assertions now expect schema 160; historical assignments/gates remain unchanged. Checkpoint 8 adds a live-comparison exercise while retaining earlier feedback. Full regression is running in /tmp/sims3000-live-comparisons-tests.log (session 44137).

## Browser playthrough

Local tab 71 authored Progress (initial 0) and Recovery target (initial 2), a monthly +1 progress event, and an ending whose condition compares variable1 ≥ variable2. Renaming the second counter to Recorded target preserved the selected right operand and refreshed its label. The challenge won in month two with Progress at 2, and its live-comparison explanation appeared in event history. Reload retained the win and result message. Confirmed replay restored the counter event to 0/3 occurrences and the conditional ending to pending 0/1. The browser is paused at this replayed start.

Remaining: visual/narrow-width comparison-control review, full regression outcome and milestone PR. The running full-test handle is 44137; the last poll confirmed it was still active. No complete game-fidelity claim is made.

## Validation complete

All 337 registered commands passed, with 379 PASS records and exit code 0 in /tmp/sims3000-live-comparisons-tests.log. The full run covered runtime cache version 1. Final browser review then found that dialog label styling overrode the threshold label's hidden state. A scoped visibility rule and threshold-label ID correct that presentation issue; cache version 2 contains the fix. The actual editor-control suite passed after the correction.

At 390×844 the final comparison controls were visually inspected. In live mode, the threshold's computed display is none and the right operand is visible; switching back restores threshold 10 and hides the right operand. Page width is 390 and dialog/content widths are both 350. The viewport was reset and the draft exited unapplied. This final correction affects visibility, not comparison evaluation or saved data.

This bounded milestone is ready for its PR. Full game/manual fidelity remains incomplete and Sites publication remains separately pending source-export authorization.
