import {writeFileSync} from 'node:fs';
import {CHICAGO_LANDMARK_GEOMETRY} from '../dist/chicago-landmark-models.js';
import {rasterizeLandmark} from '../dist/landmark-models.js';
for(const type of Object.keys(CHICAGO_LANDMARK_GEOMETRY))for(let rotation=0;rotation<4;rotation++)writeFileSync(new URL(`../art/architecture/chicago-landmarks/${type}-${rotation}.rgba`,import.meta.url),rasterizeLandmark(type,rotation).data);
