import assert from 'node:assert/strict';
import {createCity,recompute,build,selection} from '../dist/engine.js';
import {recomputeTransport} from '../dist/transport.js';
import {recomputeTransport as reference} from './reference/transport-before-job-index.mjs';
const compare=c=>{recompute(c);const a=structuredClone(c),b=structuredClone(c);const stats=recomputeTransport(b);assert.deepEqual(stats,reference(a));for(let i=0;i<c.tiles.length;i++)assert.deepEqual(b.tiles[i],a.tiles[i],'route data differs at tile '+i);return stats;};
const base=(size=48)=>{const c=createCity('Route equivalence',false,size);c.funds=1000000;for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});return c;};
for(const jobs of [0,2,12,35])for(const carpool of [false,true]){const c=base();c.civic.ordinances.carpool=carpool;for(let x=2;x<42;x++){Object.assign(c.tiles[24*48+x],{type:'road'});Object.assign(c.tiles[23*48+x],{type:'residential',level:2,density:2});if(x<jobs+2)Object.assign(c.tiles[25*48+x],{type:'industrial',level:1});}for(const x of [5,15,25])Object.assign(c.tiles[25*48+x],{type:'busStop',level:0});const stats=compare(c);if(jobs>0)assert.ok(stats.busRiders>0);}
// Separate road networks with uneven job capacity: exhausting one must neither
// search it forever nor consume jobs on the other disconnected network.
const islands=base();for(const y of [8,30])for(let x=4;x<40;x++){islands.tiles[y*48+x].type='road';Object.assign(islands.tiles[(y-1)*48+x],{type:'residential',level:1});if(x<(y===8?6:35))Object.assign(islands.tiles[(y+1)*48+x],{type:'commercial',level:1});}compare(islands);
// Actual rail construction competes with cars for the same finite work slots.
for(const kind of ['rail','subway']){const c=base();assert.ok(build(c,'road',selection('road',{x:4,y:20},{x:42,y:20})).ok);assert.ok(build(c,kind,selection(kind,{x:4,y:24},{x:42,y:24})).ok);for(const x of [7,34])assert.ok(build(c,kind==='rail'?'trainStation':'subwayStation',[{x,y:23}]).ok);for(let x=4;x<18;x++)Object.assign(c.tiles[21*48+x],{type:'residential',level:2,density:2});for(let x=31;x<40;x++)Object.assign(c.tiles[21*48+x],{type:'industrial',level:1});assert.ok(compare(c).trainRiders>0);c.transport.funding=63;assert.ok(compare(c).trainRiders>0);}
const dense=base(96);for(const t of dense.tiles)if(t.x>4&&t.x<53&&t.y>4&&t.y<53){t.type=t.x%6===0||t.y%6===0?'road':t.x%3===0?'industrial':'residential';t.level=t.type==='road'?0:2;t.density=2;}compare(dense);
console.log('PASS: optimized commuter allocation matches the frozen pre-optimization router tile-for-tile across empty, scarce and abundant jobs, bus/carpool, disconnected workplaces, real rail/subway competition, fractional funding and a dense city.');
