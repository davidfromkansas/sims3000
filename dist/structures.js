import {LANDMARKS} from './landmarks.js?v=building-preview-navigation-2';
import {BUSINESSES} from './business.js?v=building-preview-navigation-2';
import {REWARDS} from './rewards.js?v=building-preview-navigation-2';
import {POWER_PLANTS} from './power.js?v=building-preview-navigation-2';
import {RECREATION} from './recreation.js?v=building-preview-navigation-2';
// Fixed-footprint ploppable structures share construction, damage and save validation.
export const STRUCTURES={...LANDMARKS,...POWER_PLANTS,...RECREATION,...REWARDS,...BUSINESSES};
