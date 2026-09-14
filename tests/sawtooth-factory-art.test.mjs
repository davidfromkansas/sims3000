import assert from 'node:assert/strict';
import {createCity,validateSave} from '../dist/engine.js';
import {cityZonedSprite,zonedSprite,replaceBuildingStyle} from '../dist/building-art.js';
import {serializeCity} from '../dist/save.js';
import {copyBuildingSet} from '../dist/building-sets.js';
import {defaultBuildingDesign,defaultLotDesign} from '../dist/building-designs.js';
const c=createCity(),before=serializeCity(c),view={variedFactories:true},variants=new Set();
for(let x=0;x<48;x++){const t={type:'industrial',industry:'dirty',x,y:20,level:1,lotRoot:null};const sprite=cityZonedSprite(t,c,view);variants.add(sprite);assert.equal(cityZonedSprite({...t,age:50},c,view),sprite);assert.equal(cityZonedSprite({...t,level:0,historicalLevel:1},c,view),sprite);assert.equal(cityZonedSprite({...t,level:0,abandonedLevel:1},c,view),sprite);assert.equal(cityZonedSprite(t,c,{}),6);assert.equal(cityZonedSprite({...t,industry:'clean'},c,view),54);assert.equal(cityZonedSprite({...t,industry:'farm'},c,view),53);assert.equal(cityZonedSprite({...t,type:'commercial'},c,view),3);assert.equal(cityZonedSprite({...t,level:2},c,view),7);}
assert.deepEqual(variants,new Set([6,79]));assert.equal(serializeCity(c),before);replaceBuildingStyle(c,6,79);assert.equal(zonedSprite({type:'industrial',industry:'dirty',x:1,y:1,level:1},c.seed,c.buildingReplacements),79);assert.deepEqual(copyBuildingSet(c).buildingReplacements,{'6':79});assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).buildingReplacements,{'6':79});replaceBuildingStyle(c,6,7);assert.equal(cityZonedSprite({type:'industrial',industry:'dirty',x:1,y:1,level:1,lotRoot:null},c,view),7);replaceBuildingStyle(c,6,6);c.buildingDesigns={'6':{name:'Custom'}};assert.equal(cityZonedSprite({type:'industrial',industry:'dirty',x:1,y:1,level:1,lotRoot:null},c,view),6);
assert.equal(defaultBuildingDesign(79).floors,2);assert.equal(defaultLotDesign(79,{width:2,height:2}).facade,'#a78972');
console.log('PASS: stable mixed small factories, clean/farm/office exclusions, history and abandonment, saved replacement/building sets, custom priority and dirty-industry model palette.');
