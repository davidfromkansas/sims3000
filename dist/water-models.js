import {rasterizeMiniature} from './miniature-raster.js?v=reward-progress-1';
export const MODELED_WATER=new Set(['pump','waterTower','desalination','waterTreatment']);
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
export function waterGeometry(type){
 if(!MODELED_WATER.has(type))throw Error('Unknown water facility model.');
 const faces=[],add=(points,color)=>faces.push({points,color});
 const box=(x,y,z,w,d,h,color)=>{const a=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],b=a.map(([xx,yy])=>[xx,yy,z+h]);for(let i=0;i<4;i++)add([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],shade(color,[.72,.84,.96,.78][i]));add(b,shade(color,1.06));};
 const ring=(x,y,z,r)=>Array.from({length:20},(_,i)=>[x+Math.cos(i*Math.PI/10)*r,y+Math.sin(i*Math.PI/10)*r,z]);
 const cylinder=(x,y,z,r,h,color)=>{const a=ring(x,y,z,r),b=ring(x,y,z+h,r);for(let i=0;i<20;i++)add([a[i],a[(i+1)%20],b[(i+1)%20],b[i]],shade(color,.74+.20*(1+Math.sin(i*Math.PI/10))*.5));add(b,shade(color,1.06));};
 const basin=(x,y,r)=>{cylinder(x,y,.06,r,.13,'#a8b9b1');const outer=ring(x,y,.20,r),inner=ring(x,y,.20,r-.022);for(let i=0;i<20;i++)add([outer[i],outer[(i+1)%20],inner[(i+1)%20],inner[i]],'#d5d9c2');add(ring(x,y,.194,r-.022),'#5d9fa7');cylinder(x,y,.195,.022,.055,'#cdd4c6');box(x,y,.237,r*1.80,.015,.012,'#d7d8c5');};
 const hall=(x,y,w,d,h,color)=>{box(x,y,.05,w,d,h,color);box(x,y,h+.05,w+.024,d+.024,.035,'#709091');for(let i=0;i<4;i++)for(const side of [-1,1])box(x-w*.36+i*w*.24,y+side*(d/2+.004),.11,.055,.010,.085,'#496b77');box(x,y+d/2+.01,.05,.075,.012,.12,'#416578');};
 const pipe=(x,y,z,w,d)=>{box(x,y,z,w,d,.037,'#528f9d');for(const xx of [x-w*.35,x+w*.35])box(xx,y,z-.003,.014,d+.012,.043,'#b4c3b7');};
 box(0,0,0,.97,.97,.04,'#aeb5a0');box(0,0,.04,.93,.93,.015,'#91a08a');box(0,.34,.057,.90,.20,.008,'#c1bfa6');
 if(type==='pump'){
  hall(-.12,-.12,.52,.48,.27,'#ba8d6c');box(-.12,-.12,.36,.56,.52,.025,'#56767d');
  for(const y of [-.24,.03]){cylinder(.30,y,.057,.083,.16,'#7ba7a9');cylinder(.30,y,.22,.038,.038,'#d0d8c7');pipe(.19,y,.09,.27,.046);}
  pipe(0,.32,.065,.77,.055);box(-.33,.27,.06,.09,.10,.10,'#78928a');
 }else if(type==='waterTower'){
  for(const x of [-.18,.18])for(const y of [-.18,.18]){box(x,y,.055,.072,.072,.045,'#c3c1a6');box(x,y,.10,.024,.024,.57,'#6d8c87');}
  for(const z of [.24,.44]){box(0,-.18,z,.38,.018,.018,'#78938b');box(0,.18,z,.38,.018,.018,'#78938b');box(-.18,0,z,.018,.38,.018,'#78938b');box(.18,0,z,.018,.38,.018,'#78938b');}
  cylinder(0,0,.60,.27,.055,'#789b9a');cylinder(0,0,.655,.26,.27,'#b9d2c6');cylinder(0,0,.925,.27,.022,'#679899');cylinder(0,0,.947,.22,.025,'#96b8ab');cylinder(0,0,.972,.15,.022,'#aac8b7');cylinder(0,0,.994,.07,.016,'#c5d6be');
  box(.27,0,.06,.025,.025,.88,'#588c96');for(const x of [-.26,-.18])box(x,.18,.12,.012,.012,.72,'#c4bc9c');for(let i=0;i<15;i++)box(-.22,.18,.12+i*.05,.08,.012,.009,'#d1c8a8');hall(-.24,.31,.20,.18,.14,'#9ca58d');
 }else if(type==='desalination'){
  hall(0,-.23,.78,.32,.30,'#c9ceba');box(0,-.23,.39,.70,.28,.02,'#87a7a0');
  for(const x of [-.28,0,.28]){cylinder(x,.10,.057,.105,.22,'#b1c6bd');cylinder(x,.10,.277,.108,.024,'#82a6a1');pipe(x,.26,.08,.16,.035);box(x,-.23,.415,.12,.16,.065,'#658e98');}
  pipe(0,.33,.065,.83,.045);box(.36,.33,.10,.065,.065,.07,'#bbbd9c');
 }else{
  basin(-.23,-.12,.195);basin(.23,-.12,.195);hall(-.21,.28,.37,.22,.18,'#b3bca2');
  box(.23,.25,.06,.32,.23,.09,'#b4c4b4');box(.23,.25,.151,.27,.18,.004,'#5d9598');for(const x of [.13,.23,.33])box(x,.25,.16,.012,.20,.015,'#d2d3bc');pipe(0,-.37,.065,.79,.035);
 }
 return faces;
}
export const rasterizeWater=(type,rotation=0)=>rasterizeMiniature(waterGeometry(type),rotation);
const cache=new Map();
export function drawCityWater(ctx,type,rotation,x,y,width,alpha=1){const key=type+':'+rotation;let canvas=cache.get(key);if(!canvas){canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const c=canvas.getContext('2d'),raster=rasterizeWater(type,rotation),image=c.createImageData(512,512);image.data.set(raster.data);c.putImageData(image,0,0);cache.set(key,canvas);}ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(canvas,x-width/2,y-320*width/512,width,width);ctx.restore();}
