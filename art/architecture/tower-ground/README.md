# Tower landscaping review

`terrace-garden.building.json` is an original importable tower model with grass and a paved path. It retains tower parameters and has no block or voxel conversion. The four-view review uses actual renderer polygons and was visually inspected. Portable building and city save roundtrips passed.

Reproduce with `node scripts/render-tower-ground-review.mjs`, then `python3 scripts/assemble-tower-ground-review.py`. The second script checks bounds and draws the exported polygons. `review-polygons.json` is generated review geometry, not an additional runtime asset.

Player feedback exercise:

1. Import this model into Building Architect and confirm Tower parameters remains selected.
2. Paint visible grass with asphalt, then use Undo ground painting and Redo ground painting.
3. Sample grass and fill the connected outside ground. Try clicking through a wall; it should not paint hidden ground.
4. Change the floor count, roof and width. Ground paint should remain attached to the lot.
5. Rotate all four ways and compare the model with the review image.
6. Apply, save the city and restore it. Verify the tower settings and landscaping remain.

Ground fill uses the centers of a 10×10 lot grid to identify the plinth barrier. This is an authored reconstruction rule. Ground history resets when changing construction method; the latest painted ground is retained. Browser interaction/layout acceptance remains pending.
