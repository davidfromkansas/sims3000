import assert from 'node:assert/strict';
import {createCity,recompute,validateSave} from '../dist/engine.js';
import {ignite,startEarthquake,startTornado,stepFire} from '../dist/emergency.js';
import {startUfo} from '../dist/ufo.js';
import {serializeCity} from '../dist/save.js';
import {emergencyLocations,createEmergencyNavigator,fireLocationAt} from '../dist/emergency-navigation.js';
const c=createCity('Response chronology',false);
for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:true});
assert.ok(ignite(c,20,20).ok);assert.ok(startEarthquake(c,6,6).ok);
assert.ok(ignite(c,30,30).ok);assert.ok(startUfo(c,40,40).ok);assert.ok(startTornado(c,45,45).ok);
const ids=c=>emergencyLocations(c).map(t=>t.id),expected=['fire:980','earthquake','fire:1470','ufo','tornado'];
assert.deepEqual(ids(c),expected,'actual start order overrides disaster type priority');
assert.equal(fireLocationAt(c,30,30),'fire:1470');assert.equal(fireLocationAt(c,2,2),undefined);
const nav=createEmergencyNavigator();assert.deepEqual(Array.from({length:6},()=>nav(c).id),[...expected,expected[0]]);
nav(c,'earthquake');c.emergency.earthquake=null;c.tiles[980].fire=0;
assert.equal(nav(c).id,'fire:1470','removing both current and earlier threats must not skip the next incident');
assert.ok(startEarthquake(c,7,7).ok);assert.equal(ids(c).at(-1),'earthquake','a repeat type gets its new start position');
recompute(c);const raw=JSON.parse(serializeCity(c)),loaded=validateSave(raw);assert.deepEqual(ids(loaded),ids(c));
const repeatNav=createEmergencyNavigator();repeatNav(loaded,'ufo');loaded.emergency.ufo=null;startUfo(loaded,39,39);assert.equal(repeatNav(loaded).id,'tornado','restarted hazard must not impersonate the resolved navigation target');
const before=serializeCity(loaded);const loadedNav=createEmergencyNavigator();for(let i=0;i<12;i++)loadedNav(loaded);assert.equal(serializeCity(loaded),before);
for(const change of [v=>v.navigationOrder.next=0,v=>v.navigationOrder.fires['-1']=1,v=>v.navigationOrder.hazards.ufo=1.5,v=>v.navigationOrder.hazards.fake=1,v=>v.navigationOrder.fires[1470]=v.navigationOrder.next]){
 const bad=structuredClone(raw);change(bad.emergency);assert.throws(()=>validateSave(bad),/order/);
}
const old=structuredClone(raw);old.version=96;delete old.emergency.navigationOrder;
const migrated=validateSave(old);assert.deepEqual(ids(migrated),['ufo','tornado','earthquake','fire:1470'],'old files preserve their deterministic pre-chronology ordering');
assert.deepEqual(ids(validateSave(JSON.parse(serializeCity(migrated)))),ids(migrated));
// A real spread retains the original fire's position after its ignition tile is extinguished.
const forest=createCity('Moving fire front',false);forest.seed=1;
for(const t of forest.tiles)Object.assign(t,{terrain:'land',nature:true,fireCoverage:0});
ignite(forest,20,20);for(let i=0;i<5;i++)stepFire(forest);
assert.ok(forest.tiles[979].fire>0);assert.equal(fireLocationAt(forest,19,20),'fire:980','newly burning tiles focus their shared area');assert.ok(startUfo(forest,40,40).ok);
forest.tiles[980].fire=0;
assert.deepEqual(ids(forest),['fire:979','ufo']);
assert.equal(forest.emergency.navigationOrder.fires[979],forest.emergency.navigationOrder.fires[980]);
const resumed=validateSave(JSON.parse(serializeCity(forest)));assert.deepEqual(ids(resumed),ids(forest));
for(let i=0;i<7;i++){stepFire(forest);stepFire(resumed);assert.deepEqual(ids(resumed),ids(forest));}
// Ending the episode resets the bounded per-tile history for the next response.
for(const t of forest.tiles)t.fire=0;forest.emergency.ufo=null;stepFire(forest);
assert.equal(forest.emergency.active,false);ignite(forest,10,10);
assert.deepEqual(forest.emergency.navigationOrder,{next:2,hazards:{},fires:{490:1}});
console.log('PASS: chronological mixed-disaster navigation, resolved/repeated threats, real fire-spread lineage, saved continuation, legacy migration, invalid metadata rejection and fresh-session reset.');
