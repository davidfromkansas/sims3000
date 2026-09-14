// Manual pp.56,124,209 describes offers and deferred placement. Thresholds are original tuning.
export const REWARDS={medicalResearch:{name:'Medical Research Center',jobs:135,size:3,cost:75000,upkeep:0,radius:15,amenity:0,months:1,requirement:'From 1975, reach 80,000 residents, life expectancy of 70 years and strong city approval (see checklist).'},cityHall:{name:'City Hall',jobs:36,size:3,cost:0,upkeep:0,radius:10,amenity:25,months:1,requirement:'At least 20,000 residents and 50 approval for one simulation month.'},mayorHouse:{jobs:4,name:"Mayor's House",size:2,cost:0,upkeep:5,sprite:57,radius:7,amenity:20,months:3,requirement:'At least 5,000 residents and 50 approval for three consecutive months.'},stadium:{jobs:200,name:'Stadium',size:5,cost:75000,upkeep:25,sprite:58,radius:16,amenity:0,months:1,requirement:'Reach 150,000 residents and strong city approval (see checklist) to receive an offer at the next monthly evaluation.'},university:{jobs:500,name:'University',size:10,cost:0,upkeep:40,sprite:59,radius:10,amenity:0,months:1,requirement:'Reach 70 EQ on the city’s 0–100 education scale to receive an offer at the next monthly evaluation.'},countyCourthouse:{name:'County Courthouse',jobs:135,size:3,cost:0,upkeep:0,radius:30,amenity:0,months:1,requirement:'Reach 25,000 residents and strong city approval (see checklist) to receive an offer at the next monthly evaluation.'}};
export const freshRewards=()=>({lastMonth:0,earned:Object.fromEntries(Object.keys(REWARDS).map(k=>[k,null])),streaks:Object.fromEntries(Object.keys(REWARDS).map(k=>[k,0]))});
// Prima introductory EQ overview and p.417: university needs 105 EQ on the original 0–150 scale,
// normalized here to 70/100; no population/college gate or purchase price.
// The reward offer and its checklist share these exact comparisons.
// Manual appendix: aura spans −127 to 127. Prima p.416 requires 100.
export const STADIUM_APPROVAL=(100+127)*100/254;
export function rewardRequirements(c,k){
 const s=c.stats, population=n=>({label:'Residents',current:s.population,target:n,met:s.population>=n}),approval=n=>({label:'Approval',current:s.aura,target:n,met:s.aura>=n});
 return k==='medicalResearch'?[{label:'Year',current:c.startYear+Math.floor(c.month/12),target:1975,met:c.startYear+Math.floor(c.month/12)>=1975},population(80000),approval(STADIUM_APPROVAL),{label:'Life expectancy',current:s.lifeExpectancy,target:70,met:s.lifeExpectancy>=70}]:k==='cityHall'?[population(20000),approval(50)]:k==='mayorHouse'?[population(5000),approval(50)]:k==='countyCourthouse'?[population(25000),approval(STADIUM_APPROVAL)]:k==='stadium'?[population(150000),approval(STADIUM_APPROVAL)]:k==='university'?[{label:'Education quotient',current:s.education,target:70,met:s.education>=70}]:[];
}
export function rewardCondition(c,k){const requirements=rewardRequirements(c,k);return requirements.length>0&&requirements.every(r=>r.met);}
export function rewardProgress(c,k){
 const d=REWARDS[k];if(!d)throw Error('Unknown reward.');
 const requirements=rewardRequirements(c,k),earned=c.rewards.earned[k]!==null,placed=c.tiles.some(t=>t.type===k),qualifying=requirements.every(r=>r.met),streak=c.rewards.streaks[k];
 const remaining=Math.max(0,d.months-(qualifying?streak:0));
 const next=placed?'Already placed. You can rebuild if it is demolished or destroyed.':earned?'Your offer is saved. You can place this reward whenever you are ready.':qualifying?`Keep every requirement met for ${remaining} more simulation month${remaining===1?'':'s'}.`:`Meet the requirements marked Missing. ${streak>0?'The recorded streak will reset at the next monthly evaluation if a requirement is still missing.':'The consecutive-month streak begins at the next qualifying monthly evaluation.'}`;
 return {requirements,earned,placed,qualifying,streak,remaining,next};
}
export function advanceRewards(c){if(c.rewards.lastMonth>=c.month)return[];c.rewards.lastMonth=c.month;const unlocked=[];for(const [k,d]of Object.entries(REWARDS)){if(c.rewards.earned[k]!==null)continue;c.rewards.streaks[k]=rewardCondition(c,k)?Math.min(d.months,c.rewards.streaks[k]+1):0;if(c.rewards.streaks[k]>=d.months){c.rewards.earned[k]=c.month;unlocked.push(k);}}return unlocked;}
export function rewardRoots(c){const n=Math.sqrt(c.tiles.length);return c.tiles.filter(t=>REWARDS[t.type]&&t.root===t.y*n+t.x);}
export function rewardActive(c,t){const members=c.tiles.filter(u=>u.root===t.root);return members.every(u=>u.powered&&!u.fire&&!u.rubble&&!u.radiation)&&members.some(u=>u.roadIds?.length)&&c.finance.roadCondition>20;}
export function rewardStats(c){const roots=rewardRoots(c),active=roots.filter(t=>rewardActive(c,t));return{rewardUpkeep:roots.reduce((sum,t)=>sum+REWARDS[t.type].upkeep,0),activeStadium:active.some(t=>t.type==='stadium'),activeUniversity:active.some(t=>t.type==='university')};}
export function validateRewards(v,month,version=136){if(!v||!Number.isInteger(v.lastMonth)||v.lastMonth<0||v.lastMonth>month||!v.earned||!v.streaks)throw Error('Invalid reward history.');const out=freshRewards();out.lastMonth=v.lastMonth;for(const [k,d]of Object.entries(REWARDS)){if(k==='medicalResearch'&&version<136){if(v.earned[k]!=null||v.streaks[k]!=null&&v.streaks[k]!==0)throw Error('Medical Research Center requires save version 136.');continue;}if(k==='countyCourthouse'&&version<134){if(v.earned[k]!=null||v.streaks[k]!=null&&v.streaks[k]!==0)throw Error('County Courthouse requires save version 134.');continue;}if(k==='cityHall'&&version<123){if(v.earned[k]!=null||v.streaks[k]!=null&&v.streaks[k]!==0)throw Error('City Hall requires save version 123.');continue;}const earned=v.earned[k],streak=v.streaks[k],legacy=k==='university'&&version<131||k==='stadium'&&version<133,limit=legacy?6:d.months;if(earned!==null&&(!Number.isInteger(earned)||earned<0||earned>month)||!Number.isInteger(streak)||streak<0||streak>limit)throw Error('Invalid reward history.');out.earned[k]=earned;out.streaks[k]=legacy?(earned===null?0:1):streak;}return out;}

