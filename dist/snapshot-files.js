export const ALBUM_FILE_LIMIT=100*1024*1024;
const invalid=()=>{throw Error('This is not a valid SIMS3000 photo album.');};
export async function exportAlbum(photos){
 if(!photos.length||photos.length>50)throw Error('Choose an album containing 1–50 photos.');
 const items=[];
 for(const {id,blob,...metadata} of photos){const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));items.push({...metadata,png:btoa(binary)});}
 const file=new Blob([JSON.stringify({format:'SIMS3000 photo album',version:1,photos:items})],{type:'application/json'});
 if(file.size>ALBUM_FILE_LIMIT)throw Error('This album exceeds the 100 MB export limit. Download individual PNGs instead.');return file;
}
export async function readAlbum(file){
 if(file.size>ALBUM_FILE_LIMIT)throw Error('Photo albums must be smaller than 100 MB.');
 let data;try{data=JSON.parse(await file.text());}catch{invalid();}
 if(!data||data.format!=='SIMS3000 photo album'||data.version!==1||!Array.isArray(data.photos)||data.photos.length<1||data.photos.length>50)invalid();
 return data.photos.map(p=>{
  if(!p||typeof p.city!=='string'||!p.city.trim()||p.city.length>100||typeof p.mayor!=='string'||p.mayor.length>100||typeof p.caption!=='string'||p.caption.length>500||typeof p.png!=='string'||p.png.length>24*1024*1024)invalid();
  for(const [key,min,max] of [['month',0,120000],['startYear',0,10000],['population',0,1000000000],['created',0,8640000000000000],['width',1,1600],['height',1,16000]])if(!Number.isInteger(p[key])||p[key]<min||p[key]>max)invalid();
  if(!Number.isFinite(p.funds)||Math.abs(p.funds)>1e15||p.width*p.height>16000000)invalid();
  let bytes;try{bytes=Uint8Array.from(atob(p.png),c=>c.charCodeAt(0));}catch{invalid();}
  if(bytes.length<33||![137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v)||String.fromCharCode(...bytes.slice(12,16))!=='IHDR')invalid();
  const view=new DataView(bytes.buffer);if(view.getUint32(16)!==p.width||view.getUint32(20)!==p.height)invalid();
  return{city:p.city,mayor:p.mayor,caption:p.caption,month:p.month,startYear:p.startYear,population:p.population,funds:p.funds,created:p.created,width:p.width,height:p.height,blob:new Blob([bytes],{type:'image/png'})};
 });
}
export async function verifyAlbumImages(photos){for(const p of photos){let bitmap;try{bitmap=await createImageBitmap(p.blob);if(bitmap.width!==p.width||bitmap.height!==p.height)invalid();}catch{throw Error('The album contains a damaged PNG image. No photos were imported.');}finally{bitmap?.close();}}}
