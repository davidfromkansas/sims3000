import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,tick,validateSave,VERSION} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {recordWaterService,waterServiceWarning} from '../dist/water-service.js';
const put=(c,type,x,y,xx=x,yy=y)=>assert.ok(build(c,type,selection(type,{x,y},{x:xx,y:yy},c.size)).ok,type);
const base=()=>{const c=createCity('Water continuity',false);c.funds=1000000;for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;}put(c,'coal',15,15);put(c,'road',19,21,24,21);put(c,'residential',20,20);put(c,'industrial',22,20);c.tiles[20*48+20].level=c.tiles[20*48+22].level=1;recompute(c);return c;};
const dry=base();for(let i=0;i<8;i++)tick(dry);assert.equal(dry.tiles[20*48+20].level,1,'new low-density homes can start dry');assert.equal(dry.tiles[20*48+20].waterEstablished,false);
const c=base(),home=c.tiles[20*48+20];put(c,'waterTower',20,19);put(c,'pipe',20,19);tick(c);assert.equal(home.waterEstablished,true);assert.equal(home.watered,true);put(c,'removePipe',20,19);assert.equal(home.watered,false);assert.match(waterServiceWarning(home),/interrupted/);
for(let i=0;i<3;i++)tick(c);assert.equal(home.level,1);assert.equal(home.stress,3);const saved=validateSave(JSON.parse(serializeCity(c)));tick(c);tick(saved);assert.equal(home.level,0);assert.equal(home.abandonedLevel,1);assert.equal(home.waterEstablished,true);assert.equal(serializeCity(c),serializeCity(saved));
for(let i=0;i<5;i++)tick(c);assert.equal(home.level,0,'a dry abandoned serviced building cannot immediately regrow');put(c,'pipe',20,19);for(let i=0;i<24&&home.level===0;i++)tick(c);assert.equal(home.level,1,'restoring supply permits reoccupation');assert.equal(home.abandonedLevel,0);assert.equal(waterServiceWarning(home),'');
// Repair before the failure threshold resets stress and preserves occupation.
put(c,'removePipe',20,19);tick(c);tick(c);assert.equal(home.stress,2);put(c,'pipe',20,19);tick(c);assert.equal(home.stress,0);assert.equal(home.level,1);
// Demolition clears the old building's service history.
put(c,'bulldoze',20,20);assert.equal(c.tiles[20*48+20].waterEstablished,false);
// Save versions 117/118 stay loadable; absent low-density history is not invented.
for(const version of [117,118]){const old=JSON.parse(serializeCity(dry));old.version=version;for(const t of old.tiles)delete t.waterEstablished;const restored=validateSave(old);assert.equal(restored.version,VERSION);assert.equal(restored.tiles[20*48+20].waterEstablished,false);old.tiles[20*48+20].density=3;old.tiles[20*48+20].level=2;assert.equal(validateSave(old).tiles[20*48+20].waterEstablished,true,'higher development necessarily relied on water');}
for(const value of [undefined,0,'yes',null]){const bad=JSON.parse(serializeCity(c));bad.tiles[0].waterEstablished=value;assert.throws(()=>validateSave(bad),/water-service history/);}
const vacant=base();put(vacant,'waterTower',24,20);put(vacant,'pipe',24,20);put(vacant,'residential',23,20);recordWaterService(vacant);assert.equal(vacant.tiles[20*48+23].waterEstablished,false,'watered empty zoning has no established building service');
console.log('PASS: dry low-density starts, established-service loss, four-month abandonment, timely repair, saved interruption, reoccupation, demolition reset and strict legacy migration.');
