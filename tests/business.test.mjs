import assert from 'node:assert/strict';
import {createCity,build,recompute,tick,validateSave,idx} from '../dist/engine.js';
import {advanceBusiness,answerBusiness,businessStats} from '../dist/business.js';
import {startEarthquake,stepFire} from '../dist/emergency.js';
import {serializeCity} from '../dist/save.js';
function base(){const c=createCity('Business tradeoff',false);for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;}recompute(c);return c;}
const c=base();assert.equal(build(c,'casino',[{x:20,y:20}]).ok,false);assert.equal(answerBusiness(c,true).ok,false);c.month=6;c.stats.population=128;c.stats.balance=-1;assert.ok(advanceBusiness(c));assert.equal(advanceBusiness(c),false);assert.ok(answerBusiness(c,false).ok);assert.equal(advanceBusiness(c),false);c.month=18;assert.ok(advanceBusiness(c));assert.ok(answerBusiness(c,true).ok);assert.equal(answerBusiness(c,true).ok,false);recompute(c);assert.equal(c.stats.businessIncome,0);
Object.assign(c.tiles[idx(24,21)],{type:'residential',level:1});recompute(c);const crime=c.tiles[idx(24,21)].crime,funds=c.funds;assert.ok(build(c,'casino',[{x:20,y:20}]).ok);assert.equal(c.funds,funds);assert.equal(c.stats.businessIncome,150);assert.ok(c.tiles[idx(24,21)].crime>crime);assert.equal(build(c,'casino',[{x:30,y:30}]).ok,false);const balance=c.stats.balance;tick(c);assert.equal(c.funds,funds+balance);assert.equal(c.history.at(-1).income,c.stats.income);
const loaded=validateSave(JSON.parse(serializeCity(c)));assert.equal(serializeCity(loaded),serializeCity(c));assert.equal(loaded.stats.businessIncome,150);
assert.ok(build(c,'bulldoze',[{x:21,y:21}]).ok);assert.equal(c.stats.businessIncome,0);assert.equal(c.tiles.filter(t=>t.type==='casino').length,0);assert.ok(build(c,'casino',[{x:20,y:20}]).ok);startEarthquake(c,20,20);stepFire(c);recompute(c);assert.equal(businessStats(c).businessIncome,0);assert.equal(c.tiles.filter(t=>t.type==='casino').length,0);assert.ok(validateSave(JSON.parse(serializeCity(c))));
const bad=JSON.parse(serializeCity(loaded));bad.business.accepted=false;assert.throws(()=>validateSave(bad),/business placement/);
const legacy=JSON.parse(serializeCity(base()));legacy.version=28;delete legacy.business;assert.equal(validateSave(legacy).business.accepted,false);
const positive=base();positive.month=12;positive.stats.population=1000;positive.stats.balance=1;assert.equal(advanceBusiness(positive),false);positive.stats.balance=-10;positive.stats.population=100;assert.equal(advanceBusiness(positive),false);
console.log('PASS: business eligibility, decline delay, acceptance and deferred placement, unique footprint, stipend ledger, local crime, demolition/disaster loss and save validation.');
