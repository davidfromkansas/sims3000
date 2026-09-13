import {compileGameScenarioPrograms} from './scenario-program-definitions.js?v=building-shape-tools-1';
import {validateProgramInvocation,programActionSources,programInvocationFinished,pendingProgramMessage} from './scenario-program-history.js?v=building-shape-tools-1';
// The enclosing scenario validator must validate event definitions first. Event
// runs count started occurrences; active invocations separately block victory.
export function validateProgramInvocations(value,definition,eventStates,startMonth,month){
 const entries=definition.events.map((event,index)=>({event,index})).filter(({event})=>event.type==='program');
 if(!entries.length){if(value!==undefined&&(!Array.isArray(value)||value.length))throw Error('Unexpected routine invocations.');return{invocations:[],sources:[]};}
 if(!Array.isArray(value)||value.length>48)throw Error('Missing routine invocation history.');
 const programs=compileGameScenarioPrograms(definition.programs,{size:definition.mapSize,objectives:definition.objectives}),ids=new Set(),byEvent=new Map(),invocations=[];let previous=null;
 for(const raw of value){
  const run=validateProgramInvocation(raw,programs,{startMonth,month:Math.min(month,startMonth+definition.months)}),eventIndex=Math.floor(run.id/12),occurrence=run.id%12,event=definition.events[eventIndex];
  if(ids.has(run.id)||event?.type!=='program'||run.cursor.entry!==event.routine||occurrence>=event.repeatCount)throw Error('Routine invocation does not match its scheduled entry.');
  if(previous&&(!programInvocationFinished(previous)||previous.ended||run.startedMonth<previous.finishedMonth))throw Error('Routine invocations cannot overlap or follow an ending.');
  const history=byEvent.get(eventIndex)||[];if(occurrence!==history.length)throw Error('Missing or reordered routine occurrence.');
  const prior=history.at(-1),due=prior?prior.finishedMonth+event.repeatEvery:startMonth+event.month;if(run.startedMonth<due)throw Error('Routine occurrence began before its scheduled month.');
  ids.add(run.id);history.push(run);byEvent.set(eventIndex,history);invocations.push(run);previous=run;
 }
 for(const {event,index}of entries){const history=byEvent.get(index)||[],state=eventStates?.[index],last=history.at(-1);if(!state||state.runs!==history.length||history.length>event.repeatCount||state.status!==(last?'triggered':'pending')||state.month!==(last?last.finishedMonth??last.startedMonth:null))throw Error('Routine event progress does not match invocation history.');}
 return{invocations,sources:invocations.flatMap(run=>programActionSources(run,programs))};
}
export function activeProgramInvocation(scenario){return scenario?.programInvocations?.find(run=>!programInvocationFinished(run))||null;}
export function pendingProgramPopup(scenario){
 const run=scenario?.programInvocations?.find(run=>pendingProgramMessage(run)>=0);if(!run)return null;
 const index=pendingProgramMessage(run),programs=compileGameScenarioPrograms(scenario.definition.programs,{size:scenario.definition.mapSize,objectives:scenario.definition.objectives}),definition=programActionSources(run,programs)[index].e,text=run.text.find(t=>t.receipt===index);
 // The UI acknowledgement mutates the original receipt, just as legacy popup
 // acknowledgement mutates its event state. Text remains bounded separately.
 return{definition,state:run.receipts[index],message:text.message,run,index};
}
