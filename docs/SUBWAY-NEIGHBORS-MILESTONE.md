# Subway neighbor connections

Draw subway track to a dry map boundary, open Neighbors & utility deals and pay for the connection. Each subway connection adds capacity for 25,000 commercial jobs, with no industrial relief. It counts as a neighbor connection but cannot carry power, water or garbage contracts. The contract controls disable acceptance and explain why.

The manual's transportation section explicitly supports subway connections at city boundaries. Prima Official Strategy Guide pp.163–165 (https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide) supplies the commercial capacity effect. The shared §100 connection fee, dry-boundary restriction and border-presence activation remain reconstruction choices. Cross-border passenger movement, actual neighboring city maps and a subway-specific local demand bonus are not implemented. Capacity does not substitute for local services and demand.

Paid connection records persist if the edge track is removed; relief stops until rebuilding restores the route. Save schema 128 accepts older cities without subway connections and rejects subway records labeled as older versions.

Validation: all 251 suites passed. New regression checks all four sides, payment, duplicate prevention, commercial-only relief, freight/utility rejection, removal/rebuilding, saves and version gates. Browser QA placed track at tile 48,25, completed the Eastborough connection, confirmed disabled contracts, reloaded and verified commercial capacity of 50,000 with a +25,000 subway contribution. Simulation stayed paused.

Feedback checkpoint: extend a subway to the map edge, complete the connection, inspect its commercial growth capacity in City desk → Zone development, and reload to confirm persistence.

Sites publication remains at version 150 pending explicit source-export authorization.
