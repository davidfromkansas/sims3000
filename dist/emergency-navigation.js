const DISASTERS={ufo:'Alien attack',whirlpool:'Whirlpool',toxicCloud:'Toxic cloud',spaceJunk:'Falling space junk',riot:'Riot',locust:'Locust swarm',tornado:'Tornado',earthquake:'Earthquake'};
export function emergencyLocations(c){
 if(!c.emergency.active)return[];
 const out=[];for(const [kind,label]of Object.entries(DISASTERS)){const t=c.emergency[kind];if(t)out.push({id:kind,label,x:t.x,y:t.y,tiles:0});}
 const size=c.size||Math.sqrt(c.tiles.length),seen=new Uint8Array(c.tiles.length),fires=[];
 for(let i=0;i<c.tiles.length;i++){
  if(seen[i]||!c.tiles[i].fire)continue;
  const members=[i];seen[i]=1;let oldest=i;
  for(let head=0;head<members.length;head++){
   const j=members[head],t=c.tiles[j];
   if(t.fireAge>c.tiles[oldest].fireAge||t.fireAge===c.tiles[oldest].fireAge&&j<oldest)oldest=j;
   for(let y=Math.max(0,t.y-1);y<=Math.min(size-1,t.y+1);y++)for(let x=Math.max(0,t.x-1);x<=Math.min(size-1,t.x+1);x++){
    const k=y*size+x;if(seen[k]||!c.tiles[k].fire)continue;seen[k]=1;members.push(k);
   }
  }
  const t=c.tiles[oldest];fires.push({id:'fire:'+oldest,label:'Fire area',x:t.x,y:t.y,tiles:members.length,age:t.fireAge,members});
 }
 fires.sort((a,b)=>b.age-a.age||a.y-b.y||a.x-b.x);
 return out.concat(fires);
}
export function createEmergencyNavigator(){
 let previousCity=null,previousIncident=-1,last=null,position=-1;
 return(c,id)=>{
  if(c!==previousCity||c.emergency.started!==previousIncident){previousCity=c;previousIncident=c.emergency.started;last=null;position=-1;}
  const locations=emergencyLocations(c);
  if(!locations.length){last=null;position=-1;return null;}
  let index;
  if(id!==undefined){index=locations.findIndex(t=>t.id===id);if(index<0)return null;}
  else {
   const previous=last?locations.findIndex(t=>t.id===last.id||last.id.startsWith('fire:')&&t.members?.includes(last.y*(c.size||Math.sqrt(c.tiles.length))+last.x)):-1;
   index=previous>=0?(previous+1)%locations.length:Math.max(0,position)%locations.length;
  }
  position=index;last=locations[index];return{...last,position:index+1,total:locations.length};
 };
}
export function focusEmergencyLocation(renderer,target){
 const p=renderer.project(target.x,target.y);
 renderer.pan.x+=renderer.w/2-p.x;renderer.pan.y+=renderer.h/2-p.y-renderer.unit/2;
 renderer.hover=null;renderer.drag=null;renderer.dirty=true;
}
