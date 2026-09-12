import {escapeAnnouncement} from './scenario-announcements.js?v=building-paint-1';
export function pendingScenarioPopup(c){const s=c.scenario;if(s?.id!=='custom')return null;const i=s.definition.events.findIndex((e,i)=>e.type==='popup'&&s.events[i].runs>0&&!s.events[i].acknowledged);return i<0?null:{definition:s.definition.events[i],state:s.events[i]};}
export function showPendingScenarioPopup(ui){const c=ui.city(),pending=pendingScenarioPopup(c);if(!pending)return false;const {definition,state}=pending;
 ui.dialog('Scenario message',`<p style="white-space:pre-wrap">${escapeAnnouncement(state.message)}</p><div class="actions"><button id="dismissScenarioPopup" class="primary">Return to city</button>${definition.showStatus?'<button id="popupScenarioStatus">Scenario status</button>':''}</div>`);
 const acknowledge=()=>{if(state.acknowledged)return;state.acknowledged=true;if(ui.city()===c)ui.save();};
 ui.element.addEventListener('close',acknowledge,{once:true});
 ui.element.querySelector('#dismissScenarioPopup').onclick=()=>{acknowledge();ui.close();};
 const status=ui.element.querySelector('#popupScenarioStatus');if(status)status.onclick=()=>{acknowledge();ui.close();ui.status();};
 return true;
}
