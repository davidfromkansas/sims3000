# Police squad recall

The Emergency panel lists manually dispatched squads, their home stations and their destinations. Players can recall each squad individually. A recalled station squad becomes available for automatic precinct response; a recalled volunteer brigade leaves its assigned position. The next dispatch uses an available squad before cycling existing assignments.

Orders now store their station root (or -1 for volunteers). Removing an earlier station no longer transfers orders to the next station. Missing-station orders are pruned on dispatch/riot steps and load, and their map markers are hidden. Other orders retain their station and destination. An exact-site station replacement before a pruning step remains a root-identity limitation, rather than a globally unique station identity.

Save schema 135 persists owners, rejects duplicate/out-of-range/missing owners in current files, and migrates version-134 and earlier ordinal orders using their saved station order. The full city retains its other migration paths.

Validation covers individual recall, next-available reuse, removal of a different station, roster output, invalid saves, legacy migration and resumed emergency behavior. Browser review remains pending while the Mac is locked. Sites publication remains blocked by automatic approval review pending explicit source-export authorization.
