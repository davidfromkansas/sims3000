import {DECAL_NAMES,decalPolygonsOnFace,wallWorldPoint,wallCoordinates} from './building-decals.js?v=east-asian-landmarks-1';
export const DETAIL_GROUPS={all:{name:'All details',ids:[1,2,3,4,5]},openings:{name:'Windows and doors',ids:[1,2,4]},trim:{name:'Trim and ventilation',ids:[3,5]}};
export function detailPaletteHTML(){return `<div class="building-detail-palette"><label>Detail set<select id="detailSet">${Object.entries(DETAIL_GROUPS).map(([key,g])=>`<option value="${key}">${g.name}</option>`).join('')}</select></label><input id="decalKind" type="hidden" value="1"><div class="material-swatches">${DECAL_NAMES.slice(1).map((name,i)=>`<button type="button" id="detailSwatch${i+1}" aria-pressed="${i===0}"><span id="detailTexture${i+1}" aria-hidden="true"></span><span id="detailName${i+1}">${name}</span></button>`).join('')}</div></div>`;}
export function detailSwatchSVG(kind,design){
 const side=2,plane=5,width=2,height=.28,face={side,points:[[0,0],[width,0],[width,height],[0,height]].map(p=>wallWorldPoint(side,plane,p))},detail={kind,side,plane,u:0,z:0,width,height};
 const color=value=>/^#[0-9a-f]{6}$/i.test(value)?value:'#888888';
 const polygons=decalPolygonsOnFace(face,[detail],design).map(p=>`<polygon fill="${color(p.color)}" points="${p.points.map(point=>{const [u,z]=wallCoordinates(side,point);return `${(8+u/width*64).toFixed(3)},${(56-z/height*48).toFixed(3)}`;}).join(' ')}"/>`).join('');
 return `<svg viewBox="0 0 80 64" width="80" height="64" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="64" fill="${color(design.facade)}"/>${polygons}</svg>`;
}
export function mountBuildingDetailPalette(root,{get,kind,surface=()=>'wall'}){
 const $=id=>root.querySelector('#'+id),group=$('detailSet'),buttons=DECAL_NAMES.slice(1).map((_,i)=>$('detailSwatch'+(i+1)));let previous=1,artKey=null;
 const allowed=id=>surface()!=='roof'||[1,3].includes(id);
 function refresh(){if(!allowed(Number(kind.value)))kind.value='1';const selected=Number(kind.value)||1,d=get(),key=JSON.stringify([d.facade,d.windows,d.accent]);if(selected!==previous&&!(DETAIL_GROUPS[group.value]||DETAIL_GROUPS.all).ids.includes(selected))group.value='all';previous=selected;const visible=DETAIL_GROUPS[group.value]||DETAIL_GROUPS.all;
 buttons.forEach((button,i)=>{const id=i+1;button.hidden=!visible.ids.includes(id)||!allowed(id);button.disabled=Boolean(kind.disabled)||!allowed(id);$('detailName'+id).textContent=surface()==='roof'&&id===1?'Skylight':DECAL_NAMES[id];button.setAttribute('aria-pressed',String(id===selected));if(key!==artKey)$('detailTexture'+id).innerHTML=detailSwatchSVG(id,d);});artKey=key;
 }
 buttons.forEach((button,i)=>button.onclick=()=>{if(kind.disabled||!allowed(i+1))return;kind.value=String(i+1);kind.onchange?.();refresh();});group.onchange=refresh;refresh();return{refresh};
}
