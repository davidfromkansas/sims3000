import assert from 'node:assert/strict';
import {BLOCK_PALETTE_NAMES,blockPaletteIcon,blockPaletteHTML} from '../dist/building-block-palette.js';
assert.equal(BLOCK_PALETTE_NAMES.length,5);const icons=BLOCK_PALETTE_NAMES.map((_,i)=>blockPaletteIcon(i));assert.equal(new Set(icons).size,5,'cube and four wedge directions have different silhouettes');
for(const icon of icons){assert.match(icon,/aria-hidden="true"/);const points=[...icon.matchAll(/points="([^"]+)"/g)].flatMap(m=>m[1].split(' ').map(pair=>pair.split(',').map(Number)));assert.ok(points.length>=3);assert.ok(points.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=76&&y>=0&&y<=80));}
assert.throws(()=>blockPaletteIcon(5));assert.throws(()=>blockPaletteIcon(NaN));const html=blockPaletteHTML();assert.equal((html.match(/<button /g)||[]).length,5);assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);assert.match(html,/type="hidden" value="0"/);
console.log('PASS: five distinct supported block previews, bounded projection, valid shape rejection and accessible selectable palette markup.');
