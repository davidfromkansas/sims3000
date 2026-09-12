import assert from 'node:assert/strict';
import {createCity,tick,validateSave,build} from '../dist/engine.js';
import {advanceDemographics} from '../dist/demographics.js';
import {advanceEducationCohorts} from '../dist/education.js';
import {serializeCity} from '../dist/save.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const c=createCity();c.civic.ageEducation=[10,90,5,5,5,5,5,5];c.demographics={month:0,cohorts:[0,120,0,0,0,0,0,0],flows:null};c.month=1;c.stats.lifeExpectancy=59;c.stats.population=120*(1-.0005/12);
const movement=advanceDemographics(c);advanceEducationCohorts(c,movement);
close(c.civic.ageEducation[2],90);close(c.demographics.cohorts[2],c.stats.population/120);
close(c.civic.education,90);const once=[...c.civic.ageEducation];advanceEducationCohorts(c,advanceDemographics(c));assert.deepEqual(c.civic.ageEducation,once,'a repeated monthly census supplies no second intake');
function transfer(population){const city=createCity();city.month=1;city.demographics={month:0,cohorts:[80,300,100,200,100,100,80,40],flows:null};city.civic.ageEducation=[20,90,40,70,50,20,60,80];city.stats.population=population;city.stats.lifeExpectancy=59;const before=[...city.civic.ageEducation],m=advanceDemographics(city);advanceEducationCohorts(city,m);const totalBefore=m.survivors.reduce((n,people,i)=>n+people*before[i],0)+m.births*30+m.arrivals.reduce((n,people,i)=>n+people*(i<2?30:40),0),departureFactor=population/(m.aged.reduce((a,b)=>a+b,0)+m.arrivals.reduce((a,b)=>a+b,0));close(city.demographics.cohorts.reduce((n,people,i)=>n+people*city.civic.ageEducation[i],0),totalBefore*departureFactor);return city;}
assert.ok(transfer(1300).demographics.flows.arrivals>0);assert.ok(transfer(500).demographics.flows.departures>0);assert.ok(transfer(1000).demographics.flows.births>0);
const empty=createCity();empty.month=1;empty.demographics={month:0,cohorts:Array(8).fill(0),flows:null};empty.civic.ageEducation=Array(8).fill(99);empty.stats.population=100;advanceEducationCohorts(empty,advanceDemographics(empty));assert.deepEqual(empty.civic.ageEducation,[30,30,40,40,40,40,40,40],'new arrivals do not inherit knowledge from an empty band');
const live=createCity();build(live,'school',[{x:21,y:22}]);for(let i=0;i<24;i++)tick(live);const restored=validateSave(JSON.parse(serializeCity(live)));for(let i=0;i<24;i++){tick(live);tick(restored);}assert.deepEqual(restored.demographics,live.demographics);assert.deepEqual(restored.civic,live.civic);
const legacy=JSON.parse(serializeCity(live));legacy.version=75;assert.deepEqual(validateSave(legacy).civic.ageEducation,live.civic.ageEducation,'migration preserves existing knowledge before subsequent movement');
console.log('PASS: actual graduating counts carry knowledge, empty-band intake, census idempotence, knowledge conservation through births/deaths/migration, normal monthly save continuation and schema migration.');
