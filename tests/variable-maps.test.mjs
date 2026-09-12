import assert from 'node:assert/strict';
import {createCity,build,selection,idx,recompute,tick,validateSave,VERSION} from '../dist/engine.js';
import {generateCity} from '../dist/terrain-generator.js';
import {serializeCity} from '../dist/save.js';
import {MAP_SIZES,MAX_CITY_FILE_BYTES,visibleTileBounds} from '../dist/city-grid.js';
import {connectionCandidates,addConnection} from '../dist/region.js';
import {zonedSprite} from '../dist/building-art.js';
import {CUSTOM_METRICS,metricLimit} from '../dist/scenario-metrics.js';
import {CityRenderer} from '../dist/renderer.js';
import {centerNavigation} from '../dist/navigation-map.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
const timing=[];
for(const size of MAP_SIZES){
 const start=performance.now(),c=generateCity({size,water:0,mountains:0,trees:0,startYear:2000}),b=size-20,at=(x,y)=>c.tiles[idx(x,y,size)],line=(type,x,y,xx,yy)=>assert.ok(build(c,type,selection(type,{x,y},{x:xx,y:yy},size)).ok,type);
 line('road',b,b,size-1,b);assert.ok(build(c,'solar',[{x:b-4,y:b+2}]).ok);line('residential',b+2,b-1,b+2,b-1);line('industrial',b+5,b-1,b+5,b-1);at(b+2,b-1).level=1;at(b+5,b-1).level=1;at(b-5,b-2).terrain='water';assert.ok(build(c,'pump',[{x:b-4,y:b-2}]).ok);line('pipe',b-4,b-2,b+7,b-2);recompute(c);
 assert.equal(c.size,size);assert.equal(c.tiles.length,size*size);assert.ok(at(b+2,b-1).powered);assert.ok(at(b+2,b-1).watered);assert.ok(at(b+2,b-1).access);assert.equal(c.stats.industrialJobs,12);assert.equal(build(c,'road',[{x:size,y:b}]).ok,false);
 const edge=connectionCandidates(c).find(p=>p.kind==='road'&&p.tile===idx(size-1,b,size));assert.ok(edge);assert.ok(addConnection(c,edge).ok);recompute(c);assert.equal(at(b+5,b-1).marketDemandBonus,3);
 const raw=serializeCity(c);assert.ok(raw.length<MAX_CITY_FILE_BYTES);const loaded=validateSave(JSON.parse(raw));assert.deepEqual(loaded.stats,c.stats);const monthStart=performance.now();tick(c);tick(loaded);assert.deepEqual(loaded.stats,c.stats);timing.push({size,bytes:raw.length,setupAndRoundtripMs:Math.round(performance.now()-start),twoMonthsMs:Math.round(performance.now()-monthStart)});
 // Rotations, terrain-aware picking, navigation and viewport bounds cover far map coordinates.
 for(let rotation=0;rotation<4;rotation++){const r=Object.create(CityRenderer.prototype);Object.assign(r,{getCity:()=>c,rotation,zoom:1,w:1000,h:600,pan:{x:0,y:0}});const target=centerNavigation(r,size-2,size-3),p=r.project(target.x,target.y);assert.deepEqual(r.pick(p.x,p.y+r.unit/2),target);const bounds=visibleTileBounds(r);assert.ok(target.x>=bounds.x0&&target.x<=bounds.x1&&target.y>=bounds.y0&&target.y<=bounds.y1);assert.ok((bounds.x1-bounds.x0+1)*(bounds.y1-bounds.y0+1)<size*size||size===48);}
}
const small=createCity('Small',false),big=createCity('Large',false,96);assert.ok(build(big,'road',[{x:80,y:80}]).ok);assert.ok(build(small,'road',[{x:30,y:30}]).ok);assert.equal(small.tiles[idx(30,30)].type,'road');assert.equal(big.tiles[idx(80,80,96)].type,'road','cities of different sizes do not share mutable indexing');
attachCustomScenario(big,{title:'Far corner',months:24,objectives:[{metric:'population',target:999999}],events:[{type:'camera',month:1,x:90,y:90,zoom:1,condition:{metric:'structuresPark',operator:'gte',target:0,area:{x:90,y:90,radius:100}}}]});tick(big);assert.equal(big.scenario.events[0].status,'triggered');const saved=validateSave(JSON.parse(serializeCity(big)));assert.deepEqual(saved.scenario,big.scenario);assert.equal(restartCustomScenario(saved).size,96);assert.equal(restartCustomScenario(saved).month,0);
assert.throws(()=>validateCustomDefinition({...big.scenario.definition,mapSize:48},96));assert.throws(()=>validateCustomDefinition({...big.scenario.definition,events:[{type:'camera',month:1,x:96,y:0,zoom:1}]}));

const terrain=createCity('Picking',false,96);for(const t of terrain.tiles)t.elevation=(t.x*7+t.y*3)%9;
for(const rotation of [0,1,2,3]){const r=Object.create(CityRenderer.prototype);Object.assign(r,{getCity:()=>terrain,rotation,zoom:.65,w:900,h:600,pan:{x:150,y:-200}});for(const [x,y]of [[2,2],[48,49],[91,93],[70,20]]){const p=r.project(x,y),px=p.x+3,py=p.y+r.unit/2;let found=null,depth=-Infinity;for(const t of terrain.tiles){const q=r.project(t.x,t.y),u=r.unit;if(Math.abs((px-q.x)/u)+Math.abs((py-q.y-u/2)/(u/2))>1)continue;const xy=r.transform(t.x,t.y),d=(xy[0]+xy[1])*96+xy[0];if(d>=depth){depth=d;found={x:t.x,y:t.y};}}assert.deepEqual(r.pick(px,py),found,'bounded picking matches exhaustive elevated-grid picking');}}
const estate=createCity('Far farm',false,96),root=idx(70,70,96);for(let y=70;y<73;y++)for(let x=70;x<73;x++)Object.assign(estate.tiles[idx(x,y,96)],{type:'industrial',industry:'farm',farmRoot:root,level:1});recompute(estate);assert.equal(estate.stats.farms,1);assert.equal(estate.stats.industrialJobs,12);assert.equal(zonedSprite(estate.tiles[root],estate.seed),52);assert.equal(CUSTOM_METRICS.farms.read(estate),1);assert.equal(metricLimit(CUSTOM_METRICS.structuresPark,96),9216);
const bad=JSON.parse(serializeCity(small));bad.size=96;assert.throws(()=>validateSave(bad));bad.size=49;assert.throws(()=>validateSave(bad));const old=JSON.parse(serializeCity(small));old.version=91;delete old.size;const migrated=validateSave(old);assert.equal(migrated.size,48);assert.equal(migrated.version,VERSION);
console.log('Map integration timings:',JSON.stringify(timing));
console.log('PASS: selectable map sizes through 256, far-edge construction/utilities/regional routes, independent city grids, saves and old-city migration, rotated navigation/picking, viewport bounds and large-map scenario replay.');
