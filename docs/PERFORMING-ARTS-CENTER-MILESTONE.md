# Performing Arts Center

The seventh reward is a free, unique 2 × 2 cultural venue. A city with at least 100,000 residents and strong approval receives an offer at the next qualifying monthly evaluation. An operating center adds room for 48,000 residents, supplies 40 accessible jobs and improves nearby residential/commercial land value and wellbeing. It also produces modest local pollution. Capacity alone does not create demand or residents.

The original model has a curved auditorium roof, glazed foyer, poster panels and sculpture court, with four camera views. Reward previews and city placement use the same model. The center’s effects require power, working road access and an intact footprint; destruction removes the effects, but the earned offer remains available for rebuilding.

## Source and approximations

[Prima guide, printed page 414](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide) gives the 100,000 population threshold, original aura 100, free 2 × 2 building, 48,000 residential capacity relief, 40 jobs, land-value effects 12/20/0, air 200 within 10 tiles, water 200 within 5 tiles and aura 3 within 20 tiles. Aura is normalized to the game’s 0–100 scale; pollution intensity is divided by 100. Spatial falloff, a 10-tile land-value radius and monthly evaluation are reconstruction tuning. No monthly upkeep is charged in this model; the maintenance table lists none.

## Verification and feedback

All 288 default regression suites pass. Focused checks cover both unlock boundaries, permanent offers, free/unique placement, four footprint tiles, capacity relief, finite accessible jobs, neighborhood effects, operating loss, rebuilding, old-save migration and four-view geometry. The model was visually inspected from all four directions. The ordinary metropolis earned the offer at month 546 with 174,424 residents, placed the venue at no construction charge, filled all 40 jobs and gained exactly 48,000 capacity.

Schema 138 adds reward history; older cities migrate without an offer, and older-version saves cannot contain a placed center. Browser review remains pending because the Mac is still locked. Sites export/publication still awaits explicit authorization after automatic approval review rejected it.

Feedback focus: earn and place the center, inspect its local effects, and compare residential capacity before and after supplying or disconnecting it.
