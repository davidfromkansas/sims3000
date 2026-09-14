import assert from 'node:assert/strict';
import {generateCity} from '../dist/terrain-generator.js';
import {build,selection,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {utilityTrendSnapshot} from '../dist/utility-trends.js';
// Optional longer acceptance run: only ordinary construction and monthly ticks.
const c=generateCity({name:'Normal growth audit',size:256,water:0,mountains:0,trees:0,center:'dry',coasts:[],startYear:2000,difficulty:'easy'});
const place=(tool,a,b=a,d=1)=>{const r=build(c,tool,selection(tool,a,b),d);if(!r.ok)throw Error(tool+': '+r.error);};
place('coal',{x:2,y:2});place('coal',{x:2,y:8});place('powerline',{x:6,y:5},{x:10,y:5});place('powerline',{x:10,y:6},{x:10,y:15});
place('road',{x:10,y:20},{x:50,y:20});place('road',{x:10,y:30},{x:50,y:30});place('road',{x:10,y:21},{x:10,y:29});
for(const [type,left,right]of [['residential',11,29],['commercial',31,39],['industrial',41,49]])for(const [top,bottom]of [[16,19],[21,24]])place(type,{x:left,y:top},{x:right,y:bottom});
place('landfill',{x:41,y:27},{x:49,y:29});

const run=months=>{for(let i=0;i<months;i++){tick(c);assert.ok(c.funds>=0);assert.equal(c.emergency.active,false);}console.log('Month',c.month,'residents',c.stats.population,'treasury',c.funds);};
run(24);assert.equal(c.stats.population,1216);
place('surfaceWater',{x:54,y:15},{x:54,y:24});
for(let y=16;y<=23;y++)place('pump',{x:53,y});
place('powerline',{x:50,y:16},{x:52,y:16});
place('pipe',{x:53,y:16},{x:53,y:23});place('pipe',{x:10,y:20},{x:53,y:20});
for(const [type,left,right]of [['residential',11,29],['commercial',31,39],['industrial',41,49]])for(const [top,bottom]of [[16,19],[21,24]])place(type,{x:left,y:top},{x:right,y:bottom},3);
run(24);assert.equal(c.stats.population,2656);
place('coal',{x:2,y:14});place('coal',{x:2,y:20});
place('park',{x:11,y:15},{x:29,y:15});place('park',{x:11,y:25},{x:29,y:25});place('police',{x:31,y:25});place('fire',{x:27,y:26});
place('road',{x:51,y:30},{x:66,y:30});place('powerline',{x:55,y:25},{x:63,y:25});place('powerline',{x:63,y:26});place('jail',{x:63,y:27});
place('landfill',{x:41,y:31},{x:49,y:34});
place('surfaceWater',{x:54,y:25},{x:54,y:29});for(let y=24;y<=29;y++)place('pump',{x:53,y});place('pipe',{x:53,y:24},{x:53,y:29});
run(24);assert.equal(c.stats.population,6672);
const expand=base=>{
 for(let y=26+(base-40)/20*24;y<=44+(base-40)/20*24;y+=6)place('coal',{x:2,y});
 place('powerline',{x:6,y:base-15},{x:6,y:base+7});
 place('road',{x:10,y:base-9},{x:10,y:base+10});place('road',{x:11,y:base},{x:50,y:base});place('road',{x:11,y:base+10},{x:50,y:base+10});
 for(const [type,left,right]of [['residential',11,29],['commercial',31,39],['industrial',41,49]])for(const [top,bottom]of [[base-4,base-1],[base+1,base+4]])place(type,{x:left,y:top},{x:right,y:bottom},3);
 for(const y of [base-5,base+5])place('park',{x:11,y},{x:39,y});place('police',{x:31,y:base+6});place('fire',{x:27,y:base+6});
 place('landfill',{x:41,y:base+7},{x:49,y:base+9});
 place('surfaceWater',{x:54,y:base-5},{x:54,y:base+9});for(let y=base-4;y<=base+9;y++)place('pump',{x:53,y});place('pipe',{x:53,y:base-10},{x:53,y:base+9});place('pipe',{x:10,y:base},{x:53,y:base});
};
expand(40);run(24);assert.ok(c.stats.uncollectedWaste>0);assert.equal(c.stats.population,5776);
place('road',{x:67,y:30},{x:89,y:30});for(let x=70;x<90;x+=2)place('wasteEnergy',{x,y:31});place('powerline',{x:67,y:29},{x:89,y:29});
expand(60);run(24);expand(80);place('bulldoze',{x:8,y:5});place('road',{x:8,y:2},{x:8,y:94});place('road',{x:8,y:30},{x:9,y:30});place('wasteEnergy',{x:89,y:31});place('wasteEnergy',{x:90,y:31});run(24);
assert.equal(c.stats.population,32016);
place('powerline',{x:6,y:0},{x:6,y:249});place('powerline',{x:6,y:0},{x:124,y:0});place('powerline',{x:124,y:1},{x:124,y:249});
place('road',{x:8,y:95},{x:8,y:250});place('bulldoze',{x:124,y:30});place('road',{x:90,y:30},{x:126,y:30});place('road',{x:126,y:2},{x:126,y:34});
let plant=16;
for(const base of [100,120,140,160,180,200,220,240]){
 for(let i=0;i<4;i++,plant++)place('nuclear',{x:plant<42?2:120,y:2+(plant%42)*6});
 if(c.tiles[(base+10)*c.size+124].type)place('bulldoze',{x:124,y:base+10});
 place('road',{x:10,y:base-9},{x:10,y:base+10});place('road',{x:11,y:base},{x:100,y:base});place('road',{x:11,y:base+10},{x:174,y:base+10});
 for(const offset of [0,50]){
  for(const [type,left,right]of [['residential',11,29],['commercial',31,39],['industrial',41,49]])for(const [top,bottom]of [[base-4,base-1],[base+1,base+4]])place(type,{x:left+offset,y:top},{x:right+offset,y:bottom},3);
  for(const y of [base-5,base+5])place('park',{x:11+offset,y},{x:39+offset,y});place('police',{x:31+offset,y:base+6});place('fire',{x:27+offset,y:base+6});
 }
 place('jail',{x:112,y:base+6});place('powerline',{x:105,y:base+9},{x:119,y:base+9});
 for(const lake of [54,104]){for(let y=base-5;y<=base+9;y++)if(lake!==54||y!==base)place('surfaceWater',{x:lake,y});for(const x of lake===54?[53]:[102,103]){for(let y=base-4;y<=base+9;y++)if(x!==53||y!==base)place('pump',{x,y});place('pipe',{x,y:base-10},{x,y:base+9});}}
 place('pipe',{x:10,y:base},{x:103,y:base});
 for(let x=150;x<=172;x+=2)place('wasteEnergy',{x,y:base+9});place('powerline',{x:125,y:base+8},{x:174,y:base+8});
 run(24);
}
for(const base of [100,120,140]){
 place('road',{x:175,y:base+10},{x:210,y:base+10});place('road',{x:176,y:base},{x:176,y:base+9});place('road',{x:210,y:base},{x:210,y:base+9});place('road',{x:177,y:base},{x:209,y:base});
 for(const [top,bottom]of [[base+1,base+4],[base+6,base+9]])place('industrial',{x:177,y:top},{x:208,y:bottom},3);
 place('pipe',{x:103,y:base},{x:210,y:base});place('pipe',{x:177,y:base+7},{x:208,y:base+7});place('pipe',{x:177,y:base},{x:177,y:base+7});
}
for(let i=0;i<36&&c.stats.population<150000;i++)run(1);
assert.ok(c.stats.population>=150000);assert.equal(c.finance.nextLoanId,1);assert.equal(c.stats.uncollectedWaste,0);const u=utilityTrendSnapshot(c);assert.ok(u.powerUnserved<1e-7);assert.ok(u.waterUnserved<1e-7);
const restored=validateSave(JSON.parse(serializeCity(c)));assert.equal(serializeCity(restored),serializeCity(c));
console.log('PASS: ordinary construction on an empty 256 map reaches 150,000 residents without grants or loans, with served utilities and no garbage backlog.');
