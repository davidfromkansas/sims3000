import assert from 'node:assert/strict';
import {createCity,build,tick,validateSave} from '../dist/engine.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {eventConditionMet,validateEventCondition} from '../dist/scenario-events.js';
import {serializeCity} from '../dist/save.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
const metrics=['adultEducation','childEducationCoverage','collegeEducationCoverage','libraryEducationCoverage','museumEducationCoverage'];
const c=createCity();
for(const metric of metrics){const m=CUSTOM_METRICS[metric];assert.ok(Number.isFinite(m.read(c)));assert.ok(eventConditionMet(c,{metric,target:m.read(c),operator:'eq'}));for(const target of [-1,101,NaN,Infinity]){assert.throws(()=>validateCustomDefinition({title:'Invalid',months:12,objectives:[{metric,target}]}));assert.throws(()=>validateEventCondition({metric,target,operator:'eq'}));}}
const definition={title:'Our learning town',months:24,objectives:[{metric:'adultEducation',target:40.1},{metric:'libraryEducationCoverage',target:90},{metric:'museumEducationCoverage',target:90}]};attachCustomScenario(c,definition);assert.equal(eventConditionMet(c,{metric:'museumEducationCoverage',target:90,operator:'gte'}),false);assert.ok(build(c,'library',[{x:20,y:21}]).ok);assert.ok(build(c,'museum',[{x:20,y:23}]).ok);assert.ok(eventConditionMet(c,{metric:'museumEducationCoverage',target:90,operator:'gte'}));tick(c);assert.equal(c.scenario.status,'playing');const saved=validateSave(JSON.parse(serializeCity(c)));for(let i=0;i<12&&c.scenario.status==='playing';i++){tick(c);tick(saved);}assert.equal(c.scenario.status,'won');assert.deepEqual(JSON.parse(serializeCity(c)),JSON.parse(serializeCity(saved)));const restarted=restartCustomScenario(c);assert.equal(restarted.scenario.status,'playing');assert.equal(CUSTOM_METRICS.museumEducationCoverage.read(restarted),0);assert.equal(restarted.civic.adultEducation,40);
console.log('PASS: education goal and event metrics, range rejection, ordinary custom challenge win, exact saved continuation and restart baseline.');
