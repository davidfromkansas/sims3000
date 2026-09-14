import assert from 'node:assert/strict';
import {mountBuildingPlaneWidgets,planeWidgetGeometry,visiblePlaneWidgets} from '../dist/building-plane-widgets.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
let count=0;
for(const footprint of [{width:1,height:1},{width:1,height:5},{width:5,height:1}])for(let rotation=0;rotation<4;rotation++)for(const plane of ['horizontal','xz','yz']){
 let design={...defaultBuildingDesign(),footprint,rotation,voxels:Array(100).fill(1)},selection={plane,slice:0},writes=0,pans=0;
 const original=structuredClone(design),camera={zoom:2,x:-170,y:-290},mode={value:'construct'},status={},canvas={width:256,height:384,getBoundingClientRect:()=>({left:20,top:30,width:512,height:768}),focus(){},setPointerCapture(){},onpointerdown(){pans++;}};
 const editor=mountBuildingPlaneWidgets(canvas,{get:()=>design,camera:()=>camera,mode,selection:()=>selection,move:(plane,slice)=>{selection={plane,slice};writes++;},render(){},status});
 const g=visiblePlaneWidgets(design,{horizontal:0,xz:0,yz:0},camera).find(g=>g.plane===plane),event=(p)=>({button:0,pointerId:1,clientX:20+(p[0]*camera.zoom+camera.x)*2,clientY:30+(p[1]*camera.zoom+camera.y)*2,preventDefault(){}});
 const start=event(g.center);canvas.onpointerdown(start);assert.equal(pans,0);canvas.onpointermove(event(g.center.map((n,i)=>n+g.step[i]*3)));canvas.onpointerup(start);assert.deepEqual(selection,{plane,slice:3});assert.deepEqual(design,original,'moving an edit plane does not edit the building');
 canvas.onkeydown({key:'ArrowUp',shiftKey:true,preventDefault(){},stopPropagation(){}});assert.equal(selection.slice,8);
 canvas.onkeydown({key:'ArrowDown',shiftKey:true,preventDefault(){},stopPropagation(){}});assert.equal(selection.slice,3);
 const current=visiblePlaneWidgets(design,{[plane]:3},camera).find(g=>g.plane===plane);canvas.onpointerdown(event(current.center));const before=writes;camera.zoom=3;canvas.onpointermove(event(current.center.map(n=>n+30)));assert.equal(writes,before,'camera change cancels drag');
 mode.value='pan';canvas.onpointerdown(start);assert.equal(pans,1);assert.match(status.textContent,/position/);editor.reset();count++;
}
console.log(`PASS: ${count} edit-plane handle drags across rotations, rectangular lots and scaled/panned canvases, keyboard slicing, camera cancellation and unchanged model data.`);
{
 const design={...defaultBuildingDesign(),rotation:0,voxels:Array(100).fill(1)},camera={zoom:1,x:0,y:0},mode={value:'construct'},canvas={width:256,height:384,getBoundingClientRect:()=>({left:0,top:0,width:256,height:384}),focus(){},setPointerCapture(){}};let selection={plane:'horizontal',slice:0},moves=0;
 mountBuildingPlaneWidgets(canvas,{get:()=>design,camera:()=>camera,mode,selection:()=>selection,move:(plane,slice)=>{selection={plane,slice};moves++;},pan:(x,y)=>{camera.x+=x;camera.y+=y;},render(){},status:{}});
 const center=planeWidgetGeometry(design,{}).find(g=>g.plane==='horizontal').center,event=(x,y,id=1)=>({button:0,pointerId:id,clientX:x,clientY:y,preventDefault(){}});
 canvas.onpointerdown(event(...center));canvas.onpointerdown(event(...center,2));assert.equal(moves,1,'another pointer cannot replace the active drag');canvas.onpointermove(event(center[0],-40,2));assert.equal(moves,1,'another pointer cannot move the active handle');
 canvas.onpointermove(event(center[0],-40));assert.equal(camera.y,56);assert.equal(selection.slice,23,'plane clamps at its upper boundary');
 canvas.onpointermove(event(center[0],-60));assert.equal(camera.y,76);assert.equal(moves,3,'self-panning preserves the drag');canvas.onpointerup(event(center[0],-60));canvas.onpointermove(event(center[0],-100));assert.equal(camera.y,76,'release stops edge panning');
}
console.log('PASS: widget edge dragging pans the preview, preserves its own drag, clamps the plane, ignores unrelated pointers and stops on release.');

for(let rotation=0;rotation<4;rotation++)for(const zoom of [.5,2,6]){
 const camera={zoom,x:-300,y:-600},design={...defaultBuildingDesign(),rotation,footprint:{width:1,height:5}};
 for(const g of visiblePlaneWidgets(design,{horizontal:23,xz:9,yz:9},camera)){
  const x=g.center[0]*zoom+camera.x,y=g.center[1]*zoom+camera.y;assert.ok(x>=12-1e-8&&x<=244+1e-8&&y>=12-1e-8&&y<=372+1e-8);
 }
}
console.log('PASS: all colored plane handles remain inside the preview hit area at every rotation and supported zoom extremes.');

for(const [x,y] of [[-5000,-5000],[5000,-5000],[-5000,5000],[5000,5000]]){
 const camera={x,y,zoom:6},widgets=visiblePlaneWidgets({...defaultBuildingDesign(),rotation:0},{horizontal:23,xz:9,yz:9},camera);
 for(let a=0;a<widgets.length;a++)for(let b=a+1;b<widgets.length;b++)assert.ok(Math.hypot(...widgets[a].center.map((n,i)=>(n-widgets[b].center[i])*camera.zoom))>=23.99,'offscreen model handles retain separate hit targets');
}
console.log('PASS: plane handles remain independently selectable even when the entire model is panned beyond a preview corner.');

for(const cancellation of ['mode','model','escape','pointercancel']){
 let design={...defaultBuildingDesign(),rotation:0,voxels:Array(100).fill(1)},selection={plane:'horizontal',slice:0},moves=0;const camera={zoom:1,x:0,y:0},mode={value:'construct'},canvas={width:256,height:384,getBoundingClientRect:()=>({left:0,top:0,width:256,height:384}),focus(){},setPointerCapture(){}};
 mountBuildingPlaneWidgets(canvas,{get:()=>design,camera:()=>camera,mode,selection:()=>selection,move:(plane,slice)=>{selection={plane,slice};moves++;},render(){},status:{}});
 const g=visiblePlaneWidgets(design,{},camera)[0],e={button:0,pointerId:1,clientX:g.center[0],clientY:g.center[1],preventDefault(){}};canvas.onpointerdown(e);
 if(cancellation==='mode'){mode.value='pan';mode.onchange();mode.value='construct';mode.onchange();}
 if(cancellation==='model')design={...design,voxels:[...design.voxels]};
 if(cancellation==='escape')canvas.onkeydown({key:'Escape',preventDefault(){},stopPropagation(){}});
 if(cancellation==='pointercancel')canvas.onpointercancel(e);
 canvas.onpointermove({...e,clientY:e.clientY-30});canvas.onpointerup(e);assert.equal(moves,1,`${cancellation} prevents a stale plane update`);
}
console.log('PASS: second-pointer down cannot replace a drag, and tool/model changes, Escape and pointer cancellation prevent stale plane updates.');
