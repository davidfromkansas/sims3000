# From town to city

The first-town guide now continues with live 5,000 / 20,000 / 25,000 population targets and practical guidance on density, jobs, land value, utilities, waste and rewards. It shows current spare electricity/water, waste backlog and budget figures. Targets can regress and are labeled as practice milestones rather than original-game victory rules.

## Ordinary-construction evidence

`npm run test:city-progression` starts an empty, flat 96 × 96 easy city in 2000 with the normal §50,000. It uses only construction tools and monthly ticks; it never assigns population, grants funds, takes loans or edits development levels. The source includes every coordinate and construction order for reproduction.

| Month | Residents | Treasury | What the run establishes |
| --- | ---: | ---: | --- |
| 24 | 1,216 | §43,869 | Low-density town with adequate coal power and landfill |
| 48 | 2,656 | §48,122 | Water supply and high-density zoning alone still encounter land-value limits |
| 72 | 6,520 | §129,192 | Parks and public safety support taller buildings |
| 96 | 5,656 | §238,441 | Full landfills create a garbage crisis after expansion reached 12,192 |
| 120 | 22,040 | §383,872 | Waste-to-energy processing and staged expansion restore growth |
| 144 | 32,296 | §884,638 | Continued expansion passes 25,000 with working utilities and no waste backlog |

Under the earlier pre-137 thresholds, Mayor’s House was earned in month 53 and City Hall in month 115. With the corrected original approval requirement, this route leaves both rewards locked; the acceptance run now checks that behavior. The final year is replayed from a saved city and must exactly match the uninterrupted run. Floating-point utility residuals below 1e-7 count as fully served.

This establishes one ordinary-construction route beyond 25,000. It does not prove original balance, all map types, mobile performance, 150,000-resident progression or long-term stability after this run. Education and hospital development are absent from this particular strategy. Earlier one-coal-plant exploration failed from overload; the reproducible route uses adequate supply. More landfill alone was not a permanent disposal solution.

Town-guide behavior and the longer acceptance run are checked separately. No simulation formulas or save schema changed (135). Browser review remains pending while the Mac is locked; Sites publication remains blocked by automatic approval review pending explicit source-export authorization.
