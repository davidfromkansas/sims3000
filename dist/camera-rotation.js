// Keep the ground tile under the viewport center at the same screen position.
// Use picking rather than flat inverse projection so raised terrain stays anchored.
export function rotateCityView(renderer,direction=1){
 if(direction!==1&&direction!==-1)throw Error('Rotate clockwise or counterclockwise.');
 const city=renderer.getCity(),anchor=renderer.pick(renderer.w/2,renderer.h/2)||{x:Math.floor(city.size/2),y:Math.floor(city.size/2)},before=renderer.project(anchor.x,anchor.y);
 renderer.rotation=(renderer.rotation+direction+4)%4;
 const after=renderer.project(anchor.x,anchor.y);renderer.pan.x+=before.x-after.x;renderer.pan.y+=before.y-after.y;renderer.dirty=true;
 return anchor;
}
