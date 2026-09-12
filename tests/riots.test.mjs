import assert from 'node:assert/strict';
import {createCity,idx,recompute,build,validateSave} from '../dist/engine.js';
import {startRiot,dispatchPolice} from '../dist/riots.js';
import {stepFire,ignite} from '../dist/emergency.js';
import {serializeCity} from '../dist/save.js';
function fixture(){const c=createCity();return c;}
const c=fixture();assert.ok(startRiot(c,20,20).ok);assert.equal(startRiot(c,20,20).ok,false);assert.ok(dispatchPolice(c,20,20).ok);assert.equal(c.emergency.policeUnits.length,1);dispatchPolice(c,21,20);assert.equal(c.emergency.policeUnits.length,1);assert.equal(c.emergency.policeUnits[0].x,21);stepFire(c);assert.ok(c.emergency.riot.anger<98);assert.equal(c.month,0);
const saved=validateSave(JSON.parse(serializeCity(c)));for(let i=0;i<100&&(c.emergency.active||saved.emergency.active);i++){stepFire(c);stepFire(saved);}assert.deepEqual(saved.emergency,c.emergency);assert.equal(c.emergency.riot,null);
const bare=fixture(),guarded=fixture();startRiot(bare,20,20);startRiot(guarded,20,20);dispatchPolice(guarded,20,20);for(let i=0;i<5;i++){stepFire(bare);stepFire(guarded);}assert.ok((guarded.emergency.riot?.anger||0)<bare.emergency.riot.anger);assert.ok(bare.tiles.some(t=>t.fire>0),'riots ignite nearby development');bare.emergency.riot.anger=1;stepFire(bare);assert.equal(bare.emergency.riot,null);assert.equal(bare.emergency.active,true,'fires remain after dispersal');
const more=fixture();assert.ok(build(more,'police',[{x:20,y:21}]).ok);startRiot(more,20,20);dispatchPolice(more,20,20);dispatchPolice(more,21,20);assert.equal(more.emergency.policeUnits.length,2);dispatchPolice(more,22,20);assert.equal(more.emergency.policeUnits.length,2);
const no=fixture();assert.equal(startRiot(no,0,0).ok,false);assert.equal(dispatchPolice(no,20,20).ok,false);const old=JSON.parse(serializeCity(no));old.version=32;delete old.emergency.riot;delete old.emergency.policeUnits;assert.equal(validateSave(old).emergency.riot,null);const bad=JSON.parse(serializeCity(no));bad.emergency.riot={x:20,y:20,age:0,anger:100};assert.throws(()=>validateSave(bad),/emergency/);
console.log('PASS: riot ignition, police response and station limits, continued fire emergencies, calendar hold, deterministic saves and legacy migration.');
