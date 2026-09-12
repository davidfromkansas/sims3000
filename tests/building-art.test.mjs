import assert from 'node:assert/strict';
import {zonedSprite} from '../dist/building-art.js';
for(const [type,old,newSprite]of [['residential',2,74],['commercial',5,75]]){const variants=new Set();for(let x=0;x<48;x++){const t={type,x,y:24,level:3,historicalLevel:0};const sprite=zonedSprite(t,123);variants.add(sprite);assert.equal(zonedSprite({...t,age:99},123),sprite);assert.equal(zonedSprite({...t,level:0,historicalLevel:3},123),sprite,'historical vacancy preserves tower variant');assert.equal(zonedSprite(JSON.parse(JSON.stringify(t)),123),sprite);}assert.deepEqual(variants,new Set([old,newSprite]));}
assert.equal(zonedSprite({type:'industrial',industry:'farm',x:3,y:4,farmRoot:195,level:1},0),52);assert.equal(zonedSprite({type:'industrial',industry:'clean',x:3,y:4,level:3},0),56);
console.log('PASS: both skyline variants, deterministic saved lots, historical appearance preservation and unchanged farm/clean-industry artwork.');
