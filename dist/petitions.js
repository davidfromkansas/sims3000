import {ORDINANCES,changeCivic,ordinanceCost} from './civic.js?v=scenario-calculations-1';
import {recompute,validateSave} from './engine.js?v=scenario-calculations-1';
import {serializeCity} from './save.js?v=scenario-calculations-1';
import {healthOutlook} from './health.js?v=scenario-calculations-1';
export const POLICY_PETITIONS={
 freeClinics:{who:'Residents’ health committee',why:'Hospital access is limited. Help residents with free clinics while expanding care.',enact:true,needed:c=>c.stats.healthCoverage<60},
 reading:{who:'Parents and readers association',why:'Education remains low. Support a reading campaign alongside schools and libraries.',enact:true,needed:c=>c.civic.education<50},
 watch:{who:'Neighborhood council',why:'Residents are concerned about crime. Support a neighborhood watch program.',enact:true,needed:c=>c.stats.averageCrime>25},
 fireCode:{who:'Fire prevention council',why:'Station coverage is thin. Reduce building flammability while expanding fire protection.',enact:true,needed:c=>c.stats.fireCoverage<50},
 cleanAir:{who:'Clean air coalition',why:'Air pollution is troubling the city. Regulate traffic and industrial emissions.',enact:true,needed:c=>c.stats.averagePollution>20},
 powerConservation:{who:'Energy users association',why:'Power plants are overloaded. Reduce demand while adding reliable generation.',enact:true,needed:c=>c.stats.overloadedPlants>0},
 waterConservation:{who:'Water users association',why:'Water demand exceeds local capacity. Reduce demand while improving supply and connections.',enact:true,needed:c=>c.stats.waterDemand>c.stats.waterCapacity},
 parkingFines:{who:'Drivers association',why:'Resident wellbeing is low. Repeal parking fines to remove their aura penalty, at the cost of their revenue.',enact:false,needed:c=>c.stats.aura<45}
};
export const freshPetitions=()=>({});
export function validatePetitions(v,month){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!Object.hasOwn(POLICY_PETITIONS,k)))throw Error('Invalid petition decisions.');return Object.fromEntries(Object.entries(v).map(([id,r])=>{if(!r||!['accepted','rejected','dismissed'].includes(r.action)||!Number.isInteger(r.month)||r.month<0||r.month>month)throw Error('Invalid petition decision history.');return[id,{action:r.action,month:r.month}];}));}
export const petitionReturnMonth=r=>r.month+(r.action==='rejected'?12:6);
export function activePolicyPetitions(c){if(!c.stats.population)return[];return Object.entries(POLICY_PETITIONS).filter(([id,p])=>c.civic.ordinances[id]!==p.enact&&p.needed(c)&&(!c.petitions?.[id]||c.month>=petitionReturnMonth(c.petitions[id]))).map(([id,p])=>({id,...p,name:ORDINANCES[id].name,description:ORDINANCES[id].description,monthlyCost:ordinanceCost(c,id)}));}
export function respondToPetition(c,id,action){const p=activePolicyPetitions(c).find(p=>p.id===id);if(!p||!['accepted','rejected','dismissed'].includes(action))throw Error('This petition is no longer awaiting a decision.');if(action==='accepted'){const r=changeCivic(c,c.civic.funding,{...c.civic.ordinances,[id]:p.enact});if(!r.ok)throw Error(r.error);recompute(c);}c.petitions[id]={action,month:c.month};return p;}
const impactValues=c=>({balance:c.stats.balance,crime:c.stats.averageCrime,aura:c.stats.aura,healthTarget:healthOutlook(c).target,powerDemand:c.stats.powerDemand,waterDemand:c.stats.waterDemand});
export function petitionImpact(c,id){const p=activePolicyPetitions(c).find(p=>p.id===id);if(!p)throw Error('This petition is no longer active.');const projected=validateSave(JSON.parse(serializeCity(c)));changeCivic(projected,projected.civic.funding,{...projected.civic.ordinances,[id]:p.enact});recompute(projected);return{before:impactValues(c),after:impactValues(projected)};}
