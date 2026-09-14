import assert from 'node:assert/strict';
import {createCity,build,recompute,validateSave} from '../dist/engine.js';
import {advanceEducation,advanceEducationCohorts,educationWeights,initialAgeEducation} from '../dist/education.js';
import {serializeCity} from '../dist/save.js';
import {advanceDemographics} from '../dist/demographics.js';
function month(c){c.month++;advanceEducation(c);advanceEducationCohorts(c,advanceDemographics(c));}
const c=createCity();assert.ok(build(c,'library',[{x:23,y:25}]).ok);assert.equal(c.stats.schoolCoverage,0);assert.ok(c.stats.adultEducationCoverage>0);
const maintained=structuredClone(c),unsupported=structuredClone(c);for(const x of [maintained,unsupported]){x.civic.youthEducation=30;x.civic.adultEducation=80;x.civic.ageEducation=initialAgeEducation(30,80);}
unsupported.stats.adultEducationCoverage=0;unsupported.stats.libraryEducationCoverage=0;unsupported.stats.museumEducationCoverage=0;for(let i=0;i<120;i++){month(maintained);month(unsupported);}assert.ok(maintained.civic.adultEducation>unsupported.civic.adultEducation);assert.ok(Math.abs(maintained.civic.youthEducation-30)<1e-9,'library does not teach youth');assert.ok(maintained.civic.adultEducation<80,'less educated graduates can still reduce adult average');
assert.ok(build(c,'school',[{x:27,y:21}]).ok);assert.ok(c.stats.schoolCoverage>0);const before=c.civic.youthEducation;for(let i=0;i<36;i++)month(c);assert.ok(c.civic.youthEducation>before);assert.ok(Math.abs(c.civic.education-(c.civic.youthEducation*educationWeights(c).youth+c.civic.adultEducation*educationWeights(c).adult))<1e-9);
c.civic.funding.education=0;recompute(c);assert.equal(c.stats.schoolCoverage,0);assert.equal(c.stats.adultEducationCoverage,0);
const data=JSON.parse(serializeCity(c));assert.deepEqual(validateSave(data).civic,c.civic);data.version=29;delete data.civic.youthEducation;delete data.civic.adultEducation;const old=validateSave(data);assert.equal(old.civic.youthEducation,data.civic.education);assert.equal(old.civic.adultEducation,data.civic.education);
data.version=30;assert.throws(()=>validateSave(data),/civic/);const empty=createCity('Empty',false),snapshot=JSON.stringify(empty.civic);advanceEducation(empty);assert.equal(JSON.stringify(empty.civic),snapshot);
console.log('PASS: separate teaching and adult retention, graduate effects, funding, weighted education, cohort saves and legacy migration.');
