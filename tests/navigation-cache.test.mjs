import assert from 'node:assert/strict';
import {createCity,recompute,build,selection} from '../dist/engine.js';
import {createNavigationSurface,navigationColor,navigationResolution} from '../dist/navigation-map.js';
import {CityRenderer} from '../dist/renderer.js';
for(const size of [48,96,128,256]){assert.equal(navigationResolution(size)%size,0);assert.ok(navigationResolution(size)>=192);}
const c=createCity('Navigation cache',true,256),r=Object.create(CityRenderer.prototype);Object.assign(r,{getCity:()=>c,rotation:0,pan:{x:0,y:0},zoom:1});
let fills=0;const paint=[],ctx=new Proxy({fillRect(...a){fills++;paint.push([this.fillStyle,...a]);}},{get:(target,key)=>key in target?target[key]:()=>{},set:(target,key,value)=>(target[key]=value,true)}),canvas={getContext:()=>ctx},surface=createNavigationSurface(()=>canvas);
assert.equal(surface(r,'city',192,192),canvas);assert.equal(fills,65536);const initial=[...paint];
for(let i=0;i<20;i++){r.pan.x+=20;r.zoom+=.01;surface(r,'city',192,192);}assert.equal(fills,65536,'camera-only frames do not repaint any terrain tiles');
for(const rotation of [1,2,3,0]){r.rotation=rotation;paint.length=0;surface(r,'city',192,192);assert.deepEqual(paint,c.tiles.map(t=>{const [x,y]=r.transform(t.x,t.y);return[navigationColor(t,'city'),x*.75,y*.75,.75,.75];}));}
assert.deepEqual(paint,initial,'returning to north restores the same draw order and colors');
let before=fills;surface(r,'water',192,192);assert.equal(fills-before,65536);before=fills;surface(r,'water',192,192);assert.equal(fills,before);
assert.ok(build(c,'road',selection('road',{x:10,y:10},{x:11,y:10})).ok);surface(r,'water',192,192);assert.equal(fills-before,65536,'real construction invalidates the cached simulation image');
before=fills;recompute(c);surface(r,'water',192,192);assert.equal(fills-before,65536);
before=fills;surface(r,'water',256,256);assert.equal(fills-before,65536);assert.equal(canvas.width,256);
const other=createCity();r.getCity=()=>other;before=fills;surface(r,'water',192,192);assert.equal(fills-before,2304,'loading another city invalidates the image');
console.log('PASS: 256-map terrain reuse, exact rotated draw equivalence, camera-only reuse, construction/recompute/layer/resize/city invalidation.');
