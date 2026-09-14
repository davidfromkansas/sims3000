import {civicSize} from './civic-footprints.js?v=architecture-collection-36';
// Shared base consumption used by network allocation and scenario queries.
import {occupancy,WATER_STRUCTURES} from './utilities.js?v=architecture-collection-36';
import {SERVICES} from './civic.js?v=architecture-collection-36';
import {FACILITIES} from './facilities.js?v=architecture-collection-36';
import {BUSINESSES} from './business.js?v=architecture-collection-36';
import {REWARDS} from './rewards.js?v=architecture-collection-36';
const isZone=t=>['residential','commercial','industrial'].includes(t.type);
export const powerBaseNeed=t=>isZone(t)?1+occupancy(t.level):FACILITIES[t.type]||BUSINESSES[t.type]||REWARDS[t.type]?3:SERVICES[t.type]?8/civicSize(t)**2:WATER_STRUCTURES[t.type]||t.type==='recycling'?8:0;
export const waterBaseNeed=t=>isZone(t)?1+occupancy(t.level)*3:FACILITIES[t.type]?3:0;
