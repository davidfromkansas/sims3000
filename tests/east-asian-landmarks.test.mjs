import assert from 'node:assert/strict';
import {EAST_ASIAN_LANDMARK_GEOMETRY} from '../dist/east-asian-landmark-models.js';
import {landmarkGeometry,rasterizeLandmark,drawLandmarkModel} from '../dist/landmark-models.js';
import {createCity,build,planBuild,validateSave,tick,VERSION} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {LANDMARKS,landmarkRoots} from '../dist/landmarks.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
const city=createCity('East Asian collection',false);for(const t of city.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});const funds=city.funds;
for(const [i,type] of Object.keys(EAST_ASIAN_LANDMARK_GEOMETRY).entries()){
 const mesh=landmarkGeometry(type);assert.ok(mesh.every(f=>f.points.every(p=>p.every(Number.isFinite))));
 for(let r=0;r<4;r++){const frame=rasterizeLandmark(type,r,true);let count=0;for(let y=0;y<848;y++)for(let x=0;x<512;x++)if(frame.data[(y*512+x)*4+3]){count++;assert.ok(x>0&&x<511&&y>0&&y<847);assert.ok(Number.isFinite(frame.depth[y*512+x]));}assert.ok(count>20000);}
 const x=5+i*10,y=10,size=LANDMARKS[type].size;assert.ok(build(city,type,[{x,y}]).ok);assert.equal(city.tiles.filter(t=>t.type===type).length,size*size);assert.equal(CUSTOM_METRICS[type].read(city),1);assert.equal(planBuild(city,type,[{x,y:30}]).ok,false);
 const old=JSON.parse(serializeCity(city));old.version=160;assert.throws(()=>validateSave(old),/version 161/);
 assert.ok(build(city,'bulldoze',[{x:x+size-1,y:y+size-1}]).ok);assert.equal(CUSTOM_METRICS[type].read(city),0);assert.ok(build(city,type,[{x,y}]).ok);
}
assert.equal(city.funds,funds-3);assert.equal(landmarkRoots(city).length,3);
const restored=validateSave(JSON.parse(serializeCity(city)));assert.equal(restored.version,VERSION);tick(city);tick(restored);assert.equal(serializeCity(restored),serializeCity(city));
const prior=JSON.parse(serializeCity(createCity()));prior.version=156;assert.equal(validateSave(prior).version,VERSION);
console.log('PASS: three original East Asian landmarks, four-view raster bounds and depth, unique free placement, far-corner demolition/rebuilding, scenario metrics and saved monthly continuation.');
// The playable canvas must use the same occlusion as the reviewed art, including
// the Chicago collection that previously fell through to painter sorting.
for(const type of [...Object.keys(EAST_ASIAN_LANDMARK_GEOMETRY),'adlerPlanetarium','sheddAquarium','artInstituteChicago'])for(let rotation=0;rotation<4;rotation++){
 let actual;
 drawLandmarkModel({createImageData(w,h){return{data:new Uint8ClampedArray(w*h*4)};},putImageData(frame){actual=frame.data;}},type,rotation);
 assert.deepEqual(actual,rasterizeLandmark(type,rotation).data,`${type} ${rotation}: actual canvas matches reviewed depth raster`);
}
console.log('PASS: city/gallery drawing matches reviewed depth raster in 24 collection views.');
