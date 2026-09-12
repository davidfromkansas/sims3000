import assert from 'node:assert/strict';
import {paintBuildingSurface,validateBuildingMaterials,exposedSurface} from '../dist/building-materials.js';
import {defaultBuildingDesign,exportBuildingDesign,importBuildingDesign,applyBuildingDesign,drawBuildingDesign} from '../dist/building-designs.js';
import {createCity,recompute,validateSave,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {baseZonedSprite} from '../dist/building-art.js';
const blocks=Array(100).fill(0);for(const i of [11,12,13,21,22,23])blocks[i]=6;blocks[14]=12;blocks[31]=6;
const painted=paintBuildingSurface(blocks,null,11,0,1,true);
assert.deepEqual(painted.map((m,i)=>m?i:-1).filter(i=>i>=0),[55,60,65],'north wall fill stays on its plane and height');
assert.ok(!exposedSurface(blocks,21,0),'internal wall cannot be painted');
assert.deepEqual(paintBuildingSurface(blocks,painted,21,0,4,true),painted);
const barrier=paintBuildingSurface(blocks,null,12,4,3),roof=paintBuildingSurface(blocks,barrier,11,4,4,true);
assert.equal(roof[12*5+4],3,'fill preserves another material');assert.equal(roof[23*5+4],4,'roof fill travels around a material barrier');assert.equal(roof[14*5+4],0,'fill does not climb to another roof');assert.equal(roof[31*5+4],4);assert.equal(barrier[11*5+4],0,'painting is immutable');
const west=paintBuildingSurface(blocks,roof,11,3,2,true);assert.equal(west[31*5+3],2);assert.equal(west[12*5+3],0);
const design={...defaultBuildingDesign(),blocks,materials:west};const file=exportBuildingDesign(design);assert.ok(file.length<8192);assert.equal(JSON.parse(file).version,3);assert.deepEqual(importBuildingDesign(file),design);
const old={...design};delete old.materials;assert.equal(JSON.parse(exportBuildingDesign(old)).version,2);assert.deepEqual(importBuildingDesign(exportBuildingDesign(old)),old);
for(const version of [1,2])assert.throws(()=>importBuildingDesign(JSON.stringify({...JSON.parse(file),version})));
assert.throws(()=>importBuildingDesign(JSON.stringify({format:'SIMS3000-building',version:3,design:old})));
for(const bad of [null,[],Array(499).fill(0),Array(500).fill(5),Array(500).fill(-1),Array(500).fill(1.1),Array(500).fill('1'),Array(500)])assert.throws(()=>validateBuildingMaterials(bad));
assert.throws(()=>exportBuildingDesign({...defaultBuildingDesign(),materials:west}));
const captured=[];for(let rotation=0;rotation<4;rotation++){const points=[],fills=[],ctx={beginPath(){},closePath(){},fill(){fills.push(this.fillStyle);},stroke(){},moveTo(x,y){points.push([x,y]);},lineTo(x,y){points.push([x,y]);}};drawBuildingDesign(ctx,design,rotation);assert.ok(points.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=256&&y>=0&&y<=384));captured.push(fills);}
assert.notDeepEqual(captured[0],captured[2],'world surface materials change visible sides with rotation');
// Exercise every material on a maximum-height building, including detail geometry.
for(let material=0;material<=4;material++)for(let rotation=0;rotation<4;rotation++){const ctx={beginPath(){},closePath(){},fill(){},stroke(){},moveTo(x,y){assert.ok(x>=0&&x<=256&&y>=0&&y<=384);},lineTo(x,y){this.moveTo(x,y);}};drawBuildingDesign(ctx,{...design,blocks:Array(100).fill(24),materials:Array(500).fill(material)},rotation);}
const city=createCity(),tile=city.tiles.find(t=>t.type==='residential');tile.level=3;tile.density=3;recompute(city);const stats=structuredClone(city.stats);applyBuildingDesign(city,baseZonedSprite(tile,city.seed),design);recompute(city);assert.deepEqual(city.stats,stats);const restored=validateSave(JSON.parse(serializeCity(city)));assert.deepEqual(restored.buildingDesigns,city.buildingDesigns);tick(city);tick(restored);assert.deepEqual(city.stats,restored.stats);
const legacy=JSON.parse(serializeCity(city));legacy.version=79;for(const d of Object.values(legacy.buildingDesigns))delete d.materials;assert.ok(Object.values(validateSave(legacy).buildingDesigns).every(d=>!d.materials));
console.log('PASS: exposed surface painting, coplanar and connected fill boundaries, immutable material edits, four-view textured geometry, building/city roundtrips, unchanged simulation, legacy migration and malformed paint rejection.');
