import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {installToolbarView} from '../dist/toolbar-view.js';
import {backgroundInteractionAllowed,nativeSpaceTarget} from '../dist/background-controls.js';
import {CityRenderer} from '../dist/renderer.js';
import {createCity} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const classes=new Set(),root={classList:{toggle:(key,on)=>on?classes.add(key):classes.delete(key)}},attrs={},hideButton={setAttribute:(k,v)=>attrs[k]=v},restoreButton={hidden:true};let cancelled=0,dirty=0,focused=0,dialog=false,turned=0;
const canvas={focus:()=>focused++,closest:()=>null,getContext:()=>({}),clientWidth:900,clientHeight:600},ui=installToolbarView({root,canvas,hideButton,restoreButton,cancelGesture:()=>cancelled++,markDirty:()=>dirty++,isDialogOpen:()=>dialog,rotate:direction=>turned+=direction});
let prevented=0;const key=(key,extra={})=>({key,target:canvas,preventDefault:()=>prevented++,...extra});
assert.equal(ui.hidden,false);hideButton.onclick();assert.equal(ui.hidden,true);assert.ok(classes.has('toolbars-hidden'));assert.equal(restoreButton.hidden,false);assert.equal(attrs['aria-pressed'],'true');assert.equal(cancelled,1);assert.equal(focused,1);assert.equal(nativeSpaceTarget(canvas),false,'canvas focus preserves the game pause shortcut');
ui.handleKey(key('h',{repeat:true}));assert.equal(ui.hidden,true);assert.equal(cancelled,1);
for(const extra of [{ctrlKey:true},{metaKey:true},{altKey:true},{isComposing:true},{target:{isContentEditable:true}},{target:{closest:()=>({})}}])assert.equal(ui.handleKey(key('h',extra)),false);
dialog=true;assert.equal(ui.handleKey(key('Escape')),false);assert.equal(ui.hidden,true);dialog=false;
assert.ok(ui.handleKey(key('Escape')));assert.equal(ui.hidden,false);assert.equal(restoreButton.hidden,true);assert.ok(!classes.has('toolbars-hidden'));assert.equal(cancelled,2);
assert.equal(ui.handleKey(key('Escape')),false);assert.ok(ui.handleKey(key('H')));restoreButton.onclick();assert.equal(ui.hidden,false);assert.equal(cancelled,4);assert.equal(dirty,4);assert.equal(focused,4);assert.throws(()=>ui.setHidden('yes'));assert.equal(ui.hidden,false);
assert.ok(ui.handleKey(key(']')));assert.equal(turned,1);assert.ok(ui.handleKey(key('[',{repeat:true})));assert.equal(turned,1);assert.ok(ui.handleKey(key('[')));assert.equal(turned,0);
for(const key of ['h','H','Escape','[',']'])assert.ok(backgroundInteractionAllowed({type:'keydown',key,target:canvas}));assert.ok(backgroundInteractionAllowed({type:'click',target:{closest:s=>s.includes('.restore-toolbars')?{}:null}}),'restore remains available during a background month');
// Exercise the actual renderer resize observer: expanding the game area must
// preserve its camera center, zoom, rotation and city contents.
const city=createCity(),saved=serializeCity(city),load=CityRenderer.prototype.loadSprites;let resize;
globalThis.matchMedia=()=>({matches:true});globalThis.requestAnimationFrame=()=>{};globalThis.devicePixelRatio=1;globalThis.ResizeObserver=class{constructor(callback){resize=callback;}observe(){resize();}};CityRenderer.prototype.loadSprites=()=>{};
const renderer=new CityRenderer(canvas,()=>city);CityRenderer.prototype.loadSprites=load;renderer.zoom=1.6;renderer.rotation=2;renderer.pan={x:47,y:-28};const p=renderer.pick(renderer.w/2,renderer.h/2),pan={...renderer.pan};canvas.clientWidth=1300;canvas.clientHeight=900;resize();assert.deepEqual(renderer.pick(renderer.w/2,renderer.h/2),p);assert.deepEqual(renderer.pan,pan);assert.equal(renderer.zoom,1.6);assert.equal(renderer.rotation,2);assert.equal(serializeCity(city),saved);
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),gestureBody=app.split('function cancelMapGesture(){')[1].split('}\nconst toolbarView')[0];
let released;const cancelActual=new Function('canvas','let pointer={id:7},space=true,spacePanned=true,renderer={drag:{x:2,y:3},hover:{x:2,y:3}};'+gestureBody+';return {pointer,space,spacePanned,renderer};');
assert.deepEqual(cancelActual({hasPointerCapture:id=>id===7,releasePointerCapture:id=>released=id}),{pointer:null,space:false,spacePanned:false,renderer:{drag:null,hover:null}});assert.equal(released,7);
console.log('PASS: actual toolbar toggle/restore handlers, Escape and guarded H shortcut, repeat/input/dialog protection, drag cancellation and canvas focus, background-month restoration and camera/city preservation on viewport resize.');
