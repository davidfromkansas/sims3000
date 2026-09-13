# Utility petitioner impact analysis

Players receive conservation petitions when electricity or water demand is actually unserved, including disconnected neighborhoods with spare capacity elsewhere. Previously water checked only citywide capacity and power checked only overloaded plants, so broken connections could suppress requests.

Impact Analysis now shows available supply, delivered supply and unserved demand for the relevant utility, in addition to costs and demand. It explicitly identifies remaining shortages after conservation instead of implying a policy repairs pipes or power lines. The forecast recomputes a cloned city at current development; it does not simulate future growth or charge the live city.

Manual basis: page 61 describes consulting advisor impact analysis before accepting a petition; page 118 distinguishes pipe connections from pumping capacity. Petition wording and thresholds are original reconstruction choices. Existing decisions, cooldowns, ordinance effects and schema 119 are preserved.

Validation: all 207 regression suites passed. Cache utility-petition-analysis-1. A real Water under pressure challenge has spare citywide water capacity but a broken main; it now requests help and forecasts residual unmet demand. Repair clears the request. A real starter city with a remote replacement power plant requests help despite no overloaded plants. Tests compare projected values with actual policy acceptance, verify nonmutation and save continuity, and render the relevant UI rows and explanation.

Browser: New Haven's water analysis showed demand 179 → 161.1, available and delivered supply 0 → 0, and unmet demand 179 → 161.1. The remaining-shortage explanation appeared and no console errors were reported. Inspection made no city changes.

Feedback exercise: compare a conservation petition's forecast with the Utilities network report, then choose whether to accept conservation or repair supply first. Source only; publishing still awaits Sites source-export authorization.
