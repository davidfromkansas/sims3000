import {compileGameScenarioPrograms} from './scenario-program-definitions.js?v=fire-readiness-1';
import {PROGRAM_LIMITS} from './scenario-programs.js?v=fire-readiness-1';
import {startProgramInvocation,advanceProgramInvocation,programInvocationFinished,pendingProgramMessage,programActionSources} from './scenario-program-history.js?v=fire-readiness-1';
import {activeProgramInvocation} from './scenario-program-invocations.js?v=fire-readiness-1';
export const hasProgramPopup=s=>s?.programInvocations?.some(run=>pendingProgramMessage(run)>=0)||false;
export function runProgramEvent(c,index){
 const s=c.scenario,e=s.definition.events[index],programs=compileGameScenarioPrograms(s.definition.programs,{size:s.definition.mapSize,objectives:s.definition.objectives});let run=activeProgramInvocation(s);
 if(!run){run=startProgramInvocation(programs,e.routine,c.month,index*12+s.events[index].runs);s.programInvocations.push(run);s.events[index]={status:'triggered',month:c.month,runs:s.events[index].runs+1};}
 const events=[];for(let steps=0;steps<=PROGRAM_LIMITS.expanded;steps++){
  const result=advanceProgramInvocation(c,programs,run);if(result)events.push(result);
  if(!result||c.emergency.active||pendingProgramMessage(run)>=0||programInvocationFinished(run))break;
 }
 if(programInvocationFinished(run))s.events[index].month=run.finishedMonth;
 return{type:'program',events};
}
export function programEnding(s){
 const run=s?.programInvocations?.find(r=>r.ended);if(!run)return null;
 const programs=compileGameScenarioPrograms(s.definition.programs,{size:s.definition.mapSize,objectives:s.definition.objectives}),source=programActionSources(run,programs).at(-1),text=run.text.at(-1);
 return{...source.e,...source.state,message:text.message,index:Math.floor(run.id/12)};
}
