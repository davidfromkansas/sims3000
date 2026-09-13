# Multi-neighbor contracts — integrated source milestone

The integrated source milestone supports one contract per resource per neighboring city, with network-local allocation, independent billing/penalties, protected renewals and saved continuation. Regression set:172 suites; schema111. Historical checkpoints below are superseded by the final checkpoint. Sites publication and browser acceptance remain separately pending.

## Manual evidence and gameplay target

The supplied manual, printed pp.119–120 (local extracted text around4253–4292), allows utility connections to any or all land-adjacent neighbors. Imported power/water covers the deficit reachable from its connection point, charges actual use with a minimum fee, and does not supply disconnected districts. Export contracts require a promised quantity and can fail with penalties when the supplying network cannot meet its commitment.

Current `region.js` limits all cities to one contract per resource and `validateRegion` to three total deals. The Region window explicitly repeats that limitation. Multi-neighbor connections exist, but players cannot diversify supply contracts or sell to multiple neighbors. The milestone will make those connections useful together, with truthful per-contract deliveries/bills and network-local conservation.

## Foundation now implemented

`regional-allocation.js` provides pure network-local utility allocation. Imports fill only the local deficit, using lowest price first and oldest contract id for ties. Exports use only local surplus and try older contracts first, in full promised quantities; commitments that cannot be met fail. Imported deficit supply cannot be resold as surplus. Neighbors running short on imports leave unmet local demand rather than marking the player as failing an export contract. Garbage disposal contracts have a shared stable price/id ordering helper.

These priority policies are authored reconstruction choices; the manual does not expose its multi-contract allocation ordering. Every signed idle import retains its minimum fee, so diversification is not automatically cheaper. The caller must supply only contracts attached to the current connected network and already validated unique ids/terms. The helper does not enforce city/network or neighbor identity by itself.

`tests/regional-allocation.test.mjs` passes: conserved supply, combined finite imports, price/id priorities, stable export seniority, shortages, no deficit re-export, order independence and immutable inputs. It is not yet part of the release command. This is not proof of signing, actual network recomputation, saved continuation, UI or monthly settlement.

## Required integrated work

1. Allow one deal per resource per neighboring city (rather than one per resource globally), with a bounded total matching eligible neighbor/resource pairs. Reject duplicate resource/neighbor contracts even when they use different connection tiles. Keep connection-local service: a deal on one network cannot serve another network. Decide and enforce land-neighbor utility vs overseas-garbage eligibility.
2. Replace the existing sequential `tradeCapacity` loop with the allocator, preserving correct network import/export stats, generated power, conservation accounting and failure settlement. One same-resource deal per neighbor avoids allocating that neighbor's same surplus to several disconnected networks in one recompute. Verify this with actual city fixtures, not only helper math.
3. Review garbage import/injection/export code for conservation and order dependence. Route each shipment through its own road/rail/highway/port connection; prioritize cheaper disposal for reachable residual garbage. Incoming shipments may still exceed local disposal and accumulate under existing rules. Verify no duplicated imported waste or disposal capacity.
4. Update strict region validation, schema migration, saved histories and scenario contract metrics/limits. Inspect every assumption of a three-deal city or `.find` by resource. Keep renew/cancel operations keyed by contract id and preserve other neighbors' contracts.
5. Update Region proposal validation, quote text and active contract summaries. Explain per-neighbor resource limits, allocation order, minimum fees for unused backup imports, local export obligations and finite supplier capacity. Do not present minimum quantity as an import cap; manual-style imports cover actual connected deficit.
6. Test real multi-network/multi-neighbor city setups: combined imports, outage/shortage backup, cheapest-supply selection, multiple exports and exact penalties, mixed disconnected import/export networks, garbage conservation, monthly neighbor budgets, renew/cancel isolation, save/replay/worker and actual UI handlers. Run the full regression suite after integration.
7. Add a feedback checkpoint for diversifying supply, diagnosing network-local shortages and reviewing individual contracts. Update release docs/schema/cache/test count only for the integrated milestone, then create/merge one GitHub PR. Do not push or deploy to Sites without explicit approval.

Preserve unrelated untracked `tests/scenario-comparisons.test 2.mjs`.

## Utility network integration checkpoint

