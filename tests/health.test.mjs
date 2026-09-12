import assert from 'node:assert/strict';
import {createCity,idx,recompute,validateSave} from '../dist/engine.js';
import {advanceCivic} from '../dist/civic.js';
import {healthOutlook,healthReport} from '../dist/health.js';
import {serializeCity} from '../dist/save.js';
const c=createCity('Health',false);for(const t of c.tiles){t.type=null;t.nature=false;t.terrain='land';}
const a=c.tiles[idx(20,20)],b=c.tiles[idx(30,30)];Object.assign(a,{type:'residential',level:1});Object.assign(b,{type:'residential',level:3,density:3});recompute(c);
Object.assign(a,{airPollution:0,waterPollution:0,healthCoverage:0});Object.assign(b,{airPollution:40,waterPollution:80,healthCoverage:0});
const h=healthOutlook(c);assert.ok(h.airExposure>20);assert.equal(h.waterExposure,h.airExposure*2);assert.ok(h.target<59);const before=c.civic.lifeExpectancy;advanceCivic(c);assert.ok(c.civic.lifeExpectancy<before);
b.waterPollution=0;assert.ok(healthOutlook(c).target>h.target);b.healthCoverage=100;assert.ok(healthOutlook(c).hospitalBenefit>0);
const target=healthOutlook(c).target;c.tiles[idx(0,0)].waterPollution=100;assert.equal(healthOutlook(c).target,target);
a.healthCoverage=100;b.airPollution=0;assert.equal(healthOutlook(c).target,90);a.airPollution=a.waterPollution=b.airPollution=b.waterPollution=100;a.healthCoverage=b.healthCoverage=0;assert.equal(healthOutlook(c).target,45);
assert.match(healthReport(c),/Water pollution near homes/);recompute(c);const saved=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(healthOutlook(saved),healthOutlook(c));
a.level=b.level=0;recompute(c);assert.equal(healthOutlook(c).population,0);assert.match(healthReport(c),/No residents/);const empty=c.civic.lifeExpectancy;advanceCivic(c);assert.equal(c.civic.lifeExpectancy,empty);
console.log('PASS: resident-weighted air and water health effects, gradual change, hospital benefits, bounds, empty cities and save reconstruction.');
