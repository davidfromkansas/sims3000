export const SINGLE_TILE=Object.freeze({width:1,height:1});
export function validateBuildingFootprint(v){if(!v||!Number.isInteger(v.width)||!Number.isInteger(v.height)||v.width<1||v.height<1||v.width>4||v.height>4)throw Error('Building footprints must be 1–4 tiles wide and deep.');return{width:v.width,height:v.height};}
export function parseBuildingSlot(key){const m=String(key).match(/^(0|[1-9]\d*)(?:@([1-4])x([1-4]))?$/);if(!m||m[2]==='1'&&m[3]==='1')throw Error('Invalid building style and footprint.');return{source:Number(m[1]),footprint:m[2]?{width:Number(m[2]),height:Number(m[3])}:SINGLE_TILE};}
export function buildingSlot(source,footprint=SINGLE_TILE){const f=validateBuildingFootprint(footprint);return String(source)+(f.width===1&&f.height===1?'':`@${f.width}x${f.height}`);}
export function tileBuildingFootprint(city,tile){if(tile.lotRoot==null)return SINGLE_TILE;const lot=city.buildingLots?.get(tile.lotRoot);if(!lot)throw Error('Missing building footprint.');return{width:lot.width,height:lot.height};}
export const sameBuildingFootprint=(a=SINGLE_TILE,b=SINGLE_TILE)=>a.width===b.width&&a.height===b.height;
// Keep a fixed-size cache image. Horizontal geometry follows the footprint;
// physical floor height stays constant when the image is scaled back into the city.
export function projectBuildingPoint([x,y,z],rotation=0,footprint=SINGLE_TILE){const size=Math.max(footprint.width,footprint.height);x*=footprint.width/size;y*=footprint.height/size;const rot=((rotation%4)+4)%4,[a,b]=rot===0?[x,y]:rot===1?[-y,x]:rot===2?[-x,-y]:[y,-x];return[128+(a-b)*64,346+(a+b)*32-z*64/size];}
