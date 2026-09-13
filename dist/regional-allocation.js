// Network-local allocation. Import only the local deficit, cheapest supply
// first; exports use local surplus and honor older contracts first. These
// priorities are explicit reconstruction policy, not recovered original rules.
export function allocateUtilityContracts(deals,capacity,demand,available){
 if(!Number.isFinite(capacity)||capacity<0||!Number.isFinite(demand)||demand<0)throw Error('Invalid utility network balance.');
 const deliveries=new Map(deals.map(d=>[d.id,0])),failed=new Set();let imported=0,exported=0,deficit=Math.max(0,demand-capacity),surplus=Math.max(0,capacity-demand);
 const imports=deals.filter(d=>d.direction==='import').sort((a,b)=>a.rate-b.rate||a.id-b.id);
 for(const d of imports){const supply=available(d);if(!Number.isFinite(supply)||supply<0)throw Error('Invalid neighbor supply.');const delivered=Math.min(deficit,supply);deliveries.set(d.id,delivered);deficit-=delivered;imported+=delivered;}
 for(const d of deals.filter(d=>d.direction==='export').sort((a,b)=>a.id-b.id)){
  if(surplus<d.amount){failed.add(d.id);continue;}deliveries.set(d.id,d.amount);surplus-=d.amount;exported+=d.amount;
 }
 return{capacity:capacity+imported-exported,imported,exported,unmetDemand:deficit,deliveries,failed};
}
export const disposalContractOrder=deals=>[...deals].sort((a,b)=>a.rate-b.rate||a.id-b.id);
