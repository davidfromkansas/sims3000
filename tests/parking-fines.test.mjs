import {freshDemographics} from '../dist/demographics.js';
import assert from 'node:assert/strict';
import {createCity,build,recompute,selection,idx,tick,validateSave} from '../dist/engine.js';
import {changeCivic,ordinanceRevenue} from '../dist/civic.js';
import {annualAccounts} from '../dist/economy.js';
import {serializeCity} from '../dist/save.js';
function fixture(){const c=createCity('Policy revenue',false);for(const t of c.tiles){t.terrain='land';t.nature=false;}build(c,'road',selection('road',{x:12,y:20},{x:40,y:20}));for(let x=12;x<16;x++)Object.assign(c.tiles[idx(x,19)],{type:'residential',level:3,density:3});for(let x=36;x<40;x++)Object.assign(c.tiles[idx(x,21)],{type:'industrial',level:3,density:3});c.demographics=freshDemographics(256,0);recompute(c);return c;}
function set(c,key,value){assert.ok(changeCivic(c,c.civic.funding,{...c.civic.ordinances,[key]:value}).ok);recompute(c);}
const c=fixture(),original={...c.stats};set(c,'parkingFines',true);assert.equal(c.stats.ordinanceIncome,64);assert.equal(c.stats.income,original.income+64);assert.equal(c.stats.aura,original.aura-3);assert.equal(c.stats.expenses,original.expenses);assert.equal(c.stats.commuters,original.commuters);
const income=c.stats.income,balance=c.stats.balance,funds=c.funds;tick(c);assert.equal(c.funds,funds+balance);assert.equal(c.history.at(-1).income,income);assert.equal(annualAccounts(c,12).income,income);
const loaded=validateSave(JSON.parse(serializeCity(c)));assert.equal(serializeCity(loaded),serializeCity(c));assert.equal(loaded.civic.ordinances.parkingFines,true);
set(c,'parkingFines',false);assert.equal(c.stats.ordinanceIncome,0);set(c,'parkingFines',true);const preCarpool=c.stats.ordinanceIncome;set(c,'carpool',true);assert.ok(c.stats.ordinanceIncome<preCarpool);const preBus=c.stats.ordinanceIncome;build(c,'busStop',[{x:14,y:21}]);assert.ok(c.stats.ordinanceIncome<preBus);
const noRoad=fixture();build(noRoad,'bulldoze',[{x:26,y:20}]);set(noRoad,'parkingFines',true);assert.equal(noRoad.stats.ordinanceIncome,0);
const empty=createCity('No residents',false);set(empty,'parkingFines',true);assert.equal(empty.stats.ordinanceIncome,0);
const legacy=JSON.parse(serializeCity(c));legacy.version=27;delete legacy.civic.ordinances.parkingFines;assert.equal(validateSave(legacy).civic.ordinances.parkingFines,false);
const malformed=JSON.parse(serializeCity(c));malformed.civic.ordinances.parkingFines=3;assert.throws(()=>validateSave(malformed),/civic/);
const before=serializeCity(c),draft={...c.civic.ordinances,parkingFines:false};assert.equal(ordinanceRevenue(c,draft).parkingFines,0);assert.equal(serializeCity(c),before);
console.log('PASS: ordinance income, aura tradeoff, monthly and annual ledgers, carpool/transit effects, repeal, empty/disconnected cities, draft isolation and saves.');
