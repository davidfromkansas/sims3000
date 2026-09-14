import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {generateCity} from '../dist/terrain-generator.js';
import {build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {REWARDS,rewardActive} from '../dist/rewards.js';
import {STRUCTURES,structureSize} from '../dist/structures.js';
import {CityRenderer} from '../dist/renderer.js';
const blank=()=>{const c=generateCity({startYear:2000,water:0,mountains:0,trees:0});c.funds=100000;c.rewards.earned.university=0;return c;};
const c=blank();assert.equal(REWARDS.university.size,10);
assert.ok(build(c,'solar',[{x:10,y:20}]).ok);assert.ok(build(c,'powerline',selection('powerline',{x:14,y:20},{x:19,y:20})).ok);assert.ok(build(c,'road',selection('road',{x:20,y:19},{x:29,y:19})).ok);
assert.ok(build(c,'university',[{x:20,y:20}]).ok);const root=c.tiles[20*48+20],members=c.tiles.filter(t=>t.type==='university');assert.equal(members.length,100);assert.ok(members.every(t=>t.universitySize===10));assert.ok(rewardActive(c,root));assert.equal(c.stats.civicJobs,500);assert.equal(c.stats.rewardUpkeep,40);
const saved=JSON.parse(serializeCity(c));assert.equal(saved.version,144);assert.equal(validateSave(saved).stats.civicJobs,500);
for(const mutate of [s=>delete s.tiles[20*48+20].universitySize,s=>s.tiles[29*48+29].universitySize=4,s=>s.tiles[29*48+29].type=null,s=>s.tiles[20*48+20].universitySize=11]){const bad=structuredClone(saved);mutate(bad);assert.throws(()=>validateSave(bad));}
const edge=c.tiles[29*48+29];edge.fire=10;recompute(c);assert.equal(rewardActive(c,root),false);assert.equal(c.stats.civicJobs,0);edge.fire=0;recompute(c);assert.equal(c.stats.civicJobs,500);
assert.ok(build(c,'bulldoze',[{x:29,y:29}]).ok);assert.equal(c.tiles.filter(t=>t.type==='university').length,0);assert.ok(members.every(t=>t.universitySize===undefined));assert.ok(build(c,'university',[{x:20,y:20}]).ok);
const blocked=blank();blocked.tiles[29*48+29].type='road';const before=serializeCity(blocked);assert.equal(build(blocked,'university',[{x:20,y:20}]).ok,false);assert.equal(serializeCity(blocked),before);assert.equal(build(blocked,'university',[{x:39,y:39}]).ok,false);
const old=blank();old.version=131;for(let y=20;y<24;y++)for(let x=20;x<24;x++)Object.assign(old.tiles[y*48+x],{type:'university',root:20*48+20});old.tiles[20*48+24].type='road';
const legacy=validateSave(JSON.parse(serializeCity(old)));assert.equal(structureSize(legacy.tiles[20*48+20]),4);assert.equal(legacy.tiles[20*48+24].type,'road');assert.equal(legacy.tiles.filter(t=>t.type==='university').length,16);assert.equal(validateSave(JSON.parse(serializeCity(legacy))).tiles[20*48+20].universitySize,4);
// Execute the production campus render branch in all views, for both saved sizes.
const source=readFileSync(new URL('../dist/renderer.js',import.meta.url),'utf8'),body=source.split('else if(STRUCTURES[t.type]){')[1].split('}else if(WATER_STRUCTURES[t.type])')[0],calls=[];
const actual=new Function('STRUCTURES','structureSize','SERVICES','MODELED_POWER','MODELED_REWARDS','drawCityReward','return function(city,t,c,p,u,fade){'+body+'}')(STRUCTURES,structureSize,{},new Set(),new Set(['university']),(...args)=>calls.push(args));
for(const city of [c,legacy]){const size=structureSize(city.tiles[20*48+20]),scene=Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>city,rotation:0,zoom:1,w:1000,h:700,pan:{x:0,y:0},layer:'city'});for(let rotation=0;rotation<4;rotation++){scene.rotation=rotation;calls.length=0;for(const tile of city.tiles)if(tile.type==='university')actual.call(scene,city,tile,{},scene.project(tile.x,tile.y),scene.unit,.7);assert.equal(calls.length,1);const p=scene.project(20+(size-1)/2,20+(size-1)/2);assert.deepEqual(calls[0].slice(1),['university',rotation,p.x,p.y+scene.unit/2,scene.unit*size*2.1,.7,null]);}}
console.log('PASS: 100-tile university campus placement, atomic boundaries, service loss, unique budget/jobs, demolition, strict saves, legacy neighbor preservation and four-view production rendering.');
