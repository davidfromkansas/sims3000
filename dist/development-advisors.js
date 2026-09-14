import {showOrdinanceAnalysis} from './ordinance-analysis-ui.js?v=automatic-police-response-1';
import {zoneGrowthReport} from './zone-growth.js?v=automatic-police-response-1';
import {utilityTrendSnapshot} from './utility-trends.js?v=automatic-police-response-1';
import {averageWaterPollution} from './city-measures.js?v=automatic-police-response-1';
import {wasteFacilityData} from './waste-facility-report.js?v=automatic-police-response-1';
const fmt=n=>Number(n||0).toLocaleString('en-US',{maximumFractionDigits:1});
export const DEVELOPMENT_ADVISORS={planning:{name:'Constance Lee',role:'City planning advisor',portrait:'assets/constance-advisor.png'},environment:{name:'Karen Frawl',role:'Environmental advisor',portrait:'assets/karen-advisor.png'},utilities:{name:'Gus Oddman',role:'Utilities advisor',portrait:'assets/gus-advisor.png'}};
export function developmentBriefing(c,kind){const advisor=DEVELOPMENT_ADVISORS[kind];if(!advisor)throw Error('Choose a planning, environment or utilities advisor.');const s=c.stats,issues=[],add=(title,text,action,layer,tool)=>issues.push({title,text,action,layer,tool});let facts;
 if(kind==='planning'){
  const rows=zoneGrowthReport(c),abandoned=rows.filter(r=>r.abandoned).length,blocked=rows.filter(r=>r.state==='blocked').length,ready=rows.filter(r=>r.state==='ready').length;
  facts=[['Population',fmt(s.population)],['Abandoned sites',fmt(abandoned)],['Growth-eligible sites',fmt(ready)]];
  if(!rows.length)add('Lay out a balanced first neighborhood','Zone homes and workplaces near roads and electricity. Add water before expecting larger development.','growth','zones','residential');
  if(abandoned)add('Recover abandoned buildings',`${abandoned} abandoned buildings remain. Inspect their recorded causes and current recovery blockers before rezoning.`,'growth');
  if(blocked)add('Fix stalled sites',`${blocked} sites have service or land problems. The development report lists the actual constraints, with map and inspection links.`,'growth');
  for(const [type,label] of [['residential','homes'],['commercial','shops'],['industrial','industry']])if(s.demand[type]>20&&!rows.some(r=>r.type===type&&r.level<r.limit))add(`Make room for ${label}`,`Demand is ${fmt(s.demand[type])}, but no reported ${type} site is below its current development limit. Check existing limits and infrastructure before zoning more land.`,'growth','zones',type);
  if(ready)add('Allow development time',`${ready} sites meet the current growth checks. Keep services working and allow simulation time; growth is probabilistic.`,'growth');
  if(!issues.length)add('Review neighborhood development','Current demand and services do not trigger an urgent planning warning. Inspect individual sites and density limits as the city changes.','growth');
 }else if(kind==='utilities'){
  const u=utilityTrendSnapshot(c);facts=[['Unserved power',fmt(u.powerUnserved)],['Unserved water',fmt(u.waterUnserved)],['Overloaded plants',fmt(s.overloadedPlants)]];
  if(s.overloadedPlants)add('Relieve overloaded plants',`${s.overloadedPlants} plants are overloaded. Add connected capacity or reduce demand before prolonged overload destroys equipment.`,'utilities','power');
  for(const [key,label,tool]of [['power','electricity','powerline'],['water','water','pipe']])if(u[key+'Unserved']>1e-7)add(`Deliver missing ${label}`,`${fmt(u[key+'Unserved'])} units of demand are unserved. Spare capacity elsewhere cannot cross a disconnected network. Inspect the local grid before adding a source.`,'utilities',key,tool);
  if(s.powerNetworks.some(g=>g.available>0&&g.demand/g.available>.9))add('Keep electricity headroom','At least one power network is using over 90% of its available capacity. Review its demand, aging generators and neighbor commitments.','utilities','power');
  if(!issues.length)add('Maintain reliable supply','Current demand is served. Inspect source age and individual networks before expanding; citywide spare capacity does not guarantee a new district is connected.','utilities');
 }else{
  const water=averageWaterPollution(c),facilities=wasteFacilityData(c),inactive=facilities.filter(r=>!r.ready).length;
  facts=[['Air pollution',fmt(s.averagePollution)+' / 100'],['Water pollution',fmt(water)+' / 100'],['Uncollected garbage',fmt(s.uncollectedWaste)]];
  if(s.uncollectedWaste>1)add('Clear garbage from neighborhoods',`${fmt(s.uncollectedWaste)} units remain uncollected. Check road access and reachable landfill or processing capacity; spare disposal space elsewhere may not be connected.`,'utilities','waste','landfill');
  if(inactive)add('Restore disposal facilities',`${inactive} recycling or incineration facilities cannot operate. Inspect their road and power connections in the maintenance report.`,'utilities');
  if(s.landfillCapacity>0&&s.landfillStored/s.landfillCapacity>.8)add('Plan disposal before landfills fill',`Landfill storage is ${fmt(s.landfillStored/s.landfillCapacity*100)}% full. Compare recycling, processing and neighbor garbage deals before capacity is exhausted.`,'utilities','waste');
  if(s.averagePollution>20)add('Reduce air pollution','Inspect traffic and industrial sources. Clean-air policies and cleaner industrial development can help; compare policy costs before enactment.','policies','pollution');
  if(water>10)add('Protect the water supply','Water pollution can reduce source output. Inspect polluted districts and treatment on the same pipe network as affected sources.','utilities','waterPollution','waterTreatment');
  if(!issues.length)add('Protect environmental quality','No citywide warning crossed these briefing thresholds. Local pollution can still be high; review maps and keep disposal capacity ahead of growth.','utilities','pollution');
 }
 return{...advisor,facts,issues};
}
export function showDevelopmentAdvisor(ui,kind,back){const d=developmentBriefing(ui.city(),kind);ui.dialog(d.name,`<div class="civic-advisor-header"><img src="${d.portrait}" width="192" height="192" alt=""><div><p class="eyebrow">${d.role}</p><h3>Your city briefing</h3><p>Review current conditions, then inspect the neighborhoods and networks behind them.</p></div></div><dl class="civic-advisor-facts">${d.facts.map(([name,value])=>`<div><dt>${name}</dt><dd>${value}</dd></div>`).join('')}</dl>${d.issues.map((issue,i)=>`<article class="civic-advisor-issue"><h3>${issue.title}</h3><p>${issue.text}</p><div class="actions"><button data-development-report="${i}">${issue.action==='growth'?'Review development':issue.action==='policies'?'Review ordinances':'Review utilities'}</button>${issue.layer?`<button data-development-map="${i}">View map</button>`:''}${issue.tool?`<button data-development-plan="${i}">Plan ${({residential:'homes',commercial:'shops',industrial:'industry',powerline:'power lines',pipe:'pipes',landfill:'landfill',waterTreatment:'water treatment'})[issue.tool]}</button>`:''}</div></article>`).join('')}<p class="fine">Advice is based on current modeled conditions. It does not enact policies, spend money or advance time. Citywide averages may hide local problems.</p>${kind!=='planning'?'<button id="developmentPolicies">Compare department ordinances</button>':''}<button id="developmentBack">Back to advisors</button>`);
 document.querySelector('#developmentBack').onclick=back;
 if(kind!=='planning')document.querySelector('#developmentPolicies').onclick=()=>showOrdinanceAnalysis(ui,kind,()=>showDevelopmentAdvisor(ui,kind,back));
 for(const action of ['report','map','plan'])document.querySelectorAll('[data-development-'+action+']').forEach(button=>button.onclick=()=>{const issue=d.issues[Number(button.dataset['development'+action[0].toUpperCase()+action.slice(1)])];if(action==='report'){if(issue.action==='policies')showOrdinanceAnalysis(ui,kind,()=>showDevelopmentAdvisor(ui,kind,back));else ui[issue.action]();}else{if(action==='map')ui.setLayer(issue.layer);else ui.setTool(issue.tool);ui.close();}});
}
