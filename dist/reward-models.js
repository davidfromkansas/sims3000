import {stadiumMatchPixels} from './stadium-match.js?v=civic-landmarks-1';
import {rasterizeMiniature} from './miniature-raster.js?v=civic-landmarks-1';
export const MODELED_REWARDS=new Set(['historicStatue','lighthouse','performingArts','medicalResearch','cityHall','mayorHouse','stadium','university','countyCourthouse']);
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
export function rewardGeometry(type){
 if(!MODELED_REWARDS.has(type))throw Error('Unknown reward model.');
 const faces=[],add=(points,color)=>faces.push({points,color});
 const box=(x,y,z,w,d,h,color)=>{const a=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],b=a.map(([xx,yy])=>[xx,yy,z+h]);for(let i=0;i<4;i++)add([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],shade(color,[.72,.84,.96,.78][i]));add(b,shade(color,1.06));};
 const roof=(x,y,z,w,d,h,color)=>{const a=[x-w/2,y-d/2,z],b=[x+w/2,y-d/2,z],c=[x+w/2,y+d/2,z],e=[x-w/2,y+d/2,z],l=[x-w/2,y,z+h],r=[x+w/2,y,z+h];add([a,b,r,l],shade(color,.76));add([l,r,c,e],color);add([a,l,e],shade(color,.7));add([b,c,r],shade(color,.9));};
 const hall=(x,y,w,d,h,color)=>{box(x,y,.05,w,d,h,color);roof(x,y,h+.05,w+.02,d+.02,.075,'#647c83');for(const side of [-1,1])for(let i=0;i<Math.floor(w/.07);i++)for(const z of [.12,.23])if(z+.045<h+.05)box(x-w/2+.045+i*.07,y+side*(d/2+.003),z,.028,.007,.048,'#547e8a');};
 const tree=(x,y)=>{box(x,y,.06,.015,.015,.09,'#796449');for(const [z,w]of [[.14,.085],[.19,.065],[.23,.035]])box(x,y,z,w,w,.035,'#537a50');};
 box(0,0,0,.97,.97,.04,'#aaa993');box(0,0,.04,.93,.93,.015,'#81966d');
 if(type==='historicStatue'){
  // Original bronze civic figure with book, on a limestone memorial plinth.
  box(0,0,.055,.76,.76,.035,'#cac4b1');box(0,0,.09,.49,.49,.06,'#b2ad99');
  box(0,0,.15,.29,.29,.25,'#d6ccb2');box(0,0,.40,.35,.35,.035,'#e2d7bb');
  box(0,.151,.23,.15,.007,.09,'#667b70');box(0,0,.435,.20,.17,.045,'#657e6b');
  box(-.055,0,.48,.06,.085,.19,'#597867');box(.055,0,.48,.06,.085,.19,'#597867');
  box(0,0,.65,.18,.13,.20,'#648b76');box(0,0,.85,.06,.07,.035,'#729781');box(0,0,.885,.105,.095,.11,'#71957d');
  box(-.115,0,.68,.055,.07,.16,'#567b66');box(.115,.04,.71,.055,.14,.065,'#72977c');box(.115,.09,.76,.10,.075,.10,'#a09d7b');
  for(const x of [-.34,.34]){box(x,0,.10,.065,.27,.055,'#7c8068');tree(x,-.34);}
 }else if(type==='lighthouse'){
  // Original twelve-sided banded tower, lantern gallery and keeper's cottage.
  const ring=(radius,z)=>Array.from({length:12},(_,i)=>[-.12+radius*Math.cos(i*Math.PI/6),-.07+radius*Math.sin(i*Math.PI/6),z]);
  const tier=(r1,r2,z,h,color)=>{const a=ring(r1,z),b=ring(r2,z+h);for(let i=0;i<12;i++)add([a[i],a[(i+1)%12],b[(i+1)%12],b[i]],shade(color,.74+.22*(i%4)/3));add(b,color);};
  box(0,0,.055,.86,.84,.02,'#beb8a1');tier(.19,.17,.075,.22,'#e9ddbf');tier(.17,.15,.295,.19,'#af6250');tier(.15,.13,.485,.20,'#e9ddbf');
  tier(.20,.20,.685,.035,'#818d83');tier(.12,.12,.72,.14,'#79a5ab');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;box(-.12+.12*Math.cos(a),-.07+.12*Math.sin(a),.72,.012,.012,.14,'#d6cdb5');}
  tier(.17,0,.86,.12,'#586f70');box(-.12,-.07,.98,.014,.014,.065,'#62766b');
  hall(.27,.17,.30,.29,.16,'#d9c8a6');box(-.12,.105,.095,.055,.009,.105,'#596c67');tree(.34,-.34);
 }else if(type==='performingArts'){
  // Original theater: copper barrel-vault auditorium, glazed foyer and sculpture court.
  box(0,.29,.055,.84,.29,.012,'#c9c0ab');box(-.10,-.06,.055,.58,.56,.215,'#a98e79');
  const arc=Array.from({length:13},(_,i)=>[-.10+.31*Math.cos(i*Math.PI/12),.27+.16*Math.sin(i*Math.PI/12)]);
  for(let i=0;i<12;i++){const [x1,z1]=arc[i],[x2,z2]=arc[i+1];add([[x2,-.36,z2],[x1,-.36,z1],[x1,.24,z1],[x2,.24,z2]],shade(i%2?'#cdb58a':'#dac69e',.78+.22*Math.sin((i+.5)*Math.PI/12)));}
  add(arc.map(([x,z])=>[x,-.36,z]),'#897b69');add(arc.map(([x,z])=>[x,.24,z]).reverse(),'#b9a887');
  box(-.08,.24,.06,.62,.18,.16,'#4f7882');box(-.08,.24,.22,.68,.21,.018,'#dad4bd');
  for(const x of [-.34,-.24,-.14,-.04,.06,.16])box(x,.332,.07,.011,.007,.15,'#b3c4bd');
  box(.31,-.09,.06,.22,.46,.24,'#c9b89a');box(.31,-.09,.30,.25,.49,.022,'#a79171');
  for(const y of [-.23,-.08,.07]){box(.424,y,.105,.006,.09,.13,'#697c80');box(.429,y,.125,.004,.075,.08,y<0?'#bc8b65':'#8eb0a4');}
  box(.30,.30,.07,.12,.12,.045,'#9b9480');for(let tier=0;tier<4;tier++)box(.30+(tier%2?.016:-.016),.30,.115+tier*.035,.045,.045,.04,'#71918b');
  for(const x of [-.36,-.28])box(x,.39,.07,.06,.035,.018,'#a49b85');tree(.36,-.36);tree(-.40,.35);
 }else if(type==='medicalResearch'){
  // Original modern laboratory campus: glazed research tower, clinic wing and rooftop plant.
  box(0,.25,.055,.78,.35,.014,'#c5c8be');box(-.10,-.12,.055,.56,.49,.40,'#d5ded7');
  for(const z of [.13,.22,.31,.40]){box(-.10,.129,z,.48,.009,.052,'#497f8a');box(-.384,-.12,z,.009,.42,.052,'#527e8a');box(.184,-.12,z,.009,.42,.052,'#608e98');box(-.10,-.369,z,.48,.009,.052,'#537e89');}
  box(-.10,-.12,.455,.59,.52,.025,'#a8b9b7');box(-.16,-.18,.48,.24,.19,.055,'#889c9d');for(const x of [-.23,-.10])box(x,-.18,.535,.065,.12,.015,'#596f72');
  box(.29,-.02,.055,.26,.57,.21,'#b8c9c8');box(.29,-.02,.265,.29,.60,.025,'#729296');
  for(const y of [-.21,-.09,.03,.15])box(.423,y,.13,.008,.075,.075,'#466f7b');
  box(-.10,.18,.055,.27,.11,.17,'#537f88');box(-.10,.23,.23,.36,.18,.028,'#e3e6dc');for(const x of [-.23,.03])box(x,.28,.06,.014,.014,.17,'#c5d4cd');
  for(const x of [-.37,.36])tree(x,.36);box(-.29,.30,.07,.04,.08,.10,'#6b9ca5');box(-.29,.30,.17,.08,.08,.018,'#dbe2d9');
 }else if(type==='mayorHouse'){
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
 }else if(type==='countyCourthouse'){
  // Original courthouse: masonry wings, limestone portico and stepped copper cupola.
  box(0,.15,.055,.65,.56,.012,'#c7bfab');hall(0,-.12,.77,.38,.32,'#c5b7a0');
  for(const x of [-.31,.31])hall(x,.04,.17,.36,.25,'#baaa95');
  for(let step=0;step<4;step++)box(0,.27+step*.032,.057,.43,.16-step*.027,.014*(step+1),'#d8cfb9');
  for(const x of [-.18,-.108,-.036,.036,.108,.18]){box(x,.15,.09,.032,.032,.25,'#e9dfc7');box(x,.15,.335,.045,.055,.026,'#ddd3bb');}
  box(0,.14,.36,.48,.18,.034,'#ded2b8');roof(0,.14,.394,.50,.20,.08,'#c4b89d');
  box(0,-.12,.38,.27,.27,.07,'#b2ad94');for(let tier=0;tier<5;tier++)box(0,-.12,.45+tier*.027,.25-tier*.034,.25-tier*.034,.028,'#789b8d');
  box(0,-.12,.585,.055,.055,.04,'#d9c9a9');box(0,-.12,.625,.012,.012,.075,'#bdad87');
  for(const x of [-.10,0,.10])box(x,.075,.067,.057,.009,.16,'#526d71');
  for(const x of [-.40,.40]){tree(x,-.36);tree(x,.33);}box(.32,.36,.06,.11,.07,.025,'#b7a58d');box(.32,.36,.085,.014,.014,.18,'#927f66');box(.32,.36,.265,.05,.05,.03,'#c2ab82');
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
export const rasterizeReward=(type,rotation=0,includeDepth=false)=>rasterizeMiniature(rewardGeometry(type),rotation,includeDepth);
const cache=new Map(),stadiumDepth=new Map();
export function drawCityReward(ctx,type,rotation,x,y,width,alpha=1,match=null){const key=type+':'+rotation;let canvas=cache.get(key);if(!canvas){canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const c=canvas.getContext('2d'),raster=rasterizeReward(type,rotation,type==='stadium'),image=c.createImageData(512,512);if(type==='stadium')stadiumDepth.set(rotation,raster.depth);image.data.set(raster.data);c.putImageData(image,0,0);cache.set(key,canvas);}ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(canvas,x-width/2,y-320*width/512,width,width);if(type==='stadium'&&match?.active){const scale=width/512;for(const p of stadiumMatchPixels(match.time,rotation,stadiumDepth.get(rotation))){ctx.fillStyle=p.color;ctx.fillRect(x+(p.x-256)*scale,y+(p.y-320)*scale,scale+.1,scale+.1);}}ctx.restore();}
