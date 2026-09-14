import {defaultScenarioVariables,MAX_SCENARIO_VARIABLES} from './scenario-variables.js?v=scenario-variable-manager-1';
import {scenarioVariableIndex} from './scenario-variable-references.js?v=scenario-variable-manager-1';

export function mountScenarioVariableEditor(root,{scope=document,programEditor,initial=defaultScenarioVariables(),onChange=()=>{}}={}){
 let variables=structuredClone(initial),rows=[];
 const el=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
 const status=el('p');status.setAttribute('role','status');
 const metricSelects=()=>[...scope.querySelectorAll('select')].filter(n=>/^(customMetric|eventCondition|eventCopyMetric|eventOperandMetric|storyValue)/.test(n.id));
 const targets=()=>[...scope.querySelectorAll('select')].filter(n=>/^eventVariable\d+$/.test(n.id));
 const messages=()=>[...scope.querySelectorAll('input,textarea')].filter(n=>/^(customBriefing|customWinMessage|customLossMessage|goalDescription\d+|eventMessage\d+|rankMessage\d+)$/.test(n.id));
 const read=()=>rows.map(({name,value})=>({name:name.value,initial:value.value.trim()===''?NaN:Number(value.value)}));
 function refresh(removed){
  for(const select of metricSelects()){
   const old=select.value,index=scenarioVariableIndex(old);
   for(const option of [...select.querySelectorAll('option')])if(scenarioVariableIndex(option.value)!==null)option.remove();
   for(const group of [...select.querySelectorAll('optgroup')])if(group.label==='Scenario variables')group.remove();
   const group=el('optgroup');group.label='Scenario variables';
   variables.forEach((v,i)=>{const option=el('option',`${v.name||'Unnamed variable'} · variable${i+1}`);option.value=`variable${i+1}`;group.append(option);});select.append(group);
   select.value=index===null?old:removed!==undefined&&index>removed?`variable${index}`:old;
   if(!select.value&&old)select.value=select.id==='storyValue'?'city':'population';
  }
  for(const select of targets()){
   const old=Number(select.value);select.replaceChildren();
   variables.forEach((v,i)=>{const option=el('option',v.name||'Unnamed variable');option.value=String(i);select.append(option);});
   select.value=String(removed!==undefined&&old>removed?old-1:Math.min(old,variables.length-1));
  }
  programEditor?.refreshVariables();onChange();
 }
 function location(input){return input.closest('label')?.firstChild?.textContent.trim()||input.id;}
 function remove(index){
  const draft=read();if(draft.length===1)throw Error('Keep at least one scenario variable.');
  const used=[];
  for(const select of metricSelects())if(select.id!=='storyValue'&&scenarioVariableIndex(select.value)===index)used.push(`${location(select)} (${select.id})`);
  for(const select of targets())if(scope.querySelector('#customEvent'+select.id.replace('eventVariable','')).value==='variable'&&Number(select.value)===index)used.push(`Event ${Number(select.id.replace('eventVariable',''))+1} assignment`);
  for(const input of messages())if(input.value.includes(`{variable${index+1}}`))used.push(`${location(input)} (${input.id})`);
  if(used.length)throw Error(`Cannot remove ${draft[index].name}: used by ${used.join('; ')}. Clear these draft references first.`);
  // Prepare the routine/clipboard change before modifying any visible draft.
  const applyPrograms=programEditor?.prepareVariableRemoval(draft,index);
  variables=draft;variables.splice(index,1);
  for(const input of messages())input.value=input.value.replace(/\{variable([1-9][0-9]*)\}/g,(token,n)=>Number(n)-1>index?`{variable${Number(n)-1}}`:token);
  render();applyPrograms?.();refresh(index);status.textContent='Variable removed. Later references still use the same counters.';
 }
 function render(){
  root.replaceChildren();rows=[];
  variables.forEach((v,i)=>{
   const row=el('div');row.className='service-funding';
   const label=el('label',`Variable ${i+1} name`),name=el('input');name.id='variableName'+i;name.maxLength=40;name.value=v.name;label.append(name);row.append(label);
   const valueLabel=el('label','Initial value'),value=el('input');value.id='variableInitial'+i;value.type='number';value.min=-1000000;value.max=1000000;value.step=1;value.value=Number.isNaN(v.initial)?'':String(v.initial);rows.push({name,value});valueLabel.append(value);row.append(valueLabel);
   name.oninput=()=>{variables=read();refresh();};
   const button=el('button','Remove variable '+(i+1));button.type='button';button.onclick=()=>{try{remove(i);}catch(e){status.textContent=e.message;}};row.append(button);root.append(row);
  });
  const add=el('button','Add variable');add.id='addScenarioVariable';add.type='button';add.disabled=variables.length>=MAX_SCENARIO_VARIABLES;
  add.onclick=()=>{variables=read();const names=new Set(variables.map(v=>v.name.trim().toLowerCase()));let n=1;while(names.has(`variable ${n}`))n++;variables.push({name:`Variable ${n}`,initial:0});render();refresh();rows.at(-1).name.focus();status.textContent=`${variables.length} variables available.`;};
  root.append(add,status);
 }
 render();refresh();return{read};
}
