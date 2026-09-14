import {CHICAGO_LANDMARK_GEOMETRY} from './chicago-landmark-models.js?v=scripted-ending-ranks-1';
import {HERITAGE_LANDMARK_GEOMETRY} from './heritage-landmark-models.js?v=scripted-ending-ranks-1';
import {ASIAN_LANDMARK_GEOMETRY} from './asian-landmark-models.js?v=scripted-ending-ranks-1';
import {SKYLINE_LANDMARK_GEOMETRY} from './skyline-landmark-models.js?v=scripted-ending-ranks-1';
import {US_MEMORIAL_GEOMETRY} from './us-memorial-models.js?v=scripted-ending-ranks-1';
import {eiffelTowerGeometry} from './eiffel-tower-model.js?v=scripted-ending-ranks-1';
import {greatPyramidGeometry} from './great-pyramid-model.js?v=scripted-ending-ranks-1';
import {rasterizeMiniature} from './miniature-raster.js?v=scripted-ending-ranks-1';
import {helsinkiCathedralGeometry} from './helsinki-cathedral-model.js?v=scripted-ending-ranks-1';
// Original landmark geometry shared by the city renderer and gallery previews.
export const MODELED_LANDMARKS=new Set(['bigBen','statueLiberty','chryslerBuilding','arcDeTriomphe','helsinkiCathedral','eiffelTower','greatPyramid',...Object.keys(US_MEMORIAL_GEOMETRY),...Object.keys(SKYLINE_LANDMARK_GEOMETRY),...Object.keys(ASIAN_LANDMARK_GEOMETRY),...Object.keys(HERITAGE_LANDMARK_GEOMETRY),...Object.keys(CHICAGO_LANDMARK_GEOMETRY)]);
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
export function landmarkGeometry(type){
 const faces=[],add=(points,color)=>faces.push({points,color});
 function ring(x,y,z,r,h,top,color,n=8){const a=Array.from({length:n},(_,i)=>{const t=i/n*Math.PI*2;return[x+Math.cos(t)*r,y+Math.sin(t)*r,z];}),b=a.map(([xx,yy])=>[x+(xx-x)*top/r,y+(yy-y)*top/r,z+h]);for(let i=0;i<n;i++)add([a[i],a[(i+1)%n],b[(i+1)%n],b[i]],shade(color,.68+.28*(i/n)));add(b,shade(color,1.12));}
 function box(x,y,z,w,d,h,color){const p=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],q=p.map(([a,b])=>[a,b,z+h]);for(let i=0;i<4;i++)add([p[i],p[(i+1)%4],q[(i+1)%4],q[i]],shade(color,[.7,.82,.95,.78][i]));add(q,shade(color,1.1));}
 function beam(a,b,r,color){const v=b.map((n,i)=>n-a[i]),len=Math.hypot(...v),u=v.map(n=>n/len),ref=Math.abs(u[2])<.9?[0,0,1]:[1,0,0],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],v1=cross(u,ref),l=Math.hypot(...v1),p=v1.map(n=>n/l),q=cross(u,p),circle=c=>Array.from({length:8},(_,i)=>c.map((n,j)=>n+r*(p[j]*Math.cos(i*Math.PI/4)+q[j]*Math.sin(i*Math.PI/4)))),aa=circle(a),bb=circle(b);for(let i=0;i<8;i++)add([aa[i],aa[(i+1)%8],bb[(i+1)%8],bb[i]],shade(color,.72+i*.035));add(bb,color);}
 const stone='#c5ae87',copper='#73a799';box(0,0,0,2.8,2.8,.12,stone);if(type!=='greatPyramid'){box(0,0,.12,2.55,2.55,.025,'#65805c');box(0,0,.15,2.1,2.1,.08,'#d0c8b5');}
 if(CHICAGO_LANDMARK_GEOMETRY[type]){CHICAGO_LANDMARK_GEOMETRY[type]({box,add,ring,beam});
 }else if(HERITAGE_LANDMARK_GEOMETRY[type]){HERITAGE_LANDMARK_GEOMETRY[type]({box,add,ring,beam});
 }else if(ASIAN_LANDMARK_GEOMETRY[type]){ASIAN_LANDMARK_GEOMETRY[type]({box,add,ring,beam});
 }else if(SKYLINE_LANDMARK_GEOMETRY[type]){SKYLINE_LANDMARK_GEOMETRY[type]({box,add,ring,beam});
 }else if(US_MEMORIAL_GEOMETRY[type]){US_MEMORIAL_GEOMETRY[type]({box,add,ring,beam});
 }else if(type==='eiffelTower'){eiffelTowerGeometry({box,beam});
 }else if(type==='greatPyramid'){greatPyramidGeometry({box,add});
 }else if(type==='helsinkiCathedral'){helsinkiCathedralGeometry({add,box,ring,beam});
 }else if(type==='bigBen'){
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
 }else if(type==='chryslerBuilding'){
  const cream='#d1c4a4',silver='#b8c6cb',glass='#354b59';
  // Setbacks and continuous window bays establish the Art Deco silhouette.
  const tiers=[[.23,2.2,1],[1.23,1.9,.8],[2.03,1.6,.7],[2.73,1.28,2.2],[4.93,1.05,.55]];
  for(const [z,w,h] of tiers){for(let floor=0;floor<h;floor+=.115)box(0,0,z+floor,w,w,Math.min(.115,h-floor),cream);box(0,0,z+h-.05,w+.06,w+.06,.05,'#e0d3b5');
   for(let side=0;side<4;side++)for(let x=-w/2+.16;x<w/2-.1;x+=.22)for(let f=z+.12;f<z+h-.1;f+=.23){const point=(a,b)=>side===0?[a,-w/2-.005,b]:side===1?[w/2+.005,a,b]:side===2?[a,w/2+.005,b]:[-w/2-.005,a,b];add([point(x,f),point(x+.085,f),point(x+.085,f+.14),point(x,f+.14)],glass);}
  }
  // Stacked silver arches with triangular sunburst windows on all four faces.
  for(let tier=0;tier<6;tier++){
   const w=1.15-tier*.145,z=5.35+tier*.24,h=.55;
   box(0,0,z,w,w,.17,silver);
   for(let side=0;side<4;side++){
    const point=(x,zz)=>side===0?[x,-w/2-.008,zz]:side===1?[w/2+.008,x,zz]:side===2?[x,w/2+.008,zz]:[-w/2-.008,x,zz];
    const arch=Array.from({length:17},(_,i)=>point(Math.cos(i*Math.PI/16)*w/2,z+.12+Math.sin(i*Math.PI/16)*h));add(arch,shade(silver,[.8,.95,1,.87][side]));
    for(let ray=1;ray<6;ray++){const a=ray*Math.PI/6;add([point(Math.cos(a-.1)*w*.42,z+.12+Math.sin(a-.1)*h*.83),point(Math.cos(a+.1)*w*.42,z+.12+Math.sin(a+.1)*h*.83),point(Math.cos(a)*w*.15,z+.15+Math.sin(a)*h*.3)],glass);}
   }
  }
  ring(0,0,6.85,.13,.32,.07,silver);ring(0,0,7.17,.07,.58,.002,'#d9e2e2');
  for(const x of [-1,1])for(const y of [-1,1]){beam([x*.55,y*.55,4.85],[x*.85,y*.85,4.9],.07,silver);beam([x*.85,y*.85,4.9],[x*.95,y*.95,4.84],.035,silver);}
 }else if(type==='arcDeTriomphe'){
  const limestone='#cbbb99',light='#decfad',relief='#d2c19f';
  box(0,0,.15,2.65,2.65,.08,'#b8b3a4');
  // Four masonry piers preserve open passages in both directions.
  for(const x of [-.96,.96])for(const y of [-.53,.53]){box(x,y,.23,.72,.4,.14,light);box(x,y,.37,.65,.35,1.4,limestone);box(x,y,1.77,.7,.4,.08,light);}
  for(const x of [-.96,.96])box(x,0,1.4,.7,1.42,.95,limestone);
  function arch(cx,cy,axis,r,z,thickness,depth){
   const point=(a,rr,offset)=>axis==='x'?[cx+Math.cos(a)*rr,cy+offset,z+Math.sin(a)*rr]:[cx+offset,cy+Math.cos(a)*rr,z+Math.sin(a)*rr];
   for(let i=0;i<16;i++){
    const a=i*Math.PI/16,b=(i+1)*Math.PI/16;
    for(const side of [-1,1]){const face=[point(a,r,side*depth/2),point(b,r,side*depth/2),point(b,r+thickness,side*depth/2),point(a,r+thickness,side*depth/2)];if(axis==='x'?side<0:side>0)face.reverse();add(face,shade(light,.85+(i%2)*.1));}
    add([point(a,r,-depth/2),point(b,r,-depth/2),point(b,r,depth/2),point(a,r,depth/2)],shade(limestone,.7));
    for(const side of [-1,1]){const pa=point(a,r+thickness,side*depth/2),pb=point(b,r+thickness,side*depth/2);const face=[pa,pb,[pb[0],pb[1],z+r+thickness],[pa[0],pa[1],z+r+thickness]];if(axis==='x'?side<0:side>0)face.reverse();add(face,limestone);}
   }
  }
  arch(0,0,'x',.61,1.55,.2,1.43);
  for(const x of [-.96,.96])arch(x,0,'y',.3,1.02,.13,.72);
  box(0,0,2.36,2.68,1.57,.13,light);box(0,0,2.49,2.57,1.5,.24,limestone);
  for(const side of [-1,1])for(let x=-1.18;x<=1.18;x+=.13)box(x,side*.77,2.51,.08,.045,.14,relief);
  box(0,0,2.73,2.75,1.65,.1,light);box(0,0,2.83,2.55,1.46,.38,limestone);
  for(const side of [-1,1])for(let x=-1.12;x<1.2;x+=.32){box(x,side*.75,2.89,.23,.035,.24,light);ring(x,side*.77,3.01,.055,.015,.055,relief,8);}
  box(0,0,3.21,2.72,1.64,.12,light);box(0,0,3.33,2.5,1.42,.07,'#a79d86');
  // Relief groups on the principal piers, kept legible at city scale.
  for(const x of [-.96,.96])for(const side of [-1,1]){
   box(x,side*.738,.48,.52,.07,.13,light);
   for(let i=0;i<3;i++){const xx=x+(i-1)*.14,z=.62+(.12*(i%2));ring(xx,side*.79,z,.085,.48,.045,relief,6);ring(xx,side*.79,z+.48,.07,.11,.045,light,8);beam([xx,side*.79,z+.36],[xx+(i-1)*.08,side*.82,z+.72],.035,relief);}
   box(x,side*.741,1.88,.48,.04,.27,light);
  }
 }else throw Error('Unknown modeled landmark.');
 return faces;
}
export function rasterizeLandmark(type,rotation=0,includeDepth=false){
 const project=([x,y,z],r)=>{[x,y]=r===0?[x,y]:r===1?[-y,x]:r===2?[-x,-y]:[y,-x];return[256+(x-y)*80,720+(x+y)*40-z*80];};
 return rasterizeMiniature(landmarkGeometry(type),rotation,includeDepth,{width:512,height:848,project});
}
export function drawLandmarkModel(ctx,type,rotation=0){
 if(HERITAGE_LANDMARK_GEOMETRY[type]||ASIAN_LANDMARK_GEOMETRY[type]||SKYLINE_LANDMARK_GEOMETRY[type]||US_MEMORIAL_GEOMETRY[type]||['helsinkiCathedral','eiffelTower','greatPyramid'].includes(type)){const raster=rasterizeLandmark(type,rotation),pixels=ctx.createImageData(raster.width,raster.height);pixels.data.set(raster.data);ctx.putImageData(pixels,0,0);return;}
 const turn=([x,y,z])=>rotation===0?[x,y,z]:rotation===1?[-y,x,z]:rotation===2?[-x,-y,z]:[y,-x,z];
 const project=([x,y,z])=>[256+(x-y)*80,720+(x+y)*40-z*80];
 const faces=landmarkGeometry(type).map(f=>({...f,points:f.points.map(turn)})).filter(f=>{if(type!=='arcDeTriomphe')return true;const [a,b,c]=f.points,u=b.map((v,i)=>v-a[i]),v=c.map((n,i)=>n-a[i]),normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];return normal[0]+normal[1]+normal[2]>0;});
 // Painter ordering includes height so cornices, clocks and upper tiers cover their supports.
 faces.sort((a,b)=>a.points.reduce((n,p)=>n+p[0]+p[1]+p[2]*2,0)/a.points.length-b.points.reduce((n,p)=>n+p[0]+p[1]+p[2]*2,0)/b.points.length);
 for(const f of faces){ctx.beginPath();f.points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();}
}
const cache=new Map();
function landmarkFrame(type,rotation){
 const key=type+':'+rotation;let frame=cache.get(key);if(frame)return frame;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=848;drawLandmarkModel(canvas.getContext('2d'),type,rotation);
 let left=512,top=848,right=0,bottom=0;
 for(const face of landmarkGeometry(type))for(const [px,py,z] of face.points){const [x,y]=rotation===0?[px,py]:rotation===1?[-py,px]:rotation===2?[-px,-py]:[py,-px],u=256+(x-y)*80,v=720+(x+y)*40-z*80;left=Math.min(left,u);right=Math.max(right,u);top=Math.min(top,v);bottom=Math.max(bottom,v);}
 left=Math.max(0,Math.floor(left)-2);top=Math.max(0,Math.floor(top)-2);right=Math.min(512,Math.ceil(right)+2);bottom=Math.min(848,Math.ceil(bottom)+2);
 frame={canvas,left,top,width:right-left,height:bottom-top};cache.set(key,frame);return frame;
}
export function drawLandmarkPreview(ctx,type,rotation,width,height){
 const frame=landmarkFrame(type,rotation),scale=Math.min((width-24)/frame.width,(height-24)/frame.height),w=frame.width*scale,h=frame.height*scale;
 ctx.clearRect(0,0,width,height);ctx.drawImage(frame.canvas,frame.left,frame.top,frame.width,frame.height,(width-w)/2,(height-h)/2,w,h);
}
export function drawCityLandmark(ctx,type,rotation,x,y,width,alpha=1){const {canvas}=landmarkFrame(type,rotation);ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(canvas,x-width/2,y-720*width/512,width,848*width/512);ctx.restore();}
