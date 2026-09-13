import assert from 'node:assert/strict';
import {createCity,recompute,validateSave,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {pedestrianRoutes,pedestrians,drawPedestrian} from '../dist/pedestrian-visuals.js';
import {CityRenderer} from '../dist/renderer.js';
const c=createCity('Walking neighborhoods'),saved=serializeCity(c),routes=pedestrianRoutes(c);
assert.ok(routes.length>10);assert.deepEqual(pedestrianRoutes(c),routes);assert.ok(routes.length<=96);
for(const r of routes){assert.ok(r.path.length>=2&&r.path.length<=8);assert.equal(new Set(r.path).size,r.path.length);for(let j=0;j<r.path.length;j++){const t=c.tiles[r.path[j]];assert.equal(t.type,'road');assert.equal(t.terrain,'land');assert.equal(t.elevation,r.elevation);if(j){const a=c.tiles[r.path[j-1]];assert.equal(Math.abs(t.x-a.x)+Math.abs(t.y-a.y),1);}}}
const first=pedestrians(c,0,routes);assert.ok(first.length);assert.notDeepEqual(pedestrians(c,1,routes),first);assert.deepEqual(pedestrians(c,0,routes),first);
for(let time=0;time<130;time+=.5){const walkers=pedestrians(c,time,routes);assert.ok(walkers.length<=180);for(const v of walkers){assert.ok(v.x>=0&&v.y>=0&&v.x<c.size&&v.y<c.size);assert.ok(Number.isFinite(v.gait)&&Math.abs(v.gait)<=1);assert.equal(c.tiles[v.tile].type,'road');}}
// At every turn and endpoint, small time steps remain physically continuous.
for(let time=0;time<100;time+=.037){const a=pedestrians(c,time,[routes[0]])[0],b=pedestrians(c,time+.001,[routes[0]])[0];assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.001);}
assert.equal(serializeCity(c),saved);
const broken=validateSave(JSON.parse(saved)),route=routes[0];broken.tiles[route.path[1]].fire=10;assert.deepEqual(pedestrians(broken,0,[route]),[]);broken.tiles[route.path[1]].fire=0;broken.tiles[route.path[1]].elevation++;assert.deepEqual(pedestrians(broken,0,[route]),[]);
broken.finance.roadCondition=20;assert.deepEqual(pedestrianRoutes(broken),[]);broken.finance.roadCondition=100;broken.emergency.active=true;assert.deepEqual(pedestrians(broken,0,routes),[]);
const large=createCity('Large walking city',false,256);for(const t of large.tiles)Object.assign(t,{terrain:'land',type:t.x%4===2&&t.y%4===2?'residential':'road',level:t.x%4===2&&t.y%4===2?3:0,access:true,nature:false});const sampled=pedestrianRoutes(large);assert.equal(sampled.length,96);assert.equal(pedestrians(large,5,sampled).length,180);assert.ok(pedestrians(large,5,sampled).at(-1).tile>256*220,'person cap also preserves distribution across the map');assert.ok(sampled.at(-1).home>256*220,'bounded samples reach neighborhoods across the map');
const empty=createCity('Empty streets',false);assert.deepEqual(pedestrianRoutes(empty),[]);
let arcs=0;const values=[],context=()=>new Proxy({},{get:(_,k)=>k==='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):k.startsWith('create')?()=>({addColorStop(){}}):(...args)=>{if(k==='arc')arcs++;values.push(...args.filter(a=>typeof a==='number'));},set:()=>true});
globalThis.document={hidden:false,querySelector:()=>null,createElement:()=>({getContext:context})};globalThis.requestAnimationFrame=()=>{};
const r=Object.create(CityRenderer.prototype);Object.assign(r,{getCity:()=>c,ctx:context(),zoom:1.5,w:1000,h:800,pan:{x:0,y:0},rotation:0,layer:'city',sprites:[],hover:null,drag:null,tool:'query',vehicleTime:3,dpr:1,reducedMotion:{matches:false},sprite(){},preferences:{vehicleAnimations:false,sceneryAnimations:false,pedestriansVisible:true,pedestrianMinZoom:1}});
for(let rotation=0;rotation<4;rotation++){r.rotation=rotation;for(const gait of [-1,0,1])drawPedestrian(r,{...first[0],gait});}assert.ok(values.every(Number.isFinite));
r.rotation=0;r.draw();assert.equal(r.pedestrianStats,c.stats);const withPeople=arcs;
r.preferences.pedestriansVisible=false;r.draw();assert.equal(arcs,withPeople,'actual renderer hides pedestrians');
r.preferences.pedestriansVisible=true;r.preferences.pedestrianMinZoom=1.5;r.zoom=1.49;r.draw();assert.equal(arcs,withPeople,'pedestrians respect their separate visibility threshold');
r.zoom=1.5;r.draw();assert.ok(arcs>withPeople);recompute(c);r.draw();assert.equal(r.pedestrianStats,c.stats,'construction or simulation statistics invalidate route cache');
Object.assign(r,{draw(){},running:true,vehicleTime:0,previousFrame:null,time:0,dirty:false});r.frame(0);r.frame(100);assert.equal(r.vehicleTime,.1,'pedestrians animate even with vehicles and scenery disabled');r.running=false;r.frame(200);assert.equal(r.vehicleTime,.1);r.running=true;r.reducedMotion.matches=true;r.frame(300);assert.equal(r.vehicleTime,.1);
const loaded=validateSave(JSON.parse(saved));assert.deepEqual(pedestrianRoutes(loaded),routes);tick(c);tick(loaded);assert.deepEqual(c.stats,loaded.stats,'visual pedestrians do not alter simulation or population');
console.log('PASS: neighborhood street routes, hazards and elevation barriers, deterministic continuous walking, bounded sampling, four camera rotations, renderer visibility/cache, scene-clock holds and unchanged saved simulation.');
