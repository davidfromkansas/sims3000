import assert from 'node:assert/strict';
import {VERSION,createCity,build,idx,planBuild,validateSave,recompute,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {LANDMARKS,landmarkRoots} from '../dist/landmarks.js';
import {drawLandmarkModel,landmarkGeometry,MODELED_LANDMARKS} from '../dist/landmark-models.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
const c=createCity('World landmarks',false);for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});const funds=c.funds;
for(const [i,type]of [...MODELED_LANDMARKS].entries()){
 const x=3+(i%5)*9,y=10+Math.floor(i/5)*14;assert.ok(build(c,type,[{x,y}]).ok);assert.equal(c.tiles.filter(t=>t.type===type).length,LANDMARKS[type].size**2);assert.equal(planBuild(c,type,[{x,y:30}]).ok,false);assert.equal(CUSTOM_METRICS[type].read(c),1);
 const mesh=landmarkGeometry(type);assert.ok(mesh.length>100);assert.ok(mesh.every(f=>f.points.length>=3&&f.points.every(p=>p.length===3&&p.every(Number.isFinite))));
 const views=[];for(let rotation=0;rotation<4;rotation++){const points=[],ctx={createImageData(w,h){return {data:new Uint8ClampedArray(w*h*4)};},putImageData(image){assert.equal(image.data.length,512*848*4);assert.ok(image.data.some((v,i)=>i%4===3&&v>0));},beginPath(){},closePath(){},fill(){},moveTo(x,y){points.push([x,y]);},lineTo(x,y){points.push([x,y]);}};drawLandmarkModel(ctx,type,rotation);assert.ok(points.filter(Array.isArray).every(([x,y])=>x>=0&&x<=512&&y>=0&&y<=848),'geometry fits cached canvas');views.push(points);}if(!['helsinkiCathedral','eiffelTower','greatPyramid','washingtonMonument','gatewayArch','jeffersonMemorial','lincolnMemorial'].includes(type))assert.notDeepEqual(views[0],views[1]);
}
assert.equal(c.funds,funds);assert.equal(CUSTOM_METRICS.landmarks.max,11);assert.equal(CUSTOM_METRICS.landmarks.read(c),11);
assert.ok(build(c,'bulldoze',[{x:40,y:11}]).ok);assert.equal(CUSTOM_METRICS.helsinkiCathedral.read(c),0);assert.ok(build(c,'helsinkiCathedral',[{x:39,y:10}]).ok);
const oldHelsinki=JSON.parse(serializeCity(c));oldHelsinki.version=146;assert.throws(()=>validateSave(oldHelsinki),/version 147/);
const oldChrysler=JSON.parse(serializeCity(c));oldChrysler.version=126;for(const t of oldChrysler.tiles)if(t.type==='helsinkiCathedral')Object.assign(t,{type:'empty',root:null});assert.throws(()=>validateSave(oldChrysler),/version 127/);
const oldArc=JSON.parse(serializeCity(c));oldArc.version=129;for(const t of oldArc.tiles)if(t.type==='helsinkiCathedral')Object.assign(t,{type:'empty',root:null});assert.throws(()=>validateSave(oldArc),/version 130/);
const saved=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(saved.stats,c.stats);assert.deepEqual(landmarkRoots(saved).map(t=>t.type),['bigBen','statueLiberty','chryslerBuilding','arcDeTriomphe','helsinkiCathedral','eiffelTower','greatPyramid','washingtonMonument','gatewayArch','jeffersonMemorial','lincolnMemorial']);tick(c);tick(saved);assert.deepEqual(saved.stats,c.stats);
assert.ok(build(c,'bulldoze',[{x:4,y:11}]).ok);assert.equal(c.tiles.some(t=>t.type==='bigBen'),false);assert.ok(build(c,'bigBen',[{x:3,y:10}]).ok);
const forged=JSON.parse(serializeCity(c));for(let y=30;y<33;y++)for(let x=30;x<33;x++)Object.assign(forged.tiles[idx(x,y)],{type:'statueLiberty',root:idx(30,30)});assert.throws(()=>validateSave(forged),/one of each landmark/);
for(const version of [88,146,147]){const legacy=JSON.parse(serializeCity(createCity()));legacy.version=version;assert.equal(validateSave(legacy).version,VERSION);}assert.throws(()=>landmarkGeometry('missing'));
console.log('PASS: expanded landmark placement, uniqueness, scenario goals, whole-footprint rebuilding, saved continuation, legacy migration and all four model projections.');
