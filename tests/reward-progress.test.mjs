import assert from 'node:assert/strict';
import {REWARDS,freshRewards,rewardCondition,rewardProgress,advanceRewards} from '../dist/rewards.js';
import {rewardChecklist} from '../dist/rewards-ui.js';
const c={month:0,tiles:[],rewards:freshRewards(),stats:{population:20000,aura:55,balance:0,education:65,activeServices:{college:1}}};
let p=rewardProgress(c,'mayorHouse');
assert.deepEqual(p.requirements.map(r=>r.met),[true,true]);
assert.match(rewardChecklist(p),/At least 5,000/);
for(let i=1;i<=2;i++){c.month=i;advanceRewards(c);}
p=rewardProgress(c,'mayorHouse');assert.equal(p.streak,2);assert.equal(p.remaining,1);
const before=JSON.stringify(c);rewardChecklist(p);rewardProgress(c,'mayorHouse');assert.equal(JSON.stringify(c),before,'inspection cannot advance simulation');
c.stats.aura=49.99;p=rewardProgress(c,'mayorHouse');assert.equal(p.qualifying,false);assert.equal(p.remaining,3);assert.match(p.next,/will reset/);
c.month++;advanceRewards(c);assert.equal(c.rewards.streaks.mayorHouse,0);
c.stats.aura=55;for(let i=0;i<6;i++){c.month++;advanceRewards(c);}
c.stats.population=0;p=rewardProgress(c,'mayorHouse');assert.equal(p.earned,true);assert.match(p.next,/offer is saved/);
c.tiles.push({type:'mayorHouse'});assert.match(rewardProgress(c,'mayorHouse').next,/Already placed/);
c.tiles=[];assert.match(rewardProgress(c,'mayorHouse').next,/place this reward/);
c.stats.population=0;c.stats.activeServices.college=0;c.stats.education=70;
assert.equal(rewardCondition(c,'university'),true,'education alone qualifies');
assert.equal(rewardProgress(c,'university').requirements.length,1);
c.stats.education=69.999;assert.equal(rewardCondition(c,'university'),false);
assert.equal(rewardCondition(c,'unknown'),false);
for(const k of Object.keys(REWARDS))assert.equal(rewardCondition(c,k),rewardProgress(c,k).requirements.every(r=>r.met));
console.log('PASS: reward checklist tracks exact eligibility, monthly streak reset, retained offers, rebuilding and education-only university eligibility without mutating city state.');
