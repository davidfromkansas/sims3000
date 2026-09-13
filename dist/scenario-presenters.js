import {escapeAnnouncement} from './scenario-announcements.js?v=navigation-data-1';
export const ADVISOR_PORTRAIT='assets/scenario-advisor.png';
export const MAX_PORTRAIT_BYTES=300000;
export function validatePortrait(value){
 if(value==='advisor')return value;
 if(typeof value!=='string'||value.length>Math.ceil(MAX_PORTRAIT_BYTES/3)*4+22||!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(value))throw Error('Choose the advisor portrait or a PNG portrait under 300 KB.');
 let raw;try{raw=atob(value.slice(22));}catch{throw Error('Invalid portrait image.');}
 const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
 if(bytes.length<33||bytes.length>MAX_PORTRAIT_BYTES||[137,80,78,71,13,10,26,10].some((v,i)=>bytes[i]!==v))throw Error('Invalid PNG portrait.');
 const view=new DataView(bytes.buffer),width=view.getUint32(16),height=view.getUint32(20);
 if(view.getUint32(8)!==13||raw.slice(12,16)!=='IHDR'||width<1||height<1||width>512||height>512)throw Error('Portraits must be no larger than 512 × 512 pixels.');
 return value;
}
export function validatePresenter(v){
 if(v===undefined||v===null)return null;
 if(typeof v!=='object'||typeof v.name!=='string'||!v.name.trim()||v.name.length>60||typeof v.role!=='string'||v.role.length>80||/[\x00-\x1f]/.test(v.name+v.role))throw Error('Give the presenter a name (1–60 characters) and a role (up to 80).');
 return{name:v.name.trim(),role:v.role.trim(),portrait:validatePortrait(v.portrait)};
}
export function presenterMarkup(value){
 const p=validatePresenter(value);if(!p)return'';
 return `<div class="scenario-presenter"><img src="${p.portrait==='advisor'?ADVISOR_PORTRAIT:p.portrait}" width="112" height="112" alt=""><div><strong>${escapeAnnouncement(p.name)}</strong>${p.role?`<p>${escapeAnnouncement(p.role)}</p>`:''}</div></div>`;
}
