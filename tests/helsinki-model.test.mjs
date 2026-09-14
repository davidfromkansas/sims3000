import assert from 'node:assert/strict';
import {landmarkGeometry,rasterizeLandmark,drawLandmarkModel} from '../dist/landmark-models.js';
import {rasterizeMiniature} from '../dist/miniature-raster.js';
const triangle=z=>[[1,1,z],[12,1,z],[1,12,z]],front={points:triangle(2),color:'#ff0000'},back={points:triangle(0),color:'#0000ff'},options={width:16,height:20,project:([x,y])=>[x,y]};
const a=rasterizeMiniature([front,back],0,true,options),b=rasterizeMiniature([back,front],0,true,options);assert.deepEqual(a.data,b.data);assert.deepEqual([...a.data.slice((3*16+3)*4,(3*16+3)*4+4)],[255,0,0,255]);assert.equal(a.height,20);
const geometry=landmarkGeometry('helsinkiCathedral');assert.ok(geometry.length>1000);assert.ok(geometry.every(f=>f.points.every(p=>p.every(Number.isFinite))));
for(let rotation=0;rotation<4;rotation++){
 const raster=rasterizeLandmark('helsinkiCathedral',rotation,true);let occupied=0;
 for(let y=0;y<raster.height;y++)for(let x=0;x<raster.width;x++)if(raster.data[(y*raster.width+x)*4+3]){occupied++;assert.ok(x>0&&x<511&&y>0&&y<847);assert.ok(Number.isFinite(raster.depth[y*raster.width+x]));}
 assert.ok(occupied>50000);let painted;drawLandmarkModel({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:image=>painted=image.data},'helsinkiCathedral',rotation);assert.deepEqual(painted,raster.data);
}
console.log('PASS: cathedral four-view finite geometry, unclipped transparent raster, depth-tested overlap independent of submission order and actual landmark drawing integration.');
