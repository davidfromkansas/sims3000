# East Asian landmark collection

Players can place Himeji Castle, Geunjeongjeon Hall and Chiang Kai-shek Memorial Hall, rotate their gallery previews and city view, use each as a scenario objective, demolish and rebuild them, and continue from a saved city. Each is immediately available, unique, free to place and has no monthly upkeep or direct jobs/income. The catalog now has 25 modeled landmarks.

Checkpoint 7 links an original downloadable city challenge: place all three and keep them standing for two months. Losing a landmark resets the hold. The generator verifies a demolition, rebuilding and a save/reload before the winning month. This is an original exercise, not one of the shipped game's scenarios.

Schema 161 preserves old-city migration and rejects these new tile types in files claiming an earlier schema. Geometry uses the shared depth rasterizer in the gallery and city. Chicago landmarks also now use that raster path, matching their existing render-review artifacts instead of approximate painter sorting.

## Evidence and limits

The collection regression checks all twelve raster frames for finite coordinates/depth and clear image boundaries, then uses actual construction, uniqueness, far-corner demolition, scenario metrics and saved monthly continuation. The broader collection regression checks all 25 catalog entries. Browser review verified gallery registration, placed models in all four city directions, a two-month victory and restoration of that victory after reload. All 338 registered test commands passed across the initial run and a successful rerun of the final 34 commands after enlarging an outgrown rendering-test city from 48 to 96 tiles. Final geometry and drawing parity are covered by the successful tail run.

See the collection's art README for architectural sources and reconstruction limits. Footprints and dimensions are authored. These simplified meshes do not establish exact original artwork fidelity or AAA presentation. The full landmark inventory still has 75 unmapped entries.

## Player feedback

Open Checkpoint 7, download East Asian landmark collection, export your current city, and import the challenge. Place the three buildings; compare the gallery with the city in four directions. Run one month, demolish one, then rebuild and complete the challenge. Note which silhouettes and details are readable at normal playing zoom and which need improvement.

Publication remains pending the existing explicit Sites source-export approval. This milestone is ready for its grouped GitHub PR.
