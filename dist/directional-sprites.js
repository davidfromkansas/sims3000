// Four rendered views share one crop and remain outside serialized simulation state.
// The common crop keeps the footprint's bottom center fixed through all four views.
export function sharedSpriteBounds(images){
 if(images.length!==4)throw Error('A directional building needs four views.');
 const {width,height}=images[0];let left=width,top=height,right=-1,bottom=-1;
 for(const image of images){
  if(image.width!==width||image.height!==height||image.data.length!==width*height*4)throw Error('Building views must use the same RGBA canvas size.');
  let visible=false;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(image.data[(y*width+x)*4+3]>0){visible=true;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  if(!visible)throw Error('Each building view must contain visible artwork.');
 }
 if(right<left)throw Error('Building views contain no visible artwork.');
 return{x:left,y:top,w:right-left+1,h:bottom-top+1};
}
export async function loadDirectionalSprite(urls,precomputedCrop=null){
 if(urls.length!==4)throw Error('A directional building needs four URLs.');
 const atlases=await Promise.all(urls.map(async url=>{const image=new Image();image.src=url;await image.decode();return image;}));
 let crop=precomputedCrop;
 if(crop){
  if(!['x','y','w','h'].every(k=>Number.isInteger(crop[k]))||crop.x<0||crop.y<0||crop.w<=0||crop.h<=0||atlases.some(image=>crop.x+crop.w>image.width||crop.y+crop.h>image.height))throw Error('Invalid building crop bounds.');
 }else{
  const pixels=atlases.map(atlas=>{const canvas=document.createElement('canvas');canvas.width=atlas.width;canvas.height=atlas.height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(atlas,0,0);return ctx.getImageData(0,0,canvas.width,canvas.height);});
  crop=sharedSpriteBounds(pixels);
 }
 const views=atlases.map(atlas=>({atlas,...crop}));
 return{...views[0],views};
}
export function spriteView(sprite,rotation=0){return sprite?.views?.[((rotation%4)+4)%4]??sprite;}
