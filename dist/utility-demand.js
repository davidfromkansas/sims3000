import {civicSize} from './civic-footprints.js?v=country-club-1';
// Shared base consumption used by network allocation and scenario queries.
import {occupancy,WATER_STRUCTURES} from './utilities.js?v=country-club-1';
import {SERVICES} from './civic.js?v=country-club-1';
import {FACILITIES} from './facilities.js?v=country-club-1';
import {BUSINESSES} from './business.js?v=country-club-1';
import {REWARDS} from './rewards.js?v=country-club-1';
const isZone=t=>['residential','commercial','industrial'].includes(t.type);
export const powerBaseNeed=t=>isZone(t)?1+occupancy(t.level):FACILITIES[t.type]||BUSINESSES[t.type]||REWARDS[t.type]?3:SERVICES[t.type]?8/civicSize(t)**2:WATER_STRUCTURES[t.type]||t.type==='recycling'?8:0;
export const waterBaseNeed=t=>isZone(t)?1+occupancy(t.level)*3:FACILITIES[t.type]?3:0;
