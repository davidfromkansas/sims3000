// Original simplified present-day limestone courses; no surviving casing cap is invented.
export function greatPyramidGeometry({box,add}){
 const base=2.64,height=1.68,levels=48;
 box(0,0,.12,2.8,2.8,.11,'#bfa47a');
 for(let row=0;row<levels;row++){
  const width=base*(1-row/levels),z=.23+height*row/levels,h=height/levels;
  box(0,0,z,width,width,h,['#bda174','#c3a77b','#c8ad81','#b99e74'][row%4]);
  // Subtle block-to-block variation remains attached to each world-facing side.
  for(let side=0;side<4;side++){
   const point=(u,v)=>side===0?[u,-width/2-.001,v]:side===1?[width/2+.001,u,v]:side===2?[-u,width/2+.001,v]:[-width/2-.001,-u,v];
   const count=Math.max(1,Math.round(width/.16));
   for(let col=0;col<count;col++)if((row*7+col*3+side)%5===0){const a=-width/2+width*col/count+.003,b=-width/2+width*(col+1)/count-.003;add([point(a,z+.002),point(b,z+.002),point(b,z+h-.002),point(a,z+h-.002)],['#af946b','#b69a6f','#c8ac7f','#bca174'][side]);}
  }
 }
}
