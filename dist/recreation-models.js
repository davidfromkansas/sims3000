// Original miniature scenery, modeled in footprint-relative coordinates.
export const MODELED_RECREATION=new Set(['fountain','playground','sportsPark','largePark','pond','marina','zoo']);
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.max(0,Math.min(255,Math.round(parseInt(v,16)*f))).toString(16).padStart(2,'0')).join('');
export function recreationGeometry(type){
 if(!MODELED_RECREATION.has(type))throw Error('Unknown recreation model.');
 const faces=[],add=(points,color)=>faces.push({points,color});
 const box=(x,y,z,w,d,h,color)=>{const a=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],b=a.map(([xx,yy])=>[xx,yy,z+h]);for(let i=0;i<4;i++)add([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],shade(color,[.72,.84,.96,.78][i]));add(b,shade(color,1.06));};
 const ring=(x,y,z,r,h,top,color,n=20)=>{const a=Array.from({length:n},(_,i)=>{const angle=i/n*Math.PI*2;return[x+Math.cos(angle)*r,y+Math.sin(angle)*r,z];}),b=a.map(([xx,yy])=>[x+(xx-x)*top/r,y+(yy-y)*top/r,z+h]);for(let i=0;i<n;i++)add([a[i],a[(i+1)%n],b[(i+1)%n],b[i]],shade(color,.72+.22*(i/n)));add(b,shade(color,1.08));};
 const beam=(a,b,r,color)=>{const delta=b.map((v,i)=>v-a[i]),len=Math.hypot(...delta),u=delta.map(v=>v/len),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],v=cross(u,Math.abs(u[2])>.9?[1,0,0]:[0,0,1]),vl=Math.hypot(...v),p=v.map(n=>n/vl),q=cross(u,p),rim=c=>Array.from({length:6},(_,i)=>c.map((n,j)=>n+r*(p[j]*Math.cos(i*Math.PI/3)+q[j]*Math.sin(i*Math.PI/3)))),aa=rim(a),bb=rim(b);for(let i=0;i<6;i++)add([aa[i],aa[(i+1)%6],bb[(i+1)%6],bb[i]],shade(color,.75+i*.04));add(bb,color);};
 const tree=(x,y,height=.28)=>{ring(x,y,.04,.012,height*.5,.009,'#827356',8);ring(x,y,.04+height*.2,.08,height*.45,.07,'#49795b',10);ring(x,y,.04+height*.55,.07,height*.4,.006,'#69986b',10);};
 const bench=(x,y,turn=false)=>{for(const offset of [-.055,.055])box(x+(turn?0:offset),y+(turn?offset:0),.04,.012,.012,.055,'#536865');box(x,y,.095,turn?.045:.15,turn?.15:.045,.014,'#bd956b');box(x+(turn?.019:0),y+(turn?0:.019),.11,turn?.009:.15,turn?.15:.009,.06,'#c7a377');};
 box(0,0,0,.97,.97,.03,'#b2ad98');box(0,0,.03,.92,.92,.012,type==='fountain'?'#ccc7b5':'#799563');
 if(type==='fountain'){
  for(let i=-2;i<=2;i++){box(i*.18,0,.042,.006,.9,.001,'#aaa997');box(0,i*.18,.042,.9,.006,.001,'#aaa997');}
  ring(0,0,.045,.37,.045,.37,'#aaa58f',32);ring(0,0,.09,.335,.05,.335,'#d7cfb5',32);ring(0,0,.14,.295,.008,.295,'#529d9e',32);
  ring(0,0,.148,.10,.12,.085,'#ddd3b4');ring(0,0,.268,.18,.045,.195,'#c7c1a7');ring(0,0,.313,.168,.005,.168,'#68b3b2');ring(0,0,.318,.038,.18,.025,'#d3cfb7');ring(0,0,.498,.07,.025,.08,'#dfd8bf');ring(0,0,.523,.064,.004,.064,'#89c7c3');
  for(const x of [-.38,.38])for(const y of [-.38,.38]){box(x,y,.045,.1,.1,.055,'#baab8c');ring(x,y,.10,.043,.055,.033,'#57836c',10);}
  bench(-.39,0,true);bench(.39,0,true);
 }else if(type==='playground'){
  box(-.12,-.02,.045,.58,.68,.012,'#c2ae83');box(.23,.17,.045,.25,.38,.01,'#799bad');
  // Climbing tower, covered platform and a curved-slide approximation.
  for(const x of [-.23,-.03])for(const y of [-.22,-.02])box(x,y,.055,.02,.02,.34,'#c9aa6c');
  box(-.13,-.12,.265,.24,.24,.025,'#c7a267');ring(-.13,-.12,.40,.19,.14,.002,'#b76d57',4);
  for(let i=0;i<5;i++){const z=.075+i*.041;beam([-.255,-.22,z],[-.255,-.02,z],.008,'#bd8d5e');}
  beam([-.255,-.22,.06],[-.255,-.22,.29],.009,'#b99c69');beam([-.255,-.02,.06],[-.255,-.02,.29],.009,'#b99c69');
  for(let i=0;i<8;i++){const y=.02+i*.035,next=y+.035,z=.28-Math.sin(i/8*Math.PI/2)*.21,zz=.28-Math.sin((i+1)/8*Math.PI/2)*.21;add([[-.19,y,z],[-.07,y,z],[-.07,next,zz],[-.19,next,zz]],'#79bfc3');for(const x of [-.195,-.065])beam([x,y,z+.02],[x,next,zz+.02],.008,'#c4dad2');}
  // Two swings hang below a crossbar; the static pose remains clear when paused.
  for(const x of [.15,.35])for(const y of [-.32,-.10])beam([x,y,.05],[x,-.21,.33],.011,'#70928a');
  beam([.12,-.21,.33],[.38,-.21,.33],.013,'#d1b677');
  for(const x of [.20,.30]){for(const dx of [-.025,.025])beam([x+dx,-.21,.32],[x+dx,-.21,.12],.003,'#58676a');box(x,-.21,.11,.075,.05,.015,'#a16e5a');}
  box(.24,.2,.06,.16,.25,.018,'#d4b98e');box(.24,.2,.078,.13,.22,.003,'#e3cd9d');
  tree(-.36,.34);tree(.36,.36,.34);bench(0,.4);
 }else if(type==='sportsPark'){
  // Playing field with alternating mowing strips and complete painted markings.
  box(-.08,-.07,.045,.62,.64,.005,'#51886b');for(let i=0;i<8;i++)box(-.08,-.35+i*.08,.051,.60,.076,.001,i%2?'#5e936f':'#54896a');
  for(const x of [-.38,.22])box(x,-.07,.053,.005,.62,.002,'#d9e2c2');for(const y of [-.38,.24,-.07])box(-.08,y,.053,.60,.005,.002,'#d9e2c2');
  for(let i=0;i<32;i++){const a=i*Math.PI/16,b=(i+1)*Math.PI/16;beam([-.08+Math.cos(a)*.075,-.07+Math.sin(a)*.075,.055],[-.08+Math.cos(b)*.075,-.07+Math.sin(b)*.075,.055],.0025,'#d9e2c2');}
  for(const y of [-.37,.23]){for(const x of [-.17,.01])beam([x,y,.055],[x,y,.14],.004,'#ede4c8');beam([-.17,y,.14],[.01,y,.14],.004,'#ede4c8');for(let i=0;i<7;i++)beam([-.17+i*.03,y,.055],[-.17+i*.03,y,.14],.0015,'#cbd2b9');}
  for(let i=0;i<3;i++)box(.33,-.13+i*.13,.045,.18,.105,.03+i*.018,'#929c93');
  for(const x of [-.35,.35]){beam([x,.37,.045],[x,.37,.38],.008,'#6f817e');box(x,.37,.38,.10,.022,.03,'#c9d4bd');}
  box(0,.35,.045,.43,.12,.10,'#c8ba97');box(0,.35,.145,.47,.15,.025,'#6c8d86');for(const x of [-.13,0,.13])box(x,.284,.08,.07,.005,.047,'#527978');
  tree(-.41,.39,.26);bench(.25,.4);
 }

 if(type==='largePark'){
  // Crossing walks, flower beds and a shaded picnic pavilion.
  box(0,0,.045,.13,.91,.006,'#d2c3a0');box(0,0,.045,.91,.13,.006,'#d2c3a0');
  ring(0,0,.051,.16,.008,.16,'#ded1b0',24);
  for(const x of [-.30,.30])for(const y of [-.30,.30]){
   tree(x,y,.26+(x+y+.6)*.08);tree(x*.64,y*1.20,.23);
  }
  for(const x of [-.23,.23]){box(x,.15,.049,.17,.06,.025,'#b5a38a');for(let i=0;i<5;i++)ring(x-.065+i*.033,.15,.074,.016,.016,.01,i%2?'#dbb55d':'#bc7185',6);}
  for(const x of [-.10,.10])for(const y of [-.34,-.16])box(x,y,.051,.014,.014,.19,'#b0a37e');
  box(0,-.25,.23,.25,.23,.015,'#d6c19a');ring(0,-.25,.245,.18,.13,.005,'#728c78',4);
  box(0,-.25,.10,.14,.08,.014,'#bca37b');bench(-.17,.02,true);bench(.17,.02,true);bench(.02,.30);
 }else if(type==='pond'){
  // Low stone edging follows an irregular, planted waterline.
  const outline=Array.from({length:32},(_,i)=>{const a=i/32*Math.PI*2,r=.30+.035*Math.sin(a*3);return[Math.cos(a)*r,Math.sin(a)*r,.055];});
  add(outline,'#aaa78f');add(outline.map(([x,y])=>[x*.91,y*.91,.058]),'#639f9e');
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,r=.30+.035*Math.sin(a*3);ring(Math.cos(a)*r,Math.sin(a)*r,.056,.022,.016,.018,'#c0bba2',6);}
  for(const [x,y] of [[-.13,-.12],[.12,.09],[.08,.17]]){ring(x,y,.060,.029,.002,.029,'#72976c',10);ring(x+.006,y,.063,.009,.009,.004,'#e2cbb1',6);}
  for(const [x,y] of [[-.26,.18],[-.28,.13],[.20,-.25]])for(let i=0;i<5;i++){const xx=x+(i-2)*.012;beam([xx,y,.06],[xx+.018,y+.01,.13+i%2*.02],.003,'#658264');}
  box(.30,.02,.044,.13,.30,.007,'#c7bc9f');bench(.32,.01,true);tree(-.32,-.31,.25);tree(.30,.34,.24);
 }else if(type==='marina'){
  // A miniature sheltered basin; surrounding city water still controls placement.
  box(-.03,.04,.045,.80,.77,.005,'#559397');box(0,-.35,.052,.89,.16,.008,'#c7ba99');
  box(-.33,.01,.052,.09,.67,.014,'#b79b76');box(.33,.01,.052,.09,.67,.014,'#b79b76');box(0,-.18,.052,.66,.065,.014,'#b79b76');
  for(const x of [-.15,.15])box(x,.045,.052,.045,.45,.014,'#b79b76');
  for(const x of [-.35,-.15,.15,.35])for(const y of [-.17,.24])ring(x,y,.052,.009,.045,.009,'#e1d4b1',6);
  for(const [x,y,color] of [[-.23,.03,'#d3d3be'],[-.07,.13,'#c7d5cf'],[.07,.02,'#c9b59c'],[.23,.17,'#cad0bb']]){
   const hull=[[x-.032,y-.07,.062],[x+.032,y-.07,.062],[x+.038,y+.03,.062],[x,y+.09,.062],[x-.038,y+.03,.062]];
   add(hull,color);box(x,y-.015,.065,.045,.065,.022,'#738c87');beam([x,y,.07],[x,y,.29],.0025,'#bfcbbd');
   add([[x,y,.285],[x,y+.07,.10],[x,y,.10]],'#eee4c8');add([[x,y,.10],[x,y+.07,.10],[x,y,.285]],'#ddd3b7');
  }
  box(-.18,-.35,.06,.24,.12,.12,'#d5c19c');box(-.18,-.35,.18,.27,.15,.02,'#6d8782');for(const x of [-.25,-.17])box(x,-.285,.10,.045,.005,.04,'#5c7e82');
  bench(.18,-.35);tree(.38,-.37,.21);
 }else if(type==='zoo'){
  // Distinct habitats and entrance pavilion make the footprint readable in all views.
  box(0,0,.045,.12,.88,.005,'#c6b793');box(0,.22,.045,.88,.10,.005,'#c6b793');
  const fence=(x,y,w,d)=>{for(const yy of [y-d/2,y+d/2]){beam([x-w/2,yy,.10],[x+w/2,yy,.10],.005,'#8d927d');for(let i=0;i<=6;i++)box(x-w/2+i*w/6,yy,.05,.008,.008,.085,'#7e8878');}for(const xx of [x-w/2,x+w/2]){beam([xx,y-d/2,.10],[xx,y+d/2,.10],.005,'#8d927d');for(let i=0;i<=6;i++)box(xx,y-d/2+i*d/6,.05,.008,.008,.085,'#7e8878');}};
  box(-.25,-.13,.051,.33,.49,.003,'#bdab7f');fence(-.25,-.13,.33,.49);
  box(.25,-.13,.051,.33,.49,.003,'#72916f');fence(.25,-.13,.33,.49);ring(.27,-.23,.055,.095,.002,.085,'#689c9b',16);
  // Low-poly animals, sized for the miniature habitats rather than city traffic.
  for(const [x,y] of [[-.28,-.24],[-.20,-.02]]){for(const dx of [-.028,.028])for(const dy of [-.025,.025])box(x+dx,y+dy,.055,.012,.012,.052,'#b29263');box(x,y,.105,.085,.07,.043,'#c2a274');box(x+.025,y-.03,.14,.022,.025,.105,'#c2a274');box(x+.025,y-.044,.245,.036,.048,.026,'#ccb282');}
  box(.22,.02,.074,.11,.065,.055,'#9a9e92');for(const dx of [-.035,.035])for(const dy of [-.02,.02])box(.22+dx,.02+dy,.055,.018,.018,.025,'#898f88');ring(.29,.015,.08,.025,.045,.026,'#9ba095',8);beam([.315,.015,.095],[.33,.015,.062],.009,'#969b90');
  for(const x of [-.30,.30]){tree(x,.34,.25);tree(x,-.36,.25);}
  box(0,.36,.052,.26,.14,.12,'#c5b591');box(0,.36,.172,.30,.18,.025,'#73876b');box(0,.283,.06,.07,.005,.09,'#617568');bench(-.22,.22);bench(.22,.22);
 }

 return faces;
}
export function projectRecreation(point,rotation=0){let [x,y,z]=point;[x,y]=rotation===0?[x,y]:rotation===1?[-y,x]:rotation===2?[-x,-y]:[y,-x];return[256+(x-y)*230,320+(x+y)*115-z*230];}
export function recreationFaces(type,rotation=0){
 const turn=([x,y,z])=>rotation===0?[x,y,z]:rotation===1?[-y,x,z]:rotation===2?[-x,-y,z]:[y,-x,z];
 return recreationGeometry(type).map(f=>({...f,world:f.points.map(turn),height:Math.max(...f.points.map(p=>p[2]))})).sort((a,b)=>{const ag=a.height<=.06,bg=b.height<=.06;if(ag!==bg)return ag?-1:1;if(ag&&bg)return a.height-b.height;return a.world.reduce((n,p)=>n+p[0]+p[1]+2*p[2],0)/a.world.length-b.world.reduce((n,p)=>n+p[0]+p[1]+2*p[2],0)/b.world.length;}).map(f=>({color:f.color,points:f.points.map(p=>projectRecreation(p,rotation))})).filter(f=>f.points.reduce((sum,p,i)=>{const q=f.points[(i+1)%f.points.length];return sum+p[0]*q[1]-q[0]*p[1];},0)>0);
}
export function drawRecreationModel(ctx,type,rotation){for(const f of recreationFaces(type,rotation)){ctx.beginPath();f.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();}}
export function fountainStreams(time=0,active=true){if(!active)return[];return Array.from({length:8},(_,i)=>{const angle=i*Math.PI/4,point=t=>[Math.cos(angle)*.27*t,Math.sin(angle)*.27*t,.527+.23*Math.sin(Math.PI*t)-.37*t];return{points:Array.from({length:17},(_,j)=>point(j/16)),droplet:point((time*.65+i/8)%1)};});}
const cache=new Map();
export function drawCityRecreation(ctx,type,rotation,x,y,width,alpha=1,time=0,active=true){const key=type+':'+rotation;let canvas=cache.get(key);if(!canvas){canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;drawRecreationModel(canvas.getContext('2d'),type,rotation);cache.set(key,canvas);}ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(canvas,x-width/2,y-320*width/512,width,width);
 if(type==='fountain'&&active){const project=p=>{const [xx,yy]=projectRecreation(p,rotation);return[x+(xx-256)*width/512,y+(yy-320)*width/512];};ctx.strokeStyle='#b4e7df';ctx.lineWidth=Math.max(.7,width*.003);ctx.lineCap='round';for(const stream of fountainStreams(time)){ctx.beginPath();stream.points.map(project).forEach(([xx,yy],i)=>i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy));ctx.stroke();const [xx,yy]=project(stream.droplet);ctx.fillStyle='#effff4';ctx.beginPath();ctx.arc(xx,yy,Math.max(.6,width*.0035),0,Math.PI*2);ctx.fill();}}
 ctx.restore();
}
