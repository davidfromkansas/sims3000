# Empire State Building and CN Tower

These are original procedural miniatures, authored for SIMS3000 in `dist/skyline-landmark-models.js`. They use the shared landmark gallery/city rasterizer. No original game artwork, external photographs or meshes were copied into the models.

## Architectural references

- [Empire State Building owner: architecture and design](https://www.esbnyc.com/about/architecture-design): Art Deco identity, setbacks and crowning spire, opened in 1931. The model represents the broad stepped base, long windowed shaft, upper terraces, observation crown and antenna. Window rows are visually condensed rather than a literal floor-for-floor reconstruction.
- [CN Tower owner: builder design brief, page 1](https://www.cntower.ca/media/2231/download?inline=): tapered legs, elevator shaft, main observation/restaurant decks, separate upper observation pod and antenna. The miniature uses a triangular core, three sampled tapered buttresses and stacked circular decks. The source gives total height 553.33 m and the main observation level at 346 m; model proportions are adapted for readability rather than a survey-accurate model.

The standard-game inventory contains Empire State Building. CN Tower remains flagged because it appears in the secondary catalog but was absent from the guide extraction. Architectural-owner evidence establishes the building form, not proof of its exact original-game availability.

Both use authored 3×3 gameplay footprints; original-game dimensions are unverified. Overall miniature height is normalized for the existing landmark canvas and does not promise a common real-world scale between all city landmarks. Existing free/unique landmark gameplay is reused, without adding jobs or revenue.

## Review and regeneration

Run from the repository root:

```
node scripts/render-skyline-landmarks.mjs
python3 scripts/assemble-skyline-landmarks.py
```

The second script requires Pillow, writes eight full-size RGBA PNGs and a contact sheet, and removes intermediate `.rgba` files. All eight enlarged views were inspected. The new regression verifies unclipped directional bounds/depth, placement, scenario counts, uniqueness, whole-footprint rebuilding and exact saved monthly continuation. Shared gallery and city-renderer checks cover both models. Actual browser visual acceptance and exact original model/palette fidelity remain pending.
