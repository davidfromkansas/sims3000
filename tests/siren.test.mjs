import assert from 'node:assert/strict';
import {createCity,idx,recompute,validateSave} from '../dist/engine.js';
import {startTornado,stepFire,soundSiren} from '../dist/emergency.js';
import {serializeCity} from '../dist/save.js';
function base(){const c=createCity('Warning comparison',false);for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,treeLevel:0,type:'residential',level:1});recompute(c);return c;}
const warned=base(),unwarned=base(),distrusted=base();for(let i=0;i<5;i++)assert.ok(soundSiren(distrusted).ok);assert.equal(distrusted.emergency.sirenTrust,0);assert.equal(distrusted.emergency.falseAlarms,5);
for(const c of [warned,unwarned,distrusted]){assert.ok(startTornado(c,10,24).ok);stepFire(c);assert.equal(c.emergency.destroyed,0);assert.equal(c.emergency.tornado.warningSteps,7);}
assert.ok(soundSiren(warned).ok);assert.equal(warned.emergency.shelter,.6);assert.equal(soundSiren(warned).ok,false);assert.ok(soundSiren(distrusted).ok);assert.equal(distrusted.emergency.shelter,0);assert.equal(distrusted.emergency.sirenTrust,5);
recompute(warned);const loaded=validateSave(JSON.parse(serializeCity(warned)));assert.equal(serializeCity(loaded),serializeCity(warned));
for(let i=0;i<31;i++)for(const c of [warned,unwarned,distrusted,loaded]){stepFire(c);recompute(c);}
assert.equal(serializeCity(loaded),serializeCity(warned));assert.ok(warned.emergency.destroyed<unwarned.emergency.destroyed,'shelter reduces damage for identical storms');assert.equal(distrusted.emergency.destroyed,unwarned.emergency.destroyed,'zero trust provides no protection');assert.equal(warned.emergency.shelter,0);
const late=base();startTornado(late,10,24);for(let i=0;i<8;i++)stepFire(late);assert.equal(soundSiren(late).ok,false);assert.equal(late.emergency.falseAlarms,0,'late attempt is rejected rather than treated as false alarm');
const old=JSON.parse(serializeCity(late));old.version=25;delete old.emergency.tornado.warningSteps;for(const k of ['sirenTrust','sirenIncident','shelter','falseAlarms'])delete old.emergency[k];const migrated=validateSave(old);assert.equal(migrated.emergency.tornado.warningSteps,0);assert.equal(migrated.emergency.sirenTrust,100);
const malformed=JSON.parse(serializeCity(warned));malformed.emergency.shelter=.7;assert.throws(()=>validateSave(malformed),/siren/);
const badWarning=JSON.parse(serializeCity(late));badWarning.emergency.tornado.warningSteps=9;assert.throws(()=>validateSave(badWarning),/warning/);
console.log('PASS: approaching-storm grace, timely siren damage reduction, false-alarm trust, duplicate/late rejection, warning saves, migration and malformed-state rejection.');
