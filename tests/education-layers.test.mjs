import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {EDUCATION_LAYERS,educationLayerProfile,educationLayerColor} from '../dist/education-layers.js';
import {NAV_LAYERS,navigationColor,navigationLegend} from '../dist/navigation-map.js';
import {stationAreas,drawNavigationPrecincts} from '../dist/service-areas.js';
import {CityRenderer} from '../dist/renderer.js';
const c=createCity('Education map planning',false);c.funds=1000000;for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});
const at=(x,y)=>c.tiles[y*48+x],place=(type,x,y,xx=x,yy=y)=>assert.ok(build(c,type,selection(type,{x,y},{x:xx,y:yy}),3).ok,type);
place('coal',8,14);place('road',10,20,35,20);place('powerline',10,22,35,22);place('residential',12,18,17,18);for(let x=12;x<=17;x++)at(x,18).level=3;place('school',18,23);recompute(c);
const home=at(12,18),color=layer=>educationLayerColor(home,educationLayerProfile(c,layer));
assert.equal(color('schoolAccess'),'hsl(120,55%,48%)');assert.equal(color('collegeAccess'),'hsl(0,55%,48%)');assert.equal(color('adultAccess'),'hsl(0,55%,48%)');
place('college',21,23);assert.equal(color('collegeAccess'),'hsl(120,55%,48%)');assert.equal(color('adultAccess'),'hsl(0,55%,48%)');
place('library',24,23);assert.equal(color('libraryAccess'),'hsl(120,55%,48%)');assert.equal(color('museumAccess'),'hsl(0,55%,48%)');place('museum',26,23);assert.equal(color('museumAccess'),'hsl(120,55%,48%)');assert.deepEqual(stationAreas(c,'libraryAccess').map(a=>a.label),['L']);assert.deepEqual(stationAreas(c,'museumAccess').map(a=>a.label),['M']);assert.equal(color('adultAccess'),'hsl(120,55%,48%)');
Object.assign(at(42,42),{type:'residential',density:3,level:1});recompute(c);for(const key of Object.keys(EDUCATION_LAYERS))assert.equal(educationLayerColor(at(42,42),educationLayerProfile(c,key)),'hsl(0,55%,48%)','disconnected neighborhood stays visibly unserved');
for(const key of Object.keys(EDUCATION_LAYERS)){assert.ok(NAV_LAYERS[key]);assert.match(navigationLegend(key),/no demand/);assert.equal(navigationColor(home,key,educationLayerProfile(c,key)),color(key));assert.equal(educationLayerColor(at(10,20),educationLayerProfile(c,key)),'#6a7770');}
assert.deepEqual(stationAreas(c,'adultAccess').map(a=>a.label),['L','M']);assert.equal(stationAreas(c,'schoolAccess').length,1);assert.ok(stationAreas(c,'schoolAccess')[0].active);
c.civic.funding.education=1;recompute(c);assert.ok(home.childEducationCoverage>0&&home.childEducationCoverage<100);assert.notEqual(color('schoolAccess'),'hsl(120,55%,48%)');
c.civic.underfunded.education=6;recompute(c);assert.equal(color('schoolAccess'),'hsl(0,55%,48%)');assert.ok(!stationAreas(c,'schoolAccess')[0].active);
const dots=[],ctxDots={save(){},restore(){},beginPath(){},arc(...a){dots.push(a);},stroke(){},fill(){assert.equal(this.fillStyle,'#f4a477');}};
for(const rotation of [0,1,2,3]){const r=Object.create(CityRenderer.prototype);Object.assign(r,{rotation,getCity:()=>c});dots.length=0;drawNavigationPrecincts(ctxDots,c,'adultAccess',(x,y)=>r.transform(x,y),2);assert.equal(dots.length,2,'capacity facilities have markers, not fictitious radial coverage');}
c.civic.underfunded.education=0;c.civic.funding.education=100;recompute(c);
const before=serializeCity(c),restored=validateSave(JSON.parse(before));for(const layer of Object.keys(EDUCATION_LAYERS))assert.deepEqual(educationLayerProfile(restored,layer),educationLayerProfile(c,layer));
// Exercise the actual city renderer: identical home colors to navigation, retained facility labels.
const labels=[],diamonds=[],ctx=new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:()=>({width:0}),fillText:text=>labels.push(text)},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>{o[k]=v;return true;}});
globalThis.document={createElement:()=>({getContext:()=>ctx}),hidden:false,querySelector:()=>null};
const renderer=Object.create(CityRenderer.prototype);Object.assign(renderer,{getCity:()=>c,ctx,dpr:1,w:1800,h:1000,rotation:0,zoom:1,pan:{x:0,y:0},sprites:[],reducedMotion:{matches:true},vehicleTime:0,preferences:{vehicleAnimations:false,pedestriansVisible:false},hover:null,tool:'query',sprite(){},drawRoad(){},drawTrack(){},drawHighway(){},line(){},diamond:(...args)=>diamonds.push(args)});
for(const layer of Object.keys(EDUCATION_LAYERS))for(const rotation of [0,1,2,3]){renderer.layer=layer;renderer.rotation=rotation;diamonds.length=0;labels.length=0;renderer.draw();const p=renderer.project(home.x,home.y);assert.ok(diamonds.some(d=>d[0]===p.x&&d[1]===p.y&&d[3]===color(layer)));for(const a of stationAreas(c,layer))assert.ok(labels.includes(a.label));}
assert.equal(serializeCity(c),before,'all diagnostics are read-only');
c.demographics.cohorts=[0,0,c.stats.population,0,0,0,0,0];assert.equal(educationLayerProfile(c,'schoolAccess').hasDemand,false);assert.equal(color('schoolAccess'),'#6a7770');assert.equal(color('collegeAccess'),'#6a7770');assert.equal(educationLayerProfile(c,'adultAccess').hasDemand,true);
console.log('PASS: age-specific school/college/adult maps use real network coverage, show distinct shortages and funding/strike recovery, mark relevant facilities without false rings, handle zero age demand, match actual four-view city/nav colors and preserve saved simulation state.');
