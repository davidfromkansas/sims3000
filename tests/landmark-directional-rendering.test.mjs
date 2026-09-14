import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LANDMARKS} from '../dist/landmarks.js';
import {MODELED_LANDMARKS,landmarkGeometry,rasterizeLandmark,drawLandmarkModel} from '../dist/landmark-models.js';
import {CityRenderer} from '../dist/renderer.js';
import {createCity,build} from '../dist/engine.js';
import {structureSize,STRUCTURES} from '../dist/structures.js';
assert.deepEqual([...MODELED_LANDMARKS].sort(),Object.keys(LANDMARKS).sort());
for(const type of ['eiffelTower','greatPyramid']){
 const mesh=landmarkGeometry(type);assert.ok(mesh.every(face=>face.points.every(p=>p.every(Number.isFinite))));
 for(let rotation=0;rotation<4;rotation++){
  const raster=rasterizeLandmark(type,rotation,true);let count=0;
  for(let y=0;y<848;y++)for(let x=0;x<512;x++)if(raster.data[(y*512+x)*4+3]){count++;assert.ok(x>0&&x<511&&y>0&&y<847);assert.ok(Number.isFinite(raster.depth[y*512+x]));}
  assert.ok(count>30000&&count<200000);let output;drawLandmarkModel({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:image=>output=image.data},type,rotation);assert.deepEqual(output,raster.data);
 }
}
// Exercise the renderer's actual structure branch, including the pyramid's 4x4 footprint.
const city=createCity('Directional landmarks',false);for(const t of city.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});
for(const [i,type] of Object.keys(LANDMARKS).entries())assert.ok(build(city,type,[{x:3+i%5*9,y:5+Math.floor(i/5)*10}]).ok);
const source=readFileSync(new URL('../dist/renderer.js',import.meta.url),'utf8'),body=source.split('else if(STRUCTURES[t.type]){')[1].split('}else if(WATER_STRUCTURES[t.type])')[0],calls=[];
const actual=new Function('structureSize','STRUCTURES','SERVICES','MODELED_POWER','MODELED_REWARDS','MODELED_RECREATION','drawCityLandmark','return function(city,t,c,p,u,fade){'+body+'}')(structureSize,STRUCTURES,{},new Set(),new Set(),new Set(),(...args)=>calls.push(args));
const scene=Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>city,rotation:0,zoom:1,w:1000,h:700,pan:{x:0,y:0},layer:'city',sprite(){throw Error('Landmark used static sprite fallback');}}),ctx={};
for(let rotation=0;rotation<4;rotation++){
 scene.rotation=rotation;calls.length=0;for(const tile of city.tiles)if(LANDMARKS[tile.type])actual.call(scene,city,tile,ctx,scene.project(tile.x,tile.y),scene.unit,.6);
 assert.equal(calls.length,Object.keys(LANDMARKS).length);
 for(const call of calls){const type=call[1],root=city.tiles.find((t,i)=>t.type===type&&t.root===i),size=LANDMARKS[type].size,center=scene.project(root.x+(size-1)/2,root.y+(size-1)/2);assert.deepEqual(call,[ctx,type,rotation,center.x,center.y+scene.unit/2,scene.unit*size*2.1,.6]);}
}
console.log('PASS: complete current landmark model coverage, Eiffel/Pyramid finite unclipped depth rasters, actual drawing and every footprint rendered once at the correct center in all four map views.');
