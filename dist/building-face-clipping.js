// Stamp wall textures/details in a rectangular coordinate frame, then trim
// their polygons to the actual wedge face. Roofs already use an affine frame.
export function wallDecorationFrame(face){if(!face.shape||face.side===4)return face;const top=.12+face.to*.14;return{...face,points:face.points.map((p,i)=>[p[0],p[1],i<2?p[2]:top])};}
export function clipWallDecoration(face,points){
 if(!face.shape||face.side===4)return points;
 const a=face.points[0],b=face.points[1],dx=b[0]-a[0],dy=b[1]-a[1],length2=dx*dx+dy*dy,u=p=>((p[0]-a[0])*dx+(p[1]-a[1])*dy)/length2;
 if(length2<1e-16)return[];
 const topA=face.points[3][2],topB=face.points[2][2],planes=[p=>u(p),p=>1-u(p),p=>p[2]-a[2],p=>topA+(topB-topA)*u(p)-p[2]];
 let result=points;
 for(const distance of planes){const input=result;result=[];if(!input.length)break;for(let i=0;i<input.length;i++){const p=input[i],q=input[(i+1)%input.length],dp=distance(p),dq=distance(q),insideP=dp>=-1e-10,insideQ=dq>=-1e-10;if(insideP)result.push(p);if(insideP!==insideQ){const t=dp/(dp-dq);result.push(p.map((v,k)=>v+(q[k]-v)*t));}}}
 return result.length>=3?result:[];
}
