import assert from 'node:assert/strict';
import {createScenario} from '../dist/scenario-setup.js';
import {scenarioGoals,advanceScenario} from '../dist/scenarios.js';
import {businessRoots} from '../dist/business.js';
import {build,validateSave,tick,planBuild} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const c=createScenario('pollution');assert.equal(c.funds,10000);assert.equal(c.stats.population,224);assert.equal(c.stats.businessIncome,300);assert.equal(c.business.toxicWaste.accepted,true);assert.equal(c.emergency.randomToxicClouds,false);assert.equal(scenarioGoals(c).every(g=>g.done),false);assert.equal(serializeCity(createScenario('pollution')),serializeCity(c),'restart restores exact starting city');assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).scenario,c.scenario);
const t=businessRoots(c).find(t=>t.type==='toxicWaste');assert.ok(build(c,'bulldoze',[t]).ok);assert.equal(c.stats.businessIncome,0);assert.equal(scenarioGoals(c)[1].done,true);
function check(month,funds=5000){c.month=month;c.funds=funds;c.stats.population=400;c.stats.averagePollution=15;advanceScenario(c);}
for(let m=1;m<=5;m++)check(m);assert.equal(c.scenario.status,'playing');assert.equal(c.scenario.streak,5);check(6,4999);assert.equal(c.scenario.streak,0);for(let m=7;m<=12;m++)check(m);assert.equal(c.scenario.status,'won');assert.equal(c.scenario.streak,6);
const fail=createScenario('pollution');fail.month=36;advanceScenario(fail);assert.equal(fail.scenario.status,'lost');
console.log('PASS: deterministic prepared city, inherited plant stipend, removal tradeoff, scenario save, six-month inclusive goal streak, reset and deadline loss.');
// A complete solution using normal construction and monthly simulation.
const playable=createScenario('pollution');build(playable,'bulldoze',[businessRoots(playable)[0]]);const roads=playable.tiles.filter(t=>t.type==='road');for(const [type,count]of [['landfill',6],['residential',26],['commercial',12]])for(let k=0;k<count;k++){const site=playable.tiles.filter(t=>t.terrain==='land'&&!t.type&&roads.some(r=>Math.abs(r.x-t.x)+Math.abs(r.y-t.y)<=3)).sort((a,b)=>Math.hypot(a.x-25,a.y-20)-Math.hypot(b.x-25,b.y-20)).find(t=>planBuild(playable,type,[t]).ok);assert.ok(site);assert.ok(build(playable,type,[site]).ok);}for(let i=0;i<36&&playable.scenario.status==='playing';i++)tick(playable);assert.equal(playable.scenario.status,'won');assert.ok(playable.stats.population>=400&&playable.funds>=5000&&playable.stats.averagePollution<=15);
