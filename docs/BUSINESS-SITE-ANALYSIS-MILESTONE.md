# Business site impact analysis

The Business deals panel now lets players compare two candidate locations for a casino or toxic-waste conversion plant before accepting or placing the deal. Initial suggestions find nearby clear, level terrain; Compare sites applies the complete building rules. Coordinates identify the northwest footprint corner and can be obtained with tile inspection.

Each candidate is evaluated in its own validated copy of the current city. A temporary permit allows pre-decision planning; the real city's permit, treasury, history and tiles remain unchanged. Actual construction and recomputation produce the projected stipend, immediate charge and city balance. The report compares residents, crime, air/water pollution and land value within eight tiles of each building center. No-resident areas display no score rather than a fabricated zero.

The manual describes consulting impact analysis before petitioner decisions (p.61) and balancing business stipends against crime/pollution (p.90). The two-site coordinate interface is a browser adaptation. Results are immediate comparisons at current development, not forecasts of future growth, service spending or disaster risk. No save schema change.

All 221 suites passed. Tests verify actual casino crime and toxic-plant pollution changes, buildability/uniqueness rules, valid suggested terrain, detached permits and unchanged serialization, agreement between analysis and real construction, and UI comparison callbacks. Browser QA found and corrected blocked default coordinates. The final suggestions were buildable: casino site A projected monthly balance §64 → §212 and local crime 33.2 → 38.1; site B projected §64 → §214 and crime 33.1 → 34.9. The stipend was §150 in each case. No console errors; no actual deal or construction occurred.

Feedback checkpoint: compare a site near homes with another farther away, then decide whether the stipend warrants its local effects and additional services.

Source only; Sites publication remains pending explicit export authorization. The original business-building catalog remains incomplete.
