# Landmark catalog coverage

The current runtime catalog in `dist/landmarks.js` contains thirteen entries: Empire State Building, CN Tower, Washington Monument, Gateway Arch, Jefferson Memorial, Lincoln Memorial, Helsinki Cathedral, Arc de Triomphe, Chrysler Building, Eiffel Tower, Great Pyramid, Statue of Liberty and Big Ben. The separate `REWARDS` catalog contains fourteen entries; rewards must not be counted as landmark coverage.

The supplied manual, printed pages 56 and 124, establishes a browsable real-world landmark collection, immediate availability and one instance of each landmark per city. It does not enumerate a complete named landmark inventory in its extracted text.

EA’s [official Steam product listing](https://store.steampowered.com/app/2741560/SimCity_3000_Unlimited/) describes more than 95 world landmarks, plus Asian and European building sets. This is supplemental evidence of the original catalog’s scale, not a named inventory or proof of which regional/downloadable entries belong to that count. Thirteen implemented landmarks cannot establish complete original catalog coverage. Nor can 300 directional images of three RCI models stand in for hundreds of distinct building designs.

A provisional named inventory with edition/source provenance is now in `landmark-inventory.json`. The next expansion needs identity checks, original models and appropriate placement/save/query behavior for each verified entry. Do not substitute an arbitrary collection of famous buildings, treat the count as an exact 95-entry checklist, or claim that copied geometry/art has been recovered. Existing footprints and simplified models remain reconstruction decisions where the manual supplies no dimensions.

Acceptance remains separate for catalog completeness, recognizable original artwork, four-view consistency, placement/uniqueness/demolition, saved continuation, scenario counts and browser performance. All thirteen entries now have directional models and rotatable gallery previews. Current catalog coverage and regression results remain partial evidence only.

## Edition-specific directory located

[Prima’s Official Strategy Guide, chapter 28, printed pages 422–429](https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide) distinguishes 74 standard landmarks and 25 Unlimited additions. Its Unlimited directory identifies:

- Anglican Cathedral
- Atlantis Condominium
- Broadcasting Building
- City Hall (Seoul)
- CKS Memorial Hall
- Daibutu
- Dr. Sun Memorial Hall
- Grand Hotel
- Helsinki Cathedral
- Himeji Castle
- Kokkai
- Korea Life Building
- Kunjungjon
- Liver Building
- Liverpool Cathedral
- Nam Dae Moon
- Nam San Tower
- National Museum (Taipei)
- One Canada
- Palace of Fine Arts
- Shitteno-ji
- St. Stephens Cathedral
- Stockholm Royal Palace
- Taiwan Presidential Building
- The Duomo

Names reflect the directory’s extracted text; verify spelling and depicted identity against visual/architectural references before authoring models. This is supplemental catalog evidence, not recovered game geometry. The six current runtime entries do not include any of these 25 additions.

Helsinki Cathedral is the next grounded addition candidate. Its original-model brief, footprint decision, runtime integration, migration and placement/save/browser checks are still required. The standard directory and downloadable additions still need a complete reconciled inventory; the prior note that no edition-specific named source had been located is superseded.

## Reconciled development inventory

`landmark-inventory.json` records 99 base/Unlimited reference entries and the existing downloadable extension separately. The secondary standard-edition list supplies the CN Tower entry absent from the guide's extracted directory. That discrepancy is flagged, not silently resolved.

Run `node scripts/audit-landmark-coverage.mjs` to compare the inventory with runtime code. Current output: nine standard mappings, one Unlimited-addition mapping, and one download-extension mapping; 89 entries have no runtime mapping. Paired landmark parts retain separate entries. Original footprints remain unknown, and identity/composition questions remain explicit. The single-pyramid runtime mapping does not prove the original Great Pyramids composition.

This inventory is a development artifact, not a menu of unavailable buildings or a completeness claim. A runtime mapping establishes presence only. The audit rejects duplicate names, missing sources, stale mappings, multiple entries sharing one runtime type, and runtime types omitted from the inventory.

Skyline batch update: Empire State Building and CN Tower now map to runtime types, bringing coverage to thirteen mapped entries and 87 unmapped inventory entries. CN Tower’s directory-source discrepancy remains flagged. Both models use authored 3×3 footprints and passed focused gameplay/gallery/renderer checks; eight enlarged directional views were inspected. Browser acceptance remains pending.


## East Asian collection milestone

The working catalog now maps 25 of the 100 inventory entries, leaving 75 unmapped. Himeji Castle, Geunjeongjeon Hall (inventory Kunjungjon), and Chiang Kai-shek Memorial Hall add original directional models and authored 4 × 4 lots. Four-view browser review, real saved challenge victory and the full registered regression set passed; see EAST-ASIAN-LANDMARKS-MILESTONE.md for run boundaries and art sources. Catalog presence is not proof of original composition or dimensions.
