import assert from 'node:assert/strict';
import {createCity,build,selection,idx,recompute,tick,validateSave} from '../dist/engine.js';
import {powerMonth,annualPower} from '../dist/power-accounting.js';
import {serializeCity} from '../dist/save.js';
import {connectionCandidates,addConnection,signDeal,cancelDeal} from '../dist/region.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
function base(){const c=createCity('Electricity',false);c.startYear=2050;c.funds=1000000;for(const t of c.tiles){t.terrain='land';t.nature=false;}return c;}
const c=base();build(c,'coal',[{x:10,y:10}]);build(c,'wind',[{x:35,y:35}]);build(c,'residential',[{x:34,y:35}]);recompute(c);
assert.equal(c.stats.powerGenerationByType.coal||0,0,'unused disconnected plant does not generate delivered output');assert.equal(c.stats.powerGenerationByType.wind,1);assert.equal(c.stats.powerGenerated,1);assert.ok(c.stats.powerGenerated<c.stats.powerCapacity);
c.civic.ordinances.powerConservation=true;recompute(c);near(c.stats.powerGenerated,.9);
assert.equal(annualPower(c),null);for(let i=0;i<12;i++)tick(c);let year=annualPower(c);assert.equal(year.months,12);near(year.total,10.8);near(year.total+year.imported,year.served+year.exported);near(year.sources.reduce((n,s)=>n+s.amount,0),year.total);
const saved=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(annualPower(saved),year);saved.history=saved.history.slice(-3);assert.equal(annualPower(saved).months,3);saved.history[0].powerGenerated=undefined;assert.equal(annualPower(saved).months,2,'incomplete legacy records are not treated as zero');
const trade=base();build(trade,'powerline',selection('powerline',{x:42,y:20},{x:47,y:20}));build(trade,'residential',[{x:40,y:20}]);build(trade,'residential',[{x:20,y:20}]);assert.ok(addConnection(trade,connectionCandidates(trade).find(p=>p.kind==='power')).ok);assert.ok(signDeal(trade,0,'power','import',50).ok);recompute(trade);let flow=powerMonth(trade);near(flow.powerGenerated,0);near(flow.powerImported,1);near(flow.powerServed,1);assert.equal(trade.tiles[idx(20,20)].powered,false);
cancelDeal(trade,trade.region.deals[0].id);build(trade,'coal',[{x:35,y:18}]);signDeal(trade,0,'power','export',50);recompute(trade);flow=powerMonth(trade);near(flow.powerExported,50);near(flow.powerGenerated,51);near(flow.powerGenerated+flow.powerImported,flow.powerServed+flow.powerExported);near(flow.powerGeneratedCoal,flow.powerGenerated);
const burner=base();build(burner,'wasteEnergy',[{x:20,y:20}]);build(burner,'residential',[{x:21,y:20}]);burner.tiles[idx(20,20)].burnedLastMonth=20;recompute(burner);near(burner.stats.powerGenerationByType.wasteEnergy,1);burner.tiles[idx(20,20)].burnedLastMonth=0;recompute(burner);near(burner.stats.powerGenerated,0);
const mix=base();build(mix,'coal',[{x:20,y:20}]);build(mix,'wind',[{x:25,y:20}]);build(mix,'residential',[{x:25,y:21}]);recompute(mix);near(mix.stats.powerGenerationByType.coal,500/525);near(mix.stats.powerGenerationByType.wind,25/525);
console.log('PASS: delivered electricity versus capacity, isolated grids, conservation, annual/partial totals, source shares, import/export balance, fuel-backed waste energy and saved histories.');
