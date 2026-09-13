import {dialogTextTarget} from './scenario-dialog-text.js?v=available-job-targets-1';
import {tornadoSettingsLabel} from './tornado-settings.js?v=available-job-targets-1';
import {neighborDealLabel,neighborDealResultText} from './scenario-neighbor-deals.js?v=available-job-targets-1';
import {compileGameScenarioPrograms} from './scenario-program-definitions.js?v=available-job-targets-1';
import {programActionSources,pendingProgramMessage,programInvocationFinished} from './scenario-program-history.js?v=available-job-targets-1';
import {SCENARIO_EVENTS,eventConditionLabel} from './scenario-events.js?v=available-job-targets-1';
import {startScenarioProgram,nextScenarioProgramAction} from './scenario-programs.js?v=available-job-targets-1';
import {escapeAnnouncement} from './scenario-announcements.js?v=available-job-targets-1';
const escape=escapeAnnouncement;
export function scenarioProgramReport(c){
 const s=c.scenario;if(s?.id!=='custom'||!s.definition.programs?.length)return'';
 const programs=compileGameScenarioPrograms(s.definition.programs,{size:s.definition.mapSize,objectives:s.definition.objectives}),runs=s.programInvocations||[];
 if(!runs.length)return'<h3>Routine history</h3><p>No routine has started yet.</p>';
 const rows=runs.slice(-8).map(run=>{
  const name=programs[run.cursor.entry].name,sources=programActionSources(run,programs),pending=pendingProgramMessage(run);
  const status=run.ended?'Ended the scenario':programInvocationFinished(run)?'Completed':s.status!=='playing'?'Stopped when the scenario ended':pending>=0?'Waiting for message acknowledgement':c.emergency.active?'Waiting for emergency response':'Ready to continue next month';
  const last=run.cursor.stack.at(-1),location=last&&!programInvocationFinished(run)?`<p>Current routine: ${escape(programs[last.routine].name)}.</p>`:'';
  const receipts=sources.slice(-24).map(({e,state},offset)=>{
   const index=Math.max(0,sources.length-24)+offset,text=run.text.find(t=>t.receipt===index)?.message;
   let detail='';if(e.type==='variable')detail=` · ${escape(s.definition.variables[e.variable].name)}: ${state.variableBefore.toLocaleString()} → ${state.variableAfter.toLocaleString()}`;
   if(['addGoal','markGoal'].includes(e.type))detail=` · Goal ${e.goal+1}${e.type==='markGoal'?' · '+e.goalStatus:''}`;
   if(['dialogText','resultText'].includes(e.type))detail+=' · '+dialogTextTarget(e);
   if(e.type==='tornado')detail+=' · '+tornadoSettingsLabel(e.tornado);
   if(e.type==='earthquake')detail+=' · Magnitude '+e.magnitude;
   if(e.type==='neighborDeal')detail=' · '+escape(neighborDealLabel(e))+' · '+escape(neighborDealResultText(state.dealResult));
   if(e.type==='ending')detail=' · '+(e.outcome==='won'?'Victory':'Loss');
   const result=state.status==='skipped'?(state.calculationError?'Calculation failed; variable unchanged':'Skipped: no suitable target'):e.type==='popup'?(state.acknowledged?'Acknowledged':'Unread'):'Executed';
   return`<li>Month ${state.month-s.startMonth}: ${SCENARIO_EVENTS[e.type]}${detail} · ${result}${text?`<p style="white-space:pre-wrap">${escape(text)}</p>`:''}</li>`;
  }).join('');
  // Reconstruct the condition labels from the saved path, without querying
  // today's city or executing any past action.
  const cursor=startScenarioProgram(programs,run.cursor.entry),decisions=[];let branch=0;
  const choose=condition=>{const met=run.branches[branch++];decisions.push(`${eventConditionLabel(condition)} — ${met?'met':'not met'}`);return met;};
  for(let i=0;i<run.receipts.length;i++)nextScenarioProgramAction(programs,cursor,choose);
  if(run.cursor.done)nextScenarioProgramAction(programs,cursor,choose);
  return`<details><summary>${escape(name)} · Call ${run.id%12+1} · ${status} · ${run.receipts.length} actions</summary><p>Started in month ${run.startedMonth-s.startMonth}${run.finishedMonth!==null?`; finished in month ${run.finishedMonth-s.startMonth}`:''}.</p>${location}${decisions.length?`<p>Recorded branch choices${decisions.length>12?' (latest 12)':''}:</p><ul>${decisions.slice(-12).map(d=>`<li>${escape(d)}</li>`).join('')}</ul>`:''}${sources.length>24?'<p>Showing the latest 24 actions in this call.</p>':''}<ol start="${Math.max(1,sources.length-23)}">${receipts}</ol></details>`;
 }).join('');
 return`<h3>Routine history</h3><p>${runs.length} calls started. ${runs.length>8?'Showing the latest eight calls. ':''}Messages retain their captured values. Repeated calls wait their interval after the previous call finishes.</p>${rows}`;
}
