import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,tick,validateSave,idx} from '../dist/engine.js';
import {freshDemographics} from '../dist/demographics.js';
import {serializeCity} from '../dist/save.js';
import {reportSnapshot,metricSeries,cleanHistory} from '../dist/reports.js';
const line=(c,tool,a,b)=>assert.ok(build(c,tool,selection(tool,a,b)).ok);
for(const sector of ['commercial','industrial'])for(const mode of ['road','rail','subway']){
 const c=createCity('Employment',false);c.funds=100000;for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;}
 Object.assign(c.tiles[idx(12,18)],{type:'residential',level:3,density:3});Object.assign(c.tiles[idx(36,18)],{type:sector,level:3,density:3});c.demographics=freshDemographics(64,0);recompute(c);
 assert.equal(c.stats[sector+'Employed'],0);assert.equal(reportSnapshot(c).unemploymentRate,100);
 line(c,mode,{x:12,y:20},{x:36,y:20});if(mode!=='road')for(const x of [12,36])assert.ok(build(c,mode==='rail'?'trainStation':'subwayStation',[{x,y:19}]).ok);
 assert.equal(c.stats[sector+'Employed'],32);assert.equal(c.stats[sector==='commercial'?'industrialEmployed':'commercialEmployed'],0);assert.equal(reportSnapshot(c).unemploymentRate,0);assert.ok(c.stats[sector+'Jobs']>32,'capacity is not employment');
 const restored=validateSave(JSON.parse(serializeCity(c)));assert.equal(restored.stats[sector+'Employed'],32);
 assert.ok(build(c,mode==='road'?'bulldoze':mode==='rail'?'removeRail':'removeSubway',[{x:24,y:20}]).ok);assert.equal(c.stats[sector+'Employed'],0);assert.equal(reportSnapshot(c).unemploymentRate,100);
 assert.ok(build(c,mode,[{x:24,y:20}]).ok);assert.equal(c.stats[sector+'Employed'],32);
 tick(c);const h=c.history.at(-1);assert.equal(h.commercialEmployed,c.stats.commercialEmployed);assert.equal(h.industrialEmployed,c.stats.industrialEmployed);assert.equal(h.unemploymentRate,reportSnapshot(c).unemploymentRate);
 const loaded=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(loaded.history,c.history);tick(c);tick(loaded);assert.deepEqual(loaded.history,c.history);
}
const empty=createCity('Empty',false);assert.equal(reportSnapshot(empty).unemploymentRate,0);
const rows=cleanHistory([{month:1,population:10,funds:0},{month:2,population:10,funds:0,commercialEmployed:3,industrialEmployed:2,unemploymentRate:50}],2);for(const metric of ['commercialEmployed','industrialEmployed','unemploymentRate'])assert.equal(metricSeries(rows,metric).values.length,1,'old history is not invented');
console.log('PASS: commerce and industry employment through road, rail and subway, route loss/repair, capacity distinction, workforce unemployment, empty city, monthly histories and save continuation.');
