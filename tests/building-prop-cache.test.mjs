import assert from 'node:assert/strict';
import {drawBuildingProps,rasterizeBuildingProps} from '../dist/building-props.js';
let created=0,last,draws=0;
globalThis.document={createElement(type){assert.equal(type,'canvas');created++;const canvas={pixels:null,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(image){canvas.pixels=image.data;}})};return canvas;}};
const ctx={drawImage(canvas){last=canvas;draws++;}},design={blocks:Array(100).fill(0),props:[{kind:'tree',x:4,y:4,z:0,rotation:0}]};
drawBuildingProps(ctx,design,0);assert.equal(created,1);assert.deepEqual(last.pixels,rasterizeBuildingProps(design,0).data);
for(let i=0;i<50;i++)drawBuildingProps(ctx,structuredClone(design),0);assert.equal(created,1,'new wrapper objects and repeated cursor redraws reuse the same artwork');assert.equal(draws,51);
for(let r=1;r<4;r++){drawBuildingProps(ctx,design,r);assert.deepEqual(last.pixels,rasterizeBuildingProps(design,r).data);}assert.equal(created,4);
for(let r=0;r<4;r++)drawBuildingProps(ctx,design,r);assert.equal(created,4,'returning to a viewed angle does not rerasterize');
for(const mutate of [()=>design.props[0].rotation=2,()=>design.props[0].x=7,()=>design.blocks[47]=2,()=>design.footprint={width:5,height:1},()=>{delete design.blocks;design.voxels=Array(100).fill(0);design.voxels[47]=1;},()=>design.blockGeometry='0'.repeat(47)+'2'+'0'.repeat(2352)]){
 const before=created;mutate();drawBuildingProps(ctx,design,0);assert.equal(created,before+1);assert.deepEqual(last.pixels,rasterizeBuildingProps(design,0).data,'changed construction, footprint or prop has fresh pixels');
}
const before=created;design.facade='#aabbcc';design.name='Renamed model';drawBuildingProps(ctx,design,0);assert.equal(created,before,'unrelated building name/facade edits do not invalidate the prop layer');
const beforeDraws=draws;drawBuildingProps(ctx,{...design,props:[]},0);assert.equal(draws,beforeDraws,'removed props never draw retained frames');
const other={drawImage(canvas){assert.deepEqual(canvas.pixels,last.pixels);}};drawBuildingProps(other,design,0);assert.equal(created,before+1,'another destination owns an independent bounded cache');
console.log('PASS: identical pixel output, repeated redraw and four-view reuse, content-based mutation/import invalidation, empty props, irrelevant edits and independent destinations.');

const beforeHighlight=created;drawBuildingProps(ctx,design,0,[0]);assert.equal(created,beforeHighlight+1);for(let i=0;i<20;i++){drawBuildingProps(ctx,design,0);drawBuildingProps(ctx,design,0,[0]);}assert.equal(created,beforeHighlight+1,'selection overlay does not evict unchanged normal artwork');
