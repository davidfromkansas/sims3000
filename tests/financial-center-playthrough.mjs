// Optional acceptance run: an ordinary saved city expands, renews aging utilities,
// reaches 200,000, and places its earned Stock Exchange. No population or fund edits.
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {validateSave,build,selection,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {utilityTrendSnapshot} from '../dist/utility-trends.js';
import {POWER_PLANTS} from '../dist/power.js';
import {rewardActive} from '../dist/rewards.js';
let c=validateSave(JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/ordinary-city-month-640.json.gz',import.meta.url)))));
assert.equal(c.month,640);assert.equal(c.stats.population,178832);assert.equal(c.finance.nextLoanId,1);
const put=(k,a,b=a,d=1)=>{const r=build(c,k,selection(k,a,b),d);assert.ok(r.ok,JSON.stringify({k,a,b,...r}));};
const wires=(a,b)=>{for(let y=a.y;y<=b.y;y++)for(let x=a.x;x<=b.x;x++)if(c.tiles[y*c.size+x].type==='powerline')put('bulldoze',{x,y});};
put('road',{x:108,y:20},{x:108,y:35});put('surfaceWater',{x:103,y:22});put('pump',{x:104,y:22});put('pipe',{x:104,y:22},{x:107,y:22});put('pipe',{x:104,y:23},{x:104,y:30});put('airport',{x:105,y:20},{x:107,y:29});for(const x of [130,136])for(const y of [20,26])put('nuclear',{x,y});put('road',{x:134,y:20},{x:134,y:30});put('road',{x:127,y:30},{x:133,y:30});put('powerline',{x:128,y:24});
for(const base of [160,180,200]){
 wires({x:110,y:base-9},{x:110,y:base+9});put('road',{x:110,y:base-9},{x:110,y:base+9});wires({x:111,y:base},{x:140,y:base});put('road',{x:111,y:base},{x:140,y:base});
 for(const [type,left,right] of [['residential',111,129],['commercial',131,139]])for(const [top,bottom] of [[base-4,base-1],[base+1,base+4]]){wires({x:left,y:top},{x:right,y:bottom});put(type,{x:left,y:top},{x:right,y:bottom},3);}
 for(const y of [base-5,base+5]){wires({x:111,y},{x:139,y});put('park',{x:111,y},{x:139,y});}
 wires({x:130,y:base+6},{x:132,y:base+8});put('police',{x:130,y:base+6});wires({x:134,y:base+6},{x:136,y:base+8});put('fire',{x:134,y:base+6});put('hospital',{x:144,y:base-4});put('school',{x:144,y:base+1});put('surfaceWater',{x:143,y:base-6},{x:143,y:base+6});for(let y=base-5;y<=base+6;y++)put('pump',{x:142,y});put('pipe',{x:142,y:base-5},{x:142,y:base+6});put('pipe',{x:104,y:base},{x:142,y:base});
 put('road',{x:175,y:base+10},{x:184,y:base+10});for(let x=176;x<=182;x+=2)put('wasteEnergy',{x,y:base+9});put('powerline',{x:175,y:base+8},{x:184,y:base+8});
 console.log(JSON.stringify({builtDistrict:base,month:c.month,funds:c.funds}));for(let i=0;i<24;i++){tick(c);assert.ok(c.funds>0);assert.equal(c.emergency.active,false);if(i%6===5)console.log(JSON.stringify({month:c.month,population:c.stats.population,jobs:c.stats.jobs,waste:c.stats.uncollectedWaste,utilities:utilityTrendSnapshot(c),demand:c.stats.demand}));}if(c.stats.population>=200000)break;
}

// Reload the expansion checkpoint, then rebuild old facilities using ordinary tools.
c=validateSave(JSON.parse(serializeCity(c)));
for(const [name,filter,count] of [['waste',t=>t.type==='wasteEnergy',60],['water',t=>t.type==='pump',140],['power',t=>POWER_PLANTS[t.type]&&t.root===t.y*c.size+t.x,20]]){const targets=c.tiles.filter(filter).sort((a,b)=>b.age-a.age).slice(0,count).map(t=>({x:t.x,y:t.y,type:t.type}));for(const t of targets){put('bulldoze',t);put(t.type,t);}console.log(JSON.stringify({renewed:name,count:targets.length,funds:c.funds}));}

for(let i=0;i<48;i++){tick(c);assert.ok(c.funds>0);assert.equal(c.emergency.active,false);const u=utilityTrendSnapshot(c);if(i%6===5||c.stats.population>=200000)console.log(JSON.stringify({month:c.month,population:c.stats.population,jobs:c.stats.jobs,waste:c.stats.uncollectedWaste,utilities:u,stockOffer:c.rewards.earned.stockExchange}));if(c.stats.population>=200000&&c.rewards.earned.stockExchange!==null&&c.stats.uncollectedWaste===0&&u.powerUnserved<1e-7&&u.waterUnserved<1e-7)break;}

assert.ok(c.stats.population>=200000);assert.notEqual(c.rewards.earned.stockExchange,null);assert.equal(c.finance.nextLoanId,1);
c=validateSave(JSON.parse(serializeCity(c)));
const before={funds:c.funds,jobs:c.stats.civicJobs};put('stockExchange',{x:80,y:91});const root=c.tiles[91*c.size+80];assert.equal(c.funds,before.funds);assert.equal(c.stats.civicJobs,before.jobs+480);assert.equal(root.civicEmployed,480);assert.equal(rewardActive(c,root),true);
for(let i=0;i<12;i++){tick(c);const u=utilityTrendSnapshot(c);assert.ok(u.powerUnserved<1e-7&&u.waterUnserved<1e-7);assert.equal(c.stats.uncollectedWaste,0);assert.ok(c.funds>0);}
const save=serializeCity(c);assert.equal(serializeCity(validateSave(JSON.parse(save))),save);
console.log('PASS: ordinary 200,000-resident expansion, aged-utility recovery, earned Stock Exchange, 480 filled jobs, served utilities, no loans, zero backlog and saved continuity.',{month:c.month,population:c.stats.population,funds:c.funds});
