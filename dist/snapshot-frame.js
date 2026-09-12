export function frameRect(width,height,index,x=width/2,y=height/2){
 const w=Math.min(width-16,(height-16)*4/3)*[.35,.6,.9][index],h=w*3/4;
 return{x:Math.max(0,Math.min(width-w,x-w/2)),y:Math.max(0,Math.min(height-h,y-h/2)),width:w,height:h};
}
export function frameSnapshot(renderer,done){
 const layer=document.createElement('div');layer.className='snapshot-framing';layer.tabIndex=0;
 layer.innerHTML='<div class="snapshot-frame" aria-hidden="true"></div><div class="snapshot-frame-controls"><strong>Photo mode</strong><span>Move to frame · Click to capture · Space changes size</span><div class="actions"><button data-size="0">Small</button><button data-size="1">Medium</button><button data-size="2">Large</button><button data-capture>Take photo</button><button data-cancel>Cancel</button></div></div>';
 const siblings=[...document.body.children].map(el=>[el,el.inert]);siblings.forEach(([el])=>el.inert=true);document.body.append(layer);const frame=layer.firstElementChild,controls=layer.lastElementChild;let index=1,bounds,point=null,crop,finished=false;
 const layout=()=>{bounds=renderer.canvas.getBoundingClientRect();Object.assign(layer.style,{left:bounds.left+'px',top:bounds.top+'px',width:bounds.width+'px',height:bounds.height+'px'});crop=frameRect(bounds.width,bounds.height,index,point?.x,point?.y);Object.assign(frame.style,{left:crop.x+'px',top:crop.y+'px',width:crop.width+'px',height:crop.height+'px'});layer.querySelectorAll('[data-size]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.size)===index)));};
 const finish=value=>{if(finished)return;finished=true;window.removeEventListener('keydown',key,true);window.removeEventListener('keyup',up,true);window.removeEventListener('resize',layout);layer.remove();siblings.forEach(([el,inert])=>el.inert=inert);renderer.canvas.focus({preventScroll:true});done(value);};
 const key=e=>{e.stopImmediatePropagation();if(e.code==='Space'){e.preventDefault();if(!e.repeat){index=(index+1)%3;layout();}}else if(e.key==='Escape'){e.preventDefault();finish(null);}else if(e.key==='Enter'&&e.target===layer){e.preventDefault();finish(crop);}};
 const up=e=>{e.stopImmediatePropagation();if(e.code==='Space')e.preventDefault();};
 layer.addEventListener('pointermove',e=>{if(controls.contains(e.target))return;point={x:e.clientX-bounds.left,y:e.clientY-bounds.top};layout();});
 layer.addEventListener('click',e=>{if(!controls.contains(e.target))finish(crop);});
 layer.addEventListener('contextmenu',e=>e.preventDefault());
 layer.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{index=Number(b.dataset.size);layout();});
 layer.querySelector('[data-capture]').onclick=()=>finish(crop);layer.querySelector('[data-cancel]').onclick=()=>finish(null);
 window.addEventListener('keydown',key,true);window.addEventListener('keyup',up,true);window.addEventListener('resize',layout);renderer.hover=null;renderer.drag=null;renderer.dirty=true;layout();layer.focus({preventScroll:true});
}
