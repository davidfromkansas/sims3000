import assert from 'node:assert/strict';
import {validateBuildingProps,addBuildingProp,removeBuildingProp,rasterizeBuildingProps,buildingPropGeometry} from '../dist/building-props.js';
import {defaultBuildingDesign,validateBuildingDesign,exportBuildingDesign,importBuildingDesign} from '../dist/building-designs.js';
import {createCity,validateSave,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const prop={kind:'tree',x:4,y:4,z:0,rotation:0};
for(const bad of [{...prop,kind:'missing'},{...prop,x:10},{...prop,y:-1},{...prop,z:NaN},{...prop,z:4},{...prop,rotation:4}])assert.throws(()=>validateBuildingProps([bad]));
assert.throws(()=>validateBuildingProps(Array(65).fill(prop)));assert.throws(()=>validateBuildingProps(Array(1)));const copy=validateBuildingProps([prop]);copy[0].x=0;assert.equal(prop.x,4);
const model={...defaultBuildingDesign(),voxels:Array(100).fill(0)};model.voxels[44]=15;model.voxels[99]=1;
const face={x:4,y:4,side:4,points:[[0,0,.68],[1,0,.68],[1,1,.68],[0,1,.68]]};model.props=addBuildingProp(model,'tree',face,2);assert.equal(model.props[0].z,.68);assert.throws(()=>addBuildingProp(model,'car',{...face,side:0}));
const floating={...model,voxels:[...model.voxels]};floating.voxels.fill(0);assert.deepEqual(validateBuildingDesign(floating).props,model.props,'removing support never deletes the prop');
assert.throws(()=>validateBuildingDesign({...floating,props:[]}));const propOnlyBlocks={...floating,voxels:undefined,blocks:Array(100).fill(0)};assert.equal(importBuildingDesign(exportBuildingDesign(propOnlyBlocks)).props.length,1);
const text=exportBuildingDesign(floating);assert.equal(JSON.parse(text).version,10);assert.deepEqual(importBuildingDesign(text),validateBuildingDesign(floating));const old=JSON.parse(text);old.version=9;assert.throws(()=>importBuildingDesign(JSON.stringify(old)));assert.deepEqual(removeBuildingProp(floating,0),[]);
const city=createCity(),control=createCity();city.buildingDesigns[2]=floating;const save=JSON.parse(serializeCity(city)),loaded=validateSave(save);assert.deepEqual(loaded.buildingDesigns[2].props,floating.props);save.version=148;assert.throws(()=>validateSave(save),/149/);tick(city);tick(loaded);tick(control);assert.deepEqual(city.stats,loaded.stats);assert.deepEqual(city.stats,control.stats,'props are appearance-only');
const opaque=d=>d.filter((v,i)=>i%4===3&&v).length;
for(let rotation=0;rotation<4;rotation++){
 const hidden={...model,voxels:Array(100).fill(0xffffff),props:[prop]};assert.equal(opaque(rasterizeBuildingProps(hidden,rotation).data),0,'enclosed prop is hidden by walls');
 hidden.props=[{...prop,z:3.48}];assert.ok(opaque(rasterizeBuildingProps(hidden,rotation).data)>0,'rooftop prop remains visible');
 assert.ok(opaque(rasterizeBuildingProps(floating,rotation).data)>0,'floating prop survives support removal');
 for(const footprint of [{width:1,height:1},{width:5,height:1},{width:1,height:5}])for(const kind of ['tree','car'])for(const x of [0,9])for(const y of [0,9]){const faces=buildingPropGeometry({...prop,kind,x,y,rotation},footprint);assert.ok(faces.length);assert.ok(faces.every(f=>f.points.every(([a,b,z])=>Number.isFinite(z)&&a>=-.5*footprint.width-1e-10&&a<=.5*footprint.width+1e-10&&b>=-.5*footprint.height-1e-10&&b<=.5*footprint.height+1e-10)));}
}
const max={...model,voxels:Array(100).fill(0xffffff),materials:Array(500).fill(4),surfacePaint:'5'.repeat(12000),surfaceDetails:'11110'.repeat(2400),props:Array.from({length:64},(_,i)=>({...prop,x:i%10,y:Math.floor(i/10),z:3.4800009999999997,rotation:i%4})),blockGeometry:'0'.repeat(2400),footprint:{width:5,height:5}};assert.ok(exportBuildingDesign(max).length<32768);assert.deepEqual(importBuildingDesign(exportBuildingDesign(max)).props,max.props);
console.log('PASS: prop coordinates and limits, portable format and city saves, support-independent placement, unchanged simulation, four-view wall occlusion, floating/roof visibility and footprint clipping.');
