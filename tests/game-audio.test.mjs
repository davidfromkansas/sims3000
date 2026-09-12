import assert from 'node:assert/strict';
const events={},saved=new Map(),tones=[];let contexts=0;
globalThis.localStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
globalThis.document={hidden:false,addEventListener:(name,fn)=>events[name]=fn};
let master,live;const param=()=>({value:0,setValueAtTime(v){this.value=v;},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}});
class Context{constructor(){live=this;contexts++;this.state='suspended';this.currentTime=1;this.destination={};}createGain(){const g={gain:param(),connect(){},disconnect(){}};master??=g;return g;}createOscillator(){const o={frequency:param(),connect(){},disconnect(){},start(){tones.push(this);},stop(){this.stopped=true;this.onended?.();}};return o;}async resume(){this.state='running';}}
globalThis.window={AudioContext:Context};
const {createGameAudio}=await import('../dist/game-audio.js');const audio=createGameAudio();audio.play('build');assert.equal(contexts,0);assert.equal(audio.settings.enabled,false);
await audio.enable(true);assert.equal(contexts,1);audio.play('build');assert.equal(tones.length,2);assert.ok(master.gain.value>0);audio.volume(0);assert.equal(master.gain.value,0);audio.play('alert');assert.equal(tones.length,2);audio.volume(75);assert.equal(audio.settings.volume,75);assert.equal(JSON.parse(saved.get('sims3000-audio')).volume,75);
await audio.enable(false);assert.equal(master.gain.value,0);await events.pointerdown();assert.equal(contexts,1);audio.play('error');assert.equal(tones.length,2);
await audio.enable(true);document.hidden=true;events.visibilitychange();assert.equal(master.gain.value,0);audio.play('alert');assert.equal(tones.length,2);document.hidden=false;events.visibilitychange();assert.ok(master.gain.value>0);
const city={emergency:{started:0,active:false}};audio.observe(city);live.currentTime=2;city.emergency={started:1,active:true};audio.observe(city);assert.equal(tones.length,5);live.currentTime=3;audio.observe(city);assert.equal(tones.length,5,'one alert per incident');audio.observe({emergency:{started:12,active:true}});assert.equal(tones.length,5,'loading a city does not replay its historical alerts');
for(const [cue,count] of [['notice',3],['achievement',6],['tension',3]]){live.currentTime+=2;const before=tones.length;audio.play(cue);assert.equal(tones.length,before+count,'new scenario cue schedules every voice');}
console.log('PASS: muted startup without audio resources, explicit activation, cue scheduling, volume and mute, persisted settings and hidden-tab silence.');
