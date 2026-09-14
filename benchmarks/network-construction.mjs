// node benchmarks/network-construction.mjs [absolute dist directory]
// Isolates graph construction; does not measure browser interaction or monthly play.
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const root=process.argv[2]?pathToFileURL(resolve(process.argv[2])+'/'):new URL('../dist/',import.meta.url);
const {createCity}=await import(new URL('engine.js',root));
const {streetGraph}=await import(new URL('highway.js',root));
const {railNetwork}=await import(new URL('rail.js',root));
const results=[];
for(const layout of ['empty','roads','mixed']){
 const c=createCity('Network construction benchmark',false,256);
 for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;t.type=null;t.rail=false;t.subway=false;t.highway=false;
  if(layout!=='empty'&&(t.x%6===0||t.y%6===0))t.type='road';
  if(layout==='mixed'){t.rail=t.x%12===2||t.y%12===2;t.subway=t.x%16===4||t.y%16===4;t.highway=t.x%24===0;}
 }
 const samples=[];let graph;
 for(let i=0;i<10;i++){const start=performance.now();graph=streetGraph(c);railNetwork(c);const elapsed=performance.now()-start;if(i>=3)samples.push(elapsed);}
 results.push({layout,tiles:c.tiles.length,roadGroups:graph.count,streetEdges:graph.edges.reduce((sum,e)=>sum+e.length,0),samplesMs:samples,medianMs:[...samples].sort((a,b)=>a-b)[3]});
}
console.log(JSON.stringify({runtime:process.version,platform:process.platform,scope:'Synthetic 256 maps, three warmups and seven measured road/rail graph constructions. No browser FPS or monthly simulation claim.',results},null,2));
