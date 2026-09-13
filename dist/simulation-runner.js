import {tick} from './engine.js?v=station-inspection-1';
// The visible city is unchanged until a complete worker month is returned.
export function createSimulationRunner(makeWorker=()=>new Worker(new URL('./simulation-worker.js?v=station-inspection-1',import.meta.url),{type:'module'})){
 let worker=null,pending=null,nextId=0,disabled=false;
 const stop=()=>{worker?.terminate();worker=null;};
 return{
  get busy(){return pending!==null;},
  advance(city){
   if(pending)return Promise.reject(Error('A simulation month is already running.'));
   if((city.size||48)<96||disabled)return Promise.resolve({city,result:tick(city),background:false});
   return new Promise((resolve,reject)=>{
    const id=++nextId;pending={id,resolve,reject};
    const fallback=()=>{if(pending?.id!==id)return;pending=null;stop();disabled=true;try{resolve({city,result:tick(city),background:false});}catch(error){reject(error);}};
    try{
     if(!worker)worker=makeWorker();
     worker.onmessage=({data})=>{if(pending?.id!==id||data.id!==id)return;pending=null;if(data.error){stop();reject(Error(data.error));return;}resolve({city:data.city,result:data.result,background:true});};
     worker.onerror=event=>{event.preventDefault?.();fallback();};
     worker.onmessageerror=fallback;
     worker.postMessage({id,city});
    }catch{fallback();}
   });
  },
  close(){const previous=pending;pending=null;stop();previous?.reject(Error('Simulation stopped.'));}
 };
}
