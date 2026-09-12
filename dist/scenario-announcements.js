import {expandScenarioText} from './scenario-text.js?v=expanding-farms-1';
export function validateAnnouncement(value){
 if(typeof value!=='string'||!value.trim()||value.length>500||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value))throw Error('Announcements need 1–500 characters of plain text.');
 return value.trim();
}
export const announcementText=(template,c)=>expandScenarioText(template,c).slice(0,4000);
export const escapeAnnouncement=text=>text.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
