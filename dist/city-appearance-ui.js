import {LANDSCAPE_STYLES,TREE_CHOICES,freshAppearance,validateAppearance,applyAppearance,landscapePalette,landscapeGround} from './city-appearance.js?v=city-landscape-styles-1';
import {treeCanvas} from './tree-models.js?v=city-landscape-styles-1';
export function showCityAppearance({city,renderer,dialog,apply,close}){
 const selected=validateAppearance(city.appearance||freshAppearance());
 dialog('Landscape & trees',`<p>Choose the landscape and grove artwork for this city. Your choices stay with the city when you save or export it.</p><div class="actions"><label>Landscape<select id="appearanceLandscape">${Object.entries(LANDSCAPE_STYLES).map(([key,name])=>`<option value="${key}" ${key===selected.landscape?'selected':''}>${name}</option>`).join('')}</select></label><label>Trees<select id="appearanceTrees">${Object.entries(TREE_CHOICES).map(([key,name])=>`<option value="${key}" ${key===selected.trees?'selected':''}>${name}</option>`).join('')}</select></label></div><canvas id="appearancePreview" width="540" height="270" style="width:100%;max-width:540px;height:auto" aria-label="Preview of landscape and grove artwork"></canvas><p>These are visual styles: terrain, tree cover, buildings and water supply keep their existing behavior. Broadleaf, evergreen and palm groves each turn with the camera and reflect the planting density.</p><p id="appearanceStatus" role="status">Preview only · apply when ready.</p><div class="actions"><button id="appearanceRotate">Rotate preview</button><button id="appearanceDefault">Preview original appearance</button><button id="appearanceApply" class="primary">Apply to city</button><button id="appearanceClose">Close</button></div>`);
 const $=id=>document.getElementById(id),canvas=$('appearancePreview'),ctx=canvas.getContext('2d');let rotation=renderer?.rotation||0;
 const read=()=>validateAppearance({landscape:$('appearanceLandscape').value,trees:$('appearanceTrees').value});
 function draw(){const draft=read(),palette=landscapePalette(draft.landscape);ctx.clearRect(0,0,540,270);ctx.fillStyle='#213d40';ctx.fillRect(0,0,540,270);
  for(let y=0;y<3;y++)for(let x=0;x<5;x++){const px=270+(x-y)*44-42,py=105+(x+y)*22;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+44,py+22);ctx.lineTo(px,py+44);ctx.lineTo(px-44,py+22);ctx.closePath();ctx.fillStyle=x===4?'rgb('+palette.fresh.join(',')+')':landscapeGround({x,y},draft.landscape);ctx.fill();}
  for(const [x,y,level]of [[0,0,1],[2,0,2],[1,2,3]]){const px=270+(x-y)*44-42,py=105+(x+y)*22+22;if(draft.trees!=='classic'){ctx.drawImage(treeCanvas(draft.trees,level,rotation),px-49,py-61.25,98,98);}else{const sprite=renderer?.sprites?.[41+level];if(sprite){const width=80,height=width*sprite.h/sprite.w;ctx.drawImage(sprite.atlas,sprite.x,sprite.y,sprite.w,sprite.h,px-width/2,py-height+10,width,height);}}}
  $('appearanceRotate').textContent='Rotate preview · '+['North','East','South','West'][rotation];
 }
 const preview=()=>{try{draw();$('appearanceStatus').textContent='Preview only · apply when ready.';}catch(e){$('appearanceStatus').textContent=e.message;}};
 $('appearanceLandscape').onchange=preview;$('appearanceTrees').onchange=preview;
 $('appearanceRotate').onclick=()=>{rotation=(rotation+1)%4;draw();};
 $('appearanceDefault').onclick=()=>{$('appearanceLandscape').value='classic';$('appearanceTrees').value='classic';preview();};
 $('appearanceApply').onclick=()=>{try{applyAppearance(city,read());apply();$('appearanceStatus').textContent='Appearance applied and saved with this city.';}catch(e){$('appearanceStatus').textContent=e.message;}};
 $('appearanceClose').onclick=close;draw();
}
