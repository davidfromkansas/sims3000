# Navigate disaster recovery

## Playable improvement

The Emergency panel now lists current recovery sites with direct map/inspection links: contamination, rubble, abandoned buildings and occupied RCI sites with interrupted electricity or required water service. Players can page through all sites, twelve at a time. Larger buildings appear once, active flames stay in emergency response locations, and never-watered light starter development is not mislabeled as interrupted water service.

Each entry explains its next step. The list refreshes from current conditions after repairs. It explicitly includes problems that may have preceded a disaster rather than attributing all shortages to it. The duplicated disaster-relief section has been removed.

## Feedback checkpoint

After an emergency, open Emergency → Recovery sites. Inspect a damaged or disconnected site, repair the relevant structure or network, then return to the list. In Water under pressure, use the list to inspect current interruptions and verify that repairing the trunk removes them. For more than twelve sites, check Next/Previous sites.

## Verification and scope

247 regression suites passed, followed by the recovery-suite rerun after adding paging. Tests cover real pipe and rubble repairs, electrical interruption, contamination priority, active-fire exclusion, building deduplication, page bounds and exact inspection coordinates without city mutation. Browser QA displayed 22 interrupted sites, paged to sites 13–22 and opened the industrial site at tile 31,28, which confirmed established water service was interrupted. Normal player city was untouched.

This is a browser recovery aid supporting the manual’s disaster-response and infrastructure-repair gameplay. It is not a historical damage ledger, does not locate removed infrastructure that leaves no current marker, and does not automatically rebuild or remove contamination. It shows the highest-priority current problem at each site; another problem may appear after that one is repaired. Save schema126 is unchanged. GitHub/local delivery only while Sites source-export approval is pending.
