import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave,planBuild,LABEL} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {bridgeProfile,bridgeInspection,bridgeStructureLines,bridgeProposalReport,proposedBridgeSpans,drawBridgeStructure} from '../dist/bridge-structures.js';
import {CityRenderer} from '../dist/renderer.js';
for(const mode of ['road','rail','highway'])for(const axis of ['x','y'])for(const length of [2,5,6,12]){
 const c=createCity('Bridge structures',false);c.funds=100000;for(const t of c.tiles){t.terrain='land';t.elevation=0;t.nature=false;}
 const point=v=>axis==='x'?{x:v,y:20}:{x:20,y:v},tile=v=>{const p=point(v);return c.tiles[p.y*48+p.x];};
 for(let i=12;i<12+length;i++)tile(i).terrain='water';recompute(c);
 const points=selection(mode,point(11),point(12+length)),proposals=proposedBridgeSpans(c,points,mode);assert.equal(proposals.length,1);assert.equal(proposals[0].length,length);assert.equal(proposals[0].style,length>=6?'Suspension bridge':'Causeway');assert.match(bridgeProposalReport(c,points,mode),new RegExp(length+' water tiles'));assert.ok(build(c,mode,points).ok);
 const profile=bridgeProfile(c,tile(12),mode);assert.equal(profile.style,proposals[0].style);assert.equal(profile.missing.length,0);assert.ok(profile.bankConnected.every(Boolean));assert.equal(bridgeProfile(c,tile(13),mode),profile,'span geometry cached across member tiles');
 const stored=serializeCity(c),views=[];
 for(let rotation=0;rotation<4;rotation++){
  const lines=[],renderer={getCity:()=>c,layer:'city',unit:20,rotation,w:800,h:500,pan:{x:0,y:0},zoom:1,line:(p,color,width)=>lines.push({p,color,width})};renderer.transform=(x,y)=>CityRenderer.prototype.transform.call(renderer,x,y);renderer.project=(x,y)=>CityRenderer.prototype.project.call(renderer,x,y);
  for(let i=12;i<12+length;i++)drawBridgeStructure(renderer,tile(i),mode);
  for(const line of lines){assert.ok(line.width>0);for(const p of line.p)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));}
  assert.ok(lines.length>0);views.push(JSON.stringify(lines));renderer.layer='traffic';const before=lines.length;drawBridgeStructure(renderer,tile(12),mode);assert.equal(lines.length,before,'structures do not obscure data maps');
 }
 assert.equal(new Set(views).size,4);assert.equal(serializeCity(c),stored,'rendering never changes saved city state');
 const restored=validateSave(JSON.parse(stored));assert.deepEqual(bridgeProfile(restored,restored.tiles[point(12).y*48+point(12).x],mode),profile);
 const middle=12+Math.floor(length/2);assert.ok(build(c,'bulldoze',[point(middle)]).ok);const damaged=bridgeProfile(c,tile(12),mode);assert.notEqual(damaged,profile,'construction invalidates cached span');assert.equal(damaged.length,length);assert.equal(damaged.style,profile.style,'missing deck does not shorten or reclassify the span');assert.equal(damaged.missing.length,1);assert.match(bridgeInspection(c,tile(12)),/1 deck tiles missing/);assert.equal(bridgeProfile(c,tile(middle),mode),null);assert.ok(build(c,mode,points).ok);assert.equal(bridgeProfile(c,tile(12),mode).missing.length,0);
 for(let i=12;i<12+length;i++)for(const line of bridgeStructureLines(profile,tile(i)))for(const point of [line.a,line.b])assert.ok(point.every(Number.isFinite));
}
// Exercise the actual proposal dialog handlers from the application construction flow.
const city=createCity('Proposal',false);city.funds=10000;for(const t of city.tiles){t.terrain='land';t.elevation=0;t.nature=false;}for(let x=12;x<=19;x++)city.tiles[20*48+x].terrain='water';recompute(city);
const buttons={},ui={city,tool:'road',density:1,idx:(x,y)=>y*48+x,planBuild,bridgeProposalReport,serializeCity,build,LABEL,LANDSCAPE:{},speed:1,undo:[],AUTO:'auto',gameAudio:{play(){}},money:n=>'§'+n,notify(){},persist(){},update(){},closeDialog(){ui.closed=true;},dialog(title,html){ui.title=title;ui.html=html;},$:id=>buttons[id]??={}};
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),source=app.slice(app.indexOf('function commit('),app.indexOf('function undoBuild(')),commit=new Function('ui','with(ui){'+source+';return commit;}')(ui),points=selection('road',{x:11,y:20},{x:20,y:20}),funds=city.funds;
assert.equal(commit(points).pending,true);assert.match(ui.title,/bridge proposal/);assert.match(ui.html,/Suspension bridge · 8 water tiles/);assert.equal(city.funds,funds);buttons['#cancelBridge'].onclick();assert.equal(city.funds,funds);assert.equal(city.tiles[20*48+12].type,null);
commit(points);buttons['#acceptBridge'].onclick();assert.ok(city.funds<funds);assert.equal(city.tiles[20*48+12].type,'road');assert.match(bridgeInspection(city,city.tiles[20*48+12]),/deck is complete/);
console.log('PASS: causeway/suspension construction proposals, road/rail/highway axes, four-view structures, damage inspection and repair, cache invalidation, data-map clarity and saved continuity.');
