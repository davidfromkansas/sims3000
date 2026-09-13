import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {TREE_STYLES,treeGeometry,rasterizeTrees} from '../dist/tree-models.js';
import {projectMiniature} from '../dist/miniature-raster.js';
const hashes=new Set();
for(const style of Object.keys(TREE_STYLES))for(const level of [1,2,3]){
 const faces=treeGeometry(style,level);assert.ok(faces.length>35);assert.deepEqual(treeGeometry(style,level),faces);
 for(const rotation of [0,1,2,3]){
  for(const face of faces){assert.match(face.color,/^#[0-9a-f]{6}$/);assert.ok(face.points.length>=3);for(const point of face.points){assert.ok(point.every(Number.isFinite));const [x,y]=projectMiniature(point,rotation);assert.ok(x>=0&&x<512&&y>=0&&y<512,'tree geometry fits every view');}}
  const r=rasterizeTrees(style,level,rotation);let visible=0;for(let i=3;i<r.data.length;i+=4)if(r.data[i])visible++;assert.ok(visible>800&&visible<100000,'visible miniature and transparent surround');assert.equal(r.width,512);assert.equal(r.height,512);hashes.add(createHash('sha256').update(r.data).digest('hex'));
 }
}
assert.equal(hashes.size,36,'all three original styles, densities and camera views are distinct');
assert.throws(()=>treeGeometry('missing'));assert.throws(()=>treeGeometry('palm',0));assert.throws(()=>rasterizeTrees('palm',1,4));
console.log('PASS: 36 deterministic original tree miniatures, all-style/density/four-view distinction, finite contained geometry, transparent raster bounds and invalid selection rejection.');
// Actual renderer integration respects four camera views and the flora visibility option.
const {CityRenderer}=await import('../dist/renderer.js');const {createCity}=await import('../dist/engine.js');const {landscapeGround}=await import('../dist/city-appearance.js');
const c=createCity('Tree rendering',false);for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});const t=c.tiles[24*48+24];Object.assign(t,{nature:true,treeLevel:3});
const images=[],diamonds=[],ctx=new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:()=>({width:0}),drawImage:(...a)=>images.push(a)},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>{o[k]=v;return true;}});
globalThis.document={createElement:()=>({getContext:()=>ctx}),hidden:false,querySelector:()=>null};
const renderer=Object.create(CityRenderer.prototype);Object.assign(renderer,{getCity:()=>c,ctx,dpr:1,w:1500,h:800,rotation:0,zoom:1,pan:{x:0,y:0},sprites:[],layer:'city',reducedMotion:{matches:true},vehicleTime:0,preferences:{vehicleAnimations:false,pedestriansVisible:false},hover:null,tool:'query',sprite(){},drawRoad(){},drawTrack(){},drawHighway(){},line(){},diamond:(...a)=>diamonds.push(a)});
for(const style of Object.keys(TREE_STYLES))for(const rotation of [0,1,2,3]){c.appearance={trees:style,landscape:'arid'};renderer.rotation=rotation;images.length=0;diamonds.length=0;renderer.draw();const p=renderer.project(t.x,t.y);assert.ok(images.some(a=>a[0].width===256&&a[1]===p.x-256*renderer.unit*2/460));assert.ok(diamonds.some(a=>a[0]===p.x&&a[1]===p.y&&a[3]===landscapeGround(t,'arid')));}
renderer.cityView={flora:false};images.length=0;renderer.draw();assert.equal(images.length,0,'hiding flora also hides modeled trees');
