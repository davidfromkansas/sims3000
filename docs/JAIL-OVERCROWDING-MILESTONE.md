# Jail overcrowding

Players can inspect citywide detention demand, usable cells, maximum overcrowded capacity, estimated held/released inmates, and the resulting police effectiveness in Civic services and individual jail queries. Adding a working jail restores protection when existing capacity is overwhelmed. Extra funding cannot create cells. Police advisers explain when expansion or repairs are needed.

Each jail now has 300 cells and 360 maximum overcrowded places, costs §2,500 and §75/month at full funding. Underfunding scales usable capacity, while damage, missing power/roads and strikes remove it. Capacity is counted once per footprint. Service tool descriptions now show actual footprints.

Sources: user manual, Jails (printed p.54), https://excalet.com/technology/game_manuals/simcity_3000_unlimited.pdf ; official strategy guide pp.327–330, https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide . The guide gives the capacity/cost thresholds and reduced police effectiveness without adequate jails. This implementation linearly reduces effectiveness from 100% at full occupancy to 75% at 110%, then scales inversely with occupancy. That interpolation and underfunding capacity are reconstruction tuning. Demand still estimates 1% of residents; an arrest/sentence simulation and crime-based demand remain incomplete and are disclosed in the UI.

Verification covers thresholds, real civic coverage changes, restoration by expansion, funding, damage, strikes, query consistency, construction charges and save/load. Derived statistics require no save schema change (134). Browser review remains pending while the Mac is locked; Sites publication remains blocked by automatic approval review pending explicit source-export authorization.
