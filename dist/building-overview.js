import {drawBuildingDesign} from './building-designs.js?v=architecture-collection-36';
export function overviewViewport(camera){return{x:-camera.x/camera.zoom,y:-camera.y/camera.zoom,width:256/camera.zoom,height:384/camera.zoom};}
export function mountBuildingOverview(canvas,{get,camera,center,reset}){
 let key=null,frame=null;
 const focus=point=>center({x:Math.max(0,Math.min(256,point.x)),y:Math.max(0,Math.min(384,point.y))});
 canvas.onpointerdown=event=>{if(event.button!==0)return;event.preventDefault();canvas.focus({preventScroll:true});const rect=canvas.getBoundingClientRect();focus({x:(event.clientX-rect.left)*256/rect.width,y:(event.clientY-rect.top)*384/rect.height});};
 canvas.onkeydown=event=>{const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!delta&&event.key!=='Home')return;event.preventDefault();event.stopPropagation();if(event.key==='Home'){reset();return;}const view=overviewViewport(camera()),step=event.shiftKey?48:16;focus({x:view.x+view.width/2+delta[0]*step,y:view.y+view.height/2+delta[1]*step});};
 return{draw(){const design=get(),nextKey=JSON.stringify(design);if(nextKey!==key){frame=document.createElement('canvas');frame.width=256;frame.height=384;drawBuildingDesign(frame.getContext('2d'),design,design.rotation||0);key=nextKey;}
 const ctx=canvas.getContext('2d'),view=overviewViewport(camera());ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(frame,0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/256,canvas.height/384);ctx.strokeStyle='#fff0b3';ctx.lineWidth=2*256/canvas.width;const left=Math.max(0,view.x),top=Math.max(0,view.y),right=Math.min(256,view.x+view.width),bottom=Math.min(384,view.y+view.height);if(right>left&&bottom>top)ctx.strokeRect(left,top,right-left,bottom-top);ctx.restore();canvas.setAttribute('aria-label',`Building overview. Zoom ${Math.round(camera().zoom*100)} percent. Click to center the view; arrow keys move it; Home resets.`);
 }};
}
