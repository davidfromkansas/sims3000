import {clipPropGeometry} from './building-prop-clipping.js?v=architecture-collection-36';
import {projectedBuildingSurfaces} from './building-surface-picking.js?v=architecture-collection-36';
import {rasterizeMiniature} from './miniature-raster.js?v=architecture-collection-36';
import {BUILDING_PROPS,propModelGeometry,shadePropFaces} from './building-prop-models.js?v=architecture-collection-36';
export {BUILDING_PROPS,PROP_CATEGORIES} from './building-prop-models.js?v=architecture-collection-36';
export function validateBuildingProps(value){
 if(!Array.isArray(value)||value.length>64)throw Error('A custom building supports up to 64 props.');
 return Array.from(value,p=>{if(!p||!Object.hasOwn(BUILDING_PROPS,p.kind)||!Number.isInteger(p.x)||p.x<0||p.x>9||!Number.isInteger(p.y)||p.y<0||p.y>9||!Number.isFinite(p.z)||p.z<0||p.z>3.480001||!Number.isInteger(p.rotation)||p.rotation<0||p.rotation>3)throw Error('Choose a valid prop, block position, height and rotation.');return{kind:p.kind,x:p.x,y:p.y,z:p.z,rotation:p.rotation};});
}
export function addBuildingProp(design,kind,face,rotation=0){
 if(!design.blocks&&!design.voxels)throw Error('Choose a block layout before placing props.');
 if(!face||face.side!==4||!Number.isInteger(face.x)||!Number.isInteger(face.y)||!Array.isArray(face.points)||!face.points.length)throw Error('Place a prop on the ground or a roof.');
 const z=face.points.reduce((sum,p)=>sum+p[2],0)/face.points.length;
 return validateBuildingProps([...(design.props||[]),{kind,x:face.x,y:face.y,z,rotation}]);
}
export function removeBuildingProp(design,index){if(!Number.isInteger(index)||index<0||index>=(design.props?.length||0))throw Error('Choose an existing prop.');return validateBuildingProps(design.props.filter((_,i)=>i!==index));}
// Props use physical dimensions, independent of the custom lot's width/depth.
export function buildingPropGeometry(prop,footprint={width:1,height:1}){
 const faces=[],center=[(prop.x-4.5)*.085*footprint.width,(prop.y-4.5)*.085*footprint.height,prop.z];
 const point=([x,y,z])=>{[x,y]=prop.rotation===0?[x,y]:prop.rotation===1?[-y,x]:prop.rotation===2?[-x,-y]:[y,-x];return[center[0]+x,center[1]+y,center[2]+z];};
 faces.push(...propModelGeometry(prop.kind).map(f=>({...f,points:f.points.map(point)})));
 // Clip horizontal overhangs at the model-space boundary, as the manual describes.
 for(const [axis,bound,sign] of [[0,-.5*footprint.width,1],[0,.5*footprint.width,-1],[1,-.5*footprint.height,1],[1,.5*footprint.height,-1]])for(const face of faces){const out=[];for(let i=0;i<face.points.length;i++){const a=face.points[i],b=face.points[(i+1)%face.points.length],insideA=sign*(a[axis]-bound)>=0,insideB=sign*(b[axis]-bound)>=0;if(insideA)out.push(a);if(insideA!==insideB){const t=(bound-a[axis])/(b[axis]-a[axis]);out.push(a.map((v,k)=>v+t*(b[k]-v)));}}face.points=out;}
 return shadePropFaces(faces.filter(f=>f.points.length>=3));
}
// A fitted palette view uses the same geometry, physical rotation and world lighting.
export function rasterizePropPreview(kind,direction=0,view=0){
 const geometry=buildingPropGeometry({kind,x:4,y:4,z:0,rotation:direction}),project=([x,y,z])=>{[x,y]=view===0?[x,y]:view===1?[-y,x]:view===2?[-x,-y]:[y,-x];return[x-y,(x+y)/2-z];};
 const points=geometry.flatMap(f=>f.points).map(project),minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1])),scale=Math.min(136/(maxX-minX),136/(maxY-minY));
 return rasterizeMiniature(geometry,view,false,{width:160,height:160,project:p=>{const [x,y]=project(p);return[80+(x-(minX+maxX)/2)*scale,80+(y-(minY+maxY)/2)*scale];}});
}
export function rasterizeBuildingProps(design,rotation=0,highlightIndices=null){
 const selected=highlightIndices===null?null:new Set(highlightIndices);
 const footprint=design.footprint||{width:1,height:1},size=Math.max(footprint.width,footprint.height),world=([x,y,z])=>[x*footprint.width,y*footprint.height,z];
 const occluders=projectedBuildingSurfaces(design,rotation).map(f=>({points:f.points.map(world),color:'#000000',depthOnly:true}));
 const props=clipPropGeometry(design,(design.props||[]).flatMap((p,index)=>buildingPropGeometry(p,footprint).map(face=>{if(selected===null)return face;if(!selected.has(index))return{...face,color:'#000000'};const rgb=face.color.slice(1).match(/../g).map(ch=>parseInt(ch,16)),light=rgb[0]*.21+rgb[1]*.72+rgb[2]*.07,color='#'+[light*.35,light*.65+25,Math.min(255,light+65)].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');return{...face,color};})));
 const project=([x,y,z],r)=>{[x,y]=r===0?[x,y]:r===1?[-y,x]:r===2?[-x,-y]:[y,-x];return[128+(x-y)*64/size,346+(x+y)*32/size-z*64/size];};
 // Supersample only the prop bounds: fine poles and rails must survive on wide lots.
 const data=new Uint8ClampedArray(256*384*4),points=props.flatMap(f=>f.points).map(p=>project(p,rotation));
 if(!points.length)return{width:256,height:384,data};
 const left=Math.max(0,Math.floor(Math.min(...points.map(p=>p[0])))-1),top=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1])))-1),right=Math.min(256,Math.ceil(Math.max(...points.map(p=>p[0])))+1),bottom=Math.min(384,Math.ceil(Math.max(...points.map(p=>p[1])))+1),width=right-left,height=bottom-top,scale=4;
 if(width<=0||height<=0)return{width:256,height:384,data};
 const raster=rasterizeMiniature([...occluders,...props],rotation,false,{width:width*scale,height:height*scale,project:(p,r)=>{const [x,y]=project(p,r);return[(x-left)*scale,(y-top)*scale];}});
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  let count=0;const rgb=[0,0,0];
  for(let dy=0;dy<scale;dy++)for(let dx=0;dx<scale;dx++){const i=((y*scale+dy)*width*scale+x*scale+dx)*4;if(!raster.data[i+3]||(selected!==null&&raster.data[i]===0&&raster.data[i+1]===0&&raster.data[i+2]===0))continue;count++;for(let ch=0;ch<3;ch++)rgb[ch]+=raster.data[i+ch];}
  if(count){const i=((top+y)*256+left+x)*4;for(let ch=0;ch<3;ch++)data[i+ch]=Math.round(rgb[ch]/count);data[i+3]=Math.round(255*count/(scale*scale));}
 }
 return{width:256,height:384,data};
}
// Each destination retains at most four views of its current prop/construction state.
// Content keys also detect in-place edits from callers and imported model replacement.
const propFrames=new WeakMap(),highlightFrames=new WeakMap();
export function drawBuildingProps(ctx,design,rotation,highlightIndices=null){
 if(!design.props?.length)return;
 const frames=highlightIndices===null?propFrames:highlightFrames,highlightKey=highlightIndices===null?null:[...new Set(highlightIndices)].sort((a,b)=>a-b);
 const footprint=design.footprint||{width:1,height:1},key=JSON.stringify([highlightKey,design.blocks,design.voxels,design.blockGeometry,footprint.width,footprint.height,design.props]);
 let entry=frames.get(ctx);
 if(!entry||entry.key!==key){entry={key,views:new Map()};frames.set(ctx,entry);}
 let canvas=entry.views.get(rotation);
 if(!canvas){
  const raster=rasterizeBuildingProps(design,rotation,highlightKey);canvas=document.createElement('canvas');canvas.width=256;canvas.height=384;
  const out=canvas.getContext('2d'),pixels=out.createImageData(256,384);pixels.data.set(raster.data);out.putImageData(pixels,0,0);
  if(entry.views.size===4)entry.views.clear();entry.views.set(rotation,canvas);
 }
 ctx.drawImage(canvas,0,0);
}

export function encodeBuildingProps(props){return validateBuildingProps(props).map(p=>[p.kind,p.x,p.y,p.z,p.rotation]);}
export function decodeBuildingProps(props){if(!Array.isArray(props)||props.length>64||!props.every(p=>Array.isArray(p)&&p.length===5))throw Error('Invalid portable prop list.');return validateBuildingProps(props.map(([kind,x,y,z,rotation])=>({kind,x,y,z,rotation})));}
