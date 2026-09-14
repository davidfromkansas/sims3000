import assert from 'node:assert/strict';
import {createCity,recompute,validateSave,idx} from '../dist/engine.js';
import {auraBreakdown,localTrafficPenalty,auraReport} from '../dist/aura.js';
import {changeCivic} from '../dist/civic.js';
import {analyzeOrdinances} from '../dist/ordinance-analysis.js';
import {serializeCity} from '../dist/save.js';
const c=createCity(),home=c.tiles[idx(20,20)],b=auraBreakdown(c,home);assert.equal(b.value,home.aura);assert.ok(b.factors.traffic<0);assert.ok(Math.abs(Object.values(b.factors).reduce((a,n)=>a+n,0)+b.capAdjustment-b.value)<1e-9);
const initial=serializeCity(c),oldTraffic=b.factors.traffic,oldAura=home.aura,preview=analyzeOrdinances(c,{...c.civic.ordinances,carpool:true});assert.equal(serializeCity(c),initial);changeCivic(c,c.civic.funding,{...c.civic.ordinances,carpool:true});recompute(c);assert.ok(auraBreakdown(c,home).factors.traffic>oldTraffic);assert.ok(home.aura>oldAura);assert.equal(c.stats.aura,preview.after.aura);
const saved=serializeCity(c),value=home.aura;for(let i=0;i<4;i++)recompute(c);assert.equal(serializeCity(c),saved);assert.equal(home.aura,value);assert.equal(validateSave(JSON.parse(saved)).tiles[idx(20,20)].aura,value);
const empty=createCity('Traffic isolation',false);for(const t of empty.tiles){t.terrain='land';t.type=null;t.traffic=0;t.highway=false;t.highwayTraffic=0;}
const h=empty.tiles[idx(20,20)],road=empty.tiles[idx(21,20)];Object.assign(h,{type:'residential',level:1,crime:0,airPollution:0,landValue:50});Object.assign(road,{type:'road',traffic:40});const near=localTrafficPenalty(empty,h);assert.ok(near>0);assert.ok(localTrafficPenalty(empty,empty.tiles[idx(19,20)])<near);assert.equal(localTrafficPenalty(empty,empty.tiles[idx(18,20)]),0);
const withoutRoad=auraBreakdown(empty,h);road.traffic=0;assert.equal(auraBreakdown(empty,h).value-withoutRoad.value,near,'traffic changes aura independently of air pollution');road.highway=true;road.highwayTraffic=160;assert.equal(localTrafficPenalty(empty,h),near,'highway capacity is normalized separately');road.highwayTraffic=1e8;assert.equal(localTrafficPenalty(empty,h),8);h.crime=100;empty.finance.taxes.residential=20;assert.equal(auraBreakdown(empty,h).value,0);assert.ok(auraBreakdown(empty,h).capAdjustment>0);
assert.match(auraReport(c,home),/Nearby road and highway traffic/);assert.match(auraReport(c,home),/Current aura/);assert.equal(auraReport(empty,road),'');h.level=0;assert.equal(auraBreakdown(empty,h),null);
console.log('PASS: exact aura factor totals, local traffic independent of pollution, distance/highway normalization/caps, actual carpool improvement and matching preview, save continuity and noncompounding recomputation.');
