import assert from 'node:assert/strict';
import {createCity,validateSave} from '../dist/engine.js';
import {ORDINANCES} from '../dist/civic.js';
import {CUSTOM_METRICS,attachCustomScenario,customCurrentGoals,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {advanceScenario} from '../dist/scenarios.js';
import {eventConditionMet,runScenarioEvents,validateEventCondition,eventConditionLabel} from '../dist/scenario-events.js';
import {serializeCity} from '../dist/save.js';
const definition={title:'Keep conservation in force',months:24,holdMonths:2,objectives:[{metric:'ordinancePowerConservation',target:1},{metric:'ordinanceParkingFines',target:0}]};
const c=createCity();attachCustomScenario(c,definition);
assert.deepEqual(customCurrentGoals(c).map(g=>g.done),[false,true]);
c.civic.ordinances.powerConservation=true;c.month++;advanceScenario(c);assert.equal(c.scenario.streak,1);
c.civic.ordinances.parkingFines=true;c.month++;advanceScenario(c);assert.equal(c.scenario.streak,0);
c.civic.ordinances.parkingFines=false;c.month++;advanceScenario(c);assert.equal(c.scenario.streak,1);
const resumed=validateSave(JSON.parse(serializeCity(c)));resumed.month++;advanceScenario(resumed);assert.equal(resumed.scenario.status,'won');
assert.match(customCurrentGoals(resumed)[0].title,/Enacted/);assert.match(customCurrentGoals(resumed)[1].detail,/Repealed/);
for(const key of Object.keys(ORDINANCES)){
 const metric='ordinance'+key[0].toUpperCase()+key.slice(1),m=CUSTOM_METRICS[metric],city=createCity();
 assert.equal(m.read(city),0);city.civic.ordinances[key]=true;assert.equal(m.read(city),1);
 for(const target of [0,1]){const condition={metric,operator:'eq',target};assert.deepEqual(validateEventCondition(condition),condition);assert.equal(eventConditionMet(city,condition),target===1);}
 assert.throws(()=>validateCustomDefinition({...definition,objectives:[{metric,target:.5}]}));assert.throws(()=>validateEventCondition({metric,operator:'eq',target:.5}));
}
const threat=createCity(),condition={metric:'ordinanceFireCode',operator:'eq',target:0};
threat.civic.ordinances.fireCode=true;
attachCustomScenario(threat,{...definition,events:[{type:'fire',month:1,x:20,y:20,condition}]});threat.month++;
assert.equal(runScenarioEvents(threat),null);threat.civic.ordinances.fireCode=false;
assert.equal(runScenarioEvents(threat).status,'triggered');assert.ok(threat.emergency.active);
assert.match(eventConditionLabel(condition),/is repealed/);
assert.ok(eventConditionMet(c,{metric:'ordinancePowerConservation',operator:'gte',target:1}));
assert.deepEqual(validateEventCondition({metric:'population',operator:'eq',target:1}),{metric:'population',operator:'eq',target:1});
const bad=JSON.parse(serializeCity(c));bad.scenario.definition.objectives[0].target=.5;assert.throws(()=>validateSave(bad));
console.log('PASS: all ordinance state metrics, enact/repeal goals, sustained-goal reset and saved victory, policy-gated fire, explicit state labels and invalid fractional targets.');
