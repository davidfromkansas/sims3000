// Original authored Building Architect props. Dimensions are model units, not original-game measurements.
export const PROP_CATEGORIES=['Architecture','Building Decoration','Plaza and Streets','Yard Objects','Flora','Vehicles','Industrial','Rooftops'];
export const BUILDING_PROPS={
 tree:{name:'Garden tree',category:'Flora'},car:{name:'Parked car',category:'Vehicles'},
 arch:{name:'Garden arch',category:'Architecture'},column:{name:'Stone column',category:'Architecture'},
 clock:{name:'Freestanding clock',category:'Building Decoration'},
 bench:{name:'Park bench',category:'Plaza and Streets'},lamp:{name:'Street lamp',category:'Plaza and Streets'},
 picnic:{name:'Picnic table',category:'Yard Objects'},
 wagon:{name:'Family station wagon',category:'Vehicles'},pickup:{name:'Blue pickup truck',category:'Vehicles'},
 tank:{name:'Storage tank',category:'Industrial'},cooler:{name:'Ventilation unit',category:'Rooftops'}
};
export function propModelGeometry(kind){
 const faces=[];
 const face=(points,color)=>faces.push({points,color});
 const box=(x,y,z,w,d,h,color)=>{const p=[[x-w/2,y-d/2,z],[x+w/2,y-d/2,z],[x+w/2,y+d/2,z],[x-w/2,y+d/2,z]],q=p.map(([a,b])=>[a,b,z+h]);for(let i=0;i<4;i++)face([p[i],p[(i+1)%4],q[(i+1)%4],q[i]],color);face(q,color);};
 const cylinder=(x,y,z,r,h,color,n=16)=>{const p=Array.from({length:n},(_,i)=>[x+Math.cos(i*Math.PI*2/n)*r,y+Math.sin(i*Math.PI*2/n)*r,z]),q=p.map(([a,b])=>[a,b,z+h]);for(let i=0;i<n;i++)face([p[i],p[(i+1)%n],q[(i+1)%n],q[i]],color);face(q,color);};
 const wheels=(length=.15,width=.072)=>{for(const x of [-length*.33,length*.33])for(const y of [-width/2,width/2])box(x,y,.009,.03,.014,.03,'#303b3f');};
 const lights=(x,width)=>{for(const y of [-width*.3,width*.3]){box(x,y,.04,.004,.018,.013,'#f3dea3');box(-x,y,.04,.004,.018,.013,'#b34438');}};
 if(kind==='car'){
  box(0,0,.025,.15,.072,.035,'#477f98');box(-.012,0,.06,.075,.06,.035,'#b1ccd0');box(-.01,0,.095,.045,.062,.008,'#487b91');wheels();lights(.077,.072);
 }else if(kind==='wagon'){
  box(0,0,.025,.195,.078,.038,'#bdab78');box(-.026,0,.063,.13,.069,.043,'#b5d0d4');box(-.026,0,.106,.13,.071,.008,'#a69972');
  for(const x of [-.076,-.028,.027])box(x,0,.066,.007,.072,.04,'#b5a478');
  for(const y of [-.027,.027])box(-.032,y,.115,.097,.006,.007,'#535c5b');wheels(.195,.078);lights(.099,.078);
 }else if(kind==='pickup'){
  box(0,0,.025,.195,.083,.039,'#357caa');box(.022,0,.064,.067,.07,.044,'#adccd4');box(.022,0,.108,.07,.078,.007,'#357caa');
  box(-.059,0,.065,.075,.069,.004,'#354f60');for(const y of [-.038,.038])box(-.059,y,.064,.077,.008,.025,'#357caa');box(-.095,0,.064,.008,.077,.025,'#357caa');
  wheels(.195,.083);lights(.099,.083);
 }else if(kind==='tree'){
  box(0,0,0,.025,.025,.16,'#79634c');
  for(const [z,r,h] of [[.11,.085,.12],[.18,.066,.11],[.245,.043,.09]]){const ring=Array.from({length:10},(_,i)=>[Math.cos(i*Math.PI/5)*r,Math.sin(i*Math.PI/5)*r,z]),tip=[0,0,z+h];for(let i=0;i<10;i++)face([ring[i],ring[(i+1)%10],tip],['#557a54','#63885b','#729466','#5b8056'][i%4]);}
 }else if(kind==='arch'){
  for(const x of [-.11,.11]){box(x,0,0,.065,.08,.025,'#9b9586');box(x,0,.025,.045,.06,.19,'#d2c6a8');}
  const inner=.0875,outer=.1325,base=.215;
  for(let i=0;i<12;i++){const a=i*Math.PI/12,b=(i+1)*Math.PI/12,ring=y=>[[Math.cos(a)*inner,y,base+Math.sin(a)*inner],[Math.cos(a)*outer,y,base+Math.sin(a)*outer],[Math.cos(b)*outer,y,base+Math.sin(b)*outer],[Math.cos(b)*inner,y,base+Math.sin(b)*inner]],p=ring(-.03),q=ring(.03),color=i%2?'#c9bfa5':'#d9ccb0';face(p,color);face([...q].reverse(),color);for(const [j,k] of [[0,1],[1,2],[2,3],[3,0]])face([p[j],q[j],q[k],p[k]],color);}
 }else if(kind==='column'){
  box(0,0,0,.095,.095,.02,'#aba899');cylinder(0,0,.02,.034,.24,'#d2cdbb');box(0,0,.26,.09,.09,.023,'#e0d9c6');box(0,0,.283,.105,.105,.012,'#b8b4a5');
 }else if(kind==='clock'){
  box(0,0,0,.075,.06,.018,'#566966');box(0,0,.018,.019,.019,.22,'#496361');box(0,0,.238,.092,.035,.096,'#496361');
  for(const sign of [-1,1]){box(0,sign*.019,.247,.075,.003,.078,'#e1d9bc');box(0,sign*.021,.279,.004,.003,.033,'#384d4d');box(.014,sign*.021,.279,.032,.003,.004,'#384d4d');}
  box(0,0,.334,.103,.048,.012,'#73867d');
 }else if(kind==='bench'){
  for(const x of [-.075,.075]){box(x,0,0,.014,.085,.075,'#425955');box(x,.036,.06,.014,.014,.07,'#425955');}
  for(const y of [-.025,0,.025])box(0,y,.075,.2,.02,.013,'#a98254');for(const z of [.098,.124])box(0,.039,z,.2,.012,.021,'#a98254');
 }else if(kind==='lamp'){
  box(0,0,0,.05,.05,.014,'#556660');cylinder(0,0,.014,.009,.27,'#4a635d',10);box(.025,0,.28,.06,.014,.012,'#4a635d');box(.052,0,.272,.044,.032,.012,'#e0d7a7');box(.052,0,.284,.05,.039,.009,'#587169');
 }else if(kind==='picnic'){
  for(const x of [-.06,.06]){for(const y of [-.025,.025])box(x,y,0,.014,.014,.1,'#695b46');box(x,0,.025,.015,.16,.012,'#695b46');}
  for(const y of [-.026,0,.026])box(0,y,.1,.21,.024,.012,'#b39163');for(const y of [-.073,.073])box(0,y,.049,.21,.032,.012,'#b39163');
 }else if(kind==='tank'){
  for(const x of [-.047,.047])for(const y of [-.047,.047])box(x,y,0,.019,.019,.035,'#676e69');cylinder(0,0,.035,.077,.185,'#b6bcb8',20);cylinder(0,0,.045,.08,.009,'#6d827f',20);cylinder(0,0,.195,.08,.009,'#6d827f',20);cylinder(0,0,.22,.025,.009,'#778f8b');
  for(const x of [-.02,.02])box(x,.084,.03,.005,.005,.2,'#737c77');for(let z=.046;z<.23;z+=.023)box(0,.084,z,.045,.005,.004,'#737c77');
 }else if(kind==='cooler'){
  for(const x of [-.065,.065])box(x,0,0,.014,.115,.014,'#5b6968');box(0,0,.014,.18,.11,.064,'#b1b8b0');cylinder(-.04,0,.078,.033,.004,'#485d60',16);cylinder(.04,0,.078,.033,.004,'#485d60',16);
  for(const x of [-.04,.04]){box(x,0,.083,.052,.006,.002,'#97aaa6');box(x,0,.083,.006,.052,.002,'#97aaa6');}for(let z=.025;z<.073;z+=.01)box(0,-.056,z,.147,.002,.003,'#617776');
 }else throw Error('Unknown building prop.');
 return faces;
}

// One world-space light keeps walls, roofs and independently turned props coherent.
export function shadePropFaces(faces){return faces.map(face=>{
 const [a,b,c]=face.points,u=b.map((v,i)=>v-a[i]),v=c.map((x,i)=>x-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],length=Math.hypot(...n)||1;
 const light=.72+.28*Math.max(0,(-.45*n[0]-.65*n[1]+.61*n[2])/length);
 const color='#'+face.color.slice(1).match(/../g).map(ch=>Math.round(parseInt(ch,16)*light).toString(16).padStart(2,'0')).join('');
 return {...face,color};
});}
