import {LANDMARKS} from './landmarks.js?v=policy-petitions-1';
import {BUSINESSES} from './business.js?v=policy-petitions-1';
import {REWARDS} from './rewards.js?v=policy-petitions-1';
import {POWER_PLANTS} from './power.js?v=policy-petitions-1';
import {RECREATION} from './recreation.js?v=policy-petitions-1';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES};
