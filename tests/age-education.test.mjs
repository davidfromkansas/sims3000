import assert from 'node:assert/strict';
import {createCity,validateSave} from '../dist/engine.js';
import {advanceEducation,advanceEducationCohorts,initialAgeEducation,educationReport} from '../dist/education.js';
import {serializeCity} from '../dist/save.js';
import {advanceDemographics} from '../dist/demographics.js';
function month(c){c.month++;advanceEducation(c);advanceEducationCohorts(c,advanceDemographics(c));}
const c=createCity();c.civic.ageEducation=initialAgeEducation(30,30);c.civic.youthEducation=30;c.civic.adultEducation=30;c.civic.education=30;c.stats.schoolCoverage=100;c.stats.adultEducationCoverage=100;
for(let m=0;m<120;m++)month(c);
const eq=c.civic.ageEducation;assert.ok(eq[1]>eq[2]&&eq[2]>eq[3]&&eq[3]>eq[7],'education improvements pass through successive ages instead of changing all adults at once');
const saved=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(saved.civic.ageEducation,eq);saved.stats.schoolCoverage=100;saved.stats.adultEducationCoverage=100;
for(let m=0;m<120;m++){month(c);month(saved);}assert.deepEqual(saved.civic.ageEducation,c.civic.ageEducation,'save continuation retains cohort history');
const supported=structuredClone(c),unsupported=structuredClone(c);unsupported.stats.adultEducationCoverage=0;
for(let m=0;m<240;m++){month(supported);month(unsupported);}assert.ok(supported.civic.ageEducation[7]>unsupported.civic.ageEducation[7]);
const before=c.civic.ageEducation[1];c.stats.schoolCoverage=0;for(let m=0;m<120;m++)month(c);assert.ok(c.civic.ageEducation[1]<before);assert.ok(c.civic.ageEducation[2]>c.civic.ageEducation[1],'previously educated adults retain the effects of earlier schooling');
assert.equal((educationReport(c).match(/<meter /g)||[]).length,8);
const legacy=JSON.parse(serializeCity(c));legacy.version=61;delete legacy.civic.ageEducation;assert.deepEqual(validateSave(legacy).civic.ageEducation,initialAgeEducation(legacy.civic.youthEducation,legacy.civic.adultEducation));
for(const invalid of [null,[],Array(8).fill(101),Array(8).fill(-1),Array(8).fill('40')]){const bad=JSON.parse(serializeCity(c));bad.civic.ageEducation=invalid;assert.throws(()=>validateSave(bad));}
console.log('PASS: age-specific education, gradual graduation into adult bands, adult retention, lasting school history, exact saved continuation, eight-band report and legacy migration.');
