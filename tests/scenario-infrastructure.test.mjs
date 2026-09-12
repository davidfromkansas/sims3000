import assert from 'node:assert/strict';
import {createCity,build,selection,idx,recompute,tick,validateSave} from '../dist/engine.js';
import {attachCustomScenario,customGoals} from '../dist/custom-scenarios.js';
import {CUSTOM_METRICS as m} from '../dist/scenario-metrics.js';
import {eventConditionMet} from '../dist/scenario-events.js';
import {serializeCity} from '../dist/save.js';
const c=createCity('Airport challenge',false);for(const t of c.tiles){t.terrain='land';t.nature=false;}
for(let y=0;y<48;y++)c.tiles[idx(18,y)].terrain='water';
for(const [tool,points] of [['pump',[{x:19,y:21}]],['pipe',selection('pipe',{x:19,y:21},{x:23,y:21})],['road',selection('road',{x:24,y:20},{x:24,y:25})],['coal',[{x:26,y:20}]],['airport',selection('airport',{x:20,y:20},{x:22,y:24})]])assert.ok(build(c,tool,points).ok);
attachCustomScenario(c,{title:'Open an airport',months:12,objectives:[{metric:'activeAirports',target:1}]});
assert.equal(customGoals(c)[0].done,false);for(let i=0;i<5;i++)tick(c);assert.equal(c.scenario.status,'playing');tick(c);assert.equal(c.scenario.status,'won');assert.equal(m.activeAirports.read(c),1,'one full footprint counts once');
assert.deepEqual(validateSave(JSON.parse(serializeCity(c))).scenario,c.scenario);
build(c,'bulldoze',[{x:26,y:20}]);assert.equal(m.activeAirports.read(c),0,'developed but unpowered airport is not operating');
const h=createCity('Utilities',false);const t=h.tiles[idx(20,20)];Object.assign(t,{type:'residential',level:1,powered:false,watered:false});
assert.equal(m.unpoweredHomes.read(h),1);assert.equal(m.unwateredHomes.read(h),1);t.powered=true;assert.equal(m.unpoweredHomes.read(h),0);assert.equal(m.unwateredHomes.read(h),1);t.level=0;assert.equal(m.unwateredHomes.read(h),0,'empty zones do not count as occupied homes');
assert.ok(eventConditionMet(c,{metric:'activeAirports',operator:'lte',target:0}));
const b=createCity('Bus goal',false);for(const t of b.tiles){t.terrain='land';t.nature=false;}build(b,'road',selection('road',{x:12,y:20},{x:40,y:20}));for(const [x,y,type] of [[14,19,'residential'],[36,21,'industrial']])Object.assign(b.tiles[idx(x,y)],{type,level:3,density:3});recompute(b);assert.equal(m.busRiders.read(b),0);build(b,'busStop',[{x:14,y:21}]);assert.equal(m.activeBusStops.read(b),1);assert.ok(m.busRiders.read(b)>0);build(b,'bulldoze',[{x:26,y:20}]);assert.equal(m.busRiders.read(b),0,'placed stops cannot substitute for connected commutes');
console.log('PASS: infrastructure goals require working facilities, whole-airport counting, timed victory, utility home counts, actual bus journeys, conditional metrics and save continuity.');
