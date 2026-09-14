# Limestone office block — architecture collection

Original six-story office geometry with limestone bands, bronze framing, recessed glazing, entrance canopy, planters and asymmetric rooftop equipment. Blender 5.2.0 LTS renders transparent 768×768 PNGs. All four views use the same model, a fixed camera at 30 degrees elevation and fixed screen-space lighting. Model rotations are negative quarter-turns to match the game’s camera coordinates.

`render.py` accepts width and depth from 1 through 5 after Blender’s `--` separator and writes four views under `renders/WxH/`. Wider lots gain facade bays and roof equipment while retaining story height. The 1×1 run also saves the editable model. No external models, textures or fonts are required.

`scripts/stage-commercial-art.py` validates all 100 images for RGBA dimensions, opaque and transparent pixels, and unclipped margins before copying them into the game. It generates common crop metadata for each footprint and the full `alpha-review.json` report. The production loader is `dist/directional-sprites.js`; the registry and drawing integration are in `dist/directional-buildings.js`.

The style is integrated into the replacement library in the current architecture worktree. Browser review covers selection, first-load fallback, applying to an existing city, and four-view rendering of all sixteen footprints. The broader architecture milestone remains in progress; this is not a claim of complete catalog or final visual polish.

An initial Imagegen sheet explored a warm limestone and bronze office but was rejected for colored edge artifacts and inconsistent roof details and rotations. The production asset is separately constructed original geometry, not an edited version of that raster sheet.

Five-tile generation and staging are complete: 100 views cover all 25 footprints. The expanded mixed office/factory browser fixture has been reviewed from North, East and South. Its West-facing check remains pending because the Mac is locked; the earlier complete rotation review covers footprints up to 4×4.
