import {compileScenarioPrograms} from './scenario-programs.js?v=civic-advisors-2';
import {validateEventDefinitions,validateEventCondition} from './scenario-events.js?v=civic-advisors-2';
import {validateGoalStatusReferences} from './scenario-goal-status.js?v=civic-advisors-2';
import {MAP_SIZES} from './city-grid.js?v=civic-advisors-2';
// Program leaves have no clocks or private conditions: schedule the entry call,
// and put conditional behavior in an explicit If / Else block.
export function compileGameScenarioPrograms(value,{size=48,objectives=[]}={}){
 if(!MAP_SIZES.includes(size))throw Error('Invalid scenario map size.');
 return compileScenarioPrograms(value===undefined?[]:value,{
  validateAction(action){
   if(!action||typeof action!=='object'||action.type==='program'||['month','repeatCount','repeatEvery','condition'].some(key=>Object.hasOwn(action,key)))throw Error('Schedule the routine entry; action blocks cannot carry event timing or conditions.');
   const {month,repeatCount,repeatEvery,condition,...canonical}=validateEventDefinitions([{...action,month:1}],2,'monthly',size)[0];
   if(['addGoal','markGoal'].includes(canonical.type)&&canonical.goal>=objectives.length)throw Error('A routine action refers to an undefined goal.');
   return canonical;
  },
  validateCondition(condition){const canonical=validateEventCondition(condition,size);validateGoalStatusReferences({objectives,events:[{condition:canonical}],ranks:[]});return canonical;}
 });
}
export function validateScenarioProgramDefinitions(value,options){return compileGameScenarioPrograms(value,options).map(({name,steps})=>({name,steps}));}

export function reachableProgramActions(programs,entries){const actions=[],seen=new Set();function visit(index){if(seen.has(index))return;if(!programs[index])throw Error('A scheduled event refers to a missing routine.');seen.add(index);for(const instruction of programs[index].code){if(instruction.op==='action')actions.push(instruction.action);if(instruction.op==='call')visit(instruction.routine);}}entries.forEach(visit);return actions;}
