import assert from 'node:assert/strict';
import {defaultBuildingDesign,drawBuildingDesign,exportBuildingDesign,importBuildingDesign} from '../dist/building-designs.js';
import {buildingBlockFaces} from '../dist/building-blocks.js';
import {buildingVoxelFaces} from '../dist/building-voxels.js';
import {anchoredDecal,decalPolygonsOnFace} from '../dist/building-decals.js';
import {projectBuildingPoint} from '../dist/building-footprints.js';
import {pointInBuildingSurface} from '../dist/building-surface-picking.js';
let checked=0;
for(const method of ['blocks','voxels'])for(let rotation=0;rotation<4;rotation++){
 const d={...defaultBuildingDesign(),rotation,[method]:Array(100).fill(0),accent:'#ab12cd'};d[method][44]=method==='blocks'?4:15;
 const faces=method==='blocks'?buildingBlockFaces(d.blocks,rotation):buildingVoxelFaces(d.voxels,rotation),face=faces.find(f=>f.side!==4);
 d.decals=[anchoredDecal(face,5,1,.14)];
 const pieces=decalPolygonsOnFace(face,d.decals,d),stripe=pieces.find(p=>p.color===d.accent),points=stripe.points.map(p=>projectBuildingPoint(p,rotation));
 const sample=points.reduce((p,[x,y])=>({x:p.x+x/points.length,y:p.y+y/points.length}),{x:0,y:0});
 for(let material=0;material<7;material++){
  const painted={...d,materials:Array(500).fill(material),surfacePaint:String(material+1).repeat(12000)},draws=[];let path=[];
  const ctx={beginPath(){path=[];},moveTo(x,y){path.push([x,y]);},lineTo(x,y){path.push([x,y]);},closePath(){},fill(){draws.push({points:path,color:this.fillStyle});},stroke(){}};
  drawBuildingDesign(ctx,painted,rotation);
  const visible=draws.filter(p=>pointInBuildingSurface(sample,p.points)).at(-1);
  assert.equal(visible?.color,d.accent,`${method}, view ${rotation}, material ${material}: paint must remain below cornice`);
  assert.deepEqual(importBuildingDesign(exportBuildingDesign(painted)).decals,d.decals);checked++;
 }
}
console.log(`PASS: ${checked} actual renderer cases preserve cornice over later wall paints across block/layer models, seven materials, four rotations and portable saves.`);
