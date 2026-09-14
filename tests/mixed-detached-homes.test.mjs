import assert from 'node:assert/strict';
import {createCity} from '../dist/engine.js';
import {cityZonedSprite,baseZonedSprite,replaceBuildingStyle} from '../dist/building-art.js';
import {createCityViewOptions,CITY_VIEW_DEFAULTS} from '../dist/city-view-options.js';
import {serializeCity} from '../dist/save.js';
const c=createCity(),before=serializeCity(c),view={variedHomes:true},variants=new Set();
for(let x=0;x<48;x++){const t={type:'residential',x,y:20,level:1,lotRoot:null};const sprite=cityZonedSprite(t,c,view);variants.add(sprite);assert.equal(baseZonedSprite(t,c.seed),0);assert.equal(cityZonedSprite({...t,age:20},c,view),sprite);assert.equal(cityZonedSprite({...t,level:0,historicalLevel:1},c,view),sprite);assert.equal(cityZonedSprite({...t,level:0,abandonedLevel:1},c,view),sprite);assert.equal(cityZonedSprite(t,c,{}),0);}
assert.deepEqual(variants,new Set([0,76]));assert.equal(serializeCity(c),before);const t={type:'residential',x:4,y:20,level:1,lotRoot:null};replaceBuildingStyle(c,0,1);assert.equal(cityZonedSprite(t,c,view),1);replaceBuildingStyle(c,0,76);assert.equal(cityZonedSprite(t,c,view),76);replaceBuildingStyle(c,0,0);c.buildingDesigns={'0':{name:'Custom'}};assert.equal(cityZonedSprite(t,c,view),0);
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};const options=createCityViewOptions(storage);assert.equal(options.settings.variedHomes,false);options.apply({...CITY_VIEW_DEFAULTS,variedHomes:true});assert.equal(createCityViewOptions(storage).settings.variedHomes,true);
console.log('PASS: stable mixed home artwork, default preservation, historical/abandoned continuity, replacement/custom-design priority, simulation immutability and browser preference persistence.');
