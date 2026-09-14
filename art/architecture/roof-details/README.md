# Skylight atelier — detail-placement feedback

This original low-rise review model combines two wide skylights, a roof vent, a fractional wall cornice and an entrance. Import `skylight-atelier.building.json` into Building Architect. The four-view image uses the actual runtime polygons, without an alternate rendering engine. The portable model and city-save roundtrips passed.

1. Rotate the preview through all four views. Check that skylights and the vent stay on the roof and the cornice stays on its wall.
2. Select anchored details, choose Roof, then sample a skylight. Change its width and depth and place another one across several roof tiles.
3. Place a detail near a roof edge. Confirm that only the portion on the roof is visible. Try a stepped roof and a gap between roofs.
4. Erase a roof detail and Undo. Redo, then Undo again. Confirm that other placements and paint remain unchanged.
5. Choose Wall, turn tile snapping off, and place a cornice between grid lines. The crosshair identifies its exact anchor. Compare placement with snapping enabled.
6. Apply the model, save the city and export the building. Reopen both and check every placement.

Review focus: predictable targeting, clear width/depth controls, visibility at city scale, recovery from mistakes and retention through saves. Browser interaction acceptance is pending; source tests and this static review do not substitute for player feedback.
