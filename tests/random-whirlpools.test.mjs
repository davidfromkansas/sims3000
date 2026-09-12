import assert from 'node:assert/strict';
import {createCity,validateSave,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {setRandomWhirlpools,maybeWhirlpool} from '../dist/whirlpool.js';
const c=createCity();assert.equal(c.emergency.randomWhirlpools,false);for(let m=1;m<=1000;m++){c.month=m;assert.equal(maybeWhirlpool(c),false);}
assert.equal(setRandomWhirlpools(c,'yes').ok,false);assert.ok(setRandomWhirlpools(c,true).ok);let outbreak=0;for(let m=1;m<=10000;m++){c.month=m;if(maybeWhirlpool(c)){outbreak=m;break;}}assert.ok(outbreak);assert.equal(setRandomWhirlpools(c,false).ok,false);assert.equal(maybeWhirlpool(c),false);const s=c.emergency.whirlpool;assert.equal(c.tiles[s.y*48+s.x].terrain,'water');
const a=createCity();a.month=outbreak-1;setRandomWhirlpools(a,true);const b=validateSave(JSON.parse(serializeCity(a)));tick(a);tick(b);assert.ok(a.emergency.whirlpool);assert.deepEqual(a.emergency,b.emergency);assert.deepEqual(validateSave(JSON.parse(serializeCity(a))).emergency,a.emergency);
const dry=createCity();dry.tiles.forEach(t=>t.terrain='land');setRandomWhirlpools(dry,true);dry.month=outbreak;assert.equal(maybeWhirlpool(dry),false);const off=createCity();setRandomWhirlpools(off,true);setRandomWhirlpools(off,false);off.month=outbreak;assert.equal(maybeWhirlpool(off),false);
const old=JSON.parse(serializeCity(createCity()));old.version=50;delete old.emergency.randomWhirlpools;assert.equal(validateSave(old).emergency.randomWhirlpools,false);old.version=51;assert.throws(()=>validateSave(old));
console.log('PASS: optional natural whirlpools, water targeting, dry-city immunity, monthly integration, saved determinism, no overlap, active-setting protection, disabling and migration.');
