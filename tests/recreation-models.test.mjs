import assert from 'node:assert/strict';
import {MODELED_RECREATION,recreationGeometry,recreationFaces,drawCityRecreation,fountainStreams} from '../dist/recreation-models.js';
import {createCity,build,validateSave,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {CityRenderer} from '../dist/renderer.js';
for(const type of MODELED_RECREATION){
 const geometry=recreationGeometry(type);assert.ok(geometry.length>100);assert.deepEqual(recreationGeometry(type),geometry);
 const views=[];for(let rotation=0;rotation<4;rotation++){const faces=recreationFaces(type,rotation);assert.ok(faces.length>50);for(const face of faces){assert.match(face.color,/^#[\da-f]{6}$/i);for(const [x,y] of face.points)assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=512&&y>=0&&y<=512);}views.push(JSON.stringify(faces));}
 assert.equal(new Set(views).size,4,'each camera orientation is rendered from its own geometry');
}
assert.throws(()=>recreationGeometry('unknown'));assert.deepEqual(fountainStreams(10,false),[]);
assert.deepEqual(fountainStreams(0),fountainStreams(0));assert.notDeepEqual(fountainStreams(0)[0].droplet,fountainStreams(.5)[0].droplet);
for(const stream of fountainStreams(20))for(const [x,y,z] of [...stream.points,stream.droplet])assert.ok(Math.hypot(x,y)<=.271&&z>=.15&&z<.8);
let created=0,arcs=0;const context=()=>new Proxy({},{get:(_,key)=>key==='arc'?()=>arcs++:()=>{},set:()=>true});
globalThis.document={createElement:()=>{created++;return{getContext:context};},hidden:false,querySelector:()=>null};
const ctx=context(),city=createCity('Rotating parks',false);city.funds=100000;for(const t of city.tiles){t.terrain='land';t.nature=false;t.elevation=0;}
for(const [i,type] of [...MODELED_RECREATION].entries()){const x=5+(i%4)*10,y=10+Math.floor(i/4)*15;if(type==='marina')city.tiles[y*48+x-1].terrain='water';assert.ok(build(city,type,[{x,y}]).ok,type);}
const saved=serializeCity(city);
for(const type of MODELED_RECREATION)for(let rotation=0;rotation<4;rotation++)for(const time of [0,1,2])drawCityRecreation(ctx,type,rotation,200,200,180,.7,time,true);
assert.equal(created,MODELED_RECREATION.size*4,'static model textures are cached once per type and orientation');assert.equal(serializeCity(city),saved);
const beforeArcs=arcs;drawCityRecreation(ctx,'fountain',0,200,200,100,1,2,false);assert.equal(arcs,beforeArcs,'closed fountains have no animated jets');
// Exercise the real scene clock: ornamental water shares vehicle-time pause policy.
globalThis.requestAnimationFrame=()=>{};
const renderer={running:true,getCity:()=>city,reducedMotion:{matches:false},vehicleTime:0,previousFrame:null,time:0,dirty:false,layer:'city',draw(){},frame(){}};
const frame=time=>CityRenderer.prototype.frame.call(renderer,time);
frame(0);frame(100);assert.equal(renderer.vehicleTime,.1);renderer.running=false;frame(200);assert.equal(renderer.vehicleTime,.1);
renderer.running=true;renderer.reducedMotion.matches=true;frame(300);assert.equal(renderer.vehicleTime,.1);
renderer.reducedMotion.matches=false;document.hidden=true;frame(400);assert.equal(renderer.vehicleTime,.1);
document.hidden=false;document.querySelector=()=>({open:true});frame(500);assert.equal(renderer.vehicleTime,.1);
document.querySelector=()=>null;frame(600);assert.equal(renderer.vehicleTime,.2);
const loaded=validateSave(JSON.parse(saved));tick(city);tick(loaded);assert.deepEqual(city.stats,loaded.stats,'scenery has no simulation or save effect');
console.log('PASS: deterministic four-view recreation geometry, in-frame bounds, cached textures, fountain operating/paused/reduced-motion clock behavior, unchanged city state and saved simulation continuation.');
