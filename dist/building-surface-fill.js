import {floorPaintKey,floorSurfaceMaterial,surfaceLevel} from './building-floor-paint.js?v=city-hall-1';
// Face adjacency is measured in model coordinates, independent of projection.
// Walls traverse horizontally and vertically on one plane; roofs traverse x/y
// at one height. A gap, corner, step or different material stops the fill.
export function connectedBuildingSurfaces(design,surfaces,start){
 if(!start)return [];
 const level=surfaceLevel(start),side=start.side,material=floorSurfaceMaterial(design,start),position=f=>side===4?[f.x,f.y]:[side%2?f.y:f.x,surfaceLevel(f)],onPlane=f=>f.side===side&&(side===4?surfaceLevel(f)===level:side%2?f.x===start.x:f.y===start.y),eligible=new Map();
 for(const f of surfaces)if(onPlane(f)&&floorSurfaceMaterial(design,f)===material)eligible.set(position(f).join(','),f);
 const seed=position(start).join(',');if(!eligible.has(seed)||floorPaintKey(eligible.get(seed))!==floorPaintKey(start))return [];
 const queue=[seed],result=[];for(let i=0;i<queue.length;i++){const k=queue[i],face=eligible.get(k);if(!face)continue;eligible.delete(k);result.push(face);const [u,v]=position(face);for(const [du,dv]of [[1,0],[-1,0],[0,1],[0,-1]]){const neighbor=`${u+du},${v+dv}`;if(eligible.has(neighbor))queue.push(neighbor);}}
 return result;
}
