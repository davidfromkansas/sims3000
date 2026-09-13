import {powerBaseNeed,waterBaseNeed} from './utility-demand.js?v=building-shape-tools-1';
import {inScenarioArea} from './scenario-area.js?v=building-shape-tools-1';
// Group missing service by the building's origin. Empty zoning consumes a small
// planning allowance but does not yet represent a building. Existing abandoned
// buildings still need restoration and remain eligible.
export function buildingsWithout(c,utility,area){
 const need=utility==='powered'?powerBaseNeed:waterBaseNeed,missing=new Set();
 for(let i=0;i<c.tiles.length;i++){
  const t=c.tiles[i];if(t.rubble||t.radiation||t[utility]||!need(t))continue;
  const zoned=['residential','commercial','industrial','airport','seaport'].includes(t.type);
  if(zoned&&!(t.level||t.abandonedLevel||t.historicalLevel||t.facilityAbandoned))continue;
  const root=t.lotRoot??t.farmRoot??t.facilityRoot??t.root??i,r=c.tiles[root];
  if(r&&!r.rubble&&!r.radiation&&inScenarioArea(r,area))missing.add(root);
 }
 return missing.size;
}
export const BUILDING_UTILITY_METRICS=Object.fromEntries([['unpoweredBuildings','power','powered'],['unwateredBuildings','water','watered']].map(([key,name,flag])=>[key,{name:'Buildings without '+name,group:'Building services',direction:'at most',integer:true,max:65536,initial:0,spatial:true,read:(c,area)=>buildingsWithout(c,flag,area)}]));
