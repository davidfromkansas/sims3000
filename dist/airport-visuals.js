// Procedural overflights indicate operating airports; these are not individual passenger trips.
export function airportFlights(city,seconds){
 const n=Math.sqrt(city.tiles.length),span=n+4,travel=span/1.2,cycle=travel+8;
 return (city.stats.facilityPlots||[]).filter(p=>p.type==='airport'&&p.operating).slice(0,8).flatMap(p=>{
  const phase=(Math.max(0,seconds)+(p.root%13)*3)%cycle;if(phase>=travel)return[];
  const position=-2+phase*1.2,vertical=p.height>p.width,forward=p.root%2===0;
  const along=forward?position:n-1-position,x=vertical?p.x+(p.width-1)/2:along,y=vertical?along:p.y+(p.height-1)/2;
  return[{root:p.root,x,y,dx:vertical?0:forward?1:-1,dy:vertical?forward?1:-1:0,altitude:8,alpha:Math.max(0,Math.min(1,phase/1.5,(travel-phase)/1.5))}];
 });
}
export function drawAirportFlight(renderer,flight,shadow=false){
 const r=renderer,c=r.ctx,u=r.unit,v=flight,n=Math.sqrt(r.getCity().tiles.length),city=r.getCity();
 const point=(a,b,z=0)=>{const x=v.x+v.dx*a-v.dy*b,y=v.y+v.dy*a+v.dx*b;
  if(shadow){const p=r.project(x,y);return{x:p.x,y:p.y+u/2};}
  // Undo terrain lift: aircraft keep a continuous world altitude over hills.
  const p=r.project(x,y),tile=city.tiles[Math.max(0,Math.min(n-1,Math.floor(y)))*n+Math.max(0,Math.min(n-1,Math.floor(x)))];return{x:p.x,y:p.y+u/2+(tile.elevation||0)*u*.5-(v.altitude+z)*u};};
 const center=point(0,0);if(center.x<-u*3||center.x>r.w+u*3||center.y<-u*3||center.y>r.h+u*3)return;
 if(shadow&&(v.x<0||v.x>=n||v.y<0||v.y>=n))return;
 const polygon=(points,color)=>{c.beginPath();points.forEach(([a,b,z=0],i)=>{const p=point(a,b,z);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();c.fillStyle=color;c.fill();};
 const wing=[[-.3,-.13],[-.46,-.95],[.03,-.94],[.34,-.12],[.34,.12],[.03,.94],[-.46,.95],[-.3,.13]];
 const body=[[-.9,-.045],[.65,-.12],[1,0],[.65,.12],[-.9,.045]];
 c.save();c.globalAlpha=v.alpha;
 if(shadow){c.globalAlpha*=.13;polygon(wing,'#193b3f');polygon(body,'#193b3f');c.restore();return;}
 polygon(wing,'#83999e');polygon(wing.map(([a,b])=>[a,b,.045]),'#d5e0dc');
 polygon([[-.79,-.07],[-.92,-.42],[-.67,-.38],[-.47,0],[-.67,.38],[-.92,.42],[-.79,.07]],'#458e95');
 polygon(body,'#a1b5b6');polygon(body.map(([a,b])=>[a,b,.085]),'#f4f0df');
 polygon([[.61,-.095,.1],[.8,-.06,.1],[.87,0,.1],[.8,.06,.1],[.61,.095,.1]],'#335d68');
 polygon([[-.88,0,.08],[-.66,0,.48],[-.44,0,.08]],'#287e8b');
 for(const side of [-1,1])polygon([[.18,side*.43,.04],[-.16,side*.43,.04],[-.16,side*.56,.04],[.18,side*.56,.04]],'#617e86');
 c.restore();
}
