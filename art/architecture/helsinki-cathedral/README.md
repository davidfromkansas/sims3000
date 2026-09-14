# Helsinki Cathedral — original model

Original game-scale geometry is in `dist/helsinki-cathedral-model.js`, exposed through `landmarkGeometry('helsinkiCathedral')` and registered in the playable landmark catalog at schema 147. Placement uses an authored 3×3 footprint; the original game's dimensions have not been recovered.

References: [Helsinki parish architectural description](https://www.helsinginseurakunnat.fi/en/tuomiokirkkoseurakunta/artikkelit/esed2f4rd) and [Finnish Architecture project record](https://www.finnisharchitecture.fi/projects/helsinki-cathedral). The model represents the white cross-shaped massing, central green dome, four secondary domes, columned porticoes, steps and simplified roof figures. Dimensions and detail are original reconstruction choices.

Initial geometry validation passed finite coordinates and image bounds in four rotations (3,075 faces). An offline Canvas-path render exposed incorrect portico/column occlusion in the shared average-depth landmark painter. That initial depth-order issue was resolved at the checkpoint below; browser visual acceptance is still outstanding.


Depth rendering checkpoint: the shared miniature rasterizer now accepts the landmark viewport and projection, resolving visibility per pixel. Cathedral drawing uses this path on its cached view; existing landmark types retain their current renderer. Roof face winding was corrected after visual review. Offline views 0 and 2 were inspected after the fix; four development PNGs are in `renders/`. Focused raster, cathedral, tree-model and existing-landmark tests pass. Catalog registration, migration, placement/save integration and scenario counting are now implemented and pass focused checks. Browser review remains outstanding. The gallery uses the original rendered view-0 PNG, not an Imagegen illustration.
