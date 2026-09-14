import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {defaultBuildingDesign,drawBuildingDesign,exportBuildingDesign,importBuildingDesign} from '../dist/building-designs.js';
import {paintGround,groundCovered} from '../dist/building-ground-paint.js';
import {createCity,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const directory=new URL('../art/architecture/roof-details/',import.meta.url);mkdirSync(directory,{recursive:true});
let design={...defaultBuildingDesign(),name:'Skylight atelier',blocks:Array(100).fill(0),paintColors:['#c1b99d','#465b65','#c6b998','#3d765d']};
for(let y=2;y<=7;y++)for(let x=1;x<=8;x++)design.blocks[y*10+x]=2;
design.materials=Array.from({length:500},(_,i)=>i%5===4?8:i%5===2?7:9);
const outside=Array.from({length:100},(_,i)=>i).filter(i=>!groundCovered(design,i));design.groundPaint=paintGround(design,outside,10);
design.groundPaint=paintGround(design,outside.filter(i=>Math.floor(i/10)===8),9);
design.roofDetails=[{kind:1,u:2.2,v:3.2,width:1.4,depth:2.8,plane:[0,0,.4]},{kind:1,u:4.4,v:3.2,width:1.4,depth:2.8,plane:[0,0,.4]},{kind:3,u:6.6,v:3.3,width:1.2,depth:2.6,plane:[0,0,.4]}];
design.decals=[{kind:5,side:2,plane:8,u:1.15,z:.32,width:7.6,height:.06},{kind:2,side:2,plane:8,u:4.4,z:.12,width:1.2,height:.28}];
const portable=exportBuildingDesign(design);assert.deepEqual(importBuildingDesign(portable),design);writeFileSync(new URL('skylight-atelier.building.json',directory),portable+'\n');
const city=createCity();city.buildingDesigns[2]=design;assert.deepEqual(validateSave(JSON.parse(serializeCity(city))).buildingDesigns[2],design);
const frames=[];for(let rotation=0;rotation<4;rotation++){let path=[];const commands=[],ctx={beginPath(){path=[];},closePath(){},moveTo(x,y){path.push([x,y]);},lineTo(x,y){path.push([x,y]);},fill(){commands.push({points:path,color:this.fillStyle});},stroke(){commands.push({points:path,color:this.strokeStyle,lineWidth:this.lineWidth});}};drawBuildingDesign(ctx,design,rotation);frames.push(commands);}
writeFileSync(new URL('review-polygons.json',directory),JSON.stringify(frames));
console.log('PASS: roof-detail review model roundtrips through portable and city saves; generated four runtime views.');
