import {civicRoots,civicCenter} from './civic-footprints.js?v=architecture-collection-43';
import {civicServiceOperating,serviceRadius} from './civic.js?v=architecture-collection-43';
// Orders belong to their station root, so removing another station cannot move them.
// An explicitly dispatched squad is unavailable for automatic precinct response.
export function policeResponses(c){
 const e=c.emergency,r=e.riot;if(!e.active||!r)return[];
 const stations=civicRoots(c).filter(t=>t.type==='police'),responses=[];
 const volunteer=e.policeUnits.find(p=>p.owner===-1);if(volunteer)responses.push({...volunteer,slot:0,automatic:false,strength:1});
 for(const [i,t] of stations.entries()){
  if(!civicServiceOperating(c,t))continue;
  const slot=i+1,assigned=e.policeUnits.find(p=>p.owner===t.y*c.size+t.x),center=civicCenter(t),radius=serviceRadius(c,{...t,serviceActive:true});
  if(!assigned&&Math.hypot(r.x-center.x,r.y-center.y)>radius)continue;
  responses.push({...assigned||{x:r.x,y:r.y},slot,automatic:!assigned,station:t.y*c.size+t.x,strength:c.civic.funding.police/100*(c.stats.jails?.policeEffectiveness??.75)});
 }
 return responses;
}
export function automaticPoliceReport(c){const responses=policeResponses(c),automatic=responses.filter(p=>p.automatic).length;return `<p>Automatic precinct response: <strong>${automatic} squad${automatic===1?'':'s'}</strong>${c.emergency.riot?' at the current riot.':'.'}</p><p>Working police stations send their available squads to riots inside their coverage. Explicitly dispatched squads stay at their assigned position and cannot also respond at home. Burning, unpowered, disconnected or striking stations cannot send squads. The volunteer brigade is always available for manual dispatch.</p>`;}
