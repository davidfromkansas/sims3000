import assert from 'node:assert/strict';
import {buildingPlaneGuide,drawBuildingPlaneGuide} from '../dist/building-plane-guide.js';
import {BUILDING_EDIT_PLANES} from '../dist/building-edit-planes.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
for(const [plane,p]of Object.entries(BUILDING_EDIT_PLANES))for(let slice=0;slice<p.slices;slice++){
 const base=buildingPlaneGuide({plane,slice});assert.equal(base.length,1);const axis=plane==='horizontal'?2:plane==='xz'?1:0;assert.equal(new Set(base[0].points.map(point=>point[axis])).size,1,'guide lies on the chosen cross-section');
 const cells=buildingPlaneGuide({plane,slice,pending:{kind:'plane',start:0,end:p.rows*10-1}});assert.equal(cells.length,1+p.rows*10);assert.ok(cells.slice(1).every(f=>f.points.every(point=>point[axis]===base[0].points[0][axis])),'preview cells share the selected plane');
 for(let rotation=0;rotation<4;rotation++)for(const footprint of [{width:1,height:1},{width:4,height:1},{width:1,height:4},{width:4,height:4}]){let balance=0,strokes=0;const points=[],ctx={save(){balance++;},restore(){balance--;},beginPath(){},closePath(){},fill(){},stroke(){strokes++;},moveTo(x,y){points.push([x,y]);},lineTo(x,y){points.push([x,y]);}};drawBuildingPlaneGuide(ctx,{...defaultBuildingDesign(),footprint},{plane,slice,pending:{kind:'line',start:0,end:p.rows*10-1}},rotation);assert.equal(balance,0);assert.ok(strokes>=2);assert.ok(points.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=256&&y>=0&&y<=384));}
}
assert.deepEqual(buildingPlaneGuide(null),[]);assert.deepEqual(buildingPlaneGuide({plane:'xz',slice:10}),[]);assert.deepEqual(buildingPlaneGuide({plane:'bad',slice:0}),[]);
console.log('PASS: colored guide geometry for every plane/slice, coplanar pending selections, all rotations and footprint bounds, balanced drawing state and invalid/absent guide suppression.');
