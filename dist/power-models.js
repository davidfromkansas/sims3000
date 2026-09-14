import {projectMiniature,rasterizeMiniature} from './miniature-raster.js?v=room-to-grow-1';
export const MODELED_POWER=new Set(['coal','oil','gas','nuclear','wind','solar','microwave','fusion']);
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
export function powerGeometry(type,includeRotor=true){
 if(!MODELED_POWER.has(type))throw Error('Unknown power model.');
 const faces=[],add=(points,color)=>faces.push({points,color});
 const box=(x,y,z,w,d,h,color)=>{const a=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],b=a.map(([xx,yy])=>[xx,yy,z+h]);for(let i=0;i<4;i++)add([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],shade(color,[.72,.84,.96,.78][i]));add(b,shade(color,1.06));};
 const ring=(x,y,z,r)=>Array.from({length:24},(_,i)=>[x+Math.cos(i*Math.PI/12)*r,y+Math.sin(i*Math.PI/12)*r,z]);
 const vessel=(x,y,profile,color,cap=true)=>{for(let j=1;j<profile.length;j++){const a=ring(x,y,...profile[j-1]),b=ring(x,y,...profile[j]);for(let i=0;i<24;i++)add([a[i],a[(i+1)%24],b[(i+1)%24],b[i]],shade(color,.74+.2*(1+Math.sin(i*Math.PI/12))/2));}if(cap)add(ring(x,y,...profile.at(-1)),shade(color,1.06));};
 const tank=(x,y,z,r,h,color)=>vessel(x,y,[[z,r],[z+h,r]],color);
 const hall=(x,y,w,d,h,color)=>{box(x,y,.045,w,d,h,color);box(x,y,h+.045,w+.015,d+.015,.025,'#71858a');for(let i=0;i<5;i++)for(const side of [-1,1])box(x-w*.4+i*w*.2,y+side*(d/2+.003),.12,.04,.008,.075,'#476a7b');};
 const stack=(x,y,h)=>{vessel(x,y,[[.06,.047],[h,.035]],'#b7b8a2');tank(x,y,h*.70,.039,.05,'#a5725b');tank(x,y,h,.034,.009,'#454e51');};
 const substation=(x,y)=>{box(x,y,.045,.25,.17,.035,'#b6bca4');for(const xx of [x-.07,x+.07]){box(xx,y,.08,.045,.09,.065,'#809d9c');for(let i=0;i<3;i++)tank(xx,y-.035+i*.035,.145,.009,.048,'#c3c8ae');}};
 box(0,0,0,.97,.97,.035,'#b7b8a1');box(0,0,.035,.94,.94,.010,'#939f8b');box(0,.34,.045,.91,.20,.005,'#babaa5');
 if(type==='coal'){
  hall(-.10,-.05,.57,.52,.32,'#b08b72');box(-.10,-.05,.39,.59,.54,.027,'#66777d');for(const x of [.18,.34])stack(x,-.24,.79);
  box(-.12,.32,.053,.47,.16,.045,'#565e58');for(let i=0;i<5;i++)vessel(-.31+i*.095,.32,[[.09,.052],[.16,.013]],'#3f4a49');substation(.29,.22);
 }else if(type==='oil'){
  hall(.17,-.14,.40,.47,.29,'#c5c5a8');for(const y of [-.25,.09])tank(-.25,y,.05,.15,.22,'#c3cbb9');for(const y of [-.25,.09])tank(-.25,y,.272,.153,.015,'#8fa9a4');stack(.31,-.26,.64);stack(.14,-.26,.52);substation(.18,.29);box(-.16,.29,.06,.27,.032,.032,'#aa946e');
 }else if(type==='gas'){
  hall(-.16,-.04,.43,.66,.23,'#b7c1b4');for(const y of [-.24,0,.24]){box(.20,y,.05,.27,.16,.13,'#859e9b');box(.20,y,.185,.23,.12,.017,'#c2d0bd');stack(.27,y,.46);}box(-.20,-.04,.31,.34,.53,.032,'#6e8e98');
 }else if(type==='nuclear'){
  for(const x of [-.23,.22]){vessel(x,-.18,[[.05,.17],[.16,.145],[.40,.102],[.61,.133]],'#c4cbb9',false);const rim=ring(x,-.18,.613,.133),inner=ring(x,-.18,.613,.112);for(let i=0;i<24;i++)add([rim[i],rim[(i+1)%24],inner[(i+1)%24],inner[i]],'#dbddc4');add(ring(x,-.18,.600,.112),'#526c6c');}
  hall(0,.23,.64,.29,.18,'#adbcae');substation(.34,.27);
 }else if(type==='wind'){
  tank(0,0,.045,.12,.045,'#c7c7af');vessel(0,0,[[.09,.038],[.79,.019]],'#c7d1bd');box(0,0,.76,.10,.16,.075,'#a4bdb2');
  if(includeRotor)for(const points of windRotorGeometry(0)){add(points,'#dce1c9');add([...points].reverse(),'#bdcfc1');}box(0,-.09,.775,.045,.038,.045,'#a7bbb3');hall(-.23,.25,.20,.18,.12,'#a2ae96');
 }else if(type==='solar'){
  for(let row=0;row<3;row++)for(let col=0;col<4;col++){const x=-.32+col*.21,y=-.30+row*.23;box(x,y,.05,.025,.10,.055,'#adb69e');const p=[[x-.085,y-.08,.13],[x+.085,y-.08,.13],[x+.085,y+.08,.09],[x-.085,y+.08,.09]];add(p,'#466c88');add([...p].reverse(),'#758b8a');for(let k=1;k<3;k++){const xx=x-.085+k*.17/3;add([[xx-.002,y-.08,.131],[xx+.002,y-.08,.131],[xx+.002,y+.08,.091],[xx-.002,y+.08,.091]],'#9eb7bb');}add([[x-.085,y-.002,.1106],[x+.085,y-.002,.1106],[x+.085,y+.002,.1096],[x-.085,y+.002,.1096]],'#9eb7bb');}
  hall(.23,.34,.34,.18,.12,'#b1bca8');
 }else if(type==='microwave'){
  tank(-.09,-.09,.045,.24,.06,'#a0b1a5');box(-.09,-.09,.10,.055,.055,.28,'#bcc9ba');vessel(-.09,-.09,[[.38,.025],[.43,.14],[.57,.33]],'#adc4bc',false);const rings=[ring(-.09,-.09,.405,.02),ring(-.09,-.09,.455,.15),ring(-.09,-.09,.575,.33)];add(rings[0],'#b2c8bb');for(let j=1;j<rings.length;j++)for(let i=0;i<24;i++)add([rings[j-1][i],rings[j][i],rings[j][(i+1)%24],rings[j-1][(i+1)%24]],j===1?'#bfd0bf':'#d3ddc8');box(-.09,-.09,.57,.018,.018,.17,'#72989e');tank(-.09,-.09,.74,.04,.03,'#c5d3bd');hall(.22,.30,.40,.23,.17,'#a5b8a9');substation(.30,-.29);
 }else{
  vessel(-.08,-.06,[[.05,.30],[.24,.30],[.38,.24],[.49,.12],[.52,.02]],'#afc8bc');tank(-.08,-.06,.25,.303,.04,'#608e99');for(const x of [-.38,.30]){box(x,-.06,.06,.07,.34,.25,'#71999b');box(x,-.06,.31,.08,.36,.025,'#cad7be');}hall(.08,.33,.55,.20,.18,'#a7bca8');substation(.31,-.31);
 }
 return faces;
}
export const rasterizePower=(type,rotation=0)=>rasterizeMiniature(powerGeometry(type),rotation);
// Continuous rigid rotation, independent of electricity output. The existing
// simulation-held scenery clock controls pause, dialogs and background tabs.
export const WIND_REVOLUTION_SECONDS=8;
export function windRotorGeometry(time){const angle=(time%WIND_REVOLUTION_SECONDS)*Math.PI*2/WIND_REVOLUTION_SECONDS;return Array.from({length:3},(_,blade)=>{const a=angle+blade*2*Math.PI/3;return [[.035,-.02],[.13,-.025],[.32,0],[.30,.023],[.09,.03]].map(([r,t])=>[Math.sin(a)*r+Math.cos(a)*t,-.086,.80+Math.cos(a)*r-Math.sin(a)*t]);});}
export const windSceneryTime=(renderer,root)=>renderer.preferences?.sceneryAnimations!==false&&renderer.layer==='city'&&!renderer.reducedMotion.matches&&!root.fire&&!root.rubble&&!root.radiation?renderer.vehicleTime:null;
export function drawWindRotor(ctx,rotation,x,y,width,time){for(const points of windRotorGeometry(time)){const p=points.map(v=>projectMiniature(v,rotation)),area=p.reduce((sum,v,i)=>{const q=p[(i+1)%p.length];return sum+v[0]*q[1]-q[0]*v[1];},0);ctx.fillStyle=area>0?'#dce1c9':'#bdcfc1';ctx.beginPath();for(let i=0;i<p.length;i++){const xx=x+(p[i][0]-256)*width/512,yy=y+(p[i][1]-320)*width/512;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.closePath();ctx.fill();}}
const cache=new Map();
export function drawCityPower(ctx,type,rotation,x,y,width,alpha=1,time=null){const moving=type==='wind'&&Number.isFinite(time),key=type+':'+rotation+(moving?':base':'');let canvas=cache.get(key);if(!canvas){canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const c=canvas.getContext('2d'),raster=rasterizeMiniature(powerGeometry(type,!moving),rotation),image=c.createImageData(512,512);image.data.set(raster.data);c.putImageData(image,0,0);cache.set(key,canvas);}ctx.save();ctx.globalAlpha=alpha;
 // Rotor plane lies behind the nacelle/tower in views 0 and 3 and in front
 // in views 1 and 2. No animated bitmap frames or per-frame depth buffers.
 const behind=rotation===0||rotation===3;if(moving&&behind)drawWindRotor(ctx,rotation,x,y,width,time);ctx.drawImage(canvas,x-width/2,y-320*width/512,width,width);if(moving&&!behind)drawWindRotor(ctx,rotation,x,y,width,time);ctx.restore();}
