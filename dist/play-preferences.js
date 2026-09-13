const KEY='sims3000-play-preferences';
export const PLAY_DEFAULTS=Object.freeze({autoGoToDisasters:true,vehicleAnimations:true,sceneryAnimations:true,trafficMinZoom:.4});
export function createPlayPreferences(storage){
 let settings={...PLAY_DEFAULTS};
 try{const saved=JSON.parse(storage?.getItem(KEY));for(const k of Object.keys(settings))if(k==='trafficMinZoom'?[.4,1,1.5].includes(saved?.[k]):typeof saved?.[k]==='boolean')settings[k]=saved[k];}catch{}
 return{get settings(){return{...settings};},set(key,value){
  if(!Object.hasOwn(PLAY_DEFAULTS,key)||(key==='trafficMinZoom'?![.4,1,1.5].includes(value):typeof value!=='boolean'))throw Error('Choose a valid play preference.');
  settings[key]=value;
  try{if(!storage)throw Error();storage.setItem(KEY,JSON.stringify(settings));return true;}catch{return false;}
 }};
}
export function automaticDisasterFocus(preferences,focus){if(!preferences.settings.autoGoToDisasters)return false;focus();return true;}
export function showPlayPreferences({preferences,renderer,dialog,notify}){
 const choices=[['autoGoToDisasters','Auto Go To Disasters','Move the camera to a newly reported random or scripted disaster. Manual Go to Disaster and disasters you place remain available.'],['vehicleAnimations','Show vehicles','Display cars, trains, ships and aircraft. Commutes, traffic and transport services still run when vehicles are hidden.'],['sceneryAnimations','Animate scenery','Animate decorative fountain water. Buildings and essential disaster indicators remain visible.']];
 dialog('Play preferences',`<p>These settings apply to this browser across cities. Your system’s reduced-motion preference also limits animation.</p>${choices.map(([key,title,description])=>`<label class="ordinance"><input id="pref-${key}" type="checkbox" ${preferences.settings[key]?'checked':''}><span><strong>${title}</strong><br>${description}</span></label>`).join('')}<label>Vehicles visible at<select id="pref-trafficMinZoom">${[[.4,'All zoom levels'],[1,'Neighborhood view · 100% and closer'],[1.5,'Close view · 150% and closer']].map(([value,label])=>`<option value="${value}" ${preferences.settings.trafficMinZoom===value?'selected':''}>${label}</option>`).join('')}</select></label><p class="fine">Zoom thresholds adapt traffic visibility to this game’s continuous camera zoom. Sound has its own settings in City desk. Preferences do not change the simulation speed, disaster damage or city files.</p>`);
 const apply=(key,value)=>{
  const saved=preferences.set(key,value);renderer.preferences=preferences.settings;renderer.dirty=true;
  notify(saved?'Play preference saved.':'Preference applied for this session. Browser storage is unavailable.');
 };
 for(const [key]of choices)document.querySelector('#pref-'+key).onchange=event=>apply(key,event.target.checked);
 document.querySelector('#pref-trafficMinZoom').onchange=event=>apply('trafficMinZoom',Number(event.target.value));
}
