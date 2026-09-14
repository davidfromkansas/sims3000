# Civic rewards follow the original approval requirement

City Hall and Mayor’s House now require the same normalized strong-approval threshold as Stadium and County Courthouse: 89.37007874/100, corresponding to original aura 100. Their population requirements remain 20,000 and 5,000. Mayor’s House no longer adds an arbitrary three-month holding period; qualifying cities receive the offer at the next monthly evaluation.

Earned rewards from older cities remain earned and rebuildable. Schema 137 converts old Mayor’s House progress: an earned offer retains its date, while an incomplete pre-137 three-month streak resets for the corrected rule. Current saves reject obsolete three-month streak values.

Neighborhood benefits now differ by sector. City Hall contributes 10/25/0 land-value points for residential/commercial/industrial surroundings and direct aura within 20 tiles; Mayor’s House contributes 23/20/2 with aura within 10 tiles. Existing employment, residential capacity and City Hall crime/pollution effects remain. Benefits require an intact, powered footprint with working road access.

## Source and limits

[Prima reward directory, printed pages 409 and 412–413](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide) supplies the population/aura gates and neighborhood values. Aura uses the manual’s −127…127 normalization. Spatial falloff, a 10-tile land-value radius and monthly offer evaluation are reconstruction tuning. Existing maintenance costs are still approximate.

## Verification and feedback

All 287 default regression suites pass. Checks cover exact approval/population boundaries, monthly idempotence, retained offers, old earned/unearned progress, sector-specific local effects, service loss and save reconstruction. The ordinary town-growth acceptance run passes with exactly 32,296 residents and §884,638 at month 144, including final-year save/load continuity. These rewards remain locked until approval improves; old records of Mayor’s House at month 53 and City Hall at month 115 describe the pre-137 rules.

Feedback focus: review the missing approval requirement, improve health/education and local conditions, then run a month to receive the offer. Population alone is not enough. Browser review remains pending while the Mac is locked. Sites export/publication still awaits explicit authorization after automatic approval review rejected it.
