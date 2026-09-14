import assert from 'node:assert/strict';
import {createCity,build,recompute,validateSave} from '../dist/engine.js';
import {SERVICES,serviceRadius} from '../dist/civic.js';
import {civicFacilityDetails,civicFacilityReport} from '../dist/civic-service-report.js';
import {ignite} from '../dist/emergency.js';
import {serializeCity} from '../dist/save.js';
for(const type of Object.keys(SERVICES)){
 const c=createCity();assert.ok(build(c,type,[{x:20,y:21}]).ok);const t=c.tiles[21*48+20];assert.equal(t.serviceActive,true,type);
 for(const [damage,value,reason] of [['fire',10,'Building is on fire'],['rubble',true,'Building is destroyed'],['radiation',12,'Site is contaminated by radiation']]){
  t[damage]=value;recompute(c);assert.equal(t.serviceActive,false,`${type} ${damage}`);assert.equal(c.stats.activeServices[type],0);assert.equal(c.stats.serviceCapacities[type],0);assert.equal(serviceRadius(c,t),0);assert.ok(civicFacilityDetails(c,t).reasons.includes(reason));assert.match(civicFacilityReport(c,t),new RegExp(reason));
  t[damage]=damage==='rubble'?false:0;recompute(c);assert.equal(t.serviceActive,true,`${type} recovery`);
 }
}
const c=createCity();assert.ok(build(c,'hospital',[{x:20,y:21}]).ok);assert.equal(c.stats.healthCoverage,100);const hospital=c.tiles[21*48+20];assert.ok(ignite(c,20,21).ok);recompute(c);assert.equal(c.stats.healthCoverage,0);const saved=validateSave(JSON.parse(serializeCity(c)));assert.equal(saved.stats.healthCoverage,0);assert.equal(saved.tiles[21*48+20].serviceActive,false);
console.log('PASS: every civic service shuts down for fire/rubble/radiation, reports the cause, recovers after clearance, and preserves burning-hospital shutdown through save/load.');
