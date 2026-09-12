import assert from 'node:assert/strict';
import {createCity,build,idx,recompute,validateSave} from '../dist/engine.js';
import {startSpaceJunk} from '../dist/space-junk.js';
import {stepFire} from '../dist/emergency.js';
import {serializeCity} from '../dist/save.js';
import {attachCustomScenario} from '../dist/custom-scenarios.js';
import {runScenarioEvents} from '../dist/scenario-events.js';
function empty(){const c=createCity('Debris',false);for(const t of c.tiles){t.terrain='land';t.nature=false;}recompute(c);return c;}
const c=empty();const target=c.tiles[idx(20,20)],neighbor=c.tiles[idx(21,20)];Object.assign(target,{type:'residential',level:1,pipe:true,subway:true,rail:true,highway:true});Object.assign(neighbor,{type:'residential',level:1});recompute(c);assert.ok(startSpaceJunk(c,20,20).ok);assert.equal(startSpaceJunk(c,22,20).ok,false);for(let i=0;i<3;i++)stepFire(c);assert.equal(target.level,1,'four response steps before impact');stepFire(c);assert.equal(target.level,0);assert.ok(target.rubble);assert.ok(neighbor.fire>0);assert.ok(target.pipe&&target.subway);assert.ok(!target.rail&&!target.highway);assert.equal(c.emergency.spaceJunkImpacts,1);assert.equal(c.month,0);recompute(c);
const saved=validateSave(JSON.parse(serializeCity(c)));for(let i=0;i<8;i++){stepFire(c);stepFire(saved);recompute(c);recompute(saved);}assert.equal(serializeCity(saved),serializeCity(c),'saved impact sequence and fires continue identically');
const clear=empty();startSpaceJunk(clear,20,20);for(let i=0;i<23;i++)assert.equal(stepFire(clear).ended,false);assert.equal(stepFire(clear).ended,true);assert.equal(clear.emergency.spaceJunkImpacts,6);assert.equal(clear.emergency.spaceJunk,null);
const plant=empty();assert.ok(build(plant,'coal',[{x:20,y:20}]).ok);startSpaceJunk(plant,21,21);for(let i=0;i<4;i++)stepFire(plant);assert.equal(plant.tiles.filter(t=>t.type==='coal').length,0,'striking any member destroys whole building');
const water=empty();water.tiles[idx(20,20)].terrain='water';startSpaceJunk(water,20,20);for(let i=0;i<4;i++)stepFire(water);assert.equal(water.emergency.destroyed,0);assert.equal(water.tiles[idx(20,20)].rubble,false);
const old=JSON.parse(serializeCity(empty()));old.version=41;delete old.emergency.spaceJunk;delete old.emergency.spaceJunkFalls;delete old.emergency.spaceJunkImpacts;assert.equal(validateSave(old).emergency.spaceJunk,null);
const bad=JSON.parse(serializeCity(c));bad.emergency.spaceJunk.age=24;assert.throws(()=>validateSave(bad));
const scenario=empty();attachCustomScenario(scenario,{title:'Falling debris',months:12,objectives:[{metric:'population',target:100}],events:[{type:'spaceJunk',month:1,x:20,y:20}]});scenario.month=1;assert.equal(runScenarioEvents(scenario).status,'triggered');assert.ok(scenario.emergency.spaceJunk);
console.log('PASS: delayed impacts, surface damage, secondary fires, buried utility survival, whole-building destruction, water impacts, emergency duration, deterministic save continuation and scenario scheduling.');
