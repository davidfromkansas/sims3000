import assert from 'node:assert/strict';
import {removeScenarioVariable,scenarioVariableReferences,validateScenarioVariableReferences} from '../dist/scenario-variable-references.js';
const metric='variable6';
const condition={match:'all',conditions:[{metric,operator:'gte',target:3},{match:'any',conditions:[{metric:'variable2',operator:'eq',target:9}]}]};
const source={
 title:'Literal {variable6}',variables:Array.from({length:6},(_,i)=>({name:`Counter ${i+1}`,initial:i})),
 briefing:'{variable6} and {variable6}; {variable2}; {city}',winMessage:'{variable6}',lossMessage:'{variable2}',
 objectives:[{name:'Literal {variable6}',metric,description:'Reach {variable6}',target:6}],
 events:[{type:'variable',variable:5,operation:'copy',metric:'variable2',condition},
 {type:'dialogText',message:'{variable6}'},{type:'resultText',message:'{variable2}'}],
 ranks:[{name:'Literal {variable6}',condition:structuredClone(condition),message:'Count {variable6}'}],
 programs:[{name:'Literal {variable6}',steps:[{kind:'if',condition:structuredClone(condition),then:[
 {kind:'action',action:{type:'variable',variable:5,operation:'calculate',left:{kind:'metric',metric},right:{kind:'constant',value:6}}},
 {kind:'action',action:{type:'popup',message:'Now {variable6}'}}],else:[{kind:'action',action:{type:'announcement',message:'Before {variable2}'}}]}]}]
};
const original=structuredClone(source);
assert.throws(()=>removeScenarioVariable(source,5),/Cannot remove Counter 6.*briefing.*Goal 1.*Routine 1/s);
assert.deepEqual(source,original,'rejected removal cannot alter the draft');
const next=removeScenarioVariable(source,0);
assert.deepEqual(source,original,'successful removal must also preserve input');
assert.equal(next.variables.length,5);
assert.equal(next.variables[4].name,'Counter 6');
assert.equal(next.briefing,'{variable5} and {variable5}; {variable1}; {city}');
assert.equal(next.objectives[0].metric,'variable5');
assert.equal(next.objectives[0].name,'Literal {variable6}');
assert.equal(next.title,'Literal {variable6}');
assert.equal(next.events[0].variable,4);
assert.equal(next.events[0].metric,'variable1');
assert.equal(next.events[0].condition.conditions[1].conditions[0].metric,'variable1');
const branch=next.programs[0].steps[0];
assert.equal(branch.then[0].action.left.metric,'variable5');
assert.equal(branch.then[0].action.variable,4);
assert.equal(branch.then[0].action.right.value,6);
assert.equal(branch.then[1].action.message,'Now {variable5}');
assert.equal(branch.else[0].action.message,'Before {variable1}');
assert.equal(next.ranks[0].message,'Count {variable5}');
assert.equal(validateScenarioVariableReferences(next),next);
assert.ok(scenarioVariableReferences(next,4).includes('Routine 1 / instruction 1 / then / instruction 1 / left operand'));
// Every interpreted source reference still reads the same initial counter value.
const values=d=>d.variables.map(v=>v.initial);
assert.equal(values(source)[source.events[0].variable],values(next)[next.events[0].variable]);
for(const invalid of [6,-1,1.5])assert.throws(()=>removeScenarioVariable(source,invalid),/existing/);
const missing=structuredClone(source);missing.programs[0].steps[0].then[1].action.message='{variable7}';
assert.throws(()=>validateScenarioVariableReferences(missing),/Routine 1.*undefined/);
console.log('PASS scenario variable references: protected deletion, nested remapping, messages and immutable drafts');
