import assert from 'node:assert/strict';
import {generateCity} from '../dist/terrain-generator.js';
import {build,tick,validateSave} from '../dist/engine.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {scenarioEventReport} from '../dist/scenario-events.js';
import {answerBusiness,businessOffer} from '../dist/business.js';
import {serializeCity} from '../dist/save.js';
const roundtrip=c=>validateSave(JSON.parse(serializeCity(c)));
for(const type of ['casino','toxicWaste']){
 let c=generateCity({startYear:2000,water:0,mountains:0,trees:0});
 attachCustomScenario(c,{title:'An early proposal',months:24,objectives:[{metric:'population',target:100000}],events:[{type:'business',business:type,month:1,repeatCount:4,repeatEvery:1}]});
 const cash=c.funds;assert.equal(tick(c).businessOffered,true);assert.equal(c.funds,cash);assert.equal(c.stats.businessIncome,0);assert.equal(businessOffer(c,type).accepted,false);assert.equal(build(c,type,[{x:20,y:20}]).ok,false);
 c=roundtrip(c);assert.equal(businessOffer(c,type).offered,1);assert.match(scenarioEventReport(c),/Offer business deal:/);
 assert.equal(tick(c).businessOffered,false);assert.equal(businessOffer(c,type).offered,1,'pending offer keeps its original date');
 assert.ok(answerBusiness(c,false,type).ok);assert.equal(tick(c).businessOffered,true,'explicit later script can reoffer a declined deal');assert.equal(businessOffer(c,type).offered,3);
 assert.ok(answerBusiness(c,true,type).ok);c=roundtrip(c);assert.equal(tick(c).businessOffered,false);assert.equal(businessOffer(c,type).offered,3);assert.equal(businessOffer(c,type).accepted,true);assert.equal(c.stats.businessIncome,0);
 assert.ok(build(c,type,[{x:20,y:20}]).ok);assert.equal(c.stats.businessIncome,type==='casino'?150:300);assert.equal(roundtrip(c).stats.businessIncome,c.stats.businessIncome);
}
for(const business of ['invalid','__proto__',null])assert.throws(()=>validateCustomDefinition({title:'Invalid',months:12,objectives:[{metric:'population',target:1}],events:[{type:'business',month:1,business}]}));
console.log('PASS: scripted business proposals preserve player acceptance, save pending permits, repeat after decline, keep accepted offers and require placement for income.');
