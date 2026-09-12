# A cleaner legacy

Original SIMS3000 prepared challenge, using the manual’s scenario format. It is not a reproduction of a shipped scenario.

Start: 224 residents, §10,000, an accepted and placed toxic-waste plant paying §300/month, random disasters off. The deterministic site is selected on clear land near the starter town. Deadline: 36 months.

Win: six consecutive monthly checks with no toxic-waste plant, population at least 400, average zoned-land air pollution at most 15, and funds at least §5,000. Missing any condition resets the streak. Removing the plant loses its payment, requiring a functioning local economy.

The prepared challenge appears in the scenario chooser, supports restart, and saves under schema 48. Validation covers initial state, exact restart, save progress, inclusive thresholds, streak reset and deadline loss. A complete test solution uses ordinary build and tick calls: remove the plant, add landfill capacity, residential and commercial zoning near roads, and sustain the result. That deterministic solution wins at month 12 with 456 residents and more than §10,000.

Feedback: do the loss of business income and six-month recovery period make rebuilding feel consequential without making the challenge opaque?
