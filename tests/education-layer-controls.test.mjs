import assert from 'node:assert/strict';
import {createCity} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {showCivic} from '../dist/civic-ui.js';
import {showReports} from '../dist/reports-ui.js';
import {NAV_LAYERS} from '../dist/navigation-map.js';
import {showCityViewOptions,createCityViewOptions} from '../dist/city-view-options.js';
const city=createCity(),before=serializeCity(city);let html='',controls=new Map(),buttons=[],closed=0,layer='city',navigation='city',tool='road',saved=0;
const camel=s=>s.replace(/-([a-z])/g,(_,v)=>v.toUpperCase());
const dialog=(_,body)=>{html=body;controls=new Map();buttons=[];for(const m of body.matchAll(/<\w+\b([^>]*\bid="([^"]+)"[^>]*)>/g))controls.set(m[2],{value:m[1].match(/value="([^"]*)"/)?.[1]||'',checked:/\bchecked\b/.test(m[1]),textContent:'',innerHTML:''});for(const m of body.matchAll(/<select[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const options=[...m[2].matchAll(/<option\b([^>]*)>/g)],selected=options.find(o=>/selected/.test(o[1]))||options[0];controls.get(m[1]).value=selected?.[1].match(/value="([^"]*)"/)?.[1]||'';}for(const m of body.matchAll(/data-([a-z-]+)="([^"]+)"/g))buttons.push({attribute:m[1],dataset:{[camel(m[1])]:m[2]}});};
globalThis.document={querySelector:s=>controls.get(s.slice(1)),querySelectorAll:s=>buttons.filter(b=>s==='[data-'+b.attribute+']')};
const ui={city:()=>city,dialog,close(){closed++;},update(){},save(){saved++;},clearUndo(){},notify(){},review(){},setTool:v=>tool=v,setLayer:v=>layer=v,setNavigationLayer:v=>navigation=v};
assert.equal(Object.keys(NAV_LAYERS)[0],'city','new maps do not change the default navigation layer');
for(const key of ['schoolAccess','collegeAccess','adultAccess']){
 showCivic(ui);assert.match(html,/not attained education/);buttons.find(b=>b.dataset.civicLayer===key).onclick();assert.equal(layer,key);assert.equal(tool,'road');
 showReports(ui);buttons.find(b=>b.dataset.reportLayer===key).onclick();assert.equal(layer,key);buttons.find(b=>b.dataset.reportNavigation===key).onclick();assert.equal(navigation,key);
 const options=createCityViewOptions(),renderer={layer:key,cityView:options.settings};showCityViewOptions({options,renderer,dialog,close:ui.close,setLayer:ui.setLayer});assert.equal(controls.get('view-layer').value,key);controls.get('view-done').onclick();assert.equal(layer,key);
}
assert.equal(closed,12);assert.equal(saved,0);assert.equal(serializeCity(city),before);
console.log('PASS: actual Civic, City data and City view controls select all three education maps, preserve the construction tool and city state, and retain City as the initial navigation layer.');
