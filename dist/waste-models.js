import {rasterizeMiniature,projectMiniature} from './miniature-raster.js?v=economic-cap-1';
export const MODELED_WASTE=new Set(['recycling','incinerator','wasteEnergy']);
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
export function wasteGeometry(type){
 if(!MODELED_WASTE.has(type))throw Error('Unknown waste facility model.');
 const faces=[],add=(points,color)=>faces.push({points,color});
 const box=(x,y,z,w,d,h,color)=>{const a=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],b=a.map(([xx,yy])=>[xx,yy,z+h]);for(let i=0;i<4;i++)add([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],shade(color,[.72,.84,.96,.78][i]));add(b,shade(color,1.06));};
 const ring=(x,y,z,r)=>Array.from({length:20},(_,i)=>[x+Math.cos(i*Math.PI/10)*r,y+Math.sin(i*Math.PI/10)*r,z]);
 const cylinder=(x,y,z,r,h,color,open=false)=>{const a=ring(x,y,z,r),b=ring(x,y,z+h,r);for(let i=0;i<20;i++)add([a[i],a[(i+1)%20],b[(i+1)%20],b[i]],shade(color,.72+.22*(1+Math.sin(i*Math.PI/10))*.5));if(open){const inner=ring(x,y,z+h,r*.67);for(let i=0;i<20;i++)add([b[i],b[(i+1)%20],inner[(i+1)%20],inner[i]],shade(color,1.12));add(ring(x,y,z+h-.012,r*.67),'#394443');}else add(b,shade(color,1.06));};
 const hall=(x,y,w,d,h,color,roof)=>{box(x,y,.055,w,d,h,color);box(x,y,h+.055,w+.024,d+.024,.026,roof);for(const side of [-1,1])for(let i=0;i<4;i++)box(x-w*.35+i*w*.23,y+side*(d/2+.004),h*.55,.042,.009,.07,'#5e8188');};
 const doors=(x,y,count)=>{for(let i=0;i<count;i++){const xx=x+i*.13;box(xx,y,.058,.10,.012,.14,'#475b60');for(let k=0;k<5;k++)box(xx,y+.008,.074+k*.024,.086,.008,.005,'#96aaa4');box(xx-.057,y+.02,.058,.012,.018,.075,'#d3ae5b');box(xx+.057,y+.02,.058,.012,.018,.075,'#d3ae5b');}};
 const stack=(x,y,z,h,r)=>{for(let i=0;i<8;i++)cylinder(x,y,z+i*h/8,r*(1-i*.025),h/8,i%2?'#c4c1ae':'#b06d58',i===7);};
 box(0,0,0,.97,.97,.04,'#a9ac98');box(0,0,.04,.93,.93,.013,'#818b83');box(0,.34,.055,.88,.20,.004,'#a5a799');
 for(const x of [-.39,.39])for(const y of [-.34,.34])box(x,y,.058,.045,.018,.008,'#d0c8a3');
 if(type==='recycling'){
  hall(-.08,-.15,.66,.48,.25,'#a8b59a','#547f69');
  // Sawtooth roof lights remain readable from all four city orientations.
  for(const x of [-.30,-.10,.10]){const z=.332;add([[x-.08,-.39,z],[x+.08,-.39,z+.085],[x+.08,.09,z+.085],[x-.08,.09,z]],'#789b80');add([[x+.08,.09,z+.085],[x+.08,-.39,z+.085],[x+.08,-.39,z],[x+.08,.09,z]],'#b3d0be');add([[x-.08,-.39,z],[x+.08,-.39,z],[x+.08,-.39,z+.085]],'#65866d');add([[x-.08,.09,z],[x+.08,.09,z+.085],[x+.08,.09,z]],'#78977b');}
  doors(-.27,.10,3);
  for(const [i,color]of ['#698fbd','#a5b877','#c5a168'].entries()){box(-.28+i*.18,.34,.063,.12,.13,.12,color);box(-.28+i*.18,.34,.183,.13,.14,.018,shade(color,.78));}
  box(.33,-.02,.08,.12,.56,.13,'#718f81');box(.33,-.02,.21,.10,.54,.025,'#405b59');for(let i=0;i<8;i++)box(.33,-.24+i*.065,.237,.09,.012,.012,'#a9b8a4');
  for(const y of [-.29,.23])box(.33,y,.057,.018,.018,.15,'#b8b59d');box(.30,-.35,.055,.14,.13,.17,'#c1b58b');
 }else if(type==='incinerator'){
  hall(-.07,-.08,.57,.60,.40,'#b38b6d','#727d78');doors(-.23,.23,3);
  stack(-.25,-.25,.48,.55,.062);stack(.08,-.25,.48,.39,.048);
  hall(.33,-.13,.19,.37,.23,'#a7a48a','#8b968b');
  box(.27,.26,.058,.25,.14,.10,'#6f7c73');for(let i=0;i<5;i++)box(.18+i*.043,.26,.16,.013,.15,.009,'#beb9a0');
  for(const x of [-.29,-.17,-.05,.07]){box(x,-.10,.482,.07,.12,.028,'#a4aaa0');box(x,-.10,.511,.055,.09,.013,'#485c5c');}
  box(-.41,.08,.055,.025,.52,.18,'#90866d');for(const y of [-.10,.10,.28])box(-.40,y,.055,.02,.018,.21,'#c4bda3');
 }else{
  hall(-.13,-.17,.50,.45,.44,'#9caeaa','#698b91');doors(-.27,.07,3);stack(-.22,-.25,.52,.49,.057);
  hall(.29,-.12,.24,.49,.29,'#bdc6b4','#718f91');for(const y of [-.28,-.16,-.04,.08])box(.29,y,.38,.17,.045,.04,'#d0d2b9');
  // Heat-recovery duct and a separate turbine/substation yard.
  box(.10,-.20,.42,.28,.052,.052,'#bd9c70');box(.20,-.20,.26,.045,.055,.18,'#bd9c70');
  for(const x of [-.25,-.04,.17]){box(x,.31,.055,.13,.20,.065,'#b9bca4');box(x,.31,.12,.11,.16,.09,'#739391');for(const xx of [x-.044,x,x+.044])box(xx,.31,.215,.018,.12,.018,'#c3c9b1');for(const yy of [.22,.40])cylinder(x,yy,.14,.018,.10,'#748b84');}
  box(.38,.30,.06,.045,.24,.13,'#7c927f');box(.38,.30,.19,.10,.018,.025,'#bcbca0');
 }
 return faces;
}
export const rasterizeWaste=(type,rotation=0)=>rasterizeMiniature(wasteGeometry(type),rotation);
const cache=new Map();
export function drawCityWaste(ctx,type,rotation,x,y,width,alpha=1,seconds=0,throughput=0){const key=type+':'+rotation;let canvas=cache.get(key);if(!canvas){canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const c=canvas.getContext('2d'),raster=rasterizeWaste(type,rotation),image=c.createImageData(512,512);image.data.set(raster.data);c.putImageData(image,0,0);cache.set(key,canvas);}ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(canvas,x-width/2,y-320*width/512,width,width);ctx.restore();for(const puff of wastePlumes(type,rotation,seconds,throughput)){ctx.save();ctx.globalAlpha=alpha*puff.alpha;ctx.fillStyle='#8c9692';ctx.beginPath();ctx.ellipse(x-width/2+puff.x*width/512,y-320*width/512+puff.y*width/512,puff.radius*width,puff.radius*width*.65,0,0,Math.PI*2);ctx.fill();ctx.restore();}}

export const wastePlumeOutput=(city,t)=>['incinerator','wasteEnergy'].includes(t.type)&&!t.fire&&!t.rubble&&!t.radiation&&t.roadIds?.length&&city.finance.roadCondition>20?t.burnedLastMonth||0:0;
// State indication on the existing paused world clock; linear eight-second cycle.
export function wastePlumes(type,rotation,seconds,throughput){
 if(!(throughput>0)||!['incinerator','wasteEnergy'].includes(type))return[];
 const tips=type==='incinerator'?[[-.25,-.25,1.03],[.08,-.25,.87]]:[[-.22,-.25,1.01]],out=[];
 for(let j=0;j<tips.length;j++)for(let k=0;k<5;k++){const phase=((seconds/8+k/5+j*.1)%1+1)%1,[x,y,z]=tips[j],point=projectMiniature([x+.16*phase,y+.06*phase,z+.38*phase],rotation);out.push({x:point[0],y:point[1],radius:.012+.030*phase,alpha:.22*Math.min(1,throughput/100)*Math.min(1,phase*10)*(1-phase)});}
 return out;
}
