import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {REWARDS,REWARD_APPROVAL,rewardCondition} from '../dist/rewards.js';
for(const type of ['cityHall','mayorHouse']){const c=createCity(type,false);c.startYear=2000;c.funds=100000;c.rewards.earned[type]=0;for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});const place=(k,a,b=a)=>assert.ok(build(c,k,selection(k,a,b)).ok);place('solar',{x:35,y:15});place('powerline',{x:8,y:16},{x:34,y:16});place('road',{x:8,y:20},{x:30,y:20});place('residential',{x:24,y:18});place('commercial',{x:24,y:19});place('industrial',{x:24,y:21});place(type,{x:27,y:17});
 const near=(y)=>c.tiles[y*48+24],f=7/11,values=type==='cityHall'?[10,25,0]:[23,20,2];for(const [i,y]of [18,19,21].entries())assert.ok(Math.abs(near(y).civicRewardLandValue-values[i]*f)<1e-9);assert.ok(near(18).civicRewardAura>0);const value=near(18).civicRewardLandValue;recompute(c);assert.equal(near(18).civicRewardLandValue,value);assert.equal(validateSave(JSON.parse(serializeCity(c))).tiles[18*48+24].civicRewardLandValue,value);
 const size=REWARDS[type].size;c.tiles[(17+size-1)*48+27+size-1].fire=5;recompute(c);assert.equal(near(18).civicRewardLandValue,0);assert.equal(near(18).civicRewardAura,0);
 const eligibility=createCity();eligibility.stats.population=type==='cityHall'?20000:5000;eligibility.stats.aura=50;assert.equal(rewardCondition(eligibility,type),false);eligibility.stats.aura=REWARD_APPROVAL;assert.equal(rewardCondition(eligibility,type),true);
}
const old=JSON.parse(serializeCity(createCity('Old progress',false)));old.version=136;old.month=5;old.rewards.lastMonth=5;old.rewards.streaks.mayorHouse=2;const migrated=validateSave(old);assert.equal(migrated.rewards.earned.mayorHouse,null);assert.equal(migrated.rewards.streaks.mayorHouse,0);
old.rewards.earned.mayorHouse=3;old.rewards.streaks.mayorHouse=3;const earned=validateSave(old);assert.equal(earned.rewards.earned.mayorHouse,3);assert.equal(earned.rewards.streaks.mayorHouse,1);
const invalid=structuredClone(old);invalid.version=137;assert.throws(()=>validateSave(invalid),/reward history/);
console.log('PASS: source-aligned civic approval gates, sector-specific neighborhood effects, operating shutdown, saved effects and earned/unearned legacy Mayor progress migration.');
