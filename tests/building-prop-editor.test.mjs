import {buildingPropPickFaces,pickBuildingProp} from '../dist/building-prop-picking.js';
import assert from 'node:assert/strict';
import {mountBuildingPropEditor,propPlacementSurfaces} from '../dist/building-prop-editor.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
let paletteDraws=0;const paletteContext={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){paletteDraws++;}};
const controls=new Map(),remove=[];const node=s=>{if(!controls.has(s))controls.set(s,{value:'',getContext:()=>paletteContext,setAttribute(k,v){this[k]=v;},querySelectorAll:()=>remove});return controls.get(s);};
const host={innerHTML:'',querySelector:node},kind=node('[data-prop-kind]'),rotation=node('[data-prop-rotation]');kind.value='tree';rotation.value='1';
let design={...defaultBuildingDesign(),blocks:Array(100).fill(0),rotation:0};design.blocks[44]=4;const mode={value:'prop'},status={},camera={zoom:1,x:0,y:0};let writes=0;
const canvas={width:256,height:384,style:{},getBoundingClientRect:()=>({left:0,top:0,width:256,height:384}),focus(){},setPointerCapture(){}};
let editor;editor=mountBuildingPropEditor(host,canvas,{get:()=>design,camera:()=>camera,mode,apply:p=>{writes++;design={...design,props:p};editor.refresh();},render(){},status});editor.refresh();
const center=f=>({x:f.polygon.reduce((s,p)=>s+p[0],0)/f.polygon.length,y:f.polygon.reduce((s,p)=>s+p[1],0)/f.polygon.length}),event=p=>({button:0,pointerId:1,clientX:p.x,clientY:p.y,preventDefault(){},stopPropagation(){}}),down=p=>canvas.onpointerdown(event(p)),up=shiftKey=>canvas.onpointerup({pointerId:1,shiftKey});
const surfaces=propPlacementSurfaces(design),roof=surfaces.find(f=>f.side===4&&f.x===4&&f.y===4&&f.points[0][2]>0),ground=surfaces.find(f=>f.x===9&&f.y===9&&f.points[0][2]===0);
down(center(roof));assert.equal(writes,0);up(true);assert.equal(writes,0);down(center(roof));up(false);assert.equal(design.props.length,1);assert.equal(design.props[0].rotation,1);assert.ok(Math.abs(design.props[0].z-.68)<1e-10);
const hidden=surfaces.find(f=>f.x===0&&f.y===0&&f.points[0][2]===0);down(center(hidden));up(false);assert.equal(design.props.length,1,'occluded ground is not a placement target');
node('[data-prop-category]').value='Vehicles';node('[data-prop-category]').onchange();kind.value='car';kind.onchange();down(center(ground));up(false);assert.equal(design.props[1].z,0);assert.equal(design.props[1].kind,'car');
let count=writes;down(center(roof));camera.x=10;up(false);assert.equal(writes,count,'camera change discards a stale placement');camera.x=0;
down(center(roof));design={...design,blocks:[...design.blocks]};up(false);assert.equal(writes,count,'geometry change discards a stale placement');
down(center(ground));canvas.onkeydown({key:'Escape',preventDefault(){},stopPropagation(){}});up(false);assert.equal(writes,count);
canvas.onpointermove(event(center(ground)));canvas.onkeydown({key:'Enter',preventDefault(){},stopPropagation(){}});assert.equal(writes,count+1,'keyboard placement follows the same surface picking');
let rect;editor.draw({save(){},restore(){},strokeRect(...p){rect=p;}});assert.ok(rect&&rect.every(Number.isFinite));assert.ok(rect[2]>0&&rect[3]>0);
remove.push({dataset:{removeProp:'0'}});design={...design,props:[...design.props]};editor.reset();design.props.push({...design.props[0],x:8});editor.refresh();count=design.props.length;remove[0].onclick();assert.equal(design.props.length,count-1);
mode.value='pan';mode.onchange();assert.equal(kind.disabled,true);assert.equal(rotation.disabled,true);
console.log('PASS: actual prop controls, ground/roof picking, preview bounds, independent rotation, staged clicks, Shift/Escape cancellation, stale-camera/geometry rejection, keyboard placement and removal.');

// Exercise placement through camera zoom/pan, rectangular lots and all city directions.
mode.value='prop';mode.onchange();kind.value='car';rotation.value='2';
for(const footprint of [{width:1,height:1},{width:5,height:1},{width:1,height:5}])for(let view=0;view<4;view++){
 design={...defaultBuildingDesign(),blocks:Array(100).fill(4),footprint,rotation:view};editor.reset();
 camera.zoom=1.7;camera.x=21;camera.y=-90;
 const face=propPlacementSurfaces(design,view).find(f=>f.x===4&&f.y===4&&f.side===4&&f.points[0][2]>0),p=center(face);
 down({x:p.x*camera.zoom+camera.x,y:p.y*camera.zoom+camera.y});up(false);
 assert.equal(design.props.length,1);assert.equal(design.props[0].x,4);assert.equal(design.props[0].y,4);assert.equal(design.props[0].rotation,2,'view rotation never changes selected prop direction');
}
console.log('PASS: prop placement across zoom/pan, rectangular footprints and all four model views.');

