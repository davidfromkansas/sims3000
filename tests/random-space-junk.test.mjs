import assert from 'node:assert/strict';
import {createCity,validateSave,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {setRandomSpaceJunk,maybeSpaceJunk} from '../dist/space-junk.js';
const c=createCity();assert.equal(c.emergency.randomSpaceJunk,false);for(let month=1;month<=1000;month++){c.month=month;assert.equal(maybeSpaceJunk(c),false);}
assert.equal(setRandomSpaceJunk(c,'yes').ok,false);assert.ok(setRandomSpaceJunk(c,true).ok);let outbreak=0;for(let month=1;month<=10000;month++){c.month=month;if(maybeSpaceJunk(c)){outbreak=month;break;}}assert.ok(outbreak);assert.equal(setRandomSpaceJunk(c,false).ok,false,'active disaster cannot be disabled');assert.equal(maybeSpaceJunk(c),false,'no overlapping falls');
const a=createCity();a.month=outbreak-1;setRandomSpaceJunk(a,true);const b=validateSave(JSON.parse(serializeCity(a)));tick(a);tick(b);assert.ok(a.emergency.spaceJunk,'monthly simulation starts a fall');assert.deepEqual(a.emergency,b.emergency,'same saved seed and month produce same target');
const active=validateSave(JSON.parse(serializeCity(a)));assert.deepEqual(active.emergency,a.emergency);
const old=JSON.parse(serializeCity(createCity()));old.version=42;delete old.emergency.randomSpaceJunk;assert.equal(validateSave(old).emergency.randomSpaceJunk,false);old.version=43;assert.throws(()=>validateSave(old));
const off=createCity();setRandomSpaceJunk(off,true);setRandomSpaceJunk(off,false);off.month=outbreak;assert.equal(maybeSpaceJunk(off),false);
console.log('PASS: opt-in random debris, monthly integration, deterministic saved targets, non-overlap, active-event protection, disabling and legacy migration.');
