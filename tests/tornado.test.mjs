import assert from 'node:assert/strict';
import {createCity,build,idx,recompute,selection,validateSave} from '../dist/engine.js';
import {startTornado as beginTornado,stepFire,setRandomTornadoes,maybeTornado} from '../dist/emergency.js';
import {serializeCity} from '../dist/save.js';
function startTornado(c,x,y){const r=beginTornado(c,x,y);if(r.ok)for(let k=0;k<8;k++)stepFire(c);return r;}
function base(){const c=createCity('Storm recovery',false);for(const t of c.tiles){t.terrain='land';t.nature=false;t.treeLevel=0;}recompute(c);return c;}
const c=base(),t=c.tiles[idx(10,24)];Object.assign(t,{type:'road',pipe:true,rail:true,highway:true,subway:true});recompute(c);
assert.equal(startTornado(c,-1,0).ok,false);assert.ok(startTornado(c,10,24).ok);assert.equal(startTornado(c,11,24).ok,false);assert.equal(setRandomTornadoes(c,true).ok,false);
stepFire(c);recompute(c);assert.equal(t.type,null);assert.equal(t.rail,false);assert.equal(t.highway,false);assert.equal(t.pipe,true);assert.equal(t.subway,true);assert.equal(c.emergency.infrastructureLost,3);assert.equal(c.month,0);
const saved=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(saved.emergency,c.emergency);for(let k=0;k<23;k++){stepFire(c);recompute(c);stepFire(saved);recompute(saved);}assert.equal(c.emergency.active,false);assert.equal(c.emergency.contained,1);assert.equal(serializeCity(c),serializeCity(saved));assert.ok(build(c,'bulldoze',[t]).ok);assert.ok(build(c,'road',[t]).ok);
const homes=base();for(let y=20;y<29;y++)for(let x=5;x<40;x++)Object.assign(homes.tiles[idx(x,y)],{type:'residential',level:1});recompute(homes);startTornado(homes,10,24);let fires=0;for(let k=0;k<24;k++){stepFire(homes);recompute(homes);fires+=homes.stats.burningTiles;}assert.ok(fires);assert.ok(homes.emergency.displaced);for(let k=0;k<300&&homes.emergency.active;k++){stepFire(homes);recompute(homes);}assert.equal(homes.emergency.contained,1);assert.ok(validateSave(JSON.parse(serializeCity(homes))));
for(const hitPortal of [false,true]){const tunnel=base();for(let x=20;x<=27;x++)tunnel.tiles[idx(x,20)].elevation=Math.min(x-19,28-x,3);assert.ok(build(tunnel,'road',selection('road',{x:19,y:20},{x:28,y:20})).ok);startTornado(tunnel,hitPortal?19:23,20);stepFire(tunnel);recompute(tunnel);assert.equal(tunnel.tunnels.length,hitPortal?0:1);assert.ok(validateSave(JSON.parse(serializeCity(tunnel))));}
const legacy=JSON.parse(serializeCity(base()));legacy.version=24;for(const k of ['tornado','tornadoes','randomTornadoes'])delete legacy.emergency[k];assert.equal(validateSave(legacy).emergency.tornado,null);
const bad=JSON.parse(serializeCity(base()));startTornado(bad,4,4);bad.emergency.tornado.dx=2;assert.throws(()=>validateSave(bad),/tornado/);
const random=base();for(let i=0;i<1000;i++){random.month=i;assert.equal(maybeTornado(random),false);}assert.ok(setRandomTornadoes(random,true).ok);let fired=false;for(let i=0;i<5000&&!fired;i++){random.month=i;fired=maybeTornado(random);}assert.ok(fired);
console.log('PASS: tornado path, surface damage, buried utility protection, tunnel portals, secondary fires, recovery, interrupted saves and opt-in random events.');
