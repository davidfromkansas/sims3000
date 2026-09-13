// Decorative residents on usable neighborhood streets, not extra population or commute trips.
const SHIRTS=['#ce755e','#5d8fa1','#d2b064','#e7dfc9','#839b70','#9c7e9f'];
const SKIN=['#e9b991','#c28a62','#895d43','#593f35'];
const safe=t=>t?.terrain==='land'&&t.type==='road'&&!t.fire&&!t.rubble&&!t.radiation&&!t.highway;
export function pedestrianRoutes(city,limit=96){
 if(city.finance.roadCondition<=20)return[];
 const tiles=city.tiles,n=Math.sqrt(tiles.length),routes=[],used=new Set(),homes=tiles.filter(t=>t.type==='residential'&&t.level>0&&!t.fire&&!t.rubble&&!t.radiation&&t.access);
 // Evenly sample neighborhoods across the whole map, rather than fill the cap from its first corner.
 const stride=Math.max(1,Math.ceil(homes.length/limit));
 for(let h=0;h<homes.length&&routes.length<limit;h+=stride){
  const home=homes[h],starts=[];
  for(let y=Math.max(0,home.y-2);y<=Math.min(n-1,home.y+2);y++)for(let x=Math.max(0,home.x-2);x<=Math.min(n-1,home.x+2);x++)if(safe(tiles[y*n+x]))starts.push(y*n+x);
  starts.sort((a,b)=>Math.hypot(tiles[a].x-home.x,tiles[a].y-home.y)-Math.hypot(tiles[b].x-home.x,tiles[b].y-home.y)||a-b);
  const start=starts.find(i=>!used.has(i));if(start===undefined)continue;
  const path=[start],visited=new Set(path),elevation=tiles[start].elevation;
  for(let step=0;step<7;step++){
   const t=tiles[path.at(-1)],neighbors=[];
   for(const [dx,dy]of [[1,0],[0,1],[-1,0],[0,-1]]){const x=t.x+dx,y=t.y+dy,i=y*n+x;if(x>=0&&y>=0&&x<n&&y<n&&!visited.has(i)&&safe(tiles[i])&&tiles[i].elevation===elevation)neighbors.push(i);}
   if(!neighbors.length)break;
   const next=neighbors[((start+city.seed+step)%neighbors.length+neighbors.length)%neighbors.length];path.push(next);visited.add(next);
  }
  if(path.length<2)continue;used.add(start);
  const points=path.map((index,i)=>{const t=tiles[index],prev=tiles[path[Math.max(0,i-1)]],next=tiles[path[Math.min(path.length-1,i+1)]],a=i?[t.x-prev.x,t.y-prev.y]:[next.x-t.x,next.y-t.y],b=i<path.length-1?[next.x-t.x,next.y-t.y]:a;
   return{x:Math.max(0,Math.min(n-1,t.x-(a[1]+b[1])*.16)),y:Math.max(0,Math.min(n-1,t.y+(a[0]+b[0])*.16))};});
  const lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths.at(-1)+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y));
  routes.push({id:start,home:home.y*n+home.x,path,points,lengths,length:lengths.at(-1),elevation,count:Math.min(3,home.level)});
 }
 return routes;
}
export function pedestrians(city,seconds,routes=pedestrianRoutes(city),limit=180){
 if(city.emergency.active||city.finance.roadCondition<=20)return[];
 const out=[],time=Math.max(0,seconds);
 for(let routeIndex=0;routeIndex<routes.length;routeIndex++){
  const route=routes[routeIndex],allocation=Math.floor((routeIndex+1)*limit/routes.length)-Math.floor(routeIndex*limit/routes.length);
  const home=city.tiles[route.home];if(!home?.level||home.type!=='residential'||home.fire||home.rubble||home.radiation||!home.access||route.path.some(i=>!safe(city.tiles[i])||city.tiles[i].elevation!==route.elevation))continue;
  for(let k=0;k<Math.min(route.count,allocation)&&out.length<limit;k++){
   const speed=.16+(route.id%5)*.012,run=route.length/speed,dwell=1.5,cycle=2*(run+dwell),phase=(time+route.id*.31+k*cycle/route.count)%cycle,back=phase>=run+dwell,part=back?phase-run-dwell:phase,distance=back?route.length-Math.min(run,part)*speed:Math.min(run,part)*speed;
   let segment=0;while(segment<route.points.length-2&&route.lengths[segment+1]<distance)segment++;
   const a=route.points[segment],b=route.points[segment+1],len=route.lengths[segment+1]-route.lengths[segment],f=(distance-route.lengths[segment])/len,direction=back?-1:1;
   out.push({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,dx:(b.x-a.x)/len*direction,dy:(b.y-a.y)/len*direction,tile:route.path[f<.5?segment:segment+1],elevation:route.elevation,gait:part<run?Math.sin((time*2.2+k)*Math.PI*2):0,shirt:SHIRTS[(route.id+k)%SHIRTS.length],skin:SKIN[(route.id+k*3)%SKIN.length]});
  }
  if(out.length>=limit)break;
 }
 return out;
}
export function drawPedestrian(r,v){
 const c=r.ctx,u=r.unit,city=r.getCity(),n=Math.sqrt(city.tiles.length),p=r.project(v.x,v.y),t=city.tiles[Math.max(0,Math.min(n-1,Math.floor(v.y)))*n+Math.max(0,Math.min(n-1,Math.floor(v.x)))];
 p.y+=u/2+((t.elevation||0)-v.elevation)*u*.5;
 if(p.x<-u||p.x>r.w+u||p.y<-u||p.y>r.h+u)return;
 const a=r.transform(v.x,v.y),b=r.transform(v.x+v.dx,v.y+v.dy),vx=(b[0]-a[0]-b[1]+a[1])*u,vy=(b[0]-a[0]+b[1]-a[1])*u*.5,scale=Math.hypot(vx,vy)||1,swing=v.gait*u*.065,dx=vx/scale,dy=vy/scale;
 const limb=(x1,y1,x2,y2,color,width)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
 c.save();c.lineCap='round';c.fillStyle='#18333545';c.beginPath();c.ellipse(p.x,p.y,u*.09,u*.035,0,0,Math.PI*2);c.fill();
 limb(p.x-u*.025,p.y-u*.14,p.x-dx*swing-u*.025,p.y-dy*swing,'#35434b',u*.045);
 limb(p.x+u*.025,p.y-u*.14,p.x+dx*swing+u*.025,p.y+dy*swing,'#465563',u*.045);
 limb(p.x-u*.055,p.y-u*.25,p.x+dx*swing-u*.07,p.y-u*.12+dy*swing,v.skin,u*.036);
 limb(p.x+u*.055,p.y-u*.25,p.x-dx*swing+u*.07,p.y-u*.12-dy*swing,v.skin,u*.036);
 limb(p.x,p.y-u*.25,p.x,p.y-u*.13,v.shirt,u*.12);
 c.fillStyle=v.skin;c.beginPath();c.arc(p.x,p.y-u*.33,u*.055,0,Math.PI*2);c.fill();c.fillStyle='#403b37';c.beginPath();c.arc(p.x-u*.008,p.y-u*.355,u*.049,Math.PI,Math.PI*2);c.fill();c.restore();
}
