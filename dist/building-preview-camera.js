export const freshBuildingCamera=()=>({zoom:1,x:0,y:0});
export function zoomBuildingCamera(camera,factor,point={x:128,y:346}){if(!Number.isFinite(factor)||factor<=0||![point.x,point.y].every(Number.isFinite))return{...camera};const zoom=Math.max(.5,Math.min(6,camera.zoom*factor)),ratio=zoom/camera.zoom;return{zoom,x:point.x-(point.x-camera.x)*ratio,y:point.y-(point.y-camera.y)*ratio};}
export function panBuildingCamera(camera,dx,dy){if(![dx,dy].every(Number.isFinite))return{...camera};return{...camera,x:camera.x+dx,y:camera.y+dy};}
export function mountBuildingPreviewCamera(canvas,{zoomIn,zoomOut,reset,label},draw){
 let state=freshBuildingCamera(),drag=null;
 const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};};
 function refresh(){label.textContent=Math.round(state.zoom*100)+'%';zoomIn.disabled=state.zoom>=6;zoomOut.disabled=state.zoom<=.5;draw();}
 function zoom(factor,anchor){drag=null;canvas.style.cursor='grab';state=zoomBuildingCamera(state,factor,anchor);refresh();}
 function resetView(){drag=null;state=freshBuildingCamera();canvas.style.cursor='grab';refresh();}
 zoomIn.onclick=()=>zoom(1.25);zoomOut.onclick=()=>zoom(1/1.25);reset.onclick=resetView;
 canvas.onwheel=e=>{if(e.ctrlKey||e.metaKey)return;e.preventDefault();zoom(Math.exp(-Math.max(-500,Math.min(500,e.deltaY))*.002),point(e));};
 canvas.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();canvas.focus({preventScroll:true});drag={id:e.pointerId,start:point(e),camera:{...state}};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';};
 canvas.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e);state=panBuildingCamera(drag.camera,p.x-drag.start.x,p.y-drag.start.y);refresh();};
 canvas.onpointerup=e=>{if(drag?.id===e.pointerId){drag=null;canvas.style.cursor='grab';}};canvas.onpointercancel=()=>{if(drag){state=drag.camera;drag=null;canvas.style.cursor='grab';refresh();}};
 canvas.onkeydown=e=>{const moves={ArrowLeft:[24,0],ArrowRight:[-24,0],ArrowUp:[0,24],ArrowDown:[0,-24]};if(!['+','=','-','Home','Escape',...Object.keys(moves)].includes(e.key))return;e.preventDefault();e.stopPropagation();drag=null;canvas.style.cursor='grab';if(e.key==='Home'||e.key==='Escape')resetView();else if(e.key in moves){const [dx,dy]=moves[e.key],step=e.shiftKey?3:1;state=panBuildingCamera(state,dx*step,dy*step);refresh();}else zoom(e.key==='-'?1/1.25:1.25);};
 return{get state(){return state;},center(point){if(![point?.x,point?.y].every(Number.isFinite))return;drag=null;state={...state,x:canvas.width/2-point.x*state.zoom,y:canvas.height/2-point.y*state.zoom};canvas.style.cursor='grab';refresh();},reset:resetView};
}
