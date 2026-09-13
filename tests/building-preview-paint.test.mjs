import assert from 'node:assert/strict';
import {mountBuildingPreviewPaint} from '../dist/building-preview-paint.js';
import {projectedBuildingSurfaces} from '../dist/building-surface-picking.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
let draft={...defaultBuildingDesign(2),rotation:0,blocks:Array(100).fill(0)},writes=0,pans=0;draft.blocks[44]=8;
const canvas={width:256,height:384,style:{},getBoundingClientRect:()=>({left:10,top:20,width:512,height:768}),focus(){},setPointerCapture(){},onpointerdown:()=>pans++},mode={value:'paint'},material={value:'2'},status={};
const controller=mountBuildingPreviewPaint(canvas,{get:()=>draft,camera:()=>({zoom:1,x:0,y:0}),apply:m=>{draft={...draft,materials:m};writes++;},render(){},mode,material,status});
const face=projectedBuildingSurfaces(draft).at(-1),x=face.polygon.reduce((s,p)=>s+p[0],0)/4,y=face.polygon.reduce((s,p)=>s+p[1],0)/4,event={button:0,pointerId:1,clientX:10+x*2,clientY:20+y*2,preventDefault(){}};
canvas.onpointerdown(event);assert.equal(writes,0,'paint is pending until release');canvas.onpointerup({...event,shiftKey:true});assert.equal(writes,0);canvas.onpointerdown(event);canvas.onpointercancel(event);assert.equal(writes,0);canvas.onpointerdown(event);canvas.onpointerup(event);assert.equal(writes,1);assert.equal(draft.materials[face.index*5+face.side],2);
mode.value='sample';mode.onchange();material.value='1';canvas.onpointerdown(event);assert.equal(material.value,'2');assert.equal(writes,1,'eyedropper never edits');assert.match(status.textContent,/unchanged/);
mode.value='paint';mode.onchange();canvas.onpointermove(event);material.value='3';canvas.onkeydown({key:'Enter',preventDefault(){},stopPropagation(){}});assert.equal(writes,2);assert.equal(draft.materials[face.index*5+face.side],3);
canvas.onpointerdown(event);draft={...draft,blocks:[...draft.blocks]};canvas.onpointerup(event);assert.equal(writes,2,'model switch cancels an in-flight stroke');canvas.onpointerdown(event);canvas.onkeydown({key:'Escape',preventDefault(){},stopPropagation(){}});canvas.onpointerup(event);assert.equal(writes,2);
canvas.onpointerdown(event);draft={...draft,rotation:1};canvas.onpointerup(event);assert.equal(writes,2,'rotation interrupts a pending stroke');
mode.value='pan';mode.onchange();canvas.onpointerdown(event);assert.equal(pans,1);controller.reset();
console.log('PASS: direct paint stroke commit/cancel, scaled pointer coordinates, read-only material sampling, keyboard painting, model replacement cancellation and camera delegation.');

// Floor scope paints exactly one level; column scope deliberately replaces all levels.
const scope={value:'floor'};draft={...draft,rotation:0};
mountBuildingPreviewPaint(canvas,{get:()=>draft,camera:()=>({zoom:1,x:0,y:0}),apply(){throw Error('Unexpected column callback');},applyFloor:p=>{draft={...draft,surfacePaint:p};},render(){},mode,material,status,scope});
mode.value='paint';material.value='4';canvas.onpointerdown(event);canvas.onpointerup(event);assert.equal([...draft.surfacePaint].filter(c=>c!=='0').length,1);assert.match(status.textContent,/Floor 8/);
scope.value='column';scope.onchange();material.value='1';canvas.onpointerdown(event);canvas.onpointerup(event);assert.equal([...draft.surfacePaint].filter(c=>c==='2').length,24);
mode.value='sample';material.value='0';canvas.onpointerdown(event);assert.equal(material.value,'1');
mode.value='fill';mode.onchange();assert.equal(scope.disabled,true);material.value='3';const fillFace=projectedBuildingSurfaces(draft).find(f=>f.side!==4),fx=fillFace.polygon.reduce((s,p)=>s+p[0],0)/4,fy=fillFace.polygon.reduce((s,p)=>s+p[1],0)/4,fillEvent={...event,clientX:10+fx*2,clientY:20+fy*2};const preFill=draft.surfacePaint;
canvas.onpointerdown(fillEvent);assert.equal(draft.surfacePaint,preFill);assert.match(status.textContent,/8 connected/);canvas.onpointerup({...fillEvent,shiftKey:true});assert.equal(draft.surfacePaint,preFill);canvas.onpointerdown(fillEvent);canvas.onpointerup(fillEvent);assert.equal([...draft.surfacePaint].filter(c=>c==='4').length,8,'one fill paints the connected eight-floor wall');
mode.value='paint';mode.onchange();assert.equal(scope.disabled,false);
mode.value='fill';mode.onchange();canvas.onpointermove(fillEvent);material.value='2';canvas.onkeydown({key:'Enter',preventDefault(){},stopPropagation(){}});assert.equal([...draft.surfacePaint].filter(c=>c==='3').length,8,'keyboard fill uses the same connected region');canvas.onpointerdown(fillEvent);draft={...draft,surfacePaint:'0'.repeat(12000)};canvas.onpointerup(fillEvent);assert.equal(draft.surfacePaint,'0'.repeat(12000),'changing paint during a pending fill cancels its stale region');
