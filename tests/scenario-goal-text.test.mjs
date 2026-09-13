import assert from 'node:assert/strict';
import {createCity,tick,build,validateSave,VERSION} from '../dist/engine.js';
import {attachCustomScenario,validateCustomDefinition,customGoals} from '../dist/custom-scenarios.js';
import {serializeCity} from '../dist/save.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
import {showScenarios} from '../dist/scenario-ui.js';
const c=createCity('Authored town',false),definition={title:'A greener town',months:24,objectiveMode:'sequence',objectives:[{metric:'population',target:0,name:'Welcome <Mayor>',description:'The city has {population} residents.\nStart here.'},{metric:'structuresPark',target:1,name:'First garden',description:'Give the city a green heart.',revealWhenActive:true},{metric:'structuresPark',target:2,name:'The second garden',description:'Build on your earlier work.',revealWhenActive:true}]};
attachCustomScenario(c,definition);let goals=customGoals(c);assert.equal(goals.length,2);assert.equal(goals[1].title,'Stage 1 · Welcome <Mayor>');assert.match(goals[1].instructions,/0 residents/);assert.match(goals[1].detail,/Requirement: Population/);assert.equal(c.scenario.status,'playing');
tick(c);assert.equal(c.scenario.stageCompletedMonths.length,1);assert.equal(customGoals(c).length,3);assert.equal(c.scenario.status,'playing','hidden future stages cannot cause early victory');
for(const t of c.tiles){t.terrain='land';t.nature=false;}
assert.ok(build(c,'park',[{x:10,y:10}]).ok);tick(c);assert.equal(c.scenario.stageCompletedMonths.length,2);assert.equal(customGoals(c).length,4);assert.equal(c.scenario.status,'playing');
const saved=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(saved.scenario.definition.objectives,c.scenario.definition.objectives);assert.equal(customGoals(restartCustomScenario(saved)).length,2,'replay conceals future stages again');
assert.ok(build(c,'park',[{x:12,y:12}]).ok);tick(c);assert.equal(c.scenario.status,'won');assert.ok(customGoals(c).every(g=>g.done));assert.equal(customGoals(c).length,4);
let html='';globalThis.document={querySelector:()=>({}),querySelectorAll:()=>[]};showScenarios({city:()=>c,dialog:(title,body)=>{html=body;},close(){},start(){},exportCity(){},review(){},update(){},save(){}});assert.match(html,/Welcome &lt;Mayor&gt;/);assert.doesNotMatch(html,/<Mayor>/);assert.match(html,/Give the city a green heart/);
for(const change of [{name:'x'.repeat(61)},{description:'x'.repeat(1501)},{name:'bad\nname'},{revealWhenActive:'yes'}])assert.throws(()=>validateCustomDefinition({...definition,objectives:[{...definition.objectives[0],...change}]}));
assert.throws(()=>validateCustomDefinition({...definition,objectives:[{...definition.objectives[0],revealWhenActive:true}]}));assert.throws(()=>validateCustomDefinition({...definition,objectiveMode:'together'}));
const old=JSON.parse(serializeCity(saved));old.version=93;for(const o of old.scenario.definition.objectives){delete o.name;delete o.description;delete o.revealWhenActive;}const migrated=validateSave(old);assert.equal(migrated.version,VERSION);assert.ok(migrated.scenario.definition.objectives.every(o=>o.name===''&&!o.revealWhenActive));assert.equal(customGoals(migrated).length,4);
const loss=createCity('Incomplete',false);attachCustomScenario(loss,definition);loss.scenario.status='lost';assert.equal(customGoals(loss).length,4,'ending debrief reveals the remaining goals');
console.log('PASS: authored goal names/instructions, live values and escaped status, sequential reveal without early completion, saved/replayed progression, debrief visibility, strict authoring validation and legacy goals.');
