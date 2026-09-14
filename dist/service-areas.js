import {civicRoots,civicCenter} from './civic-footprints.js?v=reward-garbage-1';
import {EDUCATION_LAYERS} from './education-layers.js?v=reward-garbage-1';
import {serviceRadius} from './civic.js?v=reward-garbage-1';
export const PRECINCT_LAYERS={police:'police',crime:'police',fire:'fire',flammability:'fire'};
export const PRECINCT_LEGEND='Station dots: operating white, inactive orange · Rings: current service limit';
export function stationAreas(city,layer){
 const education=EDUCATION_LAYERS[layer];if(education)return civicRoots(city).filter(t=>education.facilities.includes(t.type)).map(t=>({...civicCenter(t),type:t.type,active:!!t.serviceActive,radius:0,label:t.type==='library'?'L':t.type==='museum'?'M':education.marker}));
 const type=PRECINCT_LAYERS[layer];if(!type)return[];
 return civicRoots(city).filter(t=>t.type===type).map(t=>({...civicCenter(t),type,active:!!t.serviceActive,radius:serviceRadius(city,t)}));
}
export function drawNavigationPrecincts(ctx,city,layer,transform,scale){
 const areas=stationAreas(city,layer);if(!areas.length)return;
 ctx.save();ctx.lineWidth=1;ctx.strokeStyle='#102c35';
 for(const a of areas){const [rx,ry]=transform(a.x,a.y),x=(rx+.5)*scale,y=(ry+.5)*scale;
  if(a.radius>0){ctx.beginPath();ctx.arc(x,y,a.radius*scale,0,Math.PI*2);ctx.strokeStyle='#153039';ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle='#f0f7db';ctx.lineWidth=1;ctx.stroke();}
 }
 // Markers are drawn last, so another station's ring cannot obscure them.
 for(const a of areas){const [rx,ry]=transform(a.x,a.y);ctx.beginPath();ctx.arc((rx+.5)*scale,(ry+.5)*scale,Math.max(2,Math.min(3,scale*.6)),0,Math.PI*2);ctx.fillStyle=a.active?'#f6ffe1':'#f4a477';ctx.fill();ctx.strokeStyle='#153039';ctx.lineWidth=1;ctx.stroke();}
 ctx.restore();
}

export const precinctCoverageNote=layer=>PRECINCT_LAYERS[layer]==='fire'?'Protection is uniform inside each ring; overlapping stations strengthen firefighting.':'Police strength falls toward the edge; excessive overlap can reduce wellbeing.';
