import {projectBuildingPoint} from './building-footprints.js?v=scripted-ending-ranks-1';
import {BUILDING_EDIT_PLANES} from './building-edit-planes.js?v=scripted-ending-ranks-1';
export const PLANE_WIDGET_COLORS={horizontal:'#49a77e',xz:'#c35c59',yz:'#4c8bc8'};
export function planeWidgetGeometry(design,positions){
 return Object.keys(BUILDING_EDIT_PLANES).map(plane=>{
  const slice=positions[plane]??0,point=plane==='horizontal'?[.51,.51,.12+(slice+.5)*.14]:plane==='xz'?[.51,(slice-4.5)*.085,0]:[(slice-4.5)*.085,.51,0];
  const delta=plane==='horizontal'?[0,0,.14]:plane==='xz'?[0,.085,0]:[.085,0,0],project=p=>projectBuildingPoint(p,design.rotation,design.footprint),center=project(point),next=project(point.map((n,i)=>n+delta[i]));
  return {plane,slice,center,step:next.map((n,i)=>n-center[i]),color:PLANE_WIDGET_COLORS[plane]};
 });
}
export function visiblePlaneWidgets(design,positions,camera,width=256,height=384){
 const placed=[],offsets=[0,-24,24,-48,48],candidates=offsets.flatMap(x=>offsets.map(y=>[x,y])).sort((a,b)=>Math.hypot(...a)-Math.hypot(...b));
 return planeWidgetGeometry(design,positions).map(g=>{
  const initial=[Math.max(12,Math.min(width-12,g.center[0]*camera.zoom+camera.x)),Math.max(12,Math.min(height-12,g.center[1]*camera.zoom+camera.y))];
  const screen=candidates.map(([x,y])=>[initial[0]+x,initial[1]+y]).find(([x,y])=>x>=12&&x<=width-12&&y>=12&&y<=height-12&&placed.every(p=>Math.hypot(x-p[0],y-p[1])>=23.99))||initial;placed.push(screen);
  return {...g,anchor:g.center,center:screen.map((n,i)=>(n-(i?camera.y:camera.x))/camera.zoom)};
 });
}
export function mountBuildingPlaneWidgets(canvas,{get,camera,mode,selection,move,pan,render,status}){
 const base=Object.fromEntries(['onpointerdown','onpointermove','onpointerup','onpointercancel','onkeydown','onwheel'].map(k=>[k,canvas[k]])),positions={horizontal:0,xz:0,yz:0};let pending=null,selected='horizontal';
 const active=()=>mode.value==='construct'&&!!get().voxels;
 const screen=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};};
 const overflow=p=>({x:p.x-Math.max(16,Math.min(canvas.width-16,p.x)),y:p.y-Math.max(16,Math.min(canvas.height-16,p.y))});
 const point=e=>{const r=canvas.getBoundingClientRect(),c=camera();return {x:((e.clientX-r.left)*canvas.width/r.width-c.x)/c.zoom,y:((e.clientY-r.top)*canvas.height/r.height-c.y)/c.zoom};};
 const previousMode=mode.onchange;mode.onchange=()=>{pending=null;previousMode?.();if(mode.value==='construct')status.textContent=get().voxels?'Drag the green floor, red west–east or blue north–south handle. Drag beyond the preview edge to pan; arrow keys move the selected plane.':'Choose independent layers in Construction method to move edit planes.';render();};
 const signature=()=>JSON.stringify([get().rotation,get().footprint,camera()]);
 function geometry(){const current=selection();if(current&&Object.hasOwn(positions,current.plane)){positions[current.plane]=current.slice;selected=current.plane;}return visiblePlaneWidgets(get(),positions,camera(),canvas.width,canvas.height);}
 function update(plane,slice){const maximum=BUILDING_EDIT_PLANES[plane].slices;selected=plane;positions[plane]=Math.max(0,Math.min(maximum-1,Math.round(slice)));move(plane,positions[plane]);status.textContent=`${BUILDING_EDIT_PLANES[plane].label} · position ${positions[plane]+1} of ${maximum}. Drag its colored handle or use arrow keys.`;}
 canvas.onpointerdown=e=>{if(pending)return;if(!active()||e.button!==0)return base.onpointerdown?.(e);const p=point(e),hit=geometry().find(g=>Math.hypot(p.x-g.center[0],p.y-g.center[1])<=10/camera().zoom);if(!hit)return base.onpointerdown?.(e);e.preventDefault();canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);pending={id:e.pointerId,point:p,model:get().voxels,edge:overflow(screen(e)),...hit,signature:signature()};update(hit.plane,hit.slice);render();};
 canvas.onpointermove=e=>{if(!pending)return base.onpointermove?.(e);if(e.pointerId!==pending.id)return;if(!active()||pending.model!==get().voxels||pending.signature!==signature()){pending=null;return;}const edge=overflow(screen(e));if(pan&&(edge.x!==pending.edge.x||edge.y!==pending.edge.y)){pan(pending.edge.x-edge.x,pending.edge.y-edge.y);pending.signature=signature();}pending.edge=edge;const p=point(e),s=pending.step,offset=((p.x-pending.point.x)*s[0]+(p.y-pending.point.y)*s[1])/(s[0]*s[0]+s[1]*s[1]);update(pending.plane,pending.slice+offset);render();};
 canvas.onpointerup=e=>{if(!pending)return base.onpointerup?.(e);if(e.pointerId!==pending.id)return;pending=null;render();};
 canvas.onpointercancel=e=>{if(!pending)return base.onpointercancel?.(e);if(e.pointerId!==pending.id)return;pending=null;render();};
 canvas.onwheel=e=>{pending=null;return base.onwheel?.(e);};
 canvas.onkeydown=e=>{if(!active())return base.onkeydown?.(e);if(e.key==='Escape'){e.preventDefault();e.stopPropagation();pending=null;render();return;}if(['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'].includes(e.key)){e.preventDefault();e.stopPropagation();pending=null;const g=geometry().find(g=>g.plane===selected),amount=e.shiftKey?5:1;update(selected,g.slice+(['ArrowUp','ArrowRight'].includes(e.key)?amount:-amount));render();return;}return base.onkeydown?.(e);};
 return {reset(){pending=null;Object.keys(positions).forEach(key=>positions[key]=0);selected='horizontal';},draw(ctx){if(!active())return;ctx.save();const radius=5/camera().zoom;ctx.lineWidth=2/camera().zoom;for(const g of geometry()){const [x,y]=g.center;if(g.anchor.some((n,i)=>Math.abs(n-g.center[i])>1e-8)){ctx.strokeStyle=g.color;ctx.beginPath();ctx.moveTo(...g.anchor);ctx.lineTo(x,y);ctx.stroke();}ctx.fillStyle=g.color;ctx.strokeStyle=g.plane===selected?'#ffe180':'#163f37';ctx.beginPath();ctx.moveTo(x,y-radius);ctx.lineTo(x+radius,y);ctx.lineTo(x,y+radius);ctx.lineTo(x-radius,y);ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();}};
}
