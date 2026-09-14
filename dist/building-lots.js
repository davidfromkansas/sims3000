// Multi-tile RCI lifecycle helpers. Occupancy and services remain distributed
// over members; identity, growth and destruction are shared by the lot.
const ZONES=new Set(['residential','commercial','industrial']);
const index=(c,t)=>t.y*c.size+t.x;
const synchronized=['type','density','level','historicalLevel','abandonedLevel','abandonmentCause','industry','age','stress'];
const fail=()=>{throw Error('Invalid residential, commercial or industrial building lot.');};
export function deriveBuildingLots(c){
 const groups=new Map();for(let i=0;i<c.tiles.length;i++){const t=c.tiles[i];if(t.lotRoot==null)continue;if(!Number.isInteger(t.lotRoot)||t.lotRoot<0||t.lotRoot>=c.tiles.length)fail();if(!groups.has(t.lotRoot))groups.set(t.lotRoot,[]);groups.get(t.lotRoot).push(i);}
 const result=new Map();for(const [root,ids] of groups){const r=c.tiles[root];if(!r||r.lotRoot!==root||!ZONES.has(r.type)||r.industry==='farm'||!(r.level||r.historicalLevel||r.abandonedLevel))fail();const width=Math.max(...ids.map(i=>c.tiles[i].x))-r.x+1,height=Math.max(...ids.map(i=>c.tiles[i].y))-r.y+1;
  if(width<1||height<1||width>5||height>5||width*height<2||ids.length!==width*height||r.x+width>c.size||r.y+height>c.size)fail();
  for(const i of ids){const t=c.tiles[i];if(t.x<r.x||t.y<r.y||t.x>=r.x+width||t.y>=r.y+height||t.terrain!=='land'||t.elevation!==r.elevation||t.rubble||t.radiation||t.rail||t.highway||synchronized.some(k=>t[k]!==r[k]))fail();}
  for(let y=r.y;y<r.y+height;y++)for(let x=r.x;x<r.x+width;x++)if(c.tiles[y*c.size+x].lotRoot!==root)fail();result.set(root,{root,x:r.x,y:r.y,width,height,ids});
 }
 return result;
}
export function buildingLotMembers(c,t){if(t.lotRoot==null)return[t];const lot=c.buildingLots?.get(t.lotRoot);if(!lot)fail();return lot.ids.map(i=>c.tiles[i]);}
export function buildingLotCandidate(c,t,width,height=width){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>5||height>5||width*height<2||!ZONES.has(t.type)||t.density<2||t.x+width>c.size||t.y+height>c.size)return null;
 const members=[];for(let y=t.y;y<t.y+height;y++)for(let x=t.x;x<t.x+width;x++){const u=c.tiles[y*c.size+x];if(u.type!==t.type||u.density!==t.density||u.elevation!==t.elevation||u.terrain!=='land'||u.level||u.historicalLevel||u.abandonedLevel||u.lotRoot!=null||u.industry==='farm'||u.rubble||u.radiation||u.fire||u.rail||u.highway||!u.powered||!u.watered||!u.access||u.waste>=20)return null;members.push(u);}return members;
}
export function formBuildingLot(c,t,width,height=width){const members=buildingLotCandidate(c,t,width,height);if(!members)return null;const root=index(c,t);for(const u of members){u.lotRoot=root;u.level=1;u.age=0;u.stress=0;u.abandonedLevel=0;u.industry=t.industry;u.nature=false;}const lot={root,x:t.x,y:t.y,width,height,ids:members.map(u=>index(c,u))};if(!c.buildingLots)c.buildingLots=new Map();c.buildingLots.set(root,lot);return lot;}
export function updateBuildingLot(c,t,changes){const allowed=['level','age','stress','abandonedLevel','abandonmentCause','historicalLevel','industry'];if(Object.keys(changes).some(k=>!allowed.includes(k)))throw Error('Invalid building lifecycle update.');for(const u of buildingLotMembers(c,t))Object.assign(u,changes);}
export function dissolveBuildingLot(c,t){const members=buildingLotMembers(c,t),root=t.lotRoot;for(const u of members)u.lotRoot=null;if(root!=null)c.buildingLots.delete(root);return members;}
export const isBuildingLotRoot=(c,t)=>t.lotRoot==null||t.lotRoot===index(c,t);
