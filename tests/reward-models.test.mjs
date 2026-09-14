import {geyserPlumeState} from '../dist/geyser-plume.js';
import {themeParkRideState} from '../dist/theme-park-rides.js';
import {stadiumMatchState} from '../dist/stadium-match.js';
import {structureSize} from '../dist/structures.js';
import {SERVICES} from '../dist/civic-footprints.js';
import {STRUCTURES} from '../dist/structures.js';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MODELED_REWARDS,rewardGeometry,rasterizeReward,drawCityReward} from '../dist/reward-models.js';
import {projectMiniature} from '../dist/miniature-raster.js';
import {REWARDS} from '../dist/rewards.js';
import {createCity,build,recompute,tick,validateSave} from '../dist/engine.js';
import {CityRenderer} from '../dist/renderer.js';
import {serializeCity} from '../dist/save.js';
assert.deepEqual([...MODELED_REWARDS],Object.keys(REWARDS));
for(const type of MODELED_REWARDS){const geometry=rewardGeometry(type);assert.ok(geometry.length>90);assert.deepEqual(rewardGeometry(type),geometry);const views=[];for(let rotation=0;rotation<4;rotation++){
 for(const face of geometry){assert.match(face.color,/^#[a-f\d]{6}$/i);for(const p of face.points){const [x,y]=projectMiniature(p,rotation);assert.ok(x>=0&&x<512&&y>=0&&y<512);}}
 const raster=rasterizeReward(type,rotation);let opaque=0;for(let i=3;i<raster.data.length;i+=4)opaque+=raster.data[i]===255?1:0;assert.ok(opaque>20000&&opaque<150000);views.push(Buffer.from(raster.data).toString('base64'));}assert.equal(new Set(views).size,4,type);}
assert.throws(()=>rewardGeometry('unknown'));
let created=0,put=0,drawn=0;const ctx={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){put++;},save(){},fillRect(){},restore(){},drawImage(){drawn++;}};globalThis.document={createElement(){created++;return{getContext:()=>ctx};}};
const city=createCity('Power models',false);city.startYear=2050;city.funds=1000000;for(const t of city.tiles){t.terrain='land';t.elevation=0;t.nature=false;}for(const type of MODELED_REWARDS)city.rewards.earned[type]=0;for(const [i,type] of [...MODELED_REWARDS].entries())assert.ok(build(city,type,[{x:4+i%4*10,y:6+Math.floor(i/4)*14}]).ok);recompute(city);const saved=serializeCity(city);
for(let repeat=0;repeat<2;repeat++)for(const type of MODELED_REWARDS)for(let rotation=0;rotation<4;rotation++)drawCityReward(ctx,type,rotation,100,100,84,.4);
assert.equal(created,MODELED_REWARDS.size*4);assert.equal(put,MODELED_REWARDS.size*4);assert.equal(drawn,MODELED_REWARDS.size*8);assert.equal(serializeCity(city),saved);const loaded=validateSave(JSON.parse(saved));tick(city);tick(loaded);assert.deepEqual(city.stats,loaded.stats);
// Execute the actual multi-tile branch for every footprint tile. Each plant must
// be drawn exactly once at the same footprint center in each rotation.
const source=readFileSync(new URL('../dist/renderer.js',import.meta.url),'utf8'),body=source.split('else if(STRUCTURES[t.type]){')[1].split('}else if(WATER_STRUCTURES[t.type])')[0],calls=[];
const actual=new Function('structureSize','SERVICES','STRUCTURES','MODELED_POWER','MODELED_REWARDS','drawCityReward','stadiumMatchState','themeParkRideState','geyserPlumeState','return function(city,t,c,p,u,fade){'+body+'}')(structureSize,SERVICES,STRUCTURES,new Set(),MODELED_REWARDS,(...args)=>calls.push(args),stadiumMatchState,themeParkRideState,geyserPlumeState);
const scene=Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>city,rotation:0,zoom:1,w:1000,h:700,pan:{x:0,y:0},layer:'city',preferences:{},reducedMotion:{matches:false},vehicleTime:0});
for(let rotation=0;rotation<4;rotation++){scene.rotation=rotation;calls.length=0;for(const t of city.tiles)if(MODELED_REWARDS.has(t.type))actual.call(scene,city,t,ctx,scene.project(t.x,t.y),scene.unit,.4);assert.equal(calls.length,MODELED_REWARDS.size);for(const call of calls){const type=call[1],root=city.tiles.find((t,i)=>t.type===type&&t.root===i),size=REWARDS[type].size,center=scene.project(root.x+(size-1)/2,root.y+(size-1)/2);assert.deepEqual(call,[ctx,type,rotation,center.x,center.y+scene.unit/2,scene.unit*size*2.1,.4,type==='geyserPark'?geyserPlumeState(scene,root):type==='stadium'?stadiumMatchState(scene,root):type==='themePark'?themeParkRideState(scene,root):null]);}}
console.log('PASS: reward buildings in distinct bounded views, cached rasters, actual earned placement/save continuity, and once-per-footprint rendering aligned through four rotations.');
