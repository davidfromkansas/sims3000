// Geometry changes with camera or recomputed terrain, not animation time or map color.
export function visibleSceneGeometry(renderer,bounds){
 const city=renderer.getCity(),key=[city,city.tiles,city.stats,renderer.rotation,renderer.unit,renderer.w,renderer.h,renderer.pan.x,renderer.pan.y,bounds.x0,bounds.y0,bounds.x1,bounds.y1,renderer.project,renderer.transform];
 const cached=renderer.visibleSceneCache;if(cached&&key.every((value,i)=>value===cached.key[i]))return cached.tiles;
 const size=Math.sqrt(city.tiles.length),tiles=[];
 for(let y=bounds.y0;y<=bounds.y1;y++)for(let x=bounds.x0;x<=bounds.x1;x++){const t=city.tiles[y*size+x];tiles.push({t,p:renderer.project(t.x,t.y),r:renderer.transform(t.x,t.y)});}
 tiles.sort((a,b)=>(a.r[0]+a.r[1])-(b.r[0]+b.r[1])||a.r[0]-b.r[0]);renderer.visibleSceneCache={key,tiles};return tiles;
}
