import {outstandingLoanPayments} from './loan-debt.js?v=medical-research-center-1';
import {REWARDS,rewardSize,rewardRoots,rewardActive,CITY_HALL_EFFECTS} from './rewards.js?v=medical-research-center-1';
import {industrialJobs,industryPollution} from './industry.js?v=medical-research-center-1';
import {RECREATION,recreationRoots,recreationActive} from './recreation.js?v=medical-research-center-1';
import {POWER_PLANTS} from './power.js?v=medical-research-center-1';
import {civicSpending,ordinanceRevenue} from './civic.js?v=medical-research-center-1';
import {occupancy} from './utilities.js?v=medical-research-center-1';
// Loan terms from manual p. 91. Tax formula from p. 88; calibration constants are original approximations.
export const SECTORS=['residential','commercial','industrial'];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const freshFinance=()=>({taxes:{residential:7,commercial:7,industrial:7},roadFunding:100,roadCondition:100,loans:[],nextLoanId:1,totalLoanPaid:0,lastLoanPayment:0,taxesChanged:false,fundingChanged:false,monthsInSurplus:0,autoBudget:false,lastBudgetYear:0,pendingBudgetReview:null});
export function changeBudget(c,taxes,roadFunding){
 if(!taxes||SECTORS.some(s=>!Number.isFinite(taxes[s])||taxes[s]<0||taxes[s]>20)||!Number.isFinite(roadFunding)||roadFunding<0||roadFunding>150)return{ok:false,error:'Taxes must be 0–20%; road funding must be 0–150%.'};
 const f=c.finance;f.taxesChanged ||= SECTORS.some(s=>taxes[s]!==f.taxes[s]);f.fundingChanged ||= roadFunding!==f.roadFunding;f.taxes=Object.fromEntries(SECTORS.map(s=>[s,Math.round(taxes[s]*10)/10]));f.roadFunding=Math.round(roadFunding);return{ok:true};
}
export function takeLoan(c,principal){
 if(![5000,10000,15000,20000,25000].includes(principal))return{ok:false,error:'Choose a loan in §5,000 increments, up to §25,000.'};
 if(c.finance.loans.length>=10)return{ok:false,error:'Ten loans are already outstanding. Wait for a loan to mature.'};
 const loan={id:c.finance.nextLoanId++,principal,issuedMonth:c.month,paymentsMade:0};c.finance.loans.push(loan);c.funds+=principal;return{ok:true,loan:{...loan},annualPayment:principal*.15,totalPayment:principal*1.5};
}
export function loanPaymentsBetween(c,from,to){let total=0;for(const l of c.finance.loans)for(let k=l.paymentsMade+1;k<=10;k++){const due=l.issuedMonth+k*12;if(due>from&&due<=to)total+=l.principal*.15;}return total;}
export function settleLoans(c){let paid=0;for(const l of c.finance.loans){while(l.paymentsMade<10&&c.month>=l.issuedMonth+(l.paymentsMade+1)*12){const amount=l.principal*.15;c.funds-=amount;paid+=amount;l.paymentsMade++;}}c.finance.loans=c.finance.loans.filter(l=>l.paymentsMade<10);c.finance.totalLoanPaid+=paid;c.finance.lastLoanPayment=paid;return paid;}
export function advanceRoads(c){const f=c.finance;f.roadCondition=clamp(f.roadCondition+(f.roadFunding>=100?4:-(100-f.roadFunding)/20),0,100);}
export function recomputeEnvironment(c){
 const cleanAir=c.civic.ordinances.cleanAir?.8:1;const tiles=c.tiles,n=Math.sqrt(tiles.length),air=new Float64Array(tiles.length),pollution=new Float64Array(tiles.length),green=new Float64Array(tiles.length),amenity=new Float64Array(tiles.length),health=new Float64Array(tiles.length),shore=new Uint8Array(tiles.length),research=new Float64Array(tiles.length);
 function spread(t,r,fn){for(let y=Math.max(0,t.y-r);y<=Math.min(n-1,t.y+r);y++)for(let x=Math.max(0,t.x-r);x<=Math.min(n-1,t.x+r);x++){const d=Math.max(Math.abs(x-t.x),Math.abs(y-t.y));fn(y*n+x,1-d/(r+1));}}
 for(const t of tiles){
  if(t.type==='toxicWaste'&&t.root===t.y*n+t.x)spread({x:t.x+1,y:t.y+1},7,(i,f)=>{air[i]+=70*f;pollution[i]+=65*f;amenity[i]-=20*f;});
  if(POWER_PLANTS[t.type]&&t.root===t.y*n+t.x)spread(t,9,(i,f)=>{air[i]+=POWER_PLANTS[t.type].air*f;pollution[i]+=POWER_PLANTS[t.type].water*f;});
  if(t.traffic>0||t.highwayTraffic>0)spread(t,2,(i,f)=>{air[i]+=Math.min(20,(t.traffic+t.highwayTraffic)*.12)*f*cleanAir;});
  if(['airport','seaport'].includes(t.type)&&t.level)spread(t,3,(i,f)=>{air[i]+=2*f;pollution[i]+=f;});
  if(t.type==='industrial'&&t.level)spread(t,5,(i,f)=>{air[i]+=3*occupancy(t.level)*industryPollution(t)*f*cleanAir;pollution[i]+=2*occupancy(t.level)*industryPollution(t)*f;});
  if(['incinerator','wasteEnergy'].includes(t.type)&&t.burnedLastMonth>0)spread(t,7,(i,f)=>{air[i]+=(t.type==='wasteEnergy'?45:40)*Math.min(1,t.burnedLastMonth/100)*f;pollution[i]+=8*f;amenity[i]-=12*f;});
  if(t.type==='recycling')spread(t,3,(i,f)=>{amenity[i]+=2*f;});
  if(t.type==='landfill')spread(t,5,(i,f)=>{air[i]+=(5+t.garbage*.025)*f;pollution[i]+=(5+t.garbage*.04)*f;amenity[i]-=8*f;});
  if(t.waste)spread(t,2,(i,f)=>{air[i]+=Math.min(15,t.waste*.3)*f;pollution[i]+=Math.min(10,t.waste*.2)*f;});
  if(t.type==='park')spread(t,5,(i,f)=>{green[i]+=7*f;amenity[i]+=9*f;health[i]+=f;});
  if(t.nature&&!t.type)spread(t,2,(i,f)=>{green[i]+=1.5*(t.treeLevel||1)*f;amenity[i]+=(t.treeLevel||1)*f;});
  if(t.terrain==='water')spread(t,2,i=>{shore[i]=1;});
 }
 for(const t of recreationRoots(c)){if(!recreationActive(c,t))continue;const d=RECREATION[t.type],center={x:t.x+Math.floor(d.size/2),y:t.y+Math.floor(d.size/2)};spread(center,d.radius,(i,f)=>{green[i]+=d.green*f;amenity[i]+=d.amenity*f;health[i]+=d.health*f;});}
 for(const t of rewardRoots(c)){if(!rewardActive(c,t))continue;const d=REWARDS[t.type];const center={x:t.x+Math.floor(rewardSize(t)/2),y:t.y+Math.floor(rewardSize(t)/2)};spread(center,d.radius,(i,f)=>{amenity[i]+=d.amenity*f;});if(t.type==='medicalResearch'){spread(center,10,(i,f)=>{air[i]+=5.4*f;});spread(center,5,(i,f)=>{pollution[i]+=7.2*f;});spread(center,15,(i,f)=>{research[i]+=f;});}if(t.type==='cityHall'){spread(center,CITY_HALL_EFFECTS.airRadius,(i,f)=>{air[i]+=CITY_HALL_EFFECTS.air*f;});spread(center,CITY_HALL_EFFECTS.waterRadius,(i,f)=>{pollution[i]+=CITY_HALL_EFFECTS.water*f;});}}
 let totalValue=0,totalAir=0,count=0;
 for(let i=0;i<tiles.length;i++){const t=tiles[i];t.recreationHealth=Math.min(5,health[i]);t.airPollution=clamp(air[i]-Math.min(20,green[i]),0,100);t.waterPollution=clamp(pollution[i]-Math.min(8,green[i]*.25),0,100);t.landValue=t.radiation?1:clamp(48+Math.min(30,amenity[i])+(shore[i]?8:0)+(t.access?10:0)-t.airPollution*.45-t.waterPollution*.15-t.waste*.3-(100-c.finance.roadCondition)*.15,1,100);t.medicalResearchAura=research[i]*200/254;t.medicalResearchLandValue=!t.radiation&&['residential','commercial'].includes(t.type)?research[i]*10:0;t.landValue=clamp(t.landValue+t.medicalResearchLandValue,1,100);t.environmentLandValue=t.landValue;if(SECTORS.includes(t.type)){totalValue+=t.landValue;totalAir+=t.airPollution;count++;}}
 return{averageLandValue:count?totalValue/count:0,averagePollution:count?totalAir/count:0};
}
export function landDensityLimit(t){if(t.type==='industrial')return t.landValue>=35?3:2;return t.landValue>=75?3:t.landValue>=45?2:1;}
export function taxRevenue(c,taxes=c.finance.taxes){const result={residential:0,commercial:0,industrial:0};for(const t of c.tiles){if(!SECTORS.includes(t.type)||!t.level)continue;const population=t.type==='industrial'?industrialJobs(t):occupancy(t.level)*(t.type==='residential'?8:6);const rate=taxes[t.type]/100;result[t.type]+=rate*population*t.landValue*.12*(t.type==='industrial'&&t.industry==='clean'&&c.civic.ordinances.cleanWater?.85:1);}return Object.fromEntries(SECTORS.map(s=>[s,Math.round(result[s])]));}
export function budgetForecast(c,taxes=c.finance.taxes,roadFunding=c.finance.roadFunding){
 const ordinanceIncome=Object.values(ordinanceRevenue(c)).reduce((a,b)=>a+b,0),revenues=taxRevenue(c,taxes),income=(c.stats.businessIncome||0)+ordinanceIncome+Object.values(revenues).reduce((a,b)=>a+b,0)+(c.stats.transitFare||0)+(c.stats.regionIncome||0),s=c.stats;
 const spending={rewards:s.rewardUpkeep||0,neighbors:c.stats.regionExpense||0,...civicSpending(c),facilities:c.stats.facilityUpkeep||0,transit:(c.stats.transitExpense||0)+(s.railTunnelTiles||0)*.2*c.transport.funding/100,roads:Math.round(((s.roads+(s.roadTunnelTiles||0))*.4+((s.highwayTiles||0)+(s.highwayTunnelTiles||0))*.8+(s.ramps||0))*roadFunding/100),parks:s.parks+(s.recreationUpkeep||0),power:s.powerUpkeep??s.plants*60,water:Math.round((s.waterUpkeep??s.pumps*15)+s.pipes*.02),garbage:Math.round(s.landfillTiles*.3+(s.wasteUpkeep||0))};
 const expenses=Object.values(spending).reduce((a,b)=>a+b,0),balance=income-expenses,monthsLeft=12-c.month%12,yearDebtDue=loanPaymentsBetween(c,c.month,c.month+monthsLeft);
 return{ordinanceIncome,revenues,income,spending,expenses,balance,monthsLeft,yearDebtDue,projectedYearEnd:c.funds+balance*monthsLeft-yearDebtDue,annualOperatingBalance:balance*12,nextYearDebtDue:loanPaymentsBetween(c,c.month,c.month+12),totalOutstandingPayments:outstandingLoanPayments(c)};
}
export function validateFinance(f,month,version=23){
 if(!f||!f.taxes||SECTORS.some(s=>!Number.isFinite(f.taxes[s])||f.taxes[s]<0||f.taxes[s]>20)||!Number.isInteger(f.roadFunding)||f.roadFunding<0||f.roadFunding>150||!Number.isFinite(f.roadCondition)||f.roadCondition<0||f.roadCondition>100||!Array.isArray(f.loans)||f.loans.length>10||!Number.isInteger(f.nextLoanId)||f.nextLoanId<1||!Number.isFinite(f.totalLoanPaid)||f.totalLoanPaid<0||!Number.isFinite(f.lastLoanPayment)||f.lastLoanPayment<0||!Number.isInteger(f.monthsInSurplus)||f.monthsInSurplus<0)throw Error('Invalid budget or loan data.');
 if(version>=23&&(typeof f.autoBudget!=='boolean'||!Number.isInteger(f.lastBudgetYear)||f.lastBudgetYear<0||f.lastBudgetYear>month||f.lastBudgetYear%12!==0||f.pendingBudgetReview!==null&&(!Number.isInteger(f.pendingBudgetReview)||f.pendingBudgetReview<=0||f.pendingBudgetReview!==f.lastBudgetYear)))throw Error('Invalid annual budget review.');
 const ids=new Set();for(const l of f.loans){if(!l||!Number.isInteger(l.id)||l.id<1||l.id>=f.nextLoanId||ids.has(l.id)||![5000,10000,15000,20000,25000].includes(l.principal)||!Number.isInteger(l.issuedMonth)||l.issuedMonth<0||l.issuedMonth>month||!Number.isInteger(l.paymentsMade)||l.paymentsMade<0||l.paymentsMade>9||l.paymentsMade!==Math.floor((month-l.issuedMonth)/12))throw Error('Invalid loan schedule.');ids.add(l.id);}
 return{...freshFinance(),taxes:Object.fromEntries(SECTORS.map(s=>[s,f.taxes[s]])),roadFunding:f.roadFunding,roadCondition:f.roadCondition,loans:f.loans.map(l=>({id:l.id,principal:l.principal,issuedMonth:l.issuedMonth,paymentsMade:l.paymentsMade})),nextLoanId:f.nextLoanId,totalLoanPaid:f.totalLoanPaid,lastLoanPayment:f.lastLoanPayment,taxesChanged:f.taxesChanged===true,fundingChanged:f.fundingChanged===true,monthsInSurplus:f.monthsInSurplus,autoBudget:version>=23?f.autoBudget:true,lastBudgetYear:version>=23?f.lastBudgetYear:Math.floor(month/12)*12,pendingBudgetReview:version>=23?f.pendingBudgetReview:null};
}

export function queueBudgetReview(c){
 const f=c.finance;
 if(!c.month||c.month%12||c.month<=f.lastBudgetYear)return false;
 f.lastBudgetYear=c.month;
 if(f.autoBudget&&c.funds>=0)return false;
 f.pendingBudgetReview=c.month;return true;
}
export function annualAccounts(c,month=c.finance.pendingBudgetReview){
 if(!month)return null;
 const rows=c.history.filter(h=>h.month>month-12&&h.month<=month);
 return{year:(c.startYear||1950)+month/12-1,months:rows.length,disasterRelief:rows.reduce((sum,h)=>sum+(h.disasterRelief||0),0),income:rows.reduce((s,h)=>s+h.income,0),expenses:rows.reduce((s,h)=>s+h.expenses,0),loanPayments:rows.reduce((s,h)=>s+(h.loanPayment||0),0),penalties:rows.reduce((s,h)=>s+(h.regionalPenalty||0),0),funds:rows.at(-1)?.funds??c.funds};
}
export function setAutoBudget(c,value){if(typeof value!=='boolean')return{ok:false,error:'Choose a valid Auto Budget setting.'};c.finance.autoBudget=value;return{ok:true};}
