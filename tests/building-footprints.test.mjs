import assert from 'node:assert/strict';
import {createCity,recompute,validateSave,build,tick} from '../dist/engine.js';
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
for(const key of ['2@1x1','2@0x2','2@6x2','-1','02'])assert.throws(()=>parseBuildingSlot(key));
for(let rotation=0;rotation<4;rotation++)for(const footprint of [{width:1,height:1},{width:3,height:2},{width:2,height:3},{width:4,height:1}]){
 const size=Math.max(footprint.width,footprint.height),p=projectBuildingPoint([0,0,0],rotation,footprint),q=projectBuildingPoint([0,0,1],rotation,footprint);assert.ok(Math.abs((p[1]-q[1])*size-64)<1e-9,'floor height remains physical after city scaling');
 const blocks=Array(100).fill(1),tops=buildingBlockFaces(blocks,rotation,footprint).filter(f=>f.side===4),depth=f=>projectBuildingPoint([(f.x-5)*.085,(f.y-5)*.085,0],rotation,footprint)[1];for(let i=1;i<tops.length;i++)assert.ok(depth(tops[i])+1e-8>=depth(tops[i-1]),'rectangular columns draw back to front');
}
replaceBuildingStyle(c,key,1);assert.equal(c.buildingDesigns[key],undefined);assert.deepEqual(c.buildingDesigns[source],single);assert.equal(zonedSprite(root,c.seed,c.buildingReplacements,c),1);assert.equal(zonedSprite({...root,lotRoot:null},c.seed,c.buildingReplacements),source);
applyBuildingDesign(c,key,large);const restored=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(restored.buildingDesigns,c.buildingDesigns);assert.deepEqual(restored.buildingReplacements,c.buildingReplacements);assert.equal(JSON.stringify(c.tiles),before);recompute(c);assert.deepEqual(c.stats,stats);assert.equal(c.funds,funds);
// Five-tile models preserve complete lots and their portable artwork.
const expanded=createCity('Five-tile buildings',false,96);
for(const t of expanded.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});
for(let y=30;y<35;y++)for(let x=30;x<35;x++)Object.assign(expanded.tiles[y*96+x],{type:'commercial',density:3,powered:true,watered:true,access:true});
const expandedRoot=expanded.tiles[30*96+30],expandedLot=formBuildingLot(expanded,expandedRoot,5,5);assert.equal(expandedLot.ids.length,25);recompute(expanded);
const expandedKey=buildingStyleKey(expanded,expandedRoot),model=defaultBuildingDesign(expandedKey),expandedBefore={tiles:JSON.stringify(expanded.tiles),stats:JSON.stringify(expanded.stats),funds:expanded.funds};
applyBuildingDesign(expanded,expandedKey,model);assert.deepEqual(importBuildingDesign(exportBuildingDesign(model)),model);assert.equal(JSON.parse(exportBuildingDesign(model)).version,9);
const shaped={...model,voxels:Array(100).fill(1),blockGeometry:'1'.repeat(100)+'0'.repeat(2300)};assert.deepEqual(importBuildingDesign(exportBuildingDesign(shaped)),shaped);
const completeModel={...model,voxels:Array(100).fill((1<<24)-1),materials:Array(500).fill(4),surfacePaint:'5'.repeat(12000),surfaceDetails:'11110'.repeat(2400),blockGeometry:'4'.repeat(2400)},completeFile=exportBuildingDesign(completeModel);assert.equal(JSON.parse(completeFile).version,9);assert.ok(Buffer.byteLength(completeFile)<32768,'maximum five-tile layered artwork fits the portable-file limit');assert.deepEqual(importBuildingDesign(completeFile),completeModel,'all geometry, paint and details survive the five-tile format');
const oldModel=JSON.parse(exportBuildingDesign(model));oldModel.version=4;assert.throws(()=>importBuildingDesign(JSON.stringify(oldModel)),/SIMS3000/);
assert.equal(JSON.stringify(expanded.tiles),expandedBefore.tiles);assert.equal(JSON.stringify(expanded.stats),expandedBefore.stats);assert.equal(expanded.funds,expandedBefore.funds);
const expandedSave=serializeCity(expanded),expandedRestored=validateSave(JSON.parse(expandedSave));assert.equal(expandedRestored.buildingLots.get(expandedLot.root).ids.length,25);assert.equal(serializeCity(expandedRestored),expandedSave);
const oldExpanded=JSON.parse(expandedSave);oldExpanded.version=145;assert.throws(()=>validateSave(oldExpanded),/146/);oldExpanded.buildingDesigns={};assert.throws(()=>validateSave(oldExpanded),/146/);
tick(expandedRestored);assert.equal(serializeCity(validateSave(JSON.parse(serializeCity(expandedRestored)))),serializeCity(expandedRestored));assert.equal(build(expandedRestored,'bulldoze',[{x:34,y:34}]).ok,true);assert.ok(expandedLot.ids.every(id=>expandedRestored.tiles[id].lotRoot==null&&expandedRestored.tiles[id].level===0),'demolishing a distant member removes the entire five-tile building');
const olderOrdinary=JSON.parse(serializeCity(createCity()));olderOrdinary.version=145;assert.equal(validateSave(olderOrdinary).version,151);
for(const footprint of [{width:5,height:1},{width:1,height:5},{width:5,height:5}])for(let rotation=0;rotation<4;rotation++){
 const d=defaultBuildingDesign(buildingSlot(4,footprint)),points=[],ctx={beginPath(){},closePath(){},fill(){},stroke(){},moveTo(...p){points.push(p);},lineTo(...p){points.push(p);}};drawBuildingDesign(ctx,d,rotation);assert.ok(points.every(([x,y])=>x>=0&&x<=256&&y>=0&&y<=384));
}
// Run the actual designer and its handlers with an in-memory DOM surface.
let previewScale=1,previewStack=0;const ctx={strokeRect(){},drawImage(){},createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},save(){previewStack++;},restore(){previewStack--;},translate(){},scale(x){previewScale=x;},beginPath(){},closePath(){},fill(){},stroke(){},moveTo(){},lineTo(){},clearRect(){}};
const overviewContext={...ctx,scale(){}};
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',style:{},width:id==='buildingOverview'?112:256,height:id==='buildingOverview'?168:384,getContext:()=>id==='buildingOverview'?overviewContext:ctx,querySelector:s=>node(s.slice(1)),querySelectorAll:()=>[],setAttribute(){}});return nodes.get(id);};
globalThis.document={getElementById:node,contains:()=>true,querySelector:s=>node(s.slice(1)),createElement:()=>({getContext:()=>ctx,toDataURL:()=> 'data:image/png;base64,fixture'})};let applies=0;
showBuildingDesigner({city:c,dialog(){node('designSource').value=String(source);node('designFootprint').value='3x2';},apply(){applies++;},close(){}},key);
const beforeSpace=serializeCity(c);node('designPreview').onkeydown({key:' ',preventDefault(){},stopPropagation(){}});assert.equal(node('rotateDesign').textContent,'Rotate preview · East');node('designPreview').onkeydown({key:' ',repeat:true,preventDefault(){},stopPropagation(){}});assert.equal(node('rotateDesign').textContent,'Rotate preview · East','holding Space does not spin repeatedly');node('rotateBackDesign').onclick();assert.equal(serializeCity(c),beforeSpace,'Space rotates only the preview');
const cameraCity=serializeCity(c);node('designZoomIn').onclick();assert.equal(previewScale,1.25);assert.equal(previewStack,0);node('rotateBackDesign').onclick();assert.equal(node('rotateDesign').textContent,'Rotate preview · West');assert.equal(serializeCity(c),cameraCity,'preview navigation does not change city artwork or state');node('designResetView').onclick();assert.equal(previewScale,1);
node('designName').value='Wide courtyard';node('designName').oninput();node('applyDesign').onclick();assert.equal(applies,1);assert.equal(c.buildingDesigns[key].name,'Wide courtyard');assert.equal(c.buildingDesigns[source].name,single.name);
const input={files:[{size:100,text:async()=>exportBuildingDesign(single)}],value:'selected'};await node('designFile').onchange({target:input});assert.match(node('designStatus').textContent,/different tile footprint/);assert.equal(node('designName').value,'Wide courtyard');assert.equal(input.value,'');
let finishDesignerRead;const slowDesignerInput={files:[{size:100,text:()=>new Promise(resolve=>finishDesignerRead=resolve)}],value:'old'};const slowDesignerRead=node('designFile').onchange({target:slowDesignerInput});
const latestModel={...large,name:'Newest import'};await node('designFile').onchange({target:{files:[{size:100,text:async()=>exportBuildingDesign(latestModel)}],value:'new'}});finishDesignerRead(exportBuildingDesign({...large,name:'Older import'}));await slowDesignerRead;assert.equal(node('designName').value,'Newest import');
let finishAfterEdit;const pendingAfterEdit=node('designFile').onchange({target:{files:[{size:100,text:()=>new Promise(resolve=>finishAfterEdit=resolve)}]}});node('designName').value='My later edit';node('designName').oninput();finishAfterEdit(exportBuildingDesign(large));await pendingAfterEdit;assert.equal(node('designName').value,'My later edit','a pending import cannot overwrite newer manual work');
node('designFootprint').value='1x1';node('designFootprint').onchange();assert.equal(node('designName').value,single.name);node('removeDesign').onclick();assert.equal(c.buildingDesigns[source],undefined);assert.equal(c.buildingDesigns[key].name,'Wide courtyard');
let draw;const renderer={getCity:()=>c,rotation:0,unit:32,project:(x,y)=>({x:x*10,y:y*10}),ctx:{save(){},restore(){},drawImage(...args){draw=args;}}};drawDesignedBuilding(renderer,root,large);assert.equal(draw[1]+128*1.5,710);assert.equal(draw[2]+346*1.5,705+16);assert.equal(draw[3],384);
let replacementText='',back=0;showBuildingReplacement({city:c,renderer,dialog(title,html){replacementText=html;node('replacementStyle').value='1';},apply(){applies++;},back(){back++;}},c.tiles[lot.ids.at(-1)]);
const beforeCompare=serializeCity(c),compare=node('replacementCompare');
compare.onpointerdown({button:0,pointerId:1});assert.equal(node('replacementPreview').alt,'Detached homes');
assert.match(node('replacementPreviewTitle').textContent,/comparing/);compare.onpointercancel();assert.equal(node('replacementPreview').alt,'Custom building model');
compare.onkeydown({key:' ',preventDefault(){}});assert.match(node('replacementPreviewTitle').textContent,/comparing/);
compare.onkeyup({key:' ',preventDefault(){}});assert.equal(node('replacementPreview').alt,'Custom building model');
compare.onkeydown({key:'Enter',preventDefault(){}});compare.onblur();assert.equal(node('replacementPreview').alt,'Custom building model');
assert.equal(serializeCity(c),beforeCompare,'hold comparison does not alter the city or applied custom model');
assert.match(replacementText,/3 × 2 tile footprint/);assert.match(replacementText,/1 current building/);assert.equal(node('applyReplacement').disabled,true);const preserved=serializeCity(c);node('replacementRotate').onclick();node('applyReplacement').onclick();assert.equal(serializeCity(c),preserved,'preview and disabled apply preserve custom design');assert.equal(back,0);node('replacementStyle').value='74';node('replacementStyle').onchange();assert.equal(node('applyReplacement').disabled,false);node('applyReplacement').onclick();assert.equal(c.buildingReplacements[key],74);assert.equal(c.buildingDesigns[key],undefined);assert.equal(back,1);node('revertReplacement').onclick();assert.equal(c.buildingReplacements[key],74,'revert is a preview until applied');assert.equal(node('revertReplacement').disabled,true);node('applyReplacement').onclick();assert.equal(c.buildingReplacements[key],undefined);
// Import directly into the replacement preview, preserving drafts until explicit apply.
const openReplacement=()=>showBuildingReplacement({city:c,renderer,dialog(){node('replacementStyle').value=String(source);},apply(){applies++;},back(){back++;}},key);
openReplacement();const importBefore=serializeCity(c),fileControl=node('replacementFile');
const importedModel={...large,name:'Imported courtyard'};
fileControl.files=[{size:100,text:async()=>exportBuildingDesign(importedModel)}];await fileControl.onchange();
assert.equal(serializeCity(c),importBefore);assert.equal(node('applyReplacement').disabled,false);assert.match(node('replacementImportStatus').textContent,/Imported courtyard imported as a draft/);
node('replacementRotate').onclick();compare.onpointerdown({button:0,pointerId:2});compare.onpointerup();assert.equal(serializeCity(c),importBefore);
fileControl.files=[{size:100,text:async()=>exportBuildingDesign(single)}];await fileControl.onchange();assert.match(node('replacementImportStatus').textContent,/3 × 2/);assert.equal(serializeCity(c),importBefore);
node('applyReplacement').onclick();assert.equal(c.buildingDesigns[key].name,'Imported courtyard','an invalid import preserves the preceding valid draft');
openReplacement();const beforeRevert=serializeCity(c);node('revertReplacement').onclick();assert.equal(node('replacementPreview').alt,'Detached homes');assert.equal(serializeCity(c),beforeRevert);node('cancelReplacement').onclick();assert.equal(serializeCity(c),beforeRevert,'canceling a revert preserves the applied custom model');
openReplacement();const appliedBefore=serializeCity(c);let releaseOld;
fileControl.files=[{size:100,text:()=>new Promise(resolve=>releaseOld=resolve)}];const oldRead=fileControl.onchange();
fileControl.files=[{size:100,text:async()=>exportBuildingDesign({...large,name:'Latest file'})}];await fileControl.onchange();releaseOld(exportBuildingDesign({...large,name:'Stale file'}));await oldRead;
assert.match(node('replacementImportStatus').textContent,/Latest file/);node('cancelReplacement').onclick();assert.equal(serializeCity(c),appliedBefore,'cancel discards imported preview');
openReplacement();let releaseCanceled;fileControl.files=[{size:100,text:()=>new Promise(resolve=>releaseCanceled=resolve)}];const canceledRead=fileControl.onchange();node('cancelReplacement').onclick();releaseCanceled(exportBuildingDesign(large));await canceledRead;assert.equal(serializeCity(c),appliedBefore);
console.log('PASS: footprint-scoped custom models and replacements, atomic mismatch rejection, portable v4 tower/block/material files, legacy 1x1 compatibility, saved libraries, physical height, rectangular painter order and actual designer handlers.');

