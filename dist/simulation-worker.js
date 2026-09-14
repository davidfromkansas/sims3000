import {tick} from './engine.js?v=scripted-ending-ranks-1';
const TILE_BATCH=2048;
let transfer=null;
self.onmessage=({data})=>{
 try{
  // A page kept open across an update can still have the previous runner cached.
  if(!data.kind&&data.city){const result=tick(data.city);self.postMessage({id:data.id,city:data.city,result});return;}
  if(data.kind==='input-begin'){
   transfer={id:data.id,city:{...data.header,tiles:new Array(data.count)},received:0,sent:0};
   self.postMessage({id:data.id,kind:'input-ready'});return;
  }
  if(!transfer||transfer.id!==data.id)return;
  const {city}=transfer;
  if(data.kind==='input-tiles'){
   if(data.offset!==transfer.received||transfer.received+data.tiles.length>city.tiles.length)throw Error('Incomplete simulation transfer.');
   for(const tile of data.tiles)city.tiles[transfer.received++]=tile;
   if(transfer.received<city.tiles.length){self.postMessage({id:data.id,kind:'input-ready'});return;}
   const result=tick(city),{tiles,...header}=city;
   self.postMessage({id:data.id,kind:'result-begin',header,count:tiles.length,result});
  }else if(data.kind==='output-ready'){
   const offset=transfer.sent,tiles=city.tiles.slice(offset,offset+TILE_BATCH);transfer.sent+=tiles.length;
   self.postMessage({id:data.id,kind:'output-tiles',offset,tiles});
   if(transfer.sent===city.tiles.length)transfer=null;
  }
 }catch(error){transfer=null;self.postMessage({id:data.id,error:error.message||'Simulation failed.'});}
};
