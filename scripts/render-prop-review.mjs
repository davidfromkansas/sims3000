import {writeFileSync,mkdirSync} from 'node:fs';
import {BUILDING_PROPS,propModelGeometry,shadePropFaces} from '../dist/building-prop-models.js';
import {rasterizeMiniature} from '../dist/miniature-raster.js';
const root=new URL('../art/architecture/building-props/',import.meta.url);mkdirSync(root,{recursive:true});const manifest=[];
for(const [kind,entry] of Object.entries(BUILDING_PROPS))for(let rotation=0;rotation<4;rotation++){
 const geometry=shadePropFaces(propModelGeometry(kind)),turn=([x,y,z])=>{[x,y]=rotation===0?[x,y]:rotation===1?[-y,x]:rotation===2?[-x,-y]:[y,-x];return[x-y,(x+y)/2-z];},points=geometry.flatMap(f=>f.points).map(turn),minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1])),scale=Math.min(136/(maxX-minX),136/(maxY-minY));
 const project=p=>{const [x,y]=turn(p);return[80+(x-(minX+maxX)/2)*scale,80+(y-(minY+maxY)/2)*scale];};
 const raster=rasterizeMiniature(geometry,rotation,false,{width:160,height:160,project}),file=`${kind}-${rotation}.rgba`;writeFileSync(new URL(file,root),raster.data);manifest.push({kind,name:entry.name,category:entry.category,rotation,file});
}
writeFileSync(new URL('review.json',root),JSON.stringify(manifest,null,2));
