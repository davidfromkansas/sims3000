# Saved city landscape and tree choices


## Saved landscape and tree appearance checkpoint — milestone 5

City desk → Landscape & trees offers four landscape palettes (classic, lush grassland, dry grassland and cool highlands), the original grove artwork, and three original modeled tree families: broadleaf, evergreen and palm. Each modeled family has three planting densities and four distinct camera views. The preview rotates, changes remain a draft until applied, and restoring the original appearance is also previewed before application. The actual city renderer uses the chosen ground/coast/water/elevation colors and grove models, while the flora visibility preference still works.

Schema 112 saves the two appearance choices with each city, including custom challenge starting snapshots. Schema111 and earlier migrate to the original appearance. All tree-cover, environmental, demographic, building and utility simulation inputs remain unchanged. The actual large-map worker retains the selected appearance through monthly continuation. The current New City setup keeps the original visual defaults; players change appearance after accepting the terrain. Navigation remains a schematic map with its existing diagnostic colors.

Manual p.29 describes saved landscape/tree/building graphics choices and changing them during play. These palettes and botanical models are original artwork, not recovered original graphics sets; custom building choices remain in the separate designer and replacement workflow. The full original building/landmark catalog and browser visual/performance acceptance remain unfinished.

Validation: all 180 regression suites pass. New tests cover 36 distinct finite bounded tree views, deterministic transparent rasterization, actual four-view renderer integration, visibility controls, preview/apply/cancel/default handlers, bounded reusable 256px tree sprites, all appearance combinations, strict save validation, legacy migration, exact unchanged simulation, scenario starting snapshots and real worker continuation. The offline art sheet was rendered and visually inspected: [tree styles](previews/tree-styles.png). This is not a browser screenshot or browser acceptance result.

Feedback exercise: open Landscape & trees, compare a palm grove on dry grassland with evergreens in cool highlands, rotate the preview, then apply. Rotate the city, hide/show flora, save and reload, and restore the original appearance. Assess tree scale, readability and whether the visual settings feel coherent with the rest of the city.

This source milestone is not live. Explicit Sites source-export authorization remains pending after automatic approval review blocked publication.

Release cache graph: city-landscape-styles-1.


The original release limitation about choosing appearance only after terrain acceptance is superseded by [new-city artwork](NEW-CITY-ARTWORK-MILESTONE.md), which adds preview and selection during setup.
