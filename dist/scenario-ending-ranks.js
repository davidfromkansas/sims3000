// End Scenario may award a specific authored rank. Omitting the selection keeps
// the existing first-matching-rank behavior for old and newly authored scripts.
export function validateEndingRankSelection(action){
 if(action.rankIndex===undefined)return {};
 if(!Number.isInteger(action.rankIndex)||action.rankIndex<0||action.rankIndex>3)throw Error('Choose an existing rank for the scripted ending.');
 return {rankIndex:action.rankIndex};
}
export function validateEndingRankReferences(definition){
 const check=action=>{
  if(action.type!=='ending'||action.rankIndex===undefined)return;
  const rank=definition.ranks[action.rankIndex];
  if(!rank)throw Error('A scripted ending refers to an undefined rank.');
  if(rank.outcome!=='either'&&rank.outcome!==action.outcome)throw Error('The selected rank must allow the scripted ending’s victory or loss outcome.');
 };
 const steps=items=>{for(const item of items){if(item.kind==='action')check(item.action);if(item.kind==='if'){steps(item.then);steps(item.else??[]);}}};
 definition.events.forEach(check);(definition.programs??[]).forEach(program=>steps(program.steps));return definition;
}
export function hasSelectedEndingRank(definition){
 if(!definition)return false;
 const selected=action=>action?.type==='ending'&&action.rankIndex!==undefined;
 const steps=items=>items?.some(item=>item.kind==='action'?selected(item.action):item.kind==='if'&&(steps(item.then)||steps(item.else)));
 return definition.events?.some(selected)||definition.programs?.some(program=>steps(program.steps))||false;
}

export function endingRankChoices(rows,selected){
 const choices=[['','Automatic rank rules'],...rows.filter(row=>row.name.trim()).map(row=>[String(row.index),`${row.name.trim()} · rank row ${row.index+1}`])];
 if(selected!==undefined&&!choices.some(([value])=>value===String(selected)))choices.push([String(selected),`Rank row ${selected+1} is empty — choose another rank`]);
 return choices;
}
export function remapEndingRank(action,rankRows){
 if(action.type!=='ending'||action.rankIndex===undefined)return action;
 const index=rankRows.indexOf(action.rankIndex);
 if(index<0)throw Error(`An ending refers to empty rank row ${action.rankIndex+1}. Choose an occupied rank or automatic rules.`);
 action.rankIndex=index;return action;
}
