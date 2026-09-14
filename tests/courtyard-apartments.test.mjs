import assert from 'node:assert/strict';
import {createCity,validateSave} from '../dist/engine.js';
import {cityZonedSprite,zonedSprite,replaceBuildingStyle} from '../dist/building-art.js';
import {serializeCity} from '../dist/save.js';
import {copyBuildingSet} from '../dist/building-sets.js';
const c=createCity(),before=serializeCity(c),view={variedApartments:true},variants=new Set();
for(let x=0;x<48;x++){const t={type:'residential',x,y:20,level:2,lotRoot:null};const sprite=cityZonedSprite(t,c,view);variants.add(sprite);assert.equal(cityZonedSprite({...t,age:50},c,view),sprite);assert.equal(cityZonedSprite({...t,level:0,historicalLevel:2},c,view),sprite);assert.equal(cityZonedSprite({...t,level:0,abandonedLevel:2},c,view),sprite);assert.equal(cityZonedSprite(t,c,{}),1);assert.equal(cityZonedSprite({...t,type:'commercial'},c,view),4,'apartment preference does not affect offices');}
assert.deepEqual(variants,new Set([1,78]));assert.equal(serializeCity(c),before);replaceBuildingStyle(c,1,78);assert.equal(zonedSprite({type:'residential',x:1,y:1,level:2},c.seed,c.buildingReplacements),78);assert.deepEqual(copyBuildingSet(c).buildingReplacements,{'1':78});assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).buildingReplacements,{'1':78});replaceBuildingStyle(c,1,2);assert.equal(cityZonedSprite({type:'residential',x:1,y:1,level:2,lotRoot:null},c,view),2);replaceBuildingStyle(c,1,1);c.buildingDesigns={'1':{name:'Custom'}};assert.equal(cityZonedSprite({type:'residential',x:1,y:1,level:2,lotRoot:null},c,view),1);
console.log('PASS: stable mixed apartments, separate office artwork, history/abandonment, saved replacements and building sets, custom priority and unchanged simulation.');
