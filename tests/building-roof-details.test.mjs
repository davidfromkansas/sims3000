import assert from 'node:assert/strict';
import {roofCoordinates,roofPlane,roofWorldPoint,validateRoofDetails,projectedRoofAnchor,anchoredRoofDetail,roofDetailPolygonsOnFace} from '../dist/building-roof-details.js';
import {buildingBlockFaces} from '../dist/building-blocks.js';
import {buildingVoxelFaces} from '../dist/building-voxels.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
import {projectBuildingPoint} from '../dist/building-footprints.js';
import {pointInBuildingSurface} from '../dist/building-surface-picking.js';
const design={...defaultBuildingDesign(),blocks:Array(100).fill(0)};for(const i of [44,45,47])design.blocks[i]=4;
const roof=buildingBlockFaces(design.blocks,0).find(f=>f.side===4&&f.x===4),detail=anchoredRoofDetail(roof,1,4,1,{u:4.127,v:4.153});
let pieces=0;
for(const face of buildingBlockFaces(design.blocks,0))for(const polygon of roofDetailPolygonsOnFace(face,[detail],design)){
 pieces++;assert.equal(polygon.owner,0);
 for(const p of polygon.points){const [u,v]=roofCoordinates(p);assert.ok(pointInBuildingSurface({x:u,y:v},face.points.map(roofCoordinates)));assert.ok(u<=6+1e-8||u>=7-1e-8,'the missing roof tile remains clear');}
}
assert.ok(pieces>0);
const elevated={...roof,points:roof.points.map(([x,y,z])=>[x,y,z+.14])};assert.deepEqual(roofDetailPolygonsOnFace(elevated,[detail],design),[],'a detail must not bleed onto another roof height');
let cases=0;
for(let shape=0;shape<=4;shape++){
 const voxels=Array(100).fill(0);voxels[44]=1;const blockGeometry=Array(2400).fill('0');blockGeometry[44]=String(shape);
 for(let rotation=0;rotation<4;rotation++)for(const footprint of [{width:1,height:1},{width:1,height:5},{width:5,height:1}]){
  const d={...design,rotation,footprint},faces=buildingVoxelFaces(voxels,rotation,undefined,blockGeometry.join('')).filter(f=>f.side===4);
  for(const face of faces){
   const plane=roofPlane(face);assert.ok(plane,'every constructed flat or wedge roof is planar');
   const center=face.points.reduce((a,p)=>a.map((n,i)=>n+p[i]/face.points.length),[0,0,0]),[u,v]=roofCoordinates(center),[x,y]=projectBuildingPoint(center,rotation,footprint),anchor=projectedRoofAnchor(face,{x,y},d);
   assert.equal(anchor.u,Math.round(u*1000)/1000);assert.equal(anchor.v,Math.round(v*1000)/1000);
   const decal=anchoredRoofDetail(face,3,2,2,anchor),polygons=roofDetailPolygonsOnFace(face,[decal],d);assert.ok(polygons.length);
   for(const polygon of polygons)for(const point of polygon.points){const uv=roofCoordinates(point),back=roofWorldPoint(plane,uv);assert.ok(back.every((n,i)=>Math.abs(n-point[i])<1e-8));assert.ok(pointInBuildingSurface({x:uv[0],y:uv[1]},face.points.map(roofCoordinates)));}
   cases++;
  }
 }
}
const validated=validateRoofDetails([detail]);validated[0].plane[2]=0;assert.notDeepEqual(validated[0].plane,detail.plane,'validation copies the plane');
for(const bad of [null,Array(33).fill(detail),[{...detail,kind:2}],[{...detail,plane:[0,NaN,0]}],[{...detail,plane:Array(3)}],[{...detail,u:11}],[{...detail,depth:0}],[{...detail,plane:[0,0,4]}]])assert.throws(()=>validateRoofDetails(bad));
console.log(`PASS: roof-detail plane isolation, cross-tile gap clipping, immutable bounded records and ${cases} flat/sloped roof projection and clipping cases across rotated rectangular footprints.`);

