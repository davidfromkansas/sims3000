import assert from 'node:assert/strict';
import {rasterizeBuildingProps} from '../dist/building-props.js';
const prop={kind:'car',x:4,y:4,z:0,rotation:1},design={blocks:Array(100).fill(0),props:[prop]},before=JSON.stringify(design);
for(let view=0;view<4;view++){
 const base=rasterizeBuildingProps(design,view),tint=rasterizeBuildingProps(design,view,[0]);let count=0;
 for(let i=0;i<base.data.length;i+=4){assert.equal(tint.data[i+3],base.data[i+3]);if(tint.data[i+3]){count++;assert.ok(tint.data[i+2]>tint.data[i+1]&&tint.data[i+1]>tint.data[i],'highlight is blue while retaining model shading');}}
 assert.ok(count>0);
 const overlap={...design,props:[prop,{...prop}]},hidden=rasterizeBuildingProps(overlap,view,[0]),visible=rasterizeBuildingProps(overlap,view,[1]);
 assert.ok(hidden.data.every(v=>v===0),'a later overlapping prop hides the selected prop even at equal depth');assert.deepEqual(visible.data,tint.data);
 const wall=rasterizeBuildingProps({...design,blocks:Array(100).fill(24)},view,[0]);assert.ok(wall.data.every(v=>v===0),'building walls conceal selection tint');
 const pair={...design,props:[prop,{...prop,x:5}]},all=rasterizeBuildingProps(pair,view),a=rasterizeBuildingProps(pair,view,[0]),b=rasterizeBuildingProps(pair,view,[1]);
 for(let i=3;i<all.data.length;i+=4)assert.ok(Math.abs(a.data[i]+b.data[i]-all.data[i])<=1,'each visible sample belongs to exactly one selectable prop');
 assert.ok(rasterizeBuildingProps(pair,view,[]).data.every(v=>v===0));
}
assert.equal(JSON.stringify(design),before);
console.log('PASS: blue shaded selection, identical visible coverage, wall and overlapping-prop occlusion, equal-depth ordering, disjoint sample ownership and unchanged models.');
