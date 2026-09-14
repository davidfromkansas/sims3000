import {formatScenarioMetric} from './scenario-calendar.js?v=restore-peace-1';
import {CUSTOM_METRICS} from './scenario-metrics.js?v=restore-peace-1';
export const STORY_VALUES={
 city:{name:'City name',read:c=>c.name},mayor:{name:'Mayor name',read:c=>c.mayorName},
 year:{name:'Calendar year',read:c=>c.startYear+Math.floor(c.month/12)},
 ...CUSTOM_METRICS
};
// Only named values are substituted. Message text never executes as code or HTML.
export function expandScenarioText(text,c){
 if(!c)return text;
 return text.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g,(token,key)=>{
  if(!Object.hasOwn(STORY_VALUES,key))return token;
  const value=STORY_VALUES[key].read(c);
  return typeof value==='number'?formatScenarioMetric(STORY_VALUES[key],value):String(value);
 });
}
