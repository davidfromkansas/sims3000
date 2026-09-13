import assert from 'node:assert/strict';
import {createCity,build,recompute} from '../dist/engine.js';
import {CityRenderer} from '../dist/renderer.js';
import {serializeCity} from '../dist/save.js';
import {waterViewColor,WATER_VIEW_COLORS as C} from '../dist/water-view.js';
const city=createCity('Underground',false);city.funds=100000;for(const t of city.tiles){t.terrain='land';t.elevation=0;t.nature=false;}
for(const [type,x,y]of [['residential',20,20],['commercial',21,20],['industrial',22,20],['road',20,21],['waterTower',20,23],['coal',25,23]])assert.ok(build(city,type,[{x,y}]).ok);
const at=(x,y)=>city.tiles[y*city.size+x];at(21,20).level=1;recompute(city);
assert.equal(waterViewColor(at(20,20)),C.zoned);assert.equal(waterViewColor(at(21,20)),C.developed);assert.equal(waterViewColor(at(20,21)),C.road);assert.equal(waterViewColor(at(19,20)),C.open);
assert.ok(build(city,'pipe',[{x:20,y:23},{x:20,y:22}]).ok);assert.equal(waterViewColor(at(20,20)),C.supplied,'connected powered tower supplies zones');
assert.ok(build(city,'removePipe',[{x:20,y:22},{x:20,y:23}]).ok);assert.equal(waterViewColor(at(20,20)),C.zoned,'loss of pipe supply restores surface identity');
assert.equal(waterViewColor({...at(20,20),waterCovered:true,watered:false}),C.zoned,'coverage alone must not imply actual supply');
at(19,19).terrain='water';at(18,19).radiation=10;
const ctx=new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:()=>({width:0})},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>{o[k]=v;return true;}});
globalThis.document={createElement:()=>({getContext:()=>ctx}),hidden:false,querySelector:()=>null};
const scene=Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>city,ctx,dpr:1,w:1800,h:1200,rotation:0,zoom:1,pan:{x:0,y:0},sprites:[],layer:'water',reducedMotion:{matches:true},vehicleTime:0,preferences:{vehicleAnimations:false,pedestriansVisible:false,sceneryAnimations:false},hover:null,tool:'query'});
const before=serializeCity(city);let fills=[];scene.diamond=(x,y,u,fill)=>fills.push({x,y,fill});
for(let rotation=0;rotation<4;rotation++){scene.rotation=rotation;fills=[];scene.draw();for(const [x,y,expected]of [[20,20,C.zoned],[21,20,C.developed],[20,21,C.road],[19,20,C.open],[19,19,C.blocked],[18,19,C.blocked],[25,23,C.open]]){const p=scene.project(x,y);assert.equal(fills.find(f=>f.x===p.x&&f.y===p.y)?.fill,expected,`${x},${y} rotation ${rotation}`);}}
assert.equal(serializeCity(city),before);
console.log('PASS: underground surface identity, actual connected water supply and pipe interruption, coverage versus service, four renderer rotations, override precedence and unchanged city state.');
