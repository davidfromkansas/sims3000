# Event-driven goals: acceptance and implementation record

Implemented in schema 98, with simulation and real editor-handler regression coverage. Browser acceptance remains pending. The source evidence below records the pre-change gap.

## Verified gap

The supplied manual’s Goal Manager has Add At Startup (printed p.179), and its command reference includes Add Goal (printed p.185). Authors can introduce another goal after play begins. The current implementation only supports a fixed list of up to four simultaneous objectives or sequential stages. `revealWhenActive` hides a later sequential stage; it does not activate a goal through the event system.

Source evidence reviewed 2026-09-13:

- `dist/custom-scenarios.js`: `validateCustomDefinition` accepts together/sequence; `customCurrentGoals` hides only later sequential stages; `advanceCustomStreak` evaluates the fixed objective list.
- `dist/scenario-events.js`: `SCENARIO_EVENTS` has no Add Goal action. Events already support conditional, repeated and grouped execution.
- `dist/scenarios.js`: automatic victory uses every displayed scenario goal’s done value. Activation must not accidentally allow victory from an empty list or bypass unfinished required events.
- `dist/scenario-editor.js`: goal rows have text and sequential reveal controls; event rows have no target-goal selector.

The reviewed manual text establishes Add Goal. It does not establish a Remove Goal command, so removal must not be represented as a documented requirement without further source evidence.

## Player-visible acceptance checkpoint

Author a challenge with a population goal active at startup and a pollution goal initially inactive. Add a conditional event that activates the pollution goal after a chosen metric threshold. During play, only active goals appear in Scenario status. When the event runs, the new instructions appear and the player must satisfy the new goal. Export/import during the attempt preserves which goals have activated. Restart restores the initial goal set.

## Required implementation and verification

1. Preserve existing simultaneous and sequential challenge behavior and all existing city exports. Keep sequential reveal distinct from event activation; define their interaction explicitly before shipping.
2. Add an authoring control for startup activation and a labeled Add Goal event target. Resolve editor rows to validated objective identifiers without targeting an empty or removed row accidentally.
3. Store activation state and its challenge month in the attempt, separately from the immutable definition. Repeated activation is idempotent. Invalid goal references are rejected before a challenge starts or a save loads.
4. Evaluate active goals for visible progress and sustained completion. Adding a requirement resets an existing hold streak. Automatic victory must still respect pending required events, active emergencies and the deadline; an empty goal list must not accidentally win.
5. Preserve action order in grouped events. Define whether same-month activation participates in that month’s goal check, consistent with the existing event-before-progress pipeline.
6. Test real editor handlers, conditional activation, repeat behavior, deadline loss, hold-streak reset, grouped execution, save/load continuation, replay and legacy migration. Review the actual victory calculation rather than relying on new helper tests alone.
7. Update in-game milestone feedback, documentation and the module cache version only when the complete authoring/play/save loop is ready. Commit, create/merge the PR and publish as one milestone.

Implementation now lives in scenario-goal-activation.js and the scenario definition, event, editor and save flows. The final semantics and verification are recorded in CURRENT-FIDELITY.md. This milestone does not complete the overall reconstruction goal. Browser acceptance remains separately pending.
