import {writeFileSync,mkdirSync} from 'node:fs';
import {detailSwatchSVG} from '../dist/building-detail-palette.js';
import {defaultBuildingDesign} from '../dist/building-designs.js';
const directory=new URL('../art/architecture/detail-palette/',import.meta.url);mkdirSync(directory,{recursive:true});
const base=defaultBuildingDesign(),variants={default:base,terracotta:{...base,facade:'#9c5643',windows:'#203b50',accent:'#e5b563'},night:{...base,facade:'#253741',windows:'#d8b965',accent:'#b7c7c9'}};
for(const [name,design] of Object.entries(variants))for(let kind=1;kind<=5;kind++)writeFileSync(new URL(name==='default'?`detail-${kind}.svg`:`${name}-${kind}.svg`,directory),detailSwatchSVG(kind,design));
console.log('Generated 15 runtime detail preview SVGs across three building palettes.');
