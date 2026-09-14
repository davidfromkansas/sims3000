# Recreation and transit garbage

Players now need disposal capacity for large parks, ponds, playgrounds, marinas, zoos, sports parks, bus stops and the three station types. The Utilities report groups their monthly production and waiting garbage, and building inspection exposes each site's backlog. Collection considers roads beside the entire recreation footprint, including on the first month after construction.

Open recreation produces garbage even without road access. Operating transit sites produce garbage while connected to their required passenger infrastructure; rail or subway connections alone do not provide road collection. Damage and transit shutdowns stop new production but retain existing garbage. Damaged stations and bus stops also stop passenger operation.

Rates follow the garbage weights in Prima's SimCity 3000 Unlimited guide, table 14-2, pages 216–217, divided by 100 per building per simulation month. Large park .9, pond .4, playground .4, marina 3.6, zoo 6.4, sports park 3.2, bus stop .4, train station 2.4, subway station .6 and rail–subway connection .6. The monthly scale is reconstruction calibration; this does not claim exact original-game balance. Small parks and fountains retain their previous behavior. No save-schema migration is required.

Validation covers every rate, one charge per recreation footprint, far-side collection, sustained collection after recomputation, isolated disposal, backlog save round trips, transit funding/condition/strike gates and fire closure. A continued ordinary 175,080-resident city adds a zoo, sports park and bus stop through normal construction for 10 additional units/month, then runs a year with conserved garbage accounting and no public-space backlog.

Browser review remains pending because the Mac is locked. This milestone is for local preview and GitHub; the live Site remains unchanged pending explicit repository-export authorization.

All 295 default suites passed (293 on the full run; two freight fixtures updated to include a train station's new 2.4-unit production, then passed). The ordinary city audit ended at month 585 with 175,080 residents, §17,052,400 and zero garbage backlog; its final save round-tripped exactly.
