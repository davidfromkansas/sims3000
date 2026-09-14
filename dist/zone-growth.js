import {economicGrowthFits} from './economic-cap.js?v=theme-park-1';
import {residentialGrowthFits} from './residential-cap.js?v=theme-park-1';
import {abandonmentExplanation} from './abandonment-history.js?v=theme-park-1';
import {landDensityLimit} from './economy.js?v=theme-park-1';
import {needsEstablishedWater} from './water-service.js?v=theme-park-1';
import {buildingLotMembers,isBuildingLotRoot} from './building-lots.js?v=theme-park-1';
export function zoneGrowthConditions(c,t,members=buildingLotMembers(c,t)){
 const blocked=new Set();let demand=Infinity,limit=3;
 for(const u of members){if(u.radiation)blocked.add('radiation');if(u.rubble)blocked.add('rubble');if(u.fire)blocked.add('fire');if(!u.powered)blocked.add('power');if(!(u.access||u.industry==='farm'&&c.tiles[u.farmRoot]?.access))blocked.add('transport');if(u.waste>=20)blocked.add('garbage');if(needsEstablishedWater(u)&&!u.watered)blocked.add('water');if(u.level>landDensityLimit(u))blocked.add('landValue');
 const d=['commercial','industrial'].includes(u.type)?Math.max(-100,Math.min(100,c.stats.marketDemandBase[u.type]+u.marketDemandBonus)):c.stats.demand[u.type];demand=Math.min(demand,c.stats.economicCaps?.[u.type]?.remaining===0?Math.min(0,d):d);limit=Math.min(limit,u.historicalLevel||3,u.density,u.watered?3:1,landDensityLimit(u));}
 return{usable:!blocked.size,blocked:[...blocked],demand,limit,ageReady:t.age>=t.level*4};
}
export const GROWTH_REASONS={residentialCap:'Residential population capacity reached',economicCap:'Commercial or industrial job capacity reached',radiation:'Radiation',rubble:'Rubble',fire:'Active fire',power:'No electricity',transport:'No usable transport access',garbage:'Uncollected garbage',water:'Established water supply lost',landValue:'Land value below current development',demand:'No positive local demand',historical:'Historical building cap',density:'Zoning density cap',waterCap:'Water needed for higher density',landCap:'Land value limits density',age:'Building still maturing',ready:'Eligible for a growth opportunity'};
export function zoneGrowthReport(c){const rows=[];for(const t of c.tiles){if(!['residential','commercial','industrial'].includes(t.type)||t.industry==='farm'||!isBuildingLotRoot(c,t))continue;const members=buildingLotMembers(c,t),conditions=zoneGrowthConditions(c,t,members),reasons=[...conditions.blocked];
 if(conditions.demand<=0)reasons.push('demand');if(!residentialGrowthFits(c,t,members))reasons.push('residentialCap');if(!economicGrowthFits(c,t,members))reasons.push('economicCap');if(t.level>=conditions.limit){if(members.some(u=>u.historicalLevel&&u.level>=u.historicalLevel))reasons.push('historical');if(members.some(u=>u.level>=u.density))reasons.push('density');if(members.some(u=>!u.watered&&u.level>=1))reasons.push('waterCap');if(members.some(u=>u.level>=landDensityLimit(u)))reasons.push('landCap');}if(!conditions.ageReady)reasons.push('age');if(!reasons.length)reasons.push('ready');
 rows.push({x:t.x,y:t.y,type:t.type,tiles:members.length,abandoned:!!abandonedRecovery(c,t),level:t.level,density:t.density,limit:conditions.limit,demand:conditions.demand,reasons,state:!conditions.usable?'blocked':t.level>=conditions.limit?'capped':conditions.demand<=0||reasons.includes('residentialCap')||reasons.includes('economicCap')?'demand':!conditions.ageReady?'maturing':'ready'});}
 return rows;}

export function abandonedRecovery(c,t){
 if(!['residential','commercial','industrial'].includes(t.type)||t.industry==='farm'||t.level||!(t.abandonedLevel||t.historicalLevel)||t.rubble)return null;
 const members=buildingLotMembers(c,t),conditions=zoneGrowthConditions(c,t,members),reasons=[...conditions.blocked];
 if(conditions.demand<=0)reasons.push('demand');if(!residentialGrowthFits(c,t,members))reasons.push('residentialCap');if(!economicGrowthFits(c,t,members))reasons.push('economicCap');
 return {reasons,ready:reasons.length===0,tiles:members.length,text:reasons.length?`Recovery is waiting on: ${reasons.map(key=>GROWTH_REASONS[key]).join('; ')}.`:'Current services and demand permit recovery. Leave the zoning in place and allow time for a growth opportunity.'};
}
export function abandonedRecoveryNote(c,t){const recovery=abandonedRecovery(c,t);return recovery?`<p><strong>Abandoned building · recovery</strong></p><p>${abandonmentExplanation(t)}</p><p>${recovery.text}</p><p class="fine">Recovery guidance uses current conditions. Historical designation preserves appearance but does not restore occupants.</p>`:'';}
