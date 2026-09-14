import {projectMiniature as projectCivic,rasterizeMiniature} from './miniature-raster.js?v=demand-explanation-1';
export {projectMiniature as projectCivic} from './miniature-raster.js?v=demand-explanation-1';
// Original civic miniatures. Geometry is footprint-relative; simulation stays in civic.js.
export const MODELED_CIVIC=new Set(['police','fire','hospital','school','jail','college','library','museum']);
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.max(0,Math.min(255,Math.round(parseInt(v,16)*f))).toString(16).padStart(2,'0')).join('');
export function civicGeometry(type){
 if(!MODELED_CIVIC.has(type))throw Error('Unknown civic model.');
 const faces=[],add=(points,color)=>faces.push({points,color});
 const box=(x,y,z,w,d,h,color)=>{const a=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],b=a.map(([xx,yy])=>[xx,yy,z+h]);for(let i=0;i<4;i++)add([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],shade(color,[.72,.84,.96,.78][i]));add(b,shade(color,1.06));};
 const roof=(x,y,z,w,d,h,color)=>{const a=[x-w/2,y-d/2,z],b=[x+w/2,y-d/2,z],c=[x+w/2,y+d/2,z],d0=[x-w/2,y+d/2,z],e=[x,y-d/2,z+h],f=[x,y+d/2,z+h];add([a,b,e],shade(color,.8));add([b,c,f,e],shade(color,.92));add([c,d0,f],shade(color,1.04));add([d0,a,e,f],shade(color,.72));};
 const building=(x,y,w,d,h,color,floors=2)=>{box(x,y,.055,w,d,h,color);box(x,y,h+.055,w+.018,d+.018,.025,'#d1c9b5');for(let level=0;level<floors;level++)for(let col=0;col<4;col++){const z=.10+level*h/floors,wh=Math.min(.07,h/floors*.45),xx=x-w/2+w*(col+.5)/4,yy=y-d/2+d*(col+.5)/4;for(const side of [-1,1]){box(xx,y+side*(d/2+.002),z,w*.10,.007,wh,'#547c87');box(x+side*(w/2+.002),yy,z,.007,d*.10,wh,'#547c87');}}};
 const tree=(x,y)=>{box(x,y,.055,.018,.018,.12,'#8d7653');box(x,y,.16,.10,.10,.10,'#658c67');box(x,y,.23,.065,.065,.065,'#82a578');};
 const car=(x,y,color,truck=false)=>{box(x,y,.06,.09,truck?.19:.15,.04,'#303e45');box(x,y,.09,.085,truck?.18:.14,.04,color);box(x,y-.018,.13,.073,.065,.036,'#7197a0');if(truck)box(x,y+.04,.13,.07,.055,.055,color);};
 const stairs=(x,y,width)=>{for(let i=0;i<3;i++)box(x,y-i*.022,.04+i*.012,width,.07,.014,'#d1c9b5');};
 const fence=(x,y,w,d)=>{for(let i=0;i<=8;i++){const xx=x-w/2+w*i/8,yy=y-d/2+d*i/8;for(const side of [-1,1]){box(xx,y+side*d/2,.05,.006,.006,.16,'#82918b');box(x+side*w/2,yy,.05,.006,.006,.16,'#82918b');}}for(const z of [.12,.19]){box(x,y-d/2,z,w,.006,.006,'#a0aba2');box(x,y+d/2,z,w,.006,.006,'#a0aba2');box(x-w/2,y,z,.006,d,.006,'#a0aba2');box(x+w/2,y,z,.006,d,.006,'#a0aba2');}};
 box(0,0,0,.97,.97,.035,'#a9ac9a');box(0,0,.035,.92,.92,.015,'#8f9c7b');box(0,.30,.052,.88,.29,.004,'#b5b4a4');
 if(type==='police'){
  building(0,-.10,.57,.50,.40,'#b5bcb0',3);building(0,-.06,.24,.25,.61,'#c7c4b1',4);box(0,.165,.08,.13,.014,.17,'#335966');stairs(0,.23,.23);box(0,.17,.29,.10,.013,.07,'#3c657d');box(0,.18,.31,.032,.012,.032,'#dec57b');
  for(const x of [-.31,.31])car(x,.31,'#e2e6d8');for(const x of [-.38,.38])tree(x,-.34);
 }else if(type==='fire'){
  building(-.07,-.08,.63,.43,.32,'#ad6852',2);building(.30,-.20,.16,.25,.69,'#b4775c',4);box(-.07,-.08,.40,.66,.45,.04,'#555f60');
  for(const x of [-.24,-.03,.18]){box(x,.14,.056,.14,.012,.20,'#ddd7bd');for(let j=0;j<5;j++)box(x,.15,.08+j*.031,.13,.008,.007,'#8d9690');}
  car(-.25,.32,'#ca5141',true);car(.02,.32,'#b9483e',true);box(-.25,.36,.19,.035,.11,.015,'#c4ceca');box(.30,-.20,.76,.19,.28,.045,'#747d77');
 }else if(type==='hospital'){
  building(-.12,-.14,.48,.54,.60,'#d0d8d0',4);building(.23,.09,.28,.49,.29,'#dce0d3',2);box(-.12,-.14,.69,.42,.44,.015,'#6a989c');
  for(const x of [-.19,-.05])box(x,-.14,.71,.034,.20,.003,'#f0e9cb');box(-.12,-.14,.711,.15,.035,.003,'#f0e9cb');
  box(.22,.35,.18,.30,.15,.02,'#5a9b98');car(.15,.36,'#e6e8d9',true);box(.15,.405,.17,.045,.035,.01,'#508f80');tree(-.36,.32);
 }else if(type==='school'){
  building(0,-.24,.70,.24,.26,'#b48363',2);building(-.26,.02,.18,.35,.22,'#bf8c68',2);building(.26,.02,.18,.35,.22,'#bf8c68',2);roof(0,-.24,.34,.73,.27,.12,'#758c83');
  box(0,.03,.055,.27,.29,.003,'#baa67d');for(const x of [-.08,.08]){box(x,.29,.06,.012,.012,.17,'#728d8f');box(x,.40,.06,.012,.012,.17,'#728d8f');}box(0,.29,.225,.18,.016,.016,'#b89968');box(0,.40,.225,.18,.016,.016,'#b89968');box(0,.345,.12,.085,.05,.012,'#d2ae70');tree(-.37,.33);tree(.37,.33);
 }else if(type==='jail'){
  building(-.21,-.07,.28,.64,.35,'#b6af91',3);building(.08,-.30,.31,.18,.28,'#c1b798',2);fence(.16,.06,.43,.51);box(.16,.06,.055,.38,.46,.004,'#a7a893');
  for(const [x,y]of [[.37,-.20],[.37,.32]]){box(x,y,.055,.065,.065,.36,'#aaac99');box(x,y,.415,.12,.12,.10,'#708b8b');roof(x,y,.52,.15,.15,.045,'#79816e');}
  for(let y=-.31;y<.25;y+=.075)for(let i=0;i<3;i++)box(-.065,y,.12+i*.105,.008,.006,.05,'#d5d5bd');
 }else if(type==='college'){
  building(0,-.13,.38,.48,.47,'#b89d7b',3);building(-.29,-.15,.18,.39,.27,'#bcaa8c',2);building(.29,-.15,.18,.39,.27,'#bcaa8c',2);roof(0,-.13,.55,.42,.53,.16,'#667f79');
  for(const x of [-.13,-.045,.045,.13])box(x,.15,.065,.022,.022,.28,'#ddd5bc');roof(0,.16,.35,.36,.17,.10,'#7c8f80');stairs(0,.29,.37);for(const x of [-.35,.35])tree(x,.32);
 }else if(type==='library'){
  building(-.12,-.10,.48,.48,.26,'#c8c9ae',2);building(.24,-.08,.23,.44,.37,'#a8bcb2',3);box(-.12,.147,.09,.42,.015,.17,'#689a9d');box(-.12,-.09,.355,.55,.54,.035,'#738e89');
  for(let i=0;i<7;i++)box(-.29+i*.048,.162,.10,.025,.008,.08+(i%3)*.014,['#bba476','#a96655','#7c9c98'][i%3]);box(.23,.15,.08,.12,.012,.19,'#587c82');stairs(.23,.24,.18);tree(-.37,.33);box(-.02,.33,.055,.17,.065,.025,'#b79e77');
 }else if(type==='museum'){
  building(0,-.14,.67,.42,.32,'#cbbb98',2);box(0,.10,.05,.73,.23,.055,'#cbbf9e');for(let i=0;i<6;i++){const x=-.28+i*.112;box(x,.13,.105,.035,.035,.31,'#ddd0ab');box(x,.13,.105,.055,.055,.025,'#b4a989');box(x,.13,.39,.055,.055,.025,'#e2d4b1');}
  // Broad pediment across the entrance, with its ridge along the building width.
  roof(0,.08,.42,.77,.28,.16,'#a7ac98');stairs(0,.31,.73);for(const x of [-.36,.36])box(x,.35,.055,.08,.08,.07,'#8e9b80');
 }
 return faces;
}
export function civicFaces(type,rotation=0){
 const turn=([x,y,z])=>rotation===0?[x,y,z]:rotation===1?[-y,x,z]:rotation===2?[-x,-y,z]:[y,-x,z];
 return civicGeometry(type).map(f=>({...f,world:f.points.map(turn),height:Math.max(...f.points.map(p=>p[2]))})).sort((a,b)=>{const ag=a.height<=.06,bg=b.height<=.06;if(ag!==bg)return ag?-1:1;if(ag&&bg)return a.height-b.height;return a.world.reduce((n,p)=>n+p[0]+p[1]+2*p[2],0)/a.world.length-b.world.reduce((n,p)=>n+p[0]+p[1]+2*p[2],0)/b.world.length;}).map(f=>({color:f.color,points:f.points.map(p=>projectCivic(p,rotation))})).filter(f=>f.points.reduce((sum,p,i)=>{const q=f.points[(i+1)%f.points.length];return sum+p[0]*q[1]-q[0]*p[1];},0)>0);
}
export const rasterizeCivic=(type,rotation=0)=>rasterizeMiniature(civicGeometry(type),rotation);
export function drawCivicModel(ctx,type,rotation=0){const raster=rasterizeCivic(type,rotation),image=ctx.createImageData(raster.width,raster.height);image.data.set(raster.data);ctx.putImageData(image,0,0);}
const cache=new Map();
export function drawCityCivic(ctx,type,rotation,x,y,width,alpha=1){const key=type+':'+rotation;let canvas=cache.get(key);if(!canvas){canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;drawCivicModel(canvas.getContext('2d'),type,rotation);cache.set(key,canvas);}ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(canvas,x-width/2,y-320*width/512,width,width);ctx.restore();}