The branch now signs one contract per resource per neighbor and validates up to13 contracts (four land neighbors × power/water/garbage, plus overseas garbage). Another connection to the same neighbor cannot bypass the per-resource limit. Saved utility contracts with an overseas side are rejected. Schema111 accepts the previous110 saves; the cache graph still deliberately remains `scenario-programs-1` until the whole milestone is ready.

`tradeCapacity` filters eligible contracts to the current network, delegates to the allocation core and writes each contract's delivery/failure result. Utility imports combine finite neighboring surpluses, exports use local surplus and cannot resell deficit imports. Garbage exports now iterate the shared price/id order; actual multi-contract garbage conservation still needs its own integrated fixtures before release. No other resource-level `.find` assumption was found in the source inspection; renew/review operations use contract ids.

`tests/multi-neighbor-trade.test.mjs` passes with a real48×48 city: four contracts (two neighbors for each of power and water), combined finite supply, an isolated district excluded from both services, per-contract minimum charges, array-order-independent deliveries, an exhausted supplier covered by the other neighbor, strict duplicate import rejection, exact saved monthly continuation and cancellation preserving other contracts. Existing region, neighbor-economy, annual-review and conservation suites pass. The allocation helper suite passed in the prior checkpoint. No full regression run has occurred after this integration yet.

Next: real multi-export/penalty tests, disconnected import/export networks, multiple garbage routes and neighbor accounting; then Region UI copy/proposal behavior, saves/replay/worker and the final full regression. The live Region UI still says one deal per resource and must be updated before release. New tests are not yet in the release command. No commit, PR or publication.

## Export, garbage and Region UI checkpoint

`tests/multi-neighbor-exports.test.mjs` now exercises two actual power-export contracts sharing four wind turbines, loss of one turbine, stable allocation to the older contract and exact penalty/removal of the younger failed contract. It exposed an annual-review issue: increasing an older commitment could succeed while breaking another existing deal. `renewDeal` now rolls the entire region back when renewed terms newly fail any existing contract. Existing annual-review regressions pass.

The same suite covers two garbage export routes sharing connected waste, finite30/40-unit neighbor disposal allocations, stable reversed-array behavior, two further neighbors shipping incoming garbage through their own routes, conserved injected mass and individual neighbor settlement balances. These fixtures call actual network/recompute/shipment/settlement functions. A full monthly multi-garbage playthrough is still needed before release; do not equate the direct shipment fixture with the whole tick pipeline.

The Region UI now explains one contract per resource per neighbor (up to13 eligible pairs), cheapest connected imports/disposal, older export commitments, no resale of deficit imports and separate minimum fees for idle backups. Proposal controls disable duplicates for the selected neighbor/resource while allowing another neighbor. Contract rows retain independent review/cancel controls. `tests/multi-neighbor-ui.test.mjs` passes through actual dialog handlers: duplicate proposal disabled, second-neighbor signing, persisted updates, policy copy, and cancellation isolation. This is a Node control harness, not browser acceptance.

There are four new suites so far (allocation, real imports, exports/garbage and UI), for172 total once included. The release command still contains168. No full regression run since integration, and no milestone commit/PR/publication. Remaining gates: full monthly garbage ledger, disconnected import/export networks, multi-contract worker/replay coverage, final validation bounds and full regression; then release docs/schema/cache and one PR.

## Final integrated checkpoint

Multiple utilities contracts now share a connected network's deficit or local surplus without duplicating supplier capacity. Imports and garbage disposal follow lower quoted unit price first, with original contract id breaking ties. Utility exports try original signing order and require each full promised quantity. These are authored priorities, not recovered original algorithms or a claim of mathematically minimizing total bills. Every signed purchase/disposal contract retains its own minimum fee.

Three real monthly garbage ticks conserve waiting waste plus generated/imported waste against disposal/export/uncollected totals, matching per-deal exports and saved continuations. A96×96 fixture imports power on one grid and exports locally generated power on another; the actual worker handler matches direct ticking without mutating its source city. Challenge replay restores the initial contracts. The region validator accepts all13 valid pairs, rejects excess/duplicate contracts and overseas power/water, and old schema110 saves migrate.

All172 suites passed, followed by targeted validation-bound checks. Actual Region handlers cover signing, duplicate prevention, persistent updates and cancellation isolation. Renewals roll back if their changed terms newly break another contract. Browser interaction/layout remains unverified; the published site remainsv150 pending explicit source-export approval. Original neighbor names, prices, priority rules and aggregate city economies remain reconstruction choices; full neighboring tile maps remain outside this milestone.
