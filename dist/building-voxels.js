import {projectBuildingPoint} from './building-footprints.js?v=building-3d-layers-2';
import {buildingShapeCells} from './building-shapes.js?v=building-3d-layers-2';
import {materialSurfaceColor,drawMaterialDetail} from './building-materials.js?v=building-3d-layers-2';
// Each footprint column holds 24 occupancy bits. Gaps and overhangs are explicit;
// the compact representation stays bounded independently of exposed face count.
export const VOXEL_MAX_MASK=0xffffff;
export function validateBuildingVoxels(value){
 if(!Array.isArray(value)||value.length!==100||!Array.from(value).every(v=>Number.isInteger(v)&&v>=0&&v<=VOXEL_MAX_MASK)||!value.some(Boolean))throw Error('A layered building needs 100 occupancy masks and at least one block.');
 return [...value];
}
export function blocksToVoxels(blocks){
 if(!Array.isArray(blocks)||blocks.length!==100||!Array.from(blocks).every(h=>Number.isInteger(h)&&h>=0&&h<=24))throw Error('Choose a valid height layout.');
 return blocks.map(h=>2**h-1);
}
export function voxelOccupied(voxels,index,level){return index>=0&&index<100&&level>=0&&level<24&&!!(voxels[index]&(1<<level));}
export function voxelLayer(voxels,level){if(!Number.isInteger(level)||level<0||level>=24)throw Error('Choose a layer from 1 to 24.');return Array.from({length:100},(_,i)=>voxelOccupied(voxels,i,level));}
export function paintVoxelShape(voxels,level,kind,start,end,occupied=true){
 if(!Array.isArray(voxels)||voxels.length!==100||!Number.isInteger(level)||level<0||level>=24||typeof occupied!=='boolean')throw Error('Choose a valid layer and construction action.');
 const next=[...voxels],bit=1<<level;for(const i of buildingShapeCells(kind,start,end))next[i]=occupied?next[i]|bit:next[i]&~bit;return next;
}
export function voxelStatistics(voxels){let count=0,height=0,columns=0;for(const mask of voxels){if(mask)columns++;for(let z=0;z<24;z++)if(mask&(1<<z)){count++;height=Math.max(height,z+1);}}return{count,height,columns};}
export function buildingVoxelFaces(voxels,rotation=0,footprint={width:1,height:1}){
 const rot=((rotation%4)+4)%4,turn=(x,y)=>rot===0?[x,y]:rot===1?[-y,x]:rot===2?[-x,-y]:[y,-x],visible=[[1,2],[0,1],[0,3],[2,3]][rot],directions=[[0,-1],[1,0],[0,1],[-1,0]],faces=[];
 const order=Array.from({length:100},(_,i)=>i).filter(i=>voxels[i]).sort((a,b)=>{const p=turn(a%10*footprint.width,Math.floor(a/10)*footprint.height),q=turn(b%10*footprint.width,Math.floor(b/10)*footprint.height);return p[0]+p[1]-q[0]-q[1]||p[0]-q[0];});
 for(const i of order){const x=i%10,y=Math.floor(i/10),x0=(x-5)*.085,y0=(y-5)*.085,corners=[[x0,y0],[x0+.085,y0],[x0+.085,y0+.085],[x0,y0+.085]];
  for(let level=0;level<24;level++){if(!voxelOccupied(voxels,i,level))continue;const bottom=level===0?0:.12+level*.14,top=.12+(level+1)*.14;
   for(const side of visible){const [dx,dy]=directions[side],nx=x+dx,ny=y+dy;if(nx>=0&&nx<10&&ny>=0&&ny<10&&voxelOccupied(voxels,ny*10+nx,level))continue;const a=corners[side],b=corners[(side+1)%4];faces.push({x,y,side,from:level,to:level+1,points:[[...a,bottom],[...b,bottom],[...b,top],[...a,top]]});}
   if(!voxelOccupied(voxels,i,level+1))faces.push({x,y,side:4,from:level+1,to:level+1,points:corners.map(p=>[...p,top])});
  }
 }return faces;
}
export function drawBuildingVoxels(ctx,design,rotation=0){
 const project=p=>projectBuildingPoint(p,rotation,design.footprint),tint=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join(''),polygon=(points,color)=>{ctx.beginPath();points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill();};
 for(const face of buildingVoxelFaces(design.voxels,rotation,design.footprint)){const material=design.materials?.[(face.y*10+face.x)*5+face.side]||0;polygon(face.points,tint(materialSurfaceColor(material,design),face.side===4?1.08:face.side%2?.72:.9));drawMaterialDetail(face,material,design,polygon);if(face.side===4||material===3||material===4)continue;const a=face.points[0],b=face.points[1],point=(f,z)=>[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,z],low=.12+(face.from+.23)*.14,high=.12+(face.from+.7)*.14;polygon([point(.23,low),point(.77,low),point(.77,high),point(.23,high)],(face.from*7+face.x*3+face.y+face.side)%9===0?design.accent:design.windows);}
}
