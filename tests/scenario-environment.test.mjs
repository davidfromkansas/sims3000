import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,tick,validateSave,VERSION} from '../dist/engine.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
import {averageWaterPollution,averageRoadTraffic,surplusPower,surplusWater} from '../dist/city-measures.js';
import {reportSnapshot} from '../dist/reports.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {eventConditionMet,validateEventCondition} from '../dist/scenario-events.js';
import {serializeCity} from '../dist/save.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
import {addConnection,connectionCandidates,signDeal} from '../dist/region.js';
const base=()=>{const c=createCity('Supply challenge',false);c.funds=500000;for(const t of c.tiles){t.terrain='land';t.elevation=0;t.nature=false;}recompute(c);return c;};
const put=(c,tool,x,y,xx=x,yy=y)=>assert.ok(build(c,tool,selection(tool,{x,y},{x:xx,y:yy},c.size)).ok),close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const c=base();assert.equal(averageRoadTraffic(c),0);put(c,'residential',12,12);assert.equal(surplusPower(c),-1);assert.equal(surplusWater(c),-1);
put(c,'coal',8,8);put(c,'waterTower',12,11);put(c,'pipe',12,11,12,12);put(c,'residential',40,40);
assert.ok(surplusPower(c)>0);assert.ok(surplusWater(c)>0);assert.equal(c.tiles[40*48+40].powered,false);assert.equal(c.tiles[40*48+40].watered,false,'positive citywide reserve does not connect a distant lot');
close(surplusPower(c),c.stats.powerNetworks.reduce((sum,g)=>sum+g.available-g.demand,0));close(surplusWater(c),c.stats.waterCapacity-c.stats.waterDemand);
const trade=base();put(trade,'powerline',42,20,47,20);put(trade,'residential',40,20);assert.ok(addConnection(trade,connectionCandidates(trade).find(p=>p.kind==='power')).ok);assert.ok(signDeal(trade,0,'power','import',50).ok);recompute(trade);assert.equal(trade.stats.powerImported,1);assert.equal(surplusPower(trade),0,'only delivered imports contribute');
put(c,'road',10,14,16,14);c.tiles[14*48+10].traffic=3;c.tiles[14*48+11].traffic=11;assert.equal(averageRoadTraffic(c),2);assert.equal(reportSnapshot(c).traffic,CUSTOM_METRICS.traffic.read(c));assert.equal(reportSnapshot(c).waterPollution,CUSTOM_METRICS.waterPollution.read(c));assert.ok(averageWaterPollution(c)>0);
c.tiles[12*48+12].waste=20;recompute(c);assert.equal(CUSTOM_METRICS.uncollectedGarbage.read(c),20);const before=serializeCity(c);
for(const metric of ['waterPollution','traffic','surplusPower','surplusWater','uncollectedGarbage']){const m=CUSTOM_METRICS[metric],value=m.read(c);assert.equal(eventConditionMet(c,{metric,target:value,operator:'eq'}),true);assert.equal(eventConditionMet(c,{metric,target:value,operator:'gt'}),false);for(const target of [(m.min??0)-1,m.max+1,NaN,Infinity]){assert.throws(()=>validateCustomDefinition({title:'Invalid',months:12,objectives:[{metric,target}]}));assert.throws(()=>validateEventCondition({metric,target,operator:'eq'}));}}
assert.equal(serializeCity(c),before,'queries are read-only');const loaded=validateSave(JSON.parse(before));close(surplusWater(loaded),surplusWater(c));close(surplusPower(loaded),surplusPower(c));
// An actual challenge waits for the player to build supply, then completes and
// announces current environmental values. Replay restores the unsupplied city.
const challenge=base();put(challenge,'residential',12,12);attachCustomScenario(challenge,{title:'Provide a reserve',months:12,objectives:[{metric:'surplusPower',target:100},{metric:'surplusWater',target:50}],events:[{type:'announcement',month:1,message:'Water pollution {waterPollution}; garbage {uncollectedGarbage}.',condition:{metric:'surplusWater',operator:'gte',target:50}}]});tick(challenge);assert.equal(challenge.scenario.status,'playing');assert.equal(challenge.scenario.events[0].runs,0);put(challenge,'coal',8,8);put(challenge,'waterTower',12,11);put(challenge,'pipe',12,11,12,12);const saved=validateSave(JSON.parse(serializeCity(challenge)));tick(challenge);tick(saved);assert.equal(challenge.scenario.status,'won');assert.deepEqual(challenge.scenario,saved.scenario);assert.match(challenge.scenario.events[0].message,/Water pollution \d/);const replay=restartCustomScenario(validateSave(JSON.parse(serializeCity(challenge))));assert.equal(surplusPower(replay),-1);assert.equal(surplusWater(replay),-1);
const legacy=JSON.parse(before);legacy.version=107;assert.equal(validateSave(legacy).version,VERSION);
console.log('PASS: actual utility deficits and connected reserves, disconnected lots, delivered imports, shared report averages, garbage accumulation, read-only queries, valid ranges and saved/replayed supply-building challenge.');
