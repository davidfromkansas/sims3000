export const GOAL_STATES=['Inactive','Unsatisfied','Satisfied','Locked'];
export function readGoalStatus(c,index,metrics){
 const s=c.scenario,o=s?.id==='custom'?s.definition.objectives[index]:null;
 if(!o||s.goalActivatedMonths?.[index]===null)return 0;
 if(s.goalMarks?.[index])return s.goalMarks[index].satisfied?2:1;
 if(s.definition.objectiveMode==='sequence'){const completed=s.stageCompletedMonths.length;return index<completed?2:index>completed?3:1;}
 const m=metrics[o.metric],value=m.read(c,o.area);if(!Number.isFinite(value))return 1;
 return(m.direction==='equals'?value===o.target:m.direction==='at least'?value>=o.target:value<=o.target)?2:1;
}
export function goalConditionIndex(metric){const match=/^goalStatus([1-4])$/.exec(metric);return match?Number(match[1])-1:null;}
export function validateGoalStatusReferences(definition){
 const check=condition=>{if(!condition)return;if(condition.conditions){condition.conditions.forEach(check);return;}const index=goalConditionIndex(condition.metric);if(index!==null&&index>=definition.objectives.length)throw Error('A goal-status condition refers to an undefined goal.');};
 definition.events.forEach(e=>check(e.condition));definition.ranks.forEach(r=>check(r.condition));return definition;
}
