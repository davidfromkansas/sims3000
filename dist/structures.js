import {SERVICES,civicSize} from './civic-footprints.js?v=live-scenario-comparisons-2';
import {LANDMARKS} from './landmarks.js?v=live-scenario-comparisons-2';
import {BUSINESSES} from './business.js?v=live-scenario-comparisons-2';
import {REWARDS,rewardSize} from './rewards.js?v=live-scenario-comparisons-2';
import {POWER_PLANTS} from './power.js?v=live-scenario-comparisons-2';
import {RECREATION} from './recreation.js?v=live-scenario-comparisons-2';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES,...SERVICES};

export const structureSize=t=>SERVICES[t.type]?civicSize(t):REWARDS[t.type]?rewardSize(t):STRUCTURES[t.type]?.size||1;
