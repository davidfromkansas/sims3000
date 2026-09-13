import {pendingProgramPopup} from './scenario-program-invocations.js?v=education-service-maps-1';
import {presenterMarkup} from './scenario-presenters.js?v=education-service-maps-1';
import {escapeAnnouncement} from './scenario-announcements.js?v=education-service-maps-1';
export function pendingScenarioPopup(c){const s=c.scenario;if(s?.id!=='custom')return null;const i=s.definition.events.findIndex((e,i)=>e.type==='popup'&&s.events[i].runs>0&&!s.events[i].acknowledged);return i<0?pendingProgramPopup(s):{definition:s.definition.events[i],state:s.events[i]};}
export function showPendingScenarioPopup(ui){const c=ui.city(),pending=pendingScenarioPopup(c);if(!pending)return false;const {definition,state}=pending;
 ui.dialog('Scenario message',`${presenterMarkup(definition.presenter)}<p style="white-space:pre-wrap">${escapeAnnouncement(pending.message??state.message)}</p><div class="actions"><button id="dismissScenarioPopup" class="primary">Return to city</button>${definition.showStatus?'<button id="popupScenarioStatus">Scenario status</button>':''}</div>`);
 const acknowledge=()=>{if(state.acknowledged)return;state.acknowledged=true;if(ui.city()===c)ui.save();};
 ui.element.addEventListener('close',acknowledge,{once:true});
 ui.element.querySelector('#dismissScenarioPopup').onclick=()=>{acknowledge();ui.close();};
 const status=ui.element.querySelector('#popupScenarioStatus');if(status)status.onclick=()=>{acknowledge();ui.close();ui.status();};
 return true;
}
