# Abandoned building recovery

The development report now has an Abandoned buildings filter, with map and inspection actions. Vacant zoning is excluded; multi-tile buildings count once. Inspecting an abandoned building identifies current missing power, transport, established water, garbage, disaster or demand conditions using the same eligibility function as growth. A recovered building stops showing the recovery panel.

The manual (Query Tool, p.39) asks for diagnosis of abandoned buildings. This milestone supplies current recovery guidance, not a stored historical cause: the panel explicitly distinguishes the two. Historical designation does not restore occupants. Recording the original cause remains unfinished.

Validation extends the actual abandonment/recovery simulation test and the development-report interaction test. A home loses occupants, exposes missing power and transport, becomes eligible after repairs, then regrows and clears its recovery status. Filter and location actions are tested. Browser QA verified the new filter and empty state against the unchanged, paused local city; browser inspection of an occupied abandoned fixture was not performed. Save schema remains 123.

Feedback: open City desk → Zone development → Abandoned buildings, locate a building, inspect its blockers and restore its services. Let the city run to give development time to return. Historical appearance remains protected.

Local/GitHub delivery only. Production publication awaits explicit Sites source-export approval.
