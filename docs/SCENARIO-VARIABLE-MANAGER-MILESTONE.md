# Named scenario variables

## Confirmed manual gap

Manual printed pages 177 and 181–182 describe creating and naming variables in a Variables Manager and selecting them in commands and messages. Current `scenario-variables.js` instead requires exactly four definitions and four saved values; `scenario-metrics.js` exposes only variable1 through variable4. The editor renders four fixed rows. Arithmetic and structured routines already exist, so the missing functionality is collection management and its reference integration.

## Player-facing milestone

Create additional named counters for a complex challenge, use them in goals, conditions, arithmetic and messages, then export/reload and continue playing. Rename a counter without breaking its uses. Remove an unused counter while keeping later references attached to their intended variables; explain any references that prevent removal.

Implementation will retain four default rows for existing workflows and support up to 32 named variables as an explicit browser implementation bound, not an original-game limit. Definitions and saved values must agree on length. Old four-variable cities must keep their exact values, progress and message behavior.

## Required integration

- Variable definitions, current values and scenario replay initialization.
- Metric selectors, arithmetic operands and variable assignment targets.
- Goals, nested conditions, rank conditions, scheduled actions and routine actions.
- Live text placeholders and displayed names; removal cannot silently redirect a reference.
- Editor add/rename/remove controls and portable/save validation, including old-schema gates.

## Acceptance

Author a challenge using at least six named counters and both direct events and a reusable routine. Check arithmetic, goal outcomes and expanded messages before and after saved continuation. Rename a referenced counter; verify its uses still identify it. Reject deletion while referenced, then remove an unused earlier counter and verify higher references retain their meaning. Replay must restore all initial values. Browser review must cover adding/removing rows and refreshed selectors without losing other draft settings.

Status: implementation in progress on codex/scenario-variable-manager, based on main merge 39ea6621. This milestone is not complete or published.

### Reference-preserving collection foundation

`scenario-variable-references.js` now enumerates interpreted references across goals, nested event/rank conditions, variable assignment/copy/calculation actions, nested routine branches and live message fields. Removing a referenced variable is rejected with the locations that use it. Removing an unused earlier row returns a new definition and shifts later targets, metrics and placeholders together. Each message is rewritten once, even when it contains repeated placeholders. Literal scenario titles, goal/rank names and routine names retain their text.

The focused regression passes for a six-counter definition with nested routines, repeated placeholders, protected deletion, invalid references and immutable input drafts. It is registered in the main test command. The player-facing editor controls are still pending; this foundation does not yet complete the authoring workflow.

### Runtime and saved continuation

Definitions now accept one to 32 named counters. Metrics, assignment actions and calculations support that range; definition-level validation checks goal, condition, action, routine and message references against the actual collection. Saved current values must match the definition length exactly. Schema 158 preserves expanded collections and rejects a non-four collection masquerading as an older save. Legacy missing definitions still receive four default counters.

A six-counter playthrough executes recurring direct assignments and a routine that calculates production and copies its score. It reaches victory with the expected expanded message, agrees after save/reload continuation, and resets every initial value on replay. Removing its unused first counter produces the same outcome with shifted references. Rename retains event/routine references; duplicate names are rejected. All 59 scenario test files passed at this checkpoint. Add/rename helper checks also passed after that run. This is source work in progress, not a published or browser-accepted milestone.

### Editor collection and browser review

The editor now adds/removes rows and refreshes named metric/assignment choices while keeping the other draft fields. Used counters cannot be removed; visible messages and later selectors remap after unused-row removal. Routine and copied-step references participate in the deletion check. Copyable source routines remap after unused-row removal; if a required source counter was deleted, copying explains why it cannot proceed. New challenges based on a custom challenge retain its variable definitions, and message previews read draft initial values.

Browser review on local tab 71 added fifth/sixth counters, renamed the sixth to Final score, selected it as Goal 1, verified deletion was blocked, then removed unused row one and confirmed the goal still selected Final score at variable5. The challenge title remained intact. The draft was exited through Back without applying it. The variable-row layout was visually inspected at 1280×720. This browser review preceded the final source-routine-copy and draft-preview refinements; those have focused program-editor checks, not yet browser acceptance.

All 59 scenario test files passed after the first editor integration. Subsequent program-copy guards passed focused editor tests. A full regression run is in progress in /tmp/sims3000-variable-manager-tests.log. Runtime asset key is scenario-variable-manager-1.

### Final browser playthrough and feedback

A challenge authored through the local browser used six variables, with Final score initialized to 8 and an event adding 1 in month one. Its goal required variable6 ≥ 9. The draft message preview expanded to 8, the event produced 8 → 9, and the scenario won in one month. Reload retained the won state. Restart through the confirmation restored Current: 8 and the pending 0/1 event. Opening another draft inherited all six definitions, including Final score and its initial 8.

At 390×844 the variable name, initial value, remove and add controls were visually reviewed. Page width was 390; dialog and content widths were both 350, without horizontal overflow. Viewport override was reset. The second draft was exited unapplied. The local city now holds the replayed six-counter challenge, paused at its start.

Checkpoint 8 now includes adding six counters and checking reference preservation on rename/removal; existing notes and earlier exercise keys are retained. The first full regression stopped at an outdated current-version assertion (157 instead of schema 158). Only current-version assertions were updated; historical compatibility gates remain unchanged. Replacement full run: /tmp/sims3000-variable-manager-tests-2.log, session 27240.

Remaining: milestone PR and merge. Publication remains separately pending authorization.

The checkpoint regression was also updated from three to five authoring exercises. It explicitly verifies that the existing author/change/replay feedback remains saved and that the new counter exercises begin unchecked. The focused checkpoint test passes; the full run subsequently passed that test and is continuing.

### Validation complete

The replacement full regression completed with exit code 0: all 335 registered commands, 372 PASS records. The log is /tmp/sims3000-variable-manager-tests-2.log. No runtime changes followed that run. This milestone is ready for its GitHub PR; publication to the existing Site remains pending the separate source-export authorization. This validates the bounded named-variable milestone, not complete Scenario Creator or game fidelity.
