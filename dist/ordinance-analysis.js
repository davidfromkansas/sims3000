import {validateSave,recompute} from './engine.js?v=abandoned-recovery-1';
import {serializeCity} from './save.js?v=abandoned-recovery-1';
import {ORDINANCES,changeCivic,civicSpending} from './civic.js?v=abandoned-recovery-1';
import {healthOutlook} from './health.js?v=abandoned-recovery-1';
import {educationTargets} from './education.js?v=abandoned-recovery-1';
export const ADVISOR_POLICIES={safety:['watch','fireCode','juniorSports'],hea:['freeClinics','reading','juniorSports']};
export function ordinanceSnapshot(c){const s=c.stats,buildings=c.tiles.filter(t=>t.type),targets=educationTargets(c);return {balance:s.balance,cost:civicSpending(c).ordinances,revenue:s.ordinanceIncome||0,crime:s.population?s.averageCrime:null,aura:s.population?s.aura:null,air:s.averagePollution,powerDemand:s.powerDemand,waterDemand:s.waterDemand,peakTraffic:s.peakTraffic,cleanIndustry:s.cleanIndustry,flammability:buildings.length?buildings.reduce((sum,t)=>sum+t.flammability,0)/buildings.length:null,lifeTarget:s.population?healthOutlook(c).target:null,schoolTarget:s.population?targets[0]:null,collegeTarget:s.population?targets[1]:null};}
export function analyzeOrdinances(c,ordinances){const projected=validateSave(JSON.parse(serializeCity(c))),before=ordinanceSnapshot(projected);const result=changeCivic(projected,projected.civic.funding,ordinances);if(!result.ok)throw Error(result.error);recompute(projected);return {before,after:ordinanceSnapshot(projected),ordinances:{...projected.civic.ordinances}};}
export {ORDINANCES};
