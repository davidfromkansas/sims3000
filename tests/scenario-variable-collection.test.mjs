import assert from 'node:assert/strict';
import {createCity,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
import {expandScenarioText} from '../dist/scenario-text.js';
import {removeScenarioVariable,addScenarioVariable,renameScenarioVariable} from '../dist/scenario-variable-references.js';
import {validateScenarioVariables} from '../dist/scenario-variables.js';
const definition={title:'Six named counters',months:24,eventMode:'together',variables:[
 {name:'Unused',initial:91},{name:'Months observed',initial:0},{name:'Multiplier',initial:2},
 {name:'Reserve',initial:7},{name:'Production',initial:0},{name:'Score',initial:0}],
 objectives:[{metric:'variable6',target:8}],winMessage:'Score: {variable6}',
 programs:[{name:'Update score',steps:[{kind:'if',condition:{metric:'variable2',operator:'gte',target:1},then:[
 {kind:'action',action:{type:'variable',variable:4,operation:'calculate',calculation:'multiply',left:{kind:'metric',metric:'variable2'},right:{kind:'metric',metric:'variable3'}}},
 {kind:'action',action:{type:'variable',variable:5,operation:'copy',metric:'variable5'}}],else:[]}]}],
 events:[{type:'variable',variable:1,operation:'add',value:1,month:1,repeatCount:4,repeatEvery:1},
 {type:'program',routine:0,month:1,repeatCount:4,repeatEvery:1},
 {type:'announcement',message:'Produced {variable5}; score {variable6}',month:4}]};
const renamed=renameScenarioVariable(definition,5,'Final score');
assert.equal(renamed.variables[5].name,'Final score');
assert.deepEqual(renamed.events,definition.events);assert.deepEqual(renamed.programs,definition.programs);
assert.equal(definition.variables[5].name,'Score');
assert.throws(()=>renameScenarioVariable(definition,5,' reserve '),/distinct/);
const added=addScenarioVariable(renamed);assert.equal(added.variables.length,7);assert.equal(added.variables[6].initial,0);
const city=createCity();attachCustomScenario(city,definition);tick(city);
assert.deepEqual(city.scenario.variables,[91,1,2,7,2,2]);
const raw=JSON.parse(serializeCity(city)),restored=validateSave(raw);
assert.equal(raw.version,158);assert.deepEqual(restored.scenario,city.scenario);
for(let i=0;i<3;i++){tick(city);tick(restored);assert.deepEqual(restored.scenario,city.scenario);}
assert.equal(city.scenario.status,'won');assert.equal(city.scenario.variables[5],8);
assert.equal(city.scenario.events[2].message,'Produced 8; score 8');
assert.equal(expandScenarioText(city.scenario.definition.winMessage,city),'Score: 8');
const replay=restartCustomScenario(restored);assert.deepEqual(replay.scenario.variables,[91,0,2,7,0,0]);
assert.equal(replay.scenario.status,'playing');assert.equal(replay.scenario.events[0].runs,0);
// Remove an earlier unused counter and play the same challenge to the same result.
const compact=createCity();attachCustomScenario(compact,removeScenarioVariable(definition,0));
for(let i=0;i<4;i++)tick(compact);
assert.deepEqual(compact.scenario.variables,city.scenario.variables.slice(1));
assert.equal(compact.scenario.status,'won');assert.equal(compact.scenario.events[2].message,city.scenario.events[2].message);
for(const length of [1,32])assert.equal(validateScenarioVariables(Array.from({length},(_,i)=>({name:`Count ${i}`,initial:0}))).length,length);
assert.throws(()=>validateScenarioVariables(Array.from({length:33},(_,i)=>({name:`Count ${i}`,initial:0}))));
for(const values of [[0,0,0,0],Array(6),[0,0,0,0,0,Infinity]]){const broken=structuredClone(raw);broken.scenario.variables=values;assert.throws(()=>validateSave(broken));}
const downgraded=structuredClone(raw);downgraded.version=157;assert.throws(()=>validateSave(downgraded),/version 158/);
const undefinedTarget=structuredClone(definition);undefinedTarget.programs[0].steps[0].then[1].action.variable=6;
assert.throws(()=>validateCustomDefinition(undefinedTarget),/undefined scenario variable/);
console.log('PASS six-counter challenge: routine arithmetic, goals, messages, saved continuation, replay and deletion preserve outcomes');
