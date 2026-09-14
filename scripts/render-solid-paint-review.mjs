import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {defaultBuildingDesign,drawBuildingDesign,exportBuildingDesign,importBuildingDesign} from '../dist/building-designs.js';
import {paintGround,groundCovered} from '../dist/building-ground-paint.js';
import {createCity,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const directory=new URL('../art/architecture/solid-paint/',import.meta.url);mkdirSync(directory,{recursive:true});
let design={...defaultBuildingDesign(),name:'Color court',blocks:Array(100).fill(0),paintColors:['#bf594c','#315c6a','#cabd9b','#3d765d']};
for(let y=3;y<=6;y++)for(let x=3;x<=6;x++)design.blocks[y*10+x]=x===3?7:4;
design.materials=Array.from({length:500},(_,i)=>i%5===4?8:i%5===2?7:9);
const outside=Array.from({length:100},(_,i)=>i).filter(i=>!groundCovered(design,i));design.groundPaint=paintGround(design,outside,10);
design.groundPaint=paintGround(design,outside.filter(i=>Math.floor(i/10)===8),9);
const portable=exportBuildingDesign(design);assert.deepEqual(importBuildingDesign(portable),design);writeFileSync(new URL('color-court.building.json',directory),portable+'\n');
const city=createCity();city.buildingDesigns[2]=design;assert.deepEqual(validateSave(JSON.parse(serializeCity(city))).buildingDesigns[2],design);
const frames=[];for(let rotation=0;rotation<4;rotation++){let path=[];const commands=[],ctx={beginPath(){path=[];},closePath(){},moveTo(x,y){path.push([x,y]);},lineTo(x,y){path.push([x,y]);},fill(){commands.push({points:path,color:this.fillStyle});},stroke(){commands.push({points:path,color:this.strokeStyle,lineWidth:this.lineWidth});}};drawBuildingDesign(ctx,design,rotation);frames.push(commands);}
writeFileSync(new URL('review-polygons.json',directory),JSON.stringify(frames));
console.log('PASS: solid-paint review model roundtrips through portable and city saves; generated four runtime views.');