const propCity=createCity();propCity.buildingDesigns[2]={...defaultBuildingDesign(2),blocks:Array(100).fill(1),props:[{kind:'tree',x:1,y:2,z:.26,rotation:2}]};showBuildingDesigner({city:propCity,dialog(){node('designSource').value='2';node('designFootprint').value='1x1';},apply(){},close(){}},2);node('designName').value='Preserve my props';node('designName').oninput();node('applyDesign').onclick();assert.equal(propCity.buildingDesigns[2].name,'Preserve my props');assert.equal(propCity.buildingDesigns[2].props.length,1);assert.equal(propCity.buildingDesigns[2].props[0].rotation,2);

for(const layered of [false,true]){
 const groundCity=createCity(),groundPaint='6'.repeat(50)+'7'.repeat(50),model={...defaultBuildingDesign(2),groundPaint,...(layered?{voxels:Array(100).fill(1)}:{blocks:Array(100).fill(1)})};groundCity.buildingDesigns[2]=model;
 showBuildingDesigner({city:groundCity,dialog(){node('designSource').value='2';node('designFootprint').value='1x1';},apply(){},close(){}},2);
 node('designName').value='Keep the garden';node('designName').oninput();node('designFacade').value='#112233';node('designFacade').oninput();node('applyDesign').onclick();
 assert.equal(groundCity.buildingDesigns[2].groundPaint,groundPaint,'actual designer field edits and Apply retain ground paint');
 const imported={...model,name:'Imported garden',groundPaint:'7'.repeat(100)};await node('designFile').onchange({target:{files:[{size:100,text:async()=>exportBuildingDesign(imported)}],value:'ground'}});node('applyDesign').onclick();assert.equal(groundCity.buildingDesigns[2].groundPaint,imported.groundPaint,'actual import followed by Apply retains ground paint');
}
// Exercise the composed designer handlers, including palette, ground tool and final Apply.
for(const layered of [false,true]){
 const paintedCity=createCity(),layout=Array(100).fill(0);layout[44]=1;paintedCity.buildingDesigns[2]={...defaultBuildingDesign(2),...(layered?{voxels:layout}:{blocks:layout})};
 showBuildingDesigner({city:paintedCity,dialog(){node('designSource').value='2';node('designFootprint').value='1x1';},apply(){},close(){}},2);
 const canvas=node('designPreview');Object.assign(canvas,{getBoundingClientRect:()=>({left:0,top:0,width:256,height:384}),focus(){},setPointerCapture(){}});
 node('previewTool').value='paint-ground';node('previewTool').onchange();node('materialSwatch5').onclick();
 const event={button:0,pointerId:77,clientX:128,clientY:374.8,preventDefault(){}};
 canvas.onpointerdown(event);canvas.onpointerup(event);assert.equal(paintedCity.buildingDesigns[2].groundPaint,undefined,'painting is still a draft');
 node('designName').value='Painted from controls';node('designName').oninput();node('applyDesign').onclick();assert.equal(paintedCity.buildingDesigns[2].groundPaint?.[99],'6','palette choice and composed ground handlers reach Apply');
 node('previewTool').value='sample-ground';node('previewTool').onchange();node('previewMaterial').value='0';canvas.onpointerdown(event);assert.equal(node('previewMaterial').value,'5');
 node('previewTool').value='erase-ground';node('previewTool').onchange();canvas.onpointerdown(event);canvas.onpointerup(event);node(layered?'voxelUndo':'blockUndo').onclick();node('applyDesign').onclick();assert.equal(paintedCity.buildingDesigns[2].groundPaint[99],'6','undo restores ground through the composed editor');
 const saved=validateSave(JSON.parse(serializeCity(paintedCity)));assert.equal(saved.buildingDesigns[2].groundPaint[99],'6');
}
