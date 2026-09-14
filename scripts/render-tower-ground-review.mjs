import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {defaultBuildingDesign,drawBuildingDesign,exportBuildingDesign,importBuildingDesign} from '../dist/building-designs.js';
import {paintGround,groundCovered} from '../dist/building-ground-paint.js';
import {createCity,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const directory=new URL('../art/architecture/tower-ground/',import.meta.url);mkdirSync(directory,{recursive:true});
let design={...defaultBuildingDesign(),name:'Terrace garden tower',floors:10,width:6,depth:8,roof:'step',facade:'#cfbda6',windows:'#34566b',accent:'#eee0c5'};
const outside=Array.from({length:100},(_,i)=>i).filter(i=>!groundCovered(design,i));design.groundPaint=paintGround(design,outside,5);
design.groundPaint=paintGround(design,outside.filter(i=>Math.floor(i/10)===8||(i%10===5&&i>=80)),6);
const portable=exportBuildingDesign(design);assert.deepEqual(importBuildingDesign(portable),design);writeFileSync(new URL('terrace-garden.building.json',directory),portable+'\n');
const city=createCity();city.buildingDesigns[2]=design;assert.deepEqual(validateSave(JSON.parse(serializeCity(city))).buildingDesigns[2],design);
const frames=[];for(let rotation=0;rotation<4;rotation++){let path=[];const commands=[],ctx={beginPath(){path=[];},closePath(){},moveTo(x,y){path.push([x,y]);},lineTo(x,y){path.push([x,y]);},fill(){commands.push({points:path,color:this.fillStyle});},stroke(){commands.push({points:path,color:this.strokeStyle,lineWidth:this.lineWidth});}};drawBuildingDesign(ctx,design,rotation);frames.push(commands);}
writeFileSync(new URL('review-polygons.json',directory),JSON.stringify(frames));
console.log('PASS: tower-ground review model roundtrips through portable and city saves; generated four runtime views.');
