import {LANDMARKS} from './landmarks.js?v=utility-petition-analysis-1';
import {BUSINESSES} from './business.js?v=utility-petition-analysis-1';
import {REWARDS} from './rewards.js?v=utility-petition-analysis-1';
import {POWER_PLANTS} from './power.js?v=utility-petition-analysis-1';
import {RECREATION} from './recreation.js?v=utility-petition-analysis-1';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES};
