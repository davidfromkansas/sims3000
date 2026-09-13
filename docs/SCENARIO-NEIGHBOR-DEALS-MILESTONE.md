# Scripted neighbor contracts — milestone 6 checkpoint

Scenario authors can now enable or disable real neighbor contracts from scheduled event rows or structured routine actions. Choose a neighbor, resource, import/export direction and (when enabling) 25, 50 or 100 units. Overseas ports support garbage only. Controls normalize this choice and omit amount for cancellation. Coordinates do not apply.

Enable uses the first registered working connection that can carry the resource and the current contract quote. A matching active contract keeps its existing amount and price. Another contract on the same neighbor/resource pair is left intact and the command is skipped. Missing connections and unavailable neighbor supply/disposal capacity also produce a recorded skip. This does not automatically construct or register a connection. Local exports still need actual surplus: the ordinary simulation can mark a newly signed export failed when it cannot deliver.

Disable ends only the chosen direction's matching agreement, using the existing termination rules: twelve monthly payments if less than twelve months old, otherwise no termination fee. Repeating a command does not duplicate an active agreement or charge again for an already-ended agreement. Monthly history includes scripted cancellation fees exactly once. Players can still manage contracts through Region.

Scenario status and routine receipts record the outcome, contract ID where applicable, and cancellation fee. Save schema114 validates these receipts and loads schema113 cities. Loading never reruns commands. Changes recompute utility state immediately so a later branch in the same routine can inspect the new deal status.

The manual (pp.186, 191) describes Enable/Disable Neighbor Deal as creating or disabling deals, but does not specify their full parameters or fee treatment. Using this game's current quotes, connection registration and normal cancellation fees is an explicit implementation interpretation, not a claim of original executable behavior. Original balance and a complete scenario virtual machine remain unfinished.

Validation: all 184 regression suites passed; subsequent targeted tests passed for both actual authoring editors and contract execution. Coverage includes 24 land neighbor/resource/direction combinations, conflict and repeated-command behavior, save/load, malformed receipts, same-routine status branching, mature contracts, multiple same-month cancellation fees and actual worker/direct continuation equivalence. Cache graph: scenario-neighbor-deals-1. No browser visual acceptance was completed; the last computer-use check reported a locked Mac.

Feedback exercise: register an eastern power connection, schedule an import for month 1, inspect its receipt, then schedule cancellation for month 2. Check the Region agreement and Budget penalty, save/reload, and confirm a repeated cancellation costs nothing.

This checkpoint is source-only. Sites remains at v150. Automatic approval review rejected repository export to Sites pending explicit user authorization; no source push or deployment was retried.
