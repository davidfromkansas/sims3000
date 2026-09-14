import assert from 'node:assert/strict';
import {paintBuildingSurface,materialSurfaceColor} from '../dist/building-materials.js';
import {paintFloorSurfaces,floorSurfaceMaterial} from '../dist/building-floor-paint.js';
import {defaultBuildingDesign,exportBuildingDesign,importBuildingDesign,drawBuildingDesign} from '../dist/building-designs.js';
import {createCity,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const base={...defaultBuildingDesign(),blocks:Array(100).fill(2)},face={index:44,x:4,y:4,side:4,from:1,to:2};
for(const material of [5,6]){
 const design={...base,materials:paintBuildingSurface(base.blocks,null,44,4,material,true)};
 assert.equal(design.materials.filter(v=>v===material).length,100,'connected roof fill reaches the whole level');
 design.surfacePaint=paintFloorSurfaces(design,[face],material===5?6:5);
 assert.equal(floorSurfaceMaterial(design,face),material===5?6:5);
 assert.match(materialSurfaceColor(material,design),/^#[a-f0-9]{6}$/);
 for(const withProps of [false,true]){
  const d={...design,...(withProps?{props:[{kind:'tree',x:4,y:4,z:.4,rotation:0}]}:{})},file=JSON.parse(exportBuildingDesign(d));
  assert.equal(file.version,11);assert.deepEqual(importBuildingDesign(JSON.stringify(file)),d);
  for(const version of [3,6,9,10])assert.throws(()=>importBuildingDesign(JSON.stringify({...file,version})));
 }
 const city=createCity();city.buildingDesigns[2]=design;const saved=JSON.parse(serializeCity(city));assert.equal(saved.version,151);assert.deepEqual(validateSave(saved).buildingDesigns[2],design);
 saved.version=149;assert.throws(()=>validateSave(saved),/150/);
 // Both storage forms independently require the new version.
 delete saved.buildingDesigns[2].surfacePaint;assert.throws(()=>validateSave(saved),/150/);
 saved.buildingDesigns[2]={...base,surfacePaint:design.surfacePaint};assert.throws(()=>validateSave(saved),/150/);
}
const old=JSON.parse(serializeCity(createCity()));old.version=149;assert.equal(validateSave(old).version,151);
assert.equal(JSON.parse(exportBuildingDesign(base)).version,2,'old palette exports keep compatible versions');
console.log('PASS: grass/asphalt roof fill, independent floor overrides, portable format 11 with optional props, downgrade rejection and city-save migration.');

for(const material of [5,6])for(const layered of [false,true])for(let rotation=0;rotation<4;rotation++){
 const d={...defaultBuildingDesign(),materials:Array(500).fill(material),...(layered?{voxels:Array(100).fill(7)}:{blocks:Array(100).fill(3)})},colors=[];
 const ctx={beginPath(){},closePath(){},moveTo(){},lineTo(){},stroke(){},fill(){colors.push(this.fillStyle);}};
 drawBuildingDesign(ctx,d,rotation);assert.ok(colors.length>0);assert.ok(!colors.includes(d.windows)&&!colors.includes(d.accent),'landscape materials have no automatic facade windows');
}
// Texture geometry must be deterministic and stay within its face, without a visible row grid.
const {drawMaterialDetail}=await import('../dist/building-materials.js');
for(const material of [5,6]){
 const face={x:3,y:6,side:4,from:1,to:2,points:[[0,0,0],[1,0,0],[1,1,0],[0,1,0]]},capture=()=>{const polygons=[];drawMaterialDetail(face,material,base,(points,color)=>polygons.push({points,color}));return polygons;};
 const a=capture();assert.deepEqual(a,capture());assert.equal(a.length,12);assert.ok(a.flatMap(p=>p.points).every(p=>p[0]>=0&&p[0]<=1&&p[1]>=0&&p[1]<=1));assert.equal(new Set(a.map(p=>p.points[0][1])).size,a.length,'individual marks are staggered rather than aligned in rigid rows');
}
