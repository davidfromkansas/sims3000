import assert from 'node:assert/strict';
import {buildingPropPickFaces,pickBuildingProp} from '../dist/building-prop-picking.js';
const candidates=faces=>faces.flatMap(f=>f.points.slice(2).map((_,i)=>{const p=[f.points[0],f.points[i+1],f.points[i+2]];return{x:p.reduce((s,q)=>s+q[0],0)/3,y:p.reduce((s,q)=>s+q[1],0)/3};}));
for(const footprint of [{width:1,height:1},{width:1,height:5},{width:5,height:1}])for(let view=0;view<4;view++){
 const prop={kind:'car',x:4,y:4,z:0,rotation:1},design={blocks:Array(100).fill(0),footprint,props:[prop]},faces=buildingPropPickFaces(design,view),point=candidates(faces).find(p=>pickBuildingProp(faces,p)===0);assert.ok(point,'a visible prop is selectable in every direction and lot aspect');
 assert.equal(pickBuildingProp(faces,{x:point.x*2.3+21,y:point.y*2.3-13},{zoom:2.3,x:21,y:-13}),0);
 assert.equal(pickBuildingProp(faces,{x:0,y:0}),null);assert.equal(pickBuildingProp(faces,point,{zoom:0,x:0,y:0}),null);
 const overlapped=buildingPropPickFaces({...design,props:[prop,{...prop}]},view);assert.equal(pickBuildingProp(overlapped,point),1,'topmost equal-depth prop is selected consistently with rendering');
 const hidden=buildingPropPickFaces({...design,blocks:Array(100).fill(24)},view);assert.ok(candidates(hidden).every(p=>pickBuildingProp(hidden,p)===null),'construction fully enclosing a prop cannot be erased as a prop');
}
const wall={blocks:Array(100).fill(0),props:[{kind:'tree',x:4,y:4,z:0,rotation:0}]};for(let x=0;x<10;x++)wall.blocks[50+x]=24;
const front=buildingPropPickFaces(wall,0),back=buildingPropPickFaces(wall,2);assert.ok(candidates(front).every(p=>pickBuildingProp(front,p)===null),'wall hides the prop from the front camera');assert.ok(candidates(back).some(p=>pickBuildingProp(back,p)===0),'camera behind the wall reveals the same prop');
console.log('PASS: visible-surface prop selection, frontmost overlap, camera zoom/pan, rectangular lots, all directions, construction clipping and wall occlusion.');
