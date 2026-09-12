import {POWER_PLANTS} from './power.js?v=building-blocks-1';
import {WATER_STRUCTURES,WASTE_STRUCTURES} from './utilities.js?v=building-blocks-1';
// Airport dates conflict in the manual: p.46 says 1930; p.99 says 1915.
// Use the transportation chapter's 1915 date consistently.
export const TECHNOLOGY={...Object.fromEntries(Object.entries({...POWER_PLANTS,...WATER_STRUCTURES,...WASTE_STRUCTURES}).map(([key,value])=>[key,{name:value.name,year:value.year}])),subway:{name:'Subway rail',year:1912},subwayStation:{name:'Subway station',year:1912},railTransfer:{name:'Rail–subway connection',year:1912},airport:{name:'Airport zone',year:1915},busStop:{name:'Bus stop',year:1920},highway:{name:'Highway',year:1940},ramp:{name:'On-ramp',year:1940}};
export const cityYear=c=>(c.startYear||1950)+Math.floor(c.month/12);
export const available=(c,tool)=>!TECHNOLOGY[tool]||cityYear(c)>=TECHNOLOGY[tool].year;
export const newlyAvailable=c=>c.month>0&&c.month%12===0?Object.entries(TECHNOLOGY).filter(([,t])=>t.year===cityYear(c)).map(([key])=>key):[];
export function showTechnology({city,dialog,close,setTool}){
 const c=city(),year=cityYear(c),entries=Object.entries(TECHNOLOGY).sort((a,b)=>a[1].year-b[1].year||a[1].name.localeCompare(b[1].name));
 dialog('Technology timeline',`<p>Your city is in <strong>${year}</strong>. New technology becomes available in January of its listed year. Existing infrastructure stays in service when an older city file is loaded.</p><div class="actions">${entries.map(([key,t])=>`<button data-technology="${key}" ${available(c,key)?'':'disabled'}>${t.year} · ${t.name}${available(c,key)?'':' · Not yet available'}</button>`).join('')}</div><p class="fine">The manual gives both 1915 and 1930 for airports. This city uses 1915, from the transportation chapter. Subway transfers unlock with subway service; on-ramps unlock with highways.</p>`);
 for(const b of document.querySelectorAll('[data-technology]'))b.onclick=()=>{setTool(b.dataset.technology);close();};
}
