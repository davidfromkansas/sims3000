import assert from 'node:assert/strict';
import {createCity,validateSave,idx} from '../dist/engine.js';
import {attachCustomScenario,customCurrentGoals,validateCustomDefinition,CUSTOM_METRICS} from '../dist/custom-scenarios.js';
import {advanceScenario} from '../dist/scenarios.js';
import {validateEventCondition,eventConditionMet,runScenarioEvents,eventConditionLabel} from '../dist/scenario-events.js';
import {serializeCity} from '../dist/save.js';
import {inScenarioArea} from '../dist/scenario-area.js';
const area={x:10,y:10,radius:5};assert.ok(inScenarioArea({x:13,y:14},area));assert.ok(!inScenarioArea({x:14,y:14},area));
const c=createCity();for(const t of c.tiles){t.type=null;t.level=0;t.rubble=false;t.radiation=false;}
for(const [x,y] of [[10,10],[13,14],[14,14],[30,30]])Object.assign(c.tiles[idx(x,y)],{type:'residential',level:1});
const metric='buildingsResidential',definition={title:'Two neighborhoods',months:24,holdMonths:2,objectives:[{metric,target:2,area},{metric,target:1,area:{x:30,y:30,radius:0}}]};
assert.equal(CUSTOM_METRICS[metric].read(c),4);assert.equal(CUSTOM_METRICS[metric].read(c,area),2);
attachCustomScenario(c,definition);assert.ok(customCurrentGoals(c).every(g=>g.done));assert.match(customCurrentGoals(c)[0].title,/within 5 tiles of 11, 11/);
c.month++;advanceScenario(c);assert.equal(c.scenario.streak,1);
c.tiles[idx(13,14)].level=0;c.month++;advanceScenario(c);assert.equal(c.scenario.streak,0,'development elsewhere cannot replace a missing local building');
c.tiles[idx(13,14)].level=1;c.month++;advanceScenario(c);
const restored=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(restored.scenario.definition.objectives[0].area,area);restored.month++;advanceScenario(restored);assert.equal(restored.scenario.status,'won');
const condition={metric,operator:'gte',target:3,area};assert.ok(!eventConditionMet(c,condition));assert.match(eventConditionLabel(condition),/within 5 tiles/);
attachCustomScenario(c,{...definition,events:[{type:'fire',month:1,x:10,y:10,condition}]});c.month++;assert.equal(runScenarioEvents(c),null);
Object.assign(c.tiles[idx(11,10)],{type:'residential',level:1});assert.equal(runScenarioEvents(c).status,'triggered');
for(const bad of [{x:48,y:0,radius:1},{x:0,y:0,radius:-1},{x:0,y:0,radius:68},{x:0,y:0,radius:.5},[],{x:NaN,y:0,radius:1}])assert.throws(()=>validateEventCondition({...condition,area:bad}));
assert.throws(()=>validateCustomDefinition({...definition,objectives:[definition.objectives[0],definition.objectives[0]]}));
assert.throws(()=>validateEventCondition({metric:'population',operator:'gte',target:1,area}));
const farm=createCity();for(const t of farm.tiles){t.type=null;t.level=0;}
for(let y=10;y<13;y++)for(let x=10;x<13;x++)Object.assign(farm.tiles[idx(x,y)],{type:'industrial',industry:'farm',farmRoot:idx(10,10),level:1,rubble:false,radiation:false});
assert.equal(CUSTOM_METRICS.farms.read(farm,{x:10,y:10,radius:0}),1);assert.equal(CUSTOM_METRICS.farms.read(farm,{x:11,y:11,radius:0}),0);assert.equal(CUSTOM_METRICS.buildingsIndustrial.read(farm),1);
assert.equal(validateCustomDefinition({title:'Legacy citywide',months:12,objectives:[{metric,target:1}]}).objectives[0].area,undefined);
console.log('PASS: circular neighborhood counts, inclusive boundaries, distinct local goals, missing-building streak reset, saved victory, local conditional fire, root-only farm counts and invalid area rejection.');
