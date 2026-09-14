import {rasterizeMiniature} from './miniature-raster.js?v=bungalow-style-1';
export const MODELED_REWARDS=new Set(['cityHall','mayorHouse','stadium','university']);
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
export function rewardGeometry(type){
 if(!MODELED_REWARDS.has(type))throw Error('Unknown reward model.');
 const faces=[],add=(points,color)=>faces.push({points,color});
 const box=(x,y,z,w,d,h,color)=>{const a=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],b=a.map(([xx,yy])=>[xx,yy,z+h]);for(let i=0;i<4;i++)add([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],shade(color,[.72,.84,.96,.78][i]));add(b,shade(color,1.06));};
 const roof=(x,y,z,w,d,h,color)=>{const a=[x-w/2,y-d/2,z],b=[x+w/2,y-d/2,z],c=[x+w/2,y+d/2,z],e=[x-w/2,y+d/2,z],l=[x-w/2,y,z+h],r=[x+w/2,y,z+h];add([a,b,r,l],shade(color,.76));add([l,r,c,e],color);add([a,l,e],shade(color,.7));add([b,c,r],shade(color,.9));};
 const hall=(x,y,w,d,h,color)=>{box(x,y,.05,w,d,h,color);roof(x,y,h+.05,w+.02,d+.02,.075,'#647c83');for(const side of [-1,1])for(let i=0;i<Math.floor(w/.07);i++)for(const z of [.12,.23])if(z+.045<h+.05)box(x-w/2+.045+i*.07,y+side*(d/2+.003),z,.028,.007,.048,'#547e8a');};
 const tree=(x,y)=>{box(x,y,.06,.015,.015,.09,'#796449');for(const [z,w]of [[.14,.085],[.19,.065],[.23,.035]])box(x,y,z,w,w,.035,'#537a50');};
 box(0,0,0,.97,.97,.04,'#aaa993');box(0,0,.04,.93,.93,.015,'#81966d');
 if(type==='mayorHouse'){
  box(0,.20,.056,.14,.48,.008,'#c6bfa8');hall(-.06,-.10,.49,.35,.26,'#d9cbaa');hall(.27,-.14,.17,.25,.14,'#c7b994');
  box(-.06,.145,.06,.27,.12,.045,'#c9c4ae');for(const x of [-.17,-.06,.05])box(x,.15,.105,.018,.018,.18,'#f0dfb6');roof(-.06,.15,.285,.30,.13,.035,'#6b7e83');box(-.06,.079,.06,.057,.01,.14,'#605d57');box(-.20,-.11,.36,.045,.065,.12,'#ac7f65');
  for(const y of [-.34,.34])for(const x of [-.35,.35])tree(x,y);for(const x of [-.42,.42])box(x,0,.06,.025,.80,.04,'#567e52');
  box(.24,.26,.06,.23,.17,.02,'#b5b99f');box(.24,.26,.08,.18,.12,.01,'#79a5a3');for(const x of [-.19,.07])box(x,.30,.06,.07,.15,.008,'#c7a879');
 }else if(type==='cityHall'){
  // Original limestone civic hall with colonnade, clock tower and formal gardens.
  hall(0,-.10,.72,.34,.27,'#d5ceb5');box(0,-.10,.33,.30,.26,.09,'#c3baa1');
  box(0,-.10,.42,.17,.17,.17,'#ddd4b8');roof(0,-.10,.59,.22,.22,.09,'#547e77');
  for(const side of [-1,1]){box(0,-.10+side*.086,.47,.065,.005,.065,'#f1e6c6');box(side*.086,-.10,.47,.005,.065,.065,'#f1e6c6');box(0,-.10+side*.091,.482,.005,.005,.034,'#485657');box(side*.091,-.10,.482,.005,.005,.034,'#485657');}
  for(let step=0;step<3;step++)box(0,.19+step*.027,.055,.39,.18-step*.034,.018*(step+1),'#c6c1ae');
  for(const x of [-.16,-.08,0,.08,.16]){box(x,.14,.11,.024,.024,.20,'#eee4c8');box(x,.14,.30,.038,.04,.025,'#ddd1b1');}
  roof(0,.14,.33,.43,.15,.065,'#719086');box(0,.073,.06,.07,.006,.17,'#49615e');
  box(0,.36,.055,.18,.23,.01,'#c5bda4');for(const x of [-.34,.34])for(const y of [-.34,.32])tree(x,y);
  for(const x of [-.24,.24]){box(x,.34,.06,.055,.055,.035,'#afad9d');box(x,.34,.095,.009,.009,.29,'#c5c9ba');box(x+.042,.34,.31,.08,.005,.06,x<0?'#658b9b':'#c09264');}
 }else if(type==='university'){
  box(0,0,.056,.65,.69,.009,'#c6b89c');box(0,.08,.066,.28,.33,.005,'#829b6b');hall(0,-.26,.77,.24,.28,'#c3a27d');for(const x of [-.29,.29])hall(x,.09,.19,.46,.22,'#bca07e');
  hall(0,-.24,.16,.20,.49,'#cbb595');box(0,-.24,.565,.19,.23,.025,'#dad0ab');roof(0,-.24,.59,.20,.24,.11,'#597779');for(const side of [-1,1]){box(0,-.24+side*.105,.425,.063,.005,.063,'#e0dbbe');box(0,-.24+side*.109,.452,.025,.005,.007,'#536568');}
  for(const x of [-.08,.08])box(x,-.09,.07,.018,.035,.19,'#e4d4af');box(0,-.085,.26,.20,.06,.02,'#d9c6a0');box(0,.34,.06,.13,.19,.008,'#d2c4a7');for(const x of [-.40,.40])for(const y of [-.36,.30])tree(x,y);
  box(.34,.36,.055,.10,.10,.012,'#bab39c');box(.34,.36,.067,.02,.02,.16,'#8d9e98');box(.34,.36,.227,.04,.035,.025,'#82968a');
 }else{
  // Open stepped stands leave the playing surface visible from every camera.
  box(0,0,.055,.59,.72,.012,'#52866b');for(let i=0;i<6;i++)box(0,-.30+i*.12,.068,.56,.06,.002,i%2?'#659673':'#5b8f6e');
  for(const x of [-.25,.25])box(x,0,.071,.006,.62,.003,'#d6dbb9');for(const y of [-.31,0,.31])box(0,y,.071,.50,.006,.003,'#d6dbb9');
  for(const y of [-.28,.28]){box(0,y,.074,.16,.004,.07,'#ece6cb');for(const x of [-.08,.08])box(x,y,.074,.004,.012,.07,'#ece6cb');}
  for(let tier=0;tier<5;tier++){const d=.31+tier*.026,z=.075+tier*.038;for(const side of [-1,1]){box(side*d,0,z,.026,.73,.035,tier%2?'#9aaeb2':'#74939e');box(0,side*(d+.052),z,.56,.026,.035,tier%2?'#c4bda4':'#a89982');}}
  for(const side of [-1,1])box(side*.435,0,.26,.045,.78,.025,'#d0c9b5');box(0,-.43,.27,.58,.06,.045,'#71888c');box(0,-.444,.32,.24,.025,.11,'#344e58');box(0,-.459,.35,.18,.003,.045,'#bad4a4');
  for(const x of [-.40,.40])for(const y of [-.36,.36]){box(x,y,.06,.014,.014,.48,'#b8c4b6');box(x,y,.54,.11,.035,.025,'#e1dcc1');for(const xx of [-.035,0,.035])box(x+xx,y+.02,.545,.018,.007,.013,'#fff0c7');}
  box(0,.43,.055,.24,.08,.11,'#b8a88f');for(const x of [-.08,0,.08])box(x,.474,.06,.03,.008,.07,'#556c76');
 }
 return faces;
}
export const rasterizeReward=(type,rotation=0)=>rasterizeMiniature(rewardGeometry(type),rotation);
const cache=new Map();
export function drawCityReward(ctx,type,rotation,x,y,width,alpha=1){const key=type+':'+rotation;let canvas=cache.get(key);if(!canvas){canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const c=canvas.getContext('2d'),raster=rasterizeReward(type,rotation),image=c.createImageData(512,512);image.data.set(raster.data);c.putImageData(image,0,0);cache.set(key,canvas);}ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(canvas,x-width/2,y-320*width/512,width,width);ctx.restore();}
