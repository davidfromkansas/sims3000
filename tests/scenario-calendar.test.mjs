import assert from 'node:assert/strict';
import {createCity,tick,validateSave,VERSION} from '../dist/engine.js';
import {attachCustomScenario,validateCustomDefinition,customCurrentGoals} from '../dist/custom-scenarios.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
import {calendarMonthIndex,dateInputValue,parseDateInput,formatScenarioMetric,initializeMetricTarget,readMetricTarget} from '../dist/scenario-calendar.js';
import {eventConditionMet,eventConditionLabel,validateEventCondition} from '../dist/scenario-events.js';
import {expandScenarioText} from '../dist/scenario-text.js';
import {serializeCity} from '../dist/save.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
const date=month=>parseDateInput(month),roundtrip=c=>validateSave(JSON.parse(serializeCity(c)));
for(const startYear of [1900,1950,2000,2050]){const c=createCity();c.startYear=startYear;for(const month of [0,1,11,12,120000]){c.month=month;assert.equal(calendarMonthIndex(c),startYear*12+month);assert.equal(CUSTOM_METRICS.year.read(c),startYear+Math.floor(month/12));assert.equal(CUSTOM_METRICS.monthOfYear.read(c),month%12);assert.equal(parseDateInput(dateInputValue(calendarMonthIndex(c))),calendarMonthIndex(c));}}
for(const invalid of ['',null,'1950-1','1950-00','1950-13','1950-01-01','0000-01',' 1950-01','1950-01x'])assert.ok(Number.isNaN(parseDateInput(invalid)));
assert.equal(formatScenarioMetric(CUSTOM_METRICS.date,date('1951-01')),'Jan 1951');assert.equal(formatScenarioMetric(CUSTOM_METRICS.year,1951),'1951');assert.equal(readMetricTarget(CUSTOM_METRICS.funds,'-40'),-40);
const c=createCity();c.month=10;attachCustomScenario(c,{title:'The new year',months:24,objectives:[{metric:'date',target:date('1951-01')}],events:[{type:'variable',month:1,variable:0,operation:'copy',metric:'date'},{type:'announcement',month:2,message:'Now {date}, {monthOfYear}, {year}.',condition:{match:'all',conditions:[{metric:'date',operator:'gte',target:date('1951-01')},{metric:'monthOfYear',operator:'eq',target:0}]}}]});
assert.match(customCurrentGoals(c).at(-1).title,/Jan 1951/);assert.match(customCurrentGoals(c).at(-1).detail,/Nov 1950/);
tick(c);assert.equal(c.scenario.variables[0],date('1950-12'));assert.equal(c.scenario.status,'playing');const loaded=roundtrip(c);tick(c);tick(loaded);assert.equal(c.scenario.status,'won');assert.equal(c.scenario.events[1].message,'Now Jan 1951, January, 1951.');assert.deepEqual(loaded.scenario,c.scenario);
const replay=restartCustomScenario(roundtrip(c));assert.equal(replay.month,10);assert.equal(replay.scenario.status,'playing');tick(replay);tick(replay);assert.equal(replay.scenario.events[1].message,c.scenario.events[1].message);
const base={metric:'date',target:date('1951-01')};for(const [operator,expected] of [['gte',true],['lte',true],['gt',false],['lt',false],['eq',true],['ne',false]])assert.equal(eventConditionMet(c,{...base,operator}),expected);
assert.match(eventConditionLabel({...base,operator:'lt'}),/Jan 1951/);assert.match(eventConditionLabel({metric:'crime',operator:'eq',target:12.25}),/12.25/);assert.equal(expandScenarioText('{date} / {monthOfYear}',c),'Jan 1951 / January');
const input={};initializeMetricTarget(input,CUSTOM_METRICS.date,c);assert.equal(input.value,'1952-01');assert.equal(input.min,'1900-01');assert.equal(input.max,'12050-01');assert.equal(input.step,'1');initializeMetricTarget(input,CUSTOM_METRICS.year,c);assert.equal(input.value,1952);
for(const [metric,target] of [['date',date('1899-12')],['date',date('12050-02')],['date',date('1950-01')+.5],['year',1950.5],['monthOfYear',12],['monthOfYear',-.1]]){assert.throws(()=>validateCustomDefinition({title:'Invalid date',months:12,objectives:[{metric,target}]}));assert.throws(()=>validateEventCondition({metric,target,operator:'eq'}));}
const old=JSON.parse(serializeCity(createCity()));old.version=105;assert.equal(validateSave(old).version,VERSION);
console.log('PASS: all starting-year and year-boundary queries, date formatting/parsing, real dated objective/event/variable playthrough, saved continuation/replay, six comparisons, friendly text, contextual defaults and malformed date rejection.');
