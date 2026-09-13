import assert from 'node:assert/strict';
import {createCity,recompute} from '../dist/engine.js';
import {recomputeTransport} from '../dist/transport.js';
import {recomputeTransport as reference} from './reference/transport-before-job-index.mjs';
import {JobCapacity} from '../dist/job-capacity.js';
// Exhausting the currently iterated target must not skip its successor. A rail
// allocation can exhaust targets before the road iterator starts as well.
const a={},b={},c={},targets=new Set([a,b,c]),removed=[],capacity=new JobCapacity([[a,.5],[b,1],[c,1]],new Map([[a,new Set([0])],[b,new Set([0])],[c,new Set([0])]]),work=>{removed.push(work);targets.delete(work);});
const visited=[];for(const work of targets){visited.push(work);capacity.set(work,0);}assert.deepEqual(visited,[a,b,c]);assert.deepEqual(removed,[a,b,c]);assert.equal(targets.size,0);assert.equal(capacity.openCount,0);capacity.set(a,0);assert.equal(removed.length,3,'zero stays zero without duplicate callbacks');
let randomState=73;const random=()=>((randomState=(Math.imul(randomState,1664525)+1013904223)>>>0)/4294967296);
for(let seed=0;seed<24;seed++){
 const city=createCity('Target exhaustion '+seed,false);city.civic.ordinances.carpool=seed%2===0;city.transport.funding=50+seed*3;
 for(const t of city.tiles){t.terrain='land';t.elevation=0;t.nature=false;if(t.x<4||t.y<4||t.x>33||t.y>33)continue;if(t.x%6===0||t.y%6===0)t.type='road';else{const r=random();t.type=r<.58?'residential':r<.8?'industrial':'commercial';t.level=1+Math.floor(random()*3);t.density=3;}}
 for(const x of [7,19,31])Object.assign(city.tiles[7*48+x],{type:'busStop',level:0});recompute(city);
 const old=structuredClone(city),current=structuredClone(city);assert.deepEqual(recomputeTransport(current),reference(old),'stats seed '+seed);for(let i=0;i<city.tiles.length;i++)assert.deepEqual(current.tiles[i],old.tiles[i],'tile '+i+' seed '+seed);
}
console.log('PASS: target removal during iteration preserves successors, exhaustion callbacks fire once, and seeded road/bus/carpool allocations exactly match the frozen router.');
