import {validateBuildingReplacements,canReplaceBuilding,buildingStyleKey,REPLACEABLE_STYLES} from './building-art.js?v=architecture-collection-57';
import {validateBuildingDesigns} from './building-designs.js?v=architecture-collection-57';
import {buildingSlot,parseBuildingSlot} from './building-footprints.js?v=architecture-collection-57';
import {isBuildingLotRoot} from './building-lots.js?v=architecture-collection-57';

// Read an already validated city. Both maps are copied and validated before
// either is installed, so a failed import cannot partly change the skyline.
export function copyBuildingSet(source){return{
 buildingReplacements:validateBuildingReplacements(source.buildingReplacements??{}),
 buildingDesigns:validateBuildingDesigns(source.buildingDesigns??{})
};}
export function applyBuildingSet(city,source){const next=copyBuildingSet(source);Object.assign(city,next);}
export function buildingSetChanges(city,source){
 const before=copyBuildingSet(city),after=copyBuildingSet(source),keys=new Set([...Object.keys(before.buildingReplacements),...Object.keys(before.buildingDesigns),...Object.keys(after.buildingReplacements),...Object.keys(after.buildingDesigns)]),counts=new Map();
 for(const tile of city.tiles)if(canReplaceBuilding(tile)&&isBuildingLotRoot(city,tile)){const key=buildingStyleKey(city,tile);counts.set(key,(counts.get(key)||0)+1);}
 const appearance=(set,key)=>set.buildingDesigns[key]??set.buildingReplacements[key]??parseBuildingSlot(key).source;
 const label=(set,key)=>set.buildingDesigns[key]?.name??REPLACEABLE_STYLES[set.buildingReplacements[key]??parseBuildingSlot(key).source].name;
 return [...keys].sort().filter(key=>JSON.stringify(appearance(before,key))!==JSON.stringify(appearance(after,key))).map(key=>{const {source,footprint}=parseBuildingSlot(key);return{key,style:REPLACEABLE_STYLES[source].name,footprint,from:label(before,key),to:label(after,key),count:counts.get(key)||0};});
}

// Natural RCI source styles; supplied alternatives are replacement targets.
const NATURAL_STYLE_SOURCES=[0,1,2,3,4,5,6,7,8,54,55,56,74,75];
export function buildingSetCatalog(city,{group='all',footprint={width:1,height:1}}={}){
 const counts=new Map();
 for(const t of city.tiles)if(canReplaceBuilding(t)&&isBuildingLotRoot(city,t)){const key=buildingStyleKey(city,t);counts.set(key,(counts.get(key)||0)+1);}
 const sources=new Set([...NATURAL_STYLE_SOURCES,...Object.keys(city.buildingReplacements??{}).map(k=>parseBuildingSlot(k).source),...Object.keys(city.buildingDesigns??{}).map(k=>parseBuildingSlot(k).source)]);
 const dimensions=value=>value===0?[1,2,3,4,5]:[value];
 const footprints=dimensions(footprint.width).flatMap(width=>dimensions(footprint.height).map(height=>({width,height})));
 return [...sources].filter(source=>group==='all'||REPLACEABLE_STYLES[source].group===group).flatMap(source=>footprints.map(footprint=>{
  const key=buildingSlot(source,footprint),style=REPLACEABLE_STYLES[source],design=city.buildingDesigns?.[key],target=city.buildingReplacements?.[key]??source;
  return{key,source,footprint,name:style.name,group:style.group,current:design?.name??REPLACEABLE_STYLES[target].name,custom:Boolean(design),changed:Boolean(design)||target!==source,count:counts.get(key)||0};
 }));
}