const {exportBuildingDesign,importBuildingDesign,validateBuildingDesign,drawBuildingDesign}=await import('../dist/building-designs.js');
const {createCity,validateSave}=await import('../dist/engine.js');const {serializeCity}=await import('../dist/save.js');
const decorated={...design,roofDetails:[detail]},portable=exportBuildingDesign(decorated);assert.equal(JSON.parse(portable).version,15);assert.deepEqual(importBuildingDesign(portable),decorated);
for(const version of [12,13,14])assert.throws(()=>importBuildingDesign(JSON.stringify({...JSON.parse(portable),version})));
assert.throws(()=>validateBuildingDesign({...decorated,decals:Array(32).fill({kind:1,side:2,plane:5,u:0,z:0,width:1,height:.14})}),/combined/);
const city=createCity();city.buildingDesigns[2]=decorated;const saved=JSON.parse(serializeCity(city));assert.equal(saved.version,158);assert.deepEqual(validateSave(saved).buildingDesigns[2],decorated);saved.version=155;assert.throws(()=>validateSave(saved),/156/);delete saved.buildingDesigns[2].roofDetails;assert.equal(validateSave(saved).version,158);
for(let rotation=0;rotation<4;rotation++){
 const render=d=>{const commands=[];drawBuildingDesign({beginPath(){},closePath(){},stroke(){},moveTo(x,y){commands.push([x,y]);},lineTo(x,y){commands.push([x,y]);},fill(){commands.push(this.fillStyle);}},d,rotation);return commands;};
 const plain=render(design),roof=render(decorated);assert.ok(roof.length>plain.length);assert.ok(roof.flat().filter(n=>typeof n==='number').every(Number.isFinite));
}
console.log('PASS: integrated roof-detail rendering, portable format 15, city schema 156, prior-save migration, downgrade rejection and combined wall/roof placement limit.');
const maximum={...defaultBuildingDesign(),name:'城'.repeat(40),footprint:{width:5,height:5},voxels:Array(100).fill(0xffffff),paintColors:Array(28).fill('#abcdef'),materials:Array(500).fill(34),surfacePaint:'z'.repeat(12000),surfaceDetails:'11110'.repeat(2400),props:Array.from({length:64},(_,i)=>({kind:'tree',x:i%10,y:Math.floor(i/10),z:3.4800009999999997,rotation:i%4})),blockGeometry:'0'.repeat(2400),groundPaint:'z'.repeat(100),roofDetails:Array.from({length:32},()=>({kind:3,u:9.999,v:9.999,width:9.999,depth:9.999,plane:[-9.999,9.999,3.48]}))};
const largest=exportBuildingDesign(maximum);assert.ok(Buffer.byteLength(largest)<=32768,`${Buffer.byteLength(largest)} bytes`);assert.deepEqual(importBuildingDesign(largest),maximum);
console.log(`PASS: maximum roof-detail/paint/prop combination fits the portable building limit at ${Buffer.byteLength(largest)} bytes.`);

const {encodeRoofDetails,decodeRoofDetails}=await import('../dist/building-roof-details.js');assert.deepEqual(decodeRoofDetails(encodeRoofDetails(maximum.roofDetails)),maximum.roofDetails);
for(const invalid of [null,[[]],['!'.repeat(24)],['AAAA'],Array(33).fill(encodeRoofDetails([detail])[0])])assert.throws(()=>decodeRoofDetails(invalid));
const {encodeCustomBuildingLibrary,decodeCustomBuildingLibrary}=await import('../dist/custom-building-library.js');
const {copyBuildingSet,applyBuildingSet}=await import('../dist/building-sets.js');
assert.deepEqual(decodeCustomBuildingLibrary(encodeCustomBuildingLibrary([decorated,maximum])),[decorated,maximum]);
const target=createCity(),set=copyBuildingSet(city);applyBuildingSet(target,set);assert.deepEqual(target.buildingDesigns[2],decorated);
target.buildingDesigns[2].roofDetails[0].plane[2]=1;assert.equal(city.buildingDesigns[2].roofDetails[0].plane[2],.68);assert.equal(set.buildingDesigns[2].roofDetails[0].plane[2],.68);
const before=serializeCity(target),invalid=structuredClone(set);invalid.buildingDesigns[2].roofDetails[0].plane=[null,0,0];assert.throws(()=>applyBuildingSet(target,invalid));assert.equal(serializeCity(target),before);
console.log('PASS: roof-detail custom-library and city-building-set transfers, independent plane records and atomic invalid-plane rejection.');
