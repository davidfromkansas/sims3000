import {writeFileSync} from 'node:fs';
import {ASIAN_LANDMARK_GEOMETRY} from '../dist/asian-landmark-models.js';
import {rasterizeLandmark} from '../dist/landmark-models.js';
for(const type of Object.keys(ASIAN_LANDMARK_GEOMETRY))for(let rotation=0;rotation<4;rotation++)writeFileSync(new URL(`../art/architecture/asian-landmarks/${type}-${rotation}.rgba`,import.meta.url),rasterizeLandmark(type,rotation).data);
