import assert from 'node:assert/strict';
import {connectedBuildingSurfaces} from '../dist/building-surface-fill.js';
import {projectedBuildingSurfaces} from '../dist/building-surface-picking.js';
import {paintFloorSurfaces,surfaceLevel} from '../dist/building-floor-paint.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
const d={...defaultBuildingDesign(),blocks:Array(100).fill(0)};for(let y=2;y<=6;y++)for(let x=2;x<=6;x++)d.blocks[y*10+x]=6;
for(let rotation=0;rotation<4;rotation++){
 const surfaces=projectedBuildingSurfaces(d,rotation),wall=surfaces.find(f=>f.side!==4),roof=surfaces.find(f=>f.side===4);
 const plane=connectedBuildingSurfaces(d,surfaces,wall);assert.equal(plane.length,30);assert.ok(plane.every(f=>f.side===wall.side));assert.equal(connectedBuildingSurfaces(d,surfaces,roof).length,25);
 const stripe=plane.filter(f=>surfaceLevel(f)===2),striped={...d,surfacePaint:paintFloorSurfaces(d,stripe,1)};
 assert.equal(connectedBuildingSurfaces(striped,surfaces,plane.find(f=>surfaceLevel(f)===0)).length,10,'material stripe stops vertical wall fill');assert.equal(connectedBuildingSurfaces(striped,surfaces,stripe[0]).length,5);assert.equal(connectedBuildingSurfaces(striped,surfaces,plane.find(f=>surfaceLevel(f)===5)).length,15);
 assert.equal(connectedBuildingSurfaces(d,surfaces,null).length,0);
}
// Two roofs touching only at a corner remain separate; height steps do too.
const roofs={...d,blocks:Array(100).fill(0)};roofs.blocks[11]=3;roofs.blocks[22]=3;roofs.blocks[12]=4;const rf=projectedBuildingSurfaces(roofs);assert.equal(connectedBuildingSurfaces(roofs,rf,rf.find(f=>f.index===11&&f.side===4)).length,1);
// Independent layers with an air gap do not let fill jump to an upper wall.
const layers={...defaultBuildingDesign(),voxels:Array(100).fill(0)};layers.voxels[44]=0b11011;layers.voxels[54]=0b11011;
const faces=projectedBuildingSurfaces(layers),low=faces.find(f=>f.side===1&&surfaceLevel(f)===0);assert.equal(connectedBuildingSurfaces(layers,faces,low).length,4);assert.equal(connectedBuildingSurfaces(layers,faces,faces.find(f=>f.side===4&&surfaceLevel(f)===1)).length,2);
assert.equal(layers.surfacePaint,undefined,'finding a fill never mutates model paint');
console.log('PASS: connected wall and roof fill in all rotations, material boundaries, corner separation, roof elevation steps and independent-layer gaps.');
