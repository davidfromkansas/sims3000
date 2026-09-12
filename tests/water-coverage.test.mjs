import assert from 'node:assert/strict';
import {pipeCoverage} from '../dist/water-coverage.js';
// Independent definition of coverage: nearest pipe, inclusive Chebyshev radius seven,
// then distance and tile-index priority. This order decides who receives scarce water.
for(const size of [48,96,256]){
 const scratch=new Uint8Array(size*size).fill(255);
 for(const sources of [[],[0],[size*size-1],[size+1,size+2,size+1],[0,size-1,size*(size-1),size*size-1],Array.from({length:size},(_,x)=>Math.floor(size/2)*size+x)]){
  const expected=[];
  for(let i=0;i<size*size;i++){
   let distance=Infinity;for(const s of sources)distance=Math.min(distance,Math.max(Math.abs(i%size-s%size),Math.abs(Math.floor(i/size)-Math.floor(s/size))));
   if(distance<=7)expected.push([i,distance]);
  }
  expected.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
  assert.deepEqual(pipeCoverage(size,sources,scratch),expected.map(([i])=>i));
  assert.ok(scratch.every(v=>v===255),'separate pipe networks do not retain coverage from previous searches');
 }
}
console.log('PASS: overlapping pipe coverage matches nearest-distance allocation order, map edges, empty and duplicate sources, and independent network searches through 256 tiles.');
