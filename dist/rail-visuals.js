// Visual train samples follow connected, passenger-carrying surface tracks.
// They do not add commuters or prescribe the simulation's individual journeys.
export function railPaths(c){
 const n=Math.sqrt(c.tiles.length),adj=new Map(),used=new Set(),paths=[];
 for(let i=0;i<c.tiles.length;i++){const t=c.tiles[i];if(!t.rail||!(t.railRiders>0))continue;const links=[];for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=t.x+dx,y=t.y+dy;if(x<0||y<0||x>=n||y>=n)continue;const j=y*n+x,u=c.tiles[j],axis=dx?'x':'y';if(u.rail&&u.railRiders>0&&!(t.terrain==='water'&&t.railAxis!==axis||u.terrain==='water'&&u.railAxis!==axis))links.push(j);}adj.set(i,links);}
 const edge=(a,b)=>a<b?a+':'+b:b+':'+a;
 const trace=(a,b)=>{const path=[a];let previous=a,current=b;while(!used.has(edge(previous,current))){used.add(edge(previous,current));path.push(current);const next=adj.get(current);if(next.length!==2)break;const follow=next.find(i=>i!==previous);previous=current;current=follow;}if(path.length>1)paths.push(path);};
 for(const [i,links]of adj)if(links.length!==2)for(const j of links)trace(i,j);
 for(const [i,links]of adj)for(const j of links)trace(i,j);
 return paths;
}
export function railVehicles(c,seconds,limit=72,paths=railPaths(c),contains=null){
 const out=[];for(const path of paths){const length=path.length-1,run=(length-.6)/.7,dwell=1.2,cycle=2*(run+dwell),phase=(Math.max(0,seconds)+path[0]*.137)%cycle,back=phase>=run+dwell,part=back?phase-run-dwell:phase,distance=.3+Math.min(run,part)*.7,center=back?length-distance:distance,direction=back?-1:1;
  for(let coach=0;coach<3;coach++){if(out.length>=limit)return out;const position=Math.max(0,Math.min(length,center+(coach-1)*.27)),segment=Math.min(length-1,Math.floor(position)),f=position-segment,a=c.tiles[path[segment]],b=c.tiles[path[segment+1]];const vehicle={x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,dx:(b.x-a.x)*direction,dy:(b.y-a.y)*direction,tile:path[f<.5?segment:segment+1],cab:coach===(back?0:2)};if(!contains||contains(vehicle.x,vehicle.y))out.push(vehicle);}
 }return out;
}
