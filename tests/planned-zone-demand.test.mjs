import assert from 'node:assert/strict';
import {createCity,build,selection,tick,recompute,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const blank=()=>{const c=createCity('Planned districts',false);for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});c.emergency.randomFires=false;recompute(c);return c;};
const c=blank();
for(const [tool,a,b]of [['coal',{x:2,y:4}],['road',{x:8,y:10},{x:37,y:10}],['residential',{x:8,y:7},{x:37,y:9}],['industrial',{x:8,y:11},{x:37,y:13}],['commercial',{x:8,y:14},{x:37,y:16}]])assert.ok(build(c,tool,selection(tool,a,b||a),1).ok);
assert.equal(c.stats.population,0);assert.deepEqual(c.stats.demand,{residential:40,commercial:18,industrial:50},'270 reserved tiles must not erase unmet demand');
for(let i=0;i<3;i++)tick(c);const loaded=validateSave(JSON.parse(serializeCity(c)));for(let i=0;i<3;i++){tick(c);tick(loaded);}assert.ok(c.stats.population>0);assert.ok(c.stats.industrialJobs>0);assert.ok(c.stats.commercialJobs>0);assert.equal(serializeCity(c),serializeCity(loaded),'ordinary growth continues identically after a save');
const empty=blank(),base={...empty.stats.demand};for(const [sector,y] of [['residential',5],['commercial',10],['industrial',15]]){assert.ok(build(empty,sector,selection(sector,{x:5,y},{x:35,y:y+2}),1).ok);assert.deepEqual(empty.stats.demand,base);}
for(const [sector,y,penalty] of [['residential',5,.7],['commercial',10,1.4],['industrial',15,1.1]]){const t=empty.tiles[y*48+5];t.abandonedLevel=1;recompute(empty);assert.ok(Math.abs(empty.stats.demand[sector]-(base[sector]-penalty))<1e-8,'real abandoned buildings retain vacancy pressure');t.abandonedLevel=0;recompute(empty);assert.deepEqual(empty.stats.demand,base);}
console.log('PASS: large RCI zoning plans retain demand, ordinary construction grows all sectors, saved growth is deterministic and actual abandoned buildings retain vacancy pressure.');
