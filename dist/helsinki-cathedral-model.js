// Original simplified cathedral geometry; dimensions are game-scale reconstruction.
export function helsinkiCathedralGeometry({add,box,ring,beam}){
 const white='#e4e4d9',trim='#f3efdf',green='#587c69',glass='#586a68',stone='#a7a59a',gold='#c6a55b';
 box(0,0,.23,2.7,2.7,.15,stone);
 for(let step=0;step<6;step++)box(0,-1.18+step*.055,.25+step*.055,1.85,.35,.055,stone);
 box(0,0,.38,1.24,2.18,1.16,white);box(0,0,.38,2.18,1.24,1.16,white);
 box(0,0,1.54,1.34,2.28,.09,trim);box(0,0,1.54,2.28,1.34,.09,trim);
 box(0,0,1.63,1.32,2.26,.09,green);box(0,0,1.63,2.26,1.32,.09,green);
 for(let side=0;side<4;side++){
  const angle=side*Math.PI/2,point=(x,y,z)=>[x*Math.cos(angle)-y*Math.sin(angle),x*Math.sin(angle)+y*Math.cos(angle),z];
  for(const x of [-.5,-.3,-.1,.1,.3,.5]){
   const p=point(x,-1.15,.48);ring(...p,.042,.86,.042,white,10);ring(...point(x,-1.15,.43),.067,.05,.067,trim,10);ring(...point(x,-1.15,1.34),.067,.07,.067,trim,10);
  }
  const slab=(y,z,w,d,h,color)=>{const p=point(0,y,z);box(...p,side%2?d:w,side%2?w:d,h,color);};
  slab(-1.1,.38,1.3,.4,.06,trim);slab(-1.12,1.4,1.35,.31,.1,trim);
  add([point(-.68,-1.285,1.5),point(.68,-1.285,1.5),point(0,-1.285,1.86)],white);
  add([point(-.56,-1.289,1.53),point(.56,-1.289,1.53),point(0,-1.289,1.79)],stone);
  add([point(-.68,-.96,1.5),point(0,-.96,1.86),point(0,-1.285,1.86),point(-.68,-1.285,1.5)].reverse(),green);
  add([point(0,-.96,1.86),point(.68,-.96,1.5),point(.68,-1.285,1.5),point(0,-1.285,1.86)].reverse(),green);
  slab(-1.098,.43,.22,.015,.7,glass);
 }
 const dome=(x,y,z,r,h)=>{
  ring(x,y,z,r,.1,r,trim,24);ring(x,y,z+.1,r*.91,h*.4,r*.91,white,24);
  for(let i=0;i<8;i++){
   const angle=i*Math.PI/4,xx=x+Math.cos(angle)*r*.923,yy=y+Math.sin(angle)*r*.923;
   box(xx,yy,z+.16,.055,.055,h*.24,glass);
  }
  const bottom=z+.1+h*.4;
  for(let i=0;i<8;i++){const a=i/8*Math.PI/2,b=(i+1)/8*Math.PI/2;ring(x,y,bottom+Math.sin(a)*h*.58,r*Math.cos(a), (Math.sin(b)-Math.sin(a))*h*.58,Math.max(.004,r*Math.cos(b)),green,32);}
  ring(x,y,bottom+h*.58,.04,.1,.025,gold,10);beam([x,y,bottom+h*.58+.08],[x,y,bottom+h*.58+.25],.014,gold);beam([x-.06,y,bottom+h*.58+.2],[x+.06,y,bottom+h*.58+.2],.012,gold);
 };
 dome(0,0,1.72,.46,1.48);
 for(const x of [-.73,.73])for(const y of [-.73,.73]){box(x,y,.38,.44,.44,1.27,white);dome(x,y,1.65,.24,.68);}
 // Twelve simplified roof figures retain the principal roofline rhythm.
 for(let side=0;side<4;side++)for(const offset of [-.54,0,.54]){
  const angle=side*Math.PI/2,x=offset*Math.cos(angle)+1.16*Math.sin(angle),y=offset*Math.sin(angle)-1.16*Math.cos(angle),z=offset===0?1.89:1.56;
  ring(x,y,z,.04,.16,.022,stone,6);ring(x,y,z+.16,.029,.05,.018,stone,8);
 }
}
