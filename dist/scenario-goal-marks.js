export const initialGoalMarks=definition=>definition.objectives.map(()=>null);
export function markScenarioGoal(c,index,status){
 const s=c.scenario;if(!Number.isInteger(index)||index<0||index>=s.definition.objectives.length||!['satisfied','unsatisfied'].includes(status))return{ok:false};
 const satisfied=status==='satisfied',previous=s.goalMarks[index];s.goalMarks[index]={satisfied,month:c.month};
 if(s.definition.objectiveMode==='sequence'){
  if(!satisfied&&index<s.stageCompletedMonths.length){s.stageCompletedMonths=s.stageCompletedMonths.slice(0,index);s.streak=0;}
  if(index===s.stageCompletedMonths.length&&previous?.satisfied!==satisfied)s.streak=0;
 }else if(previous?.satisfied!==satisfied)s.streak=0;
 return{ok:true};
}
export function validateGoalMarks(value,definition,startMonth,month,events,completed=[]){
 if(value===undefined&&!definition.events.some(e=>e.type==='markGoal'))return initialGoalMarks(definition);
 if(!Array.isArray(value)||value.length!==definition.objectives.length)throw Error('Missing scripted goal status history.');
 return value.map((mark,index)=>{
  const sources=definition.events.map((e,i)=>({e,state:events?.[i]})).filter(({e,state})=>e.type==='markGoal'&&e.goal===index&&state?.status==='triggered'&&state.runs>0);
  if(mark===null){if(sources.length)throw Error('Missing marked goal status.');return null;}
  if(mark?.satisfied===false&&index<completed.length)throw Error('An unsatisfied stage cannot remain completed.');
  if(!mark||typeof mark.satisfied!=='boolean'||!Number.isInteger(mark.month)||mark.month<=startMonth||mark.month>month||!sources.length||mark.month!==Math.max(...sources.map(({state})=>state.month))||!sources.some(({e,state})=>state.month===mark.month&&(e.goalStatus==='satisfied')===mark.satisfied))throw Error('Invalid scripted goal status.');
  return{satisfied:mark.satisfied,month:mark.month};
 });
}
