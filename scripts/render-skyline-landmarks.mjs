import {writeFileSync} from 'node:fs';
import {SKYLINE_LANDMARK_GEOMETRY} from '../dist/skyline-landmark-models.js';
import {rasterizeLandmark} from '../dist/landmark-models.js';
for(const type of Object.keys(SKYLINE_LANDMARK_GEOMETRY))for(let rotation=0;rotation<4;rotation++)writeFileSync(new URL(`../art/architecture/skyline-landmarks/${type}-${rotation}.rgba`,import.meta.url),rasterizeLandmark(type,rotation).data);
