import {pathToFileURL} from 'node:url';
import {populateRailFixture} from './rail-fixture.mjs';
const engine=await import(process.argv[2]?pathToFileURL(process.argv[2]).href:new URL('../dist/engine.js',import.meta.url).href);
const results=[];
for(const [size,width]of [[96,36],[256,60]]){
 const samples=[];
 for(let i=0;i<3;i++){const c=populateRailFixture(engine.createCity('Rail benchmark',false,size),width);const start=performance.now();engine.recompute(c);const recomputeMs=performance.now()-start;const monthStart=performance.now();engine.tick(c);samples.push({recomputeMs,monthMs:performance.now()-monthStart,trainRiders:c.stats.trainRiders});}
 const median=key=>samples.map(s=>s[key]).sort((a,b)=>a-b)[1];results.push({size,width,samples,recomputeMs:median('recomputeMs'),monthMs:median('monthMs')});
}
console.log(JSON.stringify({runtime:process.version,scope:'Synthetic transit districts, three samples; no browser responsiveness claim.',results},null,2));
