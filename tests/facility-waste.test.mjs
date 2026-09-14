import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {processGarbage} from '../dist/utilities.js';
import {garbageSourceRoads} from '../dist/reward-waste.js';
import {facilityWasteSources,facilityGarbageInspection,facilityWasteReport} from '../dist/facility-waste-report.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const put=(c,k,a,b=a)=>assert.ok(build(c,k,selection(k,a,b)).ok,k);
function town(type){const c=createCity('Port disposal',false);c.startYear=2050;c.funds=1000000;for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});for(let y=0;y<48;y++)c.tiles[y*48+18].terrain='water';if(type==='seaport')c.tiles[20*48+19].terrain='water';put(c,'solar',{x:26,y:20});put(c,'pump',{x:19,y:21});put(c,'pipe',{x:19,y:21},{x:23,y:21});put(c,'road',{x:20,y:28},{x:39,y:28});put(c,type,{x:20,y:20},{x:type==='airport'?22:21,y:type==='airport'?24:25});return c;}
for(const [type,rate] of [['airport',7.2],['seaport',3.84]]){
 const c=town(type),root=c.tiles[20*48+20];assert.equal(c.stats.facilityPlots[0].ready,true);assert.equal(c.stats.wasteProduction,0);for(let i=0;i<5;i++)tick(c);assert.equal(c.stats.wasteProduction,0);tick(c);near(c.stats.wasteProduction,rate);near(facilityWasteSources(c)[0].waiting,rate);assert.equal(root.roadIds.length,0);assert.ok(garbageSourceRoads(c,root).length,'far side of facility provides collection');put(c,'landfill',{x:40,y:28});processGarbage(c);near(facilityWasteSources(c)[0].waiting,0);
 put(c,'bulldoze',{x:34,y:28},{x:37,y:28});processGarbage(c);near(facilityWasteSources(c)[0].waiting,rate);assert.match(facilityGarbageInspection(c,c.tiles[24*48+21]),/waiting across/);assert.match(facilityWasteReport(c),/Port facility garbage/);const save=serializeCity(c);assert.equal(serializeCity(validateSave(JSON.parse(save))),save);put(c,'road',{x:34,y:28},{x:37,y:28});
 put(c,'removePipe',{x:19,y:21},{x:23,y:21});assert.equal(c.stats.wasteProduction,0);processGarbage(c);near(facilityWasteSources(c)[0].waiting,0,'inactive facility still clears waste');for(let i=0;i<6;i++)tick(c);assert.equal(c.stats.facilityPlots[0].abandoned,true);assert.equal(c.stats.wasteProduction,0);put(c,'pipe',{x:19,y:21},{x:23,y:21});for(let i=0;i<6;i++)tick(c);near(c.stats.wasteProduction,rate);
 const restored=validateSave(JSON.parse(serializeCity(c)));for(let i=0;i<3;i++){tick(c);tick(restored);near(c.history.at(-1).garbageGenerated,rate);near(c.history.at(-1).garbageUncollected,0);assert.equal(serializeCity(c),serializeCity(restored));}
 root.fire=5;recompute(c);assert.equal(c.stats.wasteProduction,0);assert.match(c.tiles[24*48+21].facilityReason,/Fire has closed/);root.fire=0;recompute(c);near(c.stats.wasteProduction,rate);c.finance.roadCondition=20;recompute(c);assert.equal(c.stats.wasteProduction,0);assert.deepEqual(garbageSourceRoads(c,root),[]);
}
const adjacent=town('airport');put(adjacent,'airport',{x:23,y:20},{x:25,y:24});put(adjacent,'landfill',{x:40,y:28});for(let i=0;i<6;i++)tick(adjacent);assert.equal(facilityWasteSources(adjacent).length,2);near(adjacent.stats.wasteProduction,14.4);near(adjacent.stats.uncollectedWaste,0);
console.log('PASS: airport/seaport per-tile waste, six-month development, full-footprint collection, isolated saved backlog, service shutdown/reopening, damage, road condition and saved monthly continuity.');
