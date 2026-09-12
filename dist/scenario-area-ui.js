export const areaFields=id=>`<details style="grid-column:1 / -1"><summary>Count location</summary><label>Area<select id="areaMode${id}"><option value="city">Whole city</option><option value="near">Near a location</option></select></label><div class="service-funding"><label>Center X<input id="areaX${id}" type="number" min="1" max="48" value="24"></label><label>Center Y<input id="areaY${id}" type="number" min="1" max="48" value="24"></label><label>Radius in tiles<input id="areaRadius${id}" type="number" min="0" max="67" value="5"></label></div></details>`;
export function refreshAreaFields(id,metric){
 const el=key=>document.getElementById(key+id),mode=el('areaMode');mode.disabled=!metric?.spatial;if(mode.disabled)mode.value='city';
 const update=()=>{for(const key of ['areaX','areaY','areaRadius'])el(key).disabled=mode.disabled||mode.value==='city';};mode.onchange=update;update();
}
export function readAreaFields(id){
 const el=key=>document.getElementById(key+id),mode=el('areaMode');if(mode.disabled||mode.value!=='near')return undefined;
 const number=key=>el(key).value.trim()===''?NaN:Number(el(key).value);
 return{x:number('areaX')-1,y:number('areaY')-1,radius:number('areaRadius')};
}
