import {PROGRAM_LIMITS,startScenarioProgram,nextScenarioProgramAction,validateScenarioProgramCursor} from './scenario-programs.js?v=recovery-sites-1';
import {executeScenarioAction,eventConditionMet,validateEventProgress} from './scenario-events.js?v=recovery-sites-1';
export const PROGRAM_TEXT_HISTORY=32;
export function startProgramInvocation(programs,entry,month,id){if(!Number.isInteger(month)||month<1||!Number.isInteger(id)||id<0||id>=48)throw Error('Invalid routine invocation.');return{id,startedMonth:month,cursor:startScenarioProgram(programs,entry),branches:[],receipts:[],text:[],ended:false,finishedMonth:null};}
export const pendingProgramMessage=run=>run.receipts.findIndex(r=>r.acknowledged===false);
export const programInvocationFinished=run=>run.ended||run.cursor.done;
// One action per call lets the game host present a popup or disaster before
// deciding whether execution can continue. Receipt and cursor advance together.
export function advanceProgramInvocation(c,programs,run){
 if(c.scenario?.status!=='playing'||c.emergency.active||programInvocationFinished(run)||pendingProgramMessage(run)>=0)return null;
 const action=nextScenarioProgramAction(programs,run.cursor,condition=>{const value=!!eventConditionMet(c,condition);run.branches.push(value);return value;});
 if(!action){if(run.cursor.done)run.finishedMonth=c.month;return null;}
 const result=executeScenarioAction(c,action,run.id*PROGRAM_LIMITS.expanded+run.cursor.steps),{message,...progress}=result.progress,receipt={...progress,steps:run.cursor.steps};run.receipts.push(receipt);
 if(message!==undefined){run.text.push({receipt:run.receipts.length-1,message});if(run.text.length>PROGRAM_TEXT_HISTORY)run.text.shift();}
 if(action.type==='ending'){run.ended=true;run.finishedMonth=c.month;}
 return{...action,...result.progress,...result.effects,programInvocation:run.id,programReceipt:run.receipts.length-1};
}
export function acknowledgeProgramMessage(run,index){if(index!==pendingProgramMessage(run)||index<0)return false;run.receipts[index].acknowledged=true;return true;}
// Replay only control flow using recorded choices. No game action or old
// condition is re-executed; imports cannot inject actions outside the program.
export function validateProgramInvocation(value,programs,{startMonth,month}){
 if(!value||!Number.isInteger(value.id)||value.id<0||value.id>=48||!Number.isInteger(value.startedMonth)||value.startedMonth<=startMonth||value.startedMonth>month||!Array.isArray(value.branches)||value.branches.length>PROGRAM_LIMITS.expanded||!value.branches.every(v=>typeof v==='boolean')||!Array.isArray(value.receipts)||value.receipts.length>PROGRAM_LIMITS.expanded||!Array.isArray(value.text)||value.text.length>PROGRAM_TEXT_HISTORY||typeof value.ended!=='boolean')throw Error('Invalid routine execution history.');
 const cursor=validateScenarioProgramCursor(value.cursor,programs),replay=startScenarioProgram(programs,cursor.entry),actions=[],receipts=[];let branch=0,lastMonth=value.startedMonth,ended=false;
 const choose=()=>{if(branch>=value.branches.length)throw Error('Missing routine branch choice.');return value.branches[branch++];};
 for(const [index,receipt]of value.receipts.entries()){
  if(ended||receipts.at(-1)?.acknowledged===false)throw Error('Actions cannot follow a pending message or ending.');
  const action=nextScenarioProgramAction(programs,replay,choose);if(!action||!receipt||receipt.steps!==replay.steps||!Number.isInteger(receipt.month)||receipt.month<lastMonth||receipt.month>month)throw Error('Invalid routine action receipt.');
  lastMonth=receipt.month;const textAction=['announcement','popup','ending','dialogText','resultText'].includes(action.type),message=value.text.find(t=>t?.receipt===index)?.message;
  // Older acknowledged text can be evicted. Progress still retains action
  // identity, date and result, including permanent goal-change provenance.
  const progress=validateEventProgress([{...receipt,...(textAction?{message:message??'[Earlier message]'}:{}),runs:1}],{events:[{...action,month:1,repeatCount:1,repeatEvery:0}]},value.startedMonth-1,month)[0];
  const {runs,message:ignored,...compact}=progress;receipts.push({...compact,steps:receipt.steps});actions.push(action);ended=action.type==='ending';
 }
 if(cursor.done){if(ended||nextScenarioProgramAction(programs,replay,choose)!==null)throw Error('Routine ended before its actions completed.');}
 if(branch!==value.branches.length||JSON.stringify(replay)!==JSON.stringify(cursor)||ended!==value.ended)throw Error('Routine cursor does not match its action history.');
 if(ended||cursor.done){if(!Number.isInteger(value.finishedMonth)||value.finishedMonth<lastMonth||value.finishedMonth>month)throw Error('Invalid routine completion month.');}else if(value.finishedMonth!==null)throw Error('An unfinished routine cannot have a completion month.');
 const textIndices=actions.map((a,i)=>['announcement','popup','ending','dialogText','resultText'].includes(a.type)?i:null).filter(i=>i!==null).slice(-PROGRAM_TEXT_HISTORY);
 if(value.text.length!==textIndices.length)throw Error('Missing routine message history.');
 const text=value.text.map((t,i)=>{if(!t||t.receipt!==textIndices[i]||typeof t.message!=='string'||!t.message&&!['dialogText','resultText'].includes(actions[t.receipt]?.type)||t.message.length>4000)throw Error('Invalid routine message history.');return{receipt:t.receipt,message:t.message};});
 return{id:value.id,startedMonth:value.startedMonth,cursor,branches:[...value.branches],receipts,text,ended,finishedMonth:value.finishedMonth};
}
// This projection must only receive an invocation returned by validation (or
// produced by the live runner). It is for shared goal-history validators.
export function programActionSources(run,programs){let branch=0;const cursor=startScenarioProgram(programs,run.cursor.entry);return run.receipts.map(receipt=>{const action=nextScenarioProgramAction(programs,cursor,()=>run.branches[branch++]);return{e:action,state:{...receipt,runs:1},program:true};});}
