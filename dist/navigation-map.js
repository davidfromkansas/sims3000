import {powerBaseNeed,waterBaseNeed} from './utility-demand.js?v=reward-garbage-1';
import {EDUCATION_LAYERS,EDUCATION_LAYER_LEGEND,educationLayerProfile,educationLayerColor} from './education-layers.js?v=reward-garbage-1';
import {drawNavigationPrecincts,PRECINCT_LAYERS,PRECINCT_LEGEND,precinctCoverageNote} from './service-areas.js?v=reward-garbage-1';
import {mapSize} from './city-grid.js?v=reward-garbage-1';
export const NAV_LAYERS={city:'City',zones:'Zones',aura:'Approval / aura',density:'Built density',flammability:'Flammability',power:'Power',water:'Water',traffic:'Road traffic',rail:'Rail usage',subway:'Subway usage',pollution:'Air pollution',waterPollution:'Water pollution',crime:'Crime',landValue:'Land value',police:'Police coverage',fire:'Fire coverage',health:'Health coverage',education:'Education coverage',garbage:'Uncollected waste',...Object.fromEntries(Object.entries(EDUCATION_LAYERS).map(([key,value])=>[key,value.name]))};
export function navigationLegend(layer){return EDUCATION_LAYERS[layer]?EDUCATION_LAYER_LEGEND:['rail','subway'].includes(layer)?'Used track bright · Unused track gray · Stations: operating gold, inactive orange':layer==='aura'?'Occupied homes: low approval red → high green · Other tiles gray':layer==='density'?'Built density: pale low → dark dense · Empty zones gray':layer==='flammability'?'Fire risk: low green → high red':['city','zones'].includes(layer)?'Homes green · Shops blue · Industry gold':['power','water'].includes(layer)?'Served teal · Unserved orange':['landValue','police','fire','health','education'].includes(layer)?'Low red → High green':'Low green → High red';}
const heat=(value,good=false)=>`hsl(${Math.max(0,Math.min(120,(good?value:100-value)*1.2))},55%,48%)`;
export function navigationColor(t,layer,profile){
 if(EDUCATION_LAYERS[layer])return educationLayerColor(t,profile??{...EDUCATION_LAYERS[layer],hasDemand:true});
 if(layer==='waterPollution')return heat(t.waterPollution||0);
 if(['rail','subway'].includes(layer)){const station=t.type==='railTransfer'||t.type===(layer==='rail'?'trainStation':'subwayStation');if(station)return t.stationActive?'#f0cb75':'#ce855e';if(t[layer])return t[layer==='rail'?'railRiders':'subwayRiders']>0?'#a5eef5':'#859798';return t.terrain==='water'?'#32677f':'#344c42';}
 if(t.terrain==='water')return '#32677f';
 if(layer==='aura')return t.type==='residential'&&t.level?heat(t.aura||0,true):'#6a7770';
 if(layer==='density')return ['residential','commercial','industrial'].includes(t.type)?(t.level?`hsl(155,40%,${80-t.level*18}%)`:'#929b95'):'#536a65';
 if(layer==='power'||layer==='water')return (layer==='power'?powerBaseNeed(t):waterBaseNeed(t))>0?(t[layer==='power'?'powered':'watered']?'#82cfbe':'#ce855e'):'#344c42';
 const field={flammability:'flammability',traffic:'traffic',pollution:'airPollution',waterPollution:'waterPollution',crime:'crime',landValue:'landValue',police:'policeCoverage',fire:'fireCoverage',health:'healthCoverage',education:'educationCoverage',garbage:'waste'}[layer];
 if(field)return heat(layer==='traffic'?Math.max(t.traffic||0,(t.highwayTraffic||0)/4)*2.5:t[field]||0,['landValue','police','fire','health','education'].includes(layer));
 if(t.fire)return '#ff7656';if(t.rubble)return '#7b7067';if(t.highway||t.rail||t.type==='road')return '#d0d3bd';
 return {residential:'#81b96b',commercial:'#79baca',industrial:'#d9ba6b'}[t.type]||(t.type?'#beafa0':t.nature?'#355940':`hsl(105,22%,${27+(t.elevation||0)*3}%)`);
}
export function centerNavigation(renderer,rx,ry){const size=mapSize(renderer.getCity?.());const [x,y]=renderer.inverse(Math.max(0,Math.min(size-1,Math.floor(rx))),Math.max(0,Math.min(size-1,Math.floor(ry))));const p=renderer.project(x,y);renderer.pan.x+=renderer.w/2-p.x;renderer.pan.y+=renderer.h/2-p.y-renderer.unit/2;renderer.hover=null;renderer.dirty=true;return{x,y};}
// Keep the terrain and service rings stable between simulation recomputations.
// Camera framing and keyboard focus are drawn separately on every refresh.
export const navigationResolution=size=>Math.ceil(192/size)*size;
export function createNavigationSurface(createCanvas=()=>document.createElement('canvas')){
 const canvas=createCanvas(),ctx=canvas.getContext('2d');let previous=null;
 return (renderer,layer,width,height)=>{const city=renderer.getCity(),key=[city,city.tiles,city.stats,city.size,renderer.rotation,layer,width,height];
  if(previous&&key.every((value,i)=>value===previous[i]))return canvas;
  canvas.width=width;canvas.height=height;const scale=width/mapSize(city),profile=educationLayerProfile(city,layer);
  for(const t of city.tiles){const [x,y]=renderer.transform(t.x,t.y);ctx.fillStyle=navigationColor(t,layer,profile);ctx.fillRect(x*scale,y*scale,scale,scale);}
  drawNavigationPrecincts(ctx,city,layer,(x,y)=>renderer.transform(x,y),scale);previous=key;return canvas;
 };
}
export function installNavigation(renderer){
 const panel=document.createElement('details');panel.className='navigation-map';panel.open=!matchMedia('(max-width:780px)').matches;
 panel.innerHTML='<summary>Navigation map</summary><label class="sr-only" for="navigationLayer">Navigation map layer</label><select id="navigationLayer">'+Object.entries(NAV_LAYERS).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')+'</select><canvas width="192" height="192" tabindex="0" aria-label="City navigation map. Click to center the city. Arrow keys choose a location; Enter jumps there."></canvas><p class="navigation-legend">Click to jump · Outline: ground view</p>';
 renderer.canvas.parentElement.append(panel);const map=panel.querySelector('canvas'),ctx=map.getContext('2d'),select=panel.querySelector('select'),legend=panel.querySelector('p');let chosen=[24,24];const surface=createNavigationSurface();
 const draw=()=>{if(!panel.open)return;const size=mapSize(renderer.getCity()),resolution=navigationResolution(size);if(map.width!==resolution||map.height!==resolution){map.width=resolution;map.height=resolution;}const scale=map.width/size;chosen=chosen.map(v=>Math.min(size-1,v));ctx.clearRect(0,0,map.width,map.height);ctx.drawImage(surface(renderer,select.value,map.width,map.height),0,0);ctx.strokeStyle='#f5f8df';ctx.lineWidth=1.5;ctx.beginPath();for(const [i,[x,y]]of [[0,0],[renderer.w,0],[renderer.w,renderer.h],[0,renderer.h]].entries()){const a=(x-renderer.w/2-renderer.pan.x)/renderer.unit,b=(y-renderer.h/2-renderer.pan.y)*2/renderer.unit+size,rx=(a+b)/2,ry=(b-a)/2;i?ctx.lineTo(rx*scale,ry*scale):ctx.moveTo(rx*scale,ry*scale);}ctx.closePath();ctx.stroke();if(document.activeElement===map){ctx.strokeStyle='#fff';ctx.strokeRect(chosen[0]*scale,chosen[1]*scale,scale,scale);}};
 const jump=()=>{centerNavigation(renderer,...chosen);draw();};
 map.addEventListener('pointerdown',e=>{const size=mapSize(renderer.getCity());if(e.button!==0)return;e.preventDefault();const b=map.getBoundingClientRect();chosen=[Math.min(size-1,Math.max(0,Math.floor((e.clientX-b.left)/b.width*size))),Math.min(size-1,Math.max(0,Math.floor((e.clientY-b.top)/b.height*size)))];map.focus({preventScroll:true});jump();});
 panel.addEventListener('keydown',e=>{const size=mapSize(renderer.getCity());e.stopPropagation();if(e.target!==map)return;const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(d){e.preventDefault();chosen=chosen.map((v,i)=>Math.min(size-1,Math.max(0,v+d[i])));draw();}if(e.key==='Enter'||e.code==='Space'){e.preventDefault();jump();}});panel.addEventListener('keyup',e=>e.stopPropagation());
 const refreshLegend=()=>{legend.textContent=navigationLegend(select.value)+(PRECINCT_LAYERS[select.value]?' · '+PRECINCT_LEGEND+' · '+precinctCoverageNote(select.value):'')+' · Click to jump · Outline: ground view';};select.onchange=()=>{refreshLegend();draw();};renderer.setNavigationLayer=layer=>{if(!Object.hasOwn(NAV_LAYERS,layer))throw Error('Unknown navigation map layer.');select.value=layer;panel.open=true;refreshLegend();draw();};refreshLegend();panel.addEventListener('toggle',draw);map.addEventListener('focus',draw);map.addEventListener('blur',draw);renderer.drawNavigation=draw;draw();
}
