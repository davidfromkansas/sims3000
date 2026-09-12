import assert from 'node:assert/strict';
import {createCity,idx,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {startUfo} from '../dist/ufo.js';
import {stepFire,soundSiren,dispatchFire} from '../dist/emergency.js';
import {attachCustomScenario} from '../dist/custom-scenarios.js';
import {runScenarioEvents} from '../dist/scenario-events.js';
function fixture(){const c=createCity('Attack',false);for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});for(let y=16;y<27;y++)for(let x=16;x<27;x++)Object.assign(c.tiles[idx(x,y)],{type:'residential',level:1,pipe:true,subway:true});recompute(c);return c;}
const c=fixture();assert.equal(startUfo(c,-1,20).ok,false);assert.ok(startUfo(c,20,20).ok);assert.equal(startUfo(c,20,20).ok,false);assert.ok(soundSiren(c).ok);assert.equal(c.emergency.shelter,.6);assert.equal(soundSiren(c).ok,false);assert.ok(dispatchFire(c,20,20).ok);for(let i=0;i<8;i++)stepFire(c);assert.equal(c.emergency.destroyed,0);assert.equal(soundSiren(c).ok,false);const saved=validateSave(JSON.parse(serializeCity(c)));for(let i=0;i<24;i++){stepFire(c);stepFire(saved);}recompute(c);recompute(saved);assert.equal(serializeCity(c),serializeCity(saved));assert.equal(c.emergency.ufo,null);assert.equal(c.emergency.active,false);assert.equal(c.emergency.ufoStrikes,6);assert.equal(c.emergency.shelter,0);assert.equal(c.month,0);assert.ok(c.emergency.destroyed>0);assert.ok(c.tiles[idx(20,20)].pipe&&c.tiles[idx(20,20)].subway);
const naked=fixture();startUfo(naked,20,20);for(let i=0;i<32;i++)stepFire(naked);assert.ok(naked.emergency.destroyed>c.emergency.destroyed,'trusted early warning reduces damage');
const distrust=fixture();for(let i=0;i<5;i++)soundSiren(distrust);startUfo(distrust,20,20);soundSiren(distrust);assert.equal(distrust.emergency.shelter,0);
const old=JSON.parse(serializeCity(createCity()));old.version=51;delete old.emergency.ufo;delete old.emergency.ufoAttacks;delete old.emergency.ufoStrikes;assert.equal(validateSave(old).emergency.ufo,null);
const bad=JSON.parse(serializeCity(fixture()));bad.emergency.active=true;bad.emergency.ufoAttacks=1;bad.emergency.ufo={x:20,y:20,age:1,warningSteps:8};assert.throws(()=>validateSave(bad));
const scenario=fixture();attachCustomScenario(scenario,{title:'Visitors',months:12,objectives:[{metric:'population',target:400}],events:[{type:'ufo',month:1,x:20,y:20}]});scenario.month=1;assert.equal(runScenarioEvents(scenario).status,'triggered');assert.equal(scenario.emergency.ufo.warningSteps,8);
console.log('PASS: alien warning, siren trust and shelter, six strikes, buried utility preservation, deterministic save continuation, expiry, migration and scenario attacks.');
