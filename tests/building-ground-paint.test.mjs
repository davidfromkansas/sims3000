import assert from 'node:assert/strict';
import {groundFaces,groundMaterial,paintGround,connectedGround,validateGroundPaint,groundCovered} from '../dist/building-ground-paint.js';
import {defaultBuildingDesign,exportBuildingDesign,importBuildingDesign,drawBuildingDesign} from '../dist/building-designs.js';
import {createCity,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const base={...defaultBuildingDesign(),blocks:Array(100).fill(0)};base.blocks[44]=3;
const grass={...base,groundPaint:paintGround(base,[0,1,10],5)};assert.equal(groundMaterial(grass,0),5);assert.equal(groundMaterial(grass,2),-1);assert.equal(base.groundPaint,undefined);assert.deepEqual(connectedGround(grass,0).sort((a,b)=>a-b),[0,1,10]);assert.equal(groundCovered(base,44),true);assert.deepEqual(connectedGround(base,44),[]);
assert.equal(paintGround(grass,[0],-1)[0],'0');for(const bad of ['',null,'8'.repeat(100),'0'.repeat(99)])assert.throws(()=>validateGroundPaint(bad));assert.throws(()=>paintGround(base,[-1],5));assert.throws(()=>paintGround(base,[0],7));
for(let rotation=0;rotation<4;rotation++){const faces=groundFaces(grass,rotation);assert.equal(faces.length,100);assert.equal(new Set(faces.map(f=>f.index)).size,100);assert.ok(faces.flatMap(f=>f.polygon).every(([x,y])=>x>=0&&x<=256&&y>=0&&y<=384));let fills=[];drawBuildingDesign({beginPath(){},closePath(){},moveTo(){},lineTo(){},stroke(){},fill(){fills.push(this.fillStyle);}},grass,rotation);assert.ok(fills.includes('#668944'));assert.equal(fills[0],'#69847c','base remains below ground paint');}
const file=JSON.parse(exportBuildingDesign(grass));assert.equal(file.version,12);assert.deepEqual(importBuildingDesign(JSON.stringify(file)),grass);file.version=11;assert.throws(()=>importBuildingDesign(JSON.stringify(file)));
const city=createCity();city.buildingDesigns[2]=grass;const saved=JSON.parse(serializeCity(city));assert.equal(saved.version,152);assert.deepEqual(validateSave(saved).buildingDesigns[2],grass);saved.version=150;assert.throws(()=>validateSave(saved),/151/);delete saved.buildingDesigns[2].groundPaint;assert.equal(validateSave(saved).version,152);
console.log('PASS: ground paint/restore, material-separated fill, building barriers, four-view rendering, portable format 12 and city version 151 gates.');
const {encodeCustomBuildingLibrary,decodeCustomBuildingLibrary}=await import('../dist/custom-building-library.js');
const {copyBuildingSet,applyBuildingSet}=await import('../dist/building-sets.js');
const props=[{kind:'car',x:1,y:1,z:0,rotation:2}],combined={...grass,props};assert.deepEqual(decodeCustomBuildingLibrary(encodeCustomBuildingLibrary([combined])),[combined]);
city.buildingDesigns[2]=combined;const target=createCity();applyBuildingSet(target,copyBuildingSet(city));assert.deepEqual(target.buildingDesigns[2],combined);
const max={...defaultBuildingDesign(),footprint:{width:5,height:5},voxels:Array(100).fill(0xffffff),materials:Array(500).fill(6),surfacePaint:'7'.repeat(12000),surfaceDetails:'11110'.repeat(2400),props:Array.from({length:64},(_,i)=>({kind:'tree',x:i%10,y:Math.floor(i/10),z:3.4800009999999997,rotation:i%4})),blockGeometry:'0'.repeat(2400),groundPaint:'7'.repeat(100)};
const largest=exportBuildingDesign(max);assert.ok(largest.length<32768);assert.deepEqual(importBuildingDesign(largest),max);
