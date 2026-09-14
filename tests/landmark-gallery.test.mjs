import assert from 'node:assert/strict';
import {showLandmarks} from '../dist/landmarks-ui.js';
import {LANDMARKS} from '../dist/landmarks.js';
import {MODELED_LANDMARKS,drawLandmarkPreview,drawCityLandmark} from '../dist/landmark-models.js';
import {createCity,build} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
const offscreen=()=>({beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){}});
let created=0;const canvases=new Map(),labels=new Map(),turns=[],places=[];
function canvas(){const calls=[];return {width:420,height:340,calls,setAttribute(k,v){this[k]=v;},getContext:()=>({clearRect(){},drawImage(...args){calls.push(args);}})};}
for(const type of MODELED_LANDMARKS){canvases.set('landmarkPreview-'+type,canvas());labels.set('landmarkDirection-'+type,{});for(const step of [-1,1])turns.push({dataset:{landmarkTurn:type,step:String(step)}});}
const city=createCity('Landmark inspection',false);for(const t of city.tiles)Object.assign(t,{terrain:'land',nature:false,elevation:0});assert.ok(build(city,'helsinkiCathedral',[{x:8,y:8}]).ok);
for(const key of Object.keys(LANDMARKS))places.push({dataset:{landmark:key},disabled:key==='helsinkiCathedral'});
globalThis.document={createElement(){created++;return {width:0,height:0,getContext:offscreen};},getElementById:key=>canvases.get(key)??labels.get(key),querySelectorAll:s=>s==='[data-landmark-turn]'?turns:places};
const before=serializeCity(city);let html='',tool=null,closed=0;
showLandmarks({city:()=>city,dialog:(title,body)=>html=body,close:()=>closed++,setTool:value=>tool=value});
assert.doesNotMatch(html,/eiffel-tower.png/);assert.doesNotMatch(html,/great-pyramid.png/);assert.doesNotMatch(html,/helsinki-cathedral-gallery.png/);
assert.equal(created,11);
for(const type of MODELED_LANDMARKS){
 const preview=canvases.get('landmarkPreview-'+type),left=turns.find(t=>t.dataset.landmarkTurn===type&&t.dataset.step==='-1'),right=turns.find(t=>t.dataset.landmarkTurn===type&&t.dataset.step==='1');
 assert.match(preview['aria-label'],/North view/);left.onclick();assert.match(preview['aria-label'],/West view/);right.onclick();assert.match(preview['aria-label'],/North view/);
 for(const direction of ['East','South','West','North']){right.onclick();assert.equal(labels.get('landmarkDirection-'+type).textContent,direction+' view');}
 for(const args of preview.calls){assert.equal(args.length,9);const [,sx,sy,sw,sh,dx,dy,dw,dh]=args;assert.ok(sx>=0&&sy>=0&&sx+sw<=512&&sy+sh<=848);assert.ok(dx>=11.99&&dy>=11.99&&dx+dw<=408.01&&dy+dh<=328.01);assert.ok(Math.abs(dw/dh-sw/sh)<1e-10);}
}
assert.equal(created,44,'one shared raster per model/view, reused on wrapping');assert.equal(serializeCity(city),before);
places.find(b=>b.disabled).onclick();assert.equal(tool,null);assert.equal(closed,0);
places.find(b=>b.dataset.landmark==='bigBen').onclick();assert.equal(tool,'bigBen');assert.equal(closed,1);assert.equal(serializeCity(city),before,'gallery selection only selects a placement tool');
// The same cache backs city and fitted preview rendering; city anchoring is unchanged.
const calls=[],ctx={clearRect(){},save(){},restore(){},drawImage(...args){calls.push(args);}};const start=created;
drawLandmarkPreview(ctx,'helsinkiCathedral',2,420,340);drawCityLandmark(ctx,'helsinkiCathedral',2,100,200,84,.4);assert.equal(created,start+1);assert.equal(calls[0][0],calls[1][0]);assert.deepEqual(calls[1].slice(1),[58,200-720*84/512,84,848*84/512]);assert.equal(ctx.globalAlpha,.4);
console.log('PASS: actual landmark gallery rotation, accessible view labels, fitted art bounds, unchanged city state, placed-item protection, tool selection and shared preview/city raster caching.');
