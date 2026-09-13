import {LANDMARKS} from './landmarks.js?v=original-music-1';
import {BUSINESSES} from './business.js?v=original-music-1';
import {REWARDS} from './rewards.js?v=original-music-1';
import {POWER_PLANTS} from './power.js?v=original-music-1';
import {RECREATION} from './recreation.js?v=original-music-1';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES};
