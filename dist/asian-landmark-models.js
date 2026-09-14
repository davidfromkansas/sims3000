// Original architectural miniatures; proportions and footprints are authored game-scale interpretations.
export const ASIAN_LANDMARK_GEOMETRY={
 tokyoTower({box,ring,beam}){
  const orange='#d85a32',white='#ece9df',glass='#405965';
  box(0,0,.23,1.9,1.55,.38,'#c5bca8');box(0,0,.61,1.95,1.6,.055,'#a49e91');
  for(const sign of [-1,1])for(let i=0;i<8;i++)box((i-3.5)*.19,sign*.781,.34,.12,.015,.16,glass);
  const profiles=[[.3,1.1],[1.05,.86],[1.8,.68],[2.55,.54],[3.3,.43],[3.7,.37],[4.1,.31],[4.43,.275],[4.77,.24],[5.1,.205],[5.43,.175],[5.77,.14],[6.1,.11],[6.43,.085]],corners=([z,r])=>[[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z]],color=z=>z<3.7?orange:Math.floor((z-3.7)/(.67))%2?white:orange;
  for(let j=0;j<profiles.length-1;j++){const a=corners(profiles[j]),b=corners(profiles[j+1]),c=color((profiles[j][0]+profiles[j+1][0])/2);for(let i=0;i<4;i++){const next=(i+1)%4;beam(a[i],b[i],j<5?.047:.025,c);beam(a[i],b[next],j<5?.021:.012,c);beam(a[next],b[i],j<5?.021:.012,c);beam(b[i],b[next],.018,c);}}
  box(0,0,3.61,1.06,1.06,.09,white);box(0,0,3.7,1.02,1.02,.19,glass);box(0,0,3.89,1.08,1.08,.085,white);
  for(let i=0;i<8;i++)for(const side of [-1,1]){box((i-3.5)*.12,side*.518,3.7,.013,.014,.19,white);box(side*.518,(i-3.5)*.12,3.7,.014,.013,.19,white);}
  box(0,0,6.05,.45,.45,.055,white);box(0,0,6.105,.43,.43,.13,glass);box(0,0,6.235,.46,.46,.07,white);
  for(let i=0;i<9;i++)ring(0,0,6.43+i*.22,.06-i*.004,.22,.056-i*.004,color(6.54+i*.22),12);
 },
 bankOfChinaTower(api){
  const scale=p=>[p[0],p[1],p[2]*.92],box=(x,y,z,w,d,h,c)=>api.box(x,y,z*.92,w,d,h*.92,c),add=(points,c)=>api.add(points.map(scale),c),beam=(a,b,r,c)=>api.beam(scale(a),scale(b),r,c);
  const glass=['#719ba9','#527b8f','#87aab2','#426f83'],metal='#c3d0cb',corner=[[-.72,-.72],[.72,-.72],[.72,.72],[-.72,.72]],heights=[4.55,5.55,6.55,7.25];
  box(0,0,.23,1.75,1.75,.35,'#686d6b');
  for(let sector=0;sector<4;sector++){
   const a=corner[sector],b=corner[(sector+1)%4],h=heights[sector],points=[a,b,[0,0]],top=[h-.5,h,h+.15],bottom=points.map(([x,y])=>[x,y,.58]),roof=points.map(([x,y],i)=>[x,y,top[i]]);
   for(let i=0;i<3;i++){const n=(i+1)%3;add([bottom[i],bottom[n],roof[n],roof[i]],glass[sector]);beam(roof[i],roof[n],.018,metal);beam(bottom[i],roof[i],.02,metal);}add(roof,'#abc0bd');
   const surface=(t,z)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z];
   for(let z=.75;z<h-.6;z+=.14)beam(surface(0,z),surface(1,z),.004,'#9bb4bd');
   for(let col=1;col<10;col++)beam(surface(col/10,.6),surface(col/10,h-.5+col*.05),.004,'#a6bfc7');
   const levels=[.6,2,3.4,h-.5];for(let j=0;j<levels.length-1;j++){beam(surface(0,levels[j]),surface(1,levels[j+1]),.021,metal);beam(surface(1,levels[j]),surface(0,levels[j+1]),.021,metal);}
  }
  // The two antenna masts rise from the tallest prism's upper ridge.
  for(const p of [[-.72,-.72,7.25],[0,0,7.4]])beam(p,[p[0],p[1],8.45],.014,'#d8e0d9');
 },
 namSanTower({box,ring,beam}){
  const concrete='#d5d0c0',glass='#3f5965',rim='#b8c0bb';
  box(0,0,.23,1.8,1.4,.25,'#b4aa96');ring(0,0,.48,.38,.22,.29,concrete,24);ring(0,0,.7,.27,3.1,.2,concrete,24);
  for(let i=0;i<6;i++){const a=i*Math.PI/3;beam([Math.cos(a)*.26,Math.sin(a)*.26,.75],[Math.cos(a)*.2,Math.sin(a)*.2,3.8],.012,'#b1b4a9');}
  ring(0,0,3.72,.2,.24,.61,concrete,32);ring(0,0,3.96,.62,.075,.64,rim,32);ring(0,0,4.035,.625,.21,.625,glass,32);ring(0,0,4.245,.65,.065,.65,concrete,32);ring(0,0,4.31,.625,.19,.58,glass,32);ring(0,0,4.5,.6,.14,.28,concrete,32);
  for(let i=0;i<32;i++){const a=i*Math.PI/16;beam([Math.cos(a)*.63,Math.sin(a)*.63,4.04],[Math.cos(a)*.63,Math.sin(a)*.63,4.24],.007,rim);}
  ring(0,0,4.64,.2,.42,.16,concrete,16);ring(0,0,5.06,.29,.08,.29,rim,24);
  for(let i=0;i<12;i++){const z=5.14+i*.26,r=.12-i*.007;ring(0,0,z,r,.26,r-.006,i%3===1?'#c9654d':'#d7d9cf',12);if(i<6)ring(0,0,z+.12,r+.045,.022,r+.045,'#8b9898',20);}
  for(const x of [-.45,.45])box(x,-.71,.27,.23,.018,.17,glass);
 }
};
