import assert from 'node:assert/strict';
import {createCity,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {attachCustomScenario} from '../dist/custom-scenarios.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
import {scenarioResultMessage} from '../dist/scenario-result-message.js';
import {showScenarios} from '../dist/scenario-ui.js';
for(const program of [false,true])for(const outcome of ['won','lost']){
 const city=createCity(),action={type:'ending',outcome,message:'Council <decision>\nRecorded population: {population}'},definition={title:'Visible outcome',months:12,completionMode:'scripted',objectives:[{metric:'population',target:999999}],events:program?[{type:'program',routine:0,month:1}]:[{...action,month:1}],...(program?{programs:[{name:'Council',steps:[{kind:'action',action}]}]}:{})};attachCustomScenario(city,definition);assert.equal(scenarioResultMessage(city.scenario),'');tick(city);assert.equal(city.scenario.status,outcome);const report=scenarioResultMessage(city.scenario);assert.match(report,/Council &lt;decision&gt;\nRecorded population: 224/);city.stats.population=999;assert.equal(scenarioResultMessage(city.scenario),report);const restored=validateSave(JSON.parse(serializeCity(city)));assert.equal(scenarioResultMessage(restored.scenario),report);assert.equal(scenarioResultMessage(restartCustomScenario(restored).scenario),'');
 const controls=new Map();globalThis.document={querySelector:s=>{if(!controls.has(s))controls.set(s,{});return controls.get(s);},querySelectorAll:()=>[]};let html='';showScenarios({city:()=>restored,dialog:(title,body)=>html=body,close(){},start(){},exportCity(){},review(){},update(){},save(){}});assert.ok(html.indexOf(report)>0);assert.ok(html.indexOf(report)<html.indexOf('<ol>'),'result is visible before goal and routine reports');
}
assert.equal(scenarioResultMessage(null),'');
console.log('PASS: visible scripted victory/loss messages for direct events and routines, captured text across save/load, escaped multiline content, replay reset and result-screen integration.');
