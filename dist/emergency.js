import {civicRoots,civicIntact} from './civic-footprints.js?v=performing-arts-center-1';
import {validateTornadoSettings,tornadoVector,validateTornadoMotion} from './tornado-settings.js?v=performing-arts-center-1';
import {DEFAULT_QUAKE_MAGNITUDE,validateQuakeMagnitude,quakeBands,quakeDamageChance} from './earthquake-settings.js?v=performing-arts-center-1';
import {dissolveBuildingLot} from './building-lots.js?v=performing-arts-center-1';
import {freshDisasterRelief,settleDisasterRelief,validateDisasterRelief} from './disaster-relief.js?v=performing-arts-center-1';
import {scenarioAllowsBackground} from './scenario-background-rules.js?v=performing-arts-center-1';
import {freshEmergencyOrder,recordHazard,recordFire,validateEmergencyOrder} from './emergency-order.js?v=performing-arts-center-1';
import {beginEmergencySession,pendingWarnings,refreshShelter,validateHazardWarning} from './emergency-session.js?v=performing-arts-center-1';
import {freshUfo,stepUfo,validateUfo} from './ufo.js?v=performing-arts-center-1';
import {freshWhirlpool,stepWhirlpool,validateWhirlpool} from './whirlpool.js?v=performing-arts-center-1';
import {freshToxicCloud,stepToxicCloud,validateToxicCloud} from './toxic-cloud.js?v=performing-arts-center-1';
import {freshSpaceJunk,stepSpaceJunk,validateSpaceJunk} from './space-junk.js?v=performing-arts-center-1';
import {freshRiots,stepRiot,validateRiots} from './riots.js?v=performing-arts-center-1';
import {freshLocusts,stepLocusts,validateLocusts} from './locusts.js?v=performing-arts-center-1';
import {tunnelTiles} from './tunnels.js?v=performing-arts-center-1';
import {STRUCTURES} from './structures.js?v=performing-arts-center-1';
import {POWER_PLANTS} from './power.js?v=performing-arts-center-1';
import {occupancy} from './utilities.js?v=performing-arts-center-1';
const zones=['residential','commercial','industrial'];
const random=(i,step,seed)=>{let n=Math.imul(i+17,374761393)^Math.imul(step+31,668265263)^seed;return((Math.imul(n^(n>>>13),1274126177)^(n>>>16))>>>0)/4294967296;};
export const freshEmergency=()=>({relief:freshDisasterRelief(),navigationOrder:freshEmergencyOrder(),...freshUfo(),...freshWhirlpool(),...freshToxicCloud(),...freshSpaceJunk(),...freshRiots(),...freshLocusts(),randomFires:false,randomEarthquakes:false,randomTornadoes:false,tornado:null,tornadoes:0,sirenTrust:100,sirenIncident:0,shelter:0,falseAlarms:0,earthquake:null,quakes:0,infrastructureLost:0,active:false,step:0,units:[],nextUnit:0,started:0,contained:0,destroyed:0,displaced:0,resumeSpeed:0});
export const combustible=t=>!t.rubble&&t.terrain==='land'&&(t.nature||zones.includes(t.type)&&(t.level>0||t.historicalLevel>0||t.abandonedLevel>0)||t.type&&!['road','landfill',...zones].includes(t.type));
export function ignite(c,x,y){const n=Math.sqrt(c.tiles.length);if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=n||y>=n)return{ok:false,error:'Choose a tile inside the city.'};const t=c.tiles[y*n+x];if(!combustible(t)||t.fire)return{ok:false,error:'Choose an intact building or trees to start a fire.'};beginEmergencySession(c);recordFire(c,y*n+x);t.fire=40;t.fireAge=0;return{ok:true};}
export function setRandomFires(c,value){if(c.emergency.active)return{ok:false,error:'An active disaster must run its course before changing this setting.'};if(typeof value!=='boolean')return{ok:false,error:'Choose a valid disaster setting.'};c.emergency.randomFires=value;return{ok:true};}
export const fireUnitCapacity=c=>1+civicRoots(c).filter(t=>t.type==='fire'&&civicIntact(c,t)).length;
export function dispatchFire(c,x,y){const n=Math.sqrt(c.tiles.length);if(!c.emergency.active)return{ok:false,error:'No fire emergency is active.'};if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=n||y>=n||c.tiles[y*n+x].terrain==='water')return{ok:false,error:'Dispatch firefighters to a land tile near the fire.'};const limit=fireUnitCapacity(c),e=c.emergency;e.units=e.units.slice(0,limit);if(e.units.length<limit)e.units.push({x,y});else{e.units[e.nextUnit%limit]={x,y};e.nextUnit=(e.nextUnit+1)%limit;}return{ok:true};}
export function emergencyStats(c){return{contaminatedTiles:c.tiles.filter(t=>t.radiation).length,burningTiles:c.tiles.filter(t=>t.fire>0).length,fireUnits:fireUnitCapacity(c),rubbleTiles:c.tiles.filter(t=>t.rubble).length};}
function destroy(c,t){let members=[t];if(t.lotRoot!=null)members=dissolveBuildingLot(c,t);else if(t.type==='industrial'&&t.industry==='farm'&&t.farmRoot!==null)members=c.tiles.filter(u=>u.type==='industrial'&&u.industry==='farm'&&u.farmRoot===t.farmRoot);else if(STRUCTURES[t.type])members=c.tiles.filter(u=>STRUCTURES[u.type]&&u.root===t.root);else if(['airport','seaport'].includes(t.type)&&t.facilityRoot!==null)members=c.tiles.filter(u=>u.facilityRoot===t.facilityRoot);let displaced=0;for(const u of members){if(u.type==='residential')displaced+=occupancy(u.level)*8;const keep=zones.includes(u.type)||['airport','seaport'].includes(u.type);u.type=keep?u.type:null;u.level=0;u.facilityAbandoned=false;u.abandonedLevel=0;u.abandonmentCause=null;u.historicalLevel=0;u.age=0;u.stress=0;u.nature=false;u.root=null;delete u.civicSize;delete u.universitySize;delete u.stadiumSize;u.industry='dirty';u.farmRoot=null;u.rubble=true;u.fire=0;u.fireAge=0;}c.emergency.destroyed++;c.emergency.displaced+=displaced;return displaced;}
export function stepFire(c){const e=c.emergency;if(!e.active)return{ended:false,destroyed:0};e.step++;const alienDamage=stepUfo(c,ufoStrike);const waterDamage=stepWhirlpool(c,whirlpoolDamage);stepToxicCloud(c);const impactDamage=stepSpaceJunk(c,spaceJunkImpact);if(e.riot)stepRiot(c,ignite);if(e.locust)stepLocusts(c);const stormDamage=e.tornado?stepTornado(c):0;const quakeDamage=e.earthquake?stepEarthquake(c):0;e.units=e.units.slice(0,fireUnitCapacity(c));const burning=c.tiles.filter(t=>t.fire>0),n=Math.sqrt(c.tiles.length),spread=new Map();let destroyed=alienDamage+waterDamage+quakeDamage+stormDamage+impactDamage;
 for(const t of burning){if(!t.fire)continue;const flammability=t.nature?45:t.flammability||60;let suppression=Math.max(t.fireCoverage,t.fireProtection||0)*.16;for(let i=0;i<e.units.length;i++){const unit=e.units[i],d=Math.hypot(t.x-unit.x,t.y-unit.y);if(d<=3){const funding=i===0?1:c.stats.strikes.includes('fire')?0:c.civic.funding.fire/100;suppression+=24*(1-d/4)*funding;}}t.fire=Math.max(0,Math.min(100,t.fire+3+flammability*.1-suppression));t.fireAge++;if(t.fire===0)continue;
 for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=t.x+dx,y=t.y+dy,j=y*n+x;if(x<0||y<0||x>=n||y>=n)continue;const u=c.tiles[j];if(!u.fire&&combustible(u)&&random(j,e.step+c.emergency.started*100,c.seed)<.04*(u.nature?45:u.flammability||60)/100*t.fire/50){const order=e.navigationOrder.fires[t.y*n+t.x]??e.navigationOrder.next;spread.set(j,Math.min(spread.get(j)??Infinity,order));}}
 if(t.fire>50&&t.fireAge>=Math.ceil(600/Math.max(10,flammability))){destroy(c,t);destroyed++;}}
 for(const [j,order] of spread){const t=c.tiles[j];if(combustible(t)&&!t.fire){recordFire(c,j,order<e.navigationOrder.next?order:undefined);t.fire=30;t.fireAge=0;}}
 if(!e.earthquake&&!e.ufo&&!e.whirlpool&&!e.toxicCloud&&!e.spaceJunk&&!e.riot&&!e.locust&&!e.tornado&&!c.tiles.some(t=>t.fire>0)){e.active=false;e.policeUnits=[];e.nextPolice=0;e.units=[];e.nextUnit=0;e.contained++;const relief=settleDisasterRelief(c);return{ended:true,destroyed,relief};}return{ended:false,destroyed};}
