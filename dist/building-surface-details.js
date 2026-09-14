import {floorPaintKey} from './building-floor-paint.js?v=performing-arts-center-1';
export const BUILDING_DETAILS=['Remove detail','Framed window','Entrance door','Vent grille','Window with ledge'];
export function validateSurfaceDetails(value){if(typeof value!=='string'||value.length!==12000||/[^0-4]/.test(value))throw Error('Building details need 12,000 valid surface entries.');for(let i=4;i<value.length;i+=5)if(!['0','3'].includes(value[i]))throw Error('Only vent grilles can be placed on roofs.');return value;}
export function detailFitsSurface(detail,face){return face.side!==4||detail===0||detail===3;}
export function placeSurfaceDetails(design,faces,detail){if(!Number.isInteger(detail)||detail<0||detail>=BUILDING_DETAILS.length)throw Error('Choose a building detail.');const next=(design.surfaceDetails?validateSurfaceDetails(design.surfaceDetails):'0'.repeat(12000)).split('');for(const face of faces)if(detailFitsSurface(detail,face))next[floorPaintKey(face)]=String(detail);return next.join('');}
export function buildingSurfaceDetail(design,face){return Number(design.surfaceDetails?.[floorPaintKey(face)]||0);}
// Original procedural decals, contained within a surface tile. They render after
// paint and remain independently removable, without changing the material below.
export function drawBuildingSurfaceDetail(face,detail,design,polygon){
 if(!detail)return;const a=face.points[0],b=face.points[1],c=face.points[3],point=(u,v)=>a.map((n,i)=>n+(b[i]-n)*u+(c[i]-n)*v),rect=(u,v,w,h,color)=>polygon([point(u,v),point(u+w,v),point(u+w,v+h),point(u,v+h)],color);
 if(detail===1||detail===4){rect(.12,.14,.76,.72,'#e1dacf');rect(.2,.22,.6,.56,design.windows);rect(.48,.22,.045,.56,'#e1dacf');rect(.2,.47,.6,.045,'#e1dacf');if(detail===4){rect(.05,.09,.9,.08,'#e6ded0');rect(.09,.04,.82,.05,'#68716d');}}
 if(detail===2){rect(.14,0,.72,.92,'#d5c8b4');rect(.22,0,.56,.84,'#624d41');rect(.29,.4,.42,.32,design.windows);rect(.65,.27,.06,.05,'#e7bb62');}
 if(detail===3){rect(.12,.13,.76,.74,'#535f62');rect(.18,.19,.64,.62,'#aeb9b7');for(let i=0;i<5;i++)rect(.22,.23+i*.11,.56,.045,'#465457');}
}
