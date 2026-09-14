import {showCustomBuildingEditor} from './custom-building-editor-ui.js?v=architecture-collection-39';
import {buildingSetCatalog,applyBuildingSet,copyBuildingSet,buildingSetChanges} from './building-sets.js?v=architecture-collection-39';
import {showBuildingReplacement} from './building-replacement-ui.js?v=architecture-collection-39';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function showBuildingLibrary({city:target,renderer,dialog,apply,importSet,backup,close},filters={group:'all',width:0,height:0},draft=null){
 const city=draft??{...target,...copyBuildingSet(target)};
 const quantity=(n,label)=>`${n} ${label}${n===1?'':'s'}`;
 const open=()=>showBuildingLibrary({city:target,renderer,dialog,apply,importSet,backup,close},filters,city);
 const draw=()=>{
  const changes=buildingSetChanges(target,city);document.querySelector('#libraryApply').disabled=JSON.stringify(copyBuildingSet(target))===JSON.stringify(copyBuildingSet(city));document.querySelector('#libraryDraftStatus').textContent=`${changes.length} pending appearance changes. Apply building set saves them; Cancel keeps your current city artwork.`;
  const allRows=buildingSetCatalog(city,{footprint:{width:0,height:0}});
  const rows=allRows.filter(r=>(filters.group==='all'||r.group===filters.group)&&(!filters.width||r.footprint.width===filters.width)&&(!filters.height||r.footprint.height===filters.height));
  document.querySelector('#buildingLibraryCount').textContent=`${rows.length} of ${quantity(allRows.length,'building slot')} · ${quantity(rows.reduce((n,r)=>n+r.count,0),'current building')} · ${quantity(rows.filter(r=>r.changed).length,'customized slot')}`;
  document.querySelector('#buildingLibraryRows').innerHTML=rows.map(r=>`<tr><td><button data-library-slot="${r.key}">${escape(r.name)}</button></td><td>${r.footprint.width} × ${r.footprint.height}</td><td>${escape(r.current)}${r.changed?' · '+(r.custom?'Custom model':'Replaced'):''}</td><td>${r.count}</td></tr>`).join('');
  document.querySelectorAll('[data-library-slot]').forEach(button=>button.onclick=()=>showBuildingReplacement({city,renderer,dialog,apply:()=>{},back:open,draftMode:true},button.dataset.librarySlot));
 };
 dialog('City building styles',`<p>Choose the appearance of current and future buildings. Select a style to preview replacements, apply one throughout your city, or restore its original artwork. Changes remain a draft until you apply the building set.</p><div class="actions"><label>Zone family<select id="libraryGroup"><option value="all">All zones</option><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="industrial">Industrial</option></select></label><label>Width<select id="libraryWidth"><option value="0">All widths</option>${[1,2,3,4,5].map(n=>`<option value="${n}">${n} tile${n===1?'':'s'}</option>`).join('')}</select></label><label>Depth<select id="libraryHeight"><option value="0">All depths</option>${[1,2,3,4,5].map(n=>`<option value="${n}">${n} tile${n===1?'':'s'}</option>`).join('')}</select></label></div><p id="buildingLibraryCount" role="status"></p><div style="overflow-x:auto;max-height:45vh"><table><thead><tr><th>Original style</th><th>Footprint</th><th>Current appearance</th><th>Buildings</th></tr></thead><tbody id="buildingLibraryRows"></tbody></table></div><p id="libraryDraftStatus" role="status"></p><div class="actions"><button id="libraryApply" class="primary">Apply building set</button><button id="libraryEditCustom">Edit custom building list</button><button id="libraryImport">Import building set</button><button id="libraryClear" ${Object.keys(city.buildingReplacements??{}).length+Object.keys(city.buildingDesigns??{}).length?'':'disabled'}>Restore all original artwork</button><button id="libraryClose">Cancel</button></div><p class="fine">This library currently covers residential, commercial and non-farm industrial buildings up to 5 × 5 tiles. Natural growth creates 1 × 1, 2 × 2 and 3 × 3 buildings; other footprints support imported cities. Reward and business-opportunity replacements remain unfinished.</p>`);
 for(const [id,key] of [['libraryGroup','group'],['libraryWidth','width'],['libraryHeight','height']]){const el=document.getElementById(id);el.value=String(filters[key]);el.onchange=()=>{filters[key]=key==='group'?el.value:Number(el.value);draw();};}
 document.querySelector('#libraryEditCustom').onclick=()=>showCustomBuildingEditor({dialog,back:open});
 document.querySelector('#libraryImport').onclick=()=>importSet(city,open);
 document.querySelector('#libraryApply').onclick=()=>{applyBuildingSet(target,city);apply();close();};
 document.querySelector('#libraryClose').onclick=close;
 document.querySelector('#libraryClear').onclick=()=>{
  dialog('Restore all original artwork?',`<p>Remove all building replacements and custom models from this city, across every zone family and footprint. Current and future buildings return to their original styles.</p><p>Export a city backup first if you want to keep this building set.</p><div class="actions"><button id="libraryBackup">Export city backup</button><button id="libraryConfirmClear">Restore all original artwork</button><button id="libraryCancelClear">Cancel</button></div>`);
  document.querySelector('#libraryBackup').onclick=backup;document.querySelector('#libraryCancelClear').onclick=open;document.querySelector('#libraryConfirmClear').onclick=()=>{applyBuildingSet(city,{});open();};
 };
 draw();
}