export const REWARD_JOB_TYPES=Object.keys(REWARDS).filter(key=>REWARDS[key].jobs>0);
export function rewardJobSites(c){return rewardRoots(c).filter(t=>REWARDS[t.type].jobs>0&&rewardActive(c,t));}

// Prima reward directory p.409: crime -20/20 tiles, air 450/10, water 450/5.
// Pollution intensity is divided by 100 for this reconstruction's 0–100 scale.
export const CITY_HALL_EFFECTS={crime:20,crimeRadius:20,air:4.5,airRadius:10,water:4.5,waterRadius:5};
export function activeCityHalls(c){return rewardRoots(c).filter(t=>t.type==='cityHall'&&rewardActive(c,t));}
export function cityHallCrimeRelief(halls,t){return halls.reduce((sum,h)=>sum+CITY_HALL_EFFECTS.crime*Math.max(0,1-Math.hypot(t.x-h.x-1,t.y-h.y-1)/CITY_HALL_EFFECTS.crimeRadius),0);}

// Pre-132 campuses retain their original 4×4 lot; new campuses store 10.
export const rewardSize=t=>t.type==='university'?(t.universitySize??4):t.type==='stadium'?(t.stadiumSize??4):REWARDS[t.type]?.size||1;

// Prima courthouse directory p.410: 135 jobs and crime reduction 30 / radius 30.
export const activeCourthouses=c=>rewardRoots(c).filter(t=>t.type==='countyCourthouse'&&rewardActive(c,t));
export const courthouseCrimeRelief=(courts,t)=>courts.reduce((sum,h)=>sum+30*Math.max(0,1-Math.hypot(t.x-h.x-1,t.y-h.y-1)/30),0);
