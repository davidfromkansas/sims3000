import {readFileSync} from 'node:fs';
import {STRUCTURES,structureSize} from '../dist/structures.js';
import {CityRenderer} from '../dist/renderer.js';
import assert from 'node:assert/strict';
import {createCity,build,planBuild,recompute,validateSave} from '../dist/engine.js';
import {SERVICES,civicRoots,civicMembers} from '../dist/civic-footprints.js';
import {civicFacilityDetails,civicFacilityReport} from '../dist/civic-service-report.js';
import {civicJobSites} from '../dist/civic-jobs.js';
import {fireUnitCapacity} from '../dist/emergency.js';
import {serializeCity} from '../dist/save.js';
function blank(){const c=createCity('Civic lots',false);c.funds=1e6;for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});return c;}
for(const [type,def] of Object.entries(SERVICES)){
 const c=blank();assert.ok(build(c,'coal',[{x:8,y:8}]).ok);
 assert.ok(build(c,'powerline',[{x:15,y:15}]).ok);assert.ok(build(c,'road',[{x:23,y:20}]).ok);
 const before=c.funds;assert.ok(build(c,type,[{x:18,y:18}]).ok);
 const members=c.tiles.filter(t=>t.type===type),root=c.tiles[18*48+18];
 assert.equal(members.length,def.size**2);assert.equal(c.funds,before-def.cost);assert.equal(c.stats.serviceCounts[type],1);assert.equal(c.stats.activeServices[type],1);
 assert.equal(c.stats.spending[def.department],def.upkeep);assert.equal(civicJobSites(c).filter(t=>t.type===type).length,1);
 assert.equal(civicRoots(c).length,1);assert.equal(civicMembers(c,members.at(-1)).length,def.size**2);
 assert.deepEqual(civicFacilityDetails(c,members.at(-1)),civicFacilityDetails(c,root));
 const saved=JSON.parse(serializeCity(c)),loaded=validateSave(saved);assert.equal(loaded.stats.serviceCounts[type],1);
 assert.equal(loaded.tiles.filter(t=>t.type===type).length,def.size**2);
 const corrupt=structuredClone(saved);corrupt.tiles[root.root+1].civicSize=1;assert.throws(()=>validateSave(corrupt),/footprint/);
 members.at(-1).fire=10;recompute(c);assert.equal(c.stats.activeServices[type],0);assert.equal(civicJobSites(c).filter(t=>t.type===type).length,0);
 assert.match(civicFacilityReport(c,root),/Building is on fire/);assert.equal(build(c,'bulldoze',[{x:18,y:18}]).ok,false);
 if(type==='fire')assert.equal(fireUnitCapacity(c),1);
 members.at(-1).fire=0;recompute(c);if(type==='fire')assert.equal(fireUnitCapacity(c),2);
 assert.ok(build(c,'bulldoze',[{x:18+def.size-1,y:18+def.size-1}]).ok);assert.equal(c.tiles.filter(t=>t.type===type).length,0);
}
const c=blank();c.tiles[21*48+21].type='road';const before=serializeCity(c);assert.equal(build(c,'hospital',[{x:20,y:20}]).ok,false);assert.equal(serializeCity(c),before,'obstructed placement is atomic');assert.equal(planBuild(c,'library',[{x:47,y:47}]).ok,false);
const legacy=blank();legacy.version=128;Object.assign(legacy.tiles[20*48+20],{type:'hospital',root:null});legacy.tiles[20*48+21].type='road';
const loaded=validateSave(JSON.parse(serializeCity(legacy)));assert.equal(loaded.tiles[20*48+20].civicSize,1);assert.equal(loaded.tiles[20*48+21].type,'road');assert.equal(loaded.stats.serviceCounts.hospital,1);assert.equal(validateSave(JSON.parse(serializeCity(loaded))).stats.serviceCounts.hospital,1);
console.log('PASS: civic multi-tile placement, one facility budget/jobs, whole-lot inspection/damage/demolition, atomic obstruction, save validation and compact legacy lots.');

// Execute the production structure drawing branch; each civic lot draws once in every view.
const source=readFileSync(new URL('../dist/renderer.js',import.meta.url),'utf8'),body=source.split('else if(STRUCTURES[t.type]){')[1].split('}else if(WATER_STRUCTURES[t.type])')[0],calls=[];
const actual=new Function('STRUCTURES','structureSize','SERVICES','drawCityCivic','return function(city,t,c,p,u,fade){'+body+'}')(STRUCTURES,structureSize,SERVICES,(...args)=>calls.push(args));
for(const type of Object.keys(SERVICES)){
 const city=blank();assert.ok(build(city,type,[{x:20,y:20}]).ok);const scene=Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>city,rotation:0,zoom:1,w:1000,h:700,pan:{x:0,y:0},layer:'police'});
 for(let rotation=0;rotation<4;rotation++){
  scene.rotation=rotation;calls.length=0;for(const tile of city.tiles)if(tile.type===type)actual.call(scene,city,tile,{},scene.project(tile.x,tile.y),scene.unit,.7);
  assert.equal(calls.length,1);const size=SERVICES[type].size,p=scene.project(20+(size-1)/2,20+(size-1)/2);
  assert.deepEqual(calls[0].slice(1),[type,rotation,p.x,p.y+scene.unit/2,scene.unit*size*2.1,.7]);
 }
}
