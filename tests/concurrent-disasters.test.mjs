import assert from 'node:assert/strict';
import {createCity,recompute,validateSave,VERSION} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {ignite,dispatchFire,startEarthquake,startTornado,soundSiren,stepFire} from '../dist/emergency.js';
import {startUfo} from '../dist/ufo.js';
import {startWhirlpool} from '../dist/whirlpool.js';
import {startToxicCloud} from '../dist/toxic-cloud.js';
import {startSpaceJunk} from '../dist/space-junk.js';
import {startRiot,dispatchPolice} from '../dist/riots.js';
import {startLocusts,dispatchCropDuster} from '../dist/locusts.js';
import {pendingWarnings} from '../dist/emergency-session.js';
import {emergencyLocations} from '../dist/emergency-navigation.js';
import {showEmergency} from '../dist/emergency-ui.js';
function base(){const c=createCity('Concurrent response',false);for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;if(t.x<6&&t.y<6)t.terrain='water';if(t.x>35&&t.y>35)t.nature=true;}Object.assign(c.tiles[20*48+20],{type:'residential',level:1});recompute(c);return c;}
const c=base();assert.ok(ignite(c,40,40).ok);assert.ok(dispatchFire(c,39,40).ok);assert.ok(startRiot(c,20,20).ok);assert.ok(dispatchPolice(c,20,21).ok);assert.ok(startLocusts(c,38,38).ok);assert.ok(dispatchCropDuster(c,38,39).ok);
const units=structuredClone({fire:c.emergency.units,police:c.emergency.policeUnits,dusters:c.emergency.cropDusters});
for(const [start,x,y]of [[startEarthquake,10,10],[startTornado,0,24],[startWhirlpool,2,2],[startToxicCloud,25,20],[startSpaceJunk,20,25],[startUfo,24,24]])assert.ok(start(c,x,y).ok);
assert.deepEqual({fire:c.emergency.units,police:c.emergency.policeUnits,dusters:c.emergency.cropDusters},units);assert.equal(c.emergency.started,1,'overlaps belong to one response session');assert.equal(emergencyLocations(c).filter(l=>l.tiles===0).length,8);
const before=serializeCity(c);for(const [start,x,y]of [[startEarthquake,10,10],[startTornado,0,24],[startWhirlpool,2,2],[startToxicCloud,25,20],[startSpaceJunk,20,25],[startUfo,24,24],[startRiot,20,20],[startLocusts,38,38]])assert.equal(start(c,x,y).ok,false);assert.equal(serializeCity(c),before,'duplicate types cannot replace a live hazard');
assert.equal(pendingWarnings(c.emergency).length,2);assert.ok(soundSiren(c).ok);assert.equal(pendingWarnings(c.emergency).length,0);assert.equal(soundSiren(c).ok,false);
const legacy=JSON.parse(serializeCity(c));legacy.version=95;assert.throws(()=>validateSave(legacy),'older schema must not reinterpret concurrent hazards');
const loaded=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(loaded.emergency,c.emergency);
let steps=0;while(c.emergency.active&&steps++<150){const month=c.month;const result=stepFire(c),other=stepFire(loaded);assert.deepEqual(result,other);assert.equal(c.month,month);recompute(c);recompute(loaded);assert.deepEqual(loaded.emergency,c.emergency);if(steps%5===0)assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).emergency,c.emergency);}
assert.equal(c.emergency.active,false);assert.equal(c.emergency.contained,1);assert.ok(steps<150);assert.deepEqual(c.emergency.units,[]);assert.equal(c.month,0);
// Warning protection belongs to its hazard, including later arrivals in the same session.
const warning=base();warning.emergency.sirenTrust=80;startTornado(warning,0,24);soundSiren(warning);const protection=warning.emergency.tornado.shelter;assert.equal(protection,.48);startUfo(warning,24,24);assert.equal(warning.emergency.tornado.shelter,protection);assert.equal(warning.emergency.ufo.shelter,0);assert.equal(pendingWarnings(warning.emergency).length,1);soundSiren(warning);assert.equal(warning.emergency.tornado.shelter,protection);assert.equal(warning.emergency.ufo.shelter,.51);
warning.emergency.ufo.warningSteps=0;warning.emergency.ufo.age=23;stepFire(warning);assert.equal(warning.emergency.ufo,null);assert.equal(warning.emergency.shelter,protection,'departure of one hazard preserves the other warning');
const old=JSON.parse(serializeCity(warning));old.version=95;delete old.emergency.tornado.warned;delete old.emergency.tornado.shelter;const migrated=validateSave(old);assert.equal(migrated.version,VERSION);assert.equal(migrated.emergency.tornado.warned,true);assert.equal(migrated.emergency.tornado.shelter,protection);
const malformed=JSON.parse(serializeCity(warning));malformed.emergency.tornado.warned=false;assert.throws(()=>validateSave(malformed),/warning protection/);
// Real emergency panel exposes other types, but never offers to overwrite the active one.
let html='',chosen='',closed=0;const controls=new Map(),adds=[];globalThis.document={querySelector:s=>controls.get(s),querySelectorAll:s=>s==='[data-start-hazard]'?adds:[]};
showEmergency({city:()=>warning,dialog:(_,body)=>{html=body;for(const m of body.matchAll(/id="([^"]+)"/g))controls.set('#'+m[1],{});for(const m of body.matchAll(/data-start-hazard="([^"]+)"/g))adds.push({dataset:{startHazard:m[1]}});},close:()=>closed++,update(){},save(){},notify(){},setTool:t=>chosen=t,setLayer(){},goToFire(){},resume(){},review(){}});
assert.match(html,/Add another disaster/);assert.ok(!adds.some(b=>b.dataset.startHazard==='tornado'));adds.find(b=>b.dataset.startHazard==='ufo').onclick();assert.equal(chosen,'ufo');assert.equal(closed,1);
console.log('PASS: all eight major hazard types plus fires coexist, units survive additions, duplicate protection, all-threat completion, separate warning protection, legacy/current saves, deterministic continuation and panel authoring.');
