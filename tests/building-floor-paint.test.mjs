import assert from 'node:assert/strict';
import {paintFloorSurfaces,floorSurfaceMaterial,validateFloorPaint,splitBuildingFloors,floorPaintKey} from '../dist/building-floor-paint.js';
import {buildingBlockFaces} from '../dist/building-blocks.js';
import {projectedBuildingSurfaces,pickBuildingSurface} from '../dist/building-surface-picking.js';
import {defaultBuildingDesign,exportBuildingDesign,importBuildingDesign,validateBuildingDesign,drawBuildingDesign} from '../dist/building-designs.js';
import {createCity,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {copyBuildingSet} from '../dist/building-sets.js';
const d={...defaultBuildingDesign(),blocks:Array(100).fill(0),materials:Array(500).fill(1)};d.blocks[44]=24;
const face=(level,side=1)=>({x:4,y:4,index:44,side,from:level,to:level+1});
let paint=paintFloorSurfaces(d,[face(4)],3),painted={...d,surfacePaint:paint};
assert.equal(floorSurfaceMaterial(painted,face(4)),3);assert.equal(floorSurfaceMaterial(painted,face(3)),1);assert.equal(floorSurfaceMaterial(painted,face(4,2)),1);assert.equal(d.surfacePaint,undefined);
painted.surfacePaint=paintFloorSurfaces(painted,[face(4)],0);assert.equal(floorSurfaceMaterial(painted,face(4)),0,'original facade can explicitly override inherited brick');
for(const value of ['',[],null,'0'.repeat(11999),'0'.repeat(11999)+'6'])assert.throws(()=>validateFloorPaint(value));assert.throws(()=>paintFloorSurfaces(d,[face(24)],1));assert.throws(()=>paintFloorSurfaces(d,[face(0)],5));assert.throws(()=>validateBuildingDesign({...defaultBuildingDesign(),surfacePaint:paint}));
for(let rotation=0;rotation<4;rotation++){
 const surfaces=projectedBuildingSurfaces(painted,rotation);assert.equal(surfaces.length,49);assert.equal(new Set(surfaces.map(floorPaintKey)).size,49);
 for(const f of surfaces){const point={x:f.polygon.reduce((s,p)=>s+p[0],0)/4,y:f.polygon.reduce((s,p)=>s+p[1],0)/4},picked=pickBuildingSurface(surfaces,point);assert.equal(floorPaintKey(picked),floorPaintKey(f),'each visible floor can be independently selected');}
 const whole=buildingBlockFaces(d.blocks,rotation),split=splitBuildingFloors(whole);for(const wall of whole.filter(f=>f.side!==4)){const tiles=split.filter(f=>f.side===wall.side);assert.deepEqual(tiles[0].points[0],wall.points[0]);assert.deepEqual(tiles.at(-1).points[2],wall.points[2]);for(let i=1;i<tiles.length;i++)assert.deepEqual(tiles[i-1].points[3],tiles[i].points[0]);}
}
const maximum={...painted,name:'界'.repeat(40),footprint:{width:4,height:4},voxels:Array(100).fill(0xffffff),surfacePaint:'5'.repeat(12000)};delete maximum.blocks;
for(const design of [painted,maximum]){const file=exportBuildingDesign(design);assert.equal(JSON.parse(file).version,6);assert.ok(Buffer.byteLength(file)<32768);assert.deepEqual(importBuildingDesign(file),design);for(let version=1;version<6;version++)assert.throws(()=>importBuildingDesign(JSON.stringify({...JSON.parse(file),version})));}
assert.throws(()=>importBuildingDesign(' '.repeat(32769)),/32 KB/);
const city=createCity();city.buildingDesigns={2:painted};const restored=validateSave(JSON.parse(serializeCity(city)));assert.deepEqual(restored.buildingDesigns,city.buildingDesigns);assert.deepEqual(copyBuildingSet(restored).buildingDesigns,city.buildingDesigns);const old=JSON.parse(serializeCity(city));old.version=120;assert.throws(()=>validateSave(old),/121/);delete old.buildingDesigns[2].surfacePaint;assert.equal(validateSave(old).version,126);
// Rendering uses overrides for the selected floor, with inherited materials elsewhere.
const colors=[];const ctx={beginPath(){},closePath(){},moveTo(){},lineTo(){},fill(){colors.push(this.fillStyle);}};drawBuildingDesign(ctx,{...painted,surfacePaint:paint});assert.ok(colors.includes('#aac7cc'),'glass detail is rendered');assert.ok(colors.includes('#d0aa89'),'adjacent floors retain brick');
console.log('PASS: independently picked and rendered floor paint, explicit original facade, bounded import validation, format-six files, schema migration and full building-set retention.');
