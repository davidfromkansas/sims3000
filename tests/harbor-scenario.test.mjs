import assert from 'node:assert/strict';
import {createScenario} from '../dist/scenario-setup.js';
import {harborReady,scenarioGoals,advanceScenario} from '../dist/scenarios.js';
import {build,tick,validateSave,planBuild} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {harborPaths} from '../dist/harbor-visuals.js';
const c=createScenario('harbor');assert.equal(c.stats.population,224);assert.equal(c.funds,12500);assert.equal(harborReady(c),false);assert.equal(c.stats.facilityPlots[0].developed,true);assert.match(c.stats.facilityPlots[0].reason,/water/);assert.equal(harborPaths(c).length,0);assert.equal(serializeCity(createScenario('harbor')),serializeCity(c));assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).scenario,c.scenario);
assert.ok(build(c,'pipe',[{x:19,y:20}]).ok);assert.equal(harborReady(c),true);assert.equal(harborPaths(c).length,1);assert.equal(scenarioGoals(c)[1].done,true);assert.deepEqual(scenarioGoals(c)[1].area,{x:10,y:22,radius:4});
// Solve through normal building and simulation, without replacing statistics.
const roads=c.tiles.filter(t=>t.type==='road');for(const [type,count]of [['residential',26],['commercial',12]])for(let k=0;k<count;k++){const site=c.tiles.filter(t=>t.terrain==='land'&&!t.type&&roads.some(r=>Math.abs(r.x-t.x)+Math.abs(r.y-t.y)<=3)).sort((a,b)=>Math.hypot(a.x-25,a.y-20)-Math.hypot(b.x-25,b.y-20)).find(t=>planBuild(c,type,[t]).ok);assert.ok(site);assert.ok(build(c,type,[site]).ok);}
for(let i=0;i<36&&c.scenario.status==='playing';i++)tick(c);assert.equal(c.scenario.status,'won');assert.ok(c.stats.population>=400&&c.funds>=5000&&harborReady(c));assert.equal(c.scenario.streak,6);assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).scenario,c.scenario);
const fail=createScenario('harbor');fail.month=36;advanceScenario(fail);assert.equal(fail.scenario.status,'lost');const interrupted=createScenario('harbor');build(interrupted,'pipe',[{x:19,y:20}]);interrupted.stats.population=400;for(let m=1;m<6;m++){interrupted.month=m;advanceScenario(interrupted);}assert.equal(interrupted.scenario.streak,5);build(interrupted,'removePipe',[{x:19,y:20}]);interrupted.month=6;advanceScenario(interrupted);assert.equal(interrupted.scenario.streak,0);assert.equal(harborPaths(interrupted).length,0);
console.log('PASS: deterministic harbor challenge, real pipe repair restores ships, six-month recovery, interruption reset, complete normal-game solution, saved victory and deadline loss.');
