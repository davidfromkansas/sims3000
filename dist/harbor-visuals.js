// Visual shipping follows open water from operating ports. It does not add cargo income.
const directions=[[1,0],[-1,0],[0,1],[0,-1]];
export function harborPaths(c){
 const n=Math.sqrt(c.tiles.length),ports=(c.stats.facilityPlots||[]).filter(p=>p.type==='seaport'&&p.operating).slice(0,12);if(!ports.length)return[];
 const open=t=>t.terrain==='water'&&!t.type&&!t.rail&&!t.highway&&!t.rubble&&!t.radiation;
 const links=i=>{const t=c.tiles[i];return directions.map(([dx,dy])=>[t.x+dx,t.y+dy]).filter(([x,y])=>x>=0&&y>=0&&x<n&&y<n).map(([x,y])=>y*n+x);};
 const distance=new Int32Array(c.tiles.length).fill(-1),next=new Int32Array(c.tiles.length).fill(-1),queue=[];
 for(let i=0;i<c.tiles.length;i++){const t=c.tiles[i];if(open(t)&&(t.x===0||t.y===0||t.x===n-1||t.y===n-1)){distance[i]=0;queue.push(i);}}
 for(let k=0;k<queue.length;k++){const i=queue[k];for(const j of links(i))if(open(c.tiles[j])&&distance[j]<0){distance[j]=distance[i]+1;next[j]=i;queue.push(j);}}
 const result=[];for(const port of ports){const docks=[...new Set(port.ids.flatMap(links))].filter(i=>open(c.tiles[i])&&distance[i]>1).sort((a,b)=>distance[b]-distance[a]||a-b);if(!docks.length)continue;const path=[];for(let i=docks[0];i>=0;i=next[i])path.push(i);result.push({root:port.root,path});}return result;
}
export function harborShips(c,seconds,routes=harborPaths(c)){
 return routes.map(({root,path})=>{const length=path.length-1,travel=length/.25,dwell=3,cycle=2*(travel+dwell),phase=(Math.max(0,seconds)+(root%7)*2)%cycle,back=phase>=travel+dwell,part=back?phase-travel-dwell:phase,moving=part>=dwell,distance=Math.min(length,Math.max(0,part-dwell)*.25),position=back?length-distance:distance,segment=Math.min(length-1,Math.floor(position)),fraction=position-segment,a=c.tiles[path[segment]],b=c.tiles[path[segment+1]],sign=back?-1:1;return{tile:path[fraction<.5?segment:segment+1],x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction,dx:(b.x-a.x)*sign,dy:(b.y-a.y)*sign,moving,root};});
}
export function drawHarborShip(r,v,wake=true){
 const c=r.ctx,u=r.unit,center=r.project(v.x,v.y);if(center.x<-u*2||center.y<-u*2||center.x>r.w+u*2||center.y>r.h+u*2)return;
 const point=(a,b,z=0)=>{const p=r.project(v.x+v.dx*a-v.dy*b,v.y+v.dy*a+v.dx*b);return{x:p.x,y:p.y+u/2-z*u};};
 const polygon=(points,color)=>{c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fillStyle=color;c.fill();};
 const prism=(shape,z,height,top,side)=>{const bottom=shape.map(([a,b])=>point(a,b,z)),roof=shape.map(([a,b])=>point(a,b,z+height));shape.map((_,i)=>[bottom[i],bottom[(i+1)%shape.length],roof[(i+1)%shape.length],roof[i]]).sort((a,b)=>a.reduce((s,p)=>s+p.y,0)-b.reduce((s,p)=>s+p.y,0)).forEach(face=>polygon(face,side));polygon(roof,top);};
 if(wake&&v.moving){for(const side of [-1,1])r.line([point(-.37,side*.08),point(-.65,side*.16)],'#d5eee5aa',Math.max(.6,u*.025));}
 const hull=[[-.4,-.14],[.25,-.14],[.46,0],[.25,.14],[-.4,.14]];polygon(hull.map(([a,b])=>point(a,b+.045)), '#254f5650');prism(hull,.015,.11,'#d8c9a7','#314951');
 const box=(a,b,l,w,z,h,top,side)=>prism([[a-l/2,b-w/2],[a+l/2,b-w/2],[a+l/2,b+w/2],[a-l/2,b+w/2]],z,h,top,side);
 for(const [i,a]of [-.16,.02,.20].entries())box(a,0,.15,.22,.13,.10,['#cb7959','#79a0a3','#c5a455'][(i+v.root)%3],['#965039','#4b7279','#927335'][(i+v.root)%3]);
 box(-.31,0,.16,.23,.13,.20,'#eee9d5','#9caeac');box(-.31,0,.12,.18,.32,.015,'#536e77','#435c64');
}
