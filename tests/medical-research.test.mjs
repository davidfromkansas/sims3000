import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {rewardCondition,rewardProgress,advanceRewards,STADIUM_APPROVAL} from '../dist/rewards.js';
import {rewardGeometry,rasterizeReward} from '../dist/reward-models.js';
const c=createCity('Medical science',false);c.funds=100000;c.startYear=1974;c.month=11;for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});
Object.assign(c.stats,{population:80000,aura:STADIUM_APPROVAL,lifeExpectancy:70});assert.equal(rewardCondition(c,'medicalResearch'),false);c.month=12;assert.equal(rewardCondition(c,'medicalResearch'),true);
for(const [key,value]of [['population',79999],['aura',STADIUM_APPROVAL-.001],['lifeExpectancy',69.999]]){const original=c.stats[key];c.stats[key]=value;assert.equal(rewardCondition(c,'medicalResearch'),false);c.stats[key]=original;}
assert.equal(rewardProgress(c,'medicalResearch').requirements.length,4);assert.ok(advanceRewards(c).includes('medicalResearch'));c.stats.lifeExpectancy=50;c.month++;advanceRewards(c);assert.equal(c.rewards.earned.medicalResearch,12);
for(const [tool,a,b]of [['coal',{x:35,y:15}],['powerline',{x:8,y:16},{x:34,y:16}],['road',{x:8,y:20},{x:30,y:20}],['residential',{x:8,y:18},{x:23,y:18}]])assert.ok(build(c,tool,selection(tool,a,b||a),3).ok);for(const t of c.tiles)if(t.type==='residential'){t.level=3;t.age=10;}recompute(c);
const funds=c.funds;assert.ok(build(c,'medicalResearch',[{x:27,y:21}]).ok);assert.equal(c.funds,funds-75000);assert.equal(c.tiles.filter(t=>t.type==='medicalResearch').length,9);assert.equal(c.stats.civicJobs,135);assert.equal(c.stats.civicEmployed,135);assert.equal(c.stats.serviceCounts.hospital,0);
const home=c.tiles[18*48+23];assert.ok(home.medicalResearchAura>0);assert.ok(home.medicalResearchLandValue>0);const aura=home.medicalResearchAura;recompute(c);assert.equal(home.medicalResearchAura,aura);assert.equal(build(c,'medicalResearch',[{x:10,y:25}]).ok,false);
home.radiation=true;recompute(c);assert.equal(home.environmentLandValue,1);assert.equal(home.medicalResearchLandValue,0);home.radiation=false;recompute(c);assert.ok(build(c,'industrial',[{x:24,y:18}]).ok);assert.equal(c.tiles[18*48+24].medicalResearchLandValue,0);
const saved=JSON.parse(serializeCity(c));assert.equal(saved.version,151);assert.equal(validateSave(saved).rewards.earned.medicalResearch,12);const old=structuredClone(saved);old.version=135;assert.throws(()=>validateSave(old));
const legacy=JSON.parse(serializeCity(createCity('Legacy',false)));legacy.version=135;delete legacy.rewards.earned.medicalResearch;delete legacy.rewards.streaks.medicalResearch;assert.equal(validateSave(legacy).rewards.earned.medicalResearch,null);const missing=structuredClone(legacy);missing.version=136;assert.throws(()=>validateSave(missing));
const corner=c.tiles[23*48+29];corner.fire=10;recompute(c);assert.equal(c.stats.civicJobs,0);assert.equal(home.medicalResearchAura,0);assert.equal(home.medicalResearchLandValue,0);corner.fire=0;recompute(c);assert.equal(c.stats.civicJobs,135);
assert.ok(build(c,'bulldoze',[{x:29,y:23}]).ok);assert.equal(c.tiles.filter(t=>t.type==='medicalResearch').length,0);c.funds=80000;assert.ok(build(c,'medicalResearch',[{x:27,y:21}]).ok);
assert.ok(rewardGeometry('medicalResearch').length>100);for(let r=0;r<4;r++){const image=rasterizeReward('medicalResearch',r);assert.ok(image.data.some((n,i)=>i%4===3&&n>0));}
console.log('PASS: Medical Research Center year/population/health/approval gates, durable offer, paid unique placement, 135 accessible jobs, local effects, damage, rebuild, schema migration and four-view geometry.');
