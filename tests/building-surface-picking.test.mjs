import assert from 'node:assert/strict';
import {projectedBuildingSurfaces,pickBuildingSurface,paintPickedSurfaces,samplePickedSurface,pointInBuildingSurface} from '../dist/building-surface-picking.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
import {blocksToVoxels} from '../dist/building-voxels.js';
const blocks=Array(100).fill(0);blocks[44]=8;blocks[45]=3;blocks[54]=16;
for(const footprint of [{width:1,height:1},{width:4,height:2},{width:2,height:4}])for(const rotation of [0,1,2,3])for(const model of [{blocks},{voxels:blocksToVoxels(blocks).map((v,i)=>i===54?v&~0x3f:v)}]){
 const design={...defaultBuildingDesign(2),footprint,...model},faces=projectedBuildingSurfaces(design,rotation);assert.ok(faces.length);
 for(const face of faces){const center={x:face.polygon.reduce((s,p)=>s+p[0],0)/4,y:face.polygon.reduce((s,p)=>s+p[1],0)/4};const expected=[...faces].reverse().find(candidate=>pointInBuildingSurface(center,candidate.polygon));for(const camera of [{zoom:1,x:0,y:0},{zoom:4,x:-250,y:110},{zoom:.5,x:10,y:-100}]){const picked=pickBuildingSurface(faces,{x:center.x*camera.zoom+camera.x,y:center.y*camera.zoom+camera.y},camera);assert.equal(picked,expected,'frontmost rendered face wins through camera transforms');}}
 assert.equal(pickBuildingSurface(faces,{x:-10000,y:-10000}),null);
}
const faces=projectedBuildingSurfaces({...defaultBuildingDesign(2),blocks}),picked=faces.at(-1),materials=Array(500).fill(0),painted=paintPickedSurfaces(materials,[picked],2);assert.equal(samplePickedSurface(painted,picked),2);assert.equal(materials.every(v=>v===0),true);assert.equal(painted.filter(v=>v===2).length,1);assert.equal(samplePickedSurface(undefined,picked),0);assert.throws(()=>paintPickedSurfaces(materials,[{index:100,side:0}],1));assert.throws(()=>paintPickedSurfaces(materials,[picked],35));assert.deepEqual(projectedBuildingSurfaces(defaultBuildingDesign(2)),[],'parameter towers require conversion before face painting');assert.equal(pickBuildingSurface(faces,{x:0,y:0},{zoom:0,x:0,y:0}),null);
console.log('PASS: visible model surface picking across rotations, footprints and cameras, overhangs, material application and read-only eyedropper sampling.');
