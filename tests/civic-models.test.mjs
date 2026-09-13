import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MODELED_CIVIC,civicGeometry,civicFaces,rasterizeCivic,drawCityCivic} from '../dist/civic-models.js';
import {createCity,build,validateSave,tick} from '../dist/engine.js';
import {SERVICES} from '../dist/civic.js';
import {serializeCity} from '../dist/save.js';
assert.deepEqual([...MODELED_CIVIC],Object.keys(SERVICES));
for(const type of MODELED_CIVIC){
 const geometry=civicGeometry(type);assert.ok(geometry.length>100);assert.deepEqual(civicGeometry(type),geometry);
 const views=[];for(let rotation=0;rotation<4;rotation++){const faces=civicFaces(type,rotation);assert.ok(faces.length>50);for(const face of faces){assert.match(face.color,/^#[\da-f]{6}$/i);for(const [x,y] of face.points)assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=512&&y>=0&&y<=512);}const raster=rasterizeCivic(type,rotation);assert.equal(raster.data.length,512*512*4);const pixels=raster.data.filter((_,i)=>i%4===3);assert.ok(pixels.filter(v=>v===255).length>20000);assert.ok(pixels.filter(v=>v===0).length>100000);views.push(Buffer.from(raster.data).toString('base64'));}
 assert.equal(new Set(views).size,4,'each orientation has its own raster');
}
assert.throws(()=>civicGeometry('unknown'));
let created=0,put=0,drawn=0;const context=()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){put++;},save(){},restore(){},drawImage(){drawn++;}});
globalThis.document={createElement:()=>{created++;return{getContext:context};}};
const ctx=context(),city=createCity('Civic collection',false);city.funds=100000;for(const t of city.tiles){t.terrain='land';t.nature=false;t.elevation=0;}
for(const [i,type] of [...MODELED_CIVIC].entries())assert.ok(build(city,type,[{x:10+i*3,y:20}]).ok,type);
const saved=serializeCity(city);
for(let pass=0;pass<2;pass++)for(const type of MODELED_CIVIC)for(let rotation=0;rotation<4;rotation++)drawCityCivic(ctx,type,rotation,200,200,180,.7);
assert.equal(created,32);assert.equal(put,32,'depth rasterization occurs once per cached orientation');assert.equal(drawn,64);assert.equal(serializeCity(city),saved);
const loaded=validateSave(JSON.parse(saved));tick(city);tick(loaded);assert.deepEqual(city.stats,loaded.stats,'civic scenery leaves service behavior intact');
// Execute the exact renderer branch with a recording draw function: orientation,
// projection, fading and the existing inactive-service marker must all be retained.
const source=readFileSync(new URL('../dist/renderer.js',import.meta.url),'utf8'),start=source.indexOf('else if(SERVICES[t.type]){'),end=source.indexOf('else if(STATIONS[t.type])',start),body=source.slice(start+'else if(SERVICES[t.type]){'.length,end).trim().slice(0,-1);
let call,marker;const renderService=new Function('drawCityCivic','return function(c,t,p,u,fade){'+body+'}')( (...args)=>{call=args;} ),scene={rotation:3,layer:'city'},context2={fillText:(...args)=>{marker=args;}};
renderService.call(scene,context2,{type:'fire',serviceActive:false},{x:100,y:80},40,.35);assert.deepEqual(call,[context2,'fire',3,100,100,84,.35]);assert.equal(marker[0],'!');
marker=null;renderService.call({...scene,layer:'fire'},context2,{type:'fire',serviceActive:false},{x:100,y:80},40,.22);assert.equal(marker,null);
console.log('PASS: all eight civic services, deterministic bounded four-view geometry and depth rasters, transparent sprite buffers, 32-view caching, real construction, unchanged saves and simulation continuation.');
