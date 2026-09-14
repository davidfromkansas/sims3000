// Enlarged geometry diagnostic. The browser remains the game-scale acceptance surface.
import {mkdirSync,writeFileSync} from 'node:fs';
import {buildingPropGeometry} from '../dist/building-props.js';
import {clipPropGeometry} from '../dist/building-prop-clipping.js';
import {projectedBuildingSurfaces} from '../dist/building-surface-picking.js';
import {rasterizeMiniature} from '../dist/miniature-raster.js';
const root=new URL('../art/architecture/building-props/clipping/',import.meta.url);mkdirSync(root,{recursive:true});const entries=[];
for(const [name,mask,shape] of [['Open space',0,0],['Solid block',3,0],['Wedge',1,2],['Overhang',4,0]])for(let rotation=0;rotation<4;rotation++){
 const design={voxels:Array(100).fill(0)},props=[{kind:'arch',x:4,y:4,z:0,rotation:0},{kind:'car',x:5,y:4,z:0,rotation:1}];design.voxels[45]=mask;if(shape)design.blockGeometry='0'.repeat(45)+String(shape)+'0'.repeat(2354);
 const buildings=projectedBuildingSurfaces(design,rotation).map(f=>({points:f.points,color:f.side===4?'#b4b6a7':'#939f98'})),geometry=[...buildings,...clipPropGeometry(design,props.flatMap(p=>buildingPropGeometry(p)))];
 const project=([x,y,z],r)=>{[x,y]=r===0?[x,y]:r===1?[-y,x]:r===2?[-x,-y]:[y,-x];return[160+(x-y)*470,275+(x+y)*235-z*470];};
 const raster=rasterizeMiniature(geometry,rotation,false,{width:320,height:320,project}),file=`${entries.length}.rgba`;writeFileSync(new URL(file,root),raster.data);entries.push({name,rotation,file});
}
writeFileSync(new URL('review.json',root),JSON.stringify(entries,null,2));
