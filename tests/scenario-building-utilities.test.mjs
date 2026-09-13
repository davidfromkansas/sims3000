import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,tick,validateSave} from '../dist/engine.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
import {powerBaseNeed,waterBaseNeed} from '../dist/utility-demand.js';
import {buildingsWithout} from '../dist/scenario-building-utilities.js';
import {attachCustomScenario} from '../dist/custom-scenarios.js';
import {serializeCity} from '../dist/save.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
import {eventConditionMet} from '../dist/scenario-events.js';
const base=()=>{const c=createCity('Restore services',false);c.funds=500000;for(const t of c.tiles){t.terrain='land';t.elevation=0;t.nature=false;}recompute(c);return c;};
const put=(c,type,x,y)=>assert.ok(build(c,type,selection(type,{x,y},{x,y},c.size)).ok);
const c=base();put(c,'school',13,12);put(c,'commercial',12,12);c.tiles[12*48+12].level=1;put(c,'residential',40,40);recompute(c);
assert.equal(buildingsWithout(c,'powered'),2);assert.equal(buildingsWithout(c,'watered'),1);assert.equal(CUSTOM_METRICS.unpoweredHomes.read(c),0);
assert.equal(powerBaseNeed(c.tiles[12*48+13]),8);assert.equal(waterBaseNeed(c.tiles[12*48+13]),0,'schools currently consume electricity only');
for(const metric of ['unpoweredBuildings','unwateredBuildings'])assert.equal(eventConditionMet(c,{metric,target:CUSTOM_METRICS[metric].read(c),operator:'eq'}),true);
const before=serializeCity(c);buildingsWithout(c,'powered');assert.equal(serializeCity(c),before);const loaded=validateSave(JSON.parse(before));assert.equal(buildingsWithout(loaded,'powered'),2);
// Count each family by its root, including a missing service on the far member.
for(const [kind,type,width,height] of [['lotRoot','commercial',2,2],['farmRoot','industrial',3,3],['facilityRoot','airport',3,5],['root','stadium',4,4]]){
 const f=base(),root=10*48+10;
 for(let y=10;y<10+height;y++)for(let x=10;x<10+width;x++)Object.assign(f.tiles[y*48+x],{type,level:1,[kind]:root,powered:true,watered:true});
 const end=f.tiles[(9+height)*48+9+width];end.powered=false;end.watered=false;
 assert.equal(buildingsWithout(f,'powered'),1,kind);assert.equal(buildingsWithout(f,'powered',{x:10,y:10,radius:0}),1);assert.equal(buildingsWithout(f,'powered',{x:end.x,y:end.y,radius:0}),0,'area uses building origin');
 assert.equal(buildingsWithout(f,'watered'),type==='stadium'?0:1);
 end.powered=true;assert.equal(buildingsWithout(f,'powered'),0);
}
const empty=base();for(const [i,type]of ['road','powerline','park','coal','railStation','commercial','airport'].entries())Object.assign(empty.tiles[500+i],{type,level:0,powered:false,watered:false});assert.equal(buildingsWithout(empty,'powered'),0);assert.equal(buildingsWithout(empty,'watered'),0);
Object.assign(empty.tiles[505],{abandonedLevel:1});assert.equal(buildingsWithout(empty,'powered'),1,'standing abandoned building remains eligible');empty.tiles[505].rubble=true;assert.equal(buildingsWithout(empty,'powered'),0);
attachCustomScenario(c,{title:'Restore the district',months:12,objectives:[{metric:'unpoweredBuildings',target:0},{metric:'unwateredBuildings',target:0}],events:[{type:'announcement',month:1,message:'Power outages: {unpoweredBuildings}.',condition:{metric:'unpoweredBuildings',operator:'eq',target:0}}]});
tick(c);assert.equal(c.scenario.status,'playing');put(c,'coal',8,8);put(c,'waterTower',12,11);put(c,'pipe',12,11);recompute(c);assert.equal(buildingsWithout(c,'powered'),0);assert.equal(buildingsWithout(c,'watered'),0);
const saved=validateSave(JSON.parse(serializeCity(c)));tick(c);tick(saved);assert.equal(c.scenario.status,'won');assert.deepEqual(c.scenario,saved.scenario);assert.equal(c.scenario.events[0].message,'Power outages: 0.');
const replay=restartCustomScenario(validateSave(JSON.parse(serializeCity(c))));assert.equal(buildingsWithout(replay,'powered'),2);assert.equal(buildingsWithout(replay,'watered'),1);
console.log('PASS: building-wide utility goals, demand eligibility, distinct footprint roots, partial outages, local origin counts, abandonment, saved restoration challenge and restart.');
