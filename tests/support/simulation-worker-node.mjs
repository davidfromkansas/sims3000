import {parentPort} from 'node:worker_threads';
const waiting=[];globalThis.self={postMessage:data=>parentPort.postMessage(data)};
parentPort.on('message',data=>self.onmessage?self.onmessage({data}):waiting.push(data));
await import('../../dist/simulation-worker.js');
for(const data of waiting)self.onmessage({data});
