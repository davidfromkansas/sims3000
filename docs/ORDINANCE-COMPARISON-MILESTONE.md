# Advisor ordinance comparison milestone

## Playable step
Players can compare a policy package from Civic services & advisors, or compare a department's policies from Maria or Randall. Select proposed policies, compare current and proposed conditions, and apply the reviewed package. Back leaves the city unchanged. Other departments' settings remain in effect during an advisor-specific comparison.

The comparison shows monthly balance, policy costs and revenue, resident crime and aura, air pollution, power and water demand, peak road traffic, cleaner industry and average building flammability. Separate tables show life-expectancy and school/college-age education targets; those are not immediate changes in residents' attained health or education. Education targets are shared with the actual learning implementation.

## Manual and limits
The manual's advisor meeting workflow (p.60) includes departmental ordinances and briefings. This reconstruction adds explicit comparisons using its own simulation formulas. Each preview validates and recomputes a detached city with the proposed settings. It advances no month, spends no funds and changes no player state. Future development and monthly processes such as garbage collection are not forecast; policy descriptions explain effects beyond the table. Simulation calibration and the full ordinance/advisor catalogs remain incomplete.

## Feedback checkpoint
1. Compare Neighborhood watch and Fire safety code together through Maria. Check crime, flammability and recurring cost before applying.
2. Compare Free clinics and Reading campaign through Randall. Check long-term targets, then apply and observe gradual progress over months.
3. Compare a citywide conservation package and inspect electricity and water demand.
4. Repeal an existing policy in the comparison, or return without applying.

## Validation
All 231 suites passed. The expanded conservation comparison also passed its targeted suite after the final display additions. Regression coverage verifies detached state preservation, projection equality with actual enactment, policy repeal, conservation demand, shared education targets, empty-city handling, department scoping, unchanged-package protection, changed-selection invalidation, stale-city rejection, explicit apply/save and return behavior. Live browser verification was unavailable because the Mac was locked. Save schema remains 122. Sites publication is still pending explicit source-export authorization.

Browser follow-up during the zone-growth milestone verified Free clinics selected through Randall: comparison reduced monthly balance from §64 to §59 and raised the life-expectancy target by three years. Back returned to Randall without applying the policy.
