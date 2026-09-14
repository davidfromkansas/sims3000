import assert from 'node:assert/strict';
import {defaultBuildingDesign,exportBuildingDesign,importBuildingDesign} from '../dist/building-designs.js';
import {projectedTowerOcclusion} from '../dist/building-tower-geometry.js';
import {groundFaces,groundCovered,connectedGround} from '../dist/building-ground-paint.js';
import {pickBuildingSurface} from '../dist/building-surface-picking.js';
import {mountBuildingGroundEditor} from '../dist/building-ground-editor.js';
const center=f=>f.polygon.reduce((p,[x,y])=>({x:p.x+x/f.polygon.length,y:p.y+y/f.polygon.length}),{x:0,y:0});
for(const roof of ['flat','step','spire'])for(let rotation=0;rotation<4;rotation++){
 let d={...defaultBuildingDesign(),roof,rotation},writes=0;const mode={value:'paint-ground'},material={value:'5'},status={},camera={zoom:1,x:0,y:0},canvas={width:256,height:384,getBoundingClientRect:()=>({left:0,top:0,width:256,height:384}),focus(){},setPointerCapture(){}};
 const control=mountBuildingGroundEditor(canvas,{get:()=>d,camera:()=>camera,mode,material,status,apply:groundPaint=>{d={...d,groundPaint};writes++;},render(){}});
 const faces=groundFaces(d,rotation),walls=projectedTowerOcclusion(d,rotation),visible=faces.find(f=>!pickBuildingSurface(walls,center(f))),hidden=faces.find(f=>pickBuildingSurface(walls,center(f)));assert.ok(visible&&hidden);
 const event=f=>({button:0,pointerId:1,...Object.fromEntries(Object.entries(center(f)).map(([k,v])=>[k==='x'?'clientX':'clientY',v])),preventDefault(){}});
 canvas.onpointerdown(event(hidden));canvas.onpointerup(event(hidden));assert.equal(writes,0,'cannot paint through the tower');
 canvas.onpointerdown(event(visible));canvas.onpointerup(event(visible));assert.equal(writes,1);assert.equal(d.groundPaint[visible.index],'6');
 canvas.onpointerdown(event(visible));d={...d,width:d.width+1};canvas.onpointerup(event(visible));assert.equal(writes,1,'changed tower geometry invalidates pending ground stroke');
 d={...d,width:d.width-1};mode.value='sample-ground';mode.onchange();material.value='0';canvas.onpointerdown(event(visible));assert.equal(material.value,'5');assert.equal(writes,1);
 assert.ok(groundCovered(d,44));assert.ok(!connectedGround(d,0).some(i=>groundCovered(d,i)));assert.deepEqual(importBuildingDesign(exportBuildingDesign(d)).groundPaint,d.groundPaint);
 control.reset();
}
console.log('PASS: tower ground painting across three roofs and four views, model occlusion, geometry-change cancellation, sampling, base-aware fills and portable retention.');
