import {utilityTrendSnapshot} from './utility-trends.js?v=power-allocation-1';
import {wasteActive,wasteCapacity} from './utilities.js?v=power-allocation-1';
import {validateSave,recompute} from './engine.js?v=power-allocation-1';
import {serializeCity} from './save.js?v=power-allocation-1';
import {ORDINANCES,changeCivic,civicSpending} from './civic.js?v=power-allocation-1';
import {healthOutlook} from './health.js?v=power-allocation-1';
import {educationTargets} from './education.js?v=power-allocation-1';
export const ADVISOR_POLICIES={transport:['carpool','parkingFines'],environment:['cleanAir','cleanWater','trashPresort'],utilities:['powerConservation','waterConservation'],safety:['watch','fireCode','juniorSports'],hea:['freeClinics','reading','juniorSports']};
export function ordinanceSnapshot(c){const s=c.stats,buildings=c.tiles.filter(t=>t.type),targets=educationTargets(c);return {...utilityTrendSnapshot(c),powerDelivered:s.powerServed,waterDelivered:s.waterUsed,recyclingCapacity:c.tiles.filter(t=>t.type==='recycling'&&wasteActive(c,t)).reduce((sum,t)=>sum+wasteCapacity(c,t),0),recyclablePercent:c.civic.ordinances.trashPresort?45:30,balance:s.balance,cost:civicSpending(c).ordinances,revenue:s.ordinanceIncome||0,crime:s.population?s.averageCrime:null,aura:s.population?s.aura:null,air:s.averagePollution,powerDemand:s.powerDemand,waterDemand:s.waterDemand,peakTraffic:s.peakTraffic,cleanIndustry:s.cleanIndustry,flammability:buildings.length?buildings.reduce((sum,t)=>sum+t.flammability,0)/buildings.length:null,lifeTarget:s.population?healthOutlook(c).target:null,schoolTarget:s.population?targets[0]:null,collegeTarget:s.population?targets[1]:null};}
export function analyzeOrdinances(c,ordinances){const projected=validateSave(JSON.parse(serializeCity(c))),before=ordinanceSnapshot(projected);const result=changeCivic(projected,projected.civic.funding,ordinances);if(!result.ok)throw Error(result.error);recompute(projected);return {before,after:ordinanceSnapshot(projected),ordinances:{...projected.civic.ordinances}};}
export {ORDINANCES};
