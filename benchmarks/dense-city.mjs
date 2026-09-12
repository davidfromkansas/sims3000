// Synthetic routing/pipe stress case, not a naturally grown or fully serviced city.
// Run node benchmarks/dense-city.mjs 256; wall-clock values are informational only.
import {createCity,recompute,tick} from '../dist/engine.js';
const size=Number(process.argv[2]||96),c=createCity('Dense benchmark',false,size);
for(const t of c.tiles){t.terrain='land';t.elevation=0;t.tree=false;const road=t.x%6===0||t.y%6===0;Object.assign(t,{type:road?'road':t.x%12<6?'residential':t.y%12<6?'industrial':'commercial',level:road?0:3,density:3,pipe:true});}
const start=performance.now();recompute(c);console.log(JSON.stringify({size,phase:'recompute',ms:performance.now()-start,population:c.stats.population,jobs:c.stats.jobs}));const s=performance.now();tick(c);console.log(JSON.stringify({size,phase:'tick',ms:performance.now()-s,population:c.stats.population}));
