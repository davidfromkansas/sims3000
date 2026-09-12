// Original low-poly landmark geometry. Gallery illustrations are separate Imagegen art.
export const MODELED_LANDMARKS=new Set(['bigBen','statueLiberty']);
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
export function landmarkGeometry(type){
 const faces=[],add=(points,color)=>faces.push({points,color});
 function ring(x,y,z,r,h,top,color,n=8){const a=Array.from({length:n},(_,i)=>{const t=i/n*Math.PI*2;return[x+Math.cos(t)*r,y+Math.sin(t)*r,z];}),b=a.map(([xx,yy])=>[x+(xx-x)*top/r,y+(yy-y)*top/r,z+h]);for(let i=0;i<n;i++)add([a[i],a[(i+1)%n],b[(i+1)%n],b[i]],shade(color,.68+.28*(i/n)));add(b,shade(color,1.12));}
 function box(x,y,z,w,d,h,color){const p=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],q=p.map(([a,b])=>[a,b,z+h]);for(let i=0;i<4;i++)add([p[i],p[(i+1)%4],q[(i+1)%4],q[i]],shade(color,[.7,.82,.95,.78][i]));add(q,shade(color,1.1));}
 function beam(a,b,r,color){const v=b.map((n,i)=>n-a[i]),len=Math.hypot(...v),u=v.map(n=>n/len),ref=Math.abs(u[2])<.9?[0,0,1]:[1,0,0],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],v1=cross(u,ref),l=Math.hypot(...v1),p=v1.map(n=>n/l),q=cross(u,p),circle=c=>Array.from({length:8},(_,i)=>c.map((n,j)=>n+r*(p[j]*Math.cos(i*Math.PI/4)+q[j]*Math.sin(i*Math.PI/4)))),aa=circle(a),bb=circle(b);for(let i=0;i<8;i++)add([aa[i],aa[(i+1)%8],bb[(i+1)%8],bb[i]],shade(color,.72+i*.035));add(bb,color);}
 const stone='#c5ae87',copper='#73a799';box(0,0,0,2.8,2.8,.12,stone);box(0,0,.12,2.55,2.55,.025,'#65805c');box(0,0,.15,2.1,2.1,.08,'#d0c8b5');
 if(type==='bigBen'){
  box(0,0,.23,1.05,1.05,.18,stone);for(let floor=0;floor<8;floor++)box(0,0,.41+floor*.55,.82,.82,.55,stone);
  for(let floor=0;floor<8;floor++){const z=.54+floor*.55;for(let side=0;side<4;side++)for(let col=0;col<3;col++){const o=(col-1)*.23;if(side%2===0)box(o,side===0?-.414:.414,z,.1,.025,.29,'#34474b');else box(side===1?.414:-.414,o,z,.025,.1,.29,'#34474b');}box(0,0,z+.36,.91,.91,.055,'#ddc699');}
  box(0,0,4.81,1.04,1.04,.12,stone);box(0,0,4.93,.97,.97,.82,'#b29b73');
  for(let side=0;side<4;side++){
   const point=(x,z)=>side===0?[x,-.489,z]:side===1?[.489,x,z]:side===2?[x,.489,z]:[-.489,x,z];
   add(Array.from({length:40},(_,i)=>point(Math.cos(i*Math.PI/20)*.34,5.34+Math.sin(i*Math.PI/20)*.34)),'#f1e9cd');
   for(let i=0;i<12;i++){const a=i*Math.PI/6,rx=Math.cos(a),rz=Math.sin(a);add([point(rx*.27-rz*.015,5.34+rz*.27+rx*.015),point(rx*.32-rz*.015,5.34+rz*.32+rx*.015),point(rx*.32+rz*.015,5.34+rz*.32-rx*.015),point(rx*.27+rz*.015,5.34+rz*.27-rx*.015)],'#33464a');}
   add([point(-.02,5.32),point(-.22,5.51),point(-.18,5.55),point(.02,5.36)],'#25383e');add([point(-.02,5.36),point(.26,5.46),point(.27,5.42),point(.02,5.32)],'#25383e');
  }
  box(0,0,5.75,1.1,1.1,.12,stone);ring(0,0,5.87,.72,1.35,.08,'#384c53',4);ring(0,0,7.22,.075,.45,.008,'#d2b46c',8);
  for(const x of [-.46,.46])for(const y of [-.46,.46]){box(x,y,5.88,.09,.09,.33,stone);ring(x,y,6.21,.075,.22,.008,'#d2b46c',4);}
 }else if(type==='statueLiberty'){
  for(let i=0;i<4;i++)box(0,0,.23+i*.12,1.8-i*.2,1.8-i*.2,.12,stone);
  box(0,0,.71,.95,.95,1.5,stone);box(0,0,2.21,1.15,1.15,.15,stone);
  for(const x of [-.36,-.18,0,.18,.36]){box(x,.481,1.2,.07,.025,.55,'#6d746a');box(.481,x,1.2,.025,.07,.55,'#6d746a');}
  ring(0,0,2.36,.49,1.85,.27,copper,12);ring(0,0,4.21,.27,.62,.22,copper,10);
  beam([-.19,0,4.5],[-.62,0,5.13],.12,copper);beam([-.62,0,5.13],[-.64,0,5.95],.085,copper);ring(-.64,0,5.94,.15,.16,.18,'#c0ac73');ring(-.64,0,6.1,.13,.42,.01,'#e6b759');
  beam([.22,0,4.52],[.48,-.03,4.1],.11,copper);box(.38,-.13,3.96,.3,.13,.62,'#669588');
  ring(0,0,4.78,.14,.15,.14,copper);ring(0,0,4.93,.22,.37,.19,copper,10);ring(0,0,5.3,.27,.09,.24,'#4b8278',10);
  for(let i=0;i<7;i++){const a=Math.PI+i*Math.PI/6;beam([Math.cos(a)*.18,Math.sin(a)*.18,5.36],[Math.cos(a)*.44,Math.sin(a)*.44,5.68],.025,copper);}
  // Drapery ridges make the robe legible even at the normal city zoom.
  for(let i=0;i<10;i++){const a=i*Math.PI/5;beam([Math.cos(a)*.46,Math.sin(a)*.46,2.4],[Math.cos(a+.12)*.25,Math.sin(a+.12)*.25,4.22],.024,'#88b7a6');}
 }else throw Error('Unknown modeled landmark.');
 return faces;
}
export function drawLandmarkModel(ctx,type,rotation=0){
 const turn=([x,y,z])=>rotation===0?[x,y,z]:rotation===1?[-y,x,z]:rotation===2?[-x,-y,z]:[y,-x,z];
 const project=([x,y,z])=>[256+(x-y)*80,720+(x+y)*40-z*80];
 const faces=landmarkGeometry(type).map(f=>({...f,points:f.points.map(turn)}));
 // Painter ordering includes height so cornices, clocks and upper tiers cover their supports.
 faces.sort((a,b)=>a.points.reduce((n,p)=>n+p[0]+p[1]+p[2]*2,0)/a.points.length-b.points.reduce((n,p)=>n+p[0]+p[1]+p[2]*2,0)/b.points.length);
 for(const f of faces){ctx.beginPath();f.points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();}
}
const cache=new Map();
export function drawCityLandmark(ctx,type,rotation,x,y,width,alpha=1){const key=type+':'+rotation;let canvas=cache.get(key);if(!canvas){canvas=document.createElement('canvas');canvas.width=512;canvas.height=848;drawLandmarkModel(canvas.getContext('2d'),type,rotation);cache.set(key,canvas);}ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(canvas,x-width/2,y-720*width/512,width,848*width/512);ctx.restore();}
