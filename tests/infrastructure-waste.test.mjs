import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {POWER_WASTE,powerWasteProduction} from '../dist/power.js';
import {processGarbage,wasteProduction} from '../dist/utilities.js';
import {garbageSourceRoads} from '../dist/reward-waste.js';
import {infrastructureWasteReport,infrastructureGarbageInspection} from '../dist/infrastructure-waste-report.js';
const put=(c,k,a,b=a)=>assert.ok(build(c,k,selection(k,a,b)).ok,k);
function town(){const c=createCity('Infrastructure waste',false);c.startYear=2050;c.funds=1000000;for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});return c;}
for(const type of Object.keys(POWER_WASTE)){
 const c=town();put(c,type,{x:20,y:20});const root=c.tiles[20*48+20];assert.equal(c.stats.wasteProduction,8);assert.equal(c.tiles.reduce((s,t)=>s+wasteProduction(t,c),0),8);processGarbage(c);assert.equal(root.waste,8);
 put(c,'road',{x:20,y:25},{x:39,y:25});put(c,'landfill',{x:40,y:25});assert.equal(root.roadIds.length,0);assert.ok(garbageSourceRoads(c,root).length);for(let i=0;i<3;i++){recompute(c);processGarbage(c);assert.equal(root.waste,0);}
 put(c,'bulldoze',{x:34,y:25},{x:37,y:25});processGarbage(c);assert.equal(root.waste,8);assert.match(infrastructureWasteReport(c),/Infrastructure garbage/);assert.match(infrastructureGarbageInspection(c,c.tiles[21*48+21]),/8.00 waiting/);const save=serializeCity(c);assert.equal(serializeCity(validateSave(JSON.parse(save))),save);
 const member=c.tiles[21*48+21];member.fire=5;assert.equal(powerWasteProduction(c,root),0);put(c,'road',{x:34,y:25},{x:37,y:25});processGarbage(c);assert.equal(root.waste,0,'existing waste clears during damage');member.fire=0;assert.equal(powerWasteProduction(c,root),8);
}
for(const type of ['wind','solar']){const c=town();put(c,type,{x:20,y:20});assert.equal(c.stats.wasteProduction,0);}
const c=town();put(c,'solar',{x:10,y:20});put(c,'powerline',{x:14,y:20},{x:19,y:20});put(c,'recycling',{x:20,y:20});const recycler=c.tiles[20*48+20];assert.equal(wasteProduction(recycler,c),0);put(c,'road',{x:20,y:21},{x:39,y:21});assert.equal(wasteProduction(recycler,c),.72);processGarbage(c);assert.ok(Math.abs(recycler.waste-.504)<1e-9,'recycling leaves residue without a disposal destination');put(c,'landfill',{x:40,y:21});processGarbage(c);assert.equal(recycler.waste,0);recycler.powered=false;assert.equal(wasteProduction(recycler,c),0);recycler.powered=true;c.finance.roadCondition=20;assert.equal(wasteProduction(recycler,c),0);assert.deepEqual(garbageSourceRoads(c,recycler),[],'unusable roads cannot collect recycling residue');
console.log('PASS: six plant waste rates, zero wind/solar waste, intact full footprints, first-month and far-side collection, isolated saved backlogs, damaged-plant cleanup and recycling residue.');
