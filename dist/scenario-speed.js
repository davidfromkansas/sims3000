export function validateScenarioSpeed(v){if(v===undefined)return{initial:1,locked:false};if(!v||typeof v!=='object'||Array.isArray(v)||![1,3,8].includes(v.initial)||typeof v.locked!=='boolean')throw Error('Choose a starting speed of 1×, 3× or 8× and whether players may change it.');return{initial:v.initial,locked:v.locked};}
export function scenarioSpeed(c){const s=c.scenario;return s?.id==='custom'&&s.status==='playing'?s.definition.speed:null;}
export function allowedSpeed(c,n){const policy=scenarioSpeed(c);return [0,1,3,8].includes(n)&&(!policy?.locked||n===0||n===policy.initial);}
export const resumeScenarioSpeed=c=>scenarioSpeed(c)?.initial??1;
export function scenarioSpeedReport(c){const policy=scenarioSpeed(c);return policy?`<p>Starting pace: ${policy.initial}×. ${policy.locked?'The author has locked the running pace. You can still pause for building or reading.':'You can change the running pace at any time.'} Loaded cities stay paused until you resume.</p>`:'';}
