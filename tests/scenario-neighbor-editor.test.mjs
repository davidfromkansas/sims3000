import assert from 'node:assert/strict';
import {showCustomScenarioEditor} from '../dist/scenario-editor.js';
import {createCity,build,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {connectionCandidates,addConnection,signDeal} from '../dist/region.js';
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

const city=createCity('Trade editor',false);for(const t of city.tiles)Object.assign(t,{terrain:'land',nature:false});let saved=0,started=0;
showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){saved++;},update(){},beginCustom(){started++;}},()=>{});
const change=(id,value)=>{$(id).value=value;$(id).onchange();};
change('customMetric0','connectionEastPower');assert.match($('customTarget0').optionsHTML,/Active/);$('customTarget0').value='1';
change('customMetric1','dealEastPowerImport');$('customTarget1').value='1';
change('customEvent0','announcement');$('eventMonth0').value='1';$('eventMessage0').value='Import active: {dealEastPowerImport}';change('eventCondition0','dealEastPowerImport');assert.match($('eventThreshold0').optionsHTML,/Inactive/);assert.match($('eventOperator0').optionsHTML,/value="eq"/);assert.doesNotMatch($('eventOperator0').optionsHTML,/value="gt"/);$('eventThreshold0').value='1';
$('customTitle').value='Open the eastern lifeline';$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(saved,1);assert.equal(started,1);assert.equal(city.scenario.definition.objectives[1].metric,'dealEastPowerImport');
tick(city);assert.equal(city.scenario.status,'playing');assert.ok(build(city,'powerline',[{x:47,y:24}]).ok);assert.ok(addConnection(city,connectionCandidates(city).find(p=>p.kind==='power'&&p.side==='east')).ok);assert.ok(signDeal(city,0,'power','import',25).ok);const loaded=validateSave(JSON.parse(serializeCity(city)));tick(loaded);assert.equal(loaded.scenario.status,'won');assert.equal(loaded.scenario.events[0].message,'Import active: 1');
console.log('PASS: actual scenario creator offers neighbor state selectors and equality conditions, submits an active eastern connection/import challenge, and its saved city wins after the real trading actions.');

showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){},update(){}},()=>{});
change('customEvent0','neighborDeal');assert.equal($('eventDealFields0').hidden,false);assert.equal($('eventX0').disabled,true);assert.equal($('eventY0').disabled,true);
change('eventDealNeighbor0','sea');assert.equal($('eventDealResource0').value,'garbage');assert.equal($('eventDealResource0').disabled,true);
change('eventDealNeighbor0','east');assert.equal($('eventDealResource0').disabled,false);$('eventDealResource0').value='power';change('eventDealOperation0','disable');assert.equal($('eventDealAmount0').disabled,true);$('eventMonth0').value='1';$('startCustom').onclick();assert.equal($('customError').textContent,'');assert.equal(city.scenario.definition.events[0].operation,'disable');assert.equal(city.scenario.definition.events[0].amount,undefined);tick(city);assert.equal(city.scenario.events[0].dealResult.outcome,'ended');

showCustomScenarioEditor({city:()=>city,dialog:(_,html)=>parse(html),exportCity(){},save(){},update(){}},()=>{});change('customEvent0','earthquake');assert.equal($('eventMagnitudeLabel0').hidden,false);assert.equal($('eventMagnitude0').disabled,false);$('eventMagnitude0').value='101';$('startCustom').onclick();assert.match($('customError').textContent,/magnitude/);$('eventMagnitude0').value='25';$('startCustom').onclick();assert.equal(city.scenario.definition.events[0].magnitude,25);

change('customEvent0','tornado');assert.equal($('eventTornadoFields0').hidden,false);$('eventTornadoDirection0').value='northwest';$('eventTornadoIntensity0').value='75';$('eventTornadoDistance0').value='5';$('eventTornadoSpeed0').value='slow';$('eventTornadoWarning0').checked=false;$('startCustom').onclick();assert.deepEqual(city.scenario.definition.events[0].tornado,{direction:'northwest',intensity:75,distance:5,speed:'slow',warning:false});
