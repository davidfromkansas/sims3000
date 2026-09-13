// Shared definitions for reports and scenario queries. A city-wide surplus is
// a signed supply/demand balance; disconnected neighborhoods may still lack service.
export const averageWaterPollution=c=>c.tiles.reduce((sum,t)=>sum+t.waterPollution,0)/c.tiles.length;
export function averageRoadTraffic(c){let total=0,count=0;for(const t of c.tiles)if(t.type==='road'){total+=t.traffic;count++;}return count?total/count:0;}
export const surplusPower=c=>c.stats.powerNetworks.reduce((sum,g)=>sum+g.margin,0);
export const surplusWater=c=>c.stats.waterCapacity-c.stats.waterDemand;
