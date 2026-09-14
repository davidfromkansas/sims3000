import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave,VERSION} from '../dist/engine.js';
import {addConnection,connectionCandidates,connected,signDeal} from '../dist/region.js';
import {serializeCity} from '../dist/save.js';
const c=createCity('Underground neighbors',false);for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});
assert.ok(build(c,'subway',selection('subway',{x:40,y:20},{x:47,y:20})).ok);const con=connectionCandidates(c).find(p=>p.kind==='subway');assert.deepEqual(con,{tile:20*48+47,kind:'subway',side:'east'});const funds=c.funds;assert.ok(addConnection(c,con).ok);recompute(c);assert.equal(c.funds,funds-100);assert.equal(c.stats.economicCaps.commercial.limit,50000);assert.equal(c.stats.economicCaps.industrial.limit,70000);assert.equal(c.stats.neighborConnections,1);assert.equal(c.stats.tradeConnections,0);assert.equal(addConnection(c,con).ok,false);
for(const kind of ['garbage','power','water'])assert.equal(signDeal(c,0,kind,'import',25).ok,false);
const saved=JSON.parse(serializeCity(c));assert.equal(saved.version,VERSION);const loaded=validateSave(saved);assert.deepEqual(loaded.region.connections,c.region.connections);assert.deepEqual(loaded.stats.economicCaps,c.stats.economicCaps);saved.version=127;assert.throws(()=>validateSave(saved),/version 128/);
assert.ok(build(c,'removeSubway',[{x:47,y:20}]).ok);assert.equal(connected(c,con),false);assert.equal(c.stats.economicCaps.commercial.limit,25000);assert.ok(build(c,'subway',[{x:47,y:20}]).ok);assert.equal(connected(c,con),true);assert.equal(c.stats.economicCaps.commercial.limit,50000,'rebuilding restores paid connection');
for(const [x,y,side]of [[12,0,'north'],[0,12,'west'],[12,47,'south']]){assert.ok(build(c,'subway',[{x,y}]).ok);assert.ok(connectionCandidates(c).some(p=>p.kind==='subway'&&p.side===side&&p.tile===y*48+x));}
const legacy=JSON.parse(serializeCity(createCity()));legacy.version=127;assert.equal(validateSave(legacy).version,VERSION);
console.log('PASS: paid subway border connection, all map sides, commercial-only capacity, duplicate prevention, unsupported contract rejection, edge removal/rebuilding, saved continuation and legacy version gate.');