export function maybeIgnite(c){if(!scenarioAllowsBackground(c,'randomDisasters'))return false;if(!c.emergency.randomFires||c.emergency.active||random(c.month,17,c.seed)>.015)return false;const fuel=c.tiles.filter(combustible);if(!fuel.length)return false;const t=fuel[Math.floor(random(c.month,29,c.seed)*fuel.length)];return ignite(c,t.x,t.y).ok;}
export function validateEmergency(v,tiles,version=34,month=120000){if(!v||typeof v.randomFires!=='boolean'||typeof v.active!=='boolean'||!Array.isArray(v.units)||v.units.length>tiles.length+1||!Number.isInteger(v.nextUnit)||v.nextUnit<0||![0,1,3,8].includes(v.resumeSpeed)||['step','started','contained','destroyed','displaced'].some(k=>!Number.isInteger(v[k])||v[k]<0||v[k]>1e9)||v.active!==(tiles.some(t=>t.fire>0)||!!(version>=22&&v.earthquake)||!!(version>=25&&v.tornado)||!!(version>=31&&v.locust)||!!(version>=33&&v.riot)||!!(version>=42&&v.spaceJunk)||!!(version>=44&&v.toxicCloud)||!!(version>=50&&v.whirlpool)||!!(version>=52&&v.ufo)))throw Error('Invalid emergency state.');const n=Math.sqrt(tiles.length);let earthquake=null;if(version>=22){if(typeof v.randomEarthquakes!=='boolean'||['quakes','infrastructureLost'].some(k=>!Number.isInteger(v[k])||v[k]<0||v[k]>1e9))throw Error('Invalid earthquake data.');if(v.earthquake!==null){const q=v.earthquake,magnitude=version>=115?validateQuakeMagnitude(q?.magnitude):DEFAULT_QUAKE_MAGNITUDE;if(version>=115&&q?.magnitude===undefined)throw Error('Invalid earthquake magnitude.');if(!q||!Number.isInteger(q.x)||!Number.isInteger(q.y)||q.x<0||q.y<0||q.x>=n||q.y>=n||!Number.isInteger(q.ring)||q.ring<0||q.ring>=quakeBands(magnitude)||!v.active||!v.quakes)throw Error('Invalid earthquake state.');earthquake={x:q.x,y:q.y,ring:q.ring,magnitude};}}let tornado=null;if(version>=25){if(typeof v.randomTornadoes!=='boolean'||!Number.isInteger(v.tornadoes)||v.tornadoes<0||v.tornadoes>1e9)throw Error('Invalid tornado data.');if(v.tornado!==null){const t=v.tornado,motion=validateTornadoMotion(t,version);if(!t||version<96&&earthquake||!v.tornadoes||!Number.isInteger(t.x)||!Number.isInteger(t.y)||t.x<0||t.y<0||t.x>=n||t.y>=n||!Number.isInteger(t.dx)||!Number.isInteger(t.dy)||(version<116?Math.abs(t.dx)+Math.abs(t.dy)!==1:Math.max(Math.abs(t.dx),Math.abs(t.dy))!==1)||!Number.isInteger(t.age)||t.age<0||t.age>=motion.distance)throw Error('Invalid tornado state.');if(version>=26&&(!Number.isInteger(t.warningSteps)||t.warningSteps<0||t.warningSteps>8||t.warningSteps>0&&t.age!==0))throw Error('Invalid tornado warning.');tornado={x:t.x,y:t.y,dx:t.dx,dy:t.dy,age:t.age,warningSteps:version>=26?t.warningSteps:0,...validateHazardWarning(t,v,version),...motion};}}if(version>=26&&(!Number.isInteger(v.sirenTrust)||v.sirenTrust<0||v.sirenTrust>100||!Number.isInteger(v.sirenIncident)||v.sirenIncident<0||v.sirenIncident>v.started||!Number.isFinite(v.shelter)||v.shelter<0||v.shelter>.6||!Number.isInteger(v.falseAlarms)||v.falseAlarms<0||v.falseAlarms>1e9||v.shelter>0&&(!tornado&&!(version>=52&&v.ufo)||v.sirenIncident!==v.started)))throw Error('Invalid warning siren state.');if(version>=96&&v.shelter!==Math.max(v.tornado?.shelter||0,v.ufo?.shelter||0))throw Error('Inconsistent warning siren protection.');const units=v.units.map(u=>{if(!u||!Number.isInteger(u.x)||!Number.isInteger(u.y)||u.x<0||u.y<0||u.x>=n||u.y>=n)throw Error('Invalid firefighter dispatch.');return{x:u.x,y:u.y};});return{relief:validateDisasterRelief(v.relief,v,version,month),navigationOrder:validateEmergencyOrder(v,tiles,version),...validateUfo(v,n,version),...validateWhirlpool(v,tiles,version),...validateToxicCloud(v,n,version),...validateSpaceJunk(v,n,version),...validateRiots(v,n,version,tiles),...validateLocusts(v,n,version),randomFires:v.randomFires,randomEarthquakes:version>=22?v.randomEarthquakes:false,randomTornadoes:version>=25?v.randomTornadoes:false,tornado,tornadoes:version>=25?v.tornadoes:0,sirenTrust:version>=26?v.sirenTrust:100,sirenIncident:version>=26?v.sirenIncident:0,shelter:version>=26?v.shelter:0,falseAlarms:version>=26?v.falseAlarms:0,earthquake,quakes:version>=22?v.quakes:0,infrastructureLost:version>=22?v.infrastructureLost:0,active:v.active,step:v.step,units,nextUnit:v.nextUnit,started:v.started,contained:v.contained,destroyed:v.destroyed,displaced:v.displaced,resumeSpeed:v.resumeSpeed};}

