# Civic advisor briefings

## Player capability
Open Civic services & advisors, then meet Maria Montoya for public safety or Randall Shoop for health, education and aura. Each has an original Imagegen portrait and a briefing derived from the current city. Priorities cover strikes, first homes, coverage gaps, jail capacity, crime, age-specific education access and wellbeing. Inspect map opens the relevant overlay; Plan selects a construction tool without spending money. Return to funding and policies from either briefing.

## Manual relationship and limits
The manual assigns public safety to Maria (p.106) and health, education and aura to Randall (p.111). Portraits are original interpretations. The briefing thresholds and wording are this reconstruction's implementation, not recovered original dialogue or formulas. These two advisors do not complete the original advisor roster. Citywide measures can conceal neighborhood differences.

## Feedback checkpoint
1. Meet each advisor in a populated city and compare the priorities with its service conditions.
2. Open a suggested map, return, and select a suggested construction tool.
3. Change department funding or service coverage, advance the simulation, and revisit the briefing.

## Validation
All 230 regression suites passed before the final markup and button-label adjustment; the affected civic advisor suite passed again afterward. Tests cover both advisor roles, no-resident guidance, strikes, healthy fallback, read-only briefing generation, portrait PNG dimensions, map and construction callbacks and return-to-funding navigation.

Browser review found a global header style interfering with the portrait layout. Replacing that semantic wrapper with a scoped div resolved the overlap, and Maria's final layout was visually checked. Remaining Randall and shortcut browser checks were interrupted by the Mac locking; callback behavior is covered in tests. No user city was changed or saved during this review.

Save schema remains 122; cache token is civic-advisors-2. GitHub/local-preview milestone only: Sites publication remains blocked pending explicit source-export authorization.

Browser follow-up during the zone-growth milestone verified Randall’s portrait layout, return from policy comparison, and Plan hospital selecting the hospital tool without spending or saving.
