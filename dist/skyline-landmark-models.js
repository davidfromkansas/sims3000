// Original skyline miniatures. Landmark-owner sources and scale limits are in the art README.
export const SKYLINE_LANDMARK_GEOMETRY={
 empireStateBuilding({box,ring}){
  const stone='#c4b99f',glass='#4f6268',metal='#aeb8b4';
  function tier(z,w,d,h,rows,columns){
   box(0,0,z,w,d,h,stone);
   for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
    const x=(col-(columns-1)/2)*w/(columns+1),y=(col-(columns-1)/2)*d/(columns+1),low=z+(row+.25)*h/rows,wh=h/rows*.53;
    for(const side of [-1,1]){box(x,side*(d/2+.004),low,w/(columns+1)*.43,.012,wh,glass);box(side*(w/2+.004),y,low,.012,d/(columns+1)*.43,wh,glass);}
   }
   box(0,0,z+h-.035,w+.045,d+.045,.045,'#d8ceba');
  }
  tier(.23,2.05,1.55,.56,5,15);tier(.79,1.83,1.37,.46,4,13);tier(1.25,1.58,1.15,.42,4,11);
  tier(1.67,1.28,.86,3.91,37,9);tier(5.58,1.08,.73,.47,4,7);tier(6.05,.87,.6,.36,3,5);
  // Open-air setback terrace, then the narrower Art Deco observation crown.
  box(0,0,6.41,.92,.67,.08,'#aaa99b');tier(6.49,.55,.47,.49,5,3);box(0,0,6.98,.61,.53,.07,stone);
  ring(0,0,7.05,.22,.21,.17,metal,8);ring(0,0,7.26,.15,.24,.08,metal,8);
  ring(0,0,7.5,.055,.68,.024,'#b9c3c2',12);ring(0,0,8.18,.024,.21,.008,'#e0e2d8',8);
  for(const x of [-.44,.44])box(x,-.785,.23,.18,.023,.25,'#8b795b');
 },
 cnTower({box,add,ring,beam}){
  const concrete='#c2bca9',rim='#bac4c2',glass='#476274';
  // A triangular core and three tapered buttresses; curves are sampled into profile segments.
  ring(0,0,.23,.29,5.04,.12,concrete,3);
  for(let side=0;side<3;side++){
   const angle=Math.PI/2+side*Math.PI*2/3,u=[Math.cos(angle),Math.sin(angle)],v=[-u[1],u[0]],profile=[[.23,.95,.19],[.6,.72,.17],[1.2,.49,.145],[2,.34,.12],[3,.25,.095],[4.1,.2,.075],[5.27,.16,.065]];
   const corners=([z,r,w])=>[[.09,-w],[r,-w],[r,w],[.09,w]].map(([a,b])=>[u[0]*a+v[0]*b,u[1]*a+v[1]*b,z]);
   for(let j=0;j<profile.length-1;j++){const a=corners(profile[j]),b=corners(profile[j+1]);for(let k=0;k<4;k++)add([a[k],a[(k+1)%4],b[(k+1)%4],b[k]],['#999c91',concrete,'#d0c9b6','#b7b3a3'][k]);}
   const a=angle+Math.PI/3;beam([Math.cos(a)*.165,Math.sin(a)*.165,.4],[Math.cos(a)*.135,Math.sin(a)*.135,5.25],.028,glass);
  }
  // Stacked main observation/restaurant decks and the separate upper observation pod.
  ring(0,0,5.04,.18,.16,.57,concrete,36);ring(0,0,5.2,.57,.085,.62,rim,36);ring(0,0,5.285,.61,.15,.61,glass,36);
  ring(0,0,5.435,.63,.07,.63,rim,36);ring(0,0,5.505,.61,.16,.55,glass,36);ring(0,0,5.665,.56,.11,.31,rim,36);
  for(let i=0;i<36;i++){const a=i*Math.PI/18;beam([Math.cos(a)*.612,Math.sin(a)*.612,5.285],[Math.cos(a)*.612,Math.sin(a)*.612,5.435],.006,'#adb8b4');}
  ring(0,0,5.775,.145,1.06,.095,concrete,18);ring(0,0,6.835,.105,.07,.205,rim,24);ring(0,0,6.905,.205,.1,.205,glass,24);ring(0,0,7.005,.215,.06,.13,rim,24);
  ring(0,0,7.065,.085,.42,.06,'#d9d8cb',18);ring(0,0,7.485,.06,.45,.04,'#b45745',16);ring(0,0,7.935,.04,.3,.023,'#d9d8cb',12);ring(0,0,8.235,.023,.14,.007,'#b45745',10);
  box(0,0,.23,.58,.55,.15,'#a5aca3');
 }
};
