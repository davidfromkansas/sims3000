import {BUILDING_EDIT_PLANES,voxelPlanePoint} from './building-edit-planes.js?v=growing-upward-1';
import {buildingShapeCells} from './building-shapes.js?v=growing-upward-1';
import {projectBuildingPoint} from './building-footprints.js?v=growing-upward-1';
const colors={horizontal:['#49a77e','rgba(73,167,126,.12)'],xz:['#c35c59','rgba(195,92,89,.12)'],yz:['#4c8bc8','rgba(76,139,200,.12)']};
export function buildingPlaneGuide(selection){
 if(!selection)return[];const {plane,slice,pending}=selection,p=BUILDING_EDIT_PLANES[plane];if(!p||!Number.isInteger(slice)||slice<0||slice>=p.slices)return[];
 const low=-.425,high=.425,center=(slice-4.5)*.085,z=.12+(slice+.5)*.14;
 const points=plane==='horizontal'?[[low,low,z],[high,low,z],[high,high,z],[low,high,z]]:plane==='xz'?[[low,center,0],[high,center,0],[high,center,3.48],[low,center,3.48]]:[[center,low,0],[center,high,0],[center,high,3.48],[center,low,3.48]];
 const faces=[{points,stroke:colors[plane][0],fill:colors[plane][1]}];
 if(pending)for(const i of (pending.cells||buildingShapeCells(pending.kind,pending.start,pending.end,p.rows))){const point=voxelPlanePoint(plane,slice,i),x=(point.x-5)*.085,y=(point.y-5)*.085,bottom=point.z===0?0:.12+point.z*.14,top=.12+(point.z+1)*.14;
  const cell=plane==='horizontal'?[[x,y,z],[x+.085,y,z],[x+.085,y+.085,z],[x,y+.085,z]]:plane==='xz'?[[x,center,bottom],[x+.085,center,bottom],[x+.085,center,top],[x,center,top]]:[[center,y,bottom],[center,y+.085,bottom],[center,y+.085,top],[center,y,top]];
  faces.push({points:cell,stroke:'#d79b00',fill:'rgba(255,203,64,.38)'});
 }return faces;
}
export function drawBuildingPlaneGuide(ctx,design,selection,rotation=0){
 ctx.save();ctx.lineWidth=1;for(const face of buildingPlaneGuide(selection)){ctx.beginPath();face.points.map(p=>projectBuildingPoint(p,rotation,design.footprint)).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=face.fill;ctx.fill();ctx.strokeStyle=face.stroke;ctx.stroke();}ctx.restore();
}
