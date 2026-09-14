// Convex clipping: clip a world-plane decal polygon independently to each exposed wall tile.
export function clipPolygon(subject,clip){
 const area=clip.reduce((sum,p,i)=>{const q=clip[(i+1)%clip.length];return sum+p[0]*q[1]-q[0]*p[1];},0),winding=Math.sign(area);if(!winding)return[];
 let result=subject.map(p=>[...p]);
 for(let i=0;i<clip.length&&result.length;i++){
  const a=clip[i],b=clip[(i+1)%clip.length],distance=p=>winding*((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])),input=result;result=[];
  for(let j=0;j<input.length;j++){const p=input[j],q=input[(j+1)%input.length],dp=distance(p),dq=distance(q),pin=dp>=-1e-9,qin=dq>=-1e-9;
   if(pin)result.push(p);if(pin!==qin){const t=dp/(dp-dq);result.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);}
  }
 }
 const resultArea=result.reduce((sum,p,i)=>{const q=result[(i+1)%result.length];return sum+p[0]*q[1]-q[0]*p[1];},0);return Math.abs(resultArea)<1e-9?[]:result;
}
