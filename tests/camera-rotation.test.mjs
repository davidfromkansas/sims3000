import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCity} from '../dist/engine.js';
import {CityRenderer} from '../dist/renderer.js';
import {rotateCityView} from '../dist/camera-rotation.js';
import {serializeCity} from '../dist/save.js';
for(const size of [48,96,256])for(const direction of [-1,1])for(const zoom of [.5,1,2]){
 const city=createCity('Camera',false,size);for(const t of city.tiles)t.elevation=3;const saved=serializeCity(city),r=Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>city,w:900,h:600,zoom,pan:{x:0,y:0},rotation:0,dirty:false});
 const target={x:Math.floor(size*.7),y:Math.floor(size*.3)},p=r.project(target.x,target.y);r.pan.x+=r.w/2-p.x;r.pan.y+=r.h/2-p.y-r.unit/2;const original={...r.pan};
 for(let turn=0;turn<4;turn++){const anchor=r.pick(450,300),before=r.project(anchor.x,anchor.y),returned=rotateCityView(r,direction),after=r.project(anchor.x,anchor.y);assert.deepEqual(returned,anchor);assert.ok(Math.abs(before.x-after.x)<1e-8&&Math.abs(before.y-after.y)<1e-8);assert.equal(r.rotation,((turn+1)*direction+4)%4);assert.equal(r.dirty,true);assert.equal(r.zoom,zoom);assert.deepEqual(r.pick(450,300),anchor);}
 assert.ok(Math.abs(r.pan.x-original.x)<1e-8&&Math.abs(r.pan.y-original.y)<1e-8);assert.equal(serializeCity(city),saved);
 const before={...r.pan};rotateCityView(r,1);rotateCityView(r,-1);assert.ok(Math.abs(r.pan.x-before.x)<1e-8&&Math.abs(r.pan.y-before.y)<1e-8);assert.throws(()=>rotateCityView(r,2));
 r.pan={x:100000,y:100000};const anchor=rotateCityView(r,-1);assert.deepEqual(anchor,{x:Math.floor(size/2),y:Math.floor(size/2)});assert.ok(Number.isFinite(r.pan.x)&&Number.isFinite(r.pan.y));
}
const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),start=source.indexOf('function rotateView('),end=source.indexOf("$('#rotate').onclick",start),buttons=new Map([['#rotate',{}],['#rotateBack',{}]]),turns=[];let cancelled=0,notified=0;const bindings=source.slice(end,source.indexOf('\n',end));new Function('cancelMapGesture','rotateCityView','renderer','notify','$',source.slice(start,end)+bindings)(()=>cancelled++,(_,direction)=>turns.push(direction),{},()=>notified++,s=>buttons.get(s));buttons.get('#rotate').onclick();buttons.get('#rotateBack').onclick();assert.deepEqual(turns,[1,-1]);assert.equal(cancelled,2);assert.equal(notified,2);
console.log('PASS: both camera directions preserve panned/elevated focus across map sizes and zooms, reversible turns, no city mutation, off-map fallback and actual button/gesture-cancellation wiring.');
