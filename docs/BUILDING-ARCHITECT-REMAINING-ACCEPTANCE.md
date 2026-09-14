# Building Architect: remaining acceptance requirements

This is a bounded audit of editor gaps, not a percentage-complete estimate or a replacement for the whole-game goal. Source: [user-supplied manual](https://excalet.com/technology/game_manuals/simcity_3000_unlimited.pdf), printed pages 143–152. Runtime evidence was inspected at cache architecture-collection-41, schema 151.

| Manual requirement | Current evidence | Remaining acceptance |
| --- | --- | --- |
| Fourteen construction block types, four rotations (p.145) | `building-block-geometry.js` and visual palette support cube plus four directional wedges | Identify the remaining original shapes from reliable visual/source evidence; implement their geometry, intersections, surface painting, rotation, file retention and usable selection. Current five palette entries are not five original block types. |
| Paint walls, rooftops and ground (p.145) | Runtime materials, floor overrides and separate saved 10×10 ground layer; composed designer Apply/save tests | Direct tower-mode ground editing is unavailable. Ground fill uses authored center-based barriers. Verify actual browser targeting, brush continuity, fill and recovery across views and footprints. |
| Visual paint sets (p.147) | Seven selectable runtime swatches and authored material groups | Full original material/solid-paint catalog is not established. Current custom facade/glass colors do not supply arbitrary independently chosen paint colors per surface. |
| Paint below existing details (p.148) | Separate `surfacePaint` and `surfaceDetails` arrays; runtime draws details after material | Preserve this behavior when detail placement becomes richer; verify sampling, erasure, Undo, export and city save continuity in composed workflows. |
| Detail lower-left anchor and edge cropping (p.148) | `building-surface-details.js` stores one of four original authored decals per surface tile; wedge walls use decoration clipping | There is no independent placement offset or variable-size decal record. Current decals fit one surface tile. Establish sizes/anchors for reference details, implement placement spanning the needed coplanar surface area and cropping without leaking around corners or across gaps; test orientation, overlaps, paint beneath and saved placement. |
| Detail sets including doors, windows, cornice and ledges (p.149) | Four authored detail designs: framed window, entrance door, grille and window with ledge | Complete referenced categories and visual selection; the current four designs are not the original complete catalog. |
| Prop placement, clipping, sampling and group erasure (pp.149–151) | Twelve original props, clipping and composed editor tests | Full original prop inventory and exact original clipping semantics remain unverified. Browser review at actual scale is pending. |
| Navigation overview and Construct widgets (p.152) | Rectangular viewport overview, zoom, pan, rotation and edit-plane tools | Original Construct-mode hexagonal frame/widget behavior is absent. Browser layout, text enlargement and keyboard acceptance remain pending. |

## Next substantial editor feature

Variable-size detail placement is a functional gap with explicit manual evidence. Before implementation, define its saved representation and anchor in world surface coordinates, then use a wide window/cornice as the first acceptance case. A complete case must survive edge clipping, camera rotation, paint changes, Undo/Redo, portable export/import and city save/reload. Do not substitute a larger graphic drawn inside the existing single-tile slot for the missing placement behavior.

A web search for the fourteen block shapes did not identify a trustworthy complete list. The manual remains the authoritative count; the original block names/geometries must not be invented and labeled faithful. Existing runtime catalogs and regression passes do not close this evidence gap.

## Geometry feasibility check

A standalone experiment at `/tmp/sims3000-decal-clip-prototype.mjs` clips a decal in a shared wall-plane coordinate system to each exposed face. Assertions pass for a wide decal crossing separate faces while preserving a gap, sloped-edge trimming, either polygon winding and disjoint rejection. This is a geometry prototype only. It has no saved record, placement controls, runtime renderer integration, overlap policy, undo history or browser verification; none of the variable-size detail requirement is marked complete by this result.
