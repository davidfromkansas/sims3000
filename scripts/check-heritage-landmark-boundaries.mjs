import assert from 'node:assert/strict';
import {createCity,build,validateSave} from '../dist/engine.js';
import {MAP_SIZES} from '../dist/city-grid.js';
import {LANDMARKS,landmarkRoots} from '../dist/landmarks.js';
import {serializeCity} from '../dist/save.js';
let checked=0;
for(const size of MAP_SIZES){
 const city=createCity('Landmark boundary review',false,size);for(const t of city.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});
 for(const type of ['brandenburgGate','parthenon','tajMahal']){
  const span=LANDMARKS[type].size,x=size-span,y=size-span,initial=serializeCity(city),funds=city.funds;
  for(const point of [{x:x+1,y},{x,y:y+1}]){assert.equal(build(city,type,[point]).ok,false);assert.ok(serializeCity(city)===initial,'boundary rejection must leave the entire city unchanged');}
  assert.ok(build(city,type,[{x,y}]).ok);assert.equal(city.funds,funds);assert.equal(city.tiles.filter(t=>t.type===type).length,span*span);
  const restored=validateSave(JSON.parse(serializeCity(city)));assert.equal(landmarkRoots(restored).filter(t=>t.type===type).length,1);assert.equal(restored.tiles.at(-1).type,type);
  assert.ok(build(city,'bulldoze',[{x:size-1,y:size-1}]).ok);assert.equal(city.tiles.some(t=>t.type===type),false);assert.ok(build(city,type,[{x,y}]).ok);assert.ok(build(city,'bulldoze',[{x,y}]).ok);checked++;
 }
}
console.log(`PASS: ${checked} landmark/map-size cases, atomic right/bottom boundary rejection, free exact-fit placement, saved corner tiles and complete demolition/rebuilding.`);
