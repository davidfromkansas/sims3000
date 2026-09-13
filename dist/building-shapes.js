// Integer footprint selections. Lines use a bounded raster path; planes fill a rectangle.
export function buildingShapeCells(kind,start,end){
 if(!['line','plane'].includes(kind)||![start,end].every(i=>Number.isInteger(i)&&i>=0&&i<100))throw Error('Choose a line or plane within the building footprint.');
 let x=start%10,y=Math.floor(start/10);const x1=end%10,y1=Math.floor(end/10),cells=[];
 if(kind==='plane'){for(let row=Math.min(y,y1);row<=Math.max(y,y1);row++)for(let col=Math.min(x,x1);col<=Math.max(x,x1);col++)cells.push(row*10+col);return cells;}
 const dx=Math.abs(x1-x),dy=-Math.abs(y1-y),sx=x<x1?1:-1,sy=y<y1?1:-1;let error=dx+dy;
 for(;;){cells.push(y*10+x);if(x===x1&&y===y1)return cells;const twice=2*error;if(twice>=dy){error+=dy;x+=sx;}if(twice<=dx){error+=dx;y+=sy;}}
}
export function applyBuildingShape(blocks,kind,start,end,height){
 if(!Array.isArray(blocks)||blocks.length!==100||!Number.isInteger(height)||height<0||height>24)throw Error('Choose a height from 0 to 24.');
 const next=[...blocks];for(const i of buildingShapeCells(kind,start,end))next[i]=height;return next;
}
