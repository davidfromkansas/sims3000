import assert from 'node:assert/strict';
import {createCity} from '../dist/engine.js';
import {attachCustomScenario} from '../dist/custom-scenarios.js';
import {executeScenarioAction,runScenarioEvents,eventConditionMet} from '../dist/scenario-events.js';
import {compileGameScenarioPrograms,validateScenarioProgramDefinitions} from '../dist/scenario-program-definitions.js';
import {startScenarioProgram,nextScenarioProgramAction} from '../dist/scenario-programs.js';
const objectives=[{metric:'population',target:999999}],options={size:96,objectives};
const action=action=>({kind:'action',action}),message=text=>action({type:'announcement',message:text});
const source=[{name:'  Council  ',steps:[action({type:'variable',variable:0,operation:'add',value:2}),{kind:'if',condition:{metric:'variable1',operator:'gte',target:2},then:[{kind:'call',routine:1}],else:[message('No award')]},message('Counter: {variable1}')]},{name:'Grant',steps:[action({type:'reward',reward:'university'}),action({type:'markGoal',goal:0,goalStatus:'satisfied'})]}];
const canonical=validateScenarioProgramDefinitions(source,options);assert.equal(canonical[0].name,'Council');assert.ok(!('code' in canonical[0]));assert.deepEqual(validateScenarioProgramDefinitions(JSON.parse(JSON.stringify(canonical)),options),canonical);
const programs=compileGameScenarioPrograms(canonical,options),c=createCity('Routine actions',true,96);attachCustomScenario(c,{title:'Routine fixture',months:24,objectives});const cursor=startScenarioProgram(programs,0),results=[];
while(!cursor.done){const e=nextScenarioProgramAction(programs,cursor,condition=>eventConditionMet(c,condition));if(e)results.push({type:e.type,...executeScenarioAction(c,e,cursor.steps)});}
assert.equal(c.scenario.variables[0],2);assert.equal(c.rewards.earned.university,c.month);assert.equal(c.scenario.goalMarks[0].satisfied,true);assert.deepEqual(results.map(r=>r.type),['variable','reward','markGoal','announcement']);assert.equal(results.at(-1).progress.message,'Counter: 2');
// The scheduled-event wrapper and shared dispatcher produce identical game
// state and progress for each primitive, including failure and disaster paths.
const primitives=[{type:'variable',variable:0,operation:'calculate',calculation:'random',left:{kind:'constant',value:1},right:{kind:'constant',value:100}}, {type:'variable',variable:0,operation:'calculate',calculation:'divide',left:{kind:'constant',value:1},right:{kind:'constant',value:0}}, {type:'reward',reward:'university'}, {type:'business',business:'casino'}, {type:'announcement',message:'People: {population}'}, {type:'popup',message:'Read this'}, {type:'fire',x:20,y:20}, {type:'ending',message:'Finished',outcome:'lost'}];
for(const primitive of primitives){const city=createCity();attachCustomScenario(city,{title:'Shared action',months:24,objectives,events:[{...primitive,month:1}]});city.month=1;const direct=structuredClone(city),event=city.scenario.definition.events[0],expected=runScenarioEvents(city),actual=executeScenarioAction(direct,event,0);direct.scenario.events[0]={...actual.progress,runs:1};assert.deepEqual(direct,city,primitive.type);assert.deepEqual({...event,...direct.scenario.events[0],...actual.effects},expected);}
for(const bad of [{type:'announcement',message:'hidden clock',month:1},{type:'announcement',message:'hidden condition',condition:null},{type:'markGoal',goal:1,goalStatus:'satisfied'},{type:'camera',x:96,y:10,zoom:1}])assert.throws(()=>compileGameScenarioPrograms([{name:'Bad',steps:[action(bad)]}],options));
assert.throws(()=>compileGameScenarioPrograms([{name:'Bad goal',steps:[{kind:'if',condition:{metric:'goalStatus2',operator:'eq',target:2},then:[]}]}],options),/undefined goal/);
assert.throws(()=>executeScenarioAction(c,{type:'unknown'}),/Unknown/);assert.deepEqual(validateScenarioProgramDefinitions(undefined,options),[]);assert.throws(()=>validateScenarioProgramDefinitions(null,options));
console.log('PASS: canonical routine source roundtrip, map/goal validation, real variable-dependent branching, rewards/goal marks/messages, and exact scheduled/shared action equivalence including random, arithmetic failure and fire.');
