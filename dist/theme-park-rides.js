import {projectMiniature} from './miniature-raster.js?v=port-garbage-1';
export const WHEEL={center:[-.18,-.12,.39],radius:.24};
// Cosmetic operational-state indication; reuse the paused scenery clock, no new timer.
export function themeParkRideState(renderer,root){const c=renderer.getCity();let access=false,active=root.type==='themePark'&&renderer.layer==='city'&&c.finance.roadCondition>20;for(let y=root.y;y<root.y+10;y++)for(let x=root.x;x<root.x+10;x++){const t=c.tiles[y*c.size+x];if(!t||t.root!==root.root||!t.powered||t.fire||t.rubble||t.radiation)active=false;access ||= !!t?.roadIds?.length;}return{active:active&&access,time:renderer.preferences?.sceneryAnimations===false||renderer.reducedMotion.matches?0:renderer.vehicleTime};}
export function wheelCabins(time=0){const [x,y,z]=WHEEL.center;return Array.from({length:12},(_,i)=>{const angle=time*.25+i*Math.PI/6;return{point:[x+WHEEL.radius*Math.cos(angle),y,z+WHEEL.radius*Math.sin(angle)],color:['#d36b57','#e5c572','#6da9b2'][i%3]};});}
export function themeParkRidePixels(time=0,rotation=0,depth){const pixels=[],project=p=>{const [x,y,z]=p,[rx,ry]=rotation===0?[x,y]:rotation===1?[-y,x]:rotation===2?[-x,-y]:[y,-x];return [...projectMiniature(p,rotation),rx+ry+z];};
 const paint=(x,y,z,color)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&x<512&&y>=0&&y<512&&(!depth||z>=depth[y*512+x]-1e-7))pixels.push({x,y,color});};
 const center=project(WHEEL.center);
 for(const cabin of wheelCabins(time)){const end=project(cabin.point),steps=Math.ceil(Math.hypot(end[0]-center[0],end[1]-center[1]));for(let i=0;i<=steps;i++){const f=i/steps;paint(center[0]+(end[0]-center[0])*f,center[1]+(end[1]-center[1])*f,center[2]+(end[2]-center[2])*f,'#cbd4c9');}for(let dy=0;dy<6;dy++)for(let dx=-3;dx<=3;dx++)paint(end[0]+dx,end[1]+dy,end[2],dy===0?'#e8dcc0':dy<3?'#5b7c88':cabin.color);}
 return pixels;
}
