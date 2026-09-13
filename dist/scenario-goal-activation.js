export const initialGoalActivations=(definition,month)=>definition.objectives.map(o=>o.addAtStartup===false?null:month);
export const goalIsActive=(scenario,index)=>scenario.goalActivatedMonths?.[index]!==null;
export function addScenarioGoal(c,index){const s=c.scenario;if(!Number.isInteger(index)||index<0||index>=s.definition.objectives.length)return{ok:false};if(s.goalActivatedMonths[index]!==null)return{ok:true};s.goalActivatedMonths[index]=c.month;if(s.definition.objectiveMode!=='sequence'||index===s.stageCompletedMonths.length)s.streak=0;return{ok:true};}
export function validateGoalActivations(v,definition,startMonth,lastChecked,events,progress,programSources=[]){
 if(v===undefined&&definition.objectives.every(o=>o.addAtStartup!==false))return initialGoalActivations(definition,startMonth);
 if(!Array.isArray(v)||v.length!==definition.objectives.length)throw Error('Missing scenario goal activation history.');
 const activated=v.map((month,i)=>{
  const startup=definition.objectives[i].addAtStartup!==false;
  const sources=[...definition.events.map((e,j)=>({e,state:events?.[j]})),...programSources].filter(({e,state})=>e.type==='addGoal'&&e.goal===i&&state?.status==='triggered'&&state.runs>0);
  if(startup?month!==startMonth:month===null?sources.length>0:!Number.isInteger(month)||month<=startMonth||month>lastChecked||!sources.some(({e,state,program})=>program?month===state.month:month>=startMonth+e.month&&month<=state.month))throw Error('Invalid scenario goal activation history.');
  const programMonths=sources.filter(source=>source.program).map(({state})=>state.month);if(!startup&&month!==null&&programMonths.length&&month>Math.min(...programMonths))throw Error('Goal activation cannot follow its first routine activation action.');
  return month;
 });
 if(progress){
  const completed=progress.stageCompletedMonths||[],sequence=definition.objectiveMode==='sequence',current=sequence?activated[completed.length]:null;
  if(sequence&&completed.some((month,i)=>activated[i]===null||activated[i]>month))throw Error('A scenario stage completed before activation.');
  const latest=sequence?current:Math.max(startMonth,...activated.filter(m=>m!==null));
  if(progress.streak>0&&(sequence&&current===null||!activated.some(m=>m!==null)||progress.streak>lastChecked-latest+(latest>startMonth?1:0)))throw Error('Scenario hold predates goal activation.');
 }
 return activated;
}
