# Neighborhood service inspection

Every tile query now offers a neighborhood service report. Players can select a circular radius of 2, 4, 8 or 16 tiles, compare nearby residential utility access, civic coverage, pollution, crime, land value and uncollected garbage, then open a corresponding map centered on the inspected location or plan civic/utility services. Back to tile preserves the original inspection location. Radius changes preserve keyboard focus.

This extends the manual's diagnostic query and data-map workflows (pp.39 and 64–71); the radius-based aggregate is a browser adaptation, not a claim about the original interface. Scores are weighted by actual residents in selected residential tiles. Multi-tile buildings count once if they intersect the area; only selected member tiles contribute population and coverage. Empty areas have no service score. Education coverage is not presented as a local age census; utility percentages describe served residential tiles rather than metered units. No city state or save schema changes.

Validation: full 216-suite run passed. The final focus adjustment passed the targeted neighborhood suite and browser verification. Tests cover exact circular boundaries, map edges, weighted values, multi-tile counts, no-resident areas, read-only behavior, report callbacks and tile-query integration. Existing multi-lot and station query tests retain their focused coverage. Browser QA confirmed 96 residents within four tiles and 224 within eight, water-map navigation, civic planning, returning to the original tile, retained radius focus and no console errors. The local city remained paused and unmodified.

Feedback checkpoint: inspect two neighborhoods with different service access and use this report to choose the next utility or civic investment.

Source only; Sites publication remains pending explicit export authorization.
