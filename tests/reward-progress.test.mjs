import assert from 'node:assert/strict';
import {REWARDS,freshRewards,rewardCondition,rewardProgress,advanceRewards} from '../dist/rewards.js';
import {rewardChecklist} from '../dist/rewards-ui.js';
const c={month:0,tiles:[],rewards:freshRewards(),stats:{population:20000,aura:55,balance:0,education:65,activeServices:{college:1}}};
assert.equal(rewardCondition(c,'stadium'),false,'zero balance must not qualify');
let p=rewardProgress(c,'stadium');
assert.deepEqual(p.requirements.map(r=>r.met),[true,true,false]);
assert.match(rewardChecklist(p),/More than §0/);
assert.match(rewardChecklist(p),/Missing/);
c.stats.balance=.01;
assert.equal(rewardCondition(c,'stadium'),true);
for(let i=1;i<=2;i++){c.month=i;advanceRewards(c);}
p=rewardProgress(c,'stadium');assert.equal(p.streak,2);assert.equal(p.remaining,4);
const before=JSON.stringify(c);rewardChecklist(p);rewardProgress(c,'stadium');assert.equal(JSON.stringify(c),before,'inspection cannot advance simulation');
c.stats.aura=54.99;p=rewardProgress(c,'stadium');assert.equal(p.qualifying,false);assert.equal(p.remaining,6);assert.match(p.next,/will reset/);
c.month++;advanceRewards(c);assert.equal(c.rewards.streaks.stadium,0);
c.stats.aura=55;for(let i=0;i<6;i++){c.month++;advanceRewards(c);}
c.stats.population=0;p=rewardProgress(c,'stadium');assert.equal(p.earned,true);assert.match(p.next,/offer is saved/);
c.tiles.push({type:'stadium'});assert.match(rewardProgress(c,'stadium').next,/Already placed/);
c.tiles=[];assert.match(rewardProgress(c,'stadium').next,/place this reward/);
c.stats.population=0;c.stats.activeServices.college=0;c.stats.education=70;
assert.equal(rewardCondition(c,'university'),true,'education alone qualifies');
assert.equal(rewardProgress(c,'university').requirements.length,1);
c.stats.education=69.999;assert.equal(rewardCondition(c,'university'),false);
assert.equal(rewardCondition(c,'unknown'),false);
for(const k of Object.keys(REWARDS))assert.equal(rewardCondition(c,k),rewardProgress(c,k).requirements.every(r=>r.met));
console.log('PASS: reward checklist tracks exact eligibility, strict balance, monthly streak reset, retained offers, rebuilding and education-only university eligibility without mutating city state.');
