import assert from 'node:assert/strict';
import {createCity,tick,validateSave} from '../dist/engine.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {restartCustomScenario} from '../dist/scenario-replay.js';
import {showEmergency} from '../dist/emergency-ui.js';
import {serializeCity} from '../dist/save.js';
import {advanceBusiness,answerBusiness,businessOffer} from '../dist/business.js';
import {scenarioAllowsBackground,backgroundRulesReport} from '../dist/scenario-background-rules.js';
import {maybeIgnite,maybeEarthquake,maybeTornado} from '../dist/emergency.js';
import {maybeUfo} from '../dist/ufo.js';
import {maybeWhirlpool} from '../dist/whirlpool.js';
import {maybeToxicCloud} from '../dist/toxic-cloud.js';
import {maybeSpaceJunk} from '../dist/space-junk.js';
import {maybeLocusts} from '../dist/locusts.js';
import {advanceUnrest} from '../dist/riots.js';
const definition={title:'Scripted conditions',months:24,objectives:[{metric:'population',target:100000}],backgroundRules:{randomDisasters:false,automaticBusiness:false}};
const restore=c=>validateSave(JSON.parse(serializeCity(c)));
let c=createCity();attachCustomScenario(c,definition);
for(const key of Object.keys(c.emergency).filter(k=>k.startsWith('random')))c.emergency[key]=true;
c=restore(c);const before=serializeCity(c);
for(const generate of [maybeIgnite,maybeEarthquake,maybeTornado,maybeUfo,maybeWhirlpool,maybeToxicCloud,maybeSpaceJunk,maybeLocusts,advanceUnrest])assert.equal(generate(c),false,generate.name);
assert.equal(serializeCity(c),before,'suspending generation leaves saved preferences and city untouched');
assert.match(backgroundRulesReport(c),/Random disasters are suspended/);
// Find a deterministic natural-fire seed, then verify policy blocks it and releases it.
let seed=0;for(;seed<10000;seed++){const probe=createCity();probe.seed=seed;probe.emergency.randomFires=true;if(maybeIgnite(probe))break;}assert.ok(seed<10000);
c.seed=seed;assert.equal(maybeIgnite(c),false);c.scenario.status='lost';assert.equal(maybeIgnite(c),true);
for(const status of ['won','lost']){const b=createCity();attachCustomScenario(b,definition);b.month=12;b.stats.population=300;b.stats.balance=-1;assert.equal(advanceBusiness(b),false);b.scenario.status=status;assert.equal(advanceBusiness(b),true);assert.equal(businessOffer(b).offered,12);assert.equal(businessOffer(b,'toxicWaste').offered,12);}
// Existing pending offers survive attachment and acceptance; scripted offers bypass automatic gates.
c=createCity();c.month=12;c.stats.population=300;c.stats.balance=-1;advanceBusiness(c);attachCustomScenario(c,definition);assert.ok(answerBusiness(c,true).ok);assert.equal(businessOffer(restore(c)).accepted,true);
for(const type of ['business','fire']){c=createCity();attachCustomScenario(c,{...definition,events:[type==='business'?{type,business:'casino',month:1}:{type,month:1,x:20,y:20}]});tick(c);assert.equal(c.scenario.events[0].status,'triggered');if(type==='business')assert.equal(businessOffer(c).offered,1);else assert.ok(c.emergency.active);assert.deepEqual(restore(c).scenario.definition.backgroundRules,definition.backgroundRules);}
const replay=restartCustomScenario(restore(c));assert.equal(replay.scenario.status,'playing');assert.deepEqual(replay.scenario.definition.backgroundRules,definition.backgroundRules);assert.equal(replay.month,replay.scenario.startMonth);
let html='';globalThis.document={querySelector:()=>({}),querySelectorAll:()=>[]};
showEmergency({city:()=>replay,dialog:(_,body)=>{html=body;}});
const randomInputs=[...html.matchAll(/<input id="random[^>]+>/g)].map(m=>m[0]);assert.equal(randomInputs.length,9);assert.ok(randomInputs.every(input=>input.includes('disabled')));assert.match(html,/saved random-disaster preferences resume/);assert.match(html,/Current monthly riot chance: 0.00%/);
const legacy=JSON.parse(serializeCity(c));legacy.version=102;delete legacy.scenario.definition.backgroundRules;assert.deepEqual(validateSave(legacy).scenario.definition.backgroundRules,{randomDisasters:true,automaticBusiness:true});
assert.deepEqual(validateCustomDefinition({...definition,backgroundRules:undefined}).backgroundRules,{randomDisasters:true,automaticBusiness:true});
for(const rules of [null,[],{},true,{randomDisasters:0,automaticBusiness:true},{randomDisasters:true,automaticBusiness:'false'}])assert.throws(()=>validateCustomDefinition({...definition,backgroundRules:rules}));
assert.equal(scenarioAllowsBackground(createCity(),'randomDisasters'),true);
console.log('PASS: authored background rules block all nine random generators and automatic offers, preserve existing permits/preferences, allow scripted hazards/offers, survive saves, migrate legacy definitions and release after outcomes.');
