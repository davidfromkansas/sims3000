# Neighbor connections and contracts in challenges


## Neighbor status scenario checkpoint — milestone 6

The scenario creator now exposes active/inactive goals and conditions for a specific neighbor connection or trade deal (manual p.188: Neighbor Connection Status Is / Neighbor Deal Status Is). The 47 queries cover five boundary connection types for each of the four land neighbors, the overseas seaport connection, and each supported neighbor/resource/import-or-export contract. The state menus work in goals, event conditions and ranks; shared conditions also work in structured scenario routines.

A connection is active when it has been registered and its exact boundary route still exists, or its seaport is operating. A deal is active when a signed, non-failed contract matches the neighbor, resource and direction and its connection is available. Idle imports still count as active contracts. Connection status does not promise local supply or transport access; authors can combine status with existing supply and service goals. Numeric text insertion and variable reads use 0/1, consistent with other state queries; goal and condition labels show Inactive/Active.

Two new suites verify all 47 definitions, every land connection and contract direction, operating/failed seaports, cancelled/failed/idle deals, neighbor specificity, invalid state targets, actual editor controls, and a real two-month import challenge that loses its streak after disconnection, recovers, saves and wins. A repeating routine uses the state in an If branch, and direct versus actual worker continuation agrees on a 96×96 city. Replay restores the original disconnected city. All 183 regression suites pass. Schema113 identifies this creator capability; schema112 cities still load. Cache graph: scenario-neighbor-status-1.

This adds status queries, not the remaining Enable/Disable Neighbor Deal scripting commands or a full original scenario virtual machine. Those remain fidelity work.

Feedback exercise: author a two-month goal requiring an eastern power connection and eastern power-import deal. Build/register the route, sign an import, interrupt it, then recover. Assess the Active/Inactive descriptions and whether the streak reset makes the challenge understandable.

Local preview update: the installed Sites 0.1.62 portable workflow permits local browser verification; the earlier restriction applied to the old/cloud workflow. The local server returned HTTP200, but the computer-use tool reported that the Mac is locked and automatic unlock failed. No browser interaction or visual acceptance was completed. The local server was stopped afterward. Unlocking the Mac is the current browser-check prerequisite; the earlier pending browser-testing permission question is superseded by these current skill instructions.

Not published to Sites. The separate automatic approval rejection of repository source export still requires explicit user authorization and has not been retried.
