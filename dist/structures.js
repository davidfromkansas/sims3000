import {LANDMARKS} from './landmarks.js?v=zone-growth-1';
import {BUSINESSES} from './business.js?v=zone-growth-1';
import {REWARDS} from './rewards.js?v=zone-growth-1';
import {POWER_PLANTS} from './power.js?v=zone-growth-1';
import {RECREATION} from './recreation.js?v=zone-growth-1';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES};
