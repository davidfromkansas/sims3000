import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCity,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {replaceBuildingStyle,cityZonedSprite,buildingStyleKey} from '../dist/building-art.js';
import {defaultLotDesign,designForTile} from '../dist/building-designs.js';
import {formBuildingLot,updateBuildingLot} from '../dist/building-lots.js';
import {buildingLotPlacement} from '../dist/building-lot-view.js';
import {CityRenderer} from '../dist/renderer.js';
import {sharedSpriteBounds,spriteView} from '../dist/directional-sprites.js';
import {DIRECTIONAL_BUILDINGS,loadDirectionalBuilding,drawDirectionalBuilding,directionalBuildingSprite} from '../dist/directional-buildings.js';
assert.equal(defaultLotDesign(80,{width:1,height:1}).floors,6,'first-load single-tile fallback uses a canonical building slot');
const pixels=r=>{const data=new Uint8ClampedArray(64);data[(r*4+r)*4+3]=255;return{width:4,height:4,data};};
assert.deepEqual(sharedSpriteBounds([0,1,2,3].map(pixels)),{x:0,y:0,w:4,h:4});
assert.throws(()=>sharedSpriteBounds([pixels(0)]),/four/);
assert.throws(()=>sharedSpriteBounds([pixels(0),pixels(1),pixels(2),{...pixels(3),data:new Uint8ClampedArray(64)}]),/Each/);
let decodes=0;globalThis.Image=class{width=768;height=768;async decode(){decodes++;}};
globalThis.document={createElement(){throw Error('Precomputed frames must not scan pixels during play.');}};
const footprint={width:3,height:2},frames=await loadDirectionalBuilding(80,footprint);assert.equal(await loadDirectionalBuilding(80,footprint),frames);assert.equal(decodes,4,'views decode once per footprint');
for(let r=0;r<4;r++)assert.match(spriteView(frames,r).atlas.src,new RegExp(`3x2-view-${r}\\.png$`));assert.equal(spriteView(frames,-1),frames.views[3]);
const previewRenderer={rotation:2};assert.match(directionalBuildingSprite(previewRenderer,80,footprint,1).atlas.src,/view-1\.png$/);assert.equal(previewRenderer.rotation,2,'preview orientation does not mutate city camera');
const c=createCity('Directional offices',false,96);for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});
const root=c.tiles[20*96+20];for(let y=20;y<22;y++)for(let x=20;x<23;x++)Object.assign(c.tiles[y*96+x],{type:'commercial',density:3,powered:true,watered:true,access:true});
const lot=formBuildingLot(c,root,3,2);updateBuildingLot(c,root,{level:2});recompute(c);const before={funds:c.funds,stats:JSON.stringify(c.stats),tiles:JSON.stringify(c.tiles)},key=buildingStyleKey(c,root);replaceBuildingStyle(c,key,80);
assert.equal(c.funds,before.funds);assert.equal(JSON.stringify(c.stats),before.stats);assert.equal(JSON.stringify(c.tiles),before.tiles);assert.equal(cityZonedSprite(root,c,{}),80);
const saved=serializeCity(c);assert.equal(serializeCity(validateSave(JSON.parse(saved))),saved);const old=JSON.parse(saved);old.version=144;assert.throws(()=>validateSave(old),/145/);
const calls=[],fallback=[],r=Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>c,rotation:0,w:1000,h:700,zoom:1,pan:{x:0,y:0},ctx:{globalAlpha:.3,drawImage(...args){calls.push(args);}},layer:'city'});
const source=readFileSync(new URL('../dist/renderer.js',import.meta.url),'utf8'),body=source.split('else if(t.lotRoot!=null){')[1].split('\n else if(ZONES.includes')[0].trim().slice(0,-1);
const actual=new Function('buildingLotPlacement','cityZonedSprite','designForTile','defaultLotDesign','drawDesignedBuilding','drawRecentConstruction','DIRECTIONAL_BUILDINGS','drawDirectionalBuilding','return function(city,t,c,u,fade){'+body+'}')(buildingLotPlacement,cityZonedSprite,designForTile,defaultLotDesign,(...args)=>fallback.push(args),()=>{},DIRECTIONAL_BUILDINGS,drawDirectionalBuilding);
for(let rotation=0;rotation<4;rotation++){
 r.rotation=rotation;calls.length=0;fallback.length=0;for(const id of lot.ids)actual.call(r,c,c.tiles[id],{fillText(){}},r.unit,.4);
 assert.equal(calls.length,1);assert.equal(fallback.length,0);assert.match(calls[0][0].src,new RegExp(`view-${rotation}\\.png$`));assert.equal(r.ctx.globalAlpha,.3);
 const point=r.project(21,20.5),width=23*5*.925;assert.equal(calls[0][5],point.x-width/2);assert.equal(calls[0][6],point.y+23/2+23*5*.925/4-width*frames.h/frames.w);assert.equal(calls[0][7],width);
}
c.buildingDesigns[key]=defaultLotDesign(80,footprint);calls.length=0;fallback.length=0;for(const id of lot.ids)actual.call(r,c,c.tiles[id],{fillText(){}},r.unit,.4);assert.equal(calls.length,0);assert.equal(fallback.length,1,'a saved custom design overrides supplied artwork');
const factoryFrames=await loadDirectionalBuilding(79,{width:2,height:4});assert.equal(decodes,8);for(let rotation=0;rotation<4;rotation++)assert.match(spriteView(factoryFrames,rotation).atlas.src,new RegExp(`sawtooth-factory/2x4-view-${rotation}\\.png$`));
for(const source of [78,79,80]){const largest=await loadDirectionalBuilding(source,{width:5,height:5});for(let rotation=0;rotation<4;rotation++)assert.match(spriteView(largest,rotation).atlas.src,new RegExp(`5x5-view-${rotation}\\.png$`));}
// Joining a request started by a preview must invalidate every waiting city renderer.
const finishViews=[];globalThis.Image=class{width=768;height=768;decode(){return new Promise(resolve=>finishViews.push(resolve));}};
const previewRequest=loadDirectionalBuilding(79,{width:4,height:5});
const waitingRenderers=[{rotation:0,dirty:false},{rotation:2,dirty:false}];
for(let frame=0;frame<120;frame++)for(const renderer of waitingRenderers)assert.equal(directionalBuildingSprite(renderer,79,{width:4,height:5}),null);
assert.equal(finishViews.length,4,'preview and city views share the same four decodes');
for(const finish of finishViews)finish();await previewRequest;
for(const renderer of waitingRenderers){assert.equal(renderer.dirty,true,'a city joining a preview request redraws on completion');assert.ok(directionalBuildingSprite(renderer,79,{width:4,height:5}));}
// Failed artwork must be recoverable without restarting the city or retrying every frame.
const realNow=Date.now;let now=10000,networkDown=true,attempts=0;Date.now=()=>now;
globalThis.Image=class{width=768;height=768;async decode(){attempts++;if(networkDown)throw Error('Temporary asset outage');}};
try{
 await assert.rejects(loadDirectionalBuilding(80,{width:1,height:2}),/Temporary/);assert.equal(attempts,4);
 const recovering={rotation:3,dirty:false};for(let frame=0;frame<120;frame++)assert.equal(directionalBuildingSprite(recovering,80,{width:1,height:2}),null);assert.equal(attempts,4,'failed images do not cause a request every frame');
 now+=5000;networkDown=false;assert.equal(directionalBuildingSprite(recovering,80,{width:1,height:2}),null);await loadDirectionalBuilding(80,{width:1,height:2});assert.equal(attempts,8);assert.match(directionalBuildingSprite(recovering,80,{width:1,height:2}).atlas.src,/view-3\.png$/);assert.equal(recovering.dirty,true,'recovered artwork requests a redraw');
}finally{Date.now=realNow;}
delete globalThis.document;delete globalThis.Image;
console.log('PASS: directional view decoding/cache, shared crop, once-per-lot drawing, footprint anchoring, opacity restoration, custom priority, unchanged simulation and schema-aware saved replacements.');
