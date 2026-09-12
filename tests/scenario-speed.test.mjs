import assert from 'node:assert/strict';
import {generateCity} from '../dist/terrain-generator.js';
import {validateSave} from '../dist/engine.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {allowedSpeed,resumeScenarioSpeed,scenarioSpeed,scenarioSpeedReport} from '../dist/scenario-speed.js';
import {serializeCity} from '../dist/save.js';
const definition={title:'Pace test',months:24,objectives:[{metric:'population',target:100000}]};
for(const initial of [1,3,8])for(const locked of [false,true]){
 let c=generateCity({water:0,mountains:0,trees:0});attachCustomScenario(c,{...definition,speed:{initial,locked}});assert.equal(resumeScenarioSpeed(c),initial);for(const n of [0,1,3,8])assert.equal(allowedSpeed(c,n),!locked||n===0||n===initial);for(const n of [-1,2,Infinity,'3',null])assert.equal(allowedSpeed(c,n),false);
 c=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(scenarioSpeed(c),{initial,locked});assert.match(scenarioSpeedReport(c),new RegExp(initial+'×'));c.scenario.status='won';for(const n of [0,1,3,8])assert.ok(allowedSpeed(c,n),'completed challenges release pace restriction');
}
assert.deepEqual(validateCustomDefinition(definition).speed,{initial:1,locked:false},'older definitions keep normal unlocked pace');
for(const speed of [null,[],{initial:0,locked:true},{initial:2,locked:false},{initial:3,locked:'yes'},{initial:8}])assert.throws(()=>validateCustomDefinition({...definition,speed}));
console.log('PASS: scenario starting pace, locked running speeds with pause, saved policies, legacy defaults, completion unlock and malformed speed rejection.');
