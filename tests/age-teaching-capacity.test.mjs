import {civicMembers} from '../dist/civic-footprints.js';
import assert from 'node:assert/strict';
import {createCity,build,recompute,validateSave,tick} from '../dist/engine.js';
import {advanceEducation,educationReport,educationServiceDemand} from '../dist/education.js';
import {civicFacilityDetails,civicFacilityReport} from '../dist/civic-service-report.js';
import {civicAdvice} from '../dist/civic-ui.js';
import {serializeCity} from '../dist/save.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const c=createCity('Separate teaching');c.funds=100000;
const p=c.stats.population;c.demographics.cohorts=[p/2,p/2,0,0,0,0,0,0];recompute(c);
assert.ok(build(c,'school',[{x:23,y:25}]).ok);
assert.equal(c.stats.childEducationCoverage,100);assert.equal(c.stats.collegeEducationCoverage,0);near(c.stats.schoolCoverage,50);
const school=c.tiles[25*48+23],d=civicFacilityDetails(c,school);near(d.demand,p/2);assert.equal(d.capacity,3000);assert.equal(d.combinedCoverage,100);assert.match(d.group,/0–14/);
const before=[...c.civic.ageEducation];advanceEducation(c);assert.ok(c.civic.ageEducation[0]>before[0]);assert.ok(c.civic.ageEducation[1]<before[1],'school capacity cannot teach the college band');
assert.ok(build(c,'school',[{x:27,y:21}]).ok);assert.equal(c.stats.collegeEducationCoverage,0,'more schools cannot replace college places');
assert.ok(build(c,'college',[{x:21,y:14}]).ok);const college=c.tiles[14*48+21];assert.equal(c.stats.collegeEducationCoverage,100);near(c.stats.schoolCoverage,100);assert.equal(civicFacilityDetails(c,college).capacity,7500);assert.match(civicFacilityReport(c,college),/15–24/);
c.civic.funding.education=1;recompute(c);near(c.stats.childEducationCoverage,60/(p/2)*100);near(c.stats.collegeEducationCoverage,75/(p/2)*100);near(civicFacilityDetails(c,college).combinedCoverage,c.stats.collegeEducationCoverage);
const expected=(c.stats.childEducationCoverage+c.stats.collegeEducationCoverage)/2;near(c.stats.schoolCoverage,expected);near(c.stats.educationCoverage,expected);
// A road-disconnected college contributes no places despite being powered.
for(const t of civicMembers(c,college)){t.roadIds=[];t.serviceActive=false;}
assert.equal(civicFacilityDetails(c,college).capacity,0);assert.equal(civicFacilityDetails(c,college).residents,0);
c.civic.underfunded.education=6;recompute(c);assert.equal(c.stats.childEducationCoverage,0);assert.equal(c.stats.collegeEducationCoverage,0);
c.civic.underfunded.education=0;c.civic.funding.education=10;recompute(c);
// Removing schools leaves the college cohort supported but children unsupported.
assert.ok(build(c,'bulldoze',[{x:23,y:25}]).ok);assert.ok(build(c,'bulldoze',[{x:27,y:21}]).ok);assert.equal(c.stats.childEducationCoverage,0);assert.equal(c.stats.collegeEducationCoverage,100);
const eq=[...c.civic.ageEducation];advanceEducation(c);assert.ok(c.civic.ageEducation[0]<eq[0]);assert.ok(c.civic.ageEducation[1]>eq[1]);
assert.match(educationReport(c),/School access \(ages 0–14\): 0.0%/);assert.match(educationReport(c),/college access \(ages 15–24\): 100.0%/);
const disconnected=structuredClone(c);Object.assign(disconnected.tiles[42*48+42],{type:'residential',level:1});recompute(disconnected);assert.equal(disconnected.tiles[42*48+42].collegeEducationCoverage,0);assert.ok(disconnected.stats.collegeEducationCoverage<100,'isolated homes do not receive a connected college’s places');
const saved=serializeCity(c),restored=validateSave(JSON.parse(saved));assert.deepEqual(restored.civic.ageEducation,c.civic.ageEducation);assert.equal(restored.stats.collegeEducationCoverage,100);assert.equal(restored.stats.childEducationCoverage,0);
tick(c);tick(restored);assert.deepEqual(restored.civic,c.civic);assert.deepEqual(restored.stats,c.stats,'real monthly save continuation');
const adults=createCity();adults.demographics.cohorts=[0,0,adults.stats.population,0,0,0,0,0];recompute(adults);assert.equal(educationServiceDemand(adults,'school').share,0);assert.equal(educationServiceDemand(adults,'college').share,0);adults.stats.healthCoverage=100;assert.doesNotMatch(civicAdvice(adults),/Children lack|Young adults lack/,'empty age groups do not request teaching places');
console.log('PASS: separate school and college demand, independent age learning, funding and strikes, actual coverage reports, empty groups and saved monthly continuation.');
