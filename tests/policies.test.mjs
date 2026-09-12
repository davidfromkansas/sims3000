import assert from 'node:assert/strict';
import {createCity,build,recompute,selection,idx,tick,validateSave} from '../dist/engine.js';
import {changeCivic,civicSpending} from '../dist/civic.js';
import {serializeCity} from '../dist/save.js';
function fixture(){const c=createCity('Policy comparison',false);for(const t of c.tiles){t.terrain='land';t.nature=false;}build(c,'road',selection('road',{x:12,y:20},{x:40,y:20}));for(let y=16;y<=19;y++)for(let x=12;x<=15;x++)Object.assign(c.tiles[idx(x,y)],{type:'residential',level:3,density:3});for(let y=21;y<=24;y++)for(let x=36;x<=39;x++)Object.assign(c.tiles[idx(x,y)],{type:'industrial',level:3,density:3});recompute(c);return c;}
function set(c,key,value){assert.ok(changeCivic(c,c.civic.funding,{...c.civic.ordinances,[key]:value}).ok);recompute(c);}
const c=fixture(),before={...c.stats};set(c,'carpool',true);assert.equal(c.stats.commuters,before.commuters);assert.equal(c.stats.unemployed,0);assert.ok(c.stats.peakTraffic<before.peakTraffic);assert.ok(c.stats.averagePollution<before.averagePollution);assert.ok(Math.abs(c.stats.carpoolVehiclesSaved-c.stats.commuters*.3)<1e-8);assert.equal(civicSpending(c).ordinances,15);
set(c,'carpool',false);assert.equal(c.stats.peakTraffic,before.peakTraffic);assert.equal(c.stats.carpoolVehiclesSaved,0);
assert.ok(build(c,'busStop',[{x:14,y:21}]).ok);const riders=c.stats.busRiders,fare=c.stats.transitFare;set(c,'carpool',true);assert.equal(c.stats.busRiders,riders);assert.equal(c.stats.transitFare,fare);assert.ok(Math.abs(c.stats.carpoolVehiclesSaved-(c.stats.commuters-riders)*.3)<1e-8);
const industrial=c.tiles[idx(32,18)],air=industrial.airPollution,water=industrial.waterPollution;set(c,'cleanAir',true);assert.ok(industrial.airPollution<air);assert.equal(industrial.waterPollution,water);assert.equal(civicSpending(c).ordinances,35);const funds=c.funds,balance=c.stats.balance;tick(c);assert.equal(c.funds,funds+balance);
const loaded=validateSave(JSON.parse(serializeCity(c)));assert.equal(serializeCity(loaded),serializeCity(c));assert.equal(loaded.civic.ordinances.carpool,true);assert.equal(loaded.civic.ordinances.cleanAir,true);
const legacy=JSON.parse(serializeCity(c));legacy.version=26;delete legacy.civic.ordinances.carpool;delete legacy.civic.ordinances.cleanAir;assert.equal(validateSave(legacy).civic.ordinances.carpool,false);
const bad=JSON.parse(serializeCity(c));bad.civic.ordinances.cleanAir='yes';assert.throws(()=>validateSave(bad),/civic/);
const disconnected=fixture();build(disconnected,'bulldoze',[{x:26,y:20}]);set(disconnected,'carpool',true);assert.equal(disconnected.stats.carpoolVehiclesSaved,0);assert.equal(disconnected.stats.unemployed,disconnected.stats.commuters);
console.log('PASS: carpool traffic without lost workers, transit exclusion, repeal, clean-air emissions, unchanged water pollution, policy costs, ledger and saves.');
