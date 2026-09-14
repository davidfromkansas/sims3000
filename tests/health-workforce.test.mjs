import assert from 'node:assert/strict';
import {createCity,recompute,validateSave,build} from '../dist/engine.js';
import {advanceCivic} from '../dist/civic.js';
import {workforceShare,workforceOutlook} from '../dist/workforce.js';
import {populationBreakdown,breakdownCharts} from '../dist/report-breakdowns.js';
import {serializeCity} from '../dist/save.js';
const c=createCity(),pop=c.stats.population;const samples=[];
for(const life of [45,59,75,90]){c.civic.lifeExpectancy=life;recompute(c);const expected=pop*workforceShare(c),b=populationBreakdown(c);assert.ok(Math.abs(c.stats.commuters-expected)<1e-8);assert.ok(Math.abs(b.rows.reduce((n,r)=>n+r.people,0)-pop)<1e-8);assert.ok(c.stats.unemployed>=0&&c.stats.unemployed<=c.stats.commuters);assert.equal(c.stats.population,pop);samples.push(c.stats.commuters);}
assert.ok(samples.every((n,i)=>!i||n>samples[i-1]));assert.equal(samples[1],pop/2);
const s=validateSave(JSON.parse(serializeCity(c)));assert.ok(Math.abs(s.stats.commuters-c.stats.commuters)<1e-8);assert.equal(workforceOutlook(s).lifeExpectancy,90);assert.ok(breakdownCharts(s).includes('Longer lives expand the workforce'));
const before=s.stats.commuters;for(const t of s.tiles)if(t.type==='road')t.type=null;recompute(s);assert.ok(Math.abs(s.stats.commuters-before)<1e-8,'lost routes do not erase potential workers');assert.ok(Math.abs(s.stats.unemployed-s.stats.commuters)<1e-8,'workers without routes remain unemployed');
const healthy=createCity(),initial=healthy.stats.commuters;assert.ok(build(healthy,'hospital',[{x:23,y:25}]).ok);for(let i=0;i<240;i++){advanceCivic(healthy);recompute(healthy);}assert.ok(healthy.civic.lifeExpectancy>59);assert.ok(healthy.stats.commuters>initial,'connected hospital care expands the actual workforce over time');
console.log('PASS: life expectancy changes real workforce participation, preserves residents and employment totals, survives saves, exposes health contribution and respects disconnected job routes.');
