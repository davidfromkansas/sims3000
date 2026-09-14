import assert from 'node:assert/strict';
import {US_MEMORIAL_GEOMETRY} from '../dist/us-memorial-models.js';
import {landmarkGeometry,rasterizeLandmark} from '../dist/landmark-models.js';
import {createCity,build,planBuild,validateSave,tick,VERSION} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {LANDMARKS,landmarkRoots} from '../dist/landmarks.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
const city=createCity('Memorial district',false);for(const t of city.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});const funds=city.funds;
for(const [i,type] of Object.keys(US_MEMORIAL_GEOMETRY).entries()){
 const mesh=landmarkGeometry(type);assert.ok(mesh.every(f=>f.points.every(p=>p.every(Number.isFinite))));
 for(let r=0;r<4;r++){const frame=rasterizeLandmark(type,r,true);let count=0;for(let y=0;y<848;y++)for(let x=0;x<512;x++)if(frame.data[(y*512+x)*4+3]){count++;assert.ok(x>0&&x<511&&y>0&&y<847);assert.ok(Number.isFinite(frame.depth[y*512+x]));}assert.ok(count>20000);}
 const x=5+i*9,y=10,size=LANDMARKS[type].size;assert.ok(build(city,type,[{x,y}]).ok);assert.equal(city.tiles.filter(t=>t.type===type).length,size*size);assert.equal(CUSTOM_METRICS[type].read(city),1);assert.equal(planBuild(city,type,[{x,y:30}]).ok,false);
 const old=JSON.parse(serializeCity(city));old.version=147;assert.throws(()=>validateSave(old),/version 148/);
 assert.ok(build(city,'bulldoze',[{x:x+size-1,y:y+size-1}]).ok);assert.equal(CUSTOM_METRICS[type].read(city),0);assert.ok(build(city,type,[{x,y}]).ok);
}
assert.equal(city.funds,funds-4,'only the four bulldozer actions cost money');assert.equal(landmarkRoots(city).length,4);
const restored=validateSave(JSON.parse(serializeCity(city)));assert.equal(restored.version,VERSION);assert.deepEqual(restored.stats,city.stats);tick(city);tick(restored);assert.equal(serializeCity(restored),serializeCity(city));
const prior=JSON.parse(serializeCity(createCity()));prior.version=147;assert.equal(validateSave(prior).version,VERSION);
// Counts are architectural requirements from the NPS descriptions, not rendered-face counts.
for(const [type,height,expected] of [['lincolnMemorial',.89,38],['jeffersonMemorial',.94,54]]){let columns=0;US_MEMORIAL_GEOMETRY[type]({box(){},add(){},ring(x,y,z,r,h){if(h===height)columns++;}});assert.equal(columns,expected);}
console.log('PASS: four memorial models, transparent four-view bounds, documented column counts, unique free placement, far-corner demolition/rebuilding, scenario counts, version gating and saved monthly continuation.');
