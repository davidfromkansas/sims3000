import assert from 'node:assert/strict';
import {paintVoxelCells,voxelPlanePoint} from '../dist/building-edit-planes.js';
import {buildingPlaneGuide} from '../dist/building-plane-guide.js';
const path=[11,12,13,14,15,25,35],empty=Array(100).fill(0);
for(const plane of ['horizontal','xz','yz'])for(const slice of [0,4,9]){
 const voxels=paintVoxelCells(empty,plane,slice,path);for(const i of path){const {x,y,z}=voxelPlanePoint(plane,slice,i);assert.ok(voxels[y*10+x]&(1<<z));}assert.deepEqual(paintVoxelCells(voxels,plane,slice,path,false),empty);const guide=buildingPlaneGuide({plane,slice,pending:{kind:'line',start:11,end:35,cells:path}});assert.equal(guide.length,8,'model guide displays the bent path, not a straight line');assert.deepEqual(empty,Array(100).fill(0));
}
assert.throws(()=>paintVoxelCells(empty,'horizontal',24,path));assert.throws(()=>paintVoxelCells(empty,'xz',0,[240]));
console.log('PASS: freehand cell placement/erasure on all three edit planes, unchanged source geometry and exact bent-path model guides.');
