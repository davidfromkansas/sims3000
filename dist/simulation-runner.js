import {tick} from './engine.js?v=live-scenario-comparisons-2';
const TILE_BATCH=2048;
// Callers hold simulation inputs fixed while busy. The visible city is replaced
// only after all returned batches arrive; pan/zoom remain free to change.
export function createSimulationRunner(makeWorker=()=>new Worker(new URL('./simulation-worker.js?v=live-scenario-comparisons-2',import.meta.url),{type:'module'})){
 let worker=null,pending=null,nextId=0,disabled=false,timer=null;
 const stop=()=>{clearTimeout(timer);timer=null;worker?.terminate();worker=null;};
 return{
  get busy(){return pending!==null;},
  advance(city){
   if(pending)return Promise.reject(Error('A simulation month is already running.'));
   if((city.size||48)<96||disabled)return Promise.resolve({city,result:tick(city),background:false});
   return new Promise((resolve,reject)=>{
    const id=++nextId;pending={id,resolve,reject};let sent=0,received=0,output=null,result;
    const fallback=()=>{if(pending?.id!==id)return;pending=null;stop();disabled=true;try{resolve({city,result:tick(city),background:false});}catch(error){reject(error);}};
    const later=message=>{timer=setTimeout(()=>{timer=null;if(pending?.id!==id)return;try{worker.postMessage(message);}catch{fallback();}},0);};
    try{
     if(!worker)worker=makeWorker();
     worker.onmessage=({data})=>{
      if(pending?.id!==id||data.id!==id)return;
      if(data.error){pending=null;stop();reject(Error(data.error));return;}
      if(data.kind==='input-ready'){
       const offset=sent,tiles=city.tiles.slice(offset,offset+TILE_BATCH);sent+=tiles.length;
       later({id,kind:'input-tiles',offset,tiles});
      }else if(data.kind==='result-begin'){
       output={...data.header,tiles:new Array(data.count)};result=data.result;
       later({id,kind:'output-ready'});
      }else if(data.kind==='output-tiles'){
       if(!output||data.offset!==received||received+data.tiles.length>output.tiles.length){pending=null;stop();reject(Error('Incomplete simulation transfer.'));return;}
       for(const tile of data.tiles)output.tiles[received++]=tile;
       if(received===output.tiles.length){pending=null;resolve({city:output,result,background:true});}
       else later({id,kind:'output-ready'});
      }
     };
     worker.onerror=event=>{event.preventDefault?.();fallback();};
     worker.onmessageerror=fallback;
     const {tiles,...header}=city;
     worker.postMessage({id,kind:'input-begin',header,count:tiles.length});
    }catch{fallback();}
   });
  },
  close(){const previous=pending;pending=null;stop();previous?.reject(Error('Simulation stopped.'));}
 };
}
