import {CUSTOM_METRICS} from './scenario-metrics.js?v=roadless-paradise-1';
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
  return typeof value==='number'?value.toLocaleString(undefined,{maximumFractionDigits:1,useGrouping:key!=='year'}):String(value);
 });
}
