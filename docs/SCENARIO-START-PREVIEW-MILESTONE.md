# Scenario starting-town inspection milestone

Selecting a prepared challenge now shows its actual starting city before the player commits to replacing their current city. The briefing includes map dimensions, starting year, residents and treasury, plus a top-down thumbnail. Players can switch between City, Power service, Water service and Surface rail views.

Manual page 35 describes selecting a scenario, viewing its thumbnail and description, then confirming the load. This adds that missing inspection step to all seven prepared scenarios. The four selectable diagnostic previews extend the manual thumbnail using the same colors and state as the game’s navigation map. These are original prepared cities, not recovered shipped scenario files.

Each briefing generates a separate deterministic starting city through the same factory used by Start. Map rendering groups adjacent equal-color tiles into SVG paths; no external imagery, server data, background timer or modification to the current city is involved. Back and Export retain their existing behavior. Starting still requires the explicit Start challenge button. Save schema remains 119.

Feedback exercise: compare Water under pressure’s City and Water service maps, and Roadless Paradise’s Surface rail map before starting either challenge. Assess whether the preview helps choose a challenge and understand its layout.

Validation covers every tile in all four layers for all seven scenarios, bounded SVG output, accessible image labels, unchanged starting/current city state, actual layer controls, Back, Export and the explicit Start transition. Local browser testing verified the compact preview, all four layer controls and Back without changing New Haven (224 residents, §42,500), with no browser errors. The map and controls sit side by side when space permits. Review also found and fixed false utility-outage colors on buildings that do not consume that utility; the shared navigation map now uses actual base demand to decide service eligibility. Pixel-level tests include these nonconsuming-building cases. Player feedback remains pending.

Source milestone only; Sites publication remains pending explicit source-export approval.
