# Garbage and public health milestone

Severe uncollected garbage now directly lowers the long-term life-expectancy target of exposed residents. The Population report's health explanation shows the separate sanitation penalty and average garbage exposure. Restoring collection removes the penalty as waste clears, after which life expectancy gradually recovers under the existing health model.

Manual page 103 explicitly links high garbage levels to a dramatic decline in health and life expectancy. Previously the model represented this only through garbage's capped air/water pollution contribution. The new direct effect preserves those environmental effects and the documented health relationship.

## Model and limits

Each occupied residential tile contributes a sanitation risk of `min(1, waste / 50)`, weighted by its residents. Fully exposed residents have a 15-year reduction in their target. Risk is capped before averaging so one small household with an extreme pile cannot represent exposure for the whole city. Empty/abandoned sites have no direct residential exposure, although their pollution can still affect nearby homes. The existing 45–90-year target bounds and gradual 48-month adjustment remain.

These coefficients are original calibration, not recovered original algorithms. Current landfill and incineration routes clear backlog; recycling alone reduces new waste but does not remove an existing mixed-waste pile. No new saved state is needed: exposure is derived from saved waste and occupancy, using schema 118.

## Feedback exercise

Let rubbish accumulate near occupied homes, then inspect Population → What affects life expectancy? Connect those homes by road to landfill capacity or an incinerator. Advance the city and compare garbage exposure, the health target and gradual life expectancy recovery. Hospital access and pollution continue to affect the result.

## Validation and availability

193 regression suites pass. New tests cover population weighting, saturation per home, abandoned and empty sites, report values, gradual change, actual road-connected landfill recovery and saved continuation. Browser acceptance remains pending while the Mac is locked. GitHub source milestone only; Sites publication awaits explicit source-export approval.
