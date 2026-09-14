import {isCivicRoot} from './civic-footprints.js?v=county-courthouse-1';
import {REWARDS,rewardRoots,rewardActive} from './rewards.js?v=county-courthouse-1';
import {RECREATION,recreationRoots,recreationActive} from './recreation.js?v=county-courthouse-1';
import {occupancy} from './utilities.js?v=county-courthouse-1';
// Prima pp.163–165: residential base 25,000 and additive cap relief.
export const RESIDENTIAL_RELIEF={park:250,largePark:2250,fountain:250,pond:1000,playground:1000,marina:9000,zoo:24000,sportsPark:4000,library:7000,museum:9000,cityHall:9000,mayorHouse:6000,stadium:125000};
export function residentialCap(c,population=c.stats.population||0){
 const sources=[],add=t=>{const amount=RESIDENTIAL_RELIEF[t.type];if(amount)sources.push({type:t.type,name:REWARDS[t.type]?.name||RECREATION[t.type]?.name||(t.type==='park'?'Small park':t.type==='museum'?'Museum':'Library'),x:t.x,y:t.y,amount});};
 for(const t of c.tiles)if(t.type==='park'&&!t.fire&&!t.rubble&&!t.radiation||['library','museum'].includes(t.type)&&isCivicRoot(t)&&t.serviceActive&&!t.fire&&!t.rubble&&!t.radiation)add(t);
 for(const t of recreationRoots(c))if(recreationActive(c,t))add(t);
 for(const t of rewardRoots(c))if(rewardActive(c,t))add(t);
 const relief=sources.reduce((sum,s)=>sum+s.amount,0),limit=25000+relief;
 return{base:25000,relief,limit,population,remaining:Math.max(0,limit-population),sources};
}
export function residentialGrowthFits(c,t,members){if(t.type!=='residential'||!c.stats.residentialCap)return true;return members.length*(occupancy(t.level+1)-occupancy(t.level))*8<=c.stats.residentialCap.remaining;}
export function residentialCapReport(c){const cap=c.stats.residentialCap;if(!cap)return'';const grouped=new Map();for(const s of cap.sources){const row=grouped.get(s.type)||{name:s.name,count:0,amount:0};row.count++;row.amount+=s.amount;grouped.set(s.type,row);}const fmt=n=>n.toLocaleString('en-US');return `<details id="residentialCapReport"><summary>Residential growth capacity · ${fmt(cap.population)} / ${fmt(cap.limit)}</summary><p>Base capacity: ${fmt(cap.base)} residents. Parks, recreation, operating libraries, museums and selected rewards add ${fmt(cap.relief)}. Room for ${fmt(cap.remaining)} more residents.</p>${grouped.size?`<ul>${[...grouped.values()].map(s=>`<li>${s.name} × ${s.count}: +${fmt(s.amount)}</li>`).join('')}</ul>`:'<p>No capacity-raising facilities are active.</p>'}<p>At the limit, new residential growth waits for more capacity. Existing residents stay unless other conditions cause abandonment. Capacity alone does not create jobs, services or demand.</p></details>`;}
