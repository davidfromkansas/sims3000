import assert from 'node:assert/strict';
import {createCity,validateSave,recompute} from '../dist/engine.js';
import {ignite} from '../dist/emergency.js';
import {serializeCity} from '../dist/save.js';
import {emergencyLocations,createEmergencyNavigator,focusEmergencyLocation} from '../dist/emergency-navigation.js';
import {CityRenderer} from '../dist/renderer.js';
const c=createCity('Scattered fires',false,96),at=(x,y)=>c.tiles[y*96+x];
for(const [x,y]of [[5,5],[6,6],[80,80],[81,80],[95,0]]){Object.assign(at(x,y),{terrain:'land',type:'residential',level:1});assert.ok(ignite(c,x,y).ok);}
at(80,80).fireAge=7;at(5,5).fireAge=3;
let locations=emergencyLocations(c);assert.equal(locations.length,3);assert.deepEqual(locations.map(t=>[t.x,t.y,t.tiles]),[[80,80,2],[5,5,2],[95,0,1]],'diagonal fires form one area and older burning areas appear first');
const navigate=createEmergencyNavigator();assert.equal(navigate(c).x,80);assert.equal(navigate(c).x,5);assert.equal(navigate(c).x,95);assert.equal(navigate(c).x,80);
assert.equal(navigate(c,'fire:485').x,5);assert.equal(navigate(c,'fire:999999'),null);assert.equal(navigate(c).x,95);
at(95,0).fire=0;assert.equal(navigate(c).x,80,'resolved last location wraps to remaining areas');
// The anchor can change without returning the player to the same area.
at(81,80).fireAge=8;assert.equal(navigate(c).x,5);
c.emergency.started++;assert.equal(navigate(c).x,81,'a new emergency starts navigation from its first location');
c.emergency.tornado={x:40,y:50,age:4,warningSteps:0};assert.equal(navigate(c,'tornado').label,'Tornado');c.emergency.tornado.x=41;assert.equal(navigate(c,'tornado').x,41,'moving hazards are read at selection time');delete c.emergency.tornado;
// Navigation never alters saved gameplay state and resumes against loaded coordinates.
c.emergency.tornado=null;recompute(c);const before=serializeCity(c),loaded=validateSave(JSON.parse(before));assert.equal(navigate(loaded).x,81);
for(const rotation of [0,1,2,3])for(const zoom of [.4,1,2.5]){
 const r=Object.create(CityRenderer.prototype);Object.assign(r,{rotation,zoom,w:900,h:600,pan:{x:20,y:-100},getCity:()=>c,tool:'dispatchFire',drag:{x:1,y:1}});
 const target=emergencyLocations(c)[0];focusEmergencyLocation(r,target);const p=r.project(target.x,target.y);assert.ok(Math.abs(p.x-450)<1e-8);assert.ok(Math.abs(p.y+r.unit/2-300)<1e-8);assert.equal(r.tool,'dispatchFire');assert.equal(r.drag,null);
}
assert.equal(serializeCity(c),before);for(const t of c.tiles)t.fire=0;c.emergency.active=false;assert.deepEqual(emergencyLocations(c),[]);assert.equal(navigate(c),null);
console.log('PASS: separate emergency areas, diagonal grouping and fire-age order, cycling/direct choice, resolved/moving hazards, city and incident resets, saved fires and centered views across rotations/zoom without gameplay mutation.');
