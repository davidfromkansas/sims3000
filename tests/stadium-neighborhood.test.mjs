import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {stadiumActors,stadiumMatchPixels,stadiumMatchState} from '../dist/stadium-match.js';
import {rasterizeReward,drawCityReward} from '../dist/reward-models.js';
import {auraBreakdown} from '../dist/aura.js';
const c=createCity('Stadium district',false);c.funds=200000;c.startYear=2000;c.rewards.earned.stadium=0;for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});
const place=(type,a,b=a)=>assert.ok(build(c,type,selection(type,a,b),3).ok);
place('solar',{x:35,y:15});place('powerline',{x:8,y:16},{x:34,y:16});place('road',{x:8,y:20},{x:38,y:20});place('residential',{x:22,y:18},{x:26,y:19});place('commercial',{x:22,y:21},{x:25,y:22});place('industrial',{x:22,y:23},{x:25,y:24});
for(const t of c.tiles)if(['residential','commercial','industrial'].includes(t.type)){t.level=1;t.age=10;}recompute(c);const home=c.tiles[19*48+26],shop=c.tiles[22*48+25],factory=c.tiles[24*48+25];const before={air:home.airPollution,water:home.waterPollution};
place('stadium',{x:27,y:21});assert.equal(c.stats.activeStadium,true);assert.equal(c.stats.civicJobs,200);assert.ok(home.airPollution>before.air);assert.ok(home.stadiumLandValue<0);assert.ok(shop.stadiumLandValue>home.stadiumLandValue);assert.equal(factory.stadiumLandValue,0);assert.ok(home.stadiumCrimePressure>0);assert.ok(auraBreakdown(c,home).factors.stadium>0);
const inner=c.tiles[23*48+29];assert.equal(inner.stadiumCrimePressure,20);assert.ok(inner.waterPollution>=20);assert.equal(c.tiles[47*48+47].stadiumAura,0);
const values=[home.crime,home.landValue,home.airPollution];recompute(c);assert.deepEqual([home.crime,home.landValue,home.airPollution],values,'recomputing does not compound stadium impacts');
const loaded=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual([loaded.tiles[home.y*48+home.x].crime,loaded.tiles[home.y*48+home.x].landValue],values.slice(0,2));
const corner=c.tiles[25*48+31];corner.fire=5;recompute(c);assert.equal(c.stats.activeStadium,false);assert.equal(home.stadiumLandValue,0);assert.equal(home.stadiumCrimePressure,0);assert.equal(home.stadiumAura,0);assert.equal(home.airPollution,before.air);corner.fire=0;recompute(c);assert.equal(c.stats.activeStadium,true);
const unpoliced=home.crime;place('police',{x:18,y:21});assert.ok(home.crime<unpoliced,'policing mitigates total crime including stadium pressure');
home.radiation=true;recompute(c);assert.equal(home.environmentLandValue,1);assert.equal(home.stadiumLandValue,0);


const root=c.tiles[21*48+27],renderer={getCity:()=>c,layer:'city',preferences:{},reducedMotion:{matches:false},vehicleTime:10};
assert.deepEqual(stadiumMatchState(renderer,root),{active:true,time:10});renderer.preferences.sceneryAnimations=false;assert.equal(stadiumMatchState(renderer,root).time,0);renderer.preferences.sceneryAnimations=true;renderer.reducedMotion.matches=true;assert.equal(stadiumMatchState(renderer,root).time,0);renderer.reducedMotion.matches=false;renderer.layer='water';assert.equal(stadiumMatchState(renderer,root).active,false);renderer.layer='city';corner.fire=5;assert.equal(stadiumMatchState(renderer,root).active,false,'live non-root damage hides the match');corner.fire=0;
assert.equal(stadiumActors(0).length,13);assert.deepEqual(stadiumActors(10,false),[]);assert.notDeepEqual(stadiumActors(0),stadiumActors(1));assert.deepEqual(stadiumActors(4),stadiumActors(4),'paused clock gives identical players');
for(let rotation=0;rotation<4;rotation++){const raster=rasterizeReward('stadium',rotation,true),pixels=stadiumMatchPixels(1,rotation,raster.depth);assert.ok(pixels.length>0);const clear=stadiumMatchPixels(1,rotation,new Float32Array(512*512).fill(-Infinity));assert.equal(clear.length,225);assert.ok(pixels.length<clear.length,'stands occlude some activity');assert.deepEqual(stadiumMatchPixels(1,rotation,new Float32Array(512*512).fill(Infinity)),[]);assert.deepEqual(stadiumMatchPixels(1,rotation,raster.depth,false),[]);}

let drawn=0,painted=0;globalThis.document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}})})};
const ctx={save:()=>{},restore:()=>{},drawImage:()=>drawn++,fillRect:()=>painted++};drawCityReward(ctx,'stadium',0,256,320,512,1,{active:true,time:1});assert.equal(drawn,1);assert.ok(painted>0);const count=painted;drawCityReward(ctx,'stadium',0,256,320,512,1,{active:false,time:2});assert.equal(painted,count);delete globalThis.document;
console.log('PASS: Stadium neighborhood tradeoffs, service/damage readiness, saved effects, four-view match depth, scenery/reduced-motion controls and paused-clock consistency.');
