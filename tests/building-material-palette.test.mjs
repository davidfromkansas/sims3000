import assert from 'node:assert/strict';
import {materialPaletteHTML,mountBuildingMaterialPalette,drawMaterialSwatch} from '../dist/building-material-palette.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
const nodes=new Map();let drawings=0,changes=0,d=defaultBuildingDesign(),points=[];
const ctx={beginPath(){},closePath(){},moveTo(x,y){points.push([x,y]);},lineTo(x,y){points.push([x,y]);},fill(){drawings++;}};
const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',setAttribute(k,v){this[k]=v;},getContext:()=>ctx});return nodes.get(id);};
const material={value:'0',disabled:false,onchange(){changes++;}},palette=mountBuildingMaterialPalette({querySelector:s=>node(s.slice(1))},{get:()=>d,material});
assert.ok(points.every(([x,y])=>x>=0&&x<=80&&y>=0&&y<=64));const initial=drawings;palette.refresh();assert.equal(drawings,initial,'unchanged previews are reused');
node('materialSwatch5').onclick();assert.equal(material.value,'5');assert.equal(changes,1);assert.equal(node('materialSwatch5')['aria-pressed'],'true');assert.equal(node('materialSwatch0')['aria-pressed'],'false');
node('materialSet').value='landscape';node('materialSet').onchange();assert.equal(node('materialSwatch1').hidden,true);assert.equal(node('materialSwatch6').hidden,false);
material.value='1';palette.refresh();assert.equal(node('materialSet').value,'all','sampling another group reveals the selection');assert.equal(node('materialSwatch1')['aria-pressed'],'true');
material.disabled=true;palette.refresh();node('materialSwatch6').onclick();assert.equal(material.value,'1');assert.equal(changes,1);assert.equal(node('materialSwatch6').disabled,true);
d={...d,facade:'#123456'};palette.refresh();assert.ok(drawings>initial);
const html=materialPaletteHTML();assert.equal((html.match(/<button /g)||[]).length,36);assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);assert.match(html,/type="hidden" value="0"/);
for(let i=0;i<7;i++){points=[];drawMaterialSwatch(ctx,i,d);assert.ok(points.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=80&&y>=0&&y<=64));}
console.log('PASS: bounded runtime texture previews, cached drawing, visual selection, authored groups, sampled-selection reveal and disabled-tool behavior.');