export function explodePlant(c,t){const type=t.type,def=POWER_PLANTS[type];if(!def)return null;const {x,y}=t,n=Math.sqrt(c.tiles.length),alreadyActive=c.emergency.active;beginEmergencySession(c);destroy(c,t);let fires=0;for(let yy=Math.max(0,y-1);yy<Math.min(n,y+def.size+1);yy++)for(let xx=Math.max(0,x-1);xx<Math.min(n,x+def.size+1);xx++){const u=c.tiles[yy*n+xx];if(combustible(u)&&!u.fire&&ignite(c,xx,yy).ok)fires++;}const contaminated=type==='nuclear'?contaminate(c,x+(def.size-1)/2,y+(def.size-1)/2):0;if(!fires&&!alreadyActive){c.emergency.active=false;c.emergency.contained++;settleDisasterRelief(c);}return{type,x,y,fires,contaminated};}

// The manual specifies lasting abandonment, not a numeric fallout radius.
// This reconstruction uses a five-tile radius with no player cleanup mechanism.
export function contaminate(c,x,y){let affected=0;for(const t of c.tiles){if(Math.hypot(t.x-x,t.y-y)>5)continue;if(t.lotRoot!=null)destroy(c,t);if(!t.radiation)affected++;t.radiation=true;if(t.type==='residential')c.emergency.displaced+=occupancy(t.level)*8;if(zones.includes(t.type)||['airport','seaport'].includes(t.type)){t.level=0;t.age=0;t.stress=0;}}return affected;}

