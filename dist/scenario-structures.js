import {STRUCTURES} from './structures.js?v=scenario-neighbor-status-1';
import {SERVICES} from './civic.js?v=scenario-neighbor-status-1';
import {STATIONS} from './rail.js?v=scenario-neighbor-status-1';
import {WATER_STRUCTURES,WASTE_STRUCTURES} from './utilities.js?v=scenario-neighbor-status-1';
import {FACILITIES} from './facilities.js?v=scenario-neighbor-status-1';
import {inScenarioArea} from './scenario-area.js?v=scenario-neighbor-status-1';
export const COUNTED_STRUCTURES={...STRUCTURES,...SERVICES,...STATIONS,...WATER_STRUCTURES,...WASTE_STRUCTURES,...FACILITIES,busStop:{name:'Bus stop'},park:{name:'Small park'}};
// Count a fixed-footprint building once at its origin, even without service.
// Airport and seaport zoning must develop before it represents a building.
export function structureRoots(c,type,area){
 const n=Math.sqrt(c.tiles.length);
 return c.tiles.filter(t=>t.type===type&&!t.rubble&&!t.radiation&&inScenarioArea(t,area)&&(STRUCTURES[type]?t.root===t.y*n+t.x:FACILITIES[type]?(t.level>0||t.facilityAbandoned)&&t.facilityRoot===t.y*n+t.x:true));
}
export const STRUCTURE_METRICS=Object.fromEntries(Object.entries(COUNTED_STRUCTURES).map(([type,d])=>['structures'+type[0].toUpperCase()+type.slice(1),{name:'Placed: '+d.name,group:'Structure counts',direction:'at least',integer:true,max:2304,initial:1,spatial:true,read:(c,area)=>structureRoots(c,type,area).length}]));
