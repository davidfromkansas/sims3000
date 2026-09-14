import assert from 'node:assert/strict';
import {createCity,build,validateSave} from '../dist/engine.js';
import {startRiot,dispatchPolice,stepRiot} from '../dist/riots.js';
import {recallPolice,policeOrdersReport,prunePoliceOrders} from '../dist/police-orders.js';
import {policeResponses} from '../dist/police-response.js';
import {serializeCity} from '../dist/save.js';
const c=createCity();for(const [x,y] of [[23,25],[27,14]])assert.ok(build(c,'police',[{x,y}]).ok);assert.ok(startRiot(c,20,20).ok);
for(let i=0;i<3;i++)assert.ok(dispatchPolice(c,40+i,40).ok);
const owners=c.emergency.policeUnits.map(p=>p.owner);assert.deepEqual(owners,[-1,14*48+27,25*48+23]);assert.equal(policeResponses(c).filter(p=>p.automatic).length,0);
const saved=serializeCity(c),loaded=validateSave(JSON.parse(saved));assert.equal(loaded.version,154);assert.deepEqual(loaded.emergency.policeUnits,c.emergency.policeUnits);assert.match(policeOrdersReport(c),/Recall squad/);assert.equal(serializeCity(c),saved);
assert.ok(recallPolice(c,owners[2]).ok);assert.equal(policeResponses(c).filter(p=>p.automatic).length,1);assert.equal(c.emergency.policeUnits.length,2);assert.equal(recallPolice(c,owners[2]).ok,false);assert.ok(dispatchPolice(c,22,20).ok);assert.equal(c.emergency.policeUnits.at(-1).owner,owners[2]);assert.deepEqual(c.emergency.policeUnits.slice(0,2),loaded.emergency.policeUnits.slice(0,2));
// Removing the earlier station cannot transfer its order to the surviving station.
for(const t of c.tiles.filter(t=>t.type==='police'&&t.y<20))Object.assign(t,{type:null,root:null});prunePoliceOrders(c);assert.deepEqual(c.emergency.policeUnits.map(p=>p.owner),[-1,owners[2]]);assert.equal(c.emergency.policeUnits[1].x,22);assert.equal(policeResponses(c).find(p=>p.station===owners[2]).x,22);
assert.ok(recallPolice(c,-1).ok);assert.equal(c.emergency.policeUnits.length,1);dispatchPolice(c,20,20);assert.equal(c.emergency.policeUnits.at(-1).owner,-1,'volunteer is the next available squad');
const legacy=JSON.parse(saved);legacy.version=134;for(const p of legacy.emergency.policeUnits)delete p.owner;assert.deepEqual(validateSave(legacy).emergency.policeUnits,loaded.emergency.policeUnits);
for(const change of [v=>delete v.emergency.policeUnits[0].owner,v=>v.emergency.policeUnits[1].owner=-1,v=>v.emergency.policeUnits[1].owner=999999]){const bad=JSON.parse(saved);change(bad);assert.throws(()=>validateSave(bad),/police squad owner/);}
const resumed=validateSave(JSON.parse(serializeCity(c)));for(let i=0;i<8;i++){stepRiot(c,()=>{});stepRiot(resumed,()=>{});}assert.deepEqual(resumed.emergency,c.emergency);
console.log('PASS: individual squad recall, available-slot reuse, stable station ownership through removal, roster reporting, version-134 migration, invalid-owner rejection and saved emergency continuation.');
