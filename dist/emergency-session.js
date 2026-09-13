import {beginReliefAssessment} from './disaster-relief.js?v=available-job-targets-1';
import {freshEmergencyOrder} from './emergency-order.js?v=available-job-targets-1';
// One response session can contain several different major hazards and fire areas.
export function beginEmergencySession(c){const e=c.emergency;if(!e.active){e.navigationOrder=freshEmergencyOrder();e.started++;beginReliefAssessment(c);e.units=[];e.nextUnit=0;e.policeUnits=[];e.nextPolice=0;e.shelter=0;}e.active=true;}
export function pendingWarnings(e){return[e.tornado,e.ufo].filter(s=>s&&s.warningSteps>0&&!s.warned);}
export function refreshShelter(e){e.shelter=Math.max(e.tornado?.shelter||0,e.ufo?.shelter||0);}
export function validateHazardWarning(s,e,version){
 if(version<96)return{warned:e.active&&e.sirenIncident===e.started,shelter:e.shelter||0};
 if(typeof s.warned!=='boolean'||!Number.isFinite(s.shelter)||s.shelter<0||s.shelter>.6||!s.warned&&s.shelter!==0)throw Error('Invalid hazard warning protection.');
 return{warned:s.warned,shelter:s.shelter};
}
