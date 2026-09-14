import assert from 'node:assert/strict';
import {orderPowerConsumers} from '../dist/power-allocation-order.js';
const reference=(queue,tiles,sources)=>queue.sort((a,b)=>Math.min(...sources.map(s=>Math.abs(tiles[a].x-tiles[s].x)+Math.abs(tiles[a].y-tiles[s].y)))-Math.min(...sources.map(s=>Math.abs(tiles[b].x-tiles[s].x)+Math.abs(tiles[b].y-tiles[s].y))));
let seed=415;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(const size of [8,48,96,256]){
 const tiles=Array.from({length:size*size},(_,i)=>({x:i%size,y:Math.floor(i/size)}));
 for(const count of [0,1,2,16,64]){
  const sources=Array.from({length:count},()=>Math.floor(random()*tiles.length)),queue=tiles.map((_,i)=>i).filter(()=>random()<.6);
  for(let i=queue.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[queue[i],queue[j]]=[queue[j],queue[i]];}
  const expected=reference([...queue],tiles,sources),actual=orderPowerConsumers([...queue],tiles,sources,size);assert.deepEqual(actual,expected,`${size} map with ${count} sources: exact ordering, including ties`);
  // A shortage that can skip large consumers must still energize exactly the same tiles.
  const supply=order=>{let remaining=113;return order.filter(i=>{const need=i%7;if(remaining<need)return false;remaining-=need;return true;});};assert.deepEqual(supply(actual),supply(expected));
 }
 const queue=[size+1,0,size,1],copy=[...queue];assert.equal(orderPowerConsumers(queue,tiles,[],size),queue);assert.deepEqual(queue,copy);
}
const tiles=Array.from({length:16},(_,i)=>({x:i%4,y:Math.floor(i/4)}));assert.deepEqual(orderPowerConsumers([4,1,0],tiles,[0],4),[0,4,1],'equidistant input order is stable');
console.log('PASS: exact legacy power allocation order across sparse/dense 8–256 grids, many and absent sources, shuffled ties and capacity-limited consumer selection.');
