import assert from 'node:assert/strict';
import {createCity,validateSave} from '../dist/engine.js';
import {cityZonedSprite,zonedSprite,replaceBuildingStyle} from '../dist/building-art.js';
import {serializeCity} from '../dist/save.js';
import {copyBuildingSet} from '../dist/building-sets.js';
const c=createCity(),before=serializeCity(c),view={variedShops:true},variants=new Set();
for(let x=0;x<48;x++){const t={type:'commercial',x,y:20,level:1,lotRoot:null};const sprite=cityZonedSprite(t,c,view);variants.add(sprite);assert.equal(cityZonedSprite({...t,age:50},c,view),sprite);assert.equal(cityZonedSprite({...t,level:0,historicalLevel:1},c,view),sprite);assert.equal(cityZonedSprite({...t,level:0,abandonedLevel:1},c,view),sprite);assert.equal(cityZonedSprite(t,c,{}),3);assert.equal(cityZonedSprite({...t,type:'residential'},c,view),0,'shop preference does not affect homes');}
assert.deepEqual(variants,new Set([3,77]));assert.equal(serializeCity(c),before);replaceBuildingStyle(c,3,77);assert.equal(zonedSprite({type:'commercial',x:1,y:1,level:1},c.seed,c.buildingReplacements),77);assert.deepEqual(copyBuildingSet(c).buildingReplacements,{'3':77});assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).buildingReplacements,{'3':77});replaceBuildingStyle(c,3,4);assert.equal(cityZonedSprite({type:'commercial',x:1,y:1,level:1,lotRoot:null},c,view),4);replaceBuildingStyle(c,3,3);c.buildingDesigns={'3':{name:'Custom'}};assert.equal(cityZonedSprite({type:'commercial',x:1,y:1,level:1,lotRoot:null},c,view),3);
console.log('PASS: stable mixed shops, separate home preference, history/abandonment, saved replacements and building sets, custom priority and unchanged simulation.');
