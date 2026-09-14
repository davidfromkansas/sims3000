import {exportBuildingDesign,importBuildingDesign} from './building-designs.js?v=architecture-workspace-1';
export const CUSTOM_BUILDING_LIBRARY_KEY='sims3000-custom-buildings-v1';
export const MAX_CUSTOM_BUILDINGS=100;
export const customBuildingIdentity=model=>JSON.stringify([model.name,model.footprint?.width??1,model.footprint?.height??1]);
export function encodeCustomBuildingLibrary(models){
 if(!Array.isArray(models)||models.length>MAX_CUSTOM_BUILDINGS)throw Error('The custom building list holds up to 100 models.');
 const files=models.map(model=>exportBuildingDesign(model)),validated=files.map(file=>importBuildingDesign(file));
 if(new Set(validated.map(customBuildingIdentity)).size!==models.length)throw Error('Building names must be unique within each footprint.');
 if(files.some(file=>file.length>32768))throw Error('A custom model exceeds the building-file size limit.');
 const text=JSON.stringify({version:1,buildings:files});if(text.length>3300000)throw Error('The custom building list is too large.');return text;
}
export function decodeCustomBuildingLibrary(text){
 if(text==null)return [];
 if(typeof text!=='string'||text.length>3300000)throw Error('The saved custom building list is too large.');
 const data=JSON.parse(text);
 if(!data||data.version!==1||!Array.isArray(data.buildings)||data.buildings.length>MAX_CUSTOM_BUILDINGS||data.buildings.some(file=>typeof file!=='string'||file.length>32768))throw Error('The saved custom building list is invalid.');
 const models=data.buildings.map(file=>importBuildingDesign(file));encodeCustomBuildingLibrary(models);return models;
}
export function readCustomBuildingLibrary(storage=globalThis.localStorage){if(!storage)throw Error('Browser storage is unavailable.');return decodeCustomBuildingLibrary(storage.getItem(CUSTOM_BUILDING_LIBRARY_KEY));}
export function saveCustomBuildingLibrary(models,storage=globalThis.localStorage){const text=encodeCustomBuildingLibrary(models);if(!storage)throw Error('Browser storage is unavailable.');storage.setItem(CUSTOM_BUILDING_LIBRARY_KEY,text);}
