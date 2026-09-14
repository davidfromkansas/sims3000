import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {createCity,build,tick,validateSave} from '../dist/engine.js';
import {attachCustomScenario} from '../dist/custom-scenarios.js';
import {serializeCity} from '../dist/save.js';
import {landmarkRoots} from '../dist/landmarks.js';

// An original feedback exercise, not a reconstruction of a shipped scenario.
const city=createCity('Three Asian landmarks',false);
for(const tile of city.tiles)Object.assign(tile,{terrain:'land',nature:false,elevation:0});
const sites=[['tokyoTower',10,16],['bankOfChinaTower',22,16],['namSanTower',34,16]];
for(let x=5;x<=42;x++)assert.ok(build(city,'road',[{x,y:21}]).ok);
attachCustomScenario(city,{title:'Three Asian landmarks',months:12,holdMonths:2,objectives:sites.map(([metric])=>({metric,target:1})),events:[]});
const initial=serializeCity(city);
assert.deepEqual(JSON.parse(serializeCity(validateSave(JSON.parse(initial)))),JSON.parse(initial));
writeFileSync(new URL('../art/architecture/asian-landmarks/review-challenge.city.json',import.meta.url),initial+'\n');
for(const [type,x,y] of sites)assert.ok(build(city,type,[{x,y}]).ok);
assert.equal(landmarkRoots(city).length,3);
tick(city);assert.equal(city.scenario.streak,1);assert.equal(city.scenario.status,'playing');
assert.ok(build(city,'bulldoze',[{x:12,y:18}]).ok);
tick(city);assert.equal(city.scenario.streak,0);assert.equal(city.scenario.status,'playing');
assert.ok(build(city,'tokyoTower',[{x:10,y:16}]).ok);
tick(city);assert.equal(city.scenario.streak,1);
const restored=validateSave(JSON.parse(serializeCity(city)));
tick(city);tick(restored);assert.equal(city.scenario.status,'won');
assert.deepEqual(JSON.parse(serializeCity(restored)),JSON.parse(serializeCity(city)));
console.log('PASS: importable three-landmark review challenge, two-month objective hold, far-corner demolition resets progress, rebuilding recovers, saved continuation wins identically.');
