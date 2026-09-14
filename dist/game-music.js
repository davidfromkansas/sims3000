import {MUSIC_TRACKS,musicScore} from './music-score.js?v=reward-progress-1';
export {MUSIC_TRACKS};
const KEY='sims3000-music',ids=Object.keys(MUSIC_TRACKS);
export function createGameMusic(){
 let settings={enabled:false,volume:35,selected:[...ids]};
 try{const p=JSON.parse(localStorage.getItem(KEY));if(p&&typeof p.enabled==='boolean'&&Number.isFinite(p.volume)&&Array.isArray(p.selected))settings={enabled:p.enabled,volume:Math.max(0,Math.min(100,p.volume)),selected:ids.filter(id=>p.selected.includes(id))};}catch{}
 let context,master,noise,timer=null,current=null,score=null,start=0,offset=0,index=0,preview=false,unlocked=false,paused=true,revision=0,previewPending=false;
 const active=new Set(),listeners=new Set();
 const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(settings));}catch{}};
 const status=()=>({current,preview,paused,enabled:settings.enabled,selected:[...settings.selected]});
 const emit=()=>{for(const fn of listeners)fn(status());};
 const gain=()=>{if(master){master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(document.hidden?0:settings.volume/100*.28,context.currentTime,.04);}};
 const silence=()=>{if(timer!==null){clearInterval(timer);timer=null;}for(const node of active)try{node.stop();}catch{}active.clear();};
 const hold=()=>{if(!paused&&context&&score)offset=Math.max(0,Math.min(score.duration,context.currentTime-start));paused=true;silence();emit();};
 const clear=()=>{hold();current=null;score=null;offset=0;index=0;preview=false;emit();};
 function voice(note,when){
  const envelope=context.createGain(),duration=note.duration,release=note.voice==='pad'?.7:.16,peak=note.gain;
  envelope.gain.setValueAtTime(0,when);envelope.gain.linearRampToValueAtTime(peak,when+(note.voice==='pad'?.18:.012));envelope.gain.exponentialRampToValueAtTime(Math.max(.001,peak*.35),when+duration);envelope.gain.exponentialRampToValueAtTime(.0001,when+duration+release);envelope.connect(master);
  const sources=[];let filter=null;
  if(note.voice==='brush'){
   const source=context.createBufferSource();source.buffer=noise;filter=context.createBiquadFilter();filter.type='highpass';filter.frequency.value=5500;source.connect(filter);filter.connect(envelope);sources.push(source);
  }else{
   const freq=440*2**((note.pitch-69)/12),osc=context.createOscillator();osc.type=note.voice==='keys'?'triangle':'sine';osc.frequency.value=freq;osc.connect(envelope);sources.push(osc);
   if(note.voice==='pad'){const second=context.createOscillator();second.type='sine';second.frequency.value=freq;second.detune.value=5;second.connect(envelope);sources.push(second);}
  }
  let remaining=sources.length;
  for(const node of sources){active.add(node);node.onended=()=>{active.delete(node);node.disconnect();if(!--remaining){envelope.disconnect();filter?.disconnect();}};node.start(when);node.stop(when+duration+release+.02);}
 }
 function choose(){const choices=settings.selected.filter(id=>id!==current),pool=choices.length?choices:settings.selected;return pool.length?pool[Math.floor(Math.random()*pool.length)]:null;}
 function begin(id,isPreview=false){silence();current=id;score=musicScore(id);preview=isPreview;offset=0;index=0;start=context.currentTime+.05;paused=false;gain();timer=setInterval(pump,100);pump();emit();}
 function pump(){
  if(paused||document.hidden)return;
  const now=context.currentTime;
  while(index<score.notes.length&&start+score.notes[index].at<now+.25){const note=score.notes[index++];if(start+note.at>=now-.03)voice(note,Math.max(now,start+note.at));}
  if(now-start>=score.duration){const wasPreview=preview;if(settings.enabled&&settings.selected.length){begin(choose(),false);}else{clear();}if(wasPreview)emit();}
 }
 function resume(){
  if(!context||!unlocked||document.hidden)return;
  if(!score){if(settings.enabled&&settings.selected.length)begin(choose());return;}
  if(!preview&&!settings.enabled)return;
  if(paused){start=context.currentTime-offset;index=score.notes.findIndex(n=>n.at>=offset);if(index<0)index=score.notes.length;paused=false;gain();timer=setInterval(pump,100);pump();emit();}
 }
 async function unlock(force=false,playback=true){
  if(!settings.enabled&&!preview&&!force)return;
  const Constructor=window.AudioContext||window.webkitAudioContext;if(!Constructor)throw Error('Music is not available in this browser.');
  if(!context){context=new Constructor();master=context.createGain();master.connect(context.destination);noise=context.createBuffer(1,Math.ceil(context.sampleRate*.3),context.sampleRate);const data=noise.getChannelData(0);let seed=9173;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1;}}
  if(context.state==='suspended')await context.resume();unlocked=true;gain();if(playback)resume();
 }
 document.addEventListener('pointerdown',()=>{unlock().catch(()=>{});},{capture:true});document.addEventListener('keydown',()=>{unlock().catch(()=>{});},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hold();else if(settings.enabled||preview)unlock().catch(()=>{});gain();});
 return{
  get settings(){return{...settings,selected:[...settings.selected]};},get status(){return status();},
  subscribe(fn){listeners.add(fn);fn(status());return()=>listeners.delete(fn);},
  async enable(value){revision++;previewPending=false;settings.enabled=!!value;persist();if(!settings.enabled)clear();else await unlock();emit();},
  volume(value){settings.volume=Math.max(0,Math.min(100,Number(value)||0));persist();gain();},
  select(id,value){if(!MUSIC_TRACKS[id])return;settings.selected=ids.filter(k=>k===id?!!value:settings.selected.includes(k));persist();if(!preview&&current&&!settings.selected.includes(current)){clear();resume();}else if(!current)resume();emit();},
  async preview(id){if(!MUSIC_TRACKS[id])throw Error('Unknown music selection.');const request=++revision;previewPending=true;try{await unlock(true,false);if(request!==revision)return;previewPending=false;if(document.hidden){clear();return;}begin(id,true);}catch(error){if(request===revision)previewPending=false;throw error;}},
  stopPreview(){if(!preview&&!previewPending)return;revision++;previewPending=false;clear();resume();}
 };
}
let detach=null;
export function showMusicSettings(music,container,notify){
 detach?.();const s=music.settings;
 container.innerHTML=`<h3>Original city soundtrack</h3><p>Three original synthesized scores play in random order from your selection, avoiding an immediate repeat when another track is available. Music continues while the city is paused for planning and pauses while the tab is hidden.</p><label><input id="musicEnabled" type="checkbox" ${s.enabled?'checked':''}> Enable background music</label><label>Music volume <span id="musicLevel">${s.volume}%</span><input id="musicVolume" type="range" min="0" max="100" value="${s.volume}"></label><div class="table-scroll"><table><thead><tr><th>Include</th><th>Selection</th><th>Listen</th></tr></thead><tbody>${Object.entries(MUSIC_TRACKS).map(([id,t])=>`<tr><td><input type="checkbox" data-music-select="${id}" aria-label="Include ${t.name}" ${s.selected.includes(id)?'checked':''}></td><td><strong>${t.name}</strong><br><small>${t.description}</small></td><td><button data-music-preview="${id}">Preview ${t.name}</button></td></tr>`).join('')}</tbody></table></div><p id="musicStatus" aria-live="polite"></p><button id="stopMusicPreview">Stop preview</button><p class="fine">Music and effects have separate switches and volumes. No selections means silence. Previews work without enabling background music; after a preview, the enabled playlist resumes. Preferences stay in this browser. These are new compositions, not the original game’s recordings.</p>`;
 container.querySelector('#musicEnabled').onchange=async e=>{try{await music.enable(e.target.checked);}catch(error){notify(error.message);}};
 container.querySelector('#musicVolume').oninput=e=>{music.volume(e.target.value);container.querySelector('#musicLevel').textContent=music.settings.volume+'%';};
 for(const el of container.querySelectorAll('[data-music-select]'))el.onchange=()=>music.select(el.dataset.musicSelect,el.checked);
 for(const el of container.querySelectorAll('[data-music-preview]'))el.onclick=async()=>{try{await music.preview(el.dataset.musicPreview);}catch(error){notify(error.message);}};
 container.querySelector('#stopMusicPreview').onclick=()=>music.stopPreview();
 detach=music.subscribe(state=>{if(!container.isConnected){detach?.();detach=null;return;}container.querySelector('#musicStatus').textContent=state.current?(state.paused?'Paused: ':state.preview?'Previewing: ':'Now playing: ')+MUSIC_TRACKS[state.current].name:state.enabled?(state.selected.length?'Click or press a key to start music.':'Select a track to hear music.'):'Background music is off.';container.querySelector('#stopMusicPreview').disabled=!state.preview;});
}
