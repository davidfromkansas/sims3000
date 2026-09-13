import {populationCohorts,populationCensus} from './demographics.js?v=age-teaching-1';
// Manual pp.68,112–113: education differs by age and follows graduates into adulthood.
// Learning, newborn and migrant EQ are original calibration; aging uses actual census flows.
export const EDUCATION_AGES=['0–14','15–24','25–34','35–44','45–54','55–64','65–74','75+'];
export const initialAgeEducation=(youth=40,adult=40)=>[youth,youth,...Array(6).fill(adult)];
const clamp=n=>Math.max(0,Math.min(100,n));
export function educationWeights(c,population=c.stats.population){const counts=populationCohorts(c,population),young=counts[0]+counts[1];return{counts,youth:population?young/population:0,adult:population?(population-young)/population:0};}
// Age cutoffs follow our eight-band census; they are reconstruction calibration.
export function educationServiceDemand(c,type,population=c.stats.population){
 const {counts,adult}=educationWeights(c,population);
 if(type==='school')return{share:population?counts[0]/population:0,field:'childEducationCoverage',group:'children aged 0–14'};
 if(type==='college')return{share:population?counts[1]/population:0,field:'collegeEducationCoverage',group:'young residents aged 15–24'};
 return{share:adult,field:'adultEducationCoverage',group:'adult residents aged 25+'};
}
export function refreshEducationAverages(c,population=c.stats.population){if(!population)return;const f=c.civic,{counts,youth,adult}=educationWeights(c,population),average=(start,end,fallback)=>{const active=f.ageEducation.slice(start,end).filter((_,i)=>counts[start+i]>0);if(active.length&&active.every(eq=>eq===active[0]))return active[0];let people=0,total=0;for(let i=start;i<end;i++){people+=counts[i];total+=counts[i]*f.ageEducation[i];}return people?clamp(total/people):fallback;};f.youthEducation=average(0,2,f.youthEducation);f.adultEducation=average(2,8,f.adultEducation);f.education=f.youthEducation===f.adultEducation?f.youthEducation:clamp(f.youthEducation*youth+f.adultEducation*adult);}
export function advanceEducation(c){const f=c.civic,s=c.stats;if(!s.population)return;
 const bonus=(s.activeUniversity?10:0)+(f.ordinances.reading?5:0)+(f.ordinances.juniorSports?3:0),targets=[s.childEducationCoverage||0,s.collegeEducationCoverage||0].map(coverage=>clamp(30+coverage*.7+bonus));
 const retention=Math.min(1,(s.adultEducationCoverage||0)/100);
 // Teaching/retention happen before the census moves the graduating intake.
 f.ageEducation=f.ageEducation.map((eq,i)=>i<2?clamp(eq+(targets[i]-eq)/36):clamp(eq*(1-(1-retention)/1200)));
 refreshEducationAverages(c);
}
export function advanceEducationCohorts(c,movement){
 if(!movement)return;
 const {survivors,out,births,aged,arrivals}=movement,previous=c.civic.ageEducation;
 c.civic.ageEducation=previous.map((eq,i)=>{
  const incoming=i?out[i-1]:births,incomingEQ=i?previous[i-1]:30;
  const people=aged[i]+arrivals[i];
  // Departures are proportional within each age band, so its average stays unchanged.
  // An empty band supplies no knowledge to its future residents.
  return people?clamp(((survivors[i]-out[i])*eq+incoming*incomingEQ+arrivals[i]*(i<2?30:40))/people):eq;
 });
 refreshEducationAverages(c);
}
export function educationReport(c){const f=c.civic,s=c.stats,census=populationCensus(c),weights=educationWeights(c),fmt=n=>(n||0).toFixed(1);return `<details><summary>Education · learning across ages</summary><div class="table-scroll"><table><thead><tr><th>Age band</th><th>Residents</th><th>Education / 100</th><th>Learning environment</th></tr></thead><tbody>${EDUCATION_AGES.map((age,i)=>`<tr><td>${age}</td><td>${census.rows[i].people.toLocaleString()}</td><td><meter min="0" max="100" value="${f.ageEducation[i]}" aria-label="Education for ages ${age}"></meter> ${fmt(f.ageEducation[i])}</td><td>${i===0?'Schools':i===1?'Colleges':'Libraries and museums'}</td></tr>`).join('')}</tbody></table></div><p>City average: ${fmt(f.education)} EQ. Young residents: ${fmt(f.youthEducation)} EQ, with ${fmt(s.schoolCoverage)}% combined teaching access. School access (ages 0–14): ${fmt(s.childEducationCoverage)}%; college access (ages 15–24): ${fmt(s.collegeEducationCoverage)}%. Adults: ${fmt(f.adultEducation)} EQ, with ${fmt(s.adultEducationCoverage)}% retention access.</p><p>Schools teach the 0–14 band; colleges teach the 15–24 band. One cannot supply the other group’s teaching places. As they age, they carry that education into the next group. Poor schooling can therefore affect the workforce for decades. Libraries and museums slow adults’ loss of knowledge; they do not replace childhood teaching. Junior Sports raises the youth target by three points.</p><p>Buildings need power, road access and education funding. Age bands retain education history. Overall EQ is weighted by the current age census: ${fmt(weights.youth*100)}% young residents and ${fmt(weights.adult*100)}% adults. Each band contributes in proportion to its residents. Each facility shares its funded capacity among road-connected residents in its age group. The age cutoffs and participation of the entire band are reconstruction estimates. Graduates carry their current EQ into the next band, weighted by how many people actually move. Births enter at 30 EQ; newcomers enter at 30 youth EQ or 40 adult EQ. Deaths and departures remove a proportional share of each band’s knowledge. These entry values and learning rates are reconstruction estimates. Empty bands contribute no knowledge to later arrivals.</p></details>`;}
