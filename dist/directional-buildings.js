import {COURTYARD_ART_FRAMES} from './courtyard-art-frames.js?v=scripted-ending-ranks-1';
import {FACTORY_ART_FRAMES} from './factory-art-frames.js?v=scripted-ending-ranks-1';
import {COMMERCIAL_ART_FRAMES} from './commercial-art-frames.js?v=scripted-ending-ranks-1';
import {loadDirectionalSprite,spriteView} from './directional-sprites.js?v=scripted-ending-ranks-1';
export const DIRECTIONAL_BUILDINGS={78:{name:'Courtyard apartments',asset:'courtyard-apartments',frames:COURTYARD_ART_FRAMES},79:{name:'Sawtooth factory',asset:'sawtooth-factory',frames:FACTORY_ART_FRAMES},80:{name:'Limestone office block',asset:'commercial-midrise',frames:COMMERCIAL_ART_FRAMES}};
const cache=new Map();
const canRetry=entry=>entry?.retryAt!=null&&Date.now()>=entry.retryAt;
function keyFor(source,footprint){if(!DIRECTIONAL_BUILDINGS[source])throw Error('Unknown directional building.');const {width,height}=footprint;if(![width,height].every(n=>Number.isInteger(n)&&n>=1&&n<=5))throw Error('Unsupported building footprint.');return `${source}@${width}x${height}`;}
export function loadDirectionalBuilding(source,footprint={width:1,height:1}){
 const key=keyFor(source,footprint);if(cache.has(key)&&!canRetry(cache.get(key)))return cache.get(key).promise;
 const entry={sprite:null,promise:null,retryAt:null,renderers:new WeakSet()},asset=DIRECTIONAL_BUILDINGS[source].asset;
 entry.promise=loadDirectionalSprite(Array.from({length:4},(_,r)=>new URL(`./assets/${asset}/${footprint.width}x${footprint.height}-view-${r}.png`,import.meta.url).href),DIRECTIONAL_BUILDINGS[source].frames[`${footprint.width}x${footprint.height}`]).then(sprite=>{entry.sprite=sprite;return sprite;},error=>{entry.retryAt=Date.now()+5000;throw error;});cache.set(key,entry);return entry.promise;
}
export function directionalBuildingSprite(renderer,source,footprint={width:1,height:1},rotation=renderer.rotation){
 if(!DIRECTIONAL_BUILDINGS[source])return null;
 const key=keyFor(source,footprint);if(!cache.has(key)||canRetry(cache.get(key)))loadDirectionalBuilding(source,footprint);
 const entry=cache.get(key);
 // A preview may have started the shared request before this city renderer needs it.
 if(!entry.sprite&&!entry.renderers.has(renderer)){entry.renderers.add(renderer);entry.promise.then(()=>{renderer.dirty=true;},error=>{renderer.dirty=true;console.warn('Building artwork could not load',error);});}
 return spriteView(entry.sprite,rotation);
}
export function drawDirectionalBuilding(renderer,source,point,footprint,opacity=1){
 const s=directionalBuildingSprite(renderer,source,footprint);if(!s)return false;
 const sum=footprint.width+footprint.height,u=renderer.unit,width=u*sum*.925,h=width*s.h/s.w,bottom=point.y+u/2+u*sum*.925/4,c=renderer.ctx,alpha=c.globalAlpha;
 c.globalAlpha=opacity;try{c.drawImage(s.atlas,s.x,s.y,s.w,s.h,point.x-width/2,bottom-h,width,h);}finally{c.globalAlpha=alpha;}return true;
}
