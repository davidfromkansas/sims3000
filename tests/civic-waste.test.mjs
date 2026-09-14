import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {SERVICES,civicMembers} from '../dist/civic-footprints.js';
import {civicWasteProduction,civicWasteReport,civicGarbageInspection} from '../dist/civic-waste.js';
import {garbageSourceRoads} from '../dist/reward-waste.js';
import {processGarbage,wasteProduction} from '../dist/utilities.js';
import {wasteState} from '../dist/waste-accounting.js';
const put=(c,k,a,b=a)=>assert.ok(build(c,k,selection(k,a,b)).ok,k);
function town(type){const c=createCity('Service waste',false);c.startYear=2000;c.funds=100000;for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});put(c,'solar',{x:10,y:20});put(c,'powerline',{x:14,y:20},{x:19,y:20});put(c,'road',{x:20,y:25},{x:39,y:25});put(c,type,{x:20,y:20});return c;}
for(const [type,rate] of Object.entries({police:2.7,fire:2.7,hospital:2.16,school:3.6,jail:5.76,college:5.04,library:1.2,museum:1.2})){
 const c=town(type),root=c.tiles[20*48+20],members=civicMembers(c,root),department=SERVICES[type].department;assert.equal(root.roadIds.length,0);assert.ok(garbageSourceRoads(c,root).length>0);assert.equal(c.stats.wasteProduction,rate);assert.equal(members.reduce((sum,t)=>sum+wasteProduction(t,c),0),rate);
 put(c,'landfill',{x:40,y:25});processGarbage(c);assert.equal(root.waste,0);assert.equal(wasteState(c).stored,rate);assert.match(civicWasteReport(c),/Civic buildings/);assert.match(civicGarbageInspection(c,members.at(-1)),new RegExp(rate.toFixed(2).replace('.','\\.')+' units/month'));
 put(c,'bulldoze',{x:34,y:25},{x:37,y:25});processGarbage(c);assert.equal(root.waste,rate);const saved=serializeCity(c);assert.equal(serializeCity(validateSave(JSON.parse(saved))),saved);put(c,'road',{x:34,y:25},{x:37,y:25});
 c.civic.funding[department]=0;recompute(c);assert.equal(c.stats.wasteProduction,0);processGarbage(c);assert.equal(root.waste,0,'suspended service can clear old waste');c.civic.funding[department]=100;c.civic.underfunded[department]=6;recompute(c);assert.equal(civicWasteProduction(c,root),0,'strike stops new production');c.civic.underfunded[department]=0;recompute(c);
 members.at(-1).powered=false;assert.equal(civicWasteProduction(c,root),0,'live power loss on any member stops production');members.at(-1).powered=true;members.at(-1).fire=5;assert.equal(civicWasteProduction(c,root),0);members.at(-1).fire=0;assert.equal(civicWasteProduction(c,root),rate);
 c.finance.roadCondition=20;assert.deepEqual(garbageSourceRoads(c,root),[]);c.finance.roadCondition=100;put(c,'bulldoze',{x:root.x,y:root.y});assert.equal(c.stats.wasteProduction,0);put(c,type,{x:20,y:20});assert.equal(c.stats.wasteProduction,rate);
}
const old=town('school'),root=old.tiles[20*48+20];for(const t of civicMembers(old,root))if(t!==root)Object.assign(t,{type:null,root:null});root.civicSize=1;put(old,'road',{x:20,y:22},{x:39,y:22});recompute(old);const data=JSON.parse(serializeCity(old));data.version=128;for(const t of data.tiles)delete t.civicSize;const migrated=validateSave(data);assert.equal(migrated.stats.wasteProduction,3.6,'old single-tile school is charged once');
const c=town('school');put(c,'landfill',{x:40,y:25});const restored=validateSave(JSON.parse(serializeCity(c)));for(let i=0;i<3;i++){const before=wasteState(c);tick(c);tick(restored);const h=c.history.at(-1);assert.equal(h.garbageGenerated,3.6);assert.ok(Math.abs(before.waiting+h.garbageGenerated-h.garbageRecycled-h.garbageIncinerated-h.garbageLandfilled-h.garbageExported-h.garbageUncollected)<1e-8);assert.equal(serializeCity(c),serializeCity(restored));}
console.log('PASS: all eight civic waste rates, one charge per footprint, far-side collection, isolation/recovery, suspension/strike/damage/power gates, saved backlogs, legacy single-tile services and conserved replay.');
