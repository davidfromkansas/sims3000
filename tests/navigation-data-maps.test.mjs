import assert from 'node:assert/strict';
import {createCity} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {NAV_LAYERS,navigationColor,navigationLegend,installNavigation} from '../dist/navigation-map.js';
import {showReports} from '../dist/reports-ui.js';
const city=createCity('Map layers');
const home={terrain:'land',type:'residential',level:1,aura:10,flammability:80,waterPollution:0};
assert.notEqual(navigationColor(home,'aura'),navigationColor({...home,aura:90},'aura'));
assert.equal(navigationColor({...home,type:'commercial'},'aura'),'#6a7770');
assert.notEqual(navigationColor(home,'density'),navigationColor({...home,level:3},'density'));
assert.equal(navigationColor({...home,level:0},'density'),'#929b95');
assert.notEqual(navigationColor(home,'flammability'),navigationColor({...home,flammability:20},'flammability'));
assert.notEqual(navigationColor({...home,terrain:'water'},'waterPollution'),navigationColor({...home,terrain:'water',waterPollution:100},'waterPollution'),'pollution must remain visible on water');
for(const layer of ['rail','subway']){const track={...home,terrain:'water',[layer]:true,[layer+'Riders']:0};assert.notEqual(navigationColor(track,layer),navigationColor({...track,[layer+'Riders']:10},layer));assert.notEqual(navigationColor({...home,type:'railTransfer',stationActive:true},layer),navigationColor({...home,type:'railTransfer',stationActive:false},layer));}
let fills=0;const ctx=new Proxy({},{get:()=>()=>{fills++;},set:()=>true});
const map={width:192,height:192,getContext:()=>ctx,addEventListener(){}};
const select={value:'city'},legend={textContent:''};
const panel={open:false,querySelector:s=>s==='canvas'?map:s==='select'?select:legend,addEventListener(){}};
globalThis.matchMedia=()=>({matches:true});
globalThis.document={createElement:()=>panel,activeElement:null};
const renderer={canvas:{parentElement:{append(){}}},getCity:()=>city,transform:(x,y)=>[x,y],w:800,h:600,pan:{x:17,y:-20},unit:30,layer:'city',tool:'residential'};
const before=serializeCity(city);installNavigation(renderer);assert.equal(panel.open,false);
for(const layer of Object.keys(NAV_LAYERS)){
 renderer.setNavigationLayer(layer);assert.equal(panel.open,true);assert.equal(select.value,layer);
 assert.match(legend.textContent,/Click to jump/);assert.ok(legend.textContent.includes(navigationLegend(layer)));
 assert.equal(renderer.layer,'city');assert.equal(renderer.tool,'residential');assert.deepEqual(renderer.pan,{x:17,y:-20});
}
assert.ok(fills>city.tiles.length);assert.throws(()=>renderer.setNavigationLayer('not-a-map'));
assert.equal(serializeCity(city),before,'map changes never modify the city');
let html='',closed=0;const selected=[];const controls=new Map([['#reportFeedback',{}],['#reportYears',{value:'1'}],['#reportMetric0',{value:'population'}],['#reportMetric1',{value:''}],['#reportMetric2',{value:''}],['#reportGraphs',{}]]);
const layerButtons=[],navigationButtons=[];
globalThis.document={querySelector:s=>controls.get(s),querySelectorAll:s=>s==='[data-report-layer]'?layerButtons:s==='[data-report-navigation]'?navigationButtons:[]};
showReports({city:()=>city,dialog:(_,body)=>{html=body;for(const m of body.matchAll(/data-report-layer="([^"]+)"/g))layerButtons.push({dataset:{reportLayer:m[1]}});for(const m of body.matchAll(/data-report-navigation="([^"]+)"/g))navigationButtons.push({dataset:{reportNavigation:m[1]}});},close:()=>closed++,setLayer:layer=>selected.push(layer),setNavigationLayer:layer=>renderer.setNavigationLayer(layer),review(){}});
assert.ok(layerButtons.some(b=>b.dataset.reportLayer==='flammability'));
for(const b of navigationButtons){b.onclick();assert.equal(select.value,b.dataset.reportNavigation);assert.equal(renderer.layer,'city');}
assert.equal(navigationButtons.length,Object.keys(NAV_LAYERS).length-1);
assert.equal(closed,navigationButtons.length);assert.deepEqual(selected,[]);
layerButtons.find(b=>b.dataset.reportLayer==='density').onclick();assert.deepEqual(selected,['density']);
assert.match(html,/Use as map/);assert.doesNotMatch(html,/annual electricity production remain unfinished/);
console.log('PASS: aura/density/fire-risk navigation colors, polluted-water visibility, independent live map selection, closed-map opening, unchanged city/camera/tool, and report-to-navigation/city actions.');
