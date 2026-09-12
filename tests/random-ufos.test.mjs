import assert from 'node:assert/strict';
import {createCity,validateSave,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {setRandomUfos,maybeUfo} from '../dist/ufo.js';
import {soundSiren} from '../dist/emergency.js';
const c=createCity();assert.equal(c.emergency.randomUfos,false);for(let m=1;m<=1000;m++){c.month=m;assert.equal(maybeUfo(c),false);}
assert.equal(setRandomUfos(c,1).ok,false);assert.ok(setRandomUfos(c,true).ok);let outbreak=0;for(let m=1;m<=10000;m++){c.month=m;if(maybeUfo(c)){outbreak=m;break;}}assert.ok(outbreak);assert.equal(c.emergency.ufo.warningSteps,8);assert.equal(setRandomUfos(c,false).ok,false);assert.equal(maybeUfo(c),false);assert.ok(soundSiren(c).ok);
const a=createCity();a.month=outbreak-1;setRandomUfos(a,true);const b=validateSave(JSON.parse(serializeCity(a)));tick(a);tick(b);assert.ok(a.emergency.ufo);assert.equal(a.emergency.ufo.warningSteps,8);assert.deepEqual(a.emergency,b.emergency);assert.deepEqual(validateSave(JSON.parse(serializeCity(a))).emergency,a.emergency);
const empty=createCity('Empty',false);setRandomUfos(empty,true);empty.month=outbreak;assert.equal(maybeUfo(empty),false);const off=createCity();setRandomUfos(off,true);setRandomUfos(off,false);off.month=outbreak;assert.equal(maybeUfo(off),false);
const old=JSON.parse(serializeCity(createCity()));old.version=52;delete old.emergency.randomUfos;assert.equal(validateSave(old).emergency.randomUfos,false);old.version=53;assert.throws(()=>validateSave(old));
console.log('PASS: optional random aliens, warning and siren readiness, occupied target eligibility, monthly integration, saved determinism, no overlap, active-setting protection, disabling and migration.');
