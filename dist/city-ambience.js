// Manual p.36: ambient sound becomes audible close to the city.
// Original soundscape weights and zoom/radius thresholds, not original-game audio.
export const AMBIENCE_KINDS=['traffic','industry','nature','water'];
const empty=()=>Object.fromEntries(AMBIENCE_KINDS.map(k=>[k,{gain:0,pan:0}]));
export function localSoundscape(city,renderer,running=true){
 const out=empty();if(!city||!renderer||!running||city.emergency.active||renderer.layer!=='city'||renderer.zoom<=1)return out;
 const focus=renderer.pick(renderer.w/2,renderer.h/2);if(!focus)return out;
 const n=Math.sqrt(city.tiles.length),radius=8,zoom=Math.min(1,(renderer.zoom-1)/1.25),panWeights=Object.fromEntries(AMBIENCE_KINDS.map(k=>[k,0]));
 for(let y=Math.max(0,focus.y-radius);y<=Math.min(n-1,focus.y+radius);y++)for(let x=Math.max(0,focus.x-radius);x<=Math.min(n-1,focus.x+radius);x++){
  const t=city.tiles[y*n+x],distance=Math.hypot(x-focus.x,y-focus.y);if(distance>=radius||t.fire||t.rubble||t.radiation)continue;
  const weight=(1-distance/radius)**2,screen=renderer.project(x,y),pan=Math.max(-1,Math.min(1,(screen.x-renderer.w/2)/(renderer.w*.4))),levels={traffic:city.finance.roadCondition>20?Math.min(1,((t.traffic||0)+(t.highwayTraffic||0))/40):0,industry:t.type==='industrial'&&t.level&&t.powered&&t.industry!=='farm'?.7:0,nature:t.terrain==='land'&&(t.nature||['park','largePark','pond','zoo'].includes(t.type)||t.industry==='farm'&&t.level)?.45:0,water:t.terrain==='water'?.3:0};
  for(const kind of AMBIENCE_KINDS){const value=levels[kind]*weight;out[kind].gain+=value;panWeights[kind]+=pan*value;}
 }
 for(const kind of AMBIENCE_KINDS){const amount=out[kind].gain;out[kind]={gain:Math.min(1,amount/8)*zoom,pan:amount?panWeights[kind]/amount:0};}
 return out;
}
const KEY='sims3000-ambience';
export function createCityAmbience(){
 let settings={enabled:false,volume:30};try{const s=JSON.parse(localStorage.getItem(KEY));if(typeof s?.enabled==='boolean'&&Number.isFinite(s.volume))settings={enabled:s.enabled,volume:Math.max(0,Math.min(100,s.volume))};}catch{}
 let context,master,noise,reader=()=>null,timer=null,beds=[],unlocked=false;
 const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(settings));}catch{}};
 const stop=()=>{if(timer!==null)clearInterval(timer);timer=null;for(const b of beds){try{b.source.stop();}catch{}b.source.disconnect();b.filter.disconnect();b.gain.disconnect();b.pan.disconnect();}beds=[];};
 const level=()=>{if(master){master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(settings.enabled&&!document.hidden?settings.volume/100*.18:0,context.currentTime,.05);}};
 function refresh(){
  const scene=reader(),mix=scene?localSoundscape(scene.city,scene.renderer,scene.running):empty();
  for(const b of beds){b.gain.gain.setTargetAtTime(mix[b.kind].gain*.25*b.compensation,context.currentTime,.3);b.pan.pan?.setTargetAtTime(mix[b.kind].pan,context.currentTime,.3);}
 }
 function start(){
  if(!unlocked||!settings.enabled||document.hidden||beds.length)return;
  // Compensate the narrower filters so low-frequency city beds remain audible.
  for(const [i,kind] of AMBIENCE_KINDS.entries()){
   const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain(),pan=context.createStereoPanner?context.createStereoPanner():context.createGain();
   source.buffer=noise;source.loop=true;source.playbackRate.value=[.8,.45,1,1.15][i];filter.type=['bandpass','lowpass','highpass','bandpass'][i];filter.frequency.value=[420,180,2800,1100][i];filter.Q.value=[.65,.4,.25,.45][i];gain.gain.value=0;
   source.connect(filter);filter.connect(gain);gain.connect(pan);pan.connect(master);source.start();beds.push({kind,source,filter,gain,pan,compensation:[4,8,1,2][i]});
  }
  refresh();timer=setInterval(refresh,250);
 }
 async function unlock(){
  if(!settings.enabled)return;
  const Constructor=window.AudioContext||window.webkitAudioContext;if(!Constructor)throw Error('Ambient sound is not available in this browser.');
  if(!context){context=new Constructor();master=context.createGain();master.connect(context.destination);noise=context.createBuffer(1,context.sampleRate*4,context.sampleRate);const data=noise.getChannelData(0);let seed=781;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/2147483648-1)*.6;}}
  if(context.state==='suspended')await context.resume();unlocked=true;level();start();
 }
 document.addEventListener('pointerdown',()=>{unlock().catch(()=>{});},{capture:true});document.addEventListener('keydown',()=>{unlock().catch(()=>{});},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else unlock().catch(()=>{});level();});
 return{get settings(){return{...settings};},setSceneReader(fn){reader=fn;},async enable(value){settings.enabled=!!value;persist();if(!settings.enabled)stop();level();await unlock();},volume(value){settings.volume=Math.max(0,Math.min(100,Number(value)||0));persist();level();}};
}
export function showAmbienceSettings(ambience,container,notify){const s=ambience.settings;container.innerHTML=`<h3>Nearby city ambience</h3><label><input id="ambientEnabled" type="checkbox" ${s.enabled?'checked':''}> Enable ambient city sound</label><label>Ambient volume <span id="ambientLevel">${s.volume}%</span><input id="ambientVolume" type="range" min="0" max="100" value="${s.volume}"></label><p>Close this panel, run the city, and zoom above 100% to hear nearby traffic, working industry, green space and water. Panning and rotating the map change the local mix and stereo position. Ambient sound fades out during pause, dialogs, emergencies and data views; hidden tabs stop it completely. Music and action effects use their own controls.</p><p class="fine">These are original synthesized sound textures, not individual vehicle or animal recordings. Stereo is used where supported; this does not enable hardware 3D sound.</p>`;
 container.querySelector('#ambientEnabled').onchange=async e=>{try{await ambience.enable(e.target.checked);}catch(error){notify(error.message);}};container.querySelector('#ambientVolume').oninput=e=>{ambience.volume(e.target.value);container.querySelector('#ambientLevel').textContent=ambience.settings.volume+'%';};
}
