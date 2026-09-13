import assert from 'node:assert/strict';
import {showCustomScenarioEditor} from '../dist/scenario-editor.js';
import {createCity,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
// A small control harness runs the actual editor setup and assigned handlers in Node.
// It checks control state and submission, not browser layout or native input behavior.
const controls=new Map();
function element(id,attrs='') {
 let value=attrs.match(/value="([^"]*)"/)?.[1]||'';
 const label={hidden:false};
 return {id,hidden:false,disabled:/\sdisabled(?:\s|$)/.test(attrs),checked:/\schecked(?:\s|$)/.test(attrs),
 get value(){return value;},set value(v){value=String(v);},textContent:'',files:[],closest:()=>label,
 set outerHTML(html){parse(html);},set innerHTML(html){const options=[...html.matchAll(/<option\b([^>]*)>/g)];if(options.length)this.value=(options.find(m=>/selected/.test(m[1]))||options[0])[1].match(/value="([^"]*)"/)?.[1]||'';}};
}
function parse(html){
 for(const m of html.matchAll(/<\w+\b([^>]*\bid="([^"]+)"[^>]*)>/g))controls.set(m[2],element(m[2],m[1]));
 for(const m of html.matchAll(/<select\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))controls.get(m[1]).innerHTML=m[2];
}
const $=id=>{const e=controls.get(id.replace(/^#/,''));assert.ok(e,'Missing rendered control '+id);return e;};
globalThis.document={querySelector:$,getElementById:$,querySelectorAll:selector=>[...controls.values()].filter(e=>[...selector.matchAll(/\[id\^=([^\]]+)\]/g)].some(m=>e.id.startsWith(m[1])))};
const city=createCity('Activation editor',false);let saved=0;
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){saved++;},update(){},beginCustom(){}},()=>{});
const change=(id,value)=>{$(id).value=value;$(id).onchange();};
change('customMetric0','');change('customMetric2','funds');$('customTarget2').value=0;$('goalStartup2').checked=false;$('goalName2').value='Late instructions';$('goalName2').oninput();
change('customEvent0','addGoal');$('eventMonth0').value=2;$('eventGoal0').value='2';change('eventCondition0','goalStatus3');$('eventThreshold0').value='0';
assert.equal($('eventGoalLabel0').hidden,false);assert.equal($('eventX0').disabled,true);assert.equal($('eventGoal0').disabled,false);
change('customEvent0','fire');assert.equal($('eventGoalLabel0').hidden,true);assert.equal($('eventX0').disabled,false);change('customEvent0','addGoal');
change('customEvent1','markGoal');$('eventMonth1').value=1;$('eventGoal1').value='2';$('eventGoalStatus1').value='satisfied';assert.equal($('eventGoalStatusLabel1').hidden,false);assert.equal($('eventX1').disabled,true);change('customEvent1','addGoal');assert.equal($('eventGoalStatusLabel1').hidden,true);change('customEvent1','markGoal');
$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(saved,1);assert.equal(city.scenario.definition.objectives.length,1);assert.equal(city.scenario.definition.events[0].goal,0,'sparse editor row maps to the correct compact objective index');assert.deepEqual(city.scenario.goalActivatedMonths,[null]);assert.equal(city.scenario.definition.events.find(e=>e.type==='addGoal').condition.conditions[0].metric,'goalStatus1','status references also resolve sparse authoring rows');
tick(city);assert.equal(city.scenario.status,'playing');tick(city);assert.equal(city.scenario.status,'won');assert.deepEqual(city.scenario.goalActivatedMonths,[2]);assert.deepEqual(city.scenario.goalMarks,[{satisfied:true,month:1}]);assert.deepEqual(validateSave(JSON.parse(serializeCity(city))).scenario,city.scenario);
const before=serializeCity(city);$('eventGoal0').value='1';$('startCustom').onclick();assert.match($('customError').textContent,/goal/i);assert.equal(saved,1);assert.equal(serializeCity(city),before,'invalid empty-row target does not overwrite the current scenario');
console.log('PASS: actual editor startup controls, event field switching, sparse-row goal targeting, delayed playable activation, saved victory and rejected empty targets.');
