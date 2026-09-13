import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MODELED_WATER,waterGeometry,rasterizeWater,drawCityWater} from '../dist/water-models.js';
import {projectMiniature} from '../dist/miniature-raster.js';
import {WATER_STRUCTURES} from '../dist/utilities.js';
import {createCity,build,recompute,tick,validateSave} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
assert.deepEqual([...MODELED_WATER],Object.keys(WATER_STRUCTURES));
for(const type of MODELED_WATER){const geometry=waterGeometry(type);assert.ok(geometry.length>100);assert.deepEqual(waterGeometry(type),geometry);const views=[];for(let rotation=0;rotation<4;rotation++){
 for(const face of geometry){assert.match(face.color,/^#[a-f\d]{6}$/i);for(const p of face.points){const [x,y]=projectMiniature(p,rotation);assert.ok(x>=0&&x<512&&y>=0&&y<512);}}
 const raster=rasterizeWater(type,rotation);let opaque=0;for(let i=3;i<raster.data.length;i+=4)opaque+=raster.data[i]===255?1:0;assert.ok(opaque>20000&&opaque<150000);views.push(Buffer.from(raster.data).toString('base64'));}assert.equal(new Set(views).size,4);}
assert.throws(()=>waterGeometry('unknown'));
let created=0,put=0,drawn=0;const ctx={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){put++;},save(){},restore(){},drawImage(){drawn++;}};globalThis.document={createElement(){created++;return{getContext:()=>ctx};}};
const city=createCity('Water models',false);city.startYear=2000;city.funds=100000;for(const t of city.tiles){t.terrain='land';t.elevation=0;t.nature=false;}for(const [i,type] of [...MODELED_WATER].entries())assert.ok(build(city,type,[{x:10+i*3,y:10}]).ok);recompute(city);const saved=serializeCity(city);
for(let repeat=0;repeat<2;repeat++)for(const type of MODELED_WATER)for(let rotation=0;rotation<4;rotation++)drawCityWater(ctx,type,rotation,100,100,84,.4);
assert.equal(created,16);assert.equal(put,16);assert.equal(drawn,32);assert.equal(serializeCity(city),saved);const loaded=validateSave(JSON.parse(saved));tick(city);tick(loaded);assert.deepEqual(city.stats,loaded.stats);
const source=readFileSync(new URL('../dist/renderer.js',import.meta.url),'utf8'),body=source.split('else if(WATER_STRUCTURES[t.type])')[1].split('\n')[0];let call;const actual=new Function('drawCityWater','return function(c,t,p,u,fade){'+body+'}')( (...args)=>call=args );
for(const type of MODELED_WATER)for(const layer of ['city','water','power']){actual.call({rotation:2,layer},ctx,{type},{x:100,y:80},40,.12);assert.deepEqual(call,[ctx,type,2,100,100,84,layer==='water'?(type==='pump'?1:.8):.12]);}
console.log('PASS: four distinct water facilities in sixteen bounded transparent views, one-time raster caching, exact renderer rotation/placement/water-layer fading and unchanged construction/save/simulation behavior.');
