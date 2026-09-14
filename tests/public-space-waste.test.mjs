import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {RECREATION} from '../dist/recreation.js';
import {RECREATION_WASTE,TRANSIT_WASTE,publicSpaceWasteProduction,publicSpaceWasteReport,publicSpaceGarbageInspection} from '../dist/public-space-waste.js';
import {processGarbage} from '../dist/utilities.js';
import {garbageSourceRoads} from '../dist/reward-waste.js';
const put=(c,k,a,b=a)=>assert.ok(build(c,k,selection(k,a,b)).ok,k);
function town(){const c=createCity('Public waste',false);c.startYear=2000;c.funds=100000;for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});return c;}
for(const [type,rate] of Object.entries(RECREATION_WASTE)){
 const c=town();if(type==='marina')c.tiles[20*48+19].terrain='water';put(c,type,{x:20,y:20});const root=c.tiles[20*48+20];assert.equal(c.stats.wasteProduction,rate);processGarbage(c);assert.equal(root.waste,rate,'open recreation generates without roads');
 const y=RECREATION[type].size===1?23:25;put(c,'road',{x:20,y},{x:39,y});put(c,'landfill',{x:40,y});assert.ok(garbageSourceRoads(c,root).length);if(y===25)assert.equal(root.roadIds.length,0,'far-side footprint access');
 for(let i=0;i<3;i++){recompute(c);processGarbage(c);assert.equal(root.waste,0,'collection stays connected on every cycle');}
 put(c,'bulldoze',{x:34,y},{x:37,y});processGarbage(c);assert.equal(root.waste,rate);const save=serializeCity(c);assert.equal(serializeCity(validateSave(JSON.parse(save))),save);assert.match(publicSpaceGarbageInspection(c,root),/waiting/);assert.match(publicSpaceWasteReport(c),/Public space garbage/);
 root.fire=5;assert.equal(publicSpaceWasteProduction(c,root),0);root.fire=0;put(c,'road',{x:34,y},{x:37,y});processGarbage(c);assert.equal(root.waste,0);
}
for(const [type,rate] of Object.entries(TRANSIT_WASTE)){
 const c=town();put(c,type,{x:20,y:20});const root=c.tiles[20*48+20];assert.equal(publicSpaceWasteProduction(c,root),0);
 if(type!=='busStop'){
  if(type!=='subwayStation')put(c,'rail',{x:21,y:20});
  if(type!=='trainStation')put(c,'subway',{x:20,y:20});
  assert.equal(publicSpaceWasteProduction(c,root),rate);processGarbage(c);assert.equal(root.waste,rate,'passenger connection is not garbage collection');
 }
 put(c,'road',{x:20,y:21},{x:39,y:21});put(c,'landfill',{x:40,y:21});assert.equal(publicSpaceWasteProduction(c,root),rate);
 for(let i=0;i<3;i++){recompute(c);processGarbage(c);assert.equal(root.waste,0);}
 for(const [key,value] of [['funding',0],['condition',20],['underfunded',6]]){const old=c.transport[key];c.transport[key]=value;recompute(c);assert.equal(publicSpaceWasteProduction(c,root),0);c.transport[key]=old;recompute(c);}
 root.fire=5;recompute(c);assert.equal(type==='busStop'?root.stopActive:root.stationActive,false);assert.equal(publicSpaceWasteProduction(c,root),0);
}
console.log('PASS: recreation/transit waste rates, whole-footprint collection, immediate and sustained collection, isolation, saved backlog, passenger-only access and shutdowns.');
