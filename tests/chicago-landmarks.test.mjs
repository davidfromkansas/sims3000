import assert from 'node:assert/strict';
import {CHICAGO_LANDMARK_GEOMETRY} from '../dist/chicago-landmark-models.js';
import {landmarkGeometry,rasterizeLandmark} from '../dist/landmark-models.js';
import {createCity,build,planBuild,validateSave,tick,VERSION} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {LANDMARKS,landmarkRoots} from '../dist/landmarks.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
const city=createCity('Chicago collection',false);for(const t of city.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});const funds=city.funds;
for(const [i,type] of Object.keys(CHICAGO_LANDMARK_GEOMETRY).entries()){
 const mesh=landmarkGeometry(type);assert.ok(mesh.every(f=>f.points.every(p=>p.every(Number.isFinite))));
 for(let r=0;r<4;r++){const frame=rasterizeLandmark(type,r,true);let count=0;for(let y=0;y<848;y++)for(let x=0;x<512;x++)if(frame.data[(y*512+x)*4+3]){count++;assert.ok(x>0&&x<511&&y>0&&y<847);assert.ok(Number.isFinite(frame.depth[y*512+x]));}assert.ok(count>20000);}
 const x=5+i*10,y=10,size=LANDMARKS[type].size;assert.ok(build(city,type,[{x,y}]).ok);assert.equal(city.tiles.filter(t=>t.type===type).length,size*size);assert.equal(CUSTOM_METRICS[type].read(city),1);assert.equal(planBuild(city,type,[{x,y:30}]).ok,false);
 const old=JSON.parse(serializeCity(city));old.version=156;assert.throws(()=>validateSave(old),/version 157/);
 assert.ok(build(city,'bulldoze',[{x:x+size-1,y:y+size-1}]).ok);assert.equal(CUSTOM_METRICS[type].read(city),0);assert.ok(build(city,type,[{x,y}]).ok);
}
assert.equal(city.funds,funds-3);assert.equal(landmarkRoots(city).length,3);
const restored=validateSave(JSON.parse(serializeCity(city)));assert.equal(restored.version,VERSION);tick(city);tick(restored);assert.equal(serializeCity(restored),serializeCity(city));
const prior=JSON.parse(serializeCity(createCity()));prior.version=156;assert.equal(validateSave(prior).version,VERSION);
console.log('PASS: three original Chicago landmarks, four-view raster bounds and depth, unique free placement, far-corner demolition/rebuilding, scenario metrics and saved monthly continuation.');
// Counts anchored in the architectural sources rather than in the runtime catalog.
const capture=type=>{const rings=[],faces=[];CHICAGO_LANDMARK_GEOMETRY[type]({box(){},beam(){},ring(x,y,z,r,h,top,color,sides){rings.push({x,y,z,r,h,top,color,sides});},add(points,color){faces.push({points,color});}});return{rings,faces};};
const adler=capture('adlerPlanetarium');assert.equal(adler.rings.find(r=>r.z===.32).sides,12,'the historic Adler building has twelve sides');
const shedd=capture('sheddAquarium');assert.equal(shedd.rings.find(r=>r.z===.34).sides,8,'the historic Shedd footprint is octagonal');assert.equal(shedd.faces.filter(f=>f.color==='#698d94').length,8,'the glazed dome has eight sides');
const institute=capture('artInstituteChicago');assert.equal(institute.rings.filter(r=>r.color==='#658777').length,2,'the entrance has paired bronze guardian lions');
console.log('PASS: source-defined twelve-sided planetarium, octagonal aquarium and dome, and paired Art Institute lion figures.');
