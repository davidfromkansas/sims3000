import {LANDMARKS} from './landmarks.js?v=script-clipboard-2';
import {BUSINESSES} from './business.js?v=script-clipboard-2';
import {REWARDS} from './rewards.js?v=script-clipboard-2';
import {POWER_PLANTS} from './power.js?v=script-clipboard-2';
import {RECREATION} from './recreation.js?v=script-clipboard-2';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES};
