import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {createCity,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {createSimulationRunner} from '../dist/simulation-runner.js';
const runner=createSimulationRunner(()=>{
 const node=new Worker(new URL('./support/simulation-worker-node.mjs',import.meta.url)),adapter={postMessage:data=>node.postMessage(data),terminate:()=>node.terminate()};
 node.on('message',data=>adapter.onmessage?.({data}));node.on('error',error=>adapter.onerror?.(error));return adapter;
});
try{
 let c=createCity('Worker city',true,96),reference=structuredClone(c);
 for(let month=0;month<3;month++){
  const before=serializeCity(c),request=runner.advance(c);assert.equal(runner.busy,true);assert.equal(serializeCity(c),before,'worker month does not partially mutate the visible city');await assert.rejects(runner.advance(c),/already running/);
  const result=await request;assert.equal(result.background,true);assert.equal(runner.busy,false);const expected=tick(reference);assert.deepEqual(result.result,expected);assert.deepEqual(result.city.stats,reference.stats);assert.equal(serializeCity(result.city),serializeCity(reference));c=result.city;
 }
}finally{runner.close();}
let attempts=0;const unavailable=createSimulationRunner(()=>{attempts++;throw Error('Workers unavailable');});const c=createCity('Fallback',false,96);const one=await unavailable.advance(c);assert.equal(one.background,false);assert.equal(c.month,1);await unavailable.advance(c);assert.equal(c.month,2);assert.equal(attempts,1,'worker availability fallback is retained');unavailable.close();
let adapter;const errors=createSimulationRunner(()=>adapter={postMessage(data){queueMicrotask(()=>this.onmessage({data:{id:data.id,error:'Invalid simulation'}}));},terminate(){}});const unchanged=createCity('Failure',false,96),before=serializeCity(unchanged);await assert.rejects(errors.advance(unchanged),/Invalid simulation/);assert.equal(serializeCity(unchanged),before);assert.equal(errors.busy,false);errors.close();
const pending=createSimulationRunner(()=>({postMessage(){},terminate(){}}));const request=pending.advance(unchanged);pending.close();await assert.rejects(request,/stopped/);assert.equal(pending.busy,false);
let made=false;const compact=createSimulationRunner(()=>{made=true;});assert.equal((await compact.advance(createCity())).background,false);assert.equal(made,false);
console.log('PASS: actual background worker monthly results match foreground continuation, visible-state isolation, single in-flight month, worker-unavailable fallback, calculation failure, close cancellation and compact-city path.');