// Default magnitude preserves eight damage bands. Strength and radius scaling are original tuning.
export function startEarthquake(c,x,y,magnitude=DEFAULT_QUAKE_MAGNITUDE){
 try{validateQuakeMagnitude(magnitude);}catch(error){return{ok:false,error:error.message};}
 const n=Math.sqrt(c.tiles.length),e=c.emergency;
 if(e.earthquake)return{ok:false,error:'An earthquake is already active.'};
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=n||y>=n||c.tiles[y*n+x].terrain!=='land')return{ok:false,error:'Choose a land tile for the earthquake epicenter.'};
 beginEmergencySession(c);recordHazard(e,'earthquake');e.quakes++;e.earthquake={x,y,ring:0,magnitude};return{ok:true};
}
export function setRandomEarthquakes(c,value){
 if(c.emergency.active)return{ok:false,error:'Finish the active disaster before changing this setting.'};
 if(typeof value!=='boolean')return{ok:false,error:'Choose a valid disaster setting.'};
 c.emergency.randomEarthquakes=value;return{ok:true};
}
export function maybeEarthquake(c){if(!scenarioAllowsBackground(c,'randomDisasters'))return false;
 if(!c.emergency.randomEarthquakes||c.emergency.active||random(c.month,47,c.seed)>.005)return false;
 const land=c.tiles.filter(t=>t.terrain==='land');if(!land.length)return false;
 const t=land[Math.floor(random(c.month,53,c.seed)*land.length)];return startEarthquake(c,t.x,t.y).ok;
}
function stepEarthquake(c){
 const e=c.emergency,q=e.earthquake,n=Math.sqrt(c.tiles.length),before=e.destroyed,hit=new Set();q.ring++;
 for(let i=0;i<c.tiles.length;i++){
  const t=c.tiles[i],distance=Math.hypot(t.x-q.x,t.y-q.y);
  if(Math.max(1,Math.ceil(distance))!==q.ring)continue;
  const roll=random(i,e.quakes*131,c.seed),chance=quakeDamageChance(distance,q.magnitude);
  if(roll<chance){
   hit.add(i);
   for(const k of ['pipe','subway','rail','highway'])if(t[k]){t[k]=false;e.infrastructureLost++;}
   t.railAxis=null;t.highwayAxis=null;
   if(t.type==='road'||t.type==='powerline'){t.type=null;t.bridgeAxis=null;t.rubble=true;e.infrastructureLost++;}
   else if(combustible(t))destroy(c,t);
  }else if(roll<chance+.15*(q.magnitude/50)&&combustible(t)&&!t.fire)ignite(c,t.x,t.y);
 }
 c.tunnels=c.tunnels.filter(t=>{if(!tunnelTiles(c,t).some(i=>hit.has(i)))return true;e.infrastructureLost++;return false;});
 if(q.ring===quakeBands(q.magnitude))e.earthquake=null;
 return e.destroyed-before;
}

