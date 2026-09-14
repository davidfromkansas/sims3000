import assert from 'node:assert/strict';
import {BUILDING_PROPS,PROP_CATEGORIES,rasterizePropPreview,buildingPropGeometry,rasterizeBuildingProps} from '../dist/building-props.js';
import {defaultBuildingDesign,exportBuildingDesign,importBuildingDesign} from '../dist/building-designs.js';
import {createCity,validateSave,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
assert.deepEqual(PROP_CATEGORIES,['Architecture','Building Decoration','Plaza and Streets','Yard Objects','Flora','Vehicles','Industrial','Rooftops']);
assert.equal(Object.keys(BUILDING_PROPS).length,12);for(const category of PROP_CATEGORIES)assert.ok(Object.values(BUILDING_PROPS).some(p=>p.category===category));
assert.equal(BUILDING_PROPS.wagon.name,'Family station wagon');assert.equal(BUILDING_PROPS.pickup.name,'Blue pickup truck');
const draft={...defaultBuildingDesign(),blocks:Array(100).fill(0),props:[]};
for(const kind of Object.keys(BUILDING_PROPS))for(let rotation=0;rotation<4;rotation++){
 const prop={kind,x:4,y:4,z:0,rotation};draft.props.push(prop);
 for(const footprint of [{width:1,height:1},{width:1,height:5},{width:5,height:1}]){
  const geometry=buildingPropGeometry(prop,footprint);assert.ok(geometry.length>0);assert.ok(geometry.every(f=>/^#[0-9a-f]{6}$/i.test(f.color)&&f.points.length>=3&&f.points.flat().every(Number.isFinite)));
  for(const view of [0,1,2,3]){const image=rasterizeBuildingProps({...draft,footprint,props:[prop]},view);assert.ok(image.data.some((v,i)=>i%4===3&&v),`${kind} prop ${rotation}, view ${view}, lot ${footprint.width}x${footprint.height} remains visible`);}
 }
}
const restored=importBuildingDesign(exportBuildingDesign(draft));assert.deepEqual(restored.props,draft.props);
const city=createCity();city.buildingDesigns[2]=draft;const loaded=validateSave(JSON.parse(serializeCity(city)));assert.deepEqual(loaded.buildingDesigns[2].props,draft.props);tick(city);tick(loaded);assert.deepEqual(loaded.stats,city.stats);assert.deepEqual(loaded.buildingDesigns[2].props,draft.props);
// Car direction has actual geometry differences, not only a label.
const car=rotation=>buildingPropGeometry({kind:'pickup',x:4,y:4,z:0,rotation});assert.notDeepEqual(car(0),car(1));assert.notDeepEqual(car(0),car(2));
console.log('PASS: all eight manual categories, twelve original props, four physical directions and view rasters, rectangular lots, portable model and city save/tick continuity.');

for(const kind of Object.keys(BUILDING_PROPS))for(let direction=0;direction<4;direction++)for(let view=0;view<4;view++){
 const image=rasterizePropPreview(kind,direction,view);let count=0;
 for(let y=0;y<160;y++)for(let x=0;x<160;x++)if(image.data[(y*160+x)*4+3]){count++;assert.ok(x>=11&&x<=148&&y>=11&&y<=148,`${kind} fitted preview retains its transparent margin`);}
 assert.ok(count>50,`${kind} is visible in the fitted palette`);
}
console.log('PASS: all twelve palette models fit with transparent margins through every physical direction and camera view.');
