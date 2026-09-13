// Structured scenario instructions, never executable source text. The compiler
// receives the game's action/condition validators to avoid coupling to the UI.
export const PROGRAM_LIMITS=Object.freeze({routines:8,depth:8,nodes:128,expanded:1024});
export function compileScenarioPrograms(value,{validateAction,validateCondition}){
 if(!Array.isArray(value)||value.length>PROGRAM_LIMITS.routines)throw Error('Choose at most eight scenario routines.');
 const names=new Set(),programs=[];let nodes=0;
 for(const routine of value){
  if(!routine||typeof routine.name!=='string'||!routine.name.trim()||routine.name.length>60||/[\x00-\x1f]/.test(routine.name)||names.has(routine.name.trim()))throw Error('Routines need unique names of 1–60 characters.');
  names.add(routine.name.trim());const code=[];
  function block(steps,depth){
   if(!Array.isArray(steps)||depth>PROGRAM_LIMITS.depth)throw Error('Action blocks support up to eight nesting levels.');
   const normalized=[];for(const step of steps){if(++nodes>PROGRAM_LIMITS.nodes)throw Error('Scenario routines support at most 128 instructions.');if(!step||typeof step!=='object')throw Error('Invalid scenario instruction.');
    if(step.kind==='action'){const action=validateAction(step.action);code.push({op:'action',action});normalized.push({kind:'action',action});}
    else if(step.kind==='call'){if(!Number.isInteger(step.routine)||step.routine<0||step.routine>=value.length)throw Error('Choose an existing subroutine.');code.push({op:'call',routine:step.routine});normalized.push({kind:'call',routine:step.routine});}
    else if(step.kind==='if'){
     if(step.condition==null)throw Error('An If instruction needs a condition.');
     const condition=validateCondition(step.condition),branch=code.length;code.push({op:'branch',condition,otherwise:0});const yes=block(step.then,depth+1);
     const jump=code.length;code.push({op:'jump',target:0});code[branch].otherwise=code.length;const no=block(step.else??[],depth+1);code[jump].target=code.length;normalized.push({kind:'if',condition,then:yes,else:no});
    }else throw Error('Choose an action, If / Else or subroutine call.');
   }return normalized;
  }
  const steps=block(routine.steps,1);code.push({op:'return'});programs.push({name:routine.name.trim(),steps,code});
 }
 // Reject recursive calls and explosive repeated expansion before gameplay.
 // This counts both branch arms, a conservative upper bound for every run.
 const costs=new Map(),visiting=new Set();
 function cost(index){if(visiting.has(index))throw Error('Recursive subroutine calls are not supported.');if(costs.has(index))return costs.get(index);visiting.add(index);let total=programs[index].code.length;for(const instruction of programs[index].code)if(instruction.op==='call')total+=cost(instruction.routine);visiting.delete(index);if(total>PROGRAM_LIMITS.expanded)throw Error('A routine may execute at most 1024 expanded instructions.');costs.set(index,total);return total;}
 programs.forEach((_,i)=>cost(i));return programs;
}
export function startScenarioProgram(programs,routine){if(!Number.isInteger(routine)||!programs[routine])throw Error('Choose an existing subroutine.');return{entry:routine,stack:[{routine,pc:0}],steps:0,done:false};}
export function validateScenarioProgramCursor(value,programs){
 if(!value||!Number.isInteger(value.entry)||!programs[value.entry]||!Number.isInteger(value.steps)||value.steps<0||value.steps>PROGRAM_LIMITS.expanded||typeof value.done!=='boolean'||!Array.isArray(value.stack)||value.stack.length>PROGRAM_LIMITS.routines||value.done!==(value.stack.length===0))throw Error('Invalid scenario routine progress.');
 const stack=value.stack.map((frame,i)=>{if(!frame||!Number.isInteger(frame.routine)||!programs[frame.routine]||!Number.isInteger(frame.pc)||frame.pc<0||frame.pc>=programs[frame.routine].code.length)throw Error('Invalid scenario instruction position.');if(i===0&&frame.routine!==value.entry)throw Error('Invalid routine entry.');if(i){const parent=value.stack[i-1],call=programs[parent.routine].code[parent.pc-1];if(call?.op!=='call'||call.routine!==frame.routine)throw Error('Invalid subroutine return address.');}return{routine:frame.routine,pc:frame.pc};});
 return{entry:value.entry,stack,steps:value.steps,done:value.done};
}
// Advance until one game action is emitted. The caller executes it and may
// suspend on a popup/disaster. Its cursor already points past that action, so
// saving during a pause cannot repeat it. Conditions are read when reached.
export function nextScenarioProgramAction(programs,cursor,conditionMet){
 if(cursor.done)return null;
 while(cursor.stack.length){
  if(cursor.steps>=PROGRAM_LIMITS.expanded)throw Error('Scenario routine instruction limit reached.');
  const frame=cursor.stack.at(-1),instruction=programs[frame.routine]?.code[frame.pc];if(!instruction)throw Error('Invalid scenario instruction position.');cursor.steps++;
  if(instruction.op==='action'){frame.pc++;return structuredClone(instruction.action);}
  if(instruction.op==='branch'){frame.pc=conditionMet(instruction.condition)?frame.pc+1:instruction.otherwise;continue;}
  if(instruction.op==='jump'){frame.pc=instruction.target;continue;}
  if(instruction.op==='call'){frame.pc++;cursor.stack.push({routine:instruction.routine,pc:0});continue;}
  if(instruction.op==='return'){cursor.stack.pop();continue;}
  throw Error('Invalid compiled scenario instruction.');
 }
 cursor.done=true;return null;
}
