import {validateScenarioArea,scenarioAreaLabel} from './scenario-area.js?v=east-asian-landmarks-1';
export function validateComparisonTarget(condition,metric,metrics,size,limit){
 if(condition.right===undefined){
  const target=condition.target;
  if(!Number.isFinite(target)||target<(metric.min||0)||target>limit||metric.integer&&!Number.isInteger(target))throw Error('Choose a valid event condition and threshold.');
  return{target};
 }
 if(Object.hasOwn(condition,'target'))throw Error('Choose either a fixed threshold or another scenario value.');
 const right=condition.right,m=Object.hasOwn(metrics,right?.metric)?metrics[right.metric]:null;
 if(!right||typeof right!=='object'||Array.isArray(right)||!m)throw Error('Choose a valid comparison value.');
 const area=validateScenarioArea(right.area,m,size);return{right:{metric:right.metric,...(area?{area}:{})}};
}
export function comparisonTargetValue(city,condition,metrics){return condition.right?metrics[condition.right.metric].read(city,condition.right.area):condition.target;}
export function comparisonTargetLabel(condition,metrics){return condition.right?metrics[condition.right.metric].name+scenarioAreaLabel(condition.right.area):null;}
export function hasLiveComparison(definition){
 if(!definition)return false;
 const condition=value=>!!value&&(value.conditions?value.conditions.some(condition):value.right!==undefined);
 const steps=items=>items?.some(step=>step.kind==='if'?(condition(step.condition)||steps(step.then)||steps(step.else)):step.kind==='action'&&condition(step.action?.condition));
 return definition.events?.some(event=>condition(event.condition))||definition.ranks?.some(rank=>condition(rank.condition))||definition.programs?.some(program=>steps(program.steps))||false;
}