const category=node('[data-prop-category]');
for(const name of ['Architecture','Building Decoration','Plaza and Streets','Yard Objects','Flora','Vehicles','Industrial','Rooftops']){
 category.value=name;category.onchange();assert.ok(kind.innerHTML.includes('<option'));
 const count=design.props.length,face=propPlacementSurfaces(design,design.rotation).find(f=>f.x===4&&f.y===4&&f.side===4&&f.points[0][2]>0),p=center(face);
 down({x:p.x*camera.zoom+camera.x,y:p.y*camera.zoom+camera.y});up(false);assert.equal(design.props.length,count+1);assert.equal(design.props.at(-1).kind,kind.value);
}
mode.value='pan';mode.onchange();assert.equal(category.disabled,true);
console.log('PASS: category filtering exposes all eight manual prop groups and places their selected model.');

editor.refresh();const drawsBefore=paletteDraws;for(let i=0;i<20;i++)editor.refresh();assert.equal(paletteDraws,drawsBefore,'cursor-only refresh does not rerender the palette');
rotation.value='3';editor.refresh();assert.equal(paletteDraws,drawsBefore+1);assert.match(node('[data-prop-preview]')['aria-label'],/facing West/);
design={...design,rotation:0};editor.refresh();assert.match(node('[data-prop-caption]').textContent,/viewed from North/);
console.log('PASS: selected prop preview, accessible direction/view labels and unchanged thumbnail reuse.');

mode.value='erase-prop';mode.onchange();assert.equal(kind.disabled,true);
design={...defaultBuildingDesign(),blocks:Array(100).fill(0),rotation:0,props:[{kind:'car',x:4,y:4,z:0,rotation:0}]};camera.zoom=1;camera.x=camera.y=0;editor.reset();
const pickFaces=buildingPropPickFaces(design),pickPoints=pickFaces.flatMap(f=>f.points.slice(2).map((_,i)=>{const p=[f.points[0],f.points[i+1],f.points[i+2]];return{x:p.reduce((s,q)=>s+q[0],0)/3,y:p.reduce((s,q)=>s+q[1],0)/3};})),hit=pickPoints.find(p=>pickBuildingProp(pickFaces,p)===0);
assert.ok(hit);down(hit);up(true);assert.equal(design.props.length,1,'Shift cancels erasing');down(hit);up(false);assert.equal(design.props.length,0,'direct click removes the visible prop, including index zero');assert.match(status.textContent,/Undo/);
console.log('PASS: actual Erase props mode, disabled placement choices, cancellation and visible prop removal.');

const currentHit=index=>{const faces=buildingPropPickFaces(design,design.rotation);return faces.flatMap(f=>f.points.slice(2).map((_,i)=>{const p=[f.points[0],f.points[i+1],f.points[i+2]];return{x:p.reduce((s,q)=>s+q[0],0)/3,y:p.reduce((s,q)=>s+q[1],0)/3};})).find(p=>pickBuildingProp(faces,p)===index);};
design={...defaultBuildingDesign(),blocks:Array(100).fill(0),rotation:0,props:[{kind:'pickup',x:2,y:2,z:0,rotation:3},{kind:'bench',x:7,y:7,z:0,rotation:1}]};
mode.value='select-prop';mode.onchange();const unchanged=JSON.stringify(design),beforeSelect=writes;down(currentHit(0));up(false);assert.equal(writes,beforeSelect);assert.equal(JSON.stringify(design),unchanged);assert.equal(kind.value,'pickup');assert.equal(rotation.value,'3');assert.equal(category.value,'Vehicles');assert.match(status.textContent,/unchanged/);
down({x:0,y:0});up(false);assert.equal(kind.value,'pickup','empty space does not clear the sampled prop');assert.equal(writes,beforeSelect);
mode.value='erase-prop';mode.onchange();const first=currentHit(0),second=currentHit(1);down(first);canvas.onpointermove(event(second));assert.equal(writes,beforeSelect,'erase stroke is preview-only until released');up(true);assert.equal(JSON.stringify(design),unchanged);
down(first);canvas.onpointermove(event(second));up(false);assert.equal(design.props.length,0);assert.equal(writes,beforeSelect+1,'multi-prop erase is one construction history action');assert.match(status.textContent,/whole stroke/);
console.log('PASS: read-only prop sampling copies category/type/direction, empty selection preserves the palette, and multi-prop erase commits once or cancels atomically.');

// The actual erase preview draws a tinted raster for the pending stroke, not a rectangle.
design={...design,props:[{kind:'pickup',x:2,y:2,z:0,rotation:3},{kind:'bench',x:7,y:7,z:0,rotation:1}]};editor.reset();down(currentHit(0));canvas.onpointermove(event(currentHit(1)));let overlayPixels,overlayDraws=0;
globalThis.document={createElement:()=>({getContext:()=>({createImageData:paletteContext.createImageData,putImageData(image){overlayPixels=image.data;}})})};
editor.draw({drawImage(){overlayDraws++;},strokeRect(){throw Error('Existing props should be tinted, not boxed.');}});assert.equal(overlayDraws,1);assert.ok(overlayPixels.some((v,i)=>i%4===3&&v));up(true);
console.log('PASS: actual multi-prop erase preview draws the shaded selection overlay.');