export function startTornado(c,x,y,options){
 let settings;try{settings=validateTornadoSettings(options);}catch(error){return{ok:false,error:error.message};}
 const n=Math.sqrt(c.tiles.length),e=c.emergency;
 if(e.tornado)return{ok:false,error:'A tornado is already active.'};
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=n||y>=n)return{ok:false,error:'Choose a tile inside the city.'};
 const [dx,dy]=tornadoVector(settings.direction,x,y,n);
 beginEmergencySession(c);recordHazard(e,'tornado');e.tornadoes++;
 e.tornado={x,y,dx,dy,age:0,warningSteps:settings.warning?8:0,warned:false,shelter:0,intensity:settings.intensity,distance:settings.distance,speed:settings.speed,phase:0};return{ok:true};
}
export function setRandomTornadoes(c,value){if(c.emergency.active)return{ok:false,error:'Finish the active disaster before changing this setting.'};if(typeof value!=='boolean')return{ok:false,error:'Choose a valid disaster setting.'};c.emergency.randomTornadoes=value;return{ok:true};}
export function maybeTornado(c){if(!scenarioAllowsBackground(c,'randomDisasters'))return false;
 if(!c.emergency.randomTornadoes||c.emergency.active||random(c.month,71,c.seed)>.005)return false;
 const n=Math.sqrt(c.tiles.length),side=Math.floor(random(c.month,73,c.seed)*4),along=Math.floor(random(c.month,79,c.seed)*n);
 return startTornado(c,side===0?0:side===1?n-1:along,side===2?0:side===3?n-1:along).ok;
}
function stepTornado(c){
 const e=c.emergency,s=e.tornado,before=e.destroyed;
 if(s.warningSteps>0){s.warningSteps--;return 0;}
 if(s.phase){s.phase--;return 0;}
 for(let i=0;i<(s.speed==='fast'?2:1)&&e.tornado;i++)stepTornadoCell(c);
 if(e.tornado&&s.speed==='slow')s.phase=1;
 return e.destroyed-before;
}
function stepTornadoCell(c){
 const e=c.emergency,s=e.tornado,n=Math.sqrt(c.tiles.length),hit=new Set();
 for(let y=Math.max(0,s.y-1);y<=Math.min(n-1,s.y+1);y++)for(let x=Math.max(0,s.x-1);x<=Math.min(n-1,s.x+1);x++){
  const i=y*n+x,t=c.tiles[i],center=x===s.x&&y===s.y,roll=random(i,e.tornadoes*157+s.age,c.seed);
  if(roll<(center?Math.min(1,s.intensity/50):.55*(s.intensity/50))){
   hit.add(i);for(const k of ['rail','highway'])if(t[k]){t[k]=false;e.infrastructureLost++;}t.railAxis=null;t.highwayAxis=null;
   if(t.type==='road'||t.type==='powerline'){t.type=null;t.bridgeAxis=null;t.rubble=true;e.infrastructureLost++;}
   else if(combustible(t)&&(t.nature||random(i,e.tornadoes*191+s.age,c.seed)>=(s.shelter||0)))destroy(c,t);
  }else if(roll<.67*(s.intensity/50)&&combustible(t)&&!t.fire&&(t.nature||random(i,e.tornadoes*191+s.age,c.seed)>=(s.shelter||0)))ignite(c,x,y);
 }
 // Wind damages exposed portals; covered tunnel spans and buried utilities survive.
 c.tunnels=c.tunnels.filter(t=>{if(!hit.has(t.a)&&!hit.has(t.b))return true;e.infrastructureLost++;return false;});
 s.age++;const x=s.x+s.dx,y=s.y+s.dy;
 if(s.age>=s.distance||x<0||y<0||x>=n||y>=n){e.tornado=null;refreshShelter(e);}else{s.x=x;s.y=y;}
}

