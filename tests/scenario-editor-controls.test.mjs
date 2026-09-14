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
 return {children:[],append(...nodes){this.children.push(...nodes);},replaceChildren(...nodes){this.children=nodes;},setAttribute(){},id,type:attrs.match(/type="([^"]*)"/)?.[1]||'',hidden:false,disabled:/\sdisabled(?:\s|$)/.test(attrs),checked:/\schecked(?:\s|$)/.test(attrs),
 get value(){return value;},set value(v){value=String(v);},textContent:'',files:[],closest:()=>label,
 set outerHTML(html){parse(html);},set innerHTML(html){this.optionsHTML=html;const options=[...html.matchAll(/<option\b([^>]*)>/g)];if(options.length)this.value=(options.find(m=>/selected/.test(m[1]))||options[0])[1].match(/value="([^"]*)"/)?.[1]||'';}};
}
function parse(html){
 for(const m of html.matchAll(/<\w+\b([^>]*\bid="([^"]+)"[^>]*)>/g))controls.set(m[2],element(m[2],m[1]));
 for(const m of html.matchAll(/<select\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))controls.get(m[1]).innerHTML=m[2];
}
const $=id=>{const e=controls.get(id.replace(/^#/,''));assert.ok(e,'Missing rendered control '+id);return e;};
globalThis.document={createElement:tag=>({...element(''),tagName:tag}),querySelector:$,getElementById:$,querySelectorAll:selector=>[...controls.values()].filter(e=>[...selector.matchAll(/\[id\^=([^\]]+)\]/g)].some(m=>e.id.startsWith(m[1])))};
const city=createCity('Editor controls',false);let saved=0,started=0;
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){saved++;},update(){},beginCustom(){started++;}},()=>{});
const change=(id,value)=>{$(id).value=value;$(id).onchange();};
for(let i=0;i<4;i++){
 change('customEvent'+i,'variable');
 for(const operation of ['calculate','copy','add','set','calculate']){
  change('eventOperation'+i,operation);
  assert.equal($('eventCalculationFields'+i).hidden,operation!=='calculate');
  assert.equal($('eventCopyMetric'+i).closest('label').hidden,operation!=='copy');
  assert.equal($('eventCopyMetric'+i).disabled,operation!=='copy');
  assert.equal($('eventValue'+i).closest('label').hidden,!['set','add'].includes(operation));
  assert.equal($('eventValue'+i).disabled,!['set','add'].includes(operation));
 }
 change('eventOperandKindleft'+i,'metric');
 assert.equal($('eventOperandValueleft'+i).closest('label').hidden,true);
 assert.equal($('eventOperandMetricleft'+i).closest('label').hidden,false);
 change('eventOperandKindleft'+i,'constant');
 assert.equal($('eventOperandValueleft'+i).closest('label').hidden,false);
 change('customEvent'+i,'popup');assert.equal($('eventVariableFields'+i).hidden,true);
 change('customEvent'+i,'variable');assert.equal($('eventCalculationFields'+i).hidden,false);
 if(i)change('customEvent'+i,'');
}
for(const id of ['0','0_1','rank0','rank0_1']){
 change('eventCondition'+id,'funds');for(const op of ['gte','lte','gt','lt','eq','ne'])assert.ok($('eventOperator'+id).optionsHTML.includes('value="'+op+'"'));
 change('eventCondition'+id,'ordinanceFireCode');assert.ok($('eventOperator'+id).optionsHTML.includes('value="ne"'));assert.ok(!$('eventOperator'+id).optionsHTML.includes('value="gt"'));
 change('eventCondition'+id,'');
}
$('customTitle').value='Calculation from the editor';$('customTarget0').value=999999;
$('eventMonth0').value=1;$('eventCalculation0').value='multiply';
$('eventOperandValueleft0').value=6;$('eventOperandValueright0').value=7;
$('customRandomDisasters').checked=false;$('customAutomaticBusiness').checked=false;
$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(saved,1);assert.equal(started,1);
assert.equal(city.scenario.definition.events[0].operation,'calculate');
assert.deepEqual(city.scenario.definition.backgroundRules,{randomDisasters:false,automaticBusiness:false});
tick(city);assert.equal(city.scenario.variables[0],42);
assert.equal(validateSave(JSON.parse(serializeCity(city))).scenario.variables[0],42);
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){saved++;},update(){},beginCustom(){started++;}},()=>{});
change('customMetric0','date');assert.equal($('customTarget0').type,'month');assert.equal($('customTarget0').value,'1951-02');$('customTarget0').value='1950-03';
change('customEvent0','announcement');$('eventMonth0').value=1;$('eventMessage0').value='Date {date}';change('eventCondition0','date');assert.equal($('eventThreshold0').type,'month');$('eventThreshold0').value='1950-03';
change('eventConditionrank0','date');assert.equal($('eventThresholdrank0').type,'month');$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(city.scenario.definition.objectives[0].target,1950*12+2);assert.equal(city.scenario.definition.events[0].condition.conditions[0].target,1950*12+2);tick(city);assert.equal(city.scenario.status,'won');assert.equal(city.scenario.events[0].message,'Date Mar 1950');
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){saved++;},update(){},beginCustom(){started++;}},()=>{});
change('customMetric0','residentialTax');assert.equal($('customTarget0').max,20);$('customTarget0').value='7.1';
change('customEvent0','announcement');$('eventMonth0').value=1;$('eventMessage0').value='Debt {totalDebt}';change('eventCondition0','totalDebt');assert.equal($('eventThreshold0').max,375000);$('eventThreshold0').value='0';
$('rankName0').value='Tax reform';change('eventConditionrank0','commercialTax');$('eventThresholdrank0').value='7';$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(city.scenario.definition.objectives[0].target,7.1);assert.equal(city.scenario.definition.ranks[0].condition.conditions[0].metric,'commercialTax');tick(city);assert.equal(city.scenario.status,'won');assert.equal(city.scenario.events[0].message,'Debt 0');
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){saved++;},update(){},beginCustom(){started++;}},()=>{});
change('customMetric0','surplusWater');assert.equal($('customTarget0').min,-1000000000);$('customTarget0').value='0';change('customEvent0','announcement');$('eventMonth0').value=1;$('eventMessage0').value='Garbage {uncollectedGarbage}';change('eventCondition0','waterPollution');assert.equal($('eventThreshold0').max,100);$('eventThreshold0').value='100';$('eventOperator0').value='lte';$('rankName0').value='Supply';change('eventConditionrank0','surplusPower');$('eventThresholdrank0').value='0';$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(city.scenario.definition.objectives[0].metric,'surplusWater');tick(city);assert.equal(city.scenario.status,'won');assert.equal(city.scenario.events[0].message,'Garbage 0');
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){saved++;},update(){},beginCustom(){started++;}},()=>{});
const descendants=node=>[node,...(node.children||[]).flatMap(descendants)],programRoot=$('scenarioProgramEditor'),programButton=label=>descendants(programRoot).find(n=>n.tagName==='button'&&n.textContent===label),programField=label=>descendants(programRoot).find(n=>n.tagName==='label'&&n.textContent===label).children[0];
programButton('Add routine').onclick();programField('Routine name').value='Council routine';programField('Routine name').oninput();programButton('Add action').onclick();programField('Action').value='popup';programField('Action').onchange();programField('Message text').value='Created through the full editor';programField('Message text').oninput();change('customMetric0','population');$('customTarget0').value=999999;change('customEvent0','program');assert.equal($('eventRoutine0').disabled,false);assert.equal($('eventX0').disabled,true);assert.match($('eventRoutine0').optionsHTML,/Council routine/);$('eventMonth0').value=1;$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(city.scenario.definition.programs[0].name,'Council routine');assert.equal(city.scenario.definition.events[0].routine,0);tick(city);assert.equal(city.scenario.programInvocations[0].text[0].message,'Created through the full editor');assert.equal(validateSave(JSON.parse(serializeCity(city))).scenario.programInvocations[0].receipts[0].acknowledged,false);
console.log('PASS: actual scenario editor handlers expose calculation/copy/value controls across all rows, retain operand choices across event switches, and submit a working saved calculation challenge.');
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){},update(){}},()=>{});
$('rankName1').value='Ordinary recovery';$('rankName1').oninput();$('rankName3').value='Harbor rescuer';$('rankName3').oninput();
change('customEvent0','ending');assert.equal($('eventRank0').disabled,false);assert.match($('eventRank0').optionsHTML,/Harbor rescuer/);$('eventRank0').value='3';$('eventMonth0').value=1;$('eventMessage0').value='The harbor is safe.';
$('rankName3').value='Coast guardian';$('rankName3').oninput();assert.equal($('eventRank0').value,'3');assert.match($('eventRank0').optionsHTML,/Coast guardian/);
$('rankName3').value='';$('rankName3').oninput();assert.equal($('eventRank0').value,'3');assert.match($('eventRank0').optionsHTML,/is empty/);$('startCustom').onclick();assert.match($('customError').textContent,/rank/);
$('rankName3').value='Coast guardian';$('rankName3').oninput();$('customError').textContent='';$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(city.scenario.definition.events[0].rankIndex,1);tick(city);assert.equal(city.scenario.rank,'Coast guardian');
console.log('PASS scheduled ending rank: sparse named rows, retained rename, missing-row rejection and actual awarded outcome');
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){},update(){}},()=>{});
change('customEvent0','announcement');$('eventMessage0').value='Live comparison matched.';$('eventMonth0').value=1;change('eventCondition0','funds');$('eventThreshold0').value='123';
change('eventTargetKind0','metric');change('eventRightMetric0','population');assert.equal($('eventRightFields0').hidden,false);assert.equal($('eventThreshold0').closest('label').hidden,true);
change('eventTargetKind0','constant');assert.equal($('eventThreshold0').value,'123');change('eventTargetKind0','metric');assert.equal($('eventRightMetric0').value,'population');
$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(city.scenario.definition.events[0].condition.conditions[0].right.metric,'population');assert.equal(Object.hasOwn(city.scenario.definition.events[0].condition.conditions[0],'target'),false);tick(city);assert.equal(city.scenario.events[0].message,'Live comparison matched.');
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){},update(){}},()=>{});
change('customEvent0','announcement');$('eventMessage0').value='Area comparison';$('eventMonth0').value=1;change('eventCondition0','landmarks');change('areaModeevent0','near');$('areaXevent0').value='5';$('areaYevent0').value='6';$('areaRadiusevent0').value='2';
change('eventTargetKind0','metric');change('eventRightMetric0','landmarks');change('areaModeeventRight0','near');$('areaXeventRight0').value='15';$('areaYeventRight0').value='16';$('areaRadiuseventRight0').value='3';
$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.deepEqual(city.scenario.definition.events[0].condition.conditions[0].area,{x:4,y:5,radius:2});assert.deepEqual(city.scenario.definition.events[0].condition.conditions[0].right.area,{x:14,y:15,radius:3});
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){},update(){}},()=>{});
change('customMetric2','funds');change('customEvent0','announcement');$('eventMessage0').value='Goal comparison';$('eventMonth0').value=1;change('eventCondition0','goalStatus1');change('eventTargetKind0','metric');change('eventRightMetric0','goalStatus3');
$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(city.scenario.definition.events[0].condition.conditions[0].right.metric,'goalStatus2');
console.log('PASS live-comparison form: retained thresholds, real conditional event, independent areas and sparse goal references');
