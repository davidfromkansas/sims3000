// Original game-scale lattice tower, with four splayed legs and three viewing levels.
export function eiffelTowerGeometry({box,beam}){
 const iron='#92745c',edge='#b39574',dark='#665649';
 const corners=[[-1,-1],[1,-1],[1,1],[-1,1]];
 for(const [x,y] of corners)box(x*1.08,y*1.08,.23,.43,.43,.2,'#c3b59c');
 const levels=[[.43,1.08,.18],[1.05,.91,.15],[1.7,.74,.12],[2.25,.6,.105],[2.95,.43,.08],[3.7,.3,.062],[4.55,.23,.047],[5.4,.17,.033],[6.25,.11,.024],[6.95,.07,.018]];
 // Each leg is an open, braced box girder rather than a solid tapered shaft.
 for(const [sx,sy] of corners)for(let j=0;j<levels.length-1;j++){
  const [z,a,w]=levels[j],[zz,b,ww]=levels[j+1];
  const p=corners.map(([x,y])=>[sx*a+x*w,sy*a+y*w,z]);
  const q=corners.map(([x,y])=>[sx*b+x*ww,sy*b+y*ww,zz]);
  for(let k=0;k<4;k++){const n=(k+1)%4;beam(p[k],q[k],j<4?.023:.014,iron);beam(p[k],p[n],.014,edge);beam(p[k],q[n],j<4?.013:.009,iron);beam(p[n],q[k],j<4?.013:.009,dark);}
 }
 // Above the second deck, cross-bracing joins the four uprights into one tapering shaft.
 for(let j=5;j<levels.length-1;j++){
  const [z,a]=levels[j],[zz,b]=levels[j+1];
  for(let side=0;side<4;side++){
   const [sx,sy]=corners[side],[tx,ty]=corners[(side+1)%4],p=[sx*a,sy*a,z],q=[tx*a,ty*a,z],pp=[sx*b,sy*b,zz],qq=[tx*b,ty*b,zz];
   beam(p,q,.013,iron);beam(p,qq,.013,iron);beam(q,pp,.013,iron);
  }
 }
 // Curved arches span the four openings beneath the first deck.
 for(let side=0;side<4;side++){
  const point=(x,z)=>side===0?[x,-.9,z]:side===1?[.9,x,z]:side===2?[-x,.9,z]:[-.9,-x,z];
  for(let j=0;j<16;j++){const x=-1+j/8,xx=x+.125;beam(point(x,.58+1.35*(1-x*x)),point(xx,.58+1.35*(1-xx*xx)),.041,iron);}
 }
 for(const [z,w] of [[2.25,1.65],[3.7,.96],[6.95,.38]]){
  box(0,0,z,w,w,.105,iron);box(0,0,z+.105,w+.035,w+.035,.035,edge);
  for(let side=0;side<4;side++){
   const point=(u,h)=>side===0?[u,-w/2,h]:side===1?[w/2,u,h]:side===2?[-u,w/2,h]:[-w/2,-u,h];
   beam(point(-w/2,z+.25),point(w/2,z+.25),.012,edge);
   for(let j=0;j<=8;j++){const u=-w/2+w*j/8;beam(point(u,z+.14),point(u,z+.25),.009,iron);}
  }
 }
 // Lift enclosures sit within the second and summit decks.
 box(0,0,3.82,.45,.45,.22,dark);box(0,0,7.09,.2,.2,.2,'#b59a79');
 beam([0,0,7.29],[0,0,7.74],.014,edge);
}
