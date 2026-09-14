import {blockCornerHeights} from './building-block-geometry.js?v=architecture-collection-48';
export const BLOCK_PALETTE_NAMES=['Cube','Wedge · rises north','Wedge · rises east','Wedge · rises south','Wedge · rises west'];
export function blockPaletteIcon(shape){
 if(!Number.isInteger(shape)||shape<0||shape>=BLOCK_PALETTE_NAMES.length)throw Error('Choose a supported block shape.');
 const corners=[[0,0],[1,0],[1,1],[0,1]],heights=blockCornerHeights(shape),bottom=corners.map(([x,y])=>[x,y,0]),top=corners.map(([x,y],i)=>[x,y,heights[i]]),project=([x,y,z])=>[38+(x-y)*24,40+(x+y)*12-z*26];
 const faces=[{points:[bottom[1],bottom[2],top[2],top[1]],color:'#a6bbb1'},{points:[bottom[2],bottom[3],top[3],top[2]],color:'#739185'},{points:top,color:'#d5ded8'}];
 const polygons=faces.map(face=>({...face,points:face.points.map(project)})).filter(face=>face.points.reduce((sum,p,i)=>{const q=face.points[(i+1)%face.points.length];return sum+p[0]*q[1]-q[0]*p[1];},0)>1e-8);
 return `<svg viewBox="0 0 76 80" aria-hidden="true" focusable="false">${polygons.map(face=>`<polygon points="${face.points.map(p=>p.join(',')).join(' ')}" fill="${face.color}" stroke="#49675b" stroke-width=".7" stroke-linejoin="round"/>`).join('')}</svg>`;
}
export function blockPaletteHTML(){return `<fieldset class="building-block-palette"><legend>Block shape</legend><input id="voxelGeometry" type="hidden" value="0"><div>${BLOCK_PALETTE_NAMES.map((name,shape)=>`<button type="button" id="voxelBlock${shape}" aria-pressed="${shape===0}" aria-label="${name}">${blockPaletteIcon(shape)}<span>${name}</span></button>`).join('')}</div></fieldset>`;}
