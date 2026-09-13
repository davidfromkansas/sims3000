import assert from 'node:assert/strict';
import {MUSIC_TRACKS,musicScore} from '../dist/music-score.js';
import {createGameMusic,showMusicSettings} from '../dist/game-music.js';
const saved=new Map(),listeners={},timers=new Map(),contexts=[];let timerId=0;
globalThis.localStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
globalThis.document={hidden:false,addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn)};
globalThis.setInterval=fn=>{timers.set(++timerId,fn);return timerId;};globalThis.clearInterval=id=>timers.delete(id);
const param=()=>({value:0,setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v){assert.ok(Number.isFinite(v));},exponentialRampToValueAtTime(v){assert.ok(v>0);},cancelScheduledValues(){},setTargetAtTime(v){this.value=v;}});
class Context{
 constructor(){contexts.push(this);this.state='suspended';this.currentTime=0;this.sampleRate=22050;this.destination={};this.nodes=[];this.gains=[];}
 createGain(){const g={gain:param(),connect(){},disconnect(){}};this.gains.push(g);return g;}
 createBuffer(channels,length){return{getChannelData:()=>new Float32Array(length)};}
 createBiquadFilter(){return{frequency:param(),connect(){},disconnect(){}};}
 createOscillator(){return this.source();}createBufferSource(){return this.source();}
 source(){const ctx=this,node={frequency:param(),detune:param(),connect(){},disconnect(){this.disconnected=true;},start(t){this.startAt=t;},stop(t){this.stopAt=t??ctx.currentTime;if(this.stopAt<=ctx.currentTime&&!this.ended){this.ended=true;this.onended?.();}}};this.nodes.push(node);return node;}
 async resume(){this.state='running';}
}
globalThis.window={AudioContext:Context};
async function visible(hidden){document.hidden=hidden;for(const fn of listeners.visibilitychange||[])fn();await Promise.resolve();await Promise.resolve();}
function advance(seconds){for(const c of contexts){c.currentTime+=seconds;for(const n of c.nodes)if(n.stopAt<=c.currentTime&&!n.ended){n.ended=true;n.onended?.();}}for(const fn of [...timers.values()])fn();}
for(const id of Object.keys(MUSIC_TRACKS)){const s=musicScore(id);assert.deepEqual(musicScore(id),s);assert.ok(s.duration>70&&s.duration<115);assert.ok(s.notes.length>=352);for(const n of s.notes){assert.ok(n.at>=0&&n.at+n.duration<s.duration);assert.ok(n.gain>0&&n.gain<=.21);assert.ok(['keys','bass','lead','pad','brush'].includes(n.voice));if(n.voice!=='brush')assert.ok(n.pitch>=29&&n.pitch<=86);}assert.ok(s.notes.every((n,i)=>!i||n.at>=s.notes[i-1].at));}
for(const id of Object.keys(MUSIC_TRACKS)){const edges=musicScore(id).notes.flatMap(n=>{const level=n.gain*(n.voice==='pad'?2:1);return[[n.at,level],[n.at+n.duration+(n.voice==='pad'?.7:.16),-level]];}).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);let sum=0,peak=0;for(const [,delta] of edges){sum+=delta;peak=Math.max(peak,sum);}assert.ok(peak*.28<1,'conservative full-volume sum remains below clipping');}
const music=createGameMusic();assert.equal(contexts.length,0);assert.equal(music.settings.enabled,false);await music.enable(true);assert.equal(contexts.length,1);assert.equal(timers.size,1);assert.ok(music.status.current);assert.ok(contexts[0].nodes.length>0);
const first=music.status.current;advance(musicScore(first).duration+1);assert.notEqual(music.status.current,first,'shuffle avoids immediate repeat');assert.equal(timers.size,1,'track transition leaves exactly one scheduler');
for(const id of Object.keys(MUSIC_TRACKS))music.select(id,id==='evening');assert.equal(music.status.current,'evening');advance(musicScore('evening').duration+1);assert.equal(music.status.current,'evening','a single selection can repeat');assert.equal(timers.size,1);
advance(.5);await visible(true);assert.equal(timers.size,0);assert.equal(music.status.paused,true);assert.equal(contexts[0].gains[0].gain.value,0);assert.ok(contexts[0].nodes.every(n=>n.ended));
advance(1000);await visible(false);assert.equal(music.status.current,'evening');assert.equal(timers.size,1);assert.equal(music.status.paused,false);
music.volume(72);assert.equal(music.settings.volume,72);assert.equal(contexts[0].gains[0].gain.value,.72*.28);assert.equal(JSON.parse(saved.get('sims3000-music')).volume,72);
await music.enable(false);assert.equal(timers.size,0);assert.equal(music.status.current,null);
await music.preview('morning');assert.equal(music.settings.enabled,false);assert.equal(music.status.preview,true);assert.equal(music.status.current,'morning');advance(musicScore('morning').duration+1);assert.equal(music.status.current,null);assert.equal(timers.size,0,'disabled playlist stays silent after a preview');
await music.enable(true);await music.preview('riverside');assert.equal(music.status.current,'riverside');music.stopPreview();assert.equal(music.status.current,'evening');assert.equal(music.status.preview,false);
music.select('evening',false);assert.equal(music.status.current,null);assert.equal(timers.size,0);assert.deepEqual(music.settings.selected,[]);
music.select('morning',true);assert.equal(music.status.current,'morning');const leaked=music.settings;leaked.selected.length=0;assert.deepEqual(music.settings.selected,['morning']);
// Rapid preview gestures retain the most recent intent across async audio unlocks.
const ctx=contexts[0],pending=[];ctx.state='suspended';ctx.resume=()=>new Promise(resolve=>pending.push(()=>{ctx.state='running';resolve();}));
const earlier=music.preview('evening'),later=music.preview('riverside');pending[1]();await later;pending[0]();await earlier;assert.equal(music.status.current,'riverside');assert.equal(timers.size,1);
ctx.state='suspended';const cancelled=music.preview('morning');await music.enable(false);pending[2]();await cancelled;assert.equal(music.status.current,null);assert.equal(timers.size,0,'mute cancels an in-flight preview');
// Exercise the actual assigned settings controls with a small DOM harness.
ctx.state='running';const nodes=Object.fromEntries(['musicEnabled','musicVolume','musicLevel','musicStatus','stopMusicPreview'].map(id=>[id,{}])),choices=Object.keys(MUSIC_TRACKS).map(id=>({dataset:{musicSelect:id},checked:id==='morning'})),previews=Object.keys(MUSIC_TRACKS).map(id=>({dataset:{musicPreview:id}}));
const container={isConnected:true,innerHTML:'',querySelector:s=>nodes[s.slice(1)],querySelectorAll:s=>s==='[data-music-select]'?choices:previews};const notifications=[];
showMusicSettings(music,container,message=>notifications.push(message));assert.match(container.innerHTML,/Original city soundtrack/);assert.match(nodes.musicStatus.textContent,/off/);
await nodes.musicEnabled.onchange({target:{checked:true}});assert.equal(music.settings.enabled,true);nodes.musicVolume.oninput({target:{value:'43'}});assert.equal(nodes.musicLevel.textContent,'43%');await previews[2].onclick();assert.equal(music.status.current,'evening');assert.equal(nodes.stopMusicPreview.disabled,false);nodes.stopMusicPreview.onclick();assert.equal(music.status.current,'morning');choices[0].checked=false;choices[0].onchange();assert.equal(music.status.current,null);assert.match(nodes.musicStatus.textContent,/Select a track/);assert.deepEqual(notifications,[]);
await music.enable(false);const restored=createGameMusic();assert.equal(restored.settings.volume,43);assert.deepEqual(restored.settings.selected,[]);assert.equal(restored.settings.enabled,false);assert.equal(contexts.length,1,'restoring preferences alone does not allocate audio');
window.AudioContext=undefined;await assert.rejects(restored.preview('morning'),/not available/);assert.equal(restored.status.current,null);assert.equal(timers.size,0);
console.log('PASS: original scores, lazy music activation, random selected playlist, bounded scheduler, hidden-tab suspension, independent preview/mute/volume, async cancellation, saved choices and actual settings handlers.');
