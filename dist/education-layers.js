import {educationServiceDemand} from './education.js?v=city-landscape-styles-1';
export const EDUCATION_LAYERS={
 schoolAccess:{name:'School access · ages 0–14',type:'school',field:'childEducationCoverage',facilities:['school'],marker:'S'},
 collegeAccess:{name:'College access · ages 15–24',type:'college',field:'collegeEducationCoverage',facilities:['college'],marker:'C'},
 adultAccess:{name:'Adult learning access · ages 25+',type:'library',field:'adultEducationCoverage',facilities:['library','museum'],marker:'A'}
};
export const EDUCATION_LAYER_LEGEND='Occupied homes: red unmet → green served · Gray: no demand · Facility dots: white operating, orange inactive';
// Compute once per map draw, not once per tile. The census is citywide;
// education service demand is distributed with that age mix across homes.
export function educationLayerProfile(city,layer){const definition=EDUCATION_LAYERS[layer];return definition?{...definition,hasDemand:educationServiceDemand(city,definition.type).share>0}:null;}
export function educationLayerColor(tile,profile){
 if(tile.terrain==='water')return '#32677f';
 if(!profile?.hasDemand||tile.type!=='residential'||!tile.level)return '#6a7770';
 return `hsl(${Math.max(0,Math.min(100,tile[profile.field]||0))*1.2},55%,48%)`;
}
