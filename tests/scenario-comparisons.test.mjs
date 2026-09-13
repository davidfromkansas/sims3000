import assert from 'node:assert/strict';
import {createCity,tick,validateSave} from '../dist/engine.js';
import {attachCustomScenario} from '../dist/custom-scenarios.js';
import {eventConditionMet,eventConditionLabel,validateEventCondition} from '../dist/scenario-events.js';
import {serializeCity} from '../dist/save.js';
const c=createCity('Comparison boundaries',false);
const expected={gte:[false,true,true],lte:[true,true,false],gt:[false,false,true],lt:[true,false,false],eq:[false,true,false],ne:[true,false,true]};
for(const [operator,answers]of Object.entries(expected)){const condition=validateEventCondition({metric:'funds',operator,target:50});for(const [i,value]of [49,50,51].entries()){c.funds=value;assert.equal(eventConditionMet(c,condition),answers[i],operator+' at '+value);}c.funds=NaN;assert.equal(eventConditionMet(c,condition),false);assert.ok(eventConditionLabel(condition).includes({gte:'≥',lte:'≤',gt:'>',lt:'<',eq:'=',ne:'≠'}[operator]));}
c.funds=50.25;assert.equal(eventConditionMet(c,{metric:'funds',operator:'eq',target:50}),false,'exact comparisons use unrounded values');assert.equal(eventConditionMet(c,{metric:'funds',operator:'gt',target:50}),true);
const within=validateEventCondition({match:'all',conditions:[{metric:'funds',operator:'gt',target:50},{metric:'funds',operator:'lt',target:51}]});assert.equal(eventConditionMet(c,within),true);
const d={title:'Exact sequence',months:12,completionMode:'scripted',eventMode:'together',objectives:[{metric:'funds',target:0}],ranks:[{name:'Exact result',outcome:'won',message:'Four increments',condition:{metric:'variable1',operator:'eq',target:4}}],events:[{type:'variable',variable:0,operation:'add',value:1,month:1,repeatCount:4,repeatEvery:1},{type:'announcement',message:'Exactly two',month:1,condition:{metric:'variable1',operator:'eq',target:2}},{type:'announcement',message:'Above two',month:1,condition:{metric:'variable1',operator:'gt',target:2}},{type:'ending',outcome:'won',message:'Finished',month:4}]};
const city=createCity('Exact events',false);attachCustomScenario(city,d);tick(city);assert.equal(city.scenario.events[0].runs,1);assert.equal(city.scenario.events[1].runs,0);tick(city);assert.equal(city.scenario.events[1].month,2);assert.equal(city.scenario.events[2].runs,0);
const loaded=validateSave(JSON.parse(serializeCity(city)));for(let i=0;i<2;i++){tick(city);tick(loaded);}assert.equal(city.scenario.events[2].month,3);assert.equal(city.scenario.rank,'Exact result');assert.deepEqual(loaded.scenario,city.scenario);
// Use a currently registered state metric without inventing a numeric enum.
const {CUSTOM_METRICS}=await import('../dist/scenario-metrics.js');const [key,metric]=Object.entries(CUSTOM_METRICS).find(([,m])=>m.states);const actual=metric.read(city);assert.equal(eventConditionMet(city,validateEventCondition({metric:key,operator:'ne',target:actual})),false);assert.match(eventConditionLabel({metric:key,operator:'ne',target:actual}),/is not/);
assert.throws(()=>validateEventCondition({metric:'funds',operator:'approximately',target:50}));
console.log('PASS: all six comparison boundaries, unrounded and unavailable values, compound conditions, real grouped exact/strict events, outcome ranks, save continuation and state inequality.');
