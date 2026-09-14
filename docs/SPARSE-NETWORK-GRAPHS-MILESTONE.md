# Large-city network allocation checkpoint

Road/highway and rail/subway graphs now allocate adjacency lists only for existing network nodes. Absent nodes share an immutable empty list. Each real node retains its own mutable list, including disconnected isolated roads and tracks; ramp, bridge, tunnel and transfer edge ordering is unchanged. No persisted city fields or simulation rules change.

Previously the two graph builders allocated 262,144 empty arrays on a 256×256 map before examining its infrastructure. An empty map now needs only the two shared empty arrays; a developed map allocates additional lists for its actual road/highway/rail/subway nodes. Graphs are still rebuilt when requested, preserving the existing invalidation behavior.

## Measurements

Sequential Node v22.19.0 runs on the same Mac, three warmups and seven measured graph constructions per synthetic 256-map layout:

| Layout | Before median | After median |
| --- | ---: | ---: |
| Empty | 18.1 ms | 10.4 ms |
| Road grid | 23.7 ms | 14.6 ms |
| Mixed road/highway/rail/subway grid | 28.0 ms | 19.0 ms |

Run `node benchmarks/network-construction.mjs [absolute dist directory]` to reproduce. Raw samples and baseline commit are in `performance/sparse-network-graphs.json`. Whole-month dense routing measurements changed from 1,316 to 1,249 ms on the 256-map fixture; this modest difference is insufficient to establish an end-to-end responsiveness improvement. These measurements exclude browser rendering and organically grown cities.

## Verification and remaining work

Highway, rail, tunnel, landfill rail freight, job-routing and available-job-target suites passed. A separate comparison loaded the complete engine before and after this change, and matched every city field and monthly result through recomputation and two months on both 96 and 256 maps. Routing tests include disconnected markets, scarce jobs, bus/carpool use, rail/subway competition, fractional funding and seeded allocation order.

This is a local component of the responsive-metropolis milestone. The full regression, browser interaction measurements, long-running cities and milestone acceptance remain outstanding. Chicago architecture is separately committed in PR192; these performance edits are not yet committed or published. No separate small-feature PR is intended.

## Rail search reuse

Rail allocation now retains station proximity lookups, workplace-to-station destinations and stamped search buffers for one network recomputation. A new workplace-list identity rebuilds the destination index. Every allocation still reads current remaining jobs, so road commuters and earlier rail households can exhaust a workplace without stale capacity being assigned. Each visited search node receives fresh predecessor, distance and origin data. These caches do not survive a simulation recomputation or enter saved cities.

Three-sample synthetic transit benchmarks improved median monthly processing from 172 to 95 ms on a 96 map and from 1,942 to 861 ms on a 256 map. The latter fixture carries approximately 9,028 monthly train riders. These results include the preceding sparse graph change; they do not isolate the two optimizations or establish browser performance. Reproduce with `node benchmarks/rail-routing.mjs [absolute engine.js path]`; raw samples are in `performance/rail-search-reuse.json`.

The new frozen-reference suite compares each household allocation, every track/station/transfer load, remaining jobs and full statistics across rail/subway/mixed networks, zero/fractional/full funding, fractional passenger counts, exhausted jobs and reordered workplace lists. Complete before/after engine comparisons also match every city field and monthly result through two months plus a saved/restored third month on both map sizes. Rail and tunnel suites passed after the cache graph changed to responsive-metropolis-1. City schema157 is unchanged; 332 test commands are registered. The full regression is running in `/tmp/sims3000-responsive-metropolis-tests.log`; completion is not yet claimed.

Browser screenshots became available again during this checkpoint. Earlier lock failures remain historical; current runtime interaction and large-city browser verification have not yet been completed.

The full responsive-metropolis regression completed with exit0: 332 registered commands and 365 PASS records in `/tmp/sims3000-responsive-metropolis-tests.log`. The browser-only measurement page was refined afterward; it is not covered by the Node regression. The ordinary application was reloaded from the verified local responsive-metropolis-1 source, and its landmark gallery filtered Chicago to three of twenty-two entries. All three preview rotations updated to East, and the museum artwork was inspected in the browser. Broader architecture workflow acceptance remains pending.

An initial browser worker/renderer run accepted two view interactions and completed three months with save validation, but recorded a 308 ms maximum animation-frame callback gap. This run used a preliminary benchmark camera handler; it does not establish a smooth city experience. The revised page uses the actual anchored city-rotation helper, keeps the city visible above the report, and includes the next frame after the last worker response before ending the measurement. Remaining stalls require investigation before responsive-metropolis acceptance.

The revised browser test completed with two camera interactions, all three months in the actual simulation worker, and successful save validation. The visible dense district was inspected before measurement. Turnaround was 2,897/1,497/1,288 ms; 584 animation-frame callbacks had an 8.4 ms 95th-percentile gap and a 283.3 ms maximum gap. Raw observed output is in `performance/metropolis-browser.json`. This confirms an unresolved intermittent stall despite normally frequent callbacks; worker message cloning, response application and rendering still need attribution. No smooth-metropolis acceptance or browser speedup is claimed.

## Bounded worker transfer

A follow-up browser probe separated initial worker dispatch from drawing. Sending the entire 256-map city blocked the main thread for 120–139 ms per month, while the largest measured draw was 29.3 ms. The worker protocol now transfers up to 2,048 tiles per acknowledged batch in both directions. Main-thread acknowledgements yield through a timer before the next send. Headers travel separately, and the displayed city is replaced only after the complete result arrives. The application already holds simulation inputs fixed while a month is pending and permits view navigation; that contract is retained.

The same instrumented browser fixture then measured initial dispatch at 0–0.2 ms, maximum draw at 29.6 ms, and maximum animation-frame callback gap at 24.8 ms versus 291.6 ms before batching. All three months ran in the actual worker, two view interactions were accepted, ridership matched and the resulting city save validated. These are individual observed three-month runs, not sustained frame-rate or broad browser acceptance. Batching prioritizes yielding between transfers and may add scheduling overhead. Raw timing evidence is in `performance/batched-worker-transfer.json`.

Focused tests passed actual 256-map worker equality for every city field and result, bounded tile batches, original visible-city isolation, close during a queued transfer, send-failure foreground fallback, stale message handling and incomplete-output rejection. The worker also accepts the preceding whole-city protocol so a page held open across an update can finish a month with its cached runner. Existing three-month background-simulation tests passed. Cache responsive-metropolis-2; schema157 unchanged; 333 registered test commands. A new full run is active in `/tmp/sims3000-batched-worker-tests.log`; the preceding 332-command pass does not cover this protocol change.

Checkpoint5 now includes two separately keyed exercises: pan/zoom/rotate/pause while a large city advances, and reload/continue three months while checking date, budget and transport use. Older notes and completed transport exercises remain unchanged; the new steps are not assumed tried. The updated feedback suite passed, and the actual browser Roadmap showed five checkpoint5 tasks with both new checkboxes unchecked. This addition and cache responsive-metropolis-3 followed the full regression start; its focused verification is reported separately.

The batched-worker regression completed with exit0: all 333 registered commands, 368 PASS records in `/tmp/sims3000-batched-worker-tests.log`. The checkpoint5 feedback addition occurred after this run began; its focused suite and browser review passed separately at cache responsive-metropolis-3. The grouped performance checkpoint is ready for source review; remaining broader acceptance requirements above are unchanged.
