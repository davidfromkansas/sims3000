import assert from 'node:assert/strict';
import {BUILDING_EDIT_PLANES,voxelPlanePoint,voxelPlaneCells,paintVoxelPlane} from '../dist/building-edit-planes.js';
import {voxelStatistics} from '../dist/building-voxels.js';
import {buildingShapeCells} from '../dist/building-shapes.js';
const empty=Array(100).fill(0);
assert.deepEqual(voxelPlanePoint('horizontal',5,23),{x:3,y:2,z:5});assert.deepEqual(voxelPlanePoint('xz',5,23),{x:3,y:5,z:21});assert.deepEqual(voxelPlanePoint('yz',5,239),{x:5,y:9,z:0});
for(const [plane,p]of Object.entries(BUILDING_EDIT_PLANES)){const coordinates=new Set();let full=[...empty];for(let slice=0;slice<p.slices;slice++){for(let i=0;i<p.rows*10;i++){const point=voxelPlanePoint(plane,slice,i);coordinates.add(`${point.x},${point.y},${point.z}`);}full=paintVoxelPlane(full,plane,slice,'plane',0,p.rows*10-1);}assert.equal(coordinates.size,2400,'each plane family covers the entire volume exactly once');assert.ok(full.every(mask=>mask===0xffffff));assert.deepEqual(voxelStatistics(full),{count:2400,height:24,columns:100});for(let slice=0;slice<p.slices;slice++)assert.ok(voxelPlaneCells(full,plane,slice).every(c=>c.occupied));}
const wall=paintVoxelPlane(empty,'xz',4,'plane',180,135);assert.equal(voxelStatistics(wall).count,36);for(let i=0;i<100;i++){for(let z=0;z<24;z++)assert.equal(!!(wall[i]&(1<<z)),Math.floor(i/10)===4&&i%10<=5&&z>=5&&z<=10);}
const cut=paintVoxelPlane(wall,'yz',2,'plane',134,184,false);assert.equal(voxelStatistics(cut).count,30,'perpendicular cut removes just the crossing column');assert.equal(voxelStatistics(wall).count,36,'editing is immutable');
for(const kind of ['line','plane'])for(const [start,end]of [[0,239],[239,0],[230,9],[5,235],[239,239]]){const cells=buildingShapeCells(kind,start,end,24);assert.ok(cells.includes(start)&&cells.includes(end));assert.ok(cells.every(i=>i>=0&&i<240));}
for(const args of [['xz',10,0],['yz',0,240],['bad',0,0],['horizontal',24,0]])assert.throws(()=>voxelPlanePoint(...args));assert.throws(()=>buildingShapeCells('line',0,1,25));assert.throws(()=>paintVoxelPlane(empty,'xz',0,'plane',0,240));
console.log('PASS: three edit-plane orientations, exact 2,400-block volume coverage, vertical walls and perpendicular cuts, top-down height coordinates, extended line/plane bounds and invalid slice rejection.');
