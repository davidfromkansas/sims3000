import assert from 'node:assert/strict';
import {createCity,tick,validateSave,VERSION} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {changeScenarioVariable,VARIABLE_LIMIT} from '../dist/scenario-variables.js';
import {scenarioEventReport} from '../dist/scenario-events.js';
const constant=value=>({kind:'constant',value}),metric=metric=>({kind:'metric',metric});
const calculation=(variable,calculation,left,right,extra={})=>({type:'variable',operation:'calculate',month:1,variable,calculation,left,right,...extra});
const definition=events=>({title:'Calculated objectives',months:24,eventMode:'together',objectives:[{metric:'population',target:999999}],events});
const c=createCity();attachCustomScenario(c,definition([
 calculation(0,'percentage',metric('population'),metric('population')),
 calculation(1,'divide',metric('variable1'),constant(4)),
 calculation(2,'multiply',metric('variable2'),constant(4)),
 {type:'announcement',month:1,message:'Result: {variable1}, {variable2}, {variable3}.'}
]));tick(c);assert.deepEqual(c.scenario.variables,[100,25,100,0]);assert.equal(c.scenario.events[3].message,'Result: 100, 25, 100.');assert.match(scenarioEventReport(c),/Left as percentage of right/);assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).scenario,c.scenario);
changeScenarioVariable(c,calculation(0,'sum',metric('variable1'),constant(7)),0,key=>key==='variable1'?c.scenario.variables[0]:0);assert.equal(c.scenario.variables[0],107,'destination may also be an operand');changeScenarioVariable(c,calculation(0,'subtract',constant(1),constant(9)));assert.equal(c.scenario.variables[0],-8);changeScenarioVariable(c,calculation(0,'divide',constant(-10),constant(3)));assert.equal(c.scenario.variables[0],-3);changeScenarioVariable(c,calculation(0,'multiply',constant(1000000),constant(1000000)));assert.equal(c.scenario.variables[0],VARIABLE_LIMIT);
const zero=createCity();attachCustomScenario(zero,definition([calculation(0,'divide',constant(10),metric('variable2'),{repeatCount:2,repeatEvery:1}),{type:'variable',operation:'set',variable:1,value:2,month:1}]));tick(zero);assert.equal(zero.scenario.events[0].status,'skipped');assert.equal(zero.scenario.events[0].calculationError,'zeroDivisor');assert.equal(zero.scenario.variables[0],0);assert.match(scenarioEventReport(zero),/Division by zero/);const zeroSaved=validateSave(JSON.parse(serializeCity(zero)));tick(zero);tick(zeroSaved);assert.deepEqual(zeroSaved.scenario,zero.scenario);assert.equal(zero.scenario.variables[0],5);assert.equal(zero.scenario.events[0].calculationError,undefined,'successful repeat clears old failure');
const random=createCity();attachCustomScenario(random,definition([calculation(0,'random',constant(8),constant(-3),{repeatCount:3,repeatEvery:1})]));const copy=validateSave(JSON.parse(serializeCity(random)));for(let i=0;i<3;i++){tick(random);tick(copy);assert.deepEqual(random.scenario,copy.scenario);assert.ok(random.scenario.variables[0]>=-3&&random.scenario.variables[0]<=8);}changeScenarioVariable(random,calculation(0,'random',constant(7),constant(7)));assert.equal(random.scenario.variables[0],7);
const values=new Set();for(let month=1;month<200;month++){random.month=month;changeScenarioVariable(random,calculation(0,'random',constant(0),constant(1)));values.add(random.scenario.variables[0]);}assert.deepEqual([...values].sort(),[0,1],'inclusive random bounds');
for(const patch of [{calculation:'eval'},{left:{kind:'code',value:'alert(1)'}},{left:metric('missing')},{right:constant(1.2)},{right:constant(Infinity)},{right:null}])assert.throws(()=>validateCustomDefinition(definition([{...calculation(0,'sum',constant(1),constant(2)),...patch}])));
const bad=JSON.parse(serializeCity(zero));bad.scenario.events[0].calculationError='zeroDivisor';assert.throws(()=>validateSave(bad),'successful event cannot forge a failure');const old=JSON.parse(serializeCity(createCity()));old.version=90;assert.equal(validateSave(old).version,VERSION);
console.log('PASS: scenario arithmetic, live/saved operands, same-group chained results, percentages, rounding/saturation, zero-divisor history and recovery, deterministic inclusive random numbers, save continuity and validation.');
