import {scenarioEnding} from './scenario-events.js?v=reward-garbage-1';
import {escapeAnnouncement} from './scenario-announcements.js?v=reward-garbage-1';
// Use the captured ending receipt, not live substitutions after completion.
export function scenarioResultMessage(s){if(!s||s.status==='playing')return '';const ending=scenarioEnding(s);return ending?.message?`<section aria-label="Scenario result message"><h3>Result message</h3><p style="white-space:pre-wrap">${escapeAnnouncement(ending.message)}</p></section>`:'';}
