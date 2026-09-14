import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {recomputeEnvironment} from '../dist/economy.js';
import {recomputeCivic} from '../dist/civic.js';
import {activeCityHalls,cityHallCrimeRelief} from '../dist/rewards.js';
const c=createCity('City Hall neighborhood',false);c.funds=100000;c.rewards.earned.cityHall=0;
for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});
for(const [tool,x,y] of [['coal',35,15],['cityHall',27,17]])assert.ok(build(c,tool,[{x,y}]).ok);
assert.ok(build(c,'powerline',selection('powerline',{x:8,y:16},{x:34,y:16})).ok);
assert.ok(build(c,'road',selection('road',{x:8,y:20},{x:30,y:20})).ok);
assert.ok(build(c,'residential',[{x:24,y:18}]).ok);c.tiles[18*48+24].level=1;recompute(c);
const home=c.tiles[18*48+24],root=c.tiles[17*48+27];
assert.equal(activeCityHalls(c).length,1);assert.equal(cityHallCrimeRelief([root],{x:28,y:18}),20);
assert.equal(cityHallCrimeRelief([root],{x:48,y:18}),0);assert.equal(cityHallCrimeRelief([root],{x:38,y:18}),10);
// Hold traffic and other emitters fixed to isolate the once-per-footprint field.
const fieldCity=structuredClone(c);recomputeEnvironment(fieldCity);const on=fieldCity.tiles.map(t=>[t.airPollution,t.waterPollution]);fieldCity.tiles[17*48+27].fire=true;recomputeEnvironment(fieldCity);
for(const [x,y,air,water] of [[28,18,4.5,4.5],[32,18,4.5*7/11,1.5],[38,18,4.5/11,0],[39,18,0,0]]){const i=y*48+x;assert.ok(Math.abs(on[i][0]-fieldCity.tiles[i].airPollution-air)<1e-9);assert.ok(Math.abs(on[i][1]-fieldCity.tiles[i].waterPollution-water)<1e-9);}
assert.ok(home.cityHallCrimeRelief>0);const withHall={crime:home.crime,air:home.airPollution,water:home.waterPollution};
const values=()=>[home.crime,home.landValue,home.cityHallCrimeRelief,home.airPollution,home.waterPollution];const baseline=values();recompute(c);assert.deepEqual(values(),baseline);recomputeCivic(c);assert.deepEqual(values(),baseline);
const restored=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(restored.stats,c.stats);assert.equal(restored.tiles[18*48+24].cityHallCrimeRelief,home.cityHallCrimeRelief);
assert.ok(build(c,'bulldoze',[{x:28,y:18}]).ok);assert.equal(activeCityHalls(c).length,0);assert.equal(home.cityHallCrimeRelief,0);assert.ok(home.crime>withHall.crime);assert.ok(home.airPollution<withHall.air);assert.ok(home.waterPollution<withHall.water);
assert.ok(build(c,'cityHall',[{x:27,y:17}]).ok);assert.ok(home.cityHallCrimeRelief>0);
assert.ok(build(c,'bulldoze',[{x:35,y:15}]).ok);assert.equal(activeCityHalls(c).length,0);assert.equal(home.cityHallCrimeRelief,0);assert.equal(home.airPollution,0);assert.equal(home.waterPollution,0);
console.log('PASS: City Hall neighborhood crime and pollution tradeoff, radius boundaries, single-footprint effects, repeat recomputation, saved continuation, demolition/rebuilding and power-loss shutdown.');
