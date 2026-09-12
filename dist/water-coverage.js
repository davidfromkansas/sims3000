// Pipe coverage ignores terrain and uses Chebyshev distance, up to seven tiles.
// A multi-source flood visits overlapping service areas once per network.
export function pipeCoverage(size,sources,scratch=new Uint8Array(size*size).fill(255)){
 const queue=[];
 for(const i of sources)if(scratch[i]===255){scratch[i]=0;queue.push(i);}
 for(let head=0;head<queue.length;head++){
  const i=queue[head],distance=scratch[i];if(distance===7)continue;
  const x=i%size,y=Math.floor(i/size);
  for(let yy=Math.max(0,y-1);yy<=Math.min(size-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(size-1,x+1);xx++){
   const j=yy*size+xx;if(scratch[j]!==255)continue;scratch[j]=distance+1;queue.push(j);
  }
 }
 queue.sort((a,b)=>scratch[a]-scratch[b]||a-b);
 for(const i of queue)scratch[i]=255;
 return queue;
}
