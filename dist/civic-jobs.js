import {civicRoots} from './civic-footprints.js?v=courtyard-apartments-1';
import {civicServiceOperating} from './civic.js?v=courtyard-apartments-1';
import {REWARDS,rewardJobSites} from './rewards.js?v=courtyard-apartments-1';
// Prima p.158: civic employment. Each facility contributes jobs once, regardless of lot size.
export const SERVICE_JOBS={police:45,fire:45,hospital:45,school:45,jail:45,college:45,library:20,museum:45};
export const CIVIC_JOB_TYPES=[...Object.keys(SERVICE_JOBS),...Object.keys(REWARDS).filter(k=>REWARDS[k].jobs>0)];
export const civicJobCapacity=t=>SERVICE_JOBS[t.type]??REWARDS[t.type]?.jobs??0;
export function civicJobSites(c){return [...rewardJobSites(c),...civicRoots(c).filter(t=>civicServiceOperating(c,t))];}
