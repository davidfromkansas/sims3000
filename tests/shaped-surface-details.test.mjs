import assert from 'node:assert/strict';
import {wallDecorationFrame,clipWallDecoration} from '../dist/building-face-clipping.js';
import {buildingVoxelFaces} from '../dist/building-voxels.js';
import {setBlockGeometry} from '../dist/building-block-geometry.js';
import {defaultBuildingDesign,exportBuildingDesign,importBuildingDesign,drawBuildingDesign} from '../dist/building-designs.js';
import {detailFitsSurface,placeSurfaceDetails,drawBuildingSurfaceDetail} from '../dist/building-surface-details.js';
import {drawMaterialDetail} from '../dist/building-materials.js';
const voxels=Array(100).fill(0);voxels[44]=1;let clippedPolygons=0,triangles=0;
for(let shape=1;shape<=4;shape++)for(let rotation=0;rotation<4;rotation++){
 const d={...defaultBuildingDesign(),voxels,blockGeometry:setBlockGeometry(undefined,[{x:4,y:4,z:0}],shape,voxels)};
 for(const face of buildingVoxelFaces(voxels,rotation,undefined,d.blockGeometry)){
  if(face.side===4){assert.equal(detailFitsSurface(1,face),false);assert.equal(detailFitsSurface(3,face),true);continue;}
  if(face.points[2][2]!==face.points[3][2])triangles++;
  const a=face.points[0],b=face.points[1],dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy,check=points=>{const result=clipWallDecoration(face,points);for(const p of result){const u=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/len,top=face.points[3][2]+u*(face.points[2][2]-face.points[3][2]);assert.ok(u>=-1e-8&&u<=1+1e-8);assert.ok(p[2]>=a[2]-1e-8&&p[2]<=top+1e-8);}if(result.length)clippedPolygons++;};
  for(let detail=1;detail<=4;detail++){assert.equal(detailFitsSurface(detail,face),true);drawBuildingSurfaceDetail(wallDecorationFrame(face),detail,d,check);}
  for(let material=1;material<=4;material++)drawMaterialDetail(wallDecorationFrame(face),material,d,check);
  d.surfaceDetails=placeSurfaceDetails(d,[face],4);assert.equal(importBuildingDesign(exportBuildingDesign(d)).surfaceDetails,d.surfaceDetails);
 }
 let draws=0;const ctx={beginPath(){},moveTo(...p){assert.ok(p.every(Number.isFinite));},lineTo(...p){assert.ok(p.every(Number.isFinite));},closePath(){},fill(){draws++;}};drawBuildingDesign(ctx,d,rotation);assert.ok(draws>3);
}
assert.ok(triangles>0);assert.ok(clippedPolygons>100);const face={shape:1,side:1,to:1,points:[[0,0,0],[1,0,0],[1,0,1],[0,0,0]]};assert.deepEqual(clipWallDecoration(face,[[0,0,.8],[.1,0,.8],[.1,0,.9],[0,0,.9]]),[]);const full={...face,shape:0},points=[[0,0,0],[1,0,0],[1,0,1]];assert.equal(clipWallDecoration(full,points),points);
console.log('PASS: materials and all four wall details clip within wedge boundaries in every orientation/view, roof restrictions remain, hidden stamps disappear, full walls stay unchanged, rendering and portable details work.');
