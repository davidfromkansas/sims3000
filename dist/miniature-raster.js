export function projectMiniature([x,y,z],rotation=0){[x,y]=rotation===0?[x,y]:rotation===1?[-y,x]:rotation===2?[-x,-y]:[y,-x];return[256+(x-y)*230,320+(x+y)*115-z*230];}
// Rasterize once per cached view. Per-pixel depth resolves intersecting wings,
// rooftop details and fences that a single painter-order key cannot order.
export function rasterizeMiniature(geometry,rotation=0,includeDepth=false,{width=512,height=512,project=projectMiniature}={}){
 const data=new Uint8ClampedArray(width*height*4),depth=new Float32Array(width*height);depth.fill(-Infinity);
 const turn=([x,y,z])=>rotation===0?[x,y,z]:rotation===1?[-y,x,z]:rotation===2?[-x,-y,z]:[y,-x,z];
 for(const face of geometry){
  const pts=face.points.map(p=>{const [x,y,z]=turn(p);return [...project(p,rotation),x+y+z];}),color=face.color.slice(1).match(/../g).map(v=>parseInt(v,16));
  for(let i=1;i<pts.length-1;i++){
   const [a,b,c]=[pts[0],pts[i],pts[i+1]],area=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(area<=1e-10)continue;
   const minX=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))),maxX=Math.min(width-1,Math.ceil(Math.max(a[0],b[0],c[0]))),minY=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))),maxY=Math.min(height-1,Math.ceil(Math.max(a[1],b[1],c[1])));
   for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
    const u=((b[1]-c[1])*(x+.5-c[0])+(c[0]-b[0])*(y+.5-c[1]))/area,v=((c[1]-a[1])*(x+.5-c[0])+(a[0]-c[0])*(y+.5-c[1]))/area,w=1-u-v;if(u<0||v<0||w<0)continue;
    const z=u*a[2]+v*b[2]+w*c[2],index=y*width+x;if(z<depth[index]-1e-7)continue;depth[index]=z;if(!face.depthOnly)data.set([...color,255],index*4);
   }
  }
 }
 return{width,height,data,...(includeDepth?{depth}:{})};
}
