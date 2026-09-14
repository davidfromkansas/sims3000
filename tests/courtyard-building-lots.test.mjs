import assert from 'node:assert/strict';
import {createCity,validateSave} from '../dist/engine.js';
import {formBuildingLot,updateBuildingLot} from '../dist/building-lots.js';
import {cityZonedSprite,replaceBuildingStyle} from '../dist/building-art.js';
import {defaultLotDesign,validateBuildingDesign,drawBuildingDesign,applyBuildingDesign,designForTile} from '../dist/building-designs.js';
import {serializeCity} from '../dist/save.js';
const c=createCity('Apartment blocks',false,96),view={variedApartments:true},variants=new Set();
for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});
for(let x=10;x<40;x+=3){for(let y=10;y<12;y++)for(let dx=0;dx<3;dx++)Object.assign(c.tiles[y*96+x+dx],{type:'residential',density:2,powered:true,watered:true,access:true});const root=c.tiles[10*96+x],lot=formBuildingLot(c,root,3,2);updateBuildingLot(c,root,{level:2});const selected=cityZonedSprite(root,c,view);variants.add(selected);for(const id of lot.ids)assert.equal(cityZonedSprite(c.tiles[id],c,view),selected);updateBuildingLot(c,root,{level:0,abandonedLevel:2});assert.equal(cityZonedSprite(root,c,view),selected);updateBuildingLot(c,root,{level:2,abandonedLevel:0});}
assert.deepEqual(variants,new Set([1,78]));
const root=c.tiles[970],before=serializeCity(c);cityZonedSprite(root,c,view);assert.equal(serializeCity(c),before);const restored=validateSave(JSON.parse(before));for(const t of c.tiles.filter(t=>t.lotRoot!=null))assert.equal(cityZonedSprite(restored.tiles[t.y*96+t.x],restored,view),cityZonedSprite(t,c,view));
replaceBuildingStyle(c,'1@3x2',78);assert.equal(cityZonedSprite(root,c,{}),78);replaceBuildingStyle(c,'1@3x2',2);assert.equal(cityZonedSprite(root,c,view),2);
const d=defaultLotDesign(78,{width:3,height:2});assert.deepEqual(validateBuildingDesign(d),d);assert.equal(d.blocks[44],0,'courtyard is open');assert.equal(d.blocks[74],0,'entry reaches courtyard');assert.equal(d.blocks[22],4);
applyBuildingDesign(c,'1@3x2',{...d,name:'My courtyard'});assert.equal(designForTile(c,root).name,'My courtyard');
for(const footprint of [{width:1,height:2},{width:2,height:3},{width:4,height:4}])for(let rotation=0;rotation<4;rotation++){let polygons=0;const ctx={beginPath(){},moveTo(x,y){assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=256&&y>=0&&y<=384);},lineTo(x,y){this.moveTo(x,y);},closePath(){},fill(){polygons++;}};drawBuildingDesign(ctx,defaultLotDesign(78,footprint),rotation);assert.ok(polygons>100);}
console.log('PASS: courtyard lot variants share root identity, survive saves and abandonment, honor footprint replacements/custom designs, and render bounded courtyard geometry in four rotations.');
