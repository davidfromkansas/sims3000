import {NAV_LAYERS} from './navigation-map.js?v=plane-navigation-1';
// Manual pp.41–42: above-ground element toggles, terrain grid, Apply and Default View.
export const CITY_VIEW_DEFAULTS=Object.freeze({transportation:true,powerLines:true,flora:true,zonedBuildings:true,otherBuildings:true,zones:true,grid:true});
export const CITY_VIEW_CHOICES=[['transportation','Transportation','Roads, surface tracks, highways, ramps, tunnel portals and moving traffic.'],['powerLines','Power lines','Surface poles and wires.'],['flora','Flora','Standalone landscape trees. Trees built into a building model stay with that building.'],['zonedBuildings','Zoned buildings','Residential, commercial, industrial, airport and seaport buildings.'],['otherBuildings','Other buildings','Civic services, transit stations, utilities, recreation and special buildings.'],['zones','Zones','Colored zoning ground and empty-zone outlines.'],['grid','Terrain grid','Tile-edge lines in every view.']];
export function createCityViewOptions(storage){
 const key='sims3000-city-view';let settings={...CITY_VIEW_DEFAULTS};
 try{const saved=JSON.parse(storage?.getItem(key));for(const k of Object.keys(settings))if(typeof saved?.[k]==='boolean')settings[k]=saved[k];}catch{}
 return{get settings(){return{...settings};},apply(value){
  if(!value||Object.keys(CITY_VIEW_DEFAULTS).some(k=>typeof value[k]!=='boolean'))throw Error('Choose a valid city-view setting.');
  settings=Object.fromEntries(Object.keys(CITY_VIEW_DEFAULTS).map(k=>[k,value[k]]));try{if(!storage)throw Error();storage.setItem(key,JSON.stringify(settings));return true;}catch{return false;}
 }};
}
export function cityElementVisible(renderer,key){return(key!=='grid'&&renderer.layer!=='city')||renderer.cityView?.[key]!==false;}
export function cityTileVisible(renderer,t){
 if(t.rubble)return true;
 const key=t.type==='powerline'?'powerLines':!t.type?'flora':['residential','commercial','industrial','airport','seaport'].includes(t.type)?'zonedBuildings':'otherBuildings';
 return cityElementVisible(renderer,key);
}
export function showCityViewOptions({options,renderer,dialog,close,setLayer,notify}){
 dialog('City view layers',`<p>Hide above-ground elements to read the city beneath them. The six element controls apply to City view; data and underground views retain their diagnostic displays. The grid setting applies everywhere. These browser preferences do not remove structures or change the simulation.</p>${CITY_VIEW_CHOICES.map(([key,name,description])=>`<label class="ordinance"><input id="view-${key}" type="checkbox" ${options.settings[key]?'checked':''}><span><strong>${name}</strong><br>${description}</span></label>`).join('')}<label>View after applying<select id="view-layer">${Object.entries({...NAV_LAYERS,tunnels:'Tunnels',transit:'Bus coverage'}).map(([key,name])=>`<option value="${key}" ${renderer.layer===key?'selected':''}>${key==='city'?'Above ground · City':key==='subway'?'Underground · Subways':key==='water'?'Underground · Water pipes':name}</option>`).join('')}</select></label><p>Hidden structures still occupy their lots. Inspect and construction use the actual map. Fires, rubble, radiation, emergency units and construction previews remain visible.</p><div class="actions"><button id="view-apply">Apply</button><button id="view-default">Default view</button><button id="view-done" class="primary">Apply &amp; close</button><button id="view-cancel">Cancel</button></div><p id="view-status" role="status"></p>`);
 const $=id=>document.querySelector('#view-'+id),apply=()=>{const saved=options.apply(Object.fromEntries(Object.keys(CITY_VIEW_DEFAULTS).map(k=>[k,$(k).checked])));renderer.cityView=options.settings;setLayer($('layer').value);renderer.dirty=true;$('status').textContent=saved?'City view saved.':'Applied for this session; browser storage is unavailable.';};
 $('apply').onclick=apply;$('done').onclick=()=>{apply();close();};$('cancel').onclick=close;
 $('default').onclick=()=>{for(const [k,v] of Object.entries(CITY_VIEW_DEFAULTS))$(k).checked=v;$('layer').value='city';$('status').textContent='Defaults selected. Apply to update the map.';};
}
