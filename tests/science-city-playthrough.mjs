import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {validateSave,build,selection,tick,recompute} from '../dist/engine.js';
import {changeCivic} from '../dist/civic.js';
import {serializeCity} from '../dist/save.js';
import {designateHistorical} from '../dist/historical.js';
import {isBuildingLotRoot,buildingLotMembers} from '../dist/building-lots.js';
import {landDensityLimit} from '../dist/economy.js';
import {utilityTrendSnapshot} from '../dist/utility-trends.js';
import {POWER_PLANTS} from '../dist/power.js';
const c=validateSave(JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/ordinary-city-month-749.json.gz',import.meta.url)))));
assert.ok(changeCivic(c,c.civic.funding,{...c.civic.ordinances,reading:true}).ok);recompute(c);
const put=(k,t)=>{const r=build(c,k,selection(k,t,t));assert.ok(r.ok,JSON.stringify({k,x:t.x,y:t.y,...r}));};
function renew(){
 if((c.month-749)%24!==0)return;
 const targets=c.tiles.filter(t=>t.age>=200&&(t.type==='pump'||t.type==='wasteEnergy'||POWER_PLANTS[t.type]&&t.root===t.y*c.size+t.x)).map(t=>({x:t.x,y:t.y,type:t.type}));
 for(const type of new Set(targets.map(t=>t.type))){const points=targets.filter(t=>t.type===type);if(POWER_PLANTS[type])for(const t of points){put('bulldoze',t);put(type,t);}else{assert.ok(build(c,'bulldoze',points).ok);assert.ok(build(c,type,points).ok);}}
 console.log(JSON.stringify({renewalMonth:c.month,buildings:targets.length,funds:c.funds}));
}
for(let i=0;i<480;i++){
 renew();
 tick(c);assert.ok(c.funds>0);assert.equal(c.finance.loans.length,0);assert.equal(c.emergency.active,false);
 if(i%12===11||c.stats.education>=90){console.log(JSON.stringify({month:c.month,year:c.startYear+Math.floor(c.month/12),population:c.stats.population,education:c.stats.education,aura:c.stats.aura,waste:c.stats.uncollectedWaste,coverage:[c.stats.childEducationCoverage,c.stats.collegeEducationCoverage,c.stats.libraryEducationCoverage,c.stats.museumEducationCoverage],funds:c.funds}));}
 if(c.stats.education>=90){const save=serializeCity(c);assert.equal(serializeCity(validateSave(JSON.parse(save))),save);console.log('PASS: ordinary city reached Science Center education threshold');break;}
}

if(c.stats.education<90){
 assert.equal(c.month,1229);
 put('library',{x:174,y:80});put('museum',{x:170,y:79});assert.equal(c.stats.libraryEducationCoverage,100);assert.equal(c.stats.museumEducationCoverage,100);
 for(let i=0;i<360&&c.stats.education<90;i++){
  renew();
  const preserve=c.tiles.filter(t=>t.type==='residential'&&t.density===3&&t.level===2&&!t.historicalLevel&&isBuildingLotRoot(c,t)&&buildingLotMembers(c,t).some(u=>landDensityLimit(u)<3));
  for(const t of preserve)assert.ok(designateHistorical(c,t.y*c.size+t.x,true).ok);
  if(preserve.length)recompute(c);
  const previousHigh=i>=120?new Set(c.tiles.filter(t=>t.type==='residential'&&t.level===3&&isBuildingLotRoot(c,t)).map(t=>t.y*c.size+t.x)):null;
  tick(c);if(previousHigh){let changed=false;for(const index of previousHigh){const t=c.tiles[index];if(t.type==='residential'&&t.level===2&&!t.historicalLevel){assert.ok(designateHistorical(c,index,true).ok);changed=true;}}if(changed)recompute(c);}assert.ok(c.funds>0);assert.equal(c.finance.loans.length,0);assert.equal(c.emergency.active,false);
  if(i%12===11||c.stats.education>=90)console.log(JSON.stringify({month:c.month,population:c.stats.population,education:c.stats.education,funds:c.funds}));
 }
}

assert.ok(c.stats.education>=90,'ordinary city must attain 90 EQ');
assert.ok(c.rewards.earned.scienceCenter!==null,'ordinary monthly evaluation must offer Science Center');
const offer=c.rewards.earned.scienceCenter;
// Use the road-connected gap between the Stock Exchange and Geyser Park.
for(let x=85;x<=89;x++)put('bulldoze',{x,y:95});
const funds=c.funds;put('scienceCenter',{x:85,y:91});assert.equal(c.funds,funds-75000);
const root=c.tiles[91*c.size+85];assert.equal(root.civicEmployed,375);
for(let i=0;i<12;i++){tick(c);assert.ok(c.funds>0);assert.equal(c.finance.loans.length,0);assert.equal(c.emergency.active,false);const u=utilityTrendSnapshot(c);assert.ok(u.powerUnserved<1e-7&&u.waterUnserved<1e-7);assert.equal(c.stats.uncollectedWaste,0);}
assert.equal(c.rewards.earned.scienceCenter,offer);assert.equal(root.civicEmployed,375);assert.equal(c.stats.uncollectedWaste,0);
const saved=serializeCity(c);assert.equal(serializeCity(validateSave(JSON.parse(saved))),saved);
console.log('PASS: ordinary Science Center progression, paid utility renewal, education threshold, earned placement, 375 filled jobs and one year of save-stable operation.',JSON.stringify({month:c.month,population:c.stats.population,education:c.stats.education,funds:c.funds}));
