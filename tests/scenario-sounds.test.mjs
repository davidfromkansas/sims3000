import assert from 'node:assert/strict';
import {generateCity} from '../dist/terrain-generator.js';
import {tick,validateSave} from '../dist/engine.js';
import {attachCustomScenario,validateCustomDefinition} from '../dist/custom-scenarios.js';
import {scenarioEventReport} from '../dist/scenario-events.js';
import {SCENARIO_SOUNDS,deliverScenarioSound} from '../dist/scenario-sounds.js';
import {AUDIO_CUES} from '../dist/game-audio.js';
import {serializeCity} from '../dist/save.js';
for(const sound of Object.keys(SCENARIO_SOUNDS)){
 let c=generateCity({water:0,mountains:0,trees:0});attachCustomScenario(c,{title:'City signal',months:24,objectives:[{metric:'population',target:100000}],events:[{type:'sound',sound,month:1,repeatCount:2,repeatEvery:2,condition:{metric:'ordinanceReading',operator:'eq',target:1}}]});
 assert.equal(tick(c).scenarioEvent,null);c.civic.ordinances.reading=true;const event=tick(c).scenarioEvent;assert.equal(event.sound,sound);assert.equal(c.emergency.active,false);const played=[];const audio={play:cue=>played.push(cue)};assert.equal(deliverScenarioSound(event,audio),true);assert.deepEqual(played,[SCENARIO_SOUNDS[sound].cue]);assert.equal(deliverScenarioSound(event,audio,true),false,'emergency gets priority');assert.equal(deliverScenarioSound(null,audio),false);
 c=validateSave(JSON.parse(serializeCity(c)));assert.match(scenarioEventReport(c),/Play sound:/);assert.equal(tick(c).scenarioEvent,null,'loading does not replay the previous cue');assert.equal(tick(c).scenarioEvent.sound,sound,'repeat runs after actual previous occurrence');
 const tones=AUDIO_CUES[SCENARIO_SOUNDS[sound].cue];assert.ok(tones.length>1);for(const [from,to,duration,delay]of tones){assert.ok(from>0&&to>0&&duration>.012&&delay>=0&&duration+delay<2,'bounded playable envelopes');}
}
for(const sound of ['bad','__proto__',null])assert.throws(()=>validateCustomDefinition({title:'Invalid',months:12,objectives:[{metric:'population',target:1}],events:[{type:'sound',month:1,sound}]}));
console.log('PASS: conditional sound dispatch, emergency priority, saved progress without replay, actual repeat timing, safe tone envelopes and invalid cues.');
