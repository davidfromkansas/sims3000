# Chrysler Building landmark milestone

Players can choose the Chrysler Building from the landmark gallery and place a free 3×3 landmark. The original geometric model turns with the map; generated gallery art presents the building separately. It follows existing one-per-city, no-upkeep, demolition/rebuilding and alien-target behavior. Custom scenarios can count this landmark, bringing the collection to five.

Manual pp.56 and 124 establish freely available unique landmarks and alien attraction. This original stylized model, footprint and catalog addition are reconstruction choices, not a recovered shipped asset or proof of full catalog fidelity.

Save schema 127 accepts earlier saves and requires 127 for the new building type. The generated illustration is stored at dist/assets/chrysler-building-gallery.png; the city model is procedural Canvas geometry with stepped masonry, window bays, silver crown and spire.

Validation: all 247 regression suites passed. Expanded landmark tests cover free placement, duplicate rejection, scenario metrics, save/load continuation, older-schema rejection and four projected views within cache bounds. The final geometry adjustment also passed the landmark suite. The browser fixture tests/browser/chrysler-landmark.html visually checks all four views and reports successful placement and a nine-tile restored footprint at schema 127.

Feedback checkpoint: choose Chrysler Building in the landmark gallery, place it on clear level ground, rotate the city, and inspect its skyline scale. Full original catalog and AAA visual acceptance remain unfinished.

Publication remains at Sites version 150 pending explicit source-export authorization. This milestone is available locally and through GitHub.
