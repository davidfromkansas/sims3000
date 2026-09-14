import {SERVICES,civicSize} from './civic-footprints.js?v=architecture-collection-47';
import {LANDMARKS} from './landmarks.js?v=architecture-collection-47';
import {BUSINESSES} from './business.js?v=architecture-collection-47';
import {REWARDS,rewardSize} from './rewards.js?v=architecture-collection-47';
import {POWER_PLANTS} from './power.js?v=architecture-collection-47';
import {RECREATION} from './recreation.js?v=architecture-collection-47';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES,...SERVICES};

export const structureSize=t=>SERVICES[t.type]?civicSize(t):REWARDS[t.type]?rewardSize(t):STRUCTURES[t.type]?.size||1;
