import {SCENARIO_EVENTS,CONDITION_METRICS} from './scenario-events.js?v=scenario-neighbor-deals-1';
import {CUSTOM_METRICS} from './scenario-metrics.js?v=scenario-neighbor-deals-1';
import {CALCULATIONS} from './scenario-variables.js?v=scenario-neighbor-deals-1';
import {SCENARIO_SOUNDS} from './scenario-sounds.js?v=scenario-neighbor-deals-1';
import {BUSINESSES} from './business.js?v=scenario-neighbor-deals-1';
import {REWARDS} from './rewards.js?v=scenario-neighbor-deals-1';
import {dateInputValue,readMetricTarget} from './scenario-calendar.js?v=scenario-neighbor-deals-1';
import {validateScenarioProgramDefinitions} from './scenario-program-definitions.js?v=scenario-neighbor-deals-1';
const leaf=()=>({metric:'population',operator:'gte',target:100});
const optionsOf=items=>Object.entries(items).map(([value,label])=>[value,typeof label==='string'?label:label.name]);
const primitiveOptions=optionsOf(SCENARIO_EVENTS).filter(([key])=>key!=='program');
const visitSteps=(steps,fn)=>{for(const step of steps){fn(step);if(step.kind==='if'){visitSteps(step.then,fn);visitSteps(step.else,fn);}}};
export function mountScenarioProgramEditor(root,{size=48,initial=[],available=[],entryTargets=()=>[],onChange=()=>{}}={}){
 let routines=structuredClone(initial);const status=document.createElement('p');status.setAttribute('role','status');
 const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 const button=(parent,text,handler)=>{const b=el('button',text);b.type='button';b.onclick=()=>{try{handler();status.textContent='Draft updated. Start the challenge to apply it.';}catch(e){status.textContent=e.message;}};parent.append(b);return b;};
 function field(parent,label,value,set,{type='text',choices,min,max,step='1',multiline=false}={}){const wrap=el('label',label),input=el(choices?'select':multiline?'textarea':'input');if(choices)for(const [v,name]of choices){const option=el('option',name);option.value=String(v);input.append(option);}else input.type=type;input.value=String(value??'');if(min!==undefined)input.min=min;if(max!==undefined)input.max=max;input.step=step;if(multiline)input.maxLength=500;const change=()=>set(choices?input.value:type==='number'?(input.value.trim()===''?NaN:Number(input.value)):input.value);if(choices)input.onchange=change;else input.oninput=change;wrap.append(input);parent.append(wrap);return input;}
 function check(parent,label,value,set){const wrap=el('label',label),input=el('input');input.type='checkbox';input.checked=value;input.onchange=()=>set(input.checked);wrap.append(input);parent.append(wrap);}
 const changed=removed=>onChange(structuredClone(routines),removed);
 function defaultAction(type){const a={type};if(['announcement','popup','ending'].includes(type))a.message='Mayor, review the latest city report.';if(type==='ending')a.outcome='won';if(type==='popup'){a.showStatus=true;a.presenter=null;}if(type==='variable')Object.assign(a,{variable:0,operation:'add',value:1});if(['markGoal','addGoal'].includes(type))a.goal=0;if(type==='markGoal')a.goalStatus='satisfied';if(type==='sound')a.sound='notice';if(type==='reward')a.reward='university';if(type==='business')a.business='casino';if(type==='neighborDeal')Object.assign(a,{operation:'enable',neighbor:'east',resource:'power',direction:'import',amount:50});if(!['announcement','popup','ending','variable','markGoal','addGoal','sound','reward','business','neighborDeal'].includes(type))Object.assign(a,{x:Math.floor(size/2),y:Math.floor(size/2)});if(type==='camera')a.zoom=1;return a;}
 function actionFields(parent,a){
  const text=(label,key,extra={})=>field(parent,label,a[key],v=>{a[key]=v;},extra);
  if(['announcement','popup','ending'].includes(a.type))text('Message text','message',{multiline:true});
  if(a.type==='popup'){check(parent,'Include Scenario status button',a.showStatus!==false,v=>a.showStatus=v);check(parent,'Show advisor presenter',!!a.presenter,v=>{a.presenter=v?{name:'City advisor',role:'City council',portrait:'advisor'}:null;render();});if(a.presenter){field(parent,'Presenter name',a.presenter.name,v=>a.presenter.name=v);field(parent,'Presenter role',a.presenter.role,v=>a.presenter.role=v);}}
  if(a.type==='ending')text('Scenario result','outcome',{choices:[['won','Victory'],['lost','Loss']]});
  if(['addGoal','markGoal'].includes(a.type))field(parent,'Goal row',a.goal,v=>a.goal=Number(v),{choices:[0,1,2,3].map(i=>[i,'Goal '+(i+1)])});
  if(a.type==='markGoal')text('Goal status','goalStatus',{choices:[['satisfied','Satisfied'],['unsatisfied','Unsatisfied']]});
  if(a.type==='sound')text('Sound','sound',{choices:optionsOf(SCENARIO_SOUNDS)});
  if(a.type==='reward')text('Reward','reward',{choices:optionsOf(REWARDS)});
  if(a.type==='business')text('Business offer','business',{choices:optionsOf(BUSINESSES)});
  if(a.type==='neighborDeal'){
   field(parent,'Contract command',a.operation,v=>{a.operation=v;if(v==='disable')delete a.amount;else a.amount=50;render();},{choices:[['enable','Enable'],['disable','Disable']]});
   field(parent,'Neighbor',a.neighbor,v=>{a.neighbor=v;if(v==='sea')a.resource='garbage';render();},{choices:['north','east','south','west','sea'].map(v=>[v,v])});
   text('Resource','resource',{choices:(a.neighbor==='sea'?['garbage']:['power','water','garbage']).map(v=>[v,v])});
   text('Direction','direction',{choices:[['import','Import'],['export','Export']]});
   if(a.operation==='enable')field(parent,'Contract units',a.amount,v=>a.amount=Number(v),{choices:[25,50,100].map(v=>[v,v])});
   parent.append(el('p','Enable creates an agreement at the current quote using a registered working route. Existing matching terms are kept. Disable ends the matching contract and charges its normal termination fee. Unavailable offers are skipped.'));
  }
  if(a.x!==undefined){for(const key of ['x','y'])field(parent,'Map '+key.toUpperCase(),a[key]+1,v=>a[key]=v-1,{type:'number',min:1,max:size});}
  if(a.type==='camera')field(parent,'Zoom (%)',a.zoom*100,v=>a.zoom=v/100,{type:'number',min:40,max:250,step:5});
  if(a.type==='variable'){
   field(parent,'Variable slot',a.variable,v=>a.variable=Number(v),{choices:[0,1,2,3].map(i=>[i,'Variable '+(i+1)])});
   field(parent,'Operation',a.operation,v=>{for(const k of ['value','metric','calculation','left','right'])delete a[k];a.operation=v;if(v==='copy')a.metric='population';else if(v==='calculate')Object.assign(a,{calculation:'sum',left:{kind:'constant',value:1},right:{kind:'constant',value:1}});else a.value=1;render();},{choices:[['set','Set'],['add','Add'],['copy','Copy city value'],['calculate','Calculate']]});
   if(['set','add'].includes(a.operation))text('Value','value',{type:'number',min:-1000000,max:1000000});
   if(a.operation==='copy')text('City value','metric',{choices:optionsOf(CUSTOM_METRICS)});
   if(a.operation==='calculate'){text('Calculation','calculation',{choices:optionsOf(CALCULATIONS)});for(const side of ['left','right']){const operand=a[side];field(parent,side+' operand',operand.kind,v=>{a[side]=v==='metric'?{kind:v,metric:'population'}:{kind:v,value:1};render();},{choices:[['constant','Number'],['metric','City value']]});field(parent,side+' value',operand.kind==='metric'?operand.metric:operand.value,v=>{operand[operand.kind==='metric'?'metric':'value']=v;},operand.kind==='metric'?{choices:optionsOf(CUSTOM_METRICS)}:{type:'number',min:-1000000,max:1000000});}}
  }
 }
 function conditionFields(parent,c,replace,depth=1){
  const group=el('fieldset');parent.append(group);group.append(el('legend','Condition'));
  if(c.conditions){field(group,'Match',c.match,v=>c.match=v,{choices:[['all','All conditions (AND)'],['any','Any condition (OR)']]});c.conditions.forEach((child,i)=>{conditionFields(group,child,v=>{c.conditions[i]=v;render();},depth+1);if(c.conditions.length>1)button(group,'Remove condition '+(i+1),()=>{c.conditions.splice(i,1);render();});});button(group,'Add condition',()=>{c.conditions.push(leaf());render();});button(group,'Use one condition',()=>{replace(c.conditions[0]||leaf());});return;}
  field(group,'City or scenario value',c.metric,v=>{c.metric=v;c.target=CONDITION_METRICS[v].initial??0;c.operator='gte';delete c.area;render();},{choices:optionsOf(CONDITION_METRICS)});
  field(group,'Comparison',c.operator,v=>c.operator=v,{choices:[['gte','At least'],['lte','At most'],['gt','Greater than'],['lt','Less than'],['eq','Equals'],['ne','Not equal']]});
  const m=CONDITION_METRICS[c.metric];field(group,'Threshold',m.date?dateInputValue(c.target):c.target,v=>{try{c.target=m.states?Number(v):readMetricTarget(m,String(v));}catch{c.target=NaN;}},m.states?{choices:m.states.map((v,i)=>[i,v])}:{type:m.date?'month':'number',step:m.integer?'1':'any'});
  if(m.spatial){check(group,'Limit to a map area',!!c.area,v=>{c.area=v?{x:0,y:0,radius:0}:null;render();});if(c.area)for(const key of ['x','y','radius'])field(group,'Area '+key,key==='radius'?c.area[key]:c.area[key]+1,v=>c.area[key]=key==='radius'?v:v-1,{type:'number',min:key==='radius'?0:1,max:key==='radius'?Math.ceil((size-1)*Math.SQRT2):size});}
  if(depth<8)button(group,'Combine conditions',()=>replace({match:'all',conditions:[structuredClone(c),leaf()]}));
 }
 function block(parent,steps,label,depth=1){
  const box=el('fieldset');box.append(el('legend',label));parent.append(box);
  steps.forEach((step,i)=>{const row=el('section');row.className='program-step';box.append(row);row.append(el('h4','Step '+(i+1)));
   button(row,'Move step up',()=>{if(i>0){[steps[i-1],steps[i]]=[steps[i],steps[i-1]];render();}}).disabled=i===0;
   button(row,'Move step down',()=>{if(i+1<steps.length){[steps[i+1],steps[i]]=[steps[i],steps[i+1]];render();}}).disabled=i===steps.length-1;
   button(row,'Remove step',()=>{steps.splice(i,1);render();});
   if(step.kind==='action'){field(row,'Action',step.action.type,v=>{step.action=defaultAction(v);render();},{choices:primitiveOptions});actionFields(row,step.action);}
   if(step.kind==='call')field(row,'Call routine',step.routine,v=>step.routine=Number(v),{choices:routines.map((r,j)=>[j,r.name||'Unnamed routine'])});
   if(step.kind==='if'){conditionFields(row,step.condition,v=>{step.condition=v;render();});block(row,step.then,'If true',depth+1);block(row,step.else,'Otherwise',depth+1);}
  });
  button(box,'Add action',()=>{steps.push({kind:'action',action:defaultAction('announcement')});render();});
  button(box,'Add If / Else',()=>{steps.push({kind:'if',condition:leaf(),then:[],else:[]});render();}).disabled=depth>=8;
  button(box,'Add subroutine call',()=>{steps.push({kind:'call',routine:0});render();});
 }
 function render(removed){root.replaceChildren();root.append(el('h3','Routine scripts'),el('p','Create reusable action sequences. Schedule a routine below. If / Else chooses a path when reached; messages and emergencies pause that path. Goal and variable numbers refer to the rows in this editor.'));
  routines.forEach((r,index)=>{const panel=el('fieldset');panel.append(el('legend','Routine '+(index+1)));root.append(panel);field(panel,'Routine name',r.name,v=>{r.name=v;changed();});button(panel,'Delete routine',()=>{let used=entryTargets().includes(index);routines.forEach(other=>visitSteps(other.steps,s=>{if(s.kind==='call'&&s.routine===index)used=true;}));if(used)throw Error('Remove scheduled entries and subroutine calls to this routine before deleting it.');routines.splice(index,1);routines.forEach(other=>visitSteps(other.steps,s=>{if(s.kind==='call'&&s.routine>index)s.routine--;}));render(index);});block(panel,r.steps,'Actions');});
  if(available.length)button(root,'Copy routines from current challenge',()=>{if(routines.length+available.length>8)throw Error('Copying would exceed eight routines. Remove unused drafts first.');const offset=routines.length,copies=structuredClone(available),names=new Set(routines.map(r=>r.name));for(const routine of copies){const original=routine.name;let suffix=1;while(names.has(routine.name))routine.name=original.slice(0,48)+' copy '+suffix++;names.add(routine.name);visitSteps(routine.steps,s=>{if(s.kind==='call')s.routine+=offset;});}routines.push(...copies);render();});
  button(root,'Add routine',()=>{if(routines.length>=8)throw Error('You can create at most eight routines.');routines.push({name:'Routine '+(routines.length+1),steps:[]});render();});root.append(status);changed(removed);
 }
 render();return{read(goalRows=[0,1,2,3]){const draft=structuredClone(routines),remap=i=>{const target=goalRows.indexOf(i);if(target<0)throw Error('A routine refers to an empty goal row.');return target;};const condition=c=>{if(c.conditions)c.conditions.forEach(condition);else if(/^goalStatus[1-4]$/.test(c.metric))c.metric='goalStatus'+(remap(Number(c.metric.slice(-1))-1)+1);};draft.forEach(r=>visitSteps(r.steps,s=>{if(s.kind==='if')condition(s.condition);if(s.kind==='action'&&['addGoal','markGoal'].includes(s.action.type))s.action.goal=remap(s.action.goal);}));return validateScenarioProgramDefinitions(draft,{size,objectives:goalRows.map(()=>({}))});},draft:()=>structuredClone(routines)};
}
