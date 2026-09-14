# From town to metropolis

The town guide now continues through 50,000, 100,000 and 150,000 residents. Its “Before the next district” section uses current city reports to flag unserved utilities, garbage backlog, budget problems, residential capacity, insufficient workplaces, commercial/industrial employment limits and congestion. Buttons open the matching report or select construction tools. Targets reflect current population and can regress; they do not grant rewards or predict future growth.

## Ordinary-construction audit

The staged audit starts on empty, flat 256 × 256 land in 2000 on easy difficulty with the normal §50,000. It uses construction tools and monthly simulation only: no population grants, money grants, development-level assignments or loans.

The first 144 months reproduce the existing 32,296-resident route. Paired neighborhoods then add nuclear power, water pumps, waste-to-energy processing, parks, police, fire stations and jails. Population peaks at 141,896 before ending month 336 at 138,656. Utilities and housing capacity still have room, but commercial jobs are at their 25,000 cap and residential demand is negative because jobs lag residents. Three additional industrial districts restore demand; the staged run reaches 151,720 residents at month 346, with §14,118,849 and 96,141 jobs. Unserved utility residuals are below 1e-7 and uncollected garbage is zero.

The complete construction order is in the optional `npm run test:metropolis` acceptance run. This is intentionally separate from the default suite because of its duration. A fresh uninterrupted replay passed and reproduced the exact month-346 endpoint. The final city also passed save/validation round-trip equality. Town-guide checks pass, including warning recovery, population-target regression and construction/report action routing.

## Scope and feedback

This proves one path through the current simulation, not original-game balance, performance on every browser, indefinite stability, or reward eligibility. At the successful checkpoint aura is only 59.93/100; Stadium, University and County Courthouse are not earned. Reaching the population threshold alone does not qualify for all rewards.

Feedback focus: open the town guide in a developed city, follow its current growth warnings, and compare the resulting demand and service reports after running another month. No save schema change (135). Browser review remains pending while the Mac is locked. Sites publication remains blocked by automatic approval review pending explicit source-export authorization.

Current replay after civic garbage integration: `npm run test:metropolis` passed at 151,672 residents in month 345, with §14,056,342, no loans, no garbage backlog, served power/water and an exact save round trip. Construction remained unchanged; only the early population checkpoints were re-baselined for the corrected waste model (6,672 / 5,776 / 32,128). Earlier figures in this document describe the original pre-civic-waste run.

## Infrastructure waste replay

The current acceptance route adds collection roads beside power-plant corridors and two waste-to-energy plants at month 120. It passes at month 343 with 150,872 residents, §13,749,866, no loans or grants, no garbage backlog, fully served utilities and an exact final save round trip. Its month-144 foundation is 32,016 residents and §866,604. Earlier results above are historical.
