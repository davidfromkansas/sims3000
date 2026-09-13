import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {serviceRadius} from '../dist/civic.js';
import {stationAreas,drawNavigationPrecincts} from '../dist/service-areas.js';
import {CityRenderer} from '../dist/renderer.js';
const c=createCity('Precincts',false);c.funds=100000;for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;}
const place=(type,x,y,xx=x,yy=y)=>assert.ok(build(c,type,selection(type,{x,y},{x:xx,y:yy})).ok,type),at=(x,y)=>c.tiles[y*48+x];
place('coal',8,14);place('road',10,20,35,20);place('powerline',10,22,35,22);place('police',20,19);place('fire',30,19);recompute(c);
assert.equal(serviceRadius(c,at(20,19)),9);assert.equal(serviceRadius(c,at(30,19)),9);
assert.deepEqual(stationAreas(c,'crime'),stationAreas(c,'police'));assert.deepEqual(stationAreas(c,'flammability'),stationAreas(c,'fire'));
assert.deepEqual(stationAreas(c,'health'),[]);assert.deepEqual(stationAreas(c,'city'),[]);
for(const funding of [25,100,150]){
 c.civic.funding.fire=funding;recompute(c);const radius=serviceRadius(c,at(30,19));
 assert.equal(radius,9*Math.sqrt(funding/100));
 for(const t of c.tiles){const distance=Math.hypot(t.x-30,t.y-19);assert.equal(t.fireCoverage>0,distance<radius,'ring must match the simulated service limit');}
}
c.civic.funding.fire=100;recompute(c);const original=serializeCity(c);
for(const rotation of [0,1,2,3])for(const scale of [.75,2,4]){
 const renderer=Object.create(CityRenderer.prototype);Object.assign(renderer,{rotation,getCity:()=>c});
 const arcs=[],colors=[];const ctx={save(){},restore(){},beginPath(){},arc(...args){arcs.push(args);},stroke(){},fill(){colors.push(this.fillStyle);}};
 drawNavigationPrecincts(ctx,c,'flammability',(x,y)=>renderer.transform(x,y),scale);
 const [x,y]=renderer.transform(30,19);assert.deepEqual(arcs[0].slice(0,3),[(x+.5)*scale,(y+.5)*scale,9*scale]);assert.equal(arcs.length,2);assert.deepEqual(colors,['#f6ffe1']);
}
assert.equal(serializeCity(c),original);
c.civic.underfunded.fire=6;recompute(c);assert.equal(stationAreas(c,'fire')[0].radius,0);assert.equal(stationAreas(c,'fire')[0].active,false);
const arcs=[],colors=[],ctx={save(){},restore(){},beginPath(){},arc(...a){arcs.push(a);},stroke(){},fill(){colors.push(this.fillStyle);}};
drawNavigationPrecincts(ctx,c,'fire',(x,y)=>[x,y],4);assert.equal(arcs.length,1,'inactive station draws only its marker');assert.deepEqual(colors,['#f4a477']);
c.civic.underfunded.fire=0;c.finance.roadCondition=20;recompute(c);assert.equal(serviceRadius(c,at(30,19)),0);
c.finance.roadCondition=100;c.civic.funding.fire=0;recompute(c);assert.equal(serviceRadius(c,at(30,19)),0);
c.civic.funding.fire=100;recompute(c);assert.deepEqual(stationAreas(validateSave(JSON.parse(serializeCity(c))),'fire'),stationAreas(c,'fire'));
console.log('PASS: funded precinct radii match actual service coverage, rotated/scaled navigation rings, inactive station markers, strike/road/funding changes, unchanged city and save reconstruction.');
