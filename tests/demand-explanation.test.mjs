import assert from 'node:assert/strict';
import {createCity,recompute,validateSave,tick} from '../dist/engine.js';
import {createScenario} from '../dist/scenario-setup.js';
import {serializeCity} from '../dist/save.js';
import {demandReport} from '../dist/demand-report.js';
const reconcile=c=>{for(const sector of ['residential','commercial','industrial']){const rows=c.stats.demandBreakdown[sector];assert.ok(rows.length>=5);const sum=rows.reduce((n,r)=>n+r.amount,0);assert.ok(Math.abs(sum-c.stats.demand[sector])<1e-8,sector+' ledger reconciles with actual demand');assert.ok(rows.every(r=>Number.isFinite(r.amount)));}};
for(const c of [createCity('Demand ledger'),createCity('Empty',false),createScenario('roomToGrow')]){
 reconcile(c);const before=serializeCity(c),html=demandReport(c);assert.match(html,/Why demand rises or falls/);assert.match(html,/Current demand/);assert.match(html,/local demand/);assert.equal(serializeCity(c),before,'report is read-only');
 const loaded=validateSave(JSON.parse(before));assert.deepEqual(loaded.stats.demandBreakdown,c.stats.demandBreakdown);tick(c);tick(loaded);reconcile(c);assert.deepEqual(c.stats.demand,loaded.stats.demand);assert.deepEqual(c.stats.demandBreakdown,loaded.stats.demandBreakdown);
}
const c=createCity('Tax choice',false);c.finance.taxes.residential=8;recompute(c);assert.equal(c.stats.demandBreakdown.residential.find(r=>r.label==='Tax rate').amount,-8);assert.equal(c.stats.demand.residential,32);c.finance.taxes.residential=20;recompute(c);reconcile(c);
const cap=createScenario('roomToGrow');assert.equal(cap.stats.demand.residential,0);assert.ok(cap.stats.demandBreakdown.residential.some(r=>r.label==='Residential capacity limit'&&r.amount<0));reconcile(cap);
console.log('PASS: demand explanations reconcile every sector with actual simulation values, expose taxes and capacity limits, remain read-only and survive deterministic saved continuation.');
