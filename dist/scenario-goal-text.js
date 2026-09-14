import {expandScenarioText} from './scenario-text.js?v=port-garbage-1';
export function validateGoalText(goal,mode,index){
 const name=goal.name??'',description=goal.description??'',revealWhenActive=goal.revealWhenActive??false;
 if(typeof name!=='string'||name.length>60||/[\x00-\x1f]/.test(name)||typeof description!=='string'||description.length>1500||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(description))throw Error('Goal names allow 60 characters; instructions allow 1,500 characters of plain text.');
 if(typeof revealWhenActive!=='boolean'||revealWhenActive&&(mode!=='sequence'||index===0))throw Error('Only later sequential goals can be revealed when their stage begins.');
 return{name:name.trim(),description:description.trim(),revealWhenActive};
}
export const goalInstructions=(goal,city)=>expandScenarioText(goal.description||'',city).slice(0,4000);
