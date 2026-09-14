import assert from 'node:assert/strict';
import {createCity,build,recompute,validateSave} from '../dist/engine.js';
import {fireUnitCapacity,ignite,dispatchFire,stepFire} from '../dist/emergency.js';
import {serializeCity} from '../dist/save.js';
const c=createCity();assert.ok(build(c,'fire',[{x:20,y:21}]).ok);const station=c.tiles[21*48+20];assert.equal(fireUnitCapacity(c),2);
for(const [key,value] of [['fire',10],['rubble',true],['radiation',true]]){station[key]=value;recompute(c);assert.equal(c.stats.fireUnits,1,key);station[key]=key==='fire'?0:false;recompute(c);assert.equal(c.stats.fireUnits,2);}
assert.ok(ignite(c,20,21).ok);recompute(c);assert.ok(dispatchFire(c,19,21).ok);assert.ok(dispatchFire(c,21,21).ok);assert.deepEqual(c.emergency.units,[{x:21,y:21}],'volunteer relocates instead of dispatching from burning station');const saved=validateSave(JSON.parse(serializeCity(c)));assert.equal(saved.stats.fireUnits,1);assert.equal(fireUnitCapacity(saved),1);
station.fire=0;recompute(c);assert.equal(c.stats.fireUnits,2);assert.ok(ignite(c,20,21).ok);c.emergency.units=[{x:19,y:21},{x:21,y:21}];stepFire(c);assert.ok(c.emergency.units.length<=1,'response step recalls excess crews when station is damaged');
console.log('PASS: intact station dispatch capacity, damage shutdown and recovery, volunteer relocation, saved readiness, and response-step crew recall.');