export function soundSiren(c){
 const e=c.emergency;
 if(e.tornado?.warningSteps>0||e.ufo?.warningSteps>0){
  const warnings=pendingWarnings(e);if(!warnings.length)return{ok:false,error:'The active warnings have already been sounded.'};
  e.sirenIncident=e.started;for(const hazard of warnings){hazard.warned=true;hazard.shelter=.6*e.sirenTrust/100;}refreshShelter(e);e.sirenTrust=Math.min(100,e.sirenTrust+5);
  return{ok:true,message:e.shelter?'Warning sounded. Residents are taking shelter before impact.':'Warning sounded, but repeated false alarms have exhausted public trust.'};
 }
 if(e.active)return{ok:false,error:'The disaster has already struck. The early warning siren must sound before impact.'};
 e.sirenTrust=Math.max(0,e.sirenTrust-20);e.falseAlarms++;
 return{ok:true,message:'False alarm. Public trust fell; fewer residents may heed the next warning.'};
}

function spaceJunkImpact(c,x,y){const e=c.emergency,n=Math.sqrt(c.tiles.length),i=y*n+x,t=c.tiles[i],before=e.destroyed;if(t.terrain==='water')return 0;
 for(const key of ['rail','highway'])if(t[key]){t[key]=false;e.infrastructureLost++;}t.railAxis=null;t.highwayAxis=null;
 if(['road','powerline'].includes(t.type)){t.type=null;t.bridgeAxis=null;t.rubble=true;e.infrastructureLost++;}else if(combustible(t))destroy(c,t);
 c.tunnels=c.tunnels.filter(t=>{if(t.a!==i&&t.b!==i)return true;e.infrastructureLost++;return false;});
 for(let yy=Math.max(0,y-1);yy<=Math.min(n-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(n-1,x+1);xx++){const u=c.tiles[yy*n+xx];if(combustible(u)&&!u.fire)ignite(c,xx,yy);}
 return e.destroyed-before;
}

function whirlpoolDamage(c,t){const e=c.emergency,before=e.destroyed,i=t.y*Math.sqrt(c.tiles.length)+t.x;
 for(const key of ['rail','highway'])if(t[key]){t[key]=false;e.infrastructureLost++;}t.railAxis=null;t.highwayAxis=null;
 if(['road','powerline'].includes(t.type)){t.type=null;t.bridgeAxis=null;t.rubble=t.terrain==='land';e.infrastructureLost++;}else if(combustible(t))destroy(c,t);
 c.tunnels=c.tunnels.filter(tunnel=>{if(tunnel.a!==i&&tunnel.b!==i)return true;e.infrastructureLost++;return false;});
 return e.destroyed-before;
}

function ufoStrike(c,x,y){const e=c.emergency,n=Math.sqrt(c.tiles.length),before=e.destroyed;
 for(let yy=Math.max(0,y-1);yy<=Math.min(n-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(n-1,x+1);xx++){const t=c.tiles[yy*n+xx];if(!t.nature&&random(yy*n+xx,e.ufoAttacks*211+e.ufo.age,c.seed)<(e.ufo.shelter||0))continue;whirlpoolDamage(c,t);}
 return e.destroyed-before;
}
