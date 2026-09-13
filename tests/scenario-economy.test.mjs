import assert from 'node:assert/strict';
import {createCity,tick,recompute,validateSave,VERSION} from '../dist/engine.js';
import {changeBudget,takeLoan,settleLoans,budgetForecast} from '../dist/economy.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
import {attachCustomScenario,validateCustomDefinition,customCurrentGoals} from '../dist/custom-scenarios.js';
import {eventConditionMet,validateEventCondition} from '../dist/scenario-events.js';
import {expandScenarioText} from '../dist/scenario-text.js';
import {serializeCity} from '../dist/save.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
const c=createCity('Debt retirement',false);assert.ok(takeLoan(c,5000).ok);assert.ok(takeLoan(c,25000).ok);assert.equal(CUSTOM_METRICS.totalDebt.read(c),45000);assert.equal(CUSTOM_METRICS.totalDebt.read(c),budgetForecast(c).totalOutstandingPayments);
c.month=108;assert.equal(settleLoans(c),40500);assert.equal(CUSTOM_METRICS.totalDebt.read(c),4500);c.month=119;c.funds=100000;
assert.ok(changeBudget(c,{residential:6.5,commercial:8.1,industrial:9.2},100).ok);recompute(c);
for(const sector of ['residential','commercial','industrial'])assert.equal(CUSTOM_METRICS[sector+'Tax'].read(c),c.finance.taxes[sector]);assert.equal(CUSTOM_METRICS.landValue.read(c),c.stats.averageLandValue);
attachCustomScenario(c,{title:'Debt retirement',months:24,objectives:[{metric:'totalDebt',target:0},{metric:'residentialTax',target:6.5}],events:[{type:'announcement',month:1,message:'Debt {totalDebt}; residential rate {residentialTax}%.',condition:{metric:'totalDebt',operator:'eq',target:0}}]});
assert.match(customCurrentGoals(c).map(g=>g.title).join(' '),/principal \+ interest/);const saved=serializeCity(c),loaded=validateSave(JSON.parse(saved));tick(c);tick(loaded);assert.equal(c.scenario.status,'won');assert.equal(c.scenario.events[0].message,'Debt 0; residential rate 6.5%.');assert.deepEqual(c.scenario,loaded.scenario);assert.equal(c.finance.loans.length,0);
const replay=restartCustomScenario(validateSave(JSON.parse(serializeCity(c))));assert.equal(CUSTOM_METRICS.totalDebt.read(replay),4500);tick(replay);assert.equal(replay.scenario.status,'won');
for(const metric of ['landValue','totalDebt','residentialTax','commercialTax','industrialTax']){
 const m=CUSTOM_METRICS[metric],current=m.read(c),before=serializeCity(c);for(const [operator,expected] of [['eq',true],['ne',false],['gte',true],['lte',true],['gt',false],['lt',false]])assert.equal(eventConditionMet(c,{metric,target:current,operator}),expected);
 assert.notEqual(expandScenarioText('{'+metric+'}',c),'{'+metric+'}');assert.equal(serializeCity(c),before);
 for(const target of [-1,m.max+1,NaN,Infinity]){assert.throws(()=>validateCustomDefinition({title:'Invalid',months:12,objectives:[{metric,target}]}));assert.throws(()=>validateEventCondition({metric,target,operator:'eq'}));}
}
const maximum=createCity();for(let i=0;i<10;i++)assert.ok(takeLoan(maximum,25000).ok);assert.equal(CUSTOM_METRICS.totalDebt.read(maximum),375000);
const copy=createCity();changeBudget(copy,{residential:6.5,commercial:7,industrial:7},100);attachCustomScenario(copy,{title:'Copy economic values',months:12,objectives:[{metric:'population',target:999999}],events:[{type:'variable',month:1,variable:0,operation:'copy',metric:'residentialTax'}]});tick(copy);assert.equal(copy.scenario.variables[0],7,'the existing integer variable system rounds fractional metrics');
const old=JSON.parse(saved);old.version=106;assert.equal(validateSave(old).version,VERSION);
console.log('PASS: live sector taxes and land value, maximum and amortized contractual debt, real final-loan-payment challenge, saved continuation/replay, all comparisons, text, variable copying and invalid thresholds.');
