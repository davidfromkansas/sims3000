// Sequence numbers are local to a response session; spread keeps its source fire's number.
export const HAZARD_KINDS=['ufo','whirlpool','toxicCloud','spaceJunk','riot','locust','tornado','earthquake'];
export const freshEmergencyOrder=()=>({next:1,hazards:{},fires:{}});
export function recordHazard(e,kind){e.navigationOrder.hazards[kind]=e.navigationOrder.next++;}
export function recordFire(c,index,sourceOrder){const o=c.emergency.navigationOrder;o.fires[index]=sourceOrder??o.next++;}
export function validateEmergencyOrder(e,tiles,version){
 const out=freshEmergencyOrder();
 if(version<97){
  // Older files did not record cross-hazard chronology. Retain their previous navigation order.
  for(const k of HAZARD_KINDS)if(e[k])out.hazards[k]=out.next++;
  tiles.map((t,i)=>({t,i})).filter(({t})=>t.fire>0).sort((a,b)=>b.t.fireAge-a.t.fireAge||a.i-b.i).forEach(({i})=>out.fires[i]=out.next++);
  return out;
 }
 const v=e.navigationOrder,plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
 if(!plain(v)||!Number.isSafeInteger(v.next)||v.next<1||!plain(v.hazards)||!plain(v.fires))throw Error('Invalid emergency navigation order.');
 out.next=v.next;
 for(const [k,n]of Object.entries(v.hazards)){
  if(!HAZARD_KINDS.includes(k)||!Number.isSafeInteger(n)||n<1||n>=v.next)throw Error('Invalid disaster start order.');
  out.hazards[k]=n;
 }
 for(const [k,n]of Object.entries(v.fires)){
  const i=Number(k);if(!Number.isInteger(i)||String(i)!==k||i<0||i>=tiles.length||!Number.isSafeInteger(n)||n<1||n>=v.next)throw Error('Invalid fire start order.');
  out.fires[k]=n;
 }
 return out;
}
