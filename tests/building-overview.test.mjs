import assert from 'node:assert/strict';
import {mountBuildingOverview,overviewViewport} from '../dist/building-overview.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
import {mountBuildingPreviewCamera} from '../dist/building-preview-camera.js';
let rect,allocations=0,draws=0;const context={clearRect(){},drawImage(){draws++;},save(){},restore(){},scale(){},strokeRect(...args){rect=args;},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){}};
globalThis.document={createElement:()=>{allocations++;return{getContext:()=>context};}};
const main={width:256,height:384,style:{}},controls={zoomIn:{},zoomOut:{},reset:{},label:{}},canvas={width:112,height:168,getContext:()=>context,getBoundingClientRect:()=>({left:20,top:30,width:56,height:84}),focus(){},setAttribute(k,v){this[k]=v;}};
let design={...defaultBuildingDesign(),rotation:0},overview;const camera=mountBuildingPreviewCamera(main,controls,()=>overview?.draw());overview=mountBuildingOverview(canvas,{get:()=>design,camera:()=>camera.state,center:p=>camera.center(p),reset:()=>camera.reset()});
overview.draw();assert.deepEqual(rect.map(v=>v||0),[0,0,256,384]);const count=allocations;
controls.zoomIn.onclick();const v=overviewViewport(camera.state);assert.equal(v.width,204.8);assert.equal(v.height,307.2);assert.equal(allocations,count,'zoom reuses unchanged whole-model artwork');
const event=(key)=>({key,button:0,clientX:48,clientY:51,preventDefault(){},stopPropagation(){}});canvas.onpointerdown(event());assert.equal(camera.state.zoom,1.25);assert.ok(Math.abs((128-camera.state.x)/camera.state.zoom-128)<1e-9);assert.ok(Math.abs((192-camera.state.y)/camera.state.zoom-96)<1e-9,'CSS-scaled overview click centers the intended model point');
const before=camera.state.x;canvas.onkeydown(event('ArrowRight'));assert.equal(camera.state.x,before-16*1.25);assert.match(canvas['aria-label'],/125 percent/);
canvas.onkeydown(event('Home'));assert.deepEqual(camera.state,{zoom:1,x:0,y:0});assert.equal(allocations,count);
design={...design,rotation:1};overview.draw();assert.equal(allocations,count+1);design={...design,facade:'#abcdef'};overview.draw();assert.equal(allocations,count+2);assert.ok(draws>5);
assert.equal(design.floors,defaultBuildingDesign().floors,'navigation leaves model geometry unchanged');
console.log('PASS: whole-model overview, inverse viewport frame, CSS-scaled recentering, keyboard movement/reset, preserved zoom, artwork reuse and model/view invalidation.');

for(let i=0;i<10;i++)controls.zoomOut.onclick();assert.equal(camera.state.zoom,.5);assert.deepEqual(rect.map(v=>v||0),[0,0,256,384],'zooming out beyond the model keeps a full overview frame visible');
