import {NEIGHBORS,connectionCandidates} from './region.js?v=architecture-collection-41';
const cap=s=>s[0].toUpperCase()+s.slice(1);
const same=(a,b)=>a.tile===b.tile&&a.kind===b.kind&&a.side===b.side;
export function neighborConnectionActive(c,side,kind){const registered=c.region.connections.filter(p=>p.side===side&&p.kind===kind);if(!registered.length)return 0;const available=connectionCandidates(c);return registered.some(p=>available.some(q=>same(p,q)))?1:0;}
export function neighborDealActive(c,side,kind,direction){const deals=c.region.deals.filter(d=>d.kind===kind&&d.direction===direction&&!d.failed&&c.region.connections[d.connection]?.side===side);if(!deals.length)return 0;const available=connectionCandidates(c);return deals.some(d=>available.some(p=>same(p,c.region.connections[d.connection])))?1:0;}
const state=(name,read)=>({name,direction:'equals',min:0,max:1,initial:1,integer:true,states:['Inactive','Active'],read});
export const NEIGHBOR_METRICS={};
for(const [side,name]of Object.entries(NEIGHBORS)){
 for(const kind of side==='sea'?['seaport']:['road','highway','rail','power','water'])NEIGHBOR_METRICS['connection'+cap(side)+cap(kind)]=state(name+' · '+kind+' connection',c=>neighborConnectionActive(c,side,kind));
 for(const kind of side==='sea'?['garbage']:['power','water','garbage'])for(const direction of ['import','export'])NEIGHBOR_METRICS['deal'+cap(side)+cap(kind)+cap(direction)]=state(name+' · '+direction+' '+kind+' deal',c=>neighborDealActive(c,side,kind,direction));
}
