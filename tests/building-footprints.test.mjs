import assert from 'node:assert/strict';
import {createCity,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {formBuildingLot} from '../dist/building-lots.js';
import {buildingStyleKey,baseZonedSprite,replaceBuildingStyle,zonedSprite} from '../dist/building-art.js';
import {buildingSlot,parseBuildingSlot,projectBuildingPoint} from '../dist/building-footprints.js';
import {defaultBuildingDesign,applyBuildingDesign,designForTile,exportBuildingDesign,importBuildingDesign,drawBuildingDesign,drawDesignedBuilding} from '../dist/building-designs.js';
import {towerToBlocks,buildingBlockFaces} from '../dist/building-blocks.js';
import {showBuildingReplacement} from '../dist/building-replacement-ui.js';
import {showBuildingDesigner} from '../dist/building-designer-ui.js';
const c=createCity('Footprint styles',false,96);
for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});
const root=c.tiles[70*96+70];for(let y=70;y<72;y++)for(let x=70;x<73;x++)Object.assign(c.tiles[y*96+x],{type:'residential',density:3,powered:true,watered:true,access:true});
const lot=formBuildingLot(c,root,3,2);recompute(c);const source=baseZonedSprite(root,c.seed),key=buildingStyleKey(c,root),single=defaultBuildingDesign(source),large=defaultBuildingDesign(key);
assert.equal(key,`${source}@3x2`);assert.deepEqual(large.footprint,{width:3,height:2});
for(const id of lot.ids)assert.equal(buildingStyleKey(c,c.tiles[id]),key);
const before=JSON.stringify(c.tiles),stats=structuredClone(c.stats),funds=c.funds;
applyBuildingDesign(c,source,single);assert.equal(designForTile(c,root),null);
applyBuildingDesign(c,key,large);for(const id of lot.ids)assert.deepEqual(designForTile(c,c.tiles[id]),large);
const library=JSON.stringify(c.buildingDesigns);assert.throws(()=>applyBuildingDesign(c,key,single),/footprint/);assert.equal(JSON.stringify(c.buildingDesigns),library);
assert.throws(()=>applyBuildingDesign(c,source,large),/footprint/);assert.equal(JSON.stringify(c.buildingDesigns),library);
for(const d of [large,{...large,blocks:towerToBlocks(large)},{...large,blocks:towerToBlocks(large),materials:Array(500).fill(2)}]){
 const file=exportBuildingDesign(d);assert.equal(JSON.parse(file).version,4);assert.deepEqual(importBuildingDesign(file),d);
 for(let rotation=0;rotation<4;rotation++){const points=[],ctx={beginPath(){},closePath(){},fill(){},stroke(){},moveTo(...p){points.push(p);},lineTo(...p){points.push(p);}};drawBuildingDesign(ctx,d,rotation);assert.ok(points.every(([x,y])=>x>=0&&x<=256&&y>=0&&y<=384));}
}
assert.equal(JSON.parse(exportBuildingDesign(single)).version,1);
assert.throws(()=>importBuildingDesign(JSON.stringify({format:'SIMS3000-building',version:3,design:large})));
for(const key of ['2@1x1','2@0x2','2@5x2','-1','02'])assert.throws(()=>parseBuildingSlot(key));
for(let rotation=0;rotation<4;rotation++)for(const footprint of [{width:1,height:1},{width:3,height:2},{width:2,height:3},{width:4,height:1}]){
 const size=Math.max(footprint.width,footprint.height),p=projectBuildingPoint([0,0,0],rotation,footprint),q=projectBuildingPoint([0,0,1],rotation,footprint);assert.ok(Math.abs((p[1]-q[1])*size-64)<1e-9,'floor height remains physical after city scaling');
 const blocks=Array(100).fill(1),tops=buildingBlockFaces(blocks,rotation,footprint).filter(f=>f.side===4),depth=f=>projectBuildingPoint([(f.x-5)*.085,(f.y-5)*.085,0],rotation,footprint)[1];for(let i=1;i<tops.length;i++)assert.ok(depth(tops[i])+1e-8>=depth(tops[i-1]),'rectangular columns draw back to front');
}
replaceBuildingStyle(c,key,1);assert.equal(c.buildingDesigns[key],undefined);assert.deepEqual(c.buildingDesigns[source],single);assert.equal(zonedSprite(root,c.seed,c.buildingReplacements,c),1);assert.equal(zonedSprite({...root,lotRoot:null},c.seed,c.buildingReplacements),source);
applyBuildingDesign(c,key,large);const restored=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(restored.buildingDesigns,c.buildingDesigns);assert.deepEqual(restored.buildingReplacements,c.buildingReplacements);assert.equal(JSON.stringify(c.tiles),before);recompute(c);assert.deepEqual(c.stats,stats);assert.equal(c.funds,funds);
// Run the actual designer and its handlers with an in-memory DOM surface.
let previewScale=1,previewStack=0;const ctx={save(){previewStack++;},restore(){previewStack--;},translate(){},scale(x){previewScale=x;},beginPath(){},closePath(){},fill(){},stroke(){},moveTo(){},lineTo(){},clearRect(){}};
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',style:{},getContext:()=>ctx,querySelector:s=>node(s.slice(1)),querySelectorAll:()=>[],setAttribute(){}});return nodes.get(id);};
globalThis.document={getElementById:node,contains:()=>true,querySelector:s=>node(s.slice(1)),createElement:()=>({getContext:()=>ctx,toDataURL:()=> 'data:image/png;base64,fixture'})};let applies=0;
showBuildingDesigner({city:c,dialog(){node('designSource').value=String(source);node('designFootprint').value='3x2';},apply(){applies++;},close(){}},key);
const cameraCity=serializeCity(c);node('designZoomIn').onclick();assert.equal(previewScale,1.25);assert.equal(previewStack,0);node('rotateBackDesign').onclick();assert.equal(node('rotateDesign').textContent,'Rotate preview · West');assert.equal(serializeCity(c),cameraCity,'preview navigation does not change city artwork or state');node('designResetView').onclick();assert.equal(previewScale,1);
node('designName').value='Wide courtyard';node('designName').oninput();node('applyDesign').onclick();assert.equal(applies,1);assert.equal(c.buildingDesigns[key].name,'Wide courtyard');assert.equal(c.buildingDesigns[source].name,single.name);
const input={files:[{size:100,text:async()=>exportBuildingDesign(single)}],value:'selected'};await node('designFile').onchange({target:input});assert.match(node('designStatus').textContent,/different tile footprint/);assert.equal(node('designName').value,'Wide courtyard');assert.equal(input.value,'');
node('designFootprint').value='1x1';node('designFootprint').onchange();assert.equal(node('designName').value,single.name);node('removeDesign').onclick();assert.equal(c.buildingDesigns[source],undefined);assert.equal(c.buildingDesigns[key].name,'Wide courtyard');
let draw;const renderer={getCity:()=>c,rotation:0,unit:32,project:(x,y)=>({x:x*10,y:y*10}),ctx:{save(){},restore(){},drawImage(...args){draw=args;}}};drawDesignedBuilding(renderer,root,large);assert.equal(draw[1]+128*1.5,710);assert.equal(draw[2]+346*1.5,705+16);assert.equal(draw[3],384);
let replacementText='',back=0;showBuildingReplacement({city:c,renderer,dialog(title,html){replacementText=html;node('replacementStyle').value='1';},apply(){applies++;},back(){back++;}},c.tiles[lot.ids.at(-1)]);
assert.match(replacementText,/3 × 2 tile footprint/);assert.match(replacementText,/1 current buildings/);node('applyReplacement').onclick();assert.equal(c.buildingReplacements[key],1);assert.equal(c.buildingDesigns[key],undefined);assert.equal(back,1);node('revertReplacement').onclick();assert.equal(c.buildingReplacements[key],undefined);
console.log('PASS: footprint-scoped custom models and replacements, atomic mismatch rejection, portable v4 tower/block/material files, legacy 1x1 compatibility, saved libraries, physical height, rectangular painter order and actual designer handlers.');
