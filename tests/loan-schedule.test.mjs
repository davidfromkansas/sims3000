import assert from 'node:assert/strict';
import {createCity,borrow,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {loanRepaymentSchedule,loanScheduleReport} from '../dist/loan-schedule.js';
let c=createCity('Loan calendar',false);borrow(c,5000);for(let i=0;i<3;i++)tick(c);borrow(c,15000);for(let i=0;i<6;i++)tick(c);borrow(c,25000);const saved=serializeCity(c),rows=loanRepaymentSchedule(c,10000);assert.equal(serializeCity(c),saved);assert.equal(rows.reduce((s,r)=>s+r.existing,0),67500);assert.equal(rows.reduce((s,r)=>s+r.proposed,0),15000);assert.equal(rows.find(r=>r.month===21).total,5250);assert.equal(rows.at(-1).month,129);assert.ok(rows.every((r,i)=>!i||r.month>rows[i-1].month));
// Every projected obligation agrees with actual staggered loan settlement,
// including a save/load midway through the remaining contracts.
borrow(c,10000);const actual=[];for(let i=0;i<120;i++){tick(c);if(c.finance.lastLoanPayment)actual.push({month:c.month,total:c.finance.lastLoanPayment});if(i===56)c=validateSave(JSON.parse(serializeCity(c)));}assert.deepEqual(actual,rows.map(({month,total})=>({month,total})));assert.equal(c.finance.loans.length,0);assert.equal(c.finance.totalLoanPaid,82500);
const full=createCity('Loan limit',false);for(let i=0;i<10;i++)borrow(full,5000);assert.match(loanScheduleReport(full,25000),/no new loan is included/);assert.doesNotMatch(loanScheduleReport(full,25000),/adds §37,500/);assert.match(loanScheduleReport(createCity('Empty',false),0),/No repayments/);assert.throws(()=>loanRepaymentSchedule(full,7500));assert.throws(()=>loanRepaymentSchedule(full,30000));assert.match(loanScheduleReport(full),/not a treasury forecast/);
console.log('PASS: staggered ten-year repayment calendar, actual monthly settlement agreement, mid-contract save/load, total principal/interest, capacity-limited preview and read-only planning.');
