# Ground-paint review model

`garden-court.building.json` is an original, importable one-tile SIMS3000 model using portable format 12. Import it through Building Architect's Import building file control while selecting a one-tile footprint. It remains a draft until applied to the city.

`four-view-review.png` shows the same block geometry and grass/asphalt ground layout in all four runtime render rotations. It was generated from runtime Canvas polygon output and rasterized using Pillow. The geometry artwork is original; it is not a screenshot or a browser acceptance result.

Review exercise:
1. Import the model and rotate all four ways. Verify the paved path stays attached to its side of the lot.
2. Choose Paint ground and change an exposed lawn square to asphalt. Cancel another stroke with Shift on release.
3. Sample ground material, then use Fill connected ground on that material region.
4. Restore original ground on a square, undo, then redo.
5. Switch to independent layers, edit the ground, and switch back. Verify the latest ground paint remains.
6. Export and import the building; apply it to a matching city building and save/reload the city.

Ground paint is cosmetic. The sample's population, jobs and costs follow the replaced city building. Direct painting currently requires a block layout or independent layers. Tower-parameter models can retain imported ground paint but do not expose direct ground editing. Ground fill uses a 10×10 grid with center-based building barriers.
