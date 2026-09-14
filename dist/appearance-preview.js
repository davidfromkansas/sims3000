import {validateAppearance,landscapePalette,landscapeGround} from './city-appearance.js?v=recent-construction-1';
import {treeCanvas} from './tree-models.js?v=recent-construction-1';
export function drawAppearancePreview(canvas,appearance,rotation=0,renderer){const draft=validateAppearance(appearance),palette=landscapePalette(draft.landscape),ctx=canvas.getContext('2d');
 ctx.clearRect(0,0,540,270);ctx.fillStyle='#213d40';ctx.fillRect(0,0,540,270);
  for(let y=0;y<3;y++)for(let x=0;x<5;x++){const px=270+(x-y)*44-42,py=85+(x+y)*22;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+44,py+22);ctx.lineTo(px,py+44);ctx.lineTo(px-44,py+22);ctx.closePath();ctx.fillStyle=x===4?'rgb('+palette.fresh.join(',')+')':landscapeGround({x,y},draft.landscape);ctx.fill();}
  for(const [x,y,level]of [[0,0,1],[2,0,2],[1,2,3]]){const px=270+(x-y)*44-42,py=85+(x+y)*22+22;if(draft.trees!=='classic'){ctx.drawImage(treeCanvas(draft.trees,level,rotation),px-49,py-61.25,98,98);}else{const sprite=renderer?.sprites?.[41+level];if(sprite){const width=80,height=width*sprite.h/sprite.w;ctx.drawImage(sprite.atlas,sprite.x,sprite.y,sprite.w,sprite.h,px-width/2,py-height+10,width,height);}}}
}
