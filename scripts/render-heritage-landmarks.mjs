import {writeFileSync} from 'node:fs';
import {HERITAGE_LANDMARK_GEOMETRY} from '../dist/heritage-landmark-models.js';
import {rasterizeLandmark} from '../dist/landmark-models.js';
for(const type of Object.keys(HERITAGE_LANDMARK_GEOMETRY))for(let rotation=0;rotation<4;rotation++)writeFileSync(new URL(`../art/architecture/heritage-landmarks/${type}-${rotation}.rgba`,import.meta.url),rasterizeLandmark(type,rotation).data);
