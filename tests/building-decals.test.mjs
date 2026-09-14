import assert from 'node:assert/strict';
import {validateBuildingDecals,anchoredDecal,projectedWallAnchor,wallCoordinates,wallWorldPoint,decalPolygonsOnFace} from '../dist/building-decals.js';
import {buildingBlockFaces} from '../dist/building-blocks.js';
import {buildingVoxelFaces} from '../dist/building-voxels.js';
import {defaultBuildingDesign,exportBuildingDesign,importBuildingDesign,drawBuildingDesign} from '../dist/building-designs.js';
import {projectBuildingPoint} from '../dist/building-footprints.js';
import {createCity,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const d={...defaultBuildingDesign(),blocks:Array(100).fill(0)};for(const i of [44,45,47])d.blocks[i]=4;
for(let rotation=0;rotation<4;rotation++)for(const face of buildingBlockFaces(d.blocks,rotation).filter(f=>f.side!==4)){
 const decal=anchoredDecal(face,1,3,.5);assert.ok(decal.u>=0);for(const p of face.points){const back=wallWorldPoint(face.side,decal.plane,wallCoordinates(face.side,p));assert.ok(back.every((v,i)=>Math.abs(v-p[i])<1e-8));}
 const lower=wallWorldPoint(decal.side,decal.plane,[decal.u,decal.z]),right=wallWorldPoint(decal.side,decal.plane,[decal.u+1,decal.z]);assert.ok(projectBuildingPoint(lower,rotation)[0]<projectBuildingPoint(right,rotation)[0],'anchor grows rightward from the visible lower-left wall point');
}
const front=buildingBlockFaces(d.blocks,0).find(f=>f.side===2&&f.x===4);d.decals=[anchoredDecal(front,1,4,.6)];
const pieces=buildingBlockFaces(d.blocks,0).flatMap(f=>decalPolygonsOnFace(f,d.decals,d));assert.ok(pieces.length);for(const p of pieces)for(const [x,y,z] of p.points){assert.ok(Math.abs(y)<1e-8);assert.ok(x<.085+1e-8||x>.17-1e-8,'gap remains clear');assert.ok(z>=0&&z<=.68+1e-8);}
for(const bad of [null,[{...d.decals[0],u:NaN}],[{...d.decals[0],side:4}],[{...d.decals[0],width:.001}],Array(33).fill(d.decals[0])])assert.throws(()=>validateBuildingDecals(bad));
const file=JSON.parse(exportBuildingDesign(d));assert.equal(file.version,13);assert.deepEqual(importBuildingDesign(JSON.stringify(file)),d);file.version=12;assert.throws(()=>importBuildingDesign(JSON.stringify(file)));
const city=createCity();city.buildingDesigns[2]=d;const save=JSON.parse(serializeCity(city));assert.equal(save.version,158);assert.deepEqual(validateSave(save).buildingDesigns[2],d);save.version=151;assert.throws(()=>validateSave(save),/152/);delete save.buildingDesigns[2].decals;assert.equal(validateSave(save).version,158);
for(let rotation=0;rotation<4;rotation++){const ctx={beginPath(){},closePath(){},fill(){},stroke(){},moveTo(x,y){assert.ok(Number.isFinite(x)&&Number.isFinite(y));},lineTo(x,y){this.moveTo(x,y);}};drawBuildingDesign(ctx,d,rotation);}
const layered={...defaultBuildingDesign(),voxels:Array(100).fill(0),blockGeometry:'0'.repeat(2400)};layered.voxels[44]=1;const geometry=layered.blockGeometry.split('');geometry[44]='1';layered.blockGeometry=geometry.join('');
for(let rotation=0;rotation<4;rotation++)for(const face of buildingVoxelFaces(layered.voxels,rotation,undefined,layered.blockGeometry).filter(f=>f.side!==4)){
 const decal=anchoredDecal(face,5,3,.5);const boundary=face.points.map(p=>wallCoordinates(face.side,p));for(const p of decalPolygonsOnFace(face,[decal],layered))for(const point of p.points){const [u,z]=wallCoordinates(face.side,point);assert.ok(u>=Math.min(...boundary.map(p=>p[0]))-1e-8&&u<=Math.max(...boundary.map(p=>p[0]))+1e-8);assert.ok(z>=-1e-8&&z<=.26+1e-8);}
}
console.log('PASS: anchored wall coordinates, rightward lower-left orientation, wide-detail gap clipping, bounded records, four-view rendering, portable format 13 and city schema 152.');
const maximum={...defaultBuildingDesign(),footprint:{width:5,height:5},voxels:Array(100).fill(0xffffff),materials:Array(500).fill(6),surfacePaint:'7'.repeat(12000),surfaceDetails:'11110'.repeat(2400),props:Array.from({length:64},(_,i)=>({kind:'tree',x:i%10,y:Math.floor(i/10),z:3.4800009999999997,rotation:i%4})),blockGeometry:'0'.repeat(2400),groundPaint:'7'.repeat(100),decals:Array.from({length:32},(_,i)=>({kind:5,side:i%4,plane:10,u:9.999,z:3.479,width:9.999,height:3.479}))};const fullFile=exportBuildingDesign(maximum);assert.ok(fullFile.length<32768,`${fullFile.length} character maximum model`);assert.deepEqual(importBuildingDesign(fullFile),maximum);

// A known fractional wall coordinate must roundtrip through every lot and camera rotation.
for(let width=1;width<=5;width++)for(let height=1;height<=5;height++)for(let rotation=0;rotation<4;rotation++){
 const design={...d,footprint:{width,height},rotation};
 for(const face of buildingBlockFaces(d.blocks,rotation).filter(f=>f.side!==4)){
  const base=anchoredDecal(face,1),anchor={u:base.u+.371,z:base.z+.043};
  const [x,y]=projectBuildingPoint(wallWorldPoint(face.side,base.plane,[anchor.u,anchor.z]),rotation,design.footprint);
  assert.deepEqual(projectedWallAnchor(face,{x,y},design),anchor);
 }
}
const fractional={...d,decals:[{...d.decals[0],u:3.371,z:.183}]};assert.deepEqual(importBuildingDesign(exportBuildingDesign(fractional)),fractional);
console.log('PASS: fractional wall anchors invert exactly across all 25 footprints and four rotations and survive portable transfer.');
