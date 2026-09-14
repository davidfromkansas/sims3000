import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {REWARDS,REWARD_APPROVAL,rewardCondition,advanceRewards} from '../dist/rewards.js';
import {rewardGeometry,rasterizeReward} from '../dist/reward-models.js';
for(const [key,pop,cap,jobs,cost] of [['historicStatue',35000,10000,1,0],['lighthouse',15000,6000,8,5000]]){
 const c=createCity(key,false);c.startYear=2000;c.funds=100000;for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});
 c.stats.population=pop-1;c.stats.aura=REWARD_APPROVAL;assert.equal(rewardCondition(c,key),false);c.stats.population=pop;c.stats.aura-=.001;assert.equal(rewardCondition(c,key),false);c.stats.aura=REWARD_APPROVAL;c.month=1;assert.ok(advanceRewards(c).includes(key));c.stats.population=0;c.month++;advanceRewards(c);assert.equal(c.rewards.earned[key],1);
 const place=(k,a,b=a)=>assert.ok(build(c,k,selection(k,a,b)).ok);place('solar',{x:35,y:15});place('powerline',{x:8,y:16},{x:34,y:16});place('road',{x:8,y:20},{x:30,y:20});place('residential',{x:8,y:18},{x:24,y:18});for(const t of c.tiles)if(t.type==='residential')t.level=1;place('commercial',{x:24,y:19});place('industrial',{x:24,y:21});const funds=c.funds;place(key,{x:27,y:17});
 assert.equal(c.funds,funds-cost);assert.equal(c.tiles.filter(t=>t.type===key).length,REWARDS[key].size**2);assert.equal(c.stats.residentialCap.limit,25000+cap);assert.equal(c.stats.civicJobs,jobs);assert.equal(c.stats.civicEmployed,jobs);assert.equal(build(c,key,[{x:10,y:25}]).ok,false);
 const home=c.tiles[18*48+24];assert.ok(home.civicRewardLandValue>0);assert.ok(home.civicRewardAura>0);assert.equal(c.tiles[21*48+24].civicRewardLandValue>0,key==='historicStatue');const value=home.landValue;recompute(c);assert.equal(home.landValue,value);
 const saved=JSON.parse(serializeCity(c));assert.equal(saved.version,159);assert.equal(validateSave(saved).stats.residentialCap.limit,25000+cap);const old=structuredClone(saved);old.version=138;assert.throws(()=>validateSave(old));
 const member=c.tiles.filter(t=>t.type===key).at(-1);member.fire=5;recompute(c);assert.equal(c.stats.civicJobs,0);assert.equal(c.stats.residentialCap.limit,25000);assert.equal(home.civicRewardLandValue,0);assert.equal(home.civicRewardAura,0);member.fire=0;recompute(c);place('bulldoze',{x:member.x,y:member.y});assert.equal(c.tiles.filter(t=>t.type===key).length,0);place(key,{x:27,y:17});
 assert.ok(rewardGeometry(key).length>50);for(let r=0;r<4;r++)assert.ok(rasterizeReward(key,r).data.some((n,i)=>i%4===3&&n>0));
}
const legacy=JSON.parse(serializeCity(createCity('Legacy landmarks',false)));legacy.version=138;for(const key of ['historicStatue','lighthouse']){delete legacy.rewards.earned[key];delete legacy.rewards.streaks[key];}const migrated=validateSave(legacy);assert.equal(migrated.rewards.earned.lighthouse,null);assert.equal(migrated.rewards.earned.historicStatue,null);legacy.version=139;assert.throws(()=>validateSave(legacy));
console.log('PASS: Civic landmarks unlock boundaries, durable offers, price, unique footprints, jobs, growth capacity, neighborhood effects, damage/rebuild, legacy migration and four-view models.');
