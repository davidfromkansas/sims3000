import assert from 'node:assert/strict';
import {createCity,build,recompute,validateSave} from '../dist/engine.js';
import {recomputeCivic} from '../dist/civic.js';
import {hospitalStaffing,hospitalizationRate} from '../dist/hospital.js';
import {civicFacilityDetails,civicFacilityReport} from '../dist/civic-service-report.js';
import {serializeCity} from '../dist/save.js';
// Isolate finite hospital capacity from electricity and traffic in a 32,000-resident catchment.
const c=createCity('Hospital load',false);
for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,airPollution:0,waterPollution:0});
const h=c.tiles[0];Object.assign(h,{type:'hospital',powered:true,roadIds:[1]});
for(let i=1;i<=500;i++)Object.assign(c.tiles[i],{type:'residential',level:3,roadIds:[1]});
c.stats.population=32000;
assert.equal(hospitalizationRate(c),.05);
recomputeCivic(c);let d=civicFacilityDetails(c,h);
assert.equal(d.demand,1600);assert.equal(d.capacity,1500);assert.equal(d.combinedCoverage,93.75);
c.civic.funding.health=150;recomputeCivic(c);assert.equal(civicFacilityDetails(c,h).combinedCoverage,93.75,'overfunding cannot create beds');
assert.equal(hospitalStaffing(150).beds,1500);assert.equal(hospitalStaffing(150).doctors,150);
c.civic.funding.health=50;recomputeCivic(c);assert.equal(civicFacilityDetails(c,h).capacity,750);assert.equal(civicFacilityDetails(c,h).combinedCoverage,46.875);
c.civic.funding.health=100;const second=c.tiles[501];Object.assign(second,{type:'hospital',powered:true,roadIds:[1]});recomputeCivic(c);assert.equal(civicFacilityDetails(c,h).combinedCoverage,100,'another connected hospital adds beds');
Object.assign(second,{roadIds:[2]});recomputeCivic(c);assert.equal(civicFacilityDetails(c,h).combinedCoverage,93.75,'beds cannot serve an unrelated road network');
for(const t of c.tiles){t.airPollution=100;t.waterPollution=100;}
assert.ok(Math.abs(hospitalizationRate(c)-.1499)<1e-12);recomputeCivic(c);d=civicFacilityDetails(c,h);assert.ok(d.combinedCoverage<32,'pollution raises patient demand without population growth');
assert.ok(Math.abs(d.contribution-d.combinedCoverage)<1e-9,'query and simulation agree');assert.match(civicFacilityReport(c,h),/does not add beds/);
h.fire=10;recomputeCivic(c);assert.equal(civicFacilityDetails(c,h).capacity,0);assert.equal(c.tiles[1].healthCoverage,0);
const saved=createCity();assert.ok(build(saved,'hospital',[{x:23,y:25}]).ok);saved.civic.funding.health=75;recompute(saved);
const restored=validateSave(JSON.parse(serializeCity(saved))),root=saved.tiles.find(t=>t.type==='hospital'),loaded=restored.tiles.find(t=>t.type==='hospital');
assert.deepEqual(civicFacilityDetails(restored,loaded),civicFacilityDetails(saved,root));
assert.equal(restored.stats.healthCoverage,saved.stats.healthCoverage);
console.log('PASS: finite hospital beds, staffing budgets, patient demand, pollution pressure, isolated catchments, damage and saved-city reconstruction.');
