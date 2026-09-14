// Original guide pp.338–340: 1,500 beds, 100 doctors, 15 patients per doctor.
export const HOSPITAL_BEDS=1500;
export function hospitalStaffing(funding){
 const doctors=Math.max(0,Math.min(150,funding))/100*100;
 return {beds:HOSPITAL_BEDS,doctors,capacity:Math.min(HOSPITAL_BEDS,doctors*15)};
}
export function hospitalizationRate(c){
 // Pollution uses this reconstruction's 0–100 scale (original factors / 100).
 const exposure=c.tiles.reduce((sum,t)=>sum+Math.max(0,t.airPollution||0)+Math.max(0,t.waterPollution||0),0)/(2*Math.max(1,c.tiles.length));
 return Math.min(1,.05+exposure*.000999);
}
