import {projectBuildingPoint} from './building-footprints.js?v=architecture-collection-58';
// Shared tower solids keep rendering, lot coverage and ground picking aligned.
export function towerSolids(d){const w=d.width*.085,depth=d.depth*.085,h=d.floors*.14,solids=[{w:w+.08,depth:depth+.08,z:0,height:.12,color:d.accent}];
 if(d.roof==='step'){const lower=Math.ceil(d.floors*.65);solids.push({w,depth,z:.12,height:lower*.14,color:d.facade,windows:true,floors:lower},{w:w*.7,depth:depth*.7,z:.12+lower*.14,height:(d.floors-lower)*.14,color:d.facade,windows:true,floors:d.floors-lower});}
 else solids.push({w,depth,z:.12,height:h,color:d.facade,windows:true,floors:d.floors});
 solids.push({w:w*.3,depth:depth*.3,z:h+.12,height:.12,color:d.accent});return solids;
}
export function projectedTowerOcclusion(d,rotation=0){const rot=((rotation%4)+4)%4,faces=[];
 for(const {w,depth,z,height} of towerSolids(d)){if(height<=0)continue;const corners=[[-w/2,-depth/2],[w/2,-depth/2],[w/2,depth/2],[-w/2,depth/2]],visible=[[1,2],[0,1],[0,3],[2,3]][rot];for(const side of visible){const a=corners[side],b=corners[(side+1)%4];faces.push({points:[[...a,z],[...b,z],[...b,z+height],[...a,z+height]]});}faces.push({points:corners.map(p=>[...p,z+height])});}
 const projected=faces.map(face=>({...face,polygon:face.points.map(p=>projectBuildingPoint(p,rotation,d.footprint))}));
 if(d.roof==='spire'){const [x,y]=projectBuildingPoint([0,0,d.floors*.14+.25],rotation,d.footprint),[,top]=projectBuildingPoint([0,0,d.floors*.14+.8],rotation,d.footprint);projected.push({polygon:[[x-1.5,y],[x+1.5,y],[x+1.5,top],[x-1.5,top]]});}return projected;
}
