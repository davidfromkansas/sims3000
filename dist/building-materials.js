import {BUILDING_MATERIAL_LIMIT,solidPaintColor} from './building-paint-colors.js?v=architecture-workspace-1';
export const BUILDING_MATERIALS=['Original facade','Brick','Stucco','Glass','Roof tiles','Grass','Asphalt'];
export const SURFACE_NAMES=['North wall','East wall','South wall','West wall','Roof'];
export function validateBuildingMaterials(value){if(!Array.isArray(value)||value.length!==500||!Array.from(value).every(v=>Number.isInteger(v)&&v>=0&&v<BUILDING_MATERIAL_LIMIT))throw Error('Building paint needs 500 valid surface materials.');return [...value];}
export function exposedSurface(blocks,index,side){if(!blocks[index])return false;if(side===4)return true;const x=index%10,y=Math.floor(index/10),[dx,dy]=[[0,-1],[1,0],[0,1],[-1,0]][side],nx=x+dx,ny=y+dy;return nx<0||ny<0||nx>=10||ny>=10||blocks[ny*10+nx]<blocks[index];}
// A wall fill stays on its plane; a roof fill stays at the same elevation.
export function paintBuildingSurface(blocks,materials,index,side,material,fill=false,touched=[]){
 if(!Number.isInteger(index)||index<0||index>=100||!Number.isInteger(side)||side<0||side>4||!Number.isInteger(material)||material<0||material>=BUILDING_MATERIAL_LIMIT)throw Error('Choose a surface and material.');
 const next=materials?validateBuildingMaterials(materials):Array(500).fill(0);if(!exposedSurface(blocks,index,side))return next;const original=next[index*5+side],height=blocks[index],queue=[index],seen=new Set();
 while(queue.length){const i=queue.pop();if(seen.has(i))continue;seen.add(i);if(blocks[i]!==height||next[i*5+side]!==original||!exposedSurface(blocks,i,side))continue;next[i*5+side]=material;touched.push(i*5+side);if(!fill)break;const x=i%10,y=Math.floor(i/10);if(side===4||side%2===0){if(x>0)queue.push(i-1);if(x<9)queue.push(i+1);}if(side===4||side%2===1){if(y>0)queue.push(i-10);if(y<9)queue.push(i+10);}}
 return next;
}
export function materialSurfaceColor(material,d){return solidPaintColor(material,d)??[d.facade,'#aa6750','#d4c5aa',d.windows,'#7a5960','#668944','#555b60'][material];}
// Draw original procedural material detail in face coordinates, clipped by construction.
export function drawMaterialDetail(face,material,d,polygon){
 const a=face.points[0],b=face.points[1],c=face.points[3],point=(u,v)=>a.map((n,i)=>n+(b[i]-n)*u+(c[i]-n)*v),rect=(u,v,w,h,color)=>polygon([point(u,v),point(u+w,v),point(u+w,v+h),point(u,v+h)],color);
 if(material===5||material===6){
  const rows=face.side===4?4:Math.max(1,face.to-face.from)*4;
  let seed=((face.x||0)*73856093^(face.y||0)*19349663^face.side*83492791^material*2654435761)>>>0;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let row=0;row<rows;row++)for(let col=0;col<3;col++){
   const u=(col+.15+random()*.65)/3,v=(row+.12+random()*.6)/rows;
   rect(u,v,material===5?.025:.03,(material===5?.2:.12)/rows,material===5?(random()>.5?'#73964f':'#577b3c'):(random()>.5?'#656b6e':'#4a5156'));
  }return;
 }
 if(face.side===4){if(material===4){rect(0,.46,1,.08,'#b58983');rect(.46,0,.08,1,'#b58983');}return;}
 const floors=face.to-face.from,rows=material===1?floors*3:material===4?floors*2:floors;
 if(material===1||material===3||material===4){const mortar=material===3?'#aac7cc':material===1?'#d0aa89':'#b58983';for(let row=0;row<rows;row++){const v=row/rows;rect(0,v,1,.045/rows,mortar);const u=row%2?.45:.2;rect(u,v,.045,1/rows,mortar);}}
 if(material===3)rect(.08,.05,.16,.9,'#87acb5');
}

export function usesLandscapeMaterials(design){return Array.isArray(design?.materials)&&design.materials.some(v=>v>=5)||typeof design?.surfacePaint==='string'&&/[67]/.test(design.surfacePaint);}

export function buildingMaterialName(material,design){return BUILDING_MATERIALS[material]??`Solid paint ${solidPaintColor(material,design)||'unavailable'}`;}
