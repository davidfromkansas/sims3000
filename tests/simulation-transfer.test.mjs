import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {createCity,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {createSimulationRunner} from '../dist/simulation-runner.js';
import {populateRailFixture} from '../benchmarks/rail-fixture.mjs';
const delay=()=>new Promise(resolve=>setTimeout(resolve,15));
let adapter,sends=0;
const cancelled=createSimulationRunner(()=>adapter={postMessage(){sends++;},terminate(){}});
const untouched=createCity('Cancel batch',false,96),initial=serializeCity(untouched);
const pending=cancelled.advance(untouched);
adapter.onmessage({data:{id:1,kind:'input-ready'}});cancelled.close();
await assert.rejects(pending,/stopped/);await delay();
assert.equal(sends,1,'close cancels a queued input batch');assert.equal(serializeCity(untouched),initial);

let count=0;
const failed=createSimulationRunner(()=>({postMessage(data){if(++count===1)queueMicrotask(()=>this.onmessage({data:{id:data.id,kind:'input-ready'}}));else throw Error('Transfer unavailable');},terminate(){}}));
const fallback=createCity('Transfer fallback',false,96),reference=structuredClone(fallback);tick(reference);
assert.equal((await failed.advance(fallback)).background,false);
assert.equal(serializeCity(fallback),serializeCity(reference));failed.close();

let outputAdapter;
const partial=createSimulationRunner(()=>outputAdapter={postMessage(){},terminate(){}});
const original=createCity('Partial result',false,96),snapshot=serializeCity(original),waiting=partial.advance(original);
outputAdapter.onmessage({data:{id:99,kind:'result-begin',header:{},count:1}});
assert.equal(partial.busy,true,'a stale reply cannot finish a later request');
outputAdapter.onmessage({data:{id:1,kind:'result-begin',header:{month:1},count:original.tiles.length,result:{}}});
outputAdapter.onmessage({data:{id:1,kind:'output-tiles',offset:0,tiles:[structuredClone(original.tiles[0])]}});
assert.equal(partial.busy,true);assert.equal(serializeCity(original),snapshot,'partial output never edits the displayed city');
outputAdapter.onmessage({data:{id:1,kind:'output-tiles',offset:9,tiles:[]}});
await assert.rejects(waiting,/Incomplete simulation transfer/);assert.equal(partial.busy,false);partial.close();

const batches=[];const actual=createSimulationRunner(()=>{
 const node=new Worker(new URL('./support/simulation-worker-node.mjs',import.meta.url));
 const bridge={postMessage:data=>{if(data.tiles)batches.push(data.tiles.length);node.postMessage(data);},terminate:()=>node.terminate()};
 node.on('message',data=>{if(data.tiles)batches.push(data.tiles.length);bridge.onmessage?.({data});});node.on('error',error=>bridge.onerror?.(error));return bridge;
});
try{
 const c=populateRailFixture(createCity('Batched metropolis',false,256),36),expected=structuredClone(c);
 const before=serializeCity(c),request=actual.advance(c);assert.equal(serializeCity(c),before);
 const answer=await request;assert.deepEqual(answer.result,tick(expected));assert.deepEqual(answer.city,expected);
 assert.equal(serializeCity(c),before);assert.ok(batches.length>=64);assert.ok(batches.every(n=>n<=2048));
}finally{actual.close();}
const legacy=new Worker(new URL('./support/simulation-worker-node.mjs',import.meta.url));
try{
 const oldCity=createCity('Existing open page',false,96),expected=structuredClone(oldCity);
 const response=new Promise((resolve,reject)=>{legacy.once('message',resolve);legacy.once('error',reject);});
 legacy.postMessage({id:7,city:oldCity});const answer=await response;
 assert.equal(answer.id,7);assert.deepEqual(answer.result,tick(expected));assert.deepEqual(answer.city,expected);
}finally{await legacy.terminate();}
console.log('PASS: bounded real-worker metropolis transfer preserves every city field and result, leaves visible state isolated, cancels queued batches, ignores stale replies, rejects incomplete output and falls back exactly once after a send failure.');
console.log('PASS: a previously cached runner can still complete its legacy whole-city message after the worker is updated.');
