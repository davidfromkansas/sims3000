import {tick} from './engine.js?v=medical-research-center-1';
self.onmessage=({data})=>{
 try{const result=tick(data.city);self.postMessage({id:data.id,city:data.city,result});}
 catch(error){self.postMessage({id:data.id,error:error.message||'Simulation failed.'});}
};
