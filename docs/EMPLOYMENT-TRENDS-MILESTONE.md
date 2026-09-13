# Employment trends milestone

City data now offers Commerce employment, Industry employment, and Unemployment trends alongside existing job-capacity graphs. Players can compare up to three trends across 1, 10 or 100 years to assess whether zoning and transport investment lead to filled jobs.

Manual page 69 names commerce/industry employment and unemployment graphs. Employment is measured from actual remaining workplace capacity after road, bus, highway, rail and subway allocation. It does not count vacancies as employees or count carpool passengers twice. Unemployment is workers without reachable jobs divided by the modeled workforce; an empty workforce reports zero. Fractional simulated workers are retained. These are reconstruction simulation values, not recovered original formulas.

Records start with the next simulated month. Older records remain missing; no historical employment is inferred from job capacity. Derived statistics and optional history values require no save schema change (119). This milestone does not add national population or combined-pollution trends.

Feedback exercise: compare Commerce employment, Industry employment and Unemployment in City data. Add workplaces and connect them, then interrupt and restore the route. Assess whether these histories explain changes that job-capacity graphs alone could not.

Validation: real road, rail and subway fixtures for each employment sector; route disconnection/repair; vacant-capacity distinction; empty-workforce behavior; monthly recording; exact save continuation; preservation of missing older records. Frozen-router comparisons still verify all pre-existing statistics and tile routes, with additional employment conservation checks.

All 199 regression suites pass. Local browser testing selected all three graphs and verified seven monthly records (48 commerce workers, 84 industry workers and 7.2% unemployment in the latest month), with no browser errors. The original local city was restored from its named backup. Player feedback remains pending.

GitHub source milestone. Sites publication remains pending explicit source-export authorization.
