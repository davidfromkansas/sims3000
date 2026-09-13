import {LANDMARKS} from './landmarks.js?v=local-city-ambience-1';
import {BUSINESSES} from './business.js?v=local-city-ambience-1';
import {REWARDS} from './rewards.js?v=local-city-ambience-1';
import {POWER_PLANTS} from './power.js?v=local-city-ambience-1';
import {RECREATION} from './recreation.js?v=local-city-ambience-1';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES};
