import {LANDMARKS} from './landmarks.js?v=east-asian-landmarks-1';
import {MODELED_LANDMARKS,drawLandmarkPreview} from './landmark-models.js?v=east-asian-landmarks-1';
const directions=['North','East','South','West'];
export function showLandmarks({city,dialog,close,setTool}){
 const c=city(),placedTypes=new Set(c.tiles.map(t=>t.type));
 dialog('Landmarks · a signature skyline',`<p>Choose a landmark for your city. Each is available immediately, once per city, and can be rebuilt after demolition or destruction.</p><div class="landmark-filters"><label>Find a landmark<input id="landmarkSearch" type="search" maxlength="100" placeholder="Name or location"></label><label>Show<select id="landmarkAvailability"><option value="all">All landmarks</option><option value="available">Available to place</option><option value="placed">Already placed</option></select></label><button id="clearLandmarkFilters">Clear filters</button></div><p id="landmarkCount" role="status"></p><p id="landmarkEmpty" hidden>No landmarks match these filters.</p><div class="landmark-gallery">${Object.entries(LANDMARKS).map(([key,d])=>{
  const placed=placedTypes.has(key),modeled=MODELED_LANDMARKS.has(key);
  const preview=modeled?`<canvas id="landmarkPreview-${key}" width="420" height="340" role="img" aria-label="${d.name}, North view" style="display:block;width:100%;height:170px;object-fit:contain"></canvas><div class="landmark-preview-controls"><button data-landmark-turn="${key}" data-step="-1" aria-label="Rotate ${d.name} preview counterclockwise">↶</button><span id="landmarkDirection-${key}" aria-live="polite">North view</span><button data-landmark-turn="${key}" data-step="1" aria-label="Rotate ${d.name} preview clockwise">↷</button></div>`:`<img src="./assets/${d.asset}" alt="${d.name} gallery illustration" style="width:100%;height:170px;object-fit:contain">`;
  return `<article class="milestone" data-landmark-card="${key}">${preview}<small>${d.place}</small><h3>${d.name}</h3><p>${d.size} × ${d.size} clear, level land · Free placement · No monthly upkeep.</p><button data-landmark="${key}" ${placed?'disabled':''}>${placed?'Already placed':'Place '+d.name}</button></article>`;
 }).join('')}</div><p>Rotating a preview does not change your map view. Modeled landmarks turn with the map after placement.</p><p>Landmarks give your city a distinctive skyline. Alien craft prefer standing landmarks when selecting targets. They add no jobs or direct income in this reconstruction.</p><p class="fine">The full original catalog remains unfinished; footprints and simplified artwork include reconstruction choices.</p>`);
 const search=document.getElementById('landmarkSearch'),availability=document.getElementById('landmarkAvailability'),clear=document.getElementById('clearLandmarkFilters'),count=document.getElementById('landmarkCount'),empty=document.getElementById('landmarkEmpty'),cards=[...document.querySelectorAll('[data-landmark-card]')];
 const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function filter(){const words=normalize(search.value.trim()).split(/\s+/).filter(Boolean);let visible=0;
  for(const card of cards){const type=card.dataset.landmarkCard,d=LANDMARKS[type],text=normalize(d.name+' '+d.place),placed=placedTypes.has(type);card.hidden=!words.every(word=>text.includes(word))||(availability.value==='placed'&&!placed)||(availability.value==='available'&&placed);if(!card.hidden)visible++;}
  count.textContent=`${visible} of ${cards.length} landmarks · ${Object.keys(LANDMARKS).filter(type=>placedTypes.has(type)).length} already placed`;
  empty.hidden=visible!==0;clear.disabled=!search.value&&availability.value==='all';
 }
 search.oninput=filter;availability.onchange=filter;clear.onclick=()=>{search.value='';availability.value='all';filter();search.focus();};filter();
 const rotations={};
 const draw=key=>{const canvas=document.getElementById('landmarkPreview-'+key);drawLandmarkPreview(canvas.getContext('2d'),key,rotations[key],canvas.width,canvas.height);canvas.setAttribute('aria-label',LANDMARKS[key].name+', '+directions[rotations[key]]+' view');document.getElementById('landmarkDirection-'+key).textContent=directions[rotations[key]]+' view';};
 for(const key of MODELED_LANDMARKS){rotations[key]=0;draw(key);}
 document.querySelectorAll('[data-landmark-turn]').forEach(button=>button.onclick=()=>{const key=button.dataset.landmarkTurn;rotations[key]=(rotations[key]+Number(button.dataset.step)+4)%4;draw(key);});
 document.querySelectorAll('[data-landmark]').forEach(button=>button.onclick=()=>{if(button.disabled)return;setTool(button.dataset.landmark);close();});
}
