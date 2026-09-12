# Riots and police dispatch

Manual pages 57–58 and 108 describe riots and police response: one squad plus one per police station, immediate arrival and blue dispatch pylons. Riots can now be started on occupied RCI buildings. The crowd moves among nearby development and can ignite fires. Local coverage and nearby dispatched police reduce its anger; funding, strikes and jail adequacy affect station squads. The volunteer squad always remains effective. Dispatch replaces squads in rotation once the limit is reached.

Fires continue after the crowd disperses, requiring firefighters and recovery. Normal calendar time is held throughout the emergency. Schema 33 preserves active riots and police assignments in saves; older cities migrate without riots. Imagegen supplied an original crowd sprite, with minor colored edge artifacts retained.

Anger, movement, ignition and response coefficients are reconstruction tuning. Optional unrest driven by city conditions is implemented; other disaster types remain unfinished.

Feedback: start a riot in an occupied neighborhood, dispatch police near the crowd, and then handle the fires. Compare with a neighborhood already covered by a funded police station.

Unrest follow-up: the manual’s scenario scripting example on page 185 links crime thresholds to riots. This recreation uses an optional six-month warning period when crime exceeds 40 or aura is below 40. Probability rises with severity to a maximum 3% monthly chance, using saved city seed and month. This is original calibration, not the original game formula. Healthy conditions reset the warning period. The least content occupied neighborhood is selected for an outbreak. Schema 34 saves the warning count and keeps older saves opted out.
