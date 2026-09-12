import assert from 'node:assert/strict';
import {CityRenderer} from '../dist/renderer.js';
import {createCity} from '../dist/engine.js';
import {focusScenarioArea} from '../dist/scenario-area-view.js';
import {attachCustomScenario,customCurrentGoals} from '../dist/custom-scenarios.js';
const c=createCity();for(const t of c.tiles)t.elevation=(t.x+t.y)%8;
for(const rotation of [0,1,2,3])for(const zoom of [.65,1,2])for(const area of [{x:0,y:0,radius:0},{x:47,y:47,radius:4},{x:14,y:31,radius:7}]){
 const r=Object.create(CityRenderer.prototype);Object.assign(r,{rotation,zoom,w:1000,h:600,pan:{x:150,y:-80},getCity:()=>c,tool:'residential',hover:{x:1,y:1},drag:{x:1,y:1}});const before=JSON.stringify(c);focusScenarioArea(r,area);const p=r.project(area.x,area.y);assert.equal(p.x,500);assert.ok(Math.abs(p.y+r.unit/2-300)<1e-9);assert.deepEqual(r.goalArea.area,area);assert.equal(r.goalArea.city,c);assert.equal(r.hover,null);assert.equal(r.drag,null);assert.equal(r.tool,'residential');assert.equal(JSON.stringify(c),before);
}
attachCustomScenario(c,{title:'A neighborhood',months:24,objectives:[{metric:'buildingsResidential',target:10,area:{x:14,y:31,radius:7}}]});assert.deepEqual(customCurrentGoals(c)[0].area,{x:14,y:31,radius:7});
assert.throws(()=>focusScenarioArea({},null));assert.throws(()=>focusScenarioArea({},{x:99,y:0,radius:1}));
console.log('PASS: exact goal-area centering across rotations, zooms and elevation, immutable city state, cleared drag and validated goal area metadata.');
