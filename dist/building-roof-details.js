import {clipPolygon} from './building-decal-clipping.js?v=scripted-ending-ranks-1';
import {drawBuildingSurfaceDetail} from './building-surface-details.js?v=scripted-ending-ranks-1';
import {projectBuildingPoint} from './building-footprints.js?v=scripted-ending-ranks-1';

// Roof coordinates use construction-grid units. A plane [a,b,c] describes
// world height z=a*u+b*v+c, allowing one detail to cross coplanar roof tiles.
const round=value=>Math.round(value*1000)/1000;
const precise=(n,min,max)=>Number.isFinite(n)&&n>=min&&n<=max&&Math.abs(n*1000-Math.round(n*1000))<1e-7;
export function roofCoordinates([x,y]){return [x/.085+5,y/.085+5];}
export function roofWorldPoint(plane,[u,v]){return [(u-5)*.085,(v-5)*.085,plane[0]*u+plane[1]*v+plane[2]];}
export function roofPlane(face){
 if(face.side!==4)return null;
 const p=face.points.map(point=>[...roofCoordinates(point),point[2]]),o=p[0];
 for(let i=1;i<p.length-1;i++){
  const a=p[i].map((n,k)=>n-o[k]),b=p[i+1].map((n,k)=>n-o[k]),det=a[0]*b[1]-a[1]*b[0];if(Math.abs(det)<1e-10)continue;
  const x=(a[2]*b[1]-a[1]*b[2])/det,y=(a[0]*b[2]-a[2]*b[0])/det,plane=[x,y,o[2]-x*o[0]-y*o[1]].map(round);
  if(p.every(([u,v,z])=>Math.abs(plane[0]*u+plane[1]*v+plane[2]-z)<1e-7))return plane;
 }
 return null;
}
export function validateRoofDetails(value){
 if(!Array.isArray(value)||value.length>32)throw Error('A building supports up to 32 roof details.');
 return Array.from(value,d=>{
  if(!d||![1,3].includes(d.kind)||!precise(d.u,0,10)||!precise(d.v,0,10)||!precise(d.width,.25,10)||!precise(d.depth,.25,10)||!Array.isArray(d.plane)||d.plane.length!==3||!Array.from(d.plane).every(n=>precise(n,-10,10)))throw Error('Choose a skylight or roof vent with a valid anchor, plane and size.');
  const z=d.plane[0]*d.u+d.plane[1]*d.v+d.plane[2];if(z<-.001||z>3.481)throw Error('Place the roof detail on the building.');
  return {kind:d.kind,u:d.u,v:d.v,width:d.width,depth:d.depth,plane:[...d.plane]};
 });
}
export function projectedRoofAnchor(face,point,design){
 const plane=roofPlane(face);if(!plane)throw Error('Choose a planar roof for this detail.');
 const project=p=>projectBuildingPoint(roofWorldPoint(plane,p),design.rotation,design.footprint),o=project([0,0]),a=project([1,0]),b=project([0,1]),ax=a[0]-o[0],ay=a[1]-o[1],bx=b[0]-o[0],by=b[1]-o[1],det=ax*by-ay*bx;
 if(Math.abs(det)<1e-10)throw Error('Rotate the building to see this roof.');
 const x=point.x-o[0],y=point.y-o[1];return {u:round((x*by-y*bx)/det),v:round((ax*y-ay*x)/det),plane};
}
export function anchoredRoofDetail(face,kind,width=2,depth=2,anchor){
 const plane=roofPlane(face);if(!plane)throw Error('Choose a planar roof for this detail.');
 const points=face.points.map(roofCoordinates);
 return validateRoofDetails([{kind,width,depth,plane,u:round(Math.min(...points.map(p=>p[0]))),v:round(Math.min(...points.map(p=>p[1]))),...anchor}])[0];
}
export function roofDetailPolygonsOnFace(face,details,design){
 const plane=roofPlane(face);if(!plane)return [];
 const boundary=face.points.map(roofCoordinates),result=[];
 for(const [owner,d] of (details||[]).entries()){
  if(!plane.every((n,i)=>Math.abs(n-d.plane[i])<1e-7))continue;
  // Adapt the existing original window/vent artwork to the roof plane.
  const points=[[d.u,d.v,0],[d.u+d.width,d.v,0],[d.u+d.width,d.v+d.depth,0],[d.u,d.v+d.depth,0]];
  drawBuildingSurfaceDetail({points,side:4},d.kind,design,(polygon,color)=>{
   const clipped=clipPolygon(polygon.map(p=>p.slice(0,2)),boundary);
   if(clipped.length>=3)result.push({owner,color,points:clipped.map(p=>roofWorldPoint(plane,p))});
  });
 }
 return result;
}

// Eight signed 16-bit values keep fully populated building files within 32 KB.
export const encodeRoofDetails=value=>validateRoofDetails(value).map(d=>{
 const buffer=new ArrayBuffer(16),view=new DataView(buffer),values=[d.kind,...[d.u,d.v,d.width,d.depth,...d.plane].map(n=>Math.round(n*1000))];
 values.forEach((n,i)=>view.setInt16(i*2,n));return btoa(String.fromCharCode(...new Uint8Array(buffer)));
});
export function decodeRoofDetails(value){
 if(!Array.isArray(value)||value.length>32)throw Error('Invalid roof detail list.');
 return validateRoofDetails(value.map(record=>{
  if(typeof record!=='string'||! /^[A-Za-z0-9+/]{22}==$/.test(record))throw Error('Invalid roof detail record.');
  const raw=atob(record);if(btoa(raw)!==record)throw Error('Invalid roof detail record.');const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0)),view=new DataView(bytes.buffer),row=Array.from({length:8},(_,i)=>view.getInt16(i*2));
  return {kind:row[0],u:row[1]/1000,v:row[2]/1000,width:row[3]/1000,depth:row[4]/1000,plane:row.slice(5).map(n=>n/1000)};
 }));
}
