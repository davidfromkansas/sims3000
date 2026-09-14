import {mkdirSync,writeFileSync} from 'node:fs';
import {defaultBuildingDesign,drawBuildingDesign,exportBuildingDesign} from '../dist/building-designs.js';
import {drawBuildingPlaneGuide} from '../dist/building-plane-guide.js';
import {mountBuildingPlaneWidgets} from '../dist/building-plane-widgets.js';
import {mountBuildingOverview} from '../dist/building-overview.js';
function recorder(){
 let transform=[1,1,0,0],path=[],stack=[];const commands=[];
 const point=(x,y)=>[x*transform[0]+transform[2],y*transform[1]+transform[3]],ctx={commands,fillStyle:'#000000',strokeStyle:'#000000',lineWidth:1,
 save(){stack.push({transform:[...transform],fillStyle:this.fillStyle,strokeStyle:this.strokeStyle,lineWidth:this.lineWidth});},restore(){const old=stack.pop();transform=old.transform;Object.assign(this,{fillStyle:old.fillStyle,strokeStyle:old.strokeStyle,lineWidth:old.lineWidth});},
 translate(x,y){transform[2]+=x*transform[0];transform[3]+=y*transform[1];},scale(x,y){transform[0]*=x;transform[1]*=y;},clearRect(){},
 beginPath(){path=[];},moveTo(x,y){path.push(point(x,y));},lineTo(x,y){path.push(point(x,y));},closePath(){if(path.length)path.push(path[0]);},
 fill(){commands.push({points:[...path],color:this.fillStyle});},stroke(){commands.push({points:[...path],color:this.strokeStyle,lineWidth:this.lineWidth*Math.abs(transform[0])});},
 drawImage(canvas,x,y,w,h){for(const c of canvas.context.commands)commands.push({...c,points:c.points.map(([px,py])=>point(x+px*w/canvas.width,y+py*h/canvas.height)),...(c.lineWidth?{lineWidth:c.lineWidth*w/canvas.width*Math.abs(transform[0])}:{})});}
 };return ctx;
}
globalThis.document={createElement(){return {context:recorder(),getContext(){return this.context;}};}};
const directory=new URL('../art/architecture/construct-navigation/',import.meta.url);mkdirSync(directory,{recursive:true});
const model={...defaultBuildingDesign(),name:'Section study',voxels:Array(100).fill(0)};for(let y=3;y<=6;y++)for(let x=3;x<=6;x++)model.voxels[y*10+x]=(1<<(x===3?12:8))-1;
writeFileSync(new URL('section-study.building.json',directory),exportBuildingDesign(model)+'\n');
const frames=[];
for(let rotation=0;rotation<4;rotation++){
 const design={...model,rotation},camera={zoom:2,x:-128,y:-320},selection={plane:'horizontal',slice:5},ctx=recorder(),canvas={width:256,height:384};
 const widgets=mountBuildingPlaneWidgets(canvas,{get:()=>design,camera:()=>camera,mode:{value:'construct'},selection:()=>selection,move(){},render(){},status:{}});
 ctx.save();ctx.translate(camera.x,camera.y);ctx.scale(camera.zoom,camera.zoom);drawBuildingDesign(ctx,design,rotation);drawBuildingPlaneGuide(ctx,design,selection,rotation);widgets.draw(ctx);ctx.restore();
 const overviewContext=recorder(),overviewCanvas={width:112,height:168,getContext:()=>overviewContext,setAttribute(){}};
 mountBuildingOverview(overviewCanvas,{get:()=>design,camera:()=>camera,center(){},reset(){},construct:()=>true}).draw();
 frames.push({main:ctx.commands,overview:overviewContext.commands});
}
writeFileSync(new URL('review-polygons.json',directory),JSON.stringify(frames));console.log('Recorded four actual model/plane/widget and Construct overview views at 200% zoom.');
