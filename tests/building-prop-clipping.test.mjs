import assert from 'node:assert/strict';
import {clipPropGeometry} from '../dist/building-prop-clipping.js';
import {buildingPropGeometry,rasterizeBuildingProps} from '../dist/building-props.js';
const area=(faces,a=0,b=1)=>faces.reduce((sum,f)=>sum+Math.abs(f.points.reduce((s,p,i)=>{const q=f.points[(i+1)%f.points.length];return s+p[a]*q[b]-q[a]*p[b];},0))/2,0);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} differs from ${b}`);
for(const footprint of [{width:1,height:1},{width:5,height:1},{width:1,height:5}]){
 const w=footprint.width,d=footprint.height,points=[[-.12*w,-.12*d,.13],[.12*w,-.12*d,.13],[.12*w,.12*d,.13],[-.12*w,.12*d,.13]],surface=[{points,color:'#abcdef'}],design={blocks:Array(100).fill(0),footprint};design.blocks[44]=1;
 near(area(clipPropGeometry(design,surface)),.24*w*.24*d-.085*w*.085*d);
 assert.deepEqual(clipPropGeometry({...design,blocks:Array(100).fill(0)},surface),surface,'empty construction never crops a prop');
 const voxels=Array(100).fill(0);voxels[44]=1;
 for(let shape=1;shape<=4;shape++){
  const geometry='0'.repeat(44)+String(shape)+'0'.repeat(2400-45);
  near(area(clipPropGeometry({voxels,blockGeometry:geometry,footprint},surface)),.24*w*.24*d-.085*w*.085*d/2);
 }
}
const model={voxels:Array(100).fill(0)};model.voxels[44]=2;
const sheet=z=>[{color:'#ffffff',points:[[-.12,-.12,z],[.12,-.12,z],[.12,.12,z],[-.12,.12,z]]}];
assert.deepEqual(clipPropGeometry(model,sheet(.13)),sheet(.13),'a prop under an overhang retains the empty space');
near(area(clipPropGeometry(model,sheet(.33))),.24*.24-.085*.085);
model.voxels[44]=5;assert.deepEqual(clipPropGeometry(model,sheet(.33)),sheet(.33),'an independent-layer gap remains open');
assert.deepEqual(clipPropGeometry(model,sheet(.54)),sheet(.54),'a prop exactly on a roof remains on its surface');
const solid={blocks:Array(100).fill(0)};solid.blocks[44]=1;
const wall=[{color:'#ffffff',points:[[-.04,-.12,0],[-.04,.12,0],[-.04,.12,.5],[-.04,-.12,.5]]}];near(area(clipPropGeometry(solid,wall),1,2),.24*.5-.085*.26);
const prop={kind:'car',x:4,y:4,z:0,rotation:0},input=buildingPropGeometry(prop),before=JSON.stringify(input);clipPropGeometry(solid,input);assert.equal(JSON.stringify(input),before,'cropping does not mutate saved or cached model geometry');
for(let rotation=0;rotation<4;rotation++){
 const rendered=rasterizeBuildingProps({...solid,props:[prop]},rotation);assert.ok(rendered.data.every(Number.isFinite));
 const restored=rasterizeBuildingProps({...solid,blocks:Array(100).fill(0),props:[prop]},rotation);assert.ok(restored.data.filter((v,i)=>i%4===3&&v).length>0,'removing construction restores the retained prop geometry');
}
console.log('PASS: analytic cube/wedge clipping areas, every wedge direction, rectangular footprints, vertical faces, overhangs, layer gaps, exact roof contact, immutable geometry and support removal.');
