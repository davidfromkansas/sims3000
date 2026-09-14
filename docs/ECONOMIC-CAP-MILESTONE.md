# Economic growth capacity

Commercial and industrial growth now stop for lack of citywide capacity, even if a district has a positive local market bonus. The zone-development report shows each sector's jobs, capacity, remaining room and contributing routes/ports. Existing over-cap jobs are retained unless other simulation conditions remove them.

Source: Prima Official Strategy Guide pp.163–165, https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide. Base capacities are 25,000 commercial and 70,000 industrial. Paid road connections add 12,000 to each; highways add 20,000 commercial/14,000 industrial; rail adds 25,000 industrial. Developed operating airport tiles add 500 commercial/100 industrial each; seaport tiles add 100 commercial/250 industrial each. Port connection records do not double-count the same facility. Road/highway relief ceases at road condition 20 or below. Border route presence and operating-port gating use existing reconstruction rules.

Monthly lot development checks the entire population increment, including formation of multi-tile buildings. Farm formation and expansion reserve their additional barn jobs. Environmental conversion of an existing farm to dirty industry can change its job count independently; any resulting over-cap state blocks further growth without forced job removal. Derived state is recomputed on load; schema remains 127.

Unfinished scope: subway neighbor connections, other reward/recreation relievers, exact original cap mechanics and demand formulas. Existing regional access demand bonuses remain reconstruction tuning. This milestone is not a claim of full economic parity.

Validation: all 250 regression suites passed. New coverage includes paid border connections, broken routes and road-condition failure, a real airport's six-month development and power-loss shutdown, save continuity, local demand bypass prevention and multi-tile growth costs. Separate 128×128 commercial/industrial cities at their caps were advanced through a simulation month; vacant sites remained unbuilt and existing jobs persisted. Farm expansion's capacity boundary passed an additional focused check. Browser review verified sector summaries and the commercial breakdown at 48/25,000 jobs (industrial 84/70,000) in the paused QA city.

Feedback checkpoint: open City desk → Zone development. Review commercial and industrial capacity, add a paid border connection or develop an operating port, then inspect the added capacity and allow the connected economy to grow.

Sites publication remains at version 150 pending explicit source-export authorization.
