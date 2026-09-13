import assert from 'node:assert/strict';
import {createCity,recompute} from '../dist/engine.js';
import {CityRenderer} from '../dist/renderer.js';
import {visibleTileBounds} from '../dist/city-grid.js';
import {visibleSceneGeometry} from '../dist/scene-geometry.js';
for(const size of [48,96,128,256]){const city=createCity('Geometry',false,size);for(const t of city.tiles)t.elevation=(t.x+t.y)%9;const r=Object.create(CityRenderer.prototype);Object.assign(r,{getCity:()=>city,w:960,h:540,pan:{x:15,y:-70}});
 for(const rotation of [0,1,2,3])for(const zoom of [.4,.65,1.2,2]){r.rotation=rotation;r.zoom=zoom;const bounds=visibleTileBounds(r),expected=[];for(let y=bounds.y0;y<=bounds.y1;y++)for(let x=bounds.x0;x<=bounds.x1;x++){const t=city.tiles[y*size+x];expected.push({t,p:r.project(x,y),r:r.transform(x,y)});}expected.sort((a,b)=>(a.r[0]+a.r[1])-(b.r[0]+b.r[1])||a.r[0]-b.r[0]);const actual=visibleSceneGeometry(r,bounds);assert.deepEqual(actual,expected);assert.equal(visibleSceneGeometry(r,bounds),actual);}
}
const city=createCity(),r=Object.create(CityRenderer.prototype);Object.assign(r,{getCity:()=>city,w:960,h:540,pan:{x:0,y:0},rotation:0,zoom:1});let calls=0;const project=r.project;r.project=function(...args){calls++;return project.apply(this,args);};let b=visibleTileBounds(r),previous=visibleSceneGeometry(r,b),count=calls;for(let i=0;i<20;i++){r.vehicleTime=i;r.layer='water';assert.equal(visibleSceneGeometry(r,b),previous);}assert.equal(calls,count,'animation and color layers do not project tiles again');
for(const change of [()=>r.pan.x++,()=>r.pan.y++,()=>r.zoom+=.1,()=>r.rotation++,()=>r.w++,()=>r.h++]){change();b=visibleTileBounds(r);const next=visibleSceneGeometry(r,b);assert.notEqual(next,previous);previous=next;}
const t=city.tiles[24*48+24];const y=previous.find(v=>v.t===t).p.y;t.elevation=4;recompute(city);const changed=visibleSceneGeometry(r,b);assert.notEqual(changed,previous);assert.equal(changed.find(v=>v.t===t).p.y,y-4*r.unit*.5,'recomputed terrain refreshes screen elevation');
const other=createCity('Other');r.getCity=()=>other;const replaced=visibleSceneGeometry(r,b);assert.notEqual(replaced,changed);assert.ok(replaced.every(v=>other.tiles.includes(v.t)));assert.equal(visibleSceneGeometry(r,{x0:2,y0:2,x1:1,y1:1}).length,0);
console.log('PASS: exact scene ordering and elevation across 64 map/camera cases, animation reuse, camera/terrain/city invalidation and empty views.');
