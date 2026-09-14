// Subtract occupied convex building blocks from prop surfaces in model space.
// This is distinct from camera occlusion: an intersecting part stays cropped in every view.
const EPS=1e-9;
const bounds=points=>[0,1,2].map(axis=>[Math.min(...points.map(p=>p[axis])),Math.max(...points.map(p=>p[axis]))]);
const overlap=(a,b)=>a.every(([min,max],i)=>max>b[i][0]+EPS&&min<b[i][1]-EPS);
function split(points,plane){
 const inside=[],outside=[],distance=p=>plane[0]*p[0]+plane[1]*p[1]+plane[2]*p[2]-plane[3];
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length],da=distance(a),db=distance(b),ia=da<-EPS,ib=db<-EPS;
  (ia?inside:outside).push(a);
  if(ia!==ib){const t=da/(da-db),p=a.map((v,k)=>v+t*(b[k]-v));inside.push(p);outside.push(p);}
 }
 return{inside,outside};
}
function subtract(points,planes){const result=[];let remaining=points;for(const plane of planes){const parts=split(remaining,plane);if(parts.outside.length>=3)result.push(parts.outside);remaining=parts.inside;if(remaining.length<3)break;}return result;}
export function clipPropGeometry(design,geometry){
 if(!geometry.length||(!design.blocks&&!design.voxels))return geometry;
 const footprint=design.footprint||{width:1,height:1},w=.085*footprint.width,d=.085*footprint.height,area=bounds(geometry.flatMap(f=>f.points)),solids=[];
 for(let index=0;index<100;index++){
  const x=(index%10-5)*w,y=(Math.floor(index/10)-5)*d;
  if(area[0][1]<=x+EPS||area[0][0]>=x+w-EPS||area[1][1]<=y+EPS||area[1][0]>=y+d-EPS)continue;
  const count=design.voxels?24:1;
  for(let level=0;level<count;level++){
   if(design.voxels?!(design.voxels[index]&(1<<level)):!design.blocks[index])continue;
   const bottom=design.voxels&&level>0?.12+level*.14:0,top=.12+(design.voxels?level+1:design.blocks[index])*.14,box=[[x,x+w],[y,y+d],[bottom,top]];
   if(!overlap(area,box))continue;
   const shape=design.voxels?Number(design.blockGeometry?.[level*100+index]||0):0,h=top-bottom;
   const roof=shape===1?[0,h/d,1,top+h*y/d]:shape===2?[-h/w,0,1,bottom-h*x/w]:shape===3?[0,-h/d,1,bottom-h*y/d]:shape===4?[h/w,0,1,top+h*x/w]:[0,0,1,top];
   solids.push({box,planes:[[-1,0,0,-x],[1,0,0,x+w],[0,-1,0,-y],[0,1,0,y+d],[0,0,-1,-bottom],roof]});
  }
 }
 return geometry.flatMap(face=>{
  let pieces=[face.points];const faceBounds=bounds(face.points);
  for(const solid of solids){if(!overlap(faceBounds,solid.box))continue;pieces=pieces.flatMap(points=>subtract(points,solid.planes));if(!pieces.length)break;}
  return pieces.map(points=>({...face,points}));
 });
}
