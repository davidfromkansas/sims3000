import {tunnelEdges} from './tunnels.js?v=first-repayment-1';
// Surface freight does not cross subway transfers. Rail bridges retain their axis.
export function surfaceRailGroups(c){
 const n=c.size,N=c.tiles.length,groups=new Int32Array(N).fill(-1),portals=new Map();
 for(const [a,b]of tunnelEdges(c,'rail')){if(!portals.has(a))portals.set(a,[]);if(!portals.has(b))portals.set(b,[]);portals.get(a).push(b);portals.get(b).push(a);}
 let count=0;for(let i=0;i<N;i++){if(!c.tiles[i].rail||groups[i]>=0)continue;const q=[i];groups[i]=count;
  for(let k=0;k<q.length;k++){const index=q[k],t=c.tiles[index];for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=t.x+dx,y=t.y+dy,j=y*n+x;if(x<0||y<0||x>=n||y>=n||!c.tiles[j].rail||groups[j]>=0)continue;const u=c.tiles[j],axis=dx?'x':'y';if(t.terrain==='water'&&t.railAxis!==axis||u.terrain==='water'&&u.railAxis!==axis)continue;groups[j]=count;q.push(j);}for(const j of portals.get(index)||[])if(c.tiles[j].rail&&groups[j]<0){groups[j]=count;q.push(j);}}
  count++;
 }
 return{groups,count};
}
export function landfillRailFreight(c){
 const empty={access:()=>false,accepts:()=>false};if(c.transport.funding<=0||c.transport.condition<=20||c.transport.underfunded>=6||!c.tiles.some(t=>t.type==='landfill')||!c.tiles.some(t=>t.rail))return empty;
 const railOrigins=new Set(c.region.connections.filter(con=>con.kind==='rail').map(con=>con.tile));
 const {groups,count}=surfaceRailGroups(c),roads=Array.from({length:count},()=>new Set()),sidings=new Map(),n=c.size;
 if(c.finance.roadCondition>20)for(const t of c.tiles)if(['trainStation','railTransfer'].includes(t.type)&&t.stationActive)for(const i of t.stationNodes||[])if(i<c.tiles.length&&groups[i]>=0)for(const id of t.roadIds)roads[groups[i]].add(id);
 for(const t of c.tiles)if(t.type==='landfill'){const ids=new Set();for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=t.x+dx,y=t.y+dy;if(x>=0&&y>=0&&x<n&&y<n&&groups[y*n+x]>=0)ids.add(groups[y*n+x]);}sidings.set(t,ids);}
 return{access:d=>(sidings.get(d)?.size||0)>0,accepts:(source,d)=>{const ids=sidings.get(d);if(!ids?.size)return false;const direct=groups[source.y*n+source.x];return railOrigins.has(source.y*n+source.x)&&ids.has(direct)||[...ids].some(id=>source.roadIds.some(road=>roads[id].has(road)));}};
}
