import assert from 'node:assert/strict';
import {createCity,recompute,validateSave} from '../dist/engine.js';
import {baseZonedSprite,zonedSprite,replaceBuildingStyle} from '../dist/building-art.js';
import {serializeCity} from '../dist/save.js';
const c=createCity();for(const t of c.tiles)if(t.type==='residential'||t.type==='commercial'){t.level=3;t.density=3;}recompute(c);const before=JSON.stringify(c.tiles),funds=c.funds;const originals=c.tiles.filter(t=>t.type==='residential'&&baseZonedSprite(t,c.seed)===2);assert.ok(originals.length>1);
replaceBuildingStyle(c,2,74);assert.ok(originals.every(t=>zonedSprite(t,c.seed,c.buildingReplacements)===74));assert.equal(JSON.stringify(c.tiles),before);assert.equal(c.funds,funds);const restored=validateSave(JSON.parse(serializeCity(c)));assert.deepEqual(restored.buildingReplacements,{'2':74});assert.ok(originals.every(t=>zonedSprite(t,restored.seed,restored.buildingReplacements)===74));
replaceBuildingStyle(c,74,2);assert.equal(zonedSprite(originals[0],c.seed,c.buildingReplacements),74,'replacement is not recursively remapped');replaceBuildingStyle(c,2,2);assert.equal(zonedSprite(originals[0],c.seed,c.buildingReplacements),2,'revert removes override');
const saved=JSON.parse(serializeCity(restored));for(const replacements of [null,[],{'2':75},{unknown:74},{'2':'74'}]){const bad=structuredClone(saved);bad.buildingReplacements=replacements;assert.throws(()=>validateSave(bad));}
const old=structuredClone(saved);old.version=57;delete old.buildingReplacements;assert.deepEqual(validateSave(old).buildingReplacements,{});assert.throws(()=>replaceBuildingStyle(c,2,75));assert.deepEqual(c.buildingReplacements,{'74':2},'invalid changes are atomic');
console.log('PASS: citywide style replacement, unchanged simulation, saved overrides, nonrecursive swaps, revert, invalid-import rejection and legacy migration.');
