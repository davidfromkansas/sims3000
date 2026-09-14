import {rewardJobSites} from './rewards.js?v=architecture-collection-43';
const sectors=['residential','commercial','industrial'];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function applyDemand(stats,sector,entries,min=-100,max=100){
 const rows=stats.demandBreakdown[sector],before=stats.demand[sector],raw=entries.reduce((n,[label,amount])=>{rows.push({label,amount});return n+amount;},before),value=clamp(raw,min,max);
 if(value!==raw)rows.push({label:'Demand range adjustment',amount:value-raw});
 stats.demand[sector]=value;return value;
}
export function baseDemand(c,{pop,jobs,shops,civicJobs}){
 const exchangeJobs=rewardJobSites(c).filter(t=>t.type==='stockExchange').length*480;
 const vacant=Object.fromEntries(sectors.map(s=>[s,c.tiles.filter(t=>t.type===s&&!t.level&&(t.abandonedLevel>0||t.historicalLevel>0)).length]));
 const entries={residential:[['Baseline',40],['Available jobs',(jobs+shops+civicJobs)*.4],['Existing residents',-pop*.23],['Abandoned buildings',-vacant.residential*.7]],commercial:[['Baseline',18],['Resident customers',pop*.2],['Existing commercial jobs',-shops*.8],['Stock Exchange commercial activity',exchangeJobs?-exchangeJobs*.8:0],['Abandoned buildings',-vacant.commercial*1.4]],industrial:[['Baseline',50],['Resident workforce',pop*.28],['Existing industrial jobs',-jobs*.6],['Abandoned buildings',-vacant.industrial*1.1]]};
 const stats={demand:Object.fromEntries(sectors.map(s=>[s,0])),demandBreakdown:Object.fromEntries(sectors.map(s=>[s,[]]))};
 for(const sector of sectors){applyDemand(stats,sector,entries[sector],-80,100);applyDemand(stats,sector,[['Tax rate',(7-c.finance.taxes[sector])*8]]);}
 return stats;
}
export function demandReport(c){
 const stats=c.stats;if(!stats.demandBreakdown)return '';
 const fmt=n=>(n>0?'+':'')+n.toLocaleString('en-US',{maximumFractionDigits:2});
 return `<details><summary>Why demand rises or falls</summary><p>Positive demand supports development; negative demand discourages it. These are citywide demand points, not counts of residents or jobs. Empty zoning reserves space without adding vacancy pressure.</p>${sectors.map(sector=>`<h3>${sector[0].toUpperCase()+sector.slice(1)} · ${fmt(stats.demand[sector])}</h3><div class="table-scroll"><table><thead><tr><th scope="col">Factor</th><th scope="col">Demand points</th></tr></thead><tbody>${stats.demandBreakdown[sector].filter(r=>r.amount!==0).map(r=>`<tr><th scope="row">${r.label}</th><td>${fmt(r.amount)}</td></tr>`).join('')}<tr><th scope="row">Current demand</th><td>${fmt(stats.demand[sector])}</td></tr></tbody></table></div>`).join('')}<p>Commercial and industrial sites may have different regional access bonuses. The development list below shows their local demand. At a population or job limit, add capacity before expecting further growth. Positive demand still requires power, transport, suitable land and—at higher density—water.</p></details>`;
}
