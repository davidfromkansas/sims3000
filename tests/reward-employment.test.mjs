import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
for(const [type,capacity] of [['stadium',200],['university',500]]){
 const c=createCity('Reward workers',false);c.funds=100000;for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});c.rewards.earned[type]=0;
 for(const [tool,a,b] of [['coal',{x:35,y:15}],['powerline',{x:8,y:16},{x:34,y:16}],['road',{x:8,y:20},{x:30,y:20}],['residential',{x:8,y:18},{x:23,y:18}]])assert.ok(build(c,tool,selection(tool,a,b||a),3).ok);for(const t of c.tiles)if(t.type==='residential'){t.level=3;t.age=10;}recompute(c);
 assert.ok(build(c,type,[{x:27,y:21}]).ok);assert.equal(c.stats.civicJobs,capacity);assert.equal(c.stats.civicEmployed,capacity);assert.equal(c.stats.jobs,capacity);assert.equal(c.tiles.filter(t=>t.type===type).reduce((sum,t)=>sum+(t.civicEmployed||0),0),capacity,'whole reward footprint contributes once');assert.ok(c.stats.peakTraffic>0);const saved=validateSave(JSON.parse(serializeCity(c)));assert.equal(saved.stats.civicEmployed,capacity);c.finance.roadCondition=0;recompute(c);assert.equal(c.stats.civicJobs,0);assert.equal(c.stats.civicEmployed,0);c.finance.roadCondition=100;recompute(c);assert.equal(c.stats.civicJobs,capacity);
}
console.log('PASS: stadium and university supply finite 200/500-job pools, real commutes, no footprint duplication, service-loss recovery and saved employment.');
