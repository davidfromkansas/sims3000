import {civicFacilityReport} from '../dist/civic-service-report.js';
import assert from 'node:assert/strict';
import {createCity,build,recompute,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {residentialCap,residentialGrowthFits,residentialCapReport} from '../dist/residential-cap.js';
import {zoneGrowthReport} from '../dist/zone-growth.js';
const c=createCity('Recreation capacity',false);for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});
assert.equal(c.stats.residentialCap.limit,25000);assert.ok(build(c,'park',[{x:5,y:5}]).ok);assert.equal(c.stats.residentialCap.limit,25250);assert.ok(build(c,'zoo',[{x:10,y:10}]).ok);assert.equal(c.stats.residentialCap.limit,49250);assert.equal(c.stats.residentialCap.sources.length,2);
c.tiles[10*48+10].fire=10;recompute(c);assert.equal(c.stats.residentialCap.limit,25250);c.tiles[10*48+10].fire=0;recompute(c);
assert.equal(validateSave(JSON.parse(serializeCity(c))).stats.residentialCap.limit,49250);assert.match(residentialCapReport(c),/Zoo × 1: \+24,000/);
const small={stats:{residentialCap:{remaining:31}}},tile={type:'residential',level:0};assert.equal(residentialGrowthFits(small,tile,Array(4)),false);small.stats.residentialCap.remaining=32;assert.equal(residentialGrowthFits(small,tile,Array(4)),true);tile.level=1;assert.equal(residentialGrowthFits(small,tile,Array(4)),false);
// A real large city with jobs and supplied low-density homes reaches the cap.
const large=createCity('Capacity boundary',false,96);large.funds=1000000;large.startYear=2000;let homes=0;
for(const t of large.tiles){Object.assign(t,{terrain:'land',nature:false,elevation:0,density:1,age:50});if(t.x%3===0||t.y%3===0)t.type='road';else if(t.x%12===1&&t.y%12===1){t.type='wind';t.root=t.y*96+t.x;}else if(homes<3125){t.type='residential';t.level=1;homes++;}else{t.type='commercial';t.level=3;t.density=3;}}
recompute(large);assert.equal(large.stats.population,25000);assert.equal(large.stats.residentialCap.remaining,0);assert.ok(large.stats.demand.residential<=0);
const vacant=large.tiles.find(t=>t.type==='commercial'&&t.powered&&t.access);assert.ok(vacant);Object.assign(vacant,{type:'residential',level:0,density:1});recompute(large);assert.ok(zoneGrowthReport(large).find(r=>r.x===vacant.x&&r.y===vacant.y).reasons.includes('residentialCap'));
tick(large);assert.equal(vacant.level,0,'cap stops otherwise eligible vacant home');
// Remove one household and preserve capacity for exactly one new household.
const home=large.tiles.find(t=>t.type==='residential'&&t.level);home.level=0;recompute(large);assert.equal(large.stats.residentialCap.remaining,8);tick(large);assert.ok(large.stats.population<=25000,'monthly growth cannot overshoot the cap');
const park=large.tiles.find(t=>t.type==='commercial');Object.assign(park,{type:'park',level:0});recompute(large);assert.equal(large.stats.residentialCap.limit,25250);assert.ok(large.stats.demand.residential>0,'capacity relief restores positive underlying demand');
assert.equal(residentialCap(large).limit,25250);
console.log('PASS: residential base and recreation relief, operating-state removal, report/save continuity, multi-tile capacity, real 25,000-resident cap and monthly no-overshoot enforcement.');

const cultural=createCity('Museum capacity'),base=cultural.stats.residentialCap.limit;assert.ok(build(cultural,'museum',[{x:20,y:21}]).ok);const museum=cultural.tiles[21*48+20];assert.equal(museum.serviceActive,true);assert.equal(cultural.stats.residentialCap.limit,base+9000);assert.match(residentialCapReport(cultural),/Museum × 1: \+9,000/);assert.equal(validateSave(JSON.parse(serializeCity(cultural))).stats.residentialCap.limit,base+9000);
const population=cultural.stats.population;cultural.civic.funding.education=0;recompute(cultural);assert.equal(cultural.stats.residentialCap.limit,base);assert.equal(cultural.stats.population,population,'losing capacity does not evict residents');cultural.civic.funding.education=100;recompute(cultural);assert.equal(cultural.stats.residentialCap.limit,base+9000);museum.fire=10;recompute(cultural);assert.equal(cultural.stats.residentialCap.limit,base);museum.fire=0;recompute(cultural);assert.equal(cultural.stats.residentialCap.limit,base+9000);assert.ok(build(cultural,'museum',[{x:20,y:23}]).ok);assert.equal(cultural.stats.residentialCap.limit,base+18000,'operating museums add capacity independently');

assert.match(civicFacilityReport(cultural,museum),/Residential growth capacity: <strong>\+9,000 residents/);cultural.civic.funding.education=0;recompute(cultural);assert.match(civicFacilityReport(cultural,museum),/Residential growth capacity: <strong>\+0 residents/);
