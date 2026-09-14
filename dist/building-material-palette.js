import {solidPaletteHTML,mountSolidPalette} from './building-solid-palette.js?v=architecture-collection-55';
import {BUILDING_MATERIALS,materialSurfaceColor,drawMaterialDetail} from './building-materials.js?v=architecture-collection-55';
export const MATERIAL_GROUPS={all:{name:'All materials',ids:[0,1,2,3,4,5,6]},facade:{name:'Facades',ids:[0,1,2,3]},roof:{name:'Roofing',ids:[4]},landscape:{name:'Landscape',ids:[5,6]},solid:{name:'Solid paints',ids:[]}};
export function materialPaletteHTML(){return `<fieldset class="building-material-palette"><legend>Paint palette</legend><label>Material set<select id="materialSet">${Object.entries(MATERIAL_GROUPS).map(([key,g])=>`<option value="${key}">${g.name}</option>`).join('')}</select></label><input id="previewMaterial" type="hidden" value="0"><div class="material-swatches">${BUILDING_MATERIALS.map((name,i)=>`<button type="button" id="materialSwatch${i}" aria-label="${name}" aria-pressed="${i===0}"><canvas id="materialTexture${i}" width="80" height="64" aria-hidden="true"></canvas><span>${name}</span></button>`).join('')}</div>${solidPaletteHTML()}</fieldset>`;}
export function drawMaterialSwatch(ctx,material,design){
 const face={x:0,y:0,side:material>=5?4:1,from:0,to:1,points:[[0,0,0],[1,0,0],[1,1,0],[0,1,0]]};
 const polygon=(points,color)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x*80,y*64):ctx.moveTo(x*80,y*64));ctx.closePath();ctx.fillStyle=color;ctx.fill();};
 polygon(face.points,materialSurfaceColor(material,design));drawMaterialDetail(face,material,design,polygon);
}
export function mountBuildingMaterialPalette(root,{get,material,applyColors,reserved,status}){
 const $=id=>root.querySelector('#'+id),group=$('materialSet');let previous=-1,artKey=null;
 const solid=applyColors?mountSolidPalette(root,{get,material,applyColors,reserved,status}):null;
 const buttons=BUILDING_MATERIALS.map((_,i)=>$('materialSwatch'+i));
 function refresh(){solid?.refresh();const selected=Number(material.value)||0,d=get(),key=JSON.stringify([d.facade,d.windows]);if(selected!==previous&&!(selected>=7?['all','solid'].includes(group.value||'all'):MATERIAL_GROUPS[group.value||'all']?.ids.includes(selected)))group.value='all';previous=selected;const visible=MATERIAL_GROUPS[group.value]||MATERIAL_GROUPS.all;
  buttons.forEach((button,i)=>{button.hidden=!visible.ids.includes(i);button.disabled=Boolean(material.disabled);button.setAttribute('aria-pressed',String(i===selected));if(key!==artKey)drawMaterialSwatch($('materialTexture'+i).getContext('2d'),i,d);});artKey=key;solid?.refresh();
 }
 buttons.forEach((button,i)=>button.onclick=()=>{if(material.disabled)return;material.value=String(i);material.onchange?.();refresh();});group.onchange=refresh;refresh();return{refresh};
}
