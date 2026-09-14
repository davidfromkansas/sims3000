import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {civicFacilityDetails,civicFacilityReport} from '../dist/civic-service-report.js';
const c=createCity('Service inspection',false);c.funds=1000000;for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;}
const place=(type,x,y,xx=x,yy=y)=>assert.ok(build(c,type,selection(type,{x,y},{x:xx,y:yy}),3).ok,type),at=(x,y)=>c.tiles[y*48+x];
place('coal',8,14);place('road',10,20,35,20);place('powerline',10,22,35,22);place('residential',12,18,17,18);place('industrial',22,18,27,18);for(let x=12;x<=17;x++)at(x,18).level=3;for(let x=22;x<=27;x++)at(x,18).level=1;
const buildings={hospital:[12,23],school:[15,23],college:[18,23],library:[21,23],museum:[23,23],jail:[26,23],police:[29,23],fire:[32,23]};for(const [type,[x,y]]of Object.entries(buildings))place(type,x,y);recompute(c);
const hospital=at(12,23);let d=civicFacilityDetails(c,hospital);assert.equal(d.operating,true);assert.equal(d.residents,384);assert.equal(d.homes,6);assert.equal(d.capacity,1500);assert.equal(d.contribution,100);assert.equal(d.combinedCoverage,100);
c.civic.funding.health=1;recompute(c);d=civicFacilityDetails(c,hospital);assert.equal(d.capacity,15);assert.ok(Math.abs(d.contribution-d.combinedCoverage)<1e-9,'reported standalone contribution matches actual health coverage');assert.match(civicFacilityReport(c,hospital),/unmet demand/);
for(const [type,[x,y]]of Object.entries(buildings)){const detail=civicFacilityDetails(c,at(x,y));assert.equal(detail.operating,true);assert.match(civicFacilityReport(c,at(x,y)),/Review department/);if(['school','college'].includes(type))assert.ok(detail.demand>0&&detail.demand<detail.residents);}
c.civic.funding.police=25;recompute(c);assert.match(civicFacilityReport(c,at(29,23)),/operating radius is 15 tiles/);assert.match(civicFacilityReport(c,at(26,23)),/contributes 50 operating places/);c.civic.funding.police=100;recompute(c);
Object.assign(at(42,42),{type:'residential',level:1});recompute(c);assert.equal(civicFacilityDetails(c,hospital).residents,384,'isolated residents do not count as reachable capacity demand');
c.civic.underfunded.health=6;recompute(c);d=civicFacilityDetails(c,hospital);assert.equal(d.capacity,0);assert.equal(d.fundedCapacity,15);assert.ok(d.reasons.includes('Department workers are on strike'));assert.match(civicFacilityReport(c,hospital),/Not operating/);
c.civic.underfunded.health=0;c.finance.roadCondition=0;recompute(c);assert.match(civicFacilityReport(c,hospital),/Road network closed/);assert.equal(civicFacilityDetails(c,hospital).operating,false);
c.finance.roadCondition=100;c.civic.funding.health=100;recompute(c);const restored=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(civicFacilityDetails(restored,restored.tiles[23*48+12]),civicFacilityDetails(c,hospital));
assert.equal(civicFacilityDetails(c,at(0,0)),null);
console.log('PASS: individual civic reports reflect real connected homes, funded capacity, coverage overlap, youth/adult demand, strikes/road closure, police/fire radius, jail adequacy and restored city state.');
