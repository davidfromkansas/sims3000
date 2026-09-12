import assert from 'node:assert/strict';
import {CityRenderer} from '../dist/renderer.js';
import {createCity,tick,validateSave} from '../dist/engine.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {moveScenarioCamera} from '../dist/scenario-camera.js';
import {scenarioEventReport} from '../dist/scenario-events.js';
import {serializeCity} from '../dist/save.js';
const c=createCity();for(const t of c.tiles)t.elevation=(t.x+t.y)%8;
for(const rotation of [0,1,2,3])for(const zoom of [.4,1,1.5,2.5])for(const target of [{x:0,y:0},{x:47,y:47},{x:14,y:31}]){
 const r=Object.create(CityRenderer.prototype);Object.assign(r,{rotation,zoom:.8,w:1000,h:600,pan:{x:150,y:-80},getCity:()=>c,hover:{x:1,y:1},drag:{x:1,y:1},goalArea:{}});const before=JSON.stringify(c);moveScenarioCamera(r,{...target,zoom});const p=r.project(target.x,target.y);assert.ok(Math.abs(p.x-500)<1e-9);assert.ok(Math.abs(p.y+r.unit/2-300)<1e-9);assert.equal(r.zoom,zoom);assert.equal(r.rotation,rotation);assert.equal(r.drag,null);assert.equal(r.goalArea,null);assert.equal(JSON.stringify(c),before);
}
for(const t of c.tiles)t.elevation=0;
attachCustomScenario(c,{title:'Tour the city',months:24,objectives:[{metric:'population',target:100000}],events:[{type:'camera',month:1,x:14,y:31,zoom:1.5,repeatCount:2,repeatEvery:2}]});assert.equal(tick(c).scenarioEvent.type,'camera');const saved=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(saved.scenario.definition.events[0],c.scenario.definition.events[0]);assert.match(scenarioEventReport(saved),/at 15, 32 · 150% zoom/);assert.match(scenarioEventReport(saved),/View location/);assert.equal(tick(saved).scenarioEvent,null,'load does not replay camera movement');assert.equal(tick(saved).scenarioEvent.type,'camera');
for(const target of [{x:-1,y:0,zoom:1},{x:0,y:48,zoom:1},{x:0,y:0,zoom:0},{x:0,y:0,zoom:3},{x:0,y:0,zoom:'1.5'}])assert.throws(()=>validateCustomDefinition({title:'Invalid',months:12,objectives:[{metric:'population',target:1}],events:[{type:'camera',month:1,...target}]}));
console.log('PASS: scripted camera delivery, 48 elevation/rotation/zoom combinations, preserved rotation, cleared drag, saved history, no replay and invalid targets.');
