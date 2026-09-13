// Per-recompute availability index shared by road and rail allocation. Counts
// track workplaces, not floating-point job totals, so exact exhaustion is stable.
export class JobCapacity extends Map {
 constructor(entries,workplaceGroups,onExhausted=null){super();this.onExhausted=onExhausted;this.workplaceGroups=workplaceGroups;this.openCount=0;this.roadGroups=new Map();for(const [work,count]of entries)this.set(work,count);}
 set(work,count){const was=(this.get(work)||0)>0,now=count>0;if(was!==now){const delta=now?1:-1;this.openCount+=delta;for(const group of this.workplaceGroups.get(work)||[])this.roadGroups.set(group,(this.roadGroups.get(group)||0)+delta);}const result=super.set(work,count);if(was&&!now)this.onExhausted?.(work);return result;}
 hasRoadJobs(groups){for(const group of groups)if(this.roadGroups.get(group)>0)return true;return false;}
}
