import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCity} from '../dist/engine.js';
import {neighborhoodSnapshot,showNeighborhoodReport,installNeighborhoodLink} from '../dist/neighborhood-report.js';
const c=createCity();for(const t of c.tiles){t.type=null;t.level=0;}
const put=(x,y,level,values={})=>Object.assign(c.tiles[y*c.size+x],{type:'residential',level,powered:false,watered:false,waste:0},values);
put(10,10,1,{powered:true,watered:true,healthCoverage:100,airPollution:10});put(12,10,2,{healthCoverage:25,airPollution:70,waste:12});put(13,10,1,{waste:100});
const before=JSON.stringify(c),d=neighborhoodSnapshot(c,{x:10,y:10},2);
assert.equal(d.tiles,13);assert.equal(d.homes,2);assert.equal(d.residents,32);assert.equal(d.power,25);assert.equal(d.water,25);assert.equal(d.healthCoverage,43.75);assert.equal(d.airPollution,55);assert.equal(d.waste,12);assert.equal(JSON.stringify(c),before);
assert.equal(neighborhoodSnapshot(c,{x:0,y:0},2).tiles,6);assert.equal(neighborhoodSnapshot(c,{x:0,y:0},2).healthCoverage,null);assert.throws(()=>neighborhoodSnapshot(c,{x:-1,y:0},4));assert.throws(()=>neighborhoodSnapshot(c,{x:0,y:0},3));
// Occupancy stays distributed across lot members; count the building only once.
put(10,11,1,{lotRoot:10*c.size+10});c.tiles[10*c.size+10].lotRoot=10*c.size+10;
assert.equal(neighborhoodSnapshot(c,{x:10,y:10},2).homes,2);assert.equal(neighborhoodSnapshot(c,{x:10,y:10},2).residents,40);
const controls=Object.fromEntries(['neighborhoodRadius','neighborhoodCivic','neighborhoodUtilities','neighborhoodBack','dialogBody'].map(k=>[k,{}])),map={dataset:{neighborhoodLayer:'health'}},calls=[];let html='';controls.dialogBody.append=b=>controls.link=b;controls.neighborhoodRadius.focus=()=>{};
globalThis.document={getElementById:id=>controls[id],querySelectorAll:()=>[map],createElement:()=>({})};
const ui={city:()=>c,dialog:(title,body)=>{assert.equal(title,'Neighborhood services');html=body;},close:()=>calls.push('close'),center:p=>calls.push(p),layer:l=>calls.push(l),civic:()=>calls.push('civic'),utilities:()=>calls.push('utilities'),back:()=>calls.push('back')};
installNeighborhoodLink(ui,{x:10,y:10});controls.link.onclick();assert.match(html,/4 tiles/);controls.neighborhoodRadius.onchange({target:{value:'2'}});assert.match(html,/13 tiles in a circular area/);assert.match(html,/not a local age census/);map.onclick();controls.neighborhoodCivic.onclick();controls.neighborhoodUtilities.onclick();controls.neighborhoodBack.onclick();assert.deepEqual(calls,['close',{x:10,y:10},'health','civic','utilities','back']);delete globalThis.document;
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),wrapper=app.slice(app.indexOf('function showQuery('),app.indexOf('function showTileQuery('));let linked;const renderer={w:800,h:600,unit:20,pan:{x:2,y:3},project:()=>({x:100,y:200})};
new Function('ui','with(ui){'+wrapper+';showQuery({x:10,y:10});}')({city:c,renderer,showTileQuery:()=>calls.push('tile'),installNeighborhoodLink:(ui,p)=>linked={ui,p},dialog:()=>{},closeDialog:()=>{},setLayer:()=>{},showServices:()=>{},showUtilities:()=>{}});assert.equal(calls.at(-1),'tile');linked.ui.center(linked.p);assert.deepEqual(renderer.pan,{x:302,y:93});assert.equal(renderer.dirty,true);
console.log('PASS: circular neighborhood boundaries, resident-weighted service diagnosis, multi-lot counts, empty areas, report actions and tile-query integration.');
