# Courtyard apartments — architecture collection draft

Original four-story terracotta apartment geometry with limestone window surrounds, balconies, an open-air planted courtyard, ground-level entrance passage and asymmetric rooftop stair enclosure. No external models, textures or fonts are used.

`render.py` accepts width and depth from 1 through 5 after Blender’s `--` separator. Apartment bays and courtyard dimensions change with the footprint while floor height remains constant. Four transparent 768×768 views use a fixed camera and lighting, with negative quarter-turn model rotations matching the game. The 1×1 run also saves the editable Blender model.

The initial 1×1 view has been visually inspected. An early facade transform error was corrected before expanding the model. All 100 images completed and passed staging checks for alpha, dimensions and unclipped bounds. The 1×5 rear and 5×5 west views were also inspected. The directional registry now uses these views for existing style 78; saved custom models retain priority. Browser review in a played city remains pending.
