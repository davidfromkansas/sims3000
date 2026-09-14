# Courtyard apartment artwork

A new original Imagegen asset adds brick courtyard apartments to the residential building catalog. The transparent isometric miniature has limestone trim, bay windows, a small courtyard, rooftop stair housing and a water tank. The generated alpha is preserved and the runtime uses its opaque bounds.

Mixed apartment buildings is enabled by default in City view options. It deterministically alternates this artwork with the classic mid-rise on eligible single-tile level-two homes. Turning it off restores the classic selection. Explicit replacements and custom designs take precedence. Historical and abandoned buildings retain the selected appearance; larger building lots retain their own design flow.

The artwork is also available as Courtyard apartments in building replacement and reusable building sets. It changes appearance without changing occupancy, services, costs or simulation behavior. The new sprite is index 78; the replacement catalog has 17 styles. Save schema remains 134.

Feedback checkpoint: does medium-density growth now feel more visually varied and rewarding?

Validation: 277 automated suites pass, including stable selection, historical/abandoned appearance, custom priority, explicit replacement, saved building sets and view preference persistence. The generated 1254×1254 RGBA image was visually inspected. Browser review remains pending while the Mac is locked. Sites publication remains blocked pending explicit export authorization.

Asset: dist/assets/courtyard-apartments.png. Created with one built-in Imagegen request, without variants or postprocessing. The brief specified an original four-story brick courtyard apartment, orthographic isometric presentation, readable silhouette, warm upper-left lighting, transparent background and no text or logos.
