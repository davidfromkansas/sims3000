// Original small-scale interpretations of the historic museum buildings.
// Ornament, proportions and lots are authored; later campus additions are omitted.
function dome(ring,x,y,z,r,h,color,sides=48){
 for(let i=0;i<14;i++){const a=i/14*Math.PI/2,b=(i+1)/14*Math.PI/2;ring(x,y,z+Math.sin(a)*h,Math.max(.001,Math.cos(a)*r),(Math.sin(b)-Math.sin(a))*h,Math.max(.001,Math.cos(b)*r),color,sides);}
}
export function adlerPlanetariumGeometry({box,ring,add}){
 const granite='#b18f89',trim='#d0b8a5',copper='#6c9d91';
 ring(0,0,.23,1.2,.09,1.2,trim,12);ring(0,0,.32,1.11,.54,1.11,granite,12);ring(0,0,.86,1.16,.07,1.16,trim,12);
 // Twelve-sided granite drum and its copper dome.
 for(let i=0;i<12;i++){
  const a=(i+.5)*Math.PI/6,n=[Math.cos(a),Math.sin(a)],t=[-n[1],n[0]],point=(u,z,r=1.075)=>[n[0]*r+t[0]*u,n[1]*r+t[1]*u,z];
  add([point(-.11,.44),point(.11,.44),point(.11,.7),point(-.11,.7)],'#3d565b');
  for(const u of [-.23,.23])add([point(u-.018,.34),point(u+.018,.34),point(u+.018,.83),point(u-.018,.83)],trim);
 }
 ring(0,0,.93,.94,.1,.94,copper,48);dome(ring,0,0,1.03,.94,.52,copper);
 for(let i=0;i<5;i++)box(0,-1.02-i*.06,.23,.64,.12,.04*(5-i),trim);
 box(0,-1.09,.42,.34,.07,.35,'#3d565b');box(0,-1.13,.77,.6,.18,.075,trim);
}
export function sheddAquariumGeometry({box,ring,beam,add}){
 const marble='#dbd6c4',light='#eeeadb',roof='#7d8b86',glass='#698d94';
 ring(0,.12,.23,1.22,.11,1.22,marble,8);ring(0,.12,.34,1.14,.62,1.14,marble,8);ring(0,.12,.96,1.2,.09,1.2,light,8);
 ring(0,.12,1.05,1.17,.2,.7,roof,8);ring(0,.12,1.25,.51,.23,.51,marble,8);ring(0,.12,1.48,.55,.055,.55,light,8);
 // Octagonal glazed dome, raised ribs and Neptune's trident finial.
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,b=(i+1)*Math.PI/4,point=(t,r,z)=>[Math.cos(t)*r,.12+Math.sin(t)*r,z];
  add([point(a,.53,1.535),point(b,.53,1.535),point(b,.19,1.94),point(a,.19,1.94)],glass);beam(point(a,.53,1.535),point(a,.19,1.94),.018,light);
 }
 ring(0,.12,1.94,.2,.045,.12,light,8);beam([0,.12,1.985],[0,.12,2.23],.012,'#668076');
 beam([-.095,.12,2.09],[.095,.12,2.09],.011,'#668076');for(const x of [-.095,.095])beam([x,.12,2.09],[x,.12,2.2],.011,'#668076');
 for(let i=0;i<6;i++)box(0,-1.08-i*.048,.23,.94,.1,.03*(6-i),marble);
 box(0,-.91,.41,.87,.53,.54,marble);box(0,-1.185,.43,.3,.014,.4,'#43595b');
 for(let i=0;i<6;i++){const x=-.41+i*.164;ring(x,-1.2,.42,.038,.57,.031,marble,16);box(x,-1.2,.99,.09,.09,.06,light);}
 box(0,-1.17,1.05,1.02,.4,.09,light);add([[-.53,-1.375,1.14],[.53,-1.375,1.14],[0,-1.375,1.4]],marble);
 for(const side of [-1,1])for(let i=0;i<5;i++)box(side*1.057,-.35+i*.18,.5,.012,.085,.27,'#657775');
}
export function artInstituteGeometry({box,ring,beam,add}){
 const stone='#cbb998',trim='#e1d3b6',roof='#697671',bronze='#658777';
 box(0,.06,.23,2.65,1.86,.13,stone);box(0,.12,.36,2.48,1.55,.71,stone);
 for(const x of [-1.02,1.02]){box(x,.1,1.07,.5,1.65,.055,trim);box(x,.1,1.125,.43,1.57,.14,roof);}
 box(0,.23,1.07,1.54,1.13,.1,roof);box(0,-.64,.36,.92,.32,.9,stone);box(0,-.64,1.26,1.02,.42,.085,trim);
 // Three recessed entrance bays and paired bronze guardian lions.
 for(const x of [-.28,0,.28]){box(x,-.808,.4,.19,.018,.44,'#3e5153');const points=[[x-.095,-.82,.84],[x+.095,-.82,.84]];for(let i=0;i<=12;i++){const a=i/12*Math.PI;points.push([x+Math.cos(a)*.095,-.82,.84+Math.sin(a)*.095]);}add(points,'#3e5153');}
 for(const x of [-.425,-.145,.145,.425])ring(x,-.85,.42,.028,.68,.022,trim,16);
 for(let i=0;i<5;i++)box(0,-.85-i*.06,.23,1.32,.12,.028*(5-i),stone);
 for(const side of [-1,1]){
  for(let i=0;i<3;i++){const x=side*(.64+i*.22);box(x,-.662,.49,.12,.018,.29,'#53686c');box(x,-.685,.81,.17,.07,.035,trim);}
  const x=side*.85;box(x,-1.01,.23,.3,.37,.17,stone);box(x,-1.01,.48,.14,.25,.13,bronze);ring(x,-1.12,.59,.065,.11,.058,bronze,12);box(x,-1.17,.64,.085,.105,.065,bronze);
  for(const dx of [-.045,.045])for(const y of [-1.075,-.93])beam([x+dx,y,.49],[x+dx,y,.4],.019,bronze);beam([x,-.87,.54],[x+side*.1,-.84,.44],.018,bronze);
 }
 for(const x of [-1.245,1.245])for(let i=0;i<7;i++)box(x,-.45+i*.18,.53,.012,.085,.29,'#53686c');
 box(0,.897,.87,2.55,.065,.065,trim);
}
export const CHICAGO_LANDMARK_GEOMETRY={adlerPlanetarium:adlerPlanetariumGeometry,sheddAquarium:sheddAquariumGeometry,artInstituteChicago:artInstituteGeometry};
