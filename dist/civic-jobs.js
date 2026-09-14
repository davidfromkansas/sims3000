import {SERVICES,civicServiceOperating} from './civic.js?v=reward-jobs-1';
import {REWARDS,rewardJobSites} from './rewards.js?v=reward-jobs-1';
// Prima p.158: civic employment. Each service currently occupies one tile.
export const SERVICE_JOBS={police:45,fire:45,hospital:45,school:45,jail:45,college:45,library:20,museum:45};
export const CIVIC_JOB_TYPES=[...Object.keys(SERVICE_JOBS),...Object.keys(REWARDS).filter(k=>REWARDS[k].jobs>0)];
export const civicJobCapacity=t=>SERVICE_JOBS[t.type]??REWARDS[t.type]?.jobs??0;
export function civicJobSites(c){return [...rewardJobSites(c),...c.tiles.filter(t=>SERVICES[t.type]&&civicServiceOperating(c,t))];}
