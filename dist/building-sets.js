import {validateBuildingReplacements,canReplaceBuilding,buildingStyleKey,REPLACEABLE_STYLES} from './building-art.js?v=first-town-services-1';
import {validateBuildingDesigns} from './building-designs.js?v=first-town-services-1';
import {parseBuildingSlot} from './building-footprints.js?v=first-town-services-1';
import {isBuildingLotRoot} from './building-lots.js?v=first-town-services-1';

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
