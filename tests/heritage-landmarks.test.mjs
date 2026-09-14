import assert from 'node:assert/strict';
import {HERITAGE_LANDMARK_GEOMETRY} from '../dist/heritage-landmark-models.js';
import {landmarkGeometry,rasterizeLandmark} from '../dist/landmark-models.js';
import {createCity,build,planBuild,validateSave,tick,VERSION} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {LANDMARKS,landmarkRoots} from '../dist/landmarks.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
const city=createCity('Heritage collection',false);for(const t of city.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});const funds=city.funds;
for(const [i,type] of Object.keys(HERITAGE_LANDMARK_GEOMETRY).entries()){
 const mesh=landmarkGeometry(type);assert.ok(mesh.every(f=>f.points.every(p=>p.every(Number.isFinite))));
 for(let r=0;r<4;r++){const frame=rasterizeLandmark(type,r,true);let count=0;for(let y=0;y<848;y++)for(let x=0;x<512;x++)if(frame.data[(y*512+x)*4+3]){count++;assert.ok(x>0&&x<511&&y>0&&y<847);assert.ok(Number.isFinite(frame.depth[y*512+x]));}assert.ok(count>20000);}
 const x=5+i*10,y=10,size=LANDMARKS[type].size;assert.ok(build(city,type,[{x,y}]).ok);assert.equal(city.tiles.filter(t=>t.type===type).length,size*size);assert.equal(CUSTOM_METRICS[type].read(city),1);assert.equal(planBuild(city,type,[{x,y:30}]).ok,false);
 const old=JSON.parse(serializeCity(city));old.version=153;assert.throws(()=>validateSave(old),/version 154/);
 assert.ok(build(city,'bulldoze',[{x:x+size-1,y:y+size-1}]).ok);assert.equal(CUSTOM_METRICS[type].read(city),0);assert.ok(build(city,type,[{x,y}]).ok);
}
assert.equal(city.funds,funds-3);assert.equal(landmarkRoots(city).length,3);
const restored=validateSave(JSON.parse(serializeCity(city)));assert.equal(restored.version,VERSION);tick(city);tick(restored);assert.equal(serializeCity(restored),serializeCity(city));
const prior=JSON.parse(serializeCity(createCity()));prior.version=153;assert.equal(validateSave(prior).version,VERSION);
console.log('PASS: three original heritage landmarks, four-view raster bounds and depth, unique free placement, far-corner demolition/rebuilding, scenario metrics and saved monthly continuation.');
// Source-defined architectural counts, independently captured before rasterization.
const solids=type=>{const rings=[];HERITAGE_LANDMARK_GEOMETRY[type]({box(){},add(){},beam(){},ring(x,y,z,r,height,top){rings.push({x,y,z,r,height,top});}});return rings;};
const gateColumns=solids('brandenburgGate').filter(s=>s.height>.5&&s.height<1&&s.z<.5);
assert.equal(gateColumns.length,12,'Brandenburg Gate has two rows of six Doric columns');
const gateRows=Map.groupBy(gateColumns,s=>s.y);assert.equal(gateRows.size,2);for(const row of gateRows.values())assert.equal(new Set(row.map(s=>s.x)).size,6);
const templeColumns=solids('parthenon').filter(s=>s.height>.5&&s.height<1&&s.z<.5),xs=templeColumns.map(s=>s.x),ys=templeColumns.map(s=>s.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
for(const y of [minY,maxY])assert.equal(templeColumns.filter(s=>s.y===y).length,8,'eight columns across each narrow end');
for(const x of [minX,maxX])assert.equal(templeColumns.filter(s=>s.x===x).length,17,'seventeen columns along each long side');
const minarets=solids('tajMahal').filter(s=>s.height>1&&Math.abs(s.x)>1&&Math.abs(s.y)>1);assert.equal(minarets.length,4,'four minarets at the platform corners');assert.equal(new Set(minarets.map(s=>`${Math.sign(s.x)},${Math.sign(s.y)}`)).size,4);
console.log('PASS: reference-defined gate column rows, Parthenon eight-by-seventeen perimeter and four corner minarets in the authored geometry.');
