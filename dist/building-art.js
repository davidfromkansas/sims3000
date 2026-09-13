import {buildingSlot,parseBuildingSlot,tileBuildingFootprint} from './building-footprints.js?v=business-site-analysis-2';
import {tileIndex} from './city-grid.js?v=business-site-analysis-2';
// Variants depend only on the lot and city seed, so saved and historical buildings keep their appearance.
export function baseZonedSprite(t,seed){
 const level=t.historicalLevel||t.abandonedLevel||t.level;
 const x=t.lotRoot==null?t.x:t.lotRoot%(t.mapSize||48),y=t.lotRoot==null?t.y:Math.floor(t.lotRoot/(t.mapSize||48));
 const variant=((Math.imul(x+1,73856093)^Math.imul(y+1,19349663)^seed)>>>3)&1;
 if(t.type==='residential')return level===3&&variant?74:[0,0,1,2][level];
 if(t.type==='commercial')return level===3&&variant?75:[3,3,4,5][level];
 return t.industry==='farm'?(t.farmRoot===tileIndex(t)?52:53):t.industry==='clean'?[54,54,55,56][level]:[6,6,7,8][level];
}

export const REPLACEABLE_STYLES={
 0:{name:'Detached homes',group:'residential',level:1},1:{name:'Residential mid-rise',group:'residential',level:2},2:{name:'Classic apartment tower',group:'residential',level:3},74:{name:'Terraced apartment tower',group:'residential',level:3},
 3:{name:'Neighborhood shops',group:'commercial',level:1},4:{name:'Commercial mid-rise',group:'commercial',level:2},5:{name:'Classic office tower',group:'commercial',level:3},75:{name:'Stepped glass office',group:'commercial',level:3},
 6:{name:'Small factory',group:'industrial',level:1},7:{name:'Industrial works',group:'industrial',level:2},8:{name:'Heavy industrial complex',group:'industrial',level:3},54:{name:'Small clean-industry workshop',group:'industrial',level:1},55:{name:'Clean-industry campus',group:'industrial',level:2},56:{name:'High-tech industrial complex',group:'industrial',level:3}
};
export function canReplaceBuilding(t){return !t.rubble&&!t.radiation&&['residential','commercial','industrial'].includes(t.type)&&t.industry!=='farm'&&[1,2,3].includes(t.historicalLevel||t.abandonedLevel||t.level);}
export const buildingStyleKey=(city,tile)=>buildingSlot(baseZonedSprite(tile,city.seed),tileBuildingFootprint(city,tile));
export function zonedSprite(t,seed,replacements={},city){const base=baseZonedSprite(t,seed),key=city?buildingStyleKey(city,t):t.lotRoot==null?String(base):null;return key===null?base:replacements[key]??base;}
export function validateBuildingReplacements(value){if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid building replacements.');const out={};for(const [source,target]of Object.entries(value)){const slot=parseBuildingSlot(source);if(!Object.hasOwn(REPLACEABLE_STYLES,slot.source)||!Number.isInteger(target)||!Object.hasOwn(REPLACEABLE_STYLES,target)||REPLACEABLE_STYLES[slot.source].group!==REPLACEABLE_STYLES[target].group)throw Error('Invalid building replacement style.');if(slot.source!==target)out[source]=target;}return out;}
export function replaceBuildingStyle(c,source,target){const next=validateBuildingReplacements({...c.buildingReplacements,[source]:target});c.buildingReplacements=next;if(c.buildingDesigns)delete c.buildingDesigns[source];}
