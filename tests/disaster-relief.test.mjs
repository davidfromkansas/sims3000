import assert from 'node:assert/strict';
import {createCity,recompute,tick,validateSave,build} from '../dist/engine.js';
import {startEarthquake,stepFire,ignite,explodePlant} from '../dist/emergency.js';
import {startLocusts} from '../dist/locusts.js';
import {startSpaceJunk} from '../dist/space-junk.js';
import {serializeCity} from '../dist/save.js';
import {reliefAward,settleDisasterRelief,disasterReliefReport} from '../dist/disaster-relief.js';
import {annualAccounts} from '../dist/economy.js';
const restore=c=>validateSave(JSON.parse(serializeCity(c)));
assert.equal(reliefAward({destroyed:11,displaced:63,infrastructure:15},100),0);
for(const losses of [{destroyed:12,displaced:0,infrastructure:0},{destroyed:0,displaced:64,infrastructure:0},{destroyed:0,displaced:0,infrastructure:16}])assert.equal(reliefAward(losses,100),2*reliefAward(losses,0));
assert.equal(reliefAward({destroyed:0,displaced:0,infrastructure:0,vegetation:64},100),1600);
assert.equal(reliefAward({destroyed:10000,displaced:10000,infrastructure:10000},100),25000);
let c=createCity(),cash=c.funds;assert.ok(startEarthquake(c,20,20).ok);const baseline=structuredClone(c.emergency.relief.pending);assert.ok(startSpaceJunk(c,22,20).ok);assert.deepEqual(c.emergency.relief.pending,baseline,'overlapping hazards retain one initial assessment');
for(let i=0;i<4;i++){stepFire(c);recompute(c);}const saved=restore(c);assert.deepEqual(saved.emergency.relief,c.emergency.relief);
function finish(city){let result,steps=0;while(city.emergency.active&&steps++<1000){result=stepFire(city);recompute(city);}assert.ok(steps<1000);return result;}
const result=finish(c),resumed=finish(saved);assert.equal(result.relief,resumed.relief);assert.ok(result.relief>0,'a destructive real multi-hazard session qualifies');assert.deepEqual(saved.emergency.relief,c.emergency.relief);assert.equal(c.funds,cash+result.relief);assert.equal(c.emergency.relief.total,result.relief);assert.equal(c.emergency.relief.pending,null);assert.equal(settleDisasterRelief(c),0);assert.equal(stepFire(c).ended,false);assert.equal(restore(c).funds,c.funds,'loading a completed grant cannot repay it');
const amount=result.relief;assert.equal(c.emergency.relief.unrecorded,amount);tick(c);assert.equal(c.history.at(-1).disasterRelief,amount);assert.equal(c.emergency.relief.unrecorded,0);tick(c);assert.equal(c.history.at(-1).disasterRelief,0);assert.equal(annualAccounts(c,12).disasterRelief,amount);assert.equal(annualAccounts(restore(c),12).disasterRelief,amount);assert.match(disasterReliefReport(c),/one-time treasury grant/);
// Preparedness is frozen at session start, independently of later repair/funding changes.
for(const prepared of [false,true]){
 const city=createCity();for(const t of city.tiles)if(t.type==='residential'&&t.level){t.fireCoverage=prepared?100:0;t.watered=prepared;}
 startEarthquake(city,20,20);assert.equal(city.emergency.relief.pending.preparedness,prepared?100:0);
 for(const t of city.tiles){t.fireCoverage=prepared?0:100;t.watered=!prepared;}assert.equal(city.emergency.relief.pending.preparedness,prepared?100:0);
 finish(city);assert.equal(city.emergency.relief.last.preparedness,prepared?100:0);
}
// Legacy active responses finish without a fabricated start assessment or retroactive payment.
const old=createCity();startEarthquake(old,20,20);const legacy=JSON.parse(serializeCity(old));legacy.version=104;delete legacy.emergency.relief;const migrated=validateSave(legacy),funds=migrated.funds;finish(migrated);assert.equal(migrated.funds,funds);assert.equal(migrated.emergency.relief.total,0);
// Immediate plant failures also start/end the same accounting lifecycle.
const plantCity=createCity('Plant relief',false);for(const t of plantCity.tiles){t.terrain='land';t.elevation=0;t.nature=false;}recompute(plantCity);assert.ok(build(plantCity,'coal',[{x:20,y:20}]).ok);const plant=plantCity.tiles[20*48+20];explodePlant(plantCity,plant);assert.equal(plantCity.emergency.active,false);assert.equal(plantCity.emergency.relief.last.destroyed,1);assert.equal(plantCity.emergency.relief.last.amount,0);
const cropCity=createCity('Locust aid',false);for(const t of cropCity.tiles){t.terrain='land';t.elevation=0;t.nature=true;}recompute(cropCity);startLocusts(cropCity,20,20);finish(cropCity);assert.ok(cropCity.emergency.relief.last.vegetation>=64);assert.ok(cropCity.emergency.relief.last.amount>0);
const valid=JSON.parse(serializeCity(c));for(const mutate of [v=>v.emergency.relief.total=-1,v=>v.emergency.relief.unrecorded=v.emergency.relief.total+1,v=>v.emergency.relief.last.amount=25001,v=>v.emergency.relief.last.month=v.month+1,v=>v.emergency.relief.last.preparedness=101,v=>v.emergency.relief.pending={...v.emergency.relief.last}]){const bad=structuredClone(valid);mutate(bad);assert.throws(()=>validateSave(bad),/relief/);}
console.log('PASS: disaster-relief thresholds, preparedness capture, real overlapping hazard/save continuation, single payout, monthly and annual accounting, legacy no-retroactive aid, immediate plant failures and malformed-save rejection.');
