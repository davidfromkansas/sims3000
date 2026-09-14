import {roofDetailPolygonsOnFace} from './building-roof-details.js?v=live-scenario-comparisons-2';
import {clipPolygon} from './building-decal-clipping.js?v=live-scenario-comparisons-2';
import {projectBuildingPoint} from './building-footprints.js?v=live-scenario-comparisons-2';
import {drawBuildingSurfaceDetail} from './building-surface-details.js?v=live-scenario-comparisons-2';
export const MAX_BUILDING_DECALS=32;
export const DECAL_NAMES=['','Framed window','Entrance door','Vent grille','Window with ledge','Cornice'];
const bounded=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max&&Math.abs(v*1000-Math.round(v*1000))<1e-7;
export function validateBuildingDecals(value){if(!Array.isArray(value)||value.length>MAX_BUILDING_DECALS)throw Error('A building supports up to 32 anchored details.');return Array.from(value,d=>{if(!d||!Number.isInteger(d.kind)||d.kind<1||d.kind>=DECAL_NAMES.length||!Number.isInteger(d.side)||d.side<0||d.side>3||!Number.isInteger(d.plane)||d.plane<0||d.plane>10||!bounded(d.u,0,10)||!bounded(d.z,0,3.48)||!bounded(d.width,.25,10)||!bounded(d.height,.02,3.48))throw Error('Choose a wall detail with a valid anchor and size.');return Object.fromEntries(['kind','side','plane','u','z','width','height'].map(k=>[k,d[k]]));});}
export const encodeBuildingDecals=value=>validateBuildingDecals(value).map(d=>[d.kind,d.side,d.plane,...['u','z','width','height'].map(k=>Math.round(d[k]*1000))]);
export function decodeBuildingDecals(value){if(!Array.isArray(value)||value.length>MAX_BUILDING_DECALS)throw Error('Invalid anchored detail list.');return validateBuildingDecals(value.map(row=>{if(!Array.isArray(row)||row.length!==7||!row.every(Number.isInteger))throw Error('Invalid anchored detail record.');return{kind:row[0],side:row[1],plane:row[2],u:row[3]/1000,z:row[4]/1000,width:row[5]/1000,height:row[6]/1000};}));}
export function wallCoordinates(side,[x,y,z]){return[(side===0?-x:side===1?-y:side===2?x:y)/.085+5,z];}
export function wallWorldPoint(side,plane,[u,z]){const along=(u-5)*.085,fixed=(plane-5)*.085;return side===0?[-along,fixed,z]:side===1?[fixed,-along,z]:side===2?[along,fixed,z]:[fixed,along,z];}
export function wallPlane(face){if(face.side===4)return null;return Math.round((face.points[0][face.side%2===0?1:0])/.085+5);}
// Invert the wall's affine projection so the cursor can anchor between grid lines.
export function projectedWallAnchor(face,point,design){
 if(face.side===4)throw Error('Choose a wall for an anchored detail.');
 const plane=wallPlane(face),project=p=>projectBuildingPoint(wallWorldPoint(face.side,plane,p),design.rotation,design.footprint),o=project([0,0]),a=project([1,0]),b=project([0,1]);
 const ax=a[0]-o[0],ay=a[1]-o[1],bx=b[0]-o[0],by=b[1]-o[1],det=ax*by-ay*bx,px=point.x-o[0],py=point.y-o[1];
 if(!Number.isFinite(det)||Math.abs(det)<1e-10)throw Error('Choose a visible wall for an anchored detail.');
 return {u:Math.round((px*by-py*bx)/det*1000)/1000,z:Math.round((ax*py-ay*px)/det*1000)/1000};
}
export function anchoredDecal(face,kind,width=2,height=.28){if(face.side===4)throw Error('Choose a wall for an anchored detail.');const points=face.points.map(p=>wallCoordinates(face.side,p));return validateBuildingDecals([{kind,side:face.side,plane:wallPlane(face),u:Math.round(Math.min(...points.map(p=>p[0]))*1000)/1000,z:Math.round(Math.min(...points.map(p=>p[1]))*1000)/1000,width,height}])[0];}
export function decalPolygonsOnFace(face,decals,design){if(face.side===4)return[];const plane=wallPlane(face),boundary=face.points.map(p=>wallCoordinates(face.side,p)),result=[];
 for(const [owner,d] of (decals||[]).entries()){
  if(d.side!==face.side||d.plane!==plane)continue;
  const points=[[d.u,d.z,0],[d.u+d.width,d.z,0],[d.u+d.width,d.z+d.height,0],[d.u,d.z+d.height,0]],clip=(points,color)=>{const clipped=clipPolygon(points.map(p=>[p[0],p[1]]),boundary);if(clipped.length>=3)result.push({owner,color,points:clipped.map(p=>wallWorldPoint(d.side,d.plane,p))});};
  if(d.kind===5){for(const [bottom,top,color] of [[0,.25,'#68716d'],[.25,.8,design.accent],[.8,1,'#e6ded0']])clip([[d.u,d.z+bottom*d.height],[d.u+d.width,d.z+bottom*d.height],[d.u+d.width,d.z+top*d.height],[d.u,d.z+top*d.height]],color);}
  else drawBuildingSurfaceDetail({points,side:d.side,from:0,to:1},d.kind,design,clip);
 }return result;
}
export function drawBuildingDecals(face,design,polygon){for(const p of (face.side===4?roofDetailPolygonsOnFace(face,design.roofDetails,design):decalPolygonsOnFace(face,design.decals,design)))polygon(p.points,p.color);}
