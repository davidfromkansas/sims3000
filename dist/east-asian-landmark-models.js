// Original miniature interpretations; dimensions and omitted ornament are authored.
// Curved hipped roofs use explicit surfaces, so eaves retain depth in all views.
function roof({add,beam},x,y,z,w,d,h,color,trim){
 const levels=[0,.18,.42,.7,1],corners=t=>{
  const width=w*(1-t)+w*.42*t,depth=d*(1-t);
  return [[x-width/2,y-depth/2,z+h*t+.09*(1-t)**5],[x+width/2,y-depth/2,z+h*t+.09*(1-t)**5],[x+width/2,y+depth/2,z+h*t+.09*(1-t)**5],[x-width/2,y+depth/2,z+h*t+.09*(1-t)**5]];
 };
 for(let j=0;j<levels.length-1;j++){const a=corners(levels[j]),b=corners(levels[j+1]);for(let i=0;i<4;i++)add([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],color);}
 const base=corners(0),top=corners(1);for(let i=0;i<4;i++)beam(base[i],base[(i+1)%4],.018,trim);
 beam(top[0],top[1],.024,trim);
 // Tile seams follow the sloping front and rear surfaces.
 for(const sign of [-1,1])for(let i=1;i<22;i++){
  const u=i/22,points=levels.map(t=>[x+(u-.5)*(w*(1-t)+w*.42*t),y+sign*d*(1-t)/2,z+h*t+.09*(1-t)**5+.006]);
  for(let j=0;j<points.length-1;j++)beam(points[j],points[j+1],.005,trim);
 }
}
export function himejiCastleGeometry(g){
 const {box,add,beam}=g,white='#e8e6dc',stone='#99998c',tile='#424c52',edge='#7f898b';
 // Tapered stone foundation, distinct from the plaster keep above it.
 const a=[[-1,-.85,.23],[1,-.85,.23],[1,.85,.23],[-1,.85,.23]],b=a.map(([x,y])=>[x*.82,y*.82,.82]);
 for(let i=0;i<4;i++)add([a[i],a[(i+1)%4],b[(i+1)%4],b[i]],stone);add(b,stone);
 for(let tier=0;tier<5;tier++){
  const w=1.62-tier*.22,d=1.35-tier*.17,z=.82+tier*.48;
  box(0,0,z,w,d,.43,white);
  for(const side of [-1,1])for(let j=0;j<Math.max(2,5-tier);j++){
   const x=(j-(Math.max(2,5-tier)-1)/2)*w/(Math.max(2,5-tier)+1);
   box(x,side*(d/2+.005),z+.13,.065,.014,.14,'#34464a');
  }
  roof(g,0,0,z+.39,w+.27,d+.26,.31,tile,edge);
  for(const side of [-1,1])for(let j=0;j<3;j++)box(side*(w/2+.005),(j-1)*d*.25,z+.13,.014,.06,.14,'#34464a');
  // Raised plaster dormer gables emerge above, rather than underneath, the roof.
  if(tier<4)for(const side of [-1,1]){
   const span=w*.23,front=side*(d/2+.115),back=side*d*.2,low=z+.49,high=z+.85;
   add([[-span,front,low],[span,front,low],[0,front,high]],white);
   add([[-span,back,low],[span,back,low],[0,back,high]],white);
   add([[-span,front,low],[0,front,high],[0,back,high],[-span,back,low]],tile);
   add([[span,front,low],[0,front,high],[0,back,high],[span,back,low]],tile);
   beam([-span,front,low],[0,front,high],.019,edge);beam([0,front,high],[span,front,low],.019,edge);
  }
 }
 // A connected lower watchtower conveys the compound rather than a lone pagoda.
 box(-.82,.67,.23,.74,.66,.4,stone);
 for(let i=0;i<3;i++){box(-.82,.67,.63+i*.31,.64-i*.1,.56-i*.08,.29,white);roof(g,-.82,.67,.89+i*.31,.86-i*.1,.76-i*.08,.2,tile,edge);}
 box(-.42,.65,.62,.6,.32,.28,white);roof(g,-.42,.65,.87,.68,.48,.18,tile,edge);
 for(const x of [-.2,.2])beam([x,0,3.48],[x*1.16,0,3.63],.022,'#7c897e');
}
export function geunjeongjeonGeometry(g){
 const {box,beam,ring}=g,stone='#c5c6bb',red='#934e3e',green='#427f70',tile='#454f56',trim='#84938e';
 box(0,0,.23,2.6,2.35,.15,stone);box(0,0,.38,2.3,2.06,.15,stone);
 for(const side of [-1,1]){
  for(let i=0;i<8;i++){const x=-1.07+i*.305;box(x,side*.98,.53,.055,.055,.19,stone);}
  beam([-1.08,side*.98,.7],[1.08,side*.98,.7],.026,stone);
  for(let i=0;i<7;i++){const y=-.88+i*.293;box(side*1.08,y,.53,.055,.055,.19,stone);}
  beam([side*1.08,-.88,.7],[side*1.08,.88,.7],.026,stone);
 }
 for(let i=0;i<6;i++)box(0,-1.05-i*.05,.23,.68,.12,.05*(6-i),stone);
 box(0,0,.53,1.62,1.4,.61,'#75604b');
 for(const side of [-1,1])for(let i=0;i<6;i++){
  const x=-.81+i*.324;ring(x,side*.71,.53,.025,.62,.022,red,12);
  if(i<5){box(x+.162,side*.711,.64,.26,.016,.35,'#b5ab87');for(let j=0;j<4;j++)box(x+.065+j*.064,side*.725,.65,.009,.012,.33,red);}
 }
 for(const side of [-1,1])for(let i=0;i<6;i++){
  const y=-.7+i*.28;ring(side*.82,y,.53,.025,.62,.022,red,12);
  if(i<5){box(side*.821,y+.14,.64,.016,.22,.35,'#b5ab87');for(let j=0;j<3;j++)box(side*.837,y+.07+j*.07,.65,.012,.009,.33,red);}
 }
 box(0,0,1.08,1.78,1.55,.1,green);roof(g,0,0,1.16,2.22,1.99,.42,tile,trim);
 box(0,0,1.49,1.35,1.06,.37,red);box(0,0,1.77,1.48,1.2,.09,green);
 for(const side of [-1,1])for(let i=0;i<5;i++)box(-.52+i*.26,side*.537,1.56,.16,.015,.14,'#b6ad8d');
 roof(g,0,0,1.84,2.05,1.75,.5,tile,trim);
 box(0,-.58,1.68,.3,.025,.12,'#293c40');
}
export function cksMemorialHallGeometry(g){
 const {box,ring,beam}=g,white='#e6e7de',blue='#34618b',edge='#648ba8';
 box(0,0,.23,2.4,2.3,.18,white);box(0,0,.41,2.13,2.04,.17,white);
 box(0,0,.58,1.74,1.7,1.5,white);
 // Deep entrance opening, flanking pilasters and a broad ceremonial staircase.
 box(0,-.856,.67,.71,.018,1.06,'#3d4850');box(0,-.87,1.72,.8,.075,.09,'#c0c5be');
 for(const x of [-.68,.68])box(x,-.88,.63,.16,.12,1.4,'#f0eee3');
 for(let i=0;i<16;i++)box(0,-.89-i*.027,.23,1.15,.075,.022*(16-i),white);
 box(0,0,2.08,1.9,1.86,.09,white);
 // Two octagonal tiers, segmented slopes and raised radial roof ribs.
 for(const [z,r,h] of [[2.17,1.22,.42],[2.62,1.05,.55]]){
  ring(0,0,z,r,.055,r,edge,8);
  for(let j=0;j<5;j++){const a=j/5,b=(j+1)/5;ring(0,0,z+.055+h*a,r*(1-a)+.15*a,h/5,r*(1-b)+.15*b,blue,8);}
  for(let i=0;i<8;i++){const a=i*Math.PI/4;beam([Math.cos(a)*r,Math.sin(a)*r,z+.055],[Math.cos(a)*.15,Math.sin(a)*.15,z+.055+h],.013,edge);}
 }
 ring(0,0,3.225,.13,.12,.025,'#c6b67b',16);
}
export const EAST_ASIAN_LANDMARK_GEOMETRY={himejiCastle:himejiCastleGeometry,geunjeongjeon:geunjeongjeonGeometry,cksMemorialHall:cksMemorialHallGeometry};
