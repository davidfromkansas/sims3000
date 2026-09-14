// Original game-scale models, informed by NPS architectural descriptions.
export function washingtonMonumentGeometry({box,add}){
 box(0,0,.23,1.18,1.18,.08,'#d5d0bd');
 const floor=.31,shaft=6.2,base=.66,top=.43;
 const square=(w,z)=>[[-w/2,-w/2,z],[w/2,-w/2,z],[w/2,w/2,z],[-w/2,w/2,z]];
 for(let i=0;i<62;i++){
  const z=floor+shaft*i/62,a=square(base+(top-base)*i/62,z),b=square(base+(top-base)*(i+1)/62,z+shaft/62);
  const colors=i<18?['#c5bea8','#d5ccb5','#e3dac2','#cfc6ae']:i<20?['#afa38d','#c2b39b','#cbbda5','#baac94']:['#d0cbbd','#e1dcce','#ede8db','#d9d4c6'];
  for(let j=0;j<4;j++)add([a[j],a[(j+1)%4],b[(j+1)%4],b[j]],colors[j]);
 }
 const rim=square(top,floor+shaft),tip=[0,0,floor+shaft+.59];for(let i=0;i<4;i++)add([rim[i],rim[(i+1)%4],tip],['#ccc8bb','#e0dcce','#eeeadc','#d7d3c5'][i]);
 box(0,-base/2-.005,floor,.11,.015,.22,'#544f45');
 for(const side of [-1,1]){box(side*top/2,0,floor+shaft-.15,.012,.075,.055,'#686960');box(0,side*top/2,floor+shaft-.15,.075,.012,.055,'#686960');}
}
export function gatewayArchGeometry({box,add}){
 box(0,0,.23,2.7,1.2,.035,'#bbc2bb');
 const half=1.19,height=2.38,k=2.3,denom=Math.cosh(k)-1;
 const section=x=>{
  const z=.265+height*(1-(Math.cosh(k*x/half)-1)/denom),slope=-height*k/half*Math.sinh(k*x/half)/denom,len=Math.hypot(1,slope),radius=.12-(z-.265)/height*.082;
  return Array.from({length:3},(_,i)=>{const a=Math.PI/2+i*Math.PI*2/3;return[x+radius*Math.cos(a)*slope/len,radius*Math.sin(a),z-radius*Math.cos(a)/len];});
 };
 for(let i=0;i<96;i++){const a=section(-half+2*half*i/96),b=section(-half+2*half*(i+1)/96);for(let j=0;j<3;j++)add([a[j],a[(j+1)%3],b[(j+1)%3],b[j]],['#d9e1e3','#8b9b9f','#bcc9cc'][j]);}
}
export function jeffersonMemorialGeometry({box,ring,add}){
 const marble='#dedbd0',light='#eeeade';
 for(let i=0;i<4;i++)ring(0,0,.23+i*.055,1.3-i*.06,.055,1.3-i*.06,marble,64);
 for(let i=0;i<6;i++)box(0,-1.28+i*.04,.23+i*.037,1.15,.28,.037,marble);
 const column=(x,y)=>{ring(x,y,.45,.048,.94,.038,marble,16);ring(x,y,1.39,.062,.055,.062,light,12);ring(x,y,.45,.063,.05,.063,light,12);};
 for(let i=0;i<26;i++){const a=-Math.PI/2+.33+i*(Math.PI*2-.66)/25;column(Math.cos(a),Math.sin(a));}
 // Twelve portico columns: eight across the front and four behind.
 for(let i=0;i<8;i++)column((i-3.5)*.155,-1.12);for(const x of [-.54,-.18,.18,.54])column(x,-.93);
 for(let side=0;side<4;side++)for(let i=0;i<4;i++){const a=side*Math.PI/2,u=(i-1.5)*.12;column(.55*Math.cos(a)-u*Math.sin(a),.55*Math.sin(a)+u*Math.cos(a));}
 ring(0,0,1.44,1.12,.2,1.12,marble,64);ring(0,0,1.64,1.15,.055,1.15,light,64);
 // Surface normals shade the shallow dome continuously; stacked cylinder lighting
 // would create a misleading radial seam across this broad roof.
 const point=(latitude,longitude)=>[1.06*Math.cos(latitude)*Math.cos(longitude),1.06*Math.cos(latitude)*Math.sin(longitude),1.695+.46*Math.sin(latitude)];
 for(let i=0;i<16;i++)for(let j=0;j<64;j++){
  const a=i/16*Math.PI/2,b=(i+1)/16*Math.PI/2,u=j*Math.PI/32,v=(j+1)*Math.PI/32,m=(a+b)/2,t=(u+v)/2,n=[Math.cos(m)*Math.cos(t)/1.06,Math.cos(m)*Math.sin(t)/1.06,Math.sin(m)/.46],len=Math.hypot(...n),lightDirection=[-.35,-.45,1],lightLength=Math.hypot(...lightDirection),dot=n.reduce((sum,value,k)=>sum+value*lightDirection[k],0)/(len*lightLength),factor=.72+.28*Math.max(0,dot),color='#'+[238,234,222].map(c=>Math.round(c*factor).toString(16).padStart(2,'0')).join('');
  add([point(a,u),point(a,v),point(b,v),point(b,u)],color);
 }

 box(0,-1.03,1.44,1.34,.38,.12,light);
 add([[-.7,-1.23,1.56],[.7,-1.23,1.56],[0,-1.23,1.92]],marble);
 add([[-.7,-1.23,1.56],[0,-1.23,1.92],[0,-.83,1.92],[-.7,-.83,1.56]],light);
 add([[0,-1.23,1.92],[.7,-1.23,1.56],[.7,-.83,1.56],[0,-.83,1.92]],light);
 // Simplified bronze standing figure inside the open rotunda.
 box(0,0,.45,.19,.19,.13,'#62605a');ring(0,0,.58,.065,.49,.045,'#484b43',10);ring(0,0,1.07,.055,.09,.045,'#55584d',12);
}
export function lincolnMemorialGeometry({box,ring}){
 const marble='#d8d6c9',light='#eeeadc';
 for(let i=0;i<4;i++)box(0,0,.23+i*.045,2.66-i*.06,1.91-i*.06,.045,marble);
 for(let i=0;i<6;i++)box(0,-1.27+i*.05,.23+i*.035,1.4,.3,.035,marble);
 // Walls surround an open central entrance; two more columns stand behind the colonnade.
 box(0,.05,.41,1.94,1.14,1.04,marble);box(0,-.527,.41,.66,.016,.88,'#52564f');
 box(0,-.56,.41,.24,.08,.09,light);box(0,-.57,.5,.17,.055,.16,light);box(0,-.575,.66,.11,.06,.16,light);ring(0,-.575,.82,.042,.08,.036,light,12);for(const x of [-.08,.08])box(x,-.59,.59,.035,.06,.11,light);
 const column=(x,y)=>{ring(x,y,.41,.047,.89,.039,marble,20);box(x,y,1.3,.13,.13,.065,light);ring(x,y,1.27,.058,.03,.058,light,16);};
 for(let i=0;i<12;i++)for(const y of [-.76,.76])column(-1.13+i*2.26/11,y);
 for(let i=1;i<7;i++)for(const x of [-1.13,1.13])column(x,-.76+i*1.52/7);
 for(const x of [-.31,.31])column(x,-.58);
 box(0,0,1.365,2.5,1.78,.2,marble);box(0,0,1.565,2.6,1.87,.07,light);box(0,0,1.635,2.33,1.6,.18,marble);box(0,0,1.815,2.41,1.68,.06,light);box(0,0,1.875,2.16,1.43,.04,'#b8b8ad');
 for(let i=0;i<24;i++){const x=-1.14+i*2.28/23;box(x,-.896,1.405,.024,.012,.095,'#b1b0a3');box(x,.896,1.405,.024,.012,.095,'#b1b0a3');}
}
export const US_MEMORIAL_GEOMETRY={washingtonMonument:washingtonMonumentGeometry,gatewayArch:gatewayArchGeometry,jeffersonMemorial:jeffersonMemorialGeometry,lincolnMemorial:lincolnMemorialGeometry};
