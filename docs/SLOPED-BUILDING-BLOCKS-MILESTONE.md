# Sloped building blocks

The independent-layer Building Architect now offers cubes and genuine wedges rising north, east, south or west. Placement works through the existing horizontal and vertical edit planes, freehand, line and plane tools. A geometry-only change participates in undo/redo; switching construction methods preserves the separate layered draft. Grid triangles identify orientation independently of camera rotation.

Wedge roofs and triangular walls use actual projected geometry in previews, city models and surface picking. Cubes beside partial blocks keep their exposed wall; back-facing sloped roofs are culled. Surface fill respects slope planes. Sloped roofs support material paint and vent details. Triangular walls currently use material color without window/door/detail overlays; this limitation is shown in the editor.

Manual visual reference: Construct Workspace p.143 and Construct Palette p.145. The manual specifies fourteen block types in four rotations. This milestone adds the first non-cubic primitive; it does not claim the full palette or exact recovered geometry of every original block. The low-resolution palette reference does not identify all fourteen shapes reliably. Remaining geometry catalog and triangular-wall detail projection are open fidelity work.

Schema 125 stores a bounded 2,400-character per-layer geometry map. Individual building format 8 roundtrips it, including maximal surface paint and details, within the existing 32 KB bound using compact serialization. Older cities without geometry migrate; older versions containing new geometry are rejected. Occupancy, jobs and simulation costs are unchanged by the art.

Validation: 239 suites passed across the full run and targeted schema/geometry reruns. Coverage includes all four shape orientations and camera rotations, back-face visibility, adjacent cube visibility, projected picking, coplanar fill, malformed geometry, portable files and city migration. Browser QA placed two north-rising roof wedges, verified grid labels and preview, undo/redo, method-switch retention and preview rotation. Draft changes were discarded; the normal city remained unchanged. Final visibility/fill changes were covered by targeted geometry and renderer/picking tests.

Feedback: Building designer → Build independent layers → Block geometry. Place a wedge, rotate the preview, try the other directions, then paint its roof. The full fourteen-block palette remains unfinished. Sites publication awaits explicit source-export approval.

Follow-up: `SHAPED-SURFACE-DETAILS-MILESTONE.md` resolves triangular-wall texture/detail clipping. Full palette work remains.
