# Airport and seaport disposal planning

Operating airports and seaports now contribute to city garbage. An airport produces .48 units per developed tile/month (7.2 for one 15-tile facility); a seaport produces .32 (3.84 for one 12-tile facility). Production begins after the existing six-month development period and stops during service loss, fire, damage or abandonment. Restoring services allows the existing reopening cycle to resume.

Any road beside the whole facility can collect its tiles' waste. This matches the facility's existing road-access rule and prevents distant tiles inside a valid airport from accumulating waste despite the site's road connection. Roads must reach actual disposal or an export route; a seaport's navigable water path alone cannot collect garbage. Existing garbage remains collectable during a shutdown. Adjacent airport plots remain separate production sources.

Utilities lists facility production and backlog; inspecting any tile shows the full facility's waiting garbage. Fire closure now appears in the facility explanation even when inspecting an unburned member of the same facility.

The Prima guide's zone garbage weights (airport 48, seaport 32) inform the relative rates. Division by 100 and application per operating tile/month are reconstruction calibration, not a claim of exact original tonnage. No save version change is required: operation flags are recomputed and existing tile waste is already saved.

Focused validation covers timed development, both per-tile rates, far-side collection, isolation/recovery, saved backlogs, water-loss abandonment/reopening, fire and road shutdowns, adjacent plots, and three months of exact saved replay. All 297 regular suites passed. The focused port and facility suites were also rerun after adding the fire explanation and adjacent-plot check. A normal-construction airport and navigable seaport completed 18 months in the existing large city: both opened in month 615 and remained operating through month 627, ending with 179,776 residents, §18,016,497, zero garbage backlog, conserved monthly accounting and an exact save round trip. Their combined garbage production was 11.04 units/month while operating.

Browser review remains pending while the Mac is locked. This milestone does not publish to Sites; repository-export authorization is still pending.
