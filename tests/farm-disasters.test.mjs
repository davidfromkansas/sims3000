import assert from 'node:assert/strict';
import {generateCity} from '../dist/terrain-generator.js';
import {build,selection,idx,recompute,validateSave} from '../dist/engine.js';
import {advanceIndustry} from '../dist/industry.js';
import {ignite,stepFire} from '../dist/emergency.js';
import {startUfo} from '../dist/ufo.js';
import {serializeCity} from '../dist/save.js';
function farm(){
 const c=generateCity({startYear:2000,water:0,mountains:0,trees:0});
 build(c,'solar',[{x:10,y:15}]);build(c,'road',selection('road',{x:15,y:20},{x:20,y:20}));build(c,'residential',[{x:16,y:19}]);
 build(c,'industrial',selection('industrial',{x:19,y:23},{x:21,y:25}));
 for(let i=0;i<100&&!c.tiles.some(t=>t.industry==='farm');i++){c.month++;advanceIndustry(c);recompute(c);}
 assert.equal(c.stats.farms,1);return c;
}
const plot=c=>c.tiles.filter(t=>t.x>=19&&t.x<=21&&t.y>=23&&t.y<=25);
for(const [x,y] of [[19,23],[21,25]]){
 const c=farm();for(const t of plot(c))t.pipe=true;
 assert.ok(ignite(c,x,y).ok);const t=c.tiles[idx(x,y)];t.fire=100;t.fireAge=100;
 stepFire(c);recompute(c);
 assert.equal(c.emergency.destroyed,1,'one farm, not nine buildings');assert.equal(c.stats.farms,0);assert.equal(c.stats.industrialJobs,0);
 assert.ok(plot(c).every(t=>t.rubble&&t.level===0&&t.farmRoot===null&&t.industry==='dirty'&&t.fire===0&&t.type==='industrial'&&t.pipe));
 const saved=validateSave(JSON.parse(serializeCity(c)));assert.ok(plot(saved).every(t=>t.rubble));
 assert.equal(build(saved,'industrial',[{x,y}]).ok,false,'rubble prevents redevelopment');
 assert.ok(build(saved,'bulldoze',selection('bulldoze',{x:19,y:23},{x:21,y:25})).ok);
 assert.ok(plot(saved).every(t=>!t.rubble&&t.type==='industrial'&&t.pipe));
 for(let k=0;k<200&&!saved.stats.farms;k++){saved.month++;advanceIndustry(saved);recompute(saved);}
 assert.equal(saved.stats.farms,1,'the cleared low-density plot can grow a new farm');assert.equal(saved.stats.industrialJobs,12);
}
const alien=farm();startUfo(alien,21,25);
for(let i=0;i<12;i++)stepFire(alien);
assert.ok(plot(alien).every(t=>t.rubble),'a field strike removes the whole farm');assert.equal(alien.emergency.destroyed,1);
const restored=validateSave(JSON.parse(serializeCity(alien)));
for(let i=0;i<20;i++){stepFire(alien);stepFire(restored);}recompute(alien);recompute(restored);
assert.equal(serializeCity(alien),serializeCity(restored),'mid-disaster saves preserve recovery state');
console.log('PASS: barn and field destruction, one-farm accounting, utility and zone preservation, rubble clearance, farm regrowth and alien-attack save continuity.');
