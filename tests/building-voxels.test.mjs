import assert from 'node:assert/strict';
import {validateBuildingVoxels,blocksToVoxels,voxelOccupied,voxelLayer,paintVoxelShape,voxelStatistics,buildingVoxelFaces,drawBuildingVoxels} from '../dist/building-voxels.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
const empty=Array(100).fill(0);let model=paintVoxelShape(empty,0,'line',11,11);model=paintVoxelShape(model,1,'line',11,11);model=paintVoxelShape(model,2,'line',11,13);
assert.equal(voxelOccupied(model,12,0),false);assert.equal(voxelOccupied(model,12,2),true,'beam can occupy a high layer over open ground');assert.deepEqual(voxelStatistics(model),{count:5,height:3,columns:3});assert.equal(voxelLayer(model,2).filter(Boolean).length,3);assert.ok(empty.every(v=>v===0));
const gap=paintVoxelShape(model,1,'line',11,11,false);assert.equal(voxelOccupied(gap,11,0),true);assert.equal(voxelOccupied(gap,11,1),false);assert.equal(voxelOccupied(gap,11,2),true,'erasing one layer preserves blocks above and below');
const restored=validateBuildingVoxels(JSON.parse(JSON.stringify(gap)));assert.deepEqual(restored,gap);assert.notEqual(restored,gap);
const heights=Array.from({length:100},(_,i)=>i%25),converted=blocksToVoxels(heights);for(let i=0;i<100;i++)for(let z=0;z<24;z++)assert.equal(voxelOccupied(converted,i,z),z<heights[i]);assert.equal(converted[24],0xffffff);
for(const invalid of [null,[],Array(99).fill(1),Array(100).fill(0),Array(100).fill(-1),Array(100).fill(0x1000000),Array(100).fill(1.1),Array(100).fill('1'),Object.assign(Array(100),{0:1})])assert.throws(()=>validateBuildingVoxels(invalid));for(const z of [-1,24,1.5]){assert.throws(()=>voxelLayer(model,z));assert.throws(()=>paintVoxelShape(model,z,'plane',0,1));}
for(let rotation=0;rotation<4;rotation++){
 const faces=buildingVoxelFaces(gap,rotation);assert.ok(faces.some(f=>f.x===1&&f.y===1&&f.side===4&&f.to===1),'gap reveals lower roof');assert.ok(faces.some(f=>f.x===2&&f.y===1&&f.side!==4&&f.from===2),'beam walls exist only at occupied height');assert.ok(!faces.some(f=>f.x===2&&f.y===1&&f.side!==4&&f.from<2),'no invented supporting wall');
 const a=paintVoxelShape(empty,0,'line',11,12),pair=buildingVoxelFaces(a,rotation);assert.equal(pair.filter(f=>f.side!==4).length,3,'shared cube face is culled');
 for(const footprint of [{width:1,height:1},{width:4,height:1},{width:1,height:4},{width:4,height:4}]){const points=[],ctx={beginPath(){},closePath(){},fill(){},moveTo(x,y){points.push([x,y]);},lineTo(x,y){points.push([x,y]);}};drawBuildingVoxels(ctx,{...defaultBuildingDesign(),footprint,voxels:converted},rotation);assert.ok(points.length>0);assert.ok(points.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=256&&y>=0&&y<=384),'layered designs fit existing sprite cache bounds');}
}
console.log('PASS: independent layer occupancy, supported beam and gaps, immutable conversion/painting, strict compact masks, exposed/internal faces, all four rotations and all footprint bounds.');
