import assert from 'node:assert/strict';
import {createCity,build,planBuild,selection} from '../dist/engine.js';
import {TECHNOLOGY,available,newlyAvailable} from '../dist/technology.js';
import {serializeCity} from '../dist/save.js';
const c=createCity('Early town',false);c.startYear=1900;for(const t of c.tiles){t.terrain='land';t.nature=false;}c.funds=100000;c.tiles[19*48+19].type='road';c.tiles[19*48+19].highway=true;
for(const [tool,{year}] of Object.entries(TECHNOLOGY)){if(year<=1900)continue;c.month=(year-1900)*12-1;assert.equal(available(c,tool),false);const before=serializeCity(c);assert.equal(build(c,tool,[{x:20,y:20}]).ok,false,tool+' locked in December');assert.equal(serializeCity(c),before,'failed construction is atomic');c.month++;assert.equal(available(c,tool),true);assert.ok(newlyAvailable(c).includes(tool));assert.ok(planBuild(c,tool,[{x:20,y:20}]).ok,tool+' unlocks in January');c.month++;assert.equal(newlyAvailable(c).length,0);}
c.month=0;for(let x=20;x<=27;x++)c.tiles[20*48+x].elevation=Math.min(x-19,28-x,3);assert.equal(planBuild(c,'highway',selection('highway',{x:19,y:20},{x:28,y:20})).ok,false,'tunnel proposal cannot bypass date');assert.equal(available(c,'removeSubway'),true,'removal of legacy infrastructure stays available');assert.equal(available(c,'rail'),true);assert.equal(available(c,'road'),true);
console.log('PASS: technology construction gates, December/January boundaries, atomic rejection, unlock notices, highway tunnel bypass prevention and legacy removal.');
