import {validateScenarioVariables,MAX_SCENARIO_VARIABLES} from './scenario-variables.js?v=scripted-ending-ranks-1';
// Walk only fields that the scenario runtime interprets as variable references.
// Literal titles, goal names and routine names must not be rewritten.
export function scenarioVariableIndex(metric){
 const match=/^variable([1-9][0-9]*)$/.exec(metric);
 return match?Number(match[1])-1:null;
}
function visitReferences(definition,visit){
 const metric=(object,key,path)=>{
  const index=scenarioVariableIndex(object?.[key]);
  if(index!==null)visit({object,key,index,path,kind:'metric'});
 };
 const text=(object,key,path)=>{
  if(typeof object?.[key]!=='string')return;
  for(const match of object[key].matchAll(/\{variable([1-9][0-9]*)\}/g))
   visit({object,key,index:Number(match[1])-1,path,kind:'text'});
 };
 const condition=(value,path)=>{
  if(!value)return;
  if(value.conditions)value.conditions.forEach((child,i)=>condition(child,`${path} / condition ${i+1}`));
  else metric(value,'metric',path);
 };
 const action=(value,path)=>{
  condition(value.condition,`${path} / condition`);
  if(value.type==='variable'){
   visit({object:value,key:'variable',index:value.variable,path,kind:'target'});
   if(value.operation==='copy')metric(value,'metric',`${path} / copied value`);
   if(value.operation==='calculate')for(const side of ['left','right'])
    if(value[side]?.kind==='metric')metric(value[side],'metric',`${path} / ${side} operand`);
  }
  if(['announcement','popup','ending','dialogText','resultText'].includes(value.type))text(value,'message',`${path} / message`);
 };
 const steps=(values,path)=>values.forEach((step,i)=>{
  const location=`${path} / instruction ${i+1}`;
  if(step.kind==='action')action(step.action,location);
  if(step.kind==='if'){
   condition(step.condition,`${location} / condition`);
   steps(step.then,`${location} / then`);steps(step.else??[],`${location} / else`);
  }
 });
 for(const key of ['briefing','winMessage','lossMessage'])text(definition,key,key);
 (definition.objectives??[]).forEach((goal,i)=>{
  metric(goal,'metric',`Goal ${i+1}`);text(goal,'description',`Goal ${i+1} / instructions`);
 });
 (definition.events??[]).forEach((event,i)=>action(event,`Event ${i+1}`));
 (definition.ranks??[]).forEach((rank,i)=>{
  condition(rank.condition,`Rank ${i+1} / condition`);text(rank,'message',`Rank ${i+1} / message`);
 });
 (definition.programs??[]).forEach((program,i)=>steps(program.steps,`Routine ${i+1}`));
}
export function scenarioVariableReferences(definition,index){
 const paths=new Set();visitReferences(definition,reference=>{if(reference.index===index)paths.add(reference.path);});
 return [...paths];
}
export function validateScenarioVariableReferences(definition){
 visitReferences(definition,reference=>{
  if(!Number.isInteger(reference.index)||reference.index<0||reference.index>=definition.variables.length)
   throw Error(`${reference.path} refers to an undefined scenario variable.`);
 });
 return definition;
}
// Operates on an editor definition, never a running city's values or receipts.
// All changes are made to a copy only after reference validation succeeds.
export function removeScenarioVariable(definition,index){
 if(!Number.isInteger(index)||index<0||index>=definition.variables.length)throw Error('Choose an existing scenario variable.');
 if(definition.variables.length===1)throw Error('Keep at least one scenario variable.');
 validateScenarioVariableReferences(definition);
 const references=scenarioVariableReferences(definition,index);
 if(references.length)throw Error(`Cannot remove ${definition.variables[index].name}: used by ${references.join('; ')}.`);
 const next=structuredClone(definition),textFields=new Map();
 visitReferences(next,reference=>{
  const {object,key,kind}=reference;
  if(kind==='text'){
   if(!textFields.has(object))textFields.set(object,new Set());textFields.get(object).add(key);
  }else if(reference.index>index)object[key]=kind==='target'?reference.index-1:`variable${reference.index}`;
 });
 // Rewrite each text field once: multiple placeholders must not shift twice.
 for(const [object,keys] of textFields)for(const key of keys)object[key]=object[key].replace(/\{variable([1-9][0-9]*)\}/g,(token,n)=>Number(n)-1>index?`{variable${Number(n)-1}}`:token);
 next.variables.splice(index,1);
 return next;
}

export function addScenarioVariable(definition){
 const variables=validateScenarioVariables(definition.variables);
 if(variables.length>=MAX_SCENARIO_VARIABLES)throw Error('This editor supports up to 32 scenario variables.');
 const names=new Set(variables.map(v=>v.name.toLowerCase()));let suffix=1;
 while(names.has(`variable ${suffix}`))suffix++;
 return {...structuredClone(definition),variables:[...variables,{name:`Variable ${suffix}`,initial:0}]};
}
export function renameScenarioVariable(definition,index,name){
 if(!Number.isInteger(index)||index<0||index>=definition.variables.length)throw Error('Choose an existing scenario variable.');
 const next=structuredClone(definition);next.variables[index].name=name;
 next.variables=validateScenarioVariables(next.variables);return next;
}
