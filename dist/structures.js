import {LANDMARKS} from './landmarks.js?v=available-job-targets-1';
import {BUSINESSES} from './business.js?v=available-job-targets-1';
import {REWARDS} from './rewards.js?v=available-job-targets-1';
import {POWER_PLANTS} from './power.js?v=available-job-targets-1';
import {RECREATION} from './recreation.js?v=available-job-targets-1';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES};
