import {rasterizeMiniature} from './miniature-raster.js?v=abandoned-recovery-1';
export const TREE_STYLES={broadleaf:'Broadleaf groves',conifer:'Evergreen forest',palm:'Palm groves'};
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
// Original low-poly botanical miniatures, built in world coordinates so each
// camera direction has its own geometry and occlusion instead of a mirrored sprite.
export function treeGeometry(style,level=1){
 if(!Object.hasOwn(TREE_STYLES,style)||![1,2,3].includes(level))throw Error('Choose a tree style and density 1–3.');
 const faces=[],add=(points,color)=>faces.push({points,color}),ring=(x,y,z,r,n=10)=>Array.from({length:n},(_,i)=>[x+Math.cos(i*Math.PI*2/n)*r,y+Math.sin(i*Math.PI*2/n)*r,z]);
 function trunk(x,y,z,r,h){const a=ring(x,y,z,r,8),b=ring(x+.018,y-.01,z+h,r*.6,8);for(let i=0;i<8;i++)add([a[i],a[(i+1)%8],b[(i+1)%8],b[i]],shade('#896c48',.7+i*.05));add(b,'#af8a55');}
 function cone(x,y,z,r,h,color){const a=ring(x,y,z,r);for(let i=0;i<a.length;i++)add([a[i],a[(i+1)%a.length],[x,y,z+h]],shade(color,.75+(1+Math.cos(i*.628))*.14));}
 function crown(x,y,z,r,h,color){const rows=Array.from({length:7},(_,i)=>{const a=-Math.PI/2+i*Math.PI/6;return ring(x,y,z+Math.sin(a)*h,Math.max(.001,Math.cos(a)*r));});for(let j=0;j<rows.length-1;j++)for(let i=0;i<10;i++)add([rows[j][i],rows[j][(i+1)%10],rows[j+1][(i+1)%10],rows[j+1][i]],shade(color,.74+j*.045+(1+Math.cos(i*.628))*.07));}
 const positions=level===1?[[0,0,1]]:level===2?[[-.19,.10,.91],[.19,-.12,1]]:[[-.21,-.15,.88],[.21,-.12,.94],[0,.22,1]];
 for(const [x,y,scale]of positions){const height=(style==='palm'?.82:style==='conifer'?.9:.64)*scale;
  trunk(x,y,0,.035*scale,height);
  if(style==='conifer')for(let i=0;i<4;i++)cone(x+.012,y-.008,.20*scale+i*.15*scale,(.24-i*.041)*scale,.35*scale,shade('#396c50',1+i*.075));
  else if(style==='broadleaf'){
   crown(x,y,height,.24*scale,.22*scale,'#5c8b4c');
   crown(x-.12*scale,y+.035,height-.13*scale,.16*scale,.16*scale,'#477746');
   crown(x+.10*scale,y-.08,height-.06*scale,.17*scale,.17*scale,'#73974e');
  }else{
   for(let leaf=0;leaf<9;leaf++){const angle=leaf*Math.PI*2/9+.3,dir=[Math.cos(angle),Math.sin(angle)],side=[-dir[1],dir[0]],sections=[0,.28,.60,1];
    for(let j=0;j<3;j++){const points=[];for(const [f,sign]of [[sections[j],-1],[sections[j+1],-1],[sections[j+1],1],[sections[j],1]]){const distance=f*.34*scale,width=Math.sin(f*Math.PI)*.055*scale;points.push([x+.018+dir[0]*distance+side[0]*width*sign,y-.01+dir[1]*distance+side[1]*width*sign,height+Math.sin(f*Math.PI)*.13*scale-f*.14*scale]);}const color=shade(leaf%2?'#4d8955':'#73a24b',1-j*.065);add(points,color);add([...points].reverse(),color);}
   }
   crown(x+.018,y-.01,height,.044,.045,'#88764b');
  }
 }
 return faces;
}
export function rasterizeTrees(style,level=1,rotation=0){if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw Error('Choose a camera direction 0–3.');return rasterizeMiniature(treeGeometry(style,level),rotation);}
const cache=new Map();
export function treeCanvas(style,level=1,rotation=0){const key=style+':'+level+':'+rotation;if(cache.has(key))return cache.get(key);const raster=rasterizeTrees(style,level,rotation),source=document.createElement('canvas');source.width=raster.width;source.height=raster.height;const ctx=source.getContext('2d'),pixels=ctx.createImageData(raster.width,raster.height);pixels.data.set(raster.data);ctx.putImageData(pixels,0,0);const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;canvas.getContext('2d').drawImage(source,0,0,256,256);cache.set(key,canvas);return canvas;}
export function drawCityTrees(renderer,tile,style){const image=treeCanvas(style,Math.max(1,Math.min(3,tile.treeLevel||1)),renderer.rotation),p=renderer.project(tile.x,tile.y),scale=renderer.unit*2/460,ctx=renderer.ctx;ctx.save();ctx.globalAlpha=.96;ctx.drawImage(image,p.x-256*scale,p.y+renderer.unit/2-320*scale,512*scale,512*scale);ctx.restore();}
