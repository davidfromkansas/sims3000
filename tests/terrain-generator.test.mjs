import assert from 'node:assert/strict';
import {generateCity} from '../dist/terrain-generator.js';
import {planBuild,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const a=generateCity(),b=generateCity();assert.equal(serializeCity(a),serializeCity(b));assert.notEqual(serializeCity(a),serializeCity(generateCity({seed:74})));assert.equal(a.month,0);assert.equal(a.stats.population,0);assert.equal(a.funds,50000);
const dry=generateCity({water:0,trees:0,mountains:100,center:'mountain'});assert.ok(dry.tiles.every(t=>t.terrain==='land'&&!t.nature));assert.equal(Math.max(...dry.tiles.map(t=>t.elevation)),8);for(const t of dry.tiles)for(const [dx,dy] of [[1,0],[0,1]]){const n=dry.tiles[(t.y+dy)*48+t.x+dx];if(n&&t.x+dx<48)assert.ok(Math.abs(t.elevation-n.elevation)<=1);}
const lake=generateCity({center:'lake',coasts:[]});assert.ok(lake.tiles.some(t=>t.terrain==='water'));assert.ok(lake.tiles.filter(t=>t.terrain==='water').every(t=>t.waterKind==='fresh'));
const coast=generateCity({center:'dry',coasts:['east'],water:100});assert.equal(coast.tiles[24*48+47].waterKind,'salt');assert.equal(coast.tiles[24*48].terrain,'land');
for(const [difficulty,funds] of [['easy',50000],['medium',30000],['hard',10000]])assert.equal(generateCity({difficulty}).funds,funds);
const old=generateCity({startYear:1900,mayorName:'Ada',water:0,trees:0,mountains:0});assert.equal(planBuild(old,'gas',[{x:20,y:20}]).ok,false);const future=generateCity({startYear:2050,water:0,trees:0,mountains:0});assert.equal(planBuild(future,'fusion',[{x:20,y:20}]).ok,true);
const saved=validateSave(JSON.parse(serializeCity(old)));assert.equal(saved.startYear,1900);assert.equal(saved.mayorName,'Ada');assert.equal(saved.difficulty,'easy');const legacy=JSON.parse(serializeCity(old));legacy.version=15;delete legacy.startYear;delete legacy.mayorName;delete legacy.difficulty;assert.equal(validateSave(legacy).startYear,1950);for(const options of [{seed:-1},{startYear:1899},{mountains:101},{coasts:['bad']}])assert.throws(()=>generateCity(options));
console.log('PASS: deterministic terrain, coast and freshwater profiles, slope limits, difficulty funds, start-year technology gates, save round trips and migration.');
