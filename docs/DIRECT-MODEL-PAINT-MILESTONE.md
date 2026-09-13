# Paint and sample the building model

Players can now paint directly on visible faces in the Building Architect preview, or use an eyedropper to select an existing surface material without editing it. Choose a block layout or independent layers, select Paint visible surfaces and a material, then drag across the model and release. The yellow outline previews the affected column sides. Shift on release, Escape or pointer cancellation discards a pending stroke. Camera/model changes interrupt pending strokes. Pan mode retains the existing camera controls; wheel zoom and keyboard navigation remain available.

A stroke enters the selected construction method's existing undo/redo history as one edit. Layered history now preserves material snapshots alongside occupancy, so undoing paint does not erase blocks and subsequent construction edits can be undone in order. Sampling changes only the selected palette material. In paint/sample mode, arrows move a preview cursor and Enter or Space acts on the visible face under it.

This implements the manual's direct-model painting and Select/eyedropper interaction (pp.146–147,151–152) for this reconstruction's materials and geometry. It does not add the original fourteen block shapes, full texture/detail/prop catalogs or per-block paint storage. Paint still belongs to a column and side across its layers; the UI states this explicitly. Parameter-only towers must first use one of the editable construction methods. Existing building/city formats retain the paint with no schema change.

Validation: all 220 suites passed. Picking tests cover block and layered models, overhangs, all rotations, asymmetric footprints, zoom/pan, occlusion order, misses and immutable sampling. Controller tests cover CSS coordinate scaling, transactional strokes, cancellation, keyboard actions, model/rotation interruptions and camera delegation. Shared layered history restores both geometry and paint. Existing material and building roundtrip suites remain passing.

Browser QA painted brick across visible layered walls, undid and redid the stroke, and sampled Brick from an existing face without changing the model. The resulting preview and controls were visually checked, with no console errors. The test remained an unapplied draft; city saves were unchanged.

Feedback checkpoint: paint walls and roofs in two materials, rotate the model, sample an existing material to match another face, then undo a paint stroke and a construction edit.

Source only; Sites publication remains pending explicit export authorization.
