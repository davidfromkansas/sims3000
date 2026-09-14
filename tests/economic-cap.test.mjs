import assert from 'node:assert/strict';
import {createCity,build,selection,idx,recompute,tick,validateSave} from '../dist/engine.js';
import {addConnection,connectionCandidates} from '../dist/region.js';
import {economicGrowthFits,economicCapReport} from '../dist/economic-cap.js';
import {serializeCity} from '../dist/save.js';
import {zoneGrowthConditions} from '../dist/zone-growth.js';
const base=()=>{const c=createCity('Economic capacity',false);for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});return c;};
const c=base();assert.equal(c.stats.economicCaps.commercial.limit,25000);assert.equal(c.stats.economicCaps.industrial.limit,70000);
for(const [kind,y,expected] of [['road',10,[37000,82000]],['highway',12,[57000,96000]],['rail',14,[57000,121000]]]){assert.ok(build(c,kind,[{x:47,y}]).ok);assert.ok(addConnection(c,connectionCandidates(c).find(p=>p.kind===kind&&p.tile===idx(47,y))).ok);recompute(c);assert.deepEqual(['commercial','industrial'].map(s=>c.stats.economicCaps[s].limit),expected);}
assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).stats.economicCaps,c.stats.economicCaps);assert.match(economicCapReport(c),/rail connection · east: \+25,000/);
assert.ok(build(c,'bulldoze',[{x:47,y:10}]).ok);assert.equal(c.stats.economicCaps.commercial.limit,45000);c.finance.roadCondition=20;recompute(c);assert.equal(c.stats.economicCaps.commercial.limit,25000);
const live=base();for(let y=0;y<48;y++)live.tiles[idx(18,y)].terrain='water';for(const [tool,x,y]of [['pump',19,21],['coal',26,20]])assert.ok(build(live,tool,[{x,y}]).ok);for(const [tool,a,b]of [['pipe',{x:19,y:21},{x:23,y:21}],['road',{x:24,y:20},{x:24,y:25}],['airport',{x:20,y:20},{x:22,y:24}]])assert.ok(build(live,tool,selection(tool,a,b)).ok);
assert.equal(live.stats.economicCaps.commercial.limit,25000);for(let i=0;i<6;i++)tick(live);assert.equal(live.stats.economicCaps.commercial.limit,32500);assert.equal(live.stats.economicCaps.industrial.limit,71500);assert.ok(build(live,'bulldoze',[{x:26,y:20}]).ok);assert.equal(live.stats.economicCaps.commercial.limit,25000);
for(const type of ['commercial','industrial']){const rate=type==='commercial'?6:12,holder={stats:{economicCaps:{[type]:{remaining:rate*4-1}}}},tile={type,level:0};assert.equal(economicGrowthFits(holder,tile,Array(4)),false);holder.stats.economicCaps[type].remaining++;assert.equal(economicGrowthFits(holder,tile,Array(4)),true);}
const shop=live.tiles[idx(10,10)];Object.assign(shop,{type:'commercial',level:0,density:1,powered:true,access:true,watered:true,marketDemandBonus:100});live.stats.marketDemandBase.commercial=100;live.stats.economicCaps.commercial.remaining=0;assert.equal(zoneGrowthConditions(live,shop).demand,0,'local market bonus cannot bypass cap');
for(const sector of ['commercial','industrial']){
 const city=createCity('Full '+sector,false,128);city.startYear=2000;city.funds=1000000;let count=0;const target=sector==='commercial'?4167:5834;
 for(const t of city.tiles){Object.assign(t,{terrain:'land',nature:false,elevation:0,age:40,density:1});if(t.x%4===0||t.y%4===0)t.type='road';else if(t.x%12===1&&t.y%12===1){t.type='wind';t.root=t.y*128+t.x;}else if(count<target){t.type=sector;t.level=1;count++;}else{t.type='residential';t.level=3;t.density=3;}}
 recompute(city);const vacant=city.tiles.find(t=>t.type==='residential'&&t.powered&&t.access);assert.ok(vacant);Object.assign(vacant,{type:sector,level:0,density:1});recompute(city);const before=city.stats[sector==='commercial'?'commercialJobs':'industrialJobs'];assert.equal(city.stats.economicCaps[sector].remaining,0);tick(city);assert.equal(vacant.level,0);assert.equal(city.stats[sector==='commercial'?'commercialJobs':'industrialJobs'],before,'existing over-cap jobs persist without capacity-driven eviction');
}
console.log('PASS: economic base capacities, paid road/highway/rail relief, demolition and road-condition loss, real timed airport development and supply loss, save/report continuity and local/multi-tile growth gates.');
