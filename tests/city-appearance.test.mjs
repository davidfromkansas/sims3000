import assert from 'node:assert/strict';
import {createCity,validateSave,recompute,tick,VERSION} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {captureScenarioStart,decodeScenarioStart} from '../dist/scenario-replay.js';
import {freshAppearance,validateAppearance,applyAppearance,LANDSCAPE_STYLES,TREE_CHOICES,landscapeGround} from '../dist/city-appearance.js';
const c=createCity('Styled town'),before=JSON.parse(serializeCity(c)),baseline=validateSave(before);
assert.deepEqual(c.appearance,freshAppearance());
for(const landscape of Object.keys(LANDSCAPE_STYLES))for(const trees of Object.keys(TREE_CHOICES)){applyAppearance(c,{landscape,trees});const loaded=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(loaded.appearance,{landscape,trees});assert.deepEqual(loaded.stats,c.stats);}
applyAppearance(c,{landscape:'alpine',trees:'conifer'});recompute(c);const after=JSON.parse(serializeCity(c));delete before.appearance;delete after.appearance;assert.deepEqual(after,before,'only saved appearance changes');
const replay=decodeScenarioStart(captureScenarioStart(c),c.month);assert.deepEqual(replay.appearance,c.appearance);
tick(c);tick(baseline);assert.deepEqual(c.stats,baseline.stats);assert.deepEqual(c.tiles,baseline.tiles,'appearance does not change growth, pollution or tree cover');
const saved=serializeCity(c);for(const value of [null,[],{},'palm',{landscape:'snow',trees:'conifer'},{landscape:'lush',trees:'unknown'}]){assert.throws(()=>applyAppearance(c,value));assert.equal(serializeCity(c),saved);const malformed=JSON.parse(saved);malformed.appearance=value;assert.throws(()=>validateSave(malformed));}
const old=JSON.parse(saved);old.version=111;delete old.appearance;assert.deepEqual(validateSave(old).appearance,freshAppearance());assert.equal(validateSave(old).version,VERSION);
assert.equal(new Set(Object.keys(LANDSCAPE_STYLES).map(s=>landscapeGround({x:4,y:6},s))).size,4);
// The real worker message handler retains the selected appearance on a larger map.
const large=createCity('Large styled city',false,96);applyAppearance(large,{landscape:'arid',trees:'palm'});const direct=structuredClone(large);tick(direct);let message;globalThis.self={postMessage:v=>message=v};await import('../dist/simulation-worker.js');self.onmessage({data:{id:9,city:structuredClone(large)}});assert.equal(message.id,9);assert.equal(message.error,undefined);assert.deepEqual(message.city.appearance,large.appearance);assert.equal(serializeCity(message.city),serializeCity(direct));
console.log('PASS: all landscape/tree choices persist, preserve simulation and replay, migrate schema111, reject malformed current saves atomically and survive actual large-map worker continuation.');
