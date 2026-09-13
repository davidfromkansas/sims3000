# Rail access to landfills milestone

Players can deliver garbage to remote landfills by surface rail. A road-connected train station transfers neighborhood garbage onto its rail network; a landfill directly beside that network receives it without requiring a road across the map. Imported garbage entering a rail neighbor connection can reach a siding on the same network without a local station or road.

Manual page 103 explicitly describes decommissioning landfills by removing road or rail access. Previously only the road path could deliver local garbage. The query tool now identifies an operating rail siding, and Utilities explains construction and decommissioning with both transport modes.

## Behavior and interpretation

Surface tracks, axis-correct rail bridges and rail tunnels carry freight. Subway connections do not join freight networks. Train stations and rail–subway connections transfer from roads through their surface platform only. Freight requires positive transit funding, condition above 20, and no transit strike; road pickups also require usable roads. A landfill siding is one orthogonally adjacent surface track tile. That loading geometry and existing station road catchment are reconstruction rules, not recovered original routing parameters.

Road and rail delivery share the same landfill capacity and monthly decomposition. A pile reachable by both modes is not delivered twice. Breaking a track, removing a tunnel portal, shutting down transit or disconnecting the loading station stops that path. Full landfills still leave excess garbage uncollected. Remove both road and rail routes to decommission a landfill, let its waste decay, then de-zone it.

This implements delivery connectivity, not individual freight train scheduling or freight vehicle animation. Existing incinerator and recycling-center road requirements remain. No new persistent state or save schema is required (schema 118); routes rebuild from saved infrastructure. Regional surface-rail station discovery now shares the same bridge/tunnel connectivity helper.

## Feedback exercise

Build a train station beside a neighborhood's road network. Extend surface rail to a distant landfill with no road connection, placing the landfill directly beside the track. Advance a month and inspect its stored garbage. Cut a middle track, observe uncollected waste, then repair it. Try a rail import contract feeding the same siding.

## Validation and availability

195 regression suites pass. Dedicated coverage includes local station transfer, rail-only imports, finite capacity, conservation across road and rail, cuts and repair, transit shutdowns/strikes, subway exclusion, bridge axes, a real bored tunnel and portal removal, and saved monthly continuation. Browser playtesting remains pending while the Mac is locked. Source milestone only; Sites publication still awaits explicit source-export approval.
