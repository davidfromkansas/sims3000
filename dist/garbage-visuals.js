// Original curbside props indicating recorded uncollected waste. The bounded
// display scale is illustrative; the simulation retains the full backlog.
export function garbagePileCount(tile){if(tile.terrain==='water'||tile.fire||tile.rubble||tile.radiation||!Number.isFinite(tile.waste)||tile.waste<1)return 0;return tile.waste<5?1:tile.waste<15?2:tile.waste<40?3:4;}
export function garbageProps(tile){const count=garbagePileCount(tile);return Array.from({length:count},(_,i)=>({side:i%2?1:-1,offset:Math.floor(i/2)*.22,kind:(tile.x*7+tile.y*3+i)%3}));}
export function drawGarbageBacklog(ctx,tile,p,unit){
 const props=garbageProps(tile);if(!props.length)return;
 ctx.save();const polygon=(points,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...points[0]);for(const point of points.slice(1))ctx.lineTo(...point);ctx.closePath();ctx.fill();};
 for(const prop of props){const x=p.x+prop.side*unit*(.57-prop.offset),y=p.y+unit*(.77+prop.offset*.5),w=unit*.18,h=unit*.20;
 ctx.fillStyle='#19302b66';ctx.beginPath();ctx.ellipse(x,y+unit*.025,w*.8,h*.28,0,0,Math.PI*2);ctx.fill();
 if(prop.kind===0){polygon([[x-w*.6,y-h*.12],[x-w*.5,y-h*.8],[x,y-h],[x+w*.5,y-h*.65],[x+w*.65,y-h*.08],[x,y+h*.1]],'#465249');polygon([[x,y-h],[x+w*.5,y-h*.65],[x+w*.65,y-h*.08],[x,y+h*.1]],'#303d35');polygon([[x-w*.12,y-h],[x-w*.2,y-h*1.18],[x+w*.18,y-h*1.14],[x+w*.1,y-h]],'#657261');}
 else if(prop.kind===1){polygon([[x-w*.6,y-h*.65],[x,y-h*.9],[x+w*.65,y-h*.6],[x,y-h*.35]],'#c2a577');polygon([[x-w*.6,y-h*.65],[x,y-h*.35],[x,y],[x-w*.6,y-h*.25]],'#a88859');polygon([[x,y-h*.35],[x+w*.65,y-h*.6],[x+w*.65,y-h*.2],[x,y]],'#806845');}
 else{polygon([[x-w*.6,y-h*.65],[x,y-h*.9],[x+w*.55,y-h*.65],[x+w*.5,y-h*.12],[x,y+h*.05],[x-w*.5,y-h*.15]],'#8b9690');polygon([[x,y-h*.9],[x+w*.55,y-h*.65],[x+w*.5,y-h*.12],[x,y+h*.05]],'#626f69');polygon([[x-w*.6,y-h*.65],[x,y-h*.9],[x+w*.55,y-h*.65],[x,y-h*.45]],'#bdc6b8');}
 polygon([[x+w*.55,y],[x+w*1.0,y-h*.16],[x+w*1.25,y],[x+w*.85,y+h*.16]],'#d1c9ad');
 }
 ctx.restore();
}
