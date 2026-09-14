# Original Building Architect prop collection

Twelve original procedural models cover the eight category names in the supplied manual, printed pages 149–150. The tutorial on printed pages 132–133 and the prop reference mention trees, a family station wagon and a blue pickup truck; these are represented by newly authored geometry. The remaining models are original choices suited to their categories, not verified reproductions of the shipped prop palette.

- Architecture: garden arch, stone column
- Building Decoration: freestanding clock
- Plaza and Streets: park bench, street lamp
- Yard Objects: picnic table
- Flora: garden tree
- Vehicles: parked car, family station wagon, blue pickup truck
- Industrial: storage tank
- Rooftops: ventilation unit

Geometry lives in `dist/building-prop-models.js`. No original game images or meshes are copied. Models use fixed physical dimensions, independent prop orientation, a shared world-space light, model-boundary clipping and building-depth occlusion. Thin detail coverage is sampled at four times resolution within the prop bounds, then reduced with alpha coverage; this prevents a thin street lamp from vanishing on a 1×5 lot without inflating its model.

To regenerate the four-view review PNGs and contact sheet from the repository root:

```
node scripts/render-prop-review.mjs
python3 scripts/assemble-prop-review.py
```

The first script writes temporary raw RGBA files listed in `review.json`; the second converts them to the corresponding PNGs, builds `contact-sheet.png`, and removes the temporary files. Python requires Pillow. These enlarged, individually fitted views establish geometry readability only. The runtime uses actual shared building scale.

All 48 enlarged views were visually inspected. An initially reversed arch face was corrected. Automated checks cover every model and its four physical rotations through every camera view on 1×1, 1×5 and 5×1 lots, plus category selection, city/model saves and monthly continuation. Model-space cropping against occupied columns, cubes and four wedge orientations is now implemented in `dist/building-prop-clipping.js`. Analytic area tests cover intersections, rectangular lots, overhangs, gaps and roof contact. Sixteen enlarged diagnostic views are in `clipping/contact-sheet.png`; regenerate them with `node scripts/render-prop-clipping-review.mjs` and `python3 scripts/assemble-prop-clipping-review.py`. Broader browser appearance, exact original prop catalog/dimensions and exact original clipping-algorithm parity remain unverified.
