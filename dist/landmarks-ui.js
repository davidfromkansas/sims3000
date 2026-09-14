import {LANDMARKS} from './landmarks.js?v=architecture-collection-22';
import {MODELED_LANDMARKS,drawLandmarkPreview} from './landmark-models.js?v=architecture-collection-22';
const directions=['North','East','South','West'];
export function showLandmarks({city,dialog,close,setTool}){
 const c=city();
 dialog('Landmarks · a signature skyline',`<p>Choose a landmark for your city. Each is available immediately, once per city, and can be rebuilt after demolition or destruction.</p><div class="landmark-gallery">${Object.entries(LANDMARKS).map(([key,d])=>{
  const placed=c.tiles.some(t=>t.type===key),modeled=MODELED_LANDMARKS.has(key);
  const preview=modeled?`<canvas id="landmarkPreview-${key}" width="420" height="340" role="img" aria-label="${d.name}, North view" style="display:block;width:100%;height:170px;object-fit:contain"></canvas><div class="landmark-preview-controls"><button data-landmark-turn="${key}" data-step="-1" aria-label="Rotate ${d.name} preview counterclockwise">↶</button><span id="landmarkDirection-${key}" aria-live="polite">North view</span><button data-landmark-turn="${key}" data-step="1" aria-label="Rotate ${d.name} preview clockwise">↷</button></div>`:`<img src="./assets/${d.asset}" alt="${d.name} gallery illustration" style="width:100%;height:170px;object-fit:contain">`;
  return `<article class="milestone">${preview}<small>${d.place}</small><h3>${d.name}</h3><p>${d.size} × ${d.size} clear, level land · Free placement · No monthly upkeep.</p><button data-landmark="${key}" ${placed?'disabled':''}>${placed?'Already placed':'Place '+d.name}</button></article>`;
 }).join('')}</div><p>Rotating a preview does not change your map view. Modeled landmarks turn with the map after placement.</p><p>Landmarks give your city a distinctive skyline. Alien craft prefer standing landmarks when selecting targets. They add no jobs or direct income in this reconstruction.</p><p class="fine">The full original catalog remains unfinished; footprints and simplified artwork include reconstruction choices.</p>`);
 const rotations={};
 const draw=key=>{const canvas=document.getElementById('landmarkPreview-'+key);drawLandmarkPreview(canvas.getContext('2d'),key,rotations[key],canvas.width,canvas.height);canvas.setAttribute('aria-label',LANDMARKS[key].name+', '+directions[rotations[key]]+' view');document.getElementById('landmarkDirection-'+key).textContent=directions[rotations[key]]+' view';};
 for(const key of MODELED_LANDMARKS){rotations[key]=0;draw(key);}
 document.querySelectorAll('[data-landmark-turn]').forEach(button=>button.onclick=()=>{const key=button.dataset.landmarkTurn;rotations[key]=(rotations[key]+Number(button.dataset.step)+4)%4;draw(key);});
 document.querySelectorAll('[data-landmark]').forEach(button=>button.onclick=()=>{if(button.disabled)return;setTool(button.dataset.landmark);close();});
}
