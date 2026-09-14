import assert from 'node:assert/strict';
import {createCity,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {REPLACEABLE_STYLES,baseZonedSprite,canReplaceBuilding,replaceBuildingStyle,zonedSprite} from '../dist/building-art.js';
import {defaultBuildingDesign,applyBuildingDesign,designForTile,validateBuildingDesign,validateBuildingDesigns,exportBuildingDesign,importBuildingDesign,drawBuildingDesign,drawDesignedBuilding} from '../dist/building-designs.js';
const c=createCity('Architecture collection',false),lots=[];
assert.equal(Object.keys(REPLACEABLE_STYLES).length,16);
for(const [source,style] of Object.entries(REPLACEABLE_STYLES).filter(([source])=>![76,77].includes(Number(source)))){
 const tile=c.tiles.find(t=>{if(lots.includes(t)||t.x<15||t.x>35||t.y<15||t.y>35)return false;return baseZonedSprite({...t,type:style.group,level:style.level,industry:Number(source)>=54?'clean':'dirty'},c.seed)===Number(source);});
 assert.ok(tile,source);Object.assign(tile,{type:style.group,level:style.level,density:style.level,industry:Number(source)>=54?'clean':'dirty',terrain:'land',elevation:0,nature:false});lots.push(tile);
}
recompute(c);const before=JSON.stringify(c.tiles),stats=structuredClone(c.stats),cash=c.funds;
for(const [i,[source,style]] of Object.entries(REPLACEABLE_STYLES).filter(([source])=>![76,77].includes(Number(source))).entries()){
 const design={...defaultBuildingDesign(Number(source)),name:style.name,roof:'flat'};applyBuildingDesign(c,source,design);assert.ok(canReplaceBuilding(lots[i]));assert.deepEqual(designForTile(c,lots[i]),design);
 assert.deepEqual(importBuildingDesign(exportBuildingDesign(design)),design);
 for(const state of [{level:0,abandonedLevel:style.level},{historicalLevel:style.level}])assert.deepEqual(designForTile(c,{...lots[i],...state}),design);
 for(const state of [{rubble:true},{radiation:10},{level:0,abandonedLevel:0,historicalLevel:0}])assert.equal(designForTile(c,{...lots[i],...state}),null);
}
assert.equal(JSON.stringify(c.tiles),before);recompute(c);assert.deepEqual(c.stats,stats);assert.equal(c.funds,cash);const restored=validateSave(JSON.parse(serializeCity(c)));assert.equal(Object.keys(restored.buildingDesigns).length,14);assert.deepEqual(restored.buildingDesigns,c.buildingDesigns);
assert.equal(designForTile(c,{...lots[0],type:'industrial',industry:'farm',farmRoot:0}),null);
for(const floors of [1,2,3])for(const roof of ['flat','step','spire'])for(let rotation=0;rotation<4;rotation++){
 const design=validateBuildingDesign({...defaultBuildingDesign(0),floors,roof}),points=[],ctx={beginPath(){},closePath(){},fill(){},stroke(){},moveTo(x,y){points.push([x,y]);},lineTo(x,y){points.push([x,y]);}};
 drawBuildingDesign(ctx,design,rotation);assert.ok(points.length>20);assert.ok(points.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=256&&y>=0&&y<=384));
}
replaceBuildingStyle(c,6,54);assert.equal(c.buildingDesigns[6],undefined);assert.equal(zonedSprite(lots.find(t=>baseZonedSprite(t,c.seed)===6),c.seed,c.buildingReplacements),54);
assert.throws(()=>replaceBuildingStyle(c,6,0));assert.throws(()=>validateBuildingDesigns({...c.buildingDesigns,unknown:defaultBuildingDesign()}));
let canvases=0;globalThis.document={createElement:()=>{canvases++;return{getContext:()=>({beginPath(){},closePath(){},fill(){},stroke(){},moveTo(){},lineTo(){}})};}};
const renderer={getCity:()=>restored,unit:24,rotation:0,project:()=>({x:0,y:0}),ctx:{save(){},restore(){},drawImage(){}}};
for(let pass=0;pass<2;pass++)for(const tile of lots)for(let rotation=0;rotation<4;rotation++){renderer.rotation=rotation;drawDesignedBuilding(renderer,tile,designForTile(restored,tile));}
assert.equal(canvases,56,'all 14 models retain four cached views without repainting on the second pass');
console.log('PASS: all 14 RCI customization slots, unchanged simulation, abandoned/historical continuity, farm/rubble exclusions, complete library save/import, low-rise four-view bounds and industrial artwork replacement.');

assert.equal(validateBuildingDesign(defaultBuildingDesign(76)).floors,2,'replacement-only bungalow has a low-rise designer default');
