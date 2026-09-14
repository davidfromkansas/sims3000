import {buildingPropGeometry} from './building-props.js?v=architecture-collection-43';
import {clipPropGeometry} from './building-prop-clipping.js?v=architecture-collection-43';
import {projectedBuildingSurfaces} from './building-surface-picking.js?v=architecture-collection-43';
export function buildingPropPickFaces(design,rotation=0){
 const footprint=design.footprint||{width:1,height:1},size=Math.max(footprint.width,footprint.height);
 const buildings=projectedBuildingSurfaces(design,rotation).map(f=>({...f,owner:null,points:f.points.map(([x,y,z])=>[x*footprint.width,y*footprint.height,z])}));
 const props=clipPropGeometry(design,(design.props||[]).flatMap((p,owner)=>buildingPropGeometry(p,footprint).map(f=>({...f,owner}))));
 return [...buildings,...props].map(face=>({...face,points:face.points.map(([x,y,z])=>{[x,y]=rotation===0?[x,y]:rotation===1?[-y,x]:rotation===2?[-x,-y]:[y,-x];return[128+(x-y)*64/size,346+(x+y)*32/size-z*64/size,x+y+z];})}));
}
export function pickBuildingProp(faces,point,camera={zoom:1,x:0,y:0}){
 if(!Number.isFinite(point?.x)||!Number.isFinite(point?.y)||!Number.isFinite(camera.zoom)||camera.zoom<=0||![camera.x,camera.y].every(Number.isFinite))return null;
 const x=(point.x-camera.x)/camera.zoom,y=(point.y-camera.y)/camera.zoom;let depth=-Infinity,owner=null;
 for(const face of faces)for(let i=1;i<face.points.length-1;i++){
  const [a,b,c]=[face.points[0],face.points[i],face.points[i+1]],area=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(area<=1e-10)continue;
  const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/area,v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/area,w=1-u-v;if(u<0||v<0||w<0)continue;
  const z=u*a[2]+v*b[2]+w*c[2];if(z<depth-1e-7)continue;depth=z;owner=face.owner;
 }
 return owner;
}
