// Manual p.91: catastrophic disasters may receive aid, with better treatment
// for prepared mayors. Thresholds, weights and amounts below are original tuning.
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const counters=e=>({destroyed:e.destroyed,displaced:e.displaced,infrastructure:e.infrastructureLost||0,vegetation:e.vegetationLost||0});
export const freshDisasterRelief=()=>({pending:null,last:null,total:0,unrecorded:0});
export function beginReliefAssessment(c){
 const e=c.emergency,homes=c.tiles.filter(t=>t.type==='residential'&&t.level>0&&!t.rubble&&!t.radiation);
 const preparedness=homes.length?Math.round(100*homes.reduce((sum,t)=>sum+.5*clamp((t.fireCoverage||0)/100,0,1)+.5*Number(!!t.watered),0)/homes.length):0;
 e.relief??=freshDisasterRelief();e.relief.pending={session:e.started,month:c.month,preparedness,...counters(e)};
}
export function reliefAward(losses,preparedness){
 if(losses.destroyed<12&&losses.displaced<64&&losses.infrastructure<16&&(losses.vegetation||0)<64)return 0;
 return Math.min(25000,Math.floor((losses.destroyed*200+losses.displaced*10+losses.infrastructure*50+(losses.vegetation||0)*25)*(.5+preparedness/200)/10)*10);
}
export function settleDisasterRelief(c){
 const e=c.emergency,r=e.relief,p=r?.pending;if(e.active||!p)return 0;
 const now=counters(e),losses=Object.fromEntries(Object.keys(now).map(k=>[k,Math.max(0,now[k]-p[k])])),eligible=reliefAward(losses,p.preparedness);
 const amount=Math.max(0,Math.min(eligible,Math.floor(1e12-c.funds),Math.floor(1e12-r.total)));
 c.funds+=amount;r.total+=amount;r.unrecorded+=amount;r.last={session:p.session,month:c.month,preparedness:p.preparedness,...losses,amount};r.pending=null;return amount;
}
export function validateDisasterRelief(v,e,version,month){
 if(version<105)return freshDisasterRelief();
 const int=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max,record=(p,pending)=>{
  if(p===null)return null;
  if(!p||Array.isArray(p)||!int(p.session,e.started)||p.session<1||!int(p.month,month)||!int(p.preparedness,100)||!int(p.destroyed,e.destroyed)||!int(p.displaced,e.displaced)||!int(p.infrastructure,e.infrastructureLost||0)||!int(p.vegetation,e.vegetationLost||0)||pending&&(!e.active||p.session!==e.started)||!pending&&(!int(p.amount,25000)||p.amount>reliefAward(p,p.preparedness)))throw Error('Invalid disaster relief assessment.');
  return{session:p.session,month:p.month,preparedness:p.preparedness,destroyed:p.destroyed,displaced:p.displaced,infrastructure:p.infrastructure,vegetation:p.vegetation,...(!pending?{amount:p.amount}:{})};
 };
 if(!v||Array.isArray(v)||!int(v.total,1e12)||!int(v.unrecorded,v.total))throw Error('Invalid disaster relief record.');
 const pending=record(v.pending,true),last=record(v.last,false);
 if(last&&(last.amount>v.total||pending&&last.session>=pending.session)||!last&&v.total!==0)throw Error('Inconsistent disaster relief history.');
 return{pending,last,total:v.total,unrecorded:v.unrecorded};
}
export function disasterReliefReport(c){
 const r=c.emergency.relief;if(!r)return '';
 const money=n=>'§'+n.toLocaleString(),p=r.pending,last=r.last;
 return `<details><summary>Disaster relief · ${money(r.total)} received</summary><p>Recovery aid is assessed once the whole emergency ends. It is a one-time treasury grant, not recurring budget revenue or a loan. It appears separately in the next monthly record and the year-end accounts.</p>${p?`<p>Current response: preparedness at the start was ${p.preparedness}%. Additional simultaneous hazards share this assessment.</p>`:''}${last?`<p>Last assessment, month ${last.month}: ${last.destroyed} destroyed buildings or trees, ${last.displaced} residents displaced and ${last.infrastructure} infrastructure losses, plus ${last.vegetation} vegetation/crop tiles lost to locusts. Starting preparedness: ${last.preparedness}%. Grant credited: <strong>${money(last.amount)}</strong>.</p>`:'<p>No completed assessment yet. Emergencies imported from older saves without a starting assessment cannot receive retrospective aid.</p>'}<p>Reconstruction tuning: an emergency qualifies with at least 12 destroyed objects, 64 displaced residents 16 infrastructure losses or 64 vegetation/crop tiles lost to locusts. The base is §200 per destroyed object + §10 per displaced resident + §50 per infrastructure loss + §25 per locust-damaged vegetation/crop tile, paid at 50–100% according to preparedness, rounded down to §10 and capped at §25,000. Preparedness gives equal weight to fire coverage and water service across occupied residential lots at the start. Treasury and lifetime grant limits may reduce the payment. Improving services during the emergency helps response but does not change that starting score.</p></details>`;
}
