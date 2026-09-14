import {SERVICES,civicSize} from './civic-footprints.js?v=police-presence-1';
import {LANDMARKS} from './landmarks.js?v=police-presence-1';
import {BUSINESSES} from './business.js?v=police-presence-1';
import {REWARDS} from './rewards.js?v=police-presence-1';
import {POWER_PLANTS} from './power.js?v=police-presence-1';
import {RECREATION} from './recreation.js?v=police-presence-1';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES,...SERVICES};

export const structureSize=t=>SERVICES[t.type]?civicSize(t):STRUCTURES[t.type]?.size||1;
