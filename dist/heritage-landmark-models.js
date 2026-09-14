// Original miniature geometry. Physical proportions and decorative details are simplified.
export function brandenburgGateGeometry({box,ring,beam,add}){
 const stone='#c7b994',light='#e1d3ae',bronze='#487e70';
 box(0,0,.23,2.68,1.12,.08,stone);
 for(const x of [-1.1,1.1]){box(x,0,.31,.45,.72,.65,stone);box(x,0,.96,.51,.82,.11,light);box(x,0,1.07,.43,.66,.11,stone);for(const y of [-.365,.365])box(x,y,.38,.19,.014,.42,'#667168');}
 for(let i=0;i<6;i++)for(const y of [-.3,.3]){const x=-.78+i*.312;ring(x,y,.31,.075,.79,.061,stone,20);ring(x,y,1.1,.083,.045,.083,light,20);box(x,y,1.145,.17,.17,.055,light);}
 box(0,0,1.2,1.96,.84,.18,stone);box(0,0,1.38,2.06,.92,.065,light);box(0,0,1.445,1.92,.8,.18,stone);box(0,0,1.625,2.04,.9,.06,light);
 for(let i=0;i<25;i++)for(const y of [-.426,.426])box(-.91+i*.076,y,1.235,.022,.014,.1,'#a79a7d');
 // Authored low-relief panels and simplified four-horse chariot silhouette.
 for(let i=0;i<11;i++)for(const y of [-.405,.405]){const x=-.78+i*.156;ring(x,y,1.48,.025,.075,.018,light,8);}
 box(0,0,1.685,.76,.52,.09,light);box(0,.1,1.775,.21,.24,.1,bronze);
 for(const x of [-.24,-.08,.08,.24]){box(x,-.08,1.84,.105,.25,.105,bronze);beam([x,-.16,1.9],[x,-.23,2.02],.036,bronze);box(x,-.26,2,.067,.105,.07,bronze);for(const y of [-.15,.01])for(const dx of [-.031,.031])beam([x+dx,y,1.85],[x+dx,y-.035,1.775],.012,bronze);beam([x,.05,1.89],[x,.14,1.81],.012,bronze);}
 ring(0,.12,1.875,.045,.19,.032,bronze,10);ring(0,.12,2.065,.041,.06,.032,bronze,12);beam([.02,.12,1.97],[.15,.12,2.02],.014,bronze);beam([.15,.12,1.9],[.15,.12,2.25],.012,bronze);ring(.15,.12,2.22,.07,.04,.065,bronze,16);
 add([[.15,.12,2.29],[.02,.12,2.34],[.15,.12,2.32],[.28,.12,2.34]],bronze);
}
export function parthenonGeometry({box,ring,add}){
 const marble='#d5c6a6',light='#e6d8ba';
 for(let i=0;i<3;i++)box(0,0,.23+i*.04,1.38-i*.055,2.65-i*.055,.04,marble);
 const column=(x,y)=>{ring(x,y,.35,.041,.71,.033,marble,20);ring(x,y,1.06,.048,.045,.054,light,20);box(x,y,1.105,.118,.118,.042,light);};
 for(let i=0;i<8;i++)for(const y of [-1.15,1.15])column(-.52+i*1.04/7,y);
 for(let i=1;i<16;i++)for(const x of [-.52,.52])column(x,-1.15+i*2.3/16);
 // Open ruin: retained perimeter architraves and fragmentary cella, without a restored roof.
 for(const x of [-.52,.52])box(x,0,1.147,.14,2.46,.105,marble);
 for(const y of [-1.15,1.15]){box(0,y,1.147,1.2,.15,.105,marble);box(0,y,1.252,1.24,.18,.055,light);for(let i=0;i<15;i++)box(-.55+i*1.1/14,y,1.18,.024,.162,.08,'#ad9b79');}
 for(const x of [-.52,.52])for(let i=0;i<32;i++)box(x,-1.14+i*2.28/31,1.18,.152,.016,.078,'#ad9b79');
 for(const x of [-.29,.29]){box(x,.14,.35,.08,1.48,.38,marble);box(x,.5,.73,.08,.76,.21,light);}
 box(0,.86,.35,.65,.085,.58,marble);for(const y of [-.84,.84])for(const x of [-.31,-.185,-.06,.065,.19,.315])column(x,y);
 for(const y of [-1.15,1.15])for(const side of [-1,1])add([[side*.62,y-.09,1.307],[side*.23,y-.09,1.46],[side*.28,y-.09,1.31]],light);
 for(let i=0;i<9;i++)box(-.2+(i%3)*.19,-.5+Math.floor(i/3)*.27,.35,.12,.15,.04+(i%2)*.035,'#b9aa8c');
}
export function tajMahalGeometry({box,ring,add}){
 const white='#e7e2d1',light='#f7f0dc',shadow='#69797b';
 const dome=(x,y,z,r,h)=>{const profile=[[0,.68],[.1,.78],[.3,1],[.5,.96],[.7,.75],[.88,.4],[1,.02]];for(let i=0;i<profile.length-1;i++){const [a,ra]=profile[i],[b,rb]=profile[i+1];ring(x,y,z+a*h,r*ra,(b-a)*h,r*rb,white,32);}ring(x,y,z+h,.028,.16,.008,'#b7a468',12);};
 box(0,0,.23,2.58,2.58,.15,white);box(0,0,.38,2.64,2.64,.05,light);
 // Chamfered eight-sided tomb walls, with four large pointed-arch recesses.
 const outline=[[-.52,-.75],[.52,-.75],[.75,-.52],[.75,.52],[.52,.75],[-.52,.75],[-.75,.52],[-.75,-.52]];
 for(let i=0;i<8;i++){const a=outline[i],b=outline[(i+1)%8];add([[...a,.43],[...b,.43],[...b,1.62],[...a,1.62]],i%2?'#d4d0c0':white);}add(outline.map(p=>[...p,1.62]),light);
 const arch=(side,u,z,w,h)=>{const point=(a,b)=>side===0?[a,-.753,b]:side===1?[.753,a,b]:side===2?[-a,.753,b]:[-.753,-a,b];add([point(u-w/2,z),point(u+w/2,z),point(u+w/2,z+h*.65),point(u+w*.25,z+h*.88),point(u,z+h),point(u-w*.25,z+h*.88),point(u-w/2,z+h*.65)],shadow);};
 for(let side=0;side<4;side++){arch(side,0,.48,.47,.94);for(const u of [-.4,.4])for(const z of [.55,1.04])arch(side,u,z,.12,.32);}
 box(0,0,1.62,1.56,1.56,.065,light);ring(0,0,1.685,.36,.22,.36,white,32);dome(0,0,1.905,.5,.77);
 for(const x of [-.56,.56])for(const y of [-.56,.56]){ring(x,y,1.685,.135,.21,.135,white,16);for(let i=0;i<8;i++){const a=i*Math.PI/4;box(x+Math.cos(a)*.105,y+Math.sin(a)*.105,1.72,.026,.026,.15,light);}dome(x,y,1.895,.18,.25);}
 for(const x of [-1.13,1.13])for(const y of [-1.13,1.13]){ring(x,y,.43,.11,1.57,.073,white,24);for(const z of [.92,1.46,1.97]){ring(x,y,z,.13,.045,.13,light,24);ring(x,y,z+.045,.113,.075,.113,white,24);}ring(x,y,2.09,.083,.2,.083,white,16);dome(x,y,2.29,.13,.2);}
}
export const HERITAGE_LANDMARK_GEOMETRY={brandenburgGate:brandenburgGateGeometry,parthenon:parthenonGeometry,tajMahal:tajMahalGeometry};
