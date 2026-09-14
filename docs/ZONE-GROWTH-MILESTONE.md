# Zone growth diagnostics

## Player capability
Open City desk → Zone development · find stalled growth. Filter by sector and development state, then locate or inspect an affected site. The report distinguishes service/site problems, nonpositive demand, density limits, maturation and growth eligibility. It shows every applicable constraint, current development level and current maximum. Multi-tile buildings count once; unbuilt zone tiles appear individually. Fifty rows per page keep large-city reports bounded.

## Manual relationship
The manual's City Planning section (pp.97–99) explains that demand, utilities, transport, land value and zoning density govern development. The report shares eligibility conditions with the monthly simulation rather than duplicating a simplified explanation. The extraction preserves existing growth probabilities, abandonment, age and lot-formation behavior.

Farms use separate formation/expansion rules and are excluded; the explanatory text points players to their existing Industry & farming screen. The report describes current conditions, which may change before a monthly growth check. Eligibility does not promise growth in the next month. Demand and numerical thresholds remain reconstruction calibration.

## Feedback checkpoint
1. Find zones with service problems and use Show on map or Inspect to locate them.
2. Restore a missing connection, reopen the report, and check whether the constraint clears.
3. Compare low-density caps, water limits, low land value and historical preservation before rezoning.
4. Look for eligible zones and let the simulation run; development remains probabilistic.

## Validation
Targeted tests cover multi-member service constraints, real multi-tile lot grouping, historical/density/water/land-value caps, local commercial demand, maturation, read-only reporting, filters, pagination and map/inspection callbacks. All 233 regression suites passed, including existing simulation coverage after the shared-condition extraction. The final multi-tile grouping addition passed targeted validation. Browser review verified 50 starter-town entries, filtering to seven eligible sites, a map jump and inspection of tile 21,19. Save schema remains 122. GitHub/local-preview milestone only; Sites publication remains pending explicit source-export authorization.
