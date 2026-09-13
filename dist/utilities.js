import {landfillRailFreight} from './rail-freight.js?v=scenario-start-preview-1';
import {waterBaseNeed} from './utility-demand.js?v=scenario-start-preview-1';
import {pipeCoverage} from './water-coverage.js?v=scenario-start-preview-1';
import {conservationDemand} from './conservation.js?v=scenario-start-preview-1';
import {industrialJobs} from './industry.js?v=scenario-start-preview-1';
import {tradeCapacity} from './region.js?v=scenario-start-preview-1';
// Manual pp. 16–17, 103, 115, 117–118. Capacities/rates are explicit model approximations.
export const WATER_CAPACITY=500,LANDFILL_CAPACITY=200,LANDFILL_DECAY=.5;
export const occupancy=level=>[0,1,3,8][level]||0;
const isZone=t=>['residential','commercial','industrial'].includes(t.type);
function nearby(c,t,r,visit){const n=Math.sqrt(c.tiles.length);for(let y=Math.max(0,t.y-r);y<=Math.min(n-1,t.y+r);y++)for(let x=Math.max(0,t.x-r);x<=Math.min(n-1,t.x+r);x++)visit(c.tiles[y*n+x],y*n+x);}
export const WATER_STRUCTURES={pump:{name:'Pumping station',cost:1000,upkeep:15,capacity:500,year:1900},waterTower:{name:'Water tower',cost:500,upkeep:8,capacity:120,year:1900},desalination:{name:'Desalinization plant',cost:3000,upkeep:35,capacity:350,year:1960},waterTreatment:{name:'Water treatment plant',cost:2500,upkeep:25,capacity:0,year:1935}};
export const waterEfficiency=t=>Math.max(.15,1-Math.max(0,t.age-240)/480);
export function advanceWater(c){for(const t of c.tiles)if(WATER_STRUCTURES[t.type])t.age++;}
export function recomputeWater(c){
 const n=Math.sqrt(c.tiles.length),tiles=c.tiles,rawPollution=tiles.map(t=>t.waterPollution||0),seen=new Set();let pumps=0,activePumps=0,waterCapacity=0,waterUsed=0,pipes=0,waterUpkeep=0,treatmentPlants=0,activeTreatment=0;
 for(const t of tiles){t.watered=false;t.waterCovered=false;t.pipeWet=false;t.waterNetwork=-1;t.pumpCapacity=0;t.unpollutedCapacity=0;t.pollutionCapacityLoss=0;t.treatmentBenefit=0;t.freshwater=false;t.saltwater=false;t.treatmentActive=false;t.waterEfficiency=WATER_STRUCTURES[t.type]?waterEfficiency(t):1;if(t.pipe)pipes++;if(WATER_STRUCTURES[t.type]){waterUpkeep+=WATER_STRUCTURES[t.type].upkeep;if(t.type==='waterTreatment')treatmentPlants++;else pumps++;nearby(c,t,2,u=>{if(u.terrain==='water'&&u.waterKind!=='salt')t.freshwater=true;if(u.terrain==='water'&&u.waterKind==='salt'&&Math.max(Math.abs(u.x-t.x),Math.abs(u.y-t.y))<=1)t.saltwater=true;});}}
 const baseNeed=waterBaseNeed;const needFor=t=>conservationDemand(c,'water',baseNeed(t));const waterDemand=tiles.reduce((sum,t)=>sum+needFor(t),0),waterConserved=tiles.reduce((sum,t)=>sum+baseNeed(t)-needFor(t),0);
 const networks=[],coverageScratch=new Uint8Array(tiles.length).fill(255);
 for(let i=0;i<tiles.length;i++){
  if(seen.has(i)||(!tiles[i].pipe&&!WATER_STRUCTURES[tiles[i].type]))continue;
  const nodes=[i];seen.add(i);
  for(let k=0;k<nodes.length;k++){const t=tiles[nodes[k]];for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=t.x+dx,y=t.y+dy,j=y*n+x;if(x<0||y<0||x>=n||y>=n||seen.has(j))continue;if(tiles[j].pipe||WATER_STRUCTURES[tiles[j].type]){seen.add(j);nodes.push(j);}}}
  const hasPipes=nodes.some(j=>tiles[j].pipe),treatments=nodes.map(j=>tiles[j]).filter(t=>t.type==='waterTreatment'&&t.powered&&hasPipes);const cleaning=Math.min(.8,treatments.reduce((sum,t)=>sum+.5*t.waterEfficiency,0));for(const t of treatments){t.treatmentActive=true;activeTreatment++;}
  let capacity=0;for(const j of nodes){const t=tiles[j],def=WATER_STRUCTURES[t.type];if(def&&def.capacity){const valid=t.type==='waterTower'||t.type==='pump'&&t.freshwater||t.type==='desalination'&&t.saltwater;const pollution=rawPollution[j]*(1-cleaning);t.unpollutedCapacity=t.powered&&valid?Math.round(def.capacity*t.waterEfficiency):0;t.pumpCapacity=t.powered&&valid?Math.round(def.capacity*t.waterEfficiency*(1-pollution/100*(t.type==='waterTower'?.95:.75))):0;t.pollutionCapacityLoss=t.unpollutedCapacity-t.pumpCapacity;const untreated=t.powered&&valid?Math.round(def.capacity*t.waterEfficiency*(1-rawPollution[j]/100*(t.type==='waterTower'?.95:.75))):0;t.treatmentBenefit=t.pumpCapacity-untreated;capacity+=t.pumpCapacity;if(t.pumpCapacity)activePumps++;}}
  const id=networks.length;for(const j of nodes)tiles[j].waterNetwork=id;
  const candidates=pipeCoverage(n,nodes.filter(j=>tiles[j].pipe),coverageScratch);for(const j of candidates)tiles[j].waterCovered=true;
  capacity=tradeCapacity(c,'water',nodes,capacity,candidates.reduce((sum,j)=>{const t=tiles[j];return sum+(t.watered?0:needFor(t));},0));for(const j of nodes)tiles[j].pipeWet=capacity>0;let remaining=capacity;for(const j of candidates){const t=tiles[j];if(t.watered)continue;const need=needFor(t);if(capacity>0&&remaining+1e-9>=need){t.watered=true;remaining=Math.max(0,remaining-need);}if(cleaning)t.waterPollution=Math.min(t.waterPollution,rawPollution[j]*(1-cleaning));}
  waterCapacity+=capacity;waterUsed+=capacity-remaining;networks.push({capacity,used:capacity-remaining,pipeCount:nodes.filter(j=>tiles[j].pipe).length,treatments:treatments.length,cleaning});
 }
 return{waterDemand,waterConserved,pumps,activePumps,pipes,waterCapacity,waterUsed,waterUpkeep,treatmentPlants,activeTreatment,watered:tiles.filter(t=>isZone(t)&&t.watered).length,waterNetworks:networks};
}
export function wasteProduction(t){return t.type==='industrial'&&t.industry==='farm'?industrialJobs(t)*.02:isZone(t)?occupancy(t.level)*(t.type==='residential'?.24:t.type==='industrial'?.72:.36):0;}
export function garbageStats(c){const dumps=c.tiles.filter(t=>t.type==='landfill');return{wasteUpkeep:c.tiles.reduce((v,t)=>v+(WASTE_STRUCTURES[t.type]?.upkeep||0),0),recycled:c.tiles.reduce((v,t)=>v+(t.type==='recycling'?t.recycledLastMonth||0:0),0),incinerated:c.tiles.reduce((v,t)=>v+(WASTE_STRUCTURES[t.type]?t.burnedLastMonth||0:0),0),wastePower:c.tiles.reduce((v,t)=>v+wastePower(t),0),landfillTiles:dumps.length,landfillCapacity:dumps.length*LANDFILL_CAPACITY,landfillStored:dumps.reduce((a,t)=>a+t.garbage,0),uncollectedWaste:c.tiles.reduce((a,t)=>a+t.waste,0),wasteProduction:c.tiles.reduce((a,t)=>a+wasteProduction(t),0),connectedLandfillTiles:dumps.filter(t=>t.roadIds?.length).length};}
export function processGarbage(c){
 const freight=landfillRailFreight(c),dumps=c.tiles.filter(t=>t.type==='landfill'),plants=c.tiles.filter(t=>wasteActive(c,t)),recyclers=plants.filter(t=>t.type==='recycling'),burners=plants.filter(t=>t.type!=='recycling'),remaining=new Map(plants.map(t=>[t,wasteCapacity(c,t)]));for(const t of c.tiles){if(WASTE_STRUCTURES[t.type]){t.burnedLastMonth=0;t.recycledLastMonth=0;}if(t.type==='landfill')t.garbage=Math.max(0,t.garbage-LANDFILL_DECAY);}
 let collected=0;for(const t of c.tiles){const production=wasteProduction(t);let recyclable=production*(c.civic.ordinances.trashPresort?.45:.3);for(const r of recyclers){if(!t.roadIds.some(id=>r.roadIds.includes(id)))continue;const amount=Math.min(recyclable,remaining.get(r));recyclable-=amount;remaining.set(r,remaining.get(r)-amount);r.recycledLastMonth+=amount;}const recycled=production*(c.civic.ordinances.trashPresort?.45:.3)-recyclable;t.waste+=production-recycled;collected+=recycled;if(t.waste<=0)continue;
 for(const p of burners){if(!t.roadIds.some(id=>p.roadIds.includes(id)))continue;const amount=Math.min(t.waste,remaining.get(p));remaining.set(p,remaining.get(p)-amount);p.burnedLastMonth+=amount;t.waste-=amount;collected+=amount;}
 for(const d of dumps){if(!t.roadIds?.some(id=>d.roadIds?.includes(id))&&!freight.accepts(t,d))continue;const amount=Math.min(t.waste,LANDFILL_CAPACITY-d.garbage);if(amount<=0)continue;d.garbage+=amount;t.waste-=amount;collected+=amount;if(t.waste<1e-8){t.waste=0;break;}}}return collected;
}
export const WASTE_STRUCTURES={recycling:{name:'Recycling center',cost:1200,upkeep:10,capacity:60,year:1970},incinerator:{name:'Incinerator',cost:2500,upkeep:30,capacity:100,year:1920},wasteEnergy:{name:'Waste-to-energy incinerator',cost:6000,upkeep:55,capacity:180,year:2000}};
export const wasteCapacity=(c,t)=>WASTE_STRUCTURES[t.type]?Math.round(WASTE_STRUCTURES[t.type].capacity*waterEfficiency(t)*(t.type==='recycling'&&c.civic.ordinances.trashPresort?1.5:1)):0;
export const wasteActive=(c,t)=>!!WASTE_STRUCTURES[t.type]&&t.roadIds.length>0&&c.finance.roadCondition>20&&(t.type!=='recycling'||t.powered);
export const wastePower=t=>t.type==='wasteEnergy'?Math.min(360,(t.burnedLastMonth||0)*2):0;
export function advanceWaste(c){for(const t of c.tiles)if(WASTE_STRUCTURES[t.type])t.age++;}
