// Node worker-thread measurement of cloning/coordination, not browser FPS.
import {Worker} from 'node:worker_threads';
import {createCity,recompute} from '../dist/engine.js';
import {createSimulationRunner} from '../dist/simulation-runner.js';
const size=Number(process.argv[2]||256),c=createCity('Background benchmark',false,size);
for(const t of c.tiles){const road=t.x%6===0||t.y%6===0;Object.assign(t,{terrain:'land',elevation:0,nature:false,type:road?'road':t.x%12<6?'residential':t.y%12<6?'industrial':'commercial',level:road?0:3,density:3,pipe:true});}recompute(c);
const runner=createSimulationRunner(()=>{const worker=new Worker(new URL('../tests/support/simulation-worker-node.mjs',import.meta.url)),adapter={postMessage:data=>worker.postMessage(data),terminate:()=>worker.terminate()};worker.on('message',data=>adapter.onmessage?.({data}));worker.on('error',error=>adapter.onerror?.(error));return adapter;});
let beats=0,last=performance.now(),maxDelay=0;const interval=setInterval(()=>{const now=performance.now();maxDelay=Math.max(maxDelay,now-last);last=now;beats++;},20),start=performance.now();
try{const result=await runner.advance(c);maxDelay=Math.max(maxDelay,performance.now()-last);console.log(JSON.stringify({size,totalMs:Math.round(performance.now()-start),mainThreadTimerCallbacks:beats,longestTimerGapMs:Math.round(maxDelay),background:result.background,visibleMonth:c.month,returnedMonth:result.city.month}));}finally{clearInterval(interval);runner.close();}
