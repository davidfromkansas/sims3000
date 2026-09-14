# Asian landmark batch — original miniature artwork

Original procedural geometry in `dist/asian-landmark-models.js` currently supplies Tokyo Tower, Bank of China Tower and Nam San Tower. Four transparent 512×848 views per model are generated with `node scripts/render-asian-landmarks.mjs`, then assembled with `python3 scripts/assemble-asian-landmarks.py`. The assembly rejects artwork touching a frame boundary. All twelve views and the corrected contact sheet were inspected. Bank of China Tower's authored vertical scale was reduced to keep both masts in frame in every rotation.

All three models are now registered in the playable catalog, bringing it to sixteen landmarks. Each uses an authored 3×3 footprint, free unique placement and four directional views. Focused catalog, placement/demolition, scenario metric, gallery and saved monthly-continuation checks passed. City schema 153 accepts older cities and rejects new landmark types mislabeled as older saves. Interactive browser acceptance remains pending. Original game footprints are unverified; the displayed plinth and architectural proportions are authored game-scale interpretations. These models are not claims of survey accuracy or exact historical game artwork.

## Architectural sources

- [Tokyo Tower's official Towerpedia](https://en.tokyotower.co.jp/plan/towerpedia/) identifies its 333 m height, international-orange/white paint, and decks at 150 m and 250 m. The miniature uses an open four-legged lattice, two square observation levels and a striped mast. Its lattice density, facade subdivisions and normalized scale are authored. It does not reproduce modern lighting programs.
- [Bank of China's tower profile](https://www.bochk.com/m/en/aboutus/corpprofile/boctower.html) describes four prism-shaped shafts, a 315 m tower structure and two masts reaching 367.4 m overall. The miniature uses four unequal triangular prisms, sloped caps, facade bracing and two masts. Exact roof profiles and brace counts are simplified, and upper exposed inner faces remain visually sparse.
- [N Seoul Tower's official construction data](https://www.nseoultower.co.kr/eng/global/intro2.asp) identifies a 236.7 m tower, comprising a 135.7 m body and 101 m steel tower. The miniature separates the concrete shaft/observation body from the antenna. The manual-era catalog name is Nam San Tower. Mountain elevation, later branding and exact original-game geometry are not reproduced.

Catalog membership comes from the existing `docs/landmark-inventory.json` audit: Bank of China Tower and Tokyo Tower are standard entries; Nam San Tower is an Unlimited addition. The three runtime mappings are registered; 84 inventory entries remain unmapped. Mapping establishes presence, not complete architectural fidelity.

## Player feedback exercise

Search the landmark gallery for Tokyo, Hong Kong and Seoul. Rotate each preview, place each landmark, then rotate the city and inspect its silhouette at ordinary zoom. Try a duplicate, demolish from a far footprint corner and rebuild. Save and restore the city. Assess recognizability, placement clarity and whether the preview matches the city.

`review-challenge.city.json` is an importable original scenario with an open site and a road. Place all three landmarks anywhere they fit and retain them for two monthly checks within twelve months. Suggested northwest corners are Tokyo (10,16), Bank of China (22,16) and Nam San (34,16). Demolishing a landmark before the second check resets the hold. `node scripts/create-asian-landmark-review.mjs` regenerates the file and verifies placement, interrupted progress, rebuilding and a save restored before victory. The exercise is for collection feedback, not a shipped-game scenario reconstruction.
