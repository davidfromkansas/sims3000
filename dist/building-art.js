import {tileIndex} from './city-grid.js?v=power-grids-1';
// Variants depend only on the lot and city seed, so saved and historical buildings keep their appearance.
export function baseZonedSprite(t,seed){
 const level=t.historicalLevel||t.abandonedLevel||t.level;
 const variant=((Math.imul(t.x+1,73856093)^Math.imul(t.y+1,19349663)^seed)>>>3)&1;
 if(t.type==='residential')return level===3&&variant?74:[0,0,1,2][level];
 if(t.type==='commercial')return level===3&&variant?75:[3,3,4,5][level];
 return t.industry==='farm'?(t.farmRoot===tileIndex(t)?52:53):t.industry==='clean'?[54,54,55,56][level]:[6,6,7,8][level];
}

export const REPLACEABLE_STYLES={2:{name:'Classic apartment tower',group:'residential'},74:{name:'Terraced apartment tower',group:'residential'},5:{name:'Classic office tower',group:'commercial'},75:{name:'Stepped glass office',group:'commercial'}};
export function zonedSprite(t,seed,replacements={}){const base=baseZonedSprite(t,seed);return replacements[base]??base;}
export function validateBuildingReplacements(value){if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid building replacements.');const out={};for(const [source,target]of Object.entries(value)){if(!Object.hasOwn(REPLACEABLE_STYLES,source)||!Number.isInteger(target)||!Object.hasOwn(REPLACEABLE_STYLES,target)||REPLACEABLE_STYLES[source].group!==REPLACEABLE_STYLES[target].group)throw Error('Invalid building replacement style.');if(Number(source)!==target)out[source]=target;}return out;}
export function replaceBuildingStyle(c,source,target){const next=validateBuildingReplacements({...c.buildingReplacements,[source]:target});c.buildingReplacements=next;if(c.buildingDesigns)delete c.buildingDesigns[source];}
