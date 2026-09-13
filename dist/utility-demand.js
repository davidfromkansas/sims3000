// Shared base consumption used by network allocation and scenario queries.
import {occupancy,WATER_STRUCTURES} from './utilities.js?v=garbage-health-1';
import {SERVICES} from './civic.js?v=garbage-health-1';
import {FACILITIES} from './facilities.js?v=garbage-health-1';
import {BUSINESSES} from './business.js?v=garbage-health-1';
import {REWARDS} from './rewards.js?v=garbage-health-1';
const isZone=t=>['residential','commercial','industrial'].includes(t.type);
export const powerBaseNeed=t=>isZone(t)?1+occupancy(t.level):FACILITIES[t.type]||BUSINESSES[t.type]||REWARDS[t.type]?3:WATER_STRUCTURES[t.type]||SERVICES[t.type]||t.type==='recycling'?8:0;
export const waterBaseNeed=t=>isZone(t)?1+occupancy(t.level)*3:FACILITIES[t.type]?3:0;
