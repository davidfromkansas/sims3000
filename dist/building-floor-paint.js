import {BUILDING_MATERIAL_LIMIT,encodePaintMaterial,decodePaintMaterial} from './building-paint-colors.js?v=architecture-workspace-1';
// One character per column, floor and side: 0 inherits column paint; 1–7
// explicitly select the palette, including the original facade. Fixed bounds
// make imported paint predictable without allowing arbitrary object keys.
export const FLOOR_PAINT_SIZE=100*24*5;
export function validateFloorPaint(value){if(typeof value!=='string'||value.length!==FLOOR_PAINT_SIZE||/[^0-9a-z]/.test(value))throw Error('Floor paint needs 12,000 valid surface entries.');return value;}
export function surfaceLevel(face){return face.side===4?face.to-1:face.from;}
export function floorPaintKey(face){const index=face.index??face.y*10+face.x,level=surfaceLevel(face);if(!Number.isInteger(index)||index<0||index>=100||!Number.isInteger(level)||level<0||level>=24||!Number.isInteger(face.side)||face.side<0||face.side>4)throw Error('Choose a valid floor surface.');return (index*24+level)*5+face.side;}
export function floorSurfaceMaterial(design,face){const value=decodePaintMaterial(design.surfacePaint?.[floorPaintKey(face)]||'0');return value>=0?value:design.materials?.[(face.y*10+face.x)*5+face.side]||0;}
export function paintFloorSurfaces(design,faces,material){if(!Number.isInteger(material)||material<0||material>=BUILDING_MATERIAL_LIMIT||material>=7&&!design.paintColors?.[material-7])throw Error('Choose a valid building material.');const next=(design.surfacePaint?validateFloorPaint(design.surfacePaint):'0'.repeat(FLOOR_PAINT_SIZE)).split('');for(const face of faces)next[floorPaintKey(face)]=encodePaintMaterial(material);return next.join('');}
export function clearColumnFloorPaint(paint,indices){if(!paint)return undefined;const next=validateFloorPaint(paint).split('');for(const slot of indices)for(let level=0;level<24;level++)next[(Math.floor(slot/5)*24+level)*5+slot%5]='0';return next.join('');}
// Preserve painter order while slicing a broad height-layout wall into floors.
export function splitBuildingFloors(faces){return faces.flatMap(face=>{if(face.side===4||face.to-face.from===1)return [face];return Array.from({length:face.to-face.from},(_,i)=>{const from=face.from+i,to=from+1,bottom=from===0?0:.12+from*.14,top=.12+to*.14;return {...face,from,to,points:face.points.map((p,j)=>[p[0],p[1],j<2?bottom:top])};});});}
