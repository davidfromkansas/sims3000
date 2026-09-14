import assert from 'node:assert/strict';
import {createCity} from '../dist/engine.js';
import {railNetwork} from '../dist/rail.js';
import {railNetwork as reference} from './reference/rail-before-search-reuse.mjs';
import {populateRailFixture} from '../benchmarks/rail-fixture.mjs';
let passengers=0;
for(const mode of ['rail','subway','mixed'])for(const funding of [0,63,100]){
 const a=populateRailFixture(createCity('Rail route equivalence',false,96),36,mode);a.transport.funding=funding;
 const b=structuredClone(a),old=reference(a),current=railNetwork(b);
 const jobsA=a.tiles.filter(t=>t.type==='industrial'),jobsB=b.tiles.filter(t=>t.type==='industrial');
 const remainingA=new Map(jobsA.map((t,i)=>[t,i%4===0?0:17])),remainingB=new Map(jobsB.map((t,i)=>[t,i%4===0?0:17]));
 const homes=a.tiles.filter(t=>t.type==='residential');
 for(let k=0;k<homes.length;k++){
  const h=homes[k],i=h.y*96+h.x,max=(k%3+1)*7.3;
  // Alternate callers can provide a new workplace list; its order must still win ties.
  const wa=k%11===0?[...jobsA].reverse():jobsA,wb=k%11===0?[...jobsB].reverse():jobsB;
  const result=current.allocate(b.tiles[i],wb,remainingB,max);
  assert.deepEqual(result,old.allocate(h,wa,remainingA,max),`${mode}/${funding}/home ${k}`);passengers+=result.passengers;
  if(k%9===0){const j=k%jobsA.length;remainingA.set(jobsA[j],0);remainingB.set(jobsB[j],0);}
 }
 assert.deepEqual([...remainingB.values()],[...remainingA.values()]);
 assert.deepEqual(current.stats(),old.stats());assert.deepEqual(b,a);
}
assert.ok(passengers>0);
console.log('PASS: reused rail searches match the frozen allocator for every household, route load, transfer, station, remaining job and statistic across rail/subway/mixed networks, funding, fractional passengers, exhaustion and reordered workplace lists.');
