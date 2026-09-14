import assert from 'node:assert/strict';
import {detailPaletteHTML,detailSwatchSVG,mountBuildingDetailPalette} from '../dist/building-detail-palette.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
let d=defaultBuildingDesign(),changes=0,writes=0;const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',setAttribute(k,v){this[k]=v;},set innerHTML(v){this.html=v;writes++;}});return nodes.get(id);};
const kind={value:'1',disabled:false,onchange(){changes++;}},palette=mountBuildingDetailPalette({querySelector:s=>node(s.slice(1))},{get:()=>d,kind});
assert.equal(writes,5);palette.refresh();assert.equal(writes,5);
node('detailSwatch5').onclick();assert.equal(kind.value,'5');assert.equal(changes,1);assert.equal(node('detailSwatch5')['aria-pressed'],'true');
node('detailSet').value='trim';node('detailSet').onchange();assert.equal(node('detailSwatch2').hidden,true);assert.equal(node('detailSwatch5').hidden,false);
kind.value='2';palette.refresh();assert.equal(node('detailSet').value,'all');assert.equal(node('detailSwatch2')['aria-pressed'],'true');
kind.disabled=true;palette.refresh();node('detailSwatch4').onclick();assert.equal(kind.value,'2');assert.equal(changes,1);assert.equal(node('detailSwatch4').disabled,true);
d={...d,accent:'#123456'};palette.refresh();assert.equal(writes,10);assert.match(node('detailTexture5').html,/#123456/);
const frames=[];for(let i=1;i<=5;i++){const svg=detailSwatchSVG(i,d);assert.match(svg,/<polygon/);for(const match of svg.matchAll(/points="([^"]+)"/g))for(const point of match[1].split(' ')){const [x,y]=point.split(',').map(Number);assert.ok(x>=8&&x<=72&&y>=8&&y<=56);}frames.push(svg);}assert.equal(new Set(frames).size,5);
assert.doesNotMatch(detailSwatchSVG(5,{...d,accent:'" onload="alert(1)'}),/onload/);
const html=detailPaletteHTML();assert.equal((html.match(/<button /g)||[]).length,5);assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
console.log('PASS: five distinct bounded runtime detail previews, cached color refresh, visual selection, authored groups, sampled selection reveal, disabled controls and escaped colors.');

let surface='wall';kind.disabled=false;kind.value='5';const contextual=mountBuildingDetailPalette({querySelector:s=>node(s.slice(1))},{get:()=>d,kind,surface:()=>surface});surface='roof';contextual.refresh();assert.equal(kind.value,'1');assert.equal(node('detailName1').textContent,'Skylight');assert.equal(node('detailSwatch2').hidden,true);assert.equal(node('detailSwatch5').disabled,true);node('detailSwatch5').onclick();assert.equal(kind.value,'1');node('detailSwatch3').onclick();assert.equal(kind.value,'3');surface='wall';contextual.refresh();assert.equal(node('detailName1').textContent,'Framed window');assert.equal(node('detailSwatch5').disabled,false);
console.log('PASS: roof palette restricts incompatible details, names skylights, selects a usable fallback and restores wall choices.');
