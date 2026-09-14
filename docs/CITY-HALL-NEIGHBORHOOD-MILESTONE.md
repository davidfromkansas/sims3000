# City Hall neighborhood tradeoff

An operating City Hall now reduces crime within 20 tiles of its center and generates air pollution over 10 tiles and water pollution over 5 tiles. Players can compare the crime and pollution maps when deciding where to place it. Its inspection explains the tradeoff alongside its 36 jobs. Demolition, loss of power or road access, emergencies and poor road condition remove the operating effects.

Source: Prima Official Strategy Guide, printed p.409, https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide. The directory lists crime -20/radius 20, air pollution 450/radius 10 and water pollution 450/radius 5. This implementation uses up to 20 crime points with Euclidean linear falloff, after other crime modifiers. Pollution magnitude is divided by 100 for our 0–100 scale, using the existing square-distance pollution spread. Those conversions, service gating and falloff are reconstruction calibration, not recovered original algorithms. City Hall residential demand-cap relief remains unimplemented.

The effect is applied once per operating footprint. Crime cannot fall below zero. Derived crime relief is recomputed rather than saved; schema stays 127. Existing amenities and jobs are retained.

Validation: focused regression verifies distance boundaries, actual connected placement, crime/pollution tradeoff, repeat recomputation, saved continuation, demolition/rebuilding and power-loss shutdown. All 248 regression suites passed. Publication remains blocked pending explicit Sites source-export authorization.

Feedback checkpoint: place an earned City Hall near occupied homes, connect it to power and roads, inspect its explanation, and compare the crime, air pollution and water pollution maps before and after placement.
