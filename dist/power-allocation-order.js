// Preserve nearest-source Manhattan ordering and the input order of equal-distance tiles.
// Distance travels across the coordinate grid here, just as in the original comparator;
// this is not a conductive-path search or a change to electrical connectivity.
export function orderPowerConsumers(queue,tiles,sources,size){
 if(queue.length<2||!sources.length)return queue;
 if(queue.length*sources.length<=tiles.length*2){
  const distance=new Map();
  for(const i of queue){const t=tiles[i];let nearest=size*2;for(const source of sources){const s=tiles[source];nearest=Math.min(nearest,Math.abs(t.x-s.x)+Math.abs(t.y-s.y));}distance.set(i,nearest);}
  return queue.sort((a,b)=>distance.get(a)-distance.get(b));
 }
 const distance=new Int32Array(tiles.length);
 distance.fill(size*2);for(const source of sources)distance[source]=0;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=y*size+x;if(x)distance[i]=Math.min(distance[i],distance[i-1]+1);if(y)distance[i]=Math.min(distance[i],distance[i-size]+1);}
 for(let y=size-1;y>=0;y--)for(let x=size-1;x>=0;x--){const i=y*size+x;if(x+1<size)distance[i]=Math.min(distance[i],distance[i+1]+1);if(y+1<size)distance[i]=Math.min(distance[i],distance[i+size]+1);}
 return queue.sort((a,b)=>distance[a]-distance[b]);
}
