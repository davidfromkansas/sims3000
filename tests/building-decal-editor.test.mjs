import assert from 'node:assert/strict';
import {mountBuildingDecalEditor} from '../dist/building-decal-editor.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
import {projectedBuildingSurfaces} from '../dist/building-surface-picking.js';
import {decalPolygonsOnFace,anchoredDecal,wallCoordinates} from '../dist/building-decals.js';
import {projectBuildingPoint} from '../dist/building-footprints.js';
let draft={...defaultBuildingDesign(),blocks:Array(100).fill(0),rotation:0},writes=0;for(let i=42;i<=47;i++)draft.blocks[i]=4;
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',hidden:false,setAttribute(k,v){this[k]=v;}});return nodes.get(id);},mode={value:'anchored-detail'},material={},status={},camera={zoom:1,x:0,y:0},canvas={width:256,height:384,style:{},getBoundingClientRect:()=>({left:10,top:20,width:512,height:768}),focus(){},setPointerCapture(){}};
const editor=mountBuildingDecalEditor({set innerHTML(v){},querySelector:s=>node(s.slice(1))},canvas,{get:()=>draft,camera:()=>camera,mode,material,status,apply:d=>{draft={...draft,decals:d};writes++;},render(){}});node('decalKind').value='1';node('decalWidth').value='3';node('decalHeight').value='2';
const face=projectedBuildingSurfaces(draft).find(f=>f.side===2&&f.x===3&&f.from===1),point=face.polygon.reduce((p,[x,y])=>({x:p.x+x/4,y:p.y+y/4}),{x:0,y:0}),event=p=>({button:0,pointerId:1,clientX:10+p.x*2,clientY:20+p.y*2,preventDefault(){}}),e=event(point);
canvas.onpointerdown(e);assert.equal(writes,0);canvas.onpointerup({...e,shiftKey:true});assert.equal(writes,0);canvas.onpointerdown(e);canvas.onpointerup(e);assert.equal(writes,1);assert.equal(draft.decals[0].width,3);assert.equal(draft.decals[0].height,.28);
canvas.onpointerdown(e);node('detailSwatch5').onclick();canvas.onpointerup(e);assert.equal(writes,1,'visual detail selection cancels pending placement');canvas.onpointerdown(e);node('decalWidth').value='4';node('decalWidth').oninput();canvas.onpointerup(e);assert.equal(writes,1,'size change cancels pending placement');node('decalWidth').value='NaN';canvas.onpointerdown(e);canvas.onpointerup(e);assert.equal(writes,1);assert.match(status.textContent,/valid/);
const polygon=decalPolygonsOnFace(face,draft.decals,draft).at(-1).points.map(p=>projectBuildingPoint(p,0));const p=polygon.reduce((p,[x,y])=>({x:p.x+x/polygon.length,y:p.y+y/polygon.length}),{x:0,y:0}),pick=event(p);
mode.value='sample-decal';mode.onchange();canvas.onpointerdown(pick);assert.equal(node('detailSwatch1')['aria-pressed'],'true');assert.equal(node('decalWidth').value,'3');assert.equal(node('decalHeight').value,'2');assert.equal(writes,1);assert.match(status.textContent,/unchanged/);
mode.value='erase-decal';mode.onchange();canvas.onpointerdown(pick);canvas.onpointerup(pick);assert.equal(writes,2);assert.deepEqual(draft.decals,[]);
mode.value='anchored-detail';mode.onchange();canvas.onpointerdown(e);draft={...draft,rotation:1};canvas.onpointerup(e);assert.equal(writes,2,'camera rotation cancels stale placement');draft={...draft,rotation:0};canvas.onpointermove(e);canvas.onkeydown({key:'Enter',preventDefault(){},stopPropagation(){}});assert.equal(writes,3);assert.equal(draft.decals.length,1);
editor.reset();assert.equal(node('anchoredDetailControls').hidden,false);mode.value='pan';mode.onchange();assert.equal(node('anchoredDetailControls').hidden,true);
console.log('PASS: anchored placement sizing, scaled pointer, release/cancel, input validation, visible-detail sampling/erase, stale-camera cancellation and keyboard placement.');

mode.value='anchored-detail';mode.onchange();node('decalKind').value='1';node('decalWidth').value='2';node('decalHeight').value='1';
for(const footprint of [{width:1,height:5},{width:5,height:1}])for(let rotation=0;rotation<4;rotation++){
 draft={...draft,footprint,rotation,decals:[]};camera.zoom=2.4;camera.x=-150;camera.y=-360;editor.reset();
 const f=projectedBuildingSurfaces(draft,rotation).find(f=>f.side!==4&&f.from===1),center=f.points.reduce((a,p)=>a.map((v,i)=>v+p[i]/f.points.length),[0,0,0]),local=projectBuildingPoint(center,rotation,footprint),e=event({x:local[0]*camera.zoom+camera.x,y:local[1]*camera.zoom+camera.y});
 const [u,z]=wallCoordinates(f.side,center);node('decalSnap').checked=false;canvas.onpointerdown(e);canvas.onpointerup(e);
 assert.equal(draft.decals.length,1);assert.equal(draft.decals[0].u,Math.round(u*1000)/1000);assert.equal(draft.decals[0].z,Math.round(z*1000)/1000);
 node('decalSnap').checked=true;node('decalSnap').onchange();canvas.onpointerdown(e);canvas.onpointerup(e);
 assert.deepEqual(draft.decals[1],anchoredDecal(f,1,2,.14));
 const n=writes;canvas.onpointerdown(e);node('decalSnap').checked=false;node('decalSnap').onchange();canvas.onpointerup(e);assert.equal(writes,n,'changing snap cancels pending placement');
 const commands=[];editor.draw({save(){},restore(){},beginPath(){},closePath(){},stroke(){},moveTo(x,y){commands.push([x,y]);},lineTo(x,y){commands.push([x,y]);}});assert.ok(commands.length>=8,'preview shows wall boundary and precise anchor cross');assert.ok(commands.flat().every(Number.isFinite));
}
console.log('PASS: precise and snapped anchors through actual scaled pointer handlers, panned/zoomed cameras, rectangular lots, four rotations and snap-change cancellation.');
