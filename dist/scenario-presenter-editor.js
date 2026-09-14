import {ADVISOR_PORTRAIT,validatePresenter,validatePortrait,presenterMarkup} from './scenario-presenters.js?v=architecture-collection-43';
import {escapeAnnouncement} from './scenario-announcements.js?v=architecture-collection-43';
export const presenterFields=i=>`<fieldset id="presenterFields${i}" class="presenter-editor"><legend>Message presenter</legend><label><input id="presenterEnabled${i}" type="checkbox">Include a presenter</label><label>Name<input id="presenterName${i}" maxlength="60" value="Planning advisor"></label><label>Role<input id="presenterRole${i}" maxlength="80" value="City planning department"></label><img id="presenterPortrait${i}" src="${ADVISOR_PORTRAIT}" width="96" height="96" alt="Presenter portrait preview"><label>Use your own portrait<input id="presenterFile${i}" type="file" accept="image/png,image/jpeg"></label><p>PNG or JPEG, up to 5 MB. Your image is cropped to a square and included in exported city files.</p><div class="actions"><button id="presenterReset${i}" type="button">Use advisor portrait</button><button id="presenterPreview${i}" type="button">Preview message</button></div><p id="presenterError${i}" role="status"></p><div id="presenterPreviewContent${i}"></div></fieldset>`;
export function installPresenterEditor(i,$=s=>document.querySelector(s)){
 let portrait='advisor',pending=false,revision=0;
 const elements=new Map(['presenterEnabled','presenterName','presenterRole','presenterPortrait','presenterFile','presenterReset','presenterPreview','presenterError','presenterPreviewContent'].map(id=>[id,$('#'+id+i)]));
 const field=id=>elements.get(id),error=message=>{field('presenterError').textContent=message;};
 const read=()=>{if(!field('presenterEnabled').checked)return null;if(pending)throw Error('Wait for the presenter portrait to finish loading.');return validatePresenter({name:field('presenterName').value,role:field('presenterRole').value,portrait});};
 field('presenterReset').onclick=()=>{revision++;pending=false;portrait='advisor';field('presenterPortrait').src=ADVISOR_PORTRAIT;field('presenterFile').value='';error('Advisor portrait selected.');};
 field('presenterFile').onchange=async()=>{
  const file=field('presenterFile').files[0];if(!file)return;
  const current=++revision;pending=true;error('Preparing portrait…');
  try{
   if(!['image/png','image/jpeg'].includes(file.type)||file.size>5*1024*1024)throw Error('Choose a PNG or JPEG no larger than 5 MB.');
   const bitmap=await createImageBitmap(file);
   try{if(current!==revision)return;const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const context=canvas.getContext('2d'),side=Math.min(bitmap.width,bitmap.height);context.drawImage(bitmap,(bitmap.width-side)/2,(bitmap.height-side)/2,side,side,0,0,256,256);const candidate=validatePortrait(canvas.toDataURL('image/png'));portrait=candidate;field('presenterPortrait').src=candidate;field('presenterEnabled').checked=true;error('Portrait ready. It will be included with this challenge.');}finally{bitmap.close();}
  }catch(e){if(current===revision)error(e.message+' Previous portrait retained.');}finally{if(current===revision)pending=false;}
 };
 field('presenterPreview').onclick=()=>{try{field('presenterPreviewContent').innerHTML=presenterMarkup(read())+`<p style="white-space:pre-wrap">${escapeAnnouncement($('#eventMessage'+i).value||'Your message will appear here.')}</p>`;error('Preview shows literal text; live values are filled when the event runs.');}catch(e){error(e.message);}};
 return read;
}
