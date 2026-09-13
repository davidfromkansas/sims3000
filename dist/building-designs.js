import {validateBuildingMaterials} from './building-materials.js?v=recreation-models-1';
import {validateBuildingBlocks,drawBuildingBlocks} from './building-blocks.js?v=recreation-models-1';
import {REPLACEABLE_STYLES,baseZonedSprite} from './building-art.js?v=recreation-models-1';
export const defaultBuildingDesign=()=>({name:'My tower',floors:12,width:8,depth:8,roof:'step',facade:'#b6c4bd',windows:'#3c6b79',accent:'#dab572'});
export function validateBuildingDesign(v){if(!v||typeof v.name!=='string'||!v.name.trim()||v.name.length>40||/[\x00-\x1f]/.test(v.name)||!Number.isInteger(v.floors)||v.floors<4||v.floors>24||!Number.isInteger(v.width)||v.width<6||v.width>10||!Number.isInteger(v.depth)||v.depth<6||v.depth>10||!['flat','step','spire'].includes(v.roof)||!['facade','windows','accent'].every(k=>typeof v[k]==='string'&&/^#[0-9a-f]{6}$/i.test(v[k])))throw Error('Choose a name, 4–24 floors, dimensions 6–10, a roof style and valid colors.');const result=Object.fromEntries(['name','floors','width','depth','roof','facade','windows','accent'].map(k=>[k,k==='name'?v[k].trim():v[k]]));if(v.blocks!==undefined)result.blocks=validateBuildingBlocks(v.blocks);if(v.materials!==undefined){if(!result.blocks)throw Error('Surface paint needs a block layout.');result.materials=validateBuildingMaterials(v.materials);}return result;}
export function validateBuildingDesigns(v){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length>4)throw Error('Invalid custom building library.');const result={};for(const [key,design]of Object.entries(v)){if(!Object.hasOwn(REPLACEABLE_STYLES,key))throw Error('Invalid custom building slot.');result[key]=validateBuildingDesign(design);}return result;}
export function designForTile(city,tile){if(tile.rubble||!['residential','commercial'].includes(tile.type)||(tile.historicalLevel||tile.abandonedLevel||tile.level)!==3)return null;return city.buildingDesigns?.[baseZonedSprite(tile,city.seed)]||null;}
export function applyBuildingDesign(city,source,design){if(!Object.hasOwn(REPLACEABLE_STYLES,source))throw Error('Choose a tower style.');city.buildingDesigns=validateBuildingDesigns({...city.buildingDesigns,[source]:design});}
export function exportBuildingDesign(design){return JSON.stringify({format:'SIMS3000-building',version:design.materials?3:design.blocks?2:1,design:validateBuildingDesign(design)},null,2);}
export function importBuildingDesign(text){if(typeof text!=='string'||text.length>8192)throw Error('Building files must be smaller than 8 KB.');let file;try{file=JSON.parse(text);}catch{throw Error('This is not a valid building file.');}if(file?.format!=='SIMS3000-building'||![1,2,3].includes(file.version)||(file.version>=2)!==(file.design?.blocks!==undefined)||(file.version===3)!==(file.design?.materials!==undefined))throw Error('Choose a SIMS3000 building file.');return validateBuildingDesign(file.design);}
const tint=(hex,factor)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*factor)).toString(16).padStart(2,'0')).join('');
// Model coordinates project into a fixed transparent canvas; cached city drawings remain cheap.
export function drawBuildingDesign(ctx,d,rotation=0){
 const unit=64,rot=((rotation%4)+4)%4,turn=(x,y)=>rot===0?[x,y]:rot===1?[-y,x]:rot===2?[-x,-y]:[y,-x];
 const project=([x,y,z])=>{const [a,b]=turn(x,y);return [128+(a-b)*unit,346+(a+b)*unit/2-z*unit];};
 const polygon=(points,color)=>{ctx.beginPath();points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill();};
 function box(w,dep,z,height,color,windows=false,floors=1){const corners=[[-w/2,-dep/2],[w/2,-dep/2],[w/2,dep/2],[-w/2,dep/2]],visible=[[1,2],[0,1],[0,3],[2,3]][rot];
  for(const side of visible){const a=corners[side],b=corners[(side+1)%4];polygon([[...a,z],[...b,z],[...b,z+height],[...a,z+height]],tint(color,side%2?.72:.9));
   if(windows)for(let floor=0;floor<floors;floor++)for(let column=0;column<4;column++){const left=(column+.2)/4,right=(column+.73)/4,low=z+(floor+.23)*height/floors,high=z+(floor+.7)*height/floors,point=(f,h)=>[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,h];polygon([point(left,low),point(right,low),point(right,high),point(left,high)],(floor*7+column*3+side)%9===0?d.accent:d.windows);}}
  polygon(corners.map(a=>[...a,z+height]),tint(color,1.08));
 }
 polygon([[-.5,-.5,0],[.5,-.5,0],[.5,.5,0],[-.5,.5,0]],'#69847c');
 if(d.blocks){drawBuildingBlocks(ctx,d,rotation);return;}
 const w=d.width*.085,dep=d.depth*.085,h=d.floors*.14;box(w+.08,dep+.08,0,.12,d.accent);if(d.roof==='step'){const lower=Math.ceil(d.floors*.65);box(w,dep,.12,lower*.14,d.facade,true,lower);box(w*.7,dep*.7,.12+lower*.14,(d.floors-lower)*.14,d.facade,true,d.floors-lower);}else box(w,dep,.12,h,d.facade,true,d.floors);
 box(w*.3,dep*.3,h+.12,.12,d.accent);if(d.roof==='spire'){const p=project([0,0,h+.25]),q=project([0,0,h+.8]);ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.strokeStyle=d.accent;ctx.lineWidth=3;ctx.stroke();}
}
export function buildingDesignCanvas(design,rotation=0){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=384;drawBuildingDesign(canvas.getContext('2d'),design,rotation);return canvas;}
const sprites=new Map();
export function drawDesignedBuilding(renderer,tile,design,opacity=1){const key=JSON.stringify(design)+renderer.rotation;let canvas=sprites.get(key);if(!canvas){canvas=buildingDesignCanvas(design,renderer.rotation);if(sprites.size>=16)sprites.delete(sprites.keys().next().value);sprites.set(key,canvas);}const p=renderer.project(tile.x,tile.y),scale=renderer.unit/64,c=renderer.ctx;c.save();c.globalAlpha=opacity;c.drawImage(canvas,p.x-128*scale,p.y+renderer.unit/2-346*scale,256*scale,384*scale);c.restore();}
