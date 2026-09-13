import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CityRenderer} from '../dist/renderer.js';
import {createCity,build,LABEL} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {moveKeyboardCursor,startKeyboardRange,takeKeyboardSelection,cancelKeyboardRange,keyboardRangeAllowed,keepKeyboardCursorVisible} from '../dist/keyboard-construction.js';
import {backgroundInteractionAllowed} from '../dist/background-controls.js';
const makeRenderer=c=>Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>c,w:800,h:500,zoom:1,pan:{x:0,y:0},rotation:0,hover:null});
for(const size of [48,96,128,256]){
 const c=createCity('Keyboard',false,size);for(const t of c.tiles){t.elevation=0;t.terrain='land';t.nature=false;}
 const r=makeRenderer(c);
 for(let rotation=0;rotation<4;rotation++){
  r.rotation=rotation;r.hover=null;r.pan={x:0,y:0};const middle=r.pick(r.w/2,r.h/2),before=r.transform(middle.x,middle.y);
  const p=moveKeyboardCursor(r,'ArrowRight');assert.deepEqual(r.transform(p.x,p.y),[before[0]+1,before[1]]);
  moveKeyboardCursor(r,'ArrowLeft');assert.deepEqual(r.hover,middle);
  moveKeyboardCursor(r,'ArrowDown');assert.deepEqual(r.transform(r.hover.x,r.hover.y),[before[0],before[1]+1]);
  moveKeyboardCursor(r,'ArrowUp');assert.deepEqual(r.hover,middle);
  const [x,y]=r.inverse(size-1,size-1);r.hover={x,y};moveKeyboardCursor(r,'ArrowRight');assert.deepEqual(r.hover,{x,y});
  c.tiles[y*size+x].elevation=3;keepKeyboardCursorVisible(r);const projected=r.project(x,y);assert.ok(projected.x>=56&&projected.x<=744);assert.ok(projected.y+r.unit/2>=56&&projected.y+r.unit/2<=444);assert.equal(r.rotation,rotation);assert.equal(r.zoom,1);c.tiles[y*size+x].elevation=0;
 }
 assert.equal(moveKeyboardCursor(r,'a'),null);
}
const c=createCity('Keyboard construction',false,96);for(const t of c.tiles){t.elevation=0;t.terrain='land';t.nature=false;}const r=makeRenderer(c),saved=serializeCity(c);
r.hover={x:60,y:60};startKeyboardRange(r,'residential');r.hover={x:62,y:62};const zones=takeKeyboardSelection(r,'residential');assert.equal(zones.length,9);assert.equal(serializeCity(c),saved,'preview does not build or spend');assert.equal(r.drag,null);assert.equal(r.keyboardRange,null);assert.ok(build(c,'residential',zones).ok);for(const p of zones)assert.equal(c.tiles[p.y*96+p.x].type,'residential');
r.hover={x:60,y:59};startKeyboardRange(r,'road');r.hover={x:65,y:59};const road=takeKeyboardSelection(r,'road');assert.equal(road.length,6);assert.ok(build(c,'road',road).ok);
const after=serializeCity(c);r.hover={x:70,y:70};startKeyboardRange(r,'road');cancelKeyboardRange(r);assert.equal(r.drag,null);assert.equal(serializeCity(c),after);assert.equal(takeKeyboardSelection(r,'road').length,1);
startKeyboardRange(r,'road');r.drag=null;r.hover={x:75,y:75};assert.equal(takeKeyboardSelection(r,'road').length,1,'external gesture cancellation removes old anchor');
startKeyboardRange(r,'road');r.getCity=()=>createCity('Other',false);r.hover={x:20,y:20};assert.equal(takeKeyboardSelection(r,'road').length,1,'a replaced city cannot inherit the old range');r.getCity=()=>c;
startKeyboardRange(r,'road');r.hover=null;assert.deepEqual(takeKeyboardSelection(r,'road'),[]);assert.equal(r.drag,null);
for(const tool of ['query','pan','coal','police','ignite','earthquake','tornado','ufo','whirlpool','toxicCloud','spaceJunk','riot','locust','dispatchFire','dispatchPolice','dispatchCropDuster'])assert.equal(keyboardRangeAllowed(tool),false,tool);
for(const tool of ['road','residential','commercial','industrial','pipe','powerline','bulldoze'])assert.equal(keyboardRangeAllowed(tool),true,tool);
// Execute the actual application key handler, including Shift/Enter and repeat guards.
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),body=app.split("window.addEventListener('keydown',e=>{")[1].split("});\nwindow.addEventListener('keyup'")[0],elements={'#dialog':{open:false}},canvas={id:'city',tagName:'CANVAS'};
let commits=0;const scope={canvas,renderer:r,city:c,tool:'road',LABEL,idx:(x,y)=>y*96+x,$:id=>elements[id]??={},toolbarView:{handleKey:()=>false},moveKeyboardCursor,startKeyboardRange,takeKeyboardSelection,notify:()=>{},cancelMapGesture:()=>cancelKeyboardRange(r),commit:points=>{commits++;assert.ok(build(c,'road',points).ok);}};
const handler=new Function('scope','e','with(scope){'+body+'}'),key=(key,extra={})=>handler(scope,{key,target:canvas,preventDefault(){},...extra});
r.rotation=0;r.hover={x:70,y:70};key('Enter',{shiftKey:true});assert.equal(commits,0);assert.ok(r.keyboardRange);key('ArrowRight');assert.match(elements['#coordinates'].textContent,/72, 71/);assert.match(elements['#keyboardCursorStatus'].textContent,/Range selection/);key('Enter',{repeat:true});assert.equal(commits,0);key('Enter');assert.equal(commits,1);assert.equal(c.tiles[70*96+71].type,'road');key('Enter',{shiftKey:true});key('Escape');assert.equal(r.drag,null);assert.equal(commits,1);
for(const key of ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'])assert.ok(backgroundInteractionAllowed({type:'keydown',key,target:canvas}));assert.equal(backgroundInteractionAllowed({type:'keydown',key:'Enter',target:canvas}),false);
console.log('PASS: size-aware rotated keyboard movement, elevated edge auto-pan, range preview/cancel/commit, stale anchor removal, real large-map roads/zones, actual application Shift/Enter/repeat handlers and background-month guards.');
