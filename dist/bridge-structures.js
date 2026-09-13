// Manual p.95 distinguishes short causeways and long suspension spans.
// Six water tiles is original visual calibration, not a recovered original threshold.
export const SUSPENSION_MIN_SPAN=6;
const modes=['road','rail','highway'],present=(t,mode)=>mode==='road'?t.type==='road':!!t[mode],axisOf=(t,mode)=>mode==='road'?t.bridgeAxis:mode==='rail'?t.railAxis:t.highwayAxis;
const caches=new WeakMap();
function spanAt(c,t,axis,mode){
 const n=Math.sqrt(c.tiles.length),fixed=axis==='x'?t.y:t.x,at=v=>v>=0&&v<n?c.tiles[axis==='x'?fixed*n+v:v*n+fixed]:null;
 let first=t[axis],last=first;while(at(first-1)?.terrain==='water')first--;while(at(last+1)?.terrain==='water')last++;
 const length=last-first+1,missing=[];
 for(let v=first;v<=last;v++){const u=at(v);if(!present(u,mode)||axisOf(u,mode)!==axis)missing.push({x:u.x,y:u.y});}
 const banks=[at(first-1),at(last+1)],bankConnected=banks.map(b=>!!b&&b.terrain==='land'&&present(b,mode));
 return{mode,axis,fixed,first,last,length,style:length>=SUSPENSION_MIN_SPAN?'Suspension bridge':'Causeway',missing,banks:banks.map(b=>b?{x:b.x,y:b.y}:null),bankConnected,towers:[first+Math.floor((length-1)*.2),last-Math.floor((length-1)*.2)]};
}
export function bridgeProfile(c,t,mode){
 if(t.terrain!=='water'||!modes.includes(mode)||!present(t,mode)||!['x','y'].includes(axisOf(t,mode)))return null;
 let cached=caches.get(c);if(!cached||cached.stats!==c.stats){cached={stats:c.stats,tiles:new Map()};caches.set(c,cached);}
 const key=mode+':'+t.x+','+t.y;if(cached.tiles.has(key))return cached.tiles.get(key);
 const profile=spanAt(c,t,axisOf(t,mode),mode);
 for(let v=profile.first;v<=profile.last;v++)cached.tiles.set(mode+':'+(profile.axis==='x'?v+','+profile.fixed:profile.fixed+','+v),profile);
 return profile;
}
export function proposedBridgeSpans(c,points,mode){
 if(!modes.includes(mode)||!points.length)return[];
 const n=Math.sqrt(c.tiles.length),axis=points.every(p=>p.y===points[0].y)?'x':points.every(p=>p.x===points[0].x)?'y':null;if(!axis)return[];
 const found=new Map();for(const p of points){if(p.x<0||p.y<0||p.x>=n||p.y>=n)continue;const t=c.tiles[p.y*n+p.x];if(t.terrain!=='water')continue;const span=spanAt(c,t,axis,mode);found.set(axis+':'+span.fixed+':'+span.first,span);}return[...found.values()].sort((a,b)=>a.first-b.first);
}
export function bridgeProposalReport(c,points,mode){const spans=proposedBridgeSpans(c,points,mode);return spans.length?`<ul>${spans.map(s=>`<li>${s.style} · ${s.length} water tiles between banks${s.banks.every(Boolean)?` at ${s.banks.map(b=>`${b.x+1}, ${b.y+1}`).join(' and ')}`:''}.</li>`).join('')}</ul><p class="fine">Short spans use causeways; spans of ${SUSPENSION_MIN_SPAN} or more water tiles use suspension structures in this reconstruction. The style is automatic.</p>`:'';}
export function bridgeInspection(c,t){return modes.map(mode=>bridgeProfile(c,t,mode)).filter(Boolean).map(s=>`<h3>${s.style} · ${s.mode}</h3><p>${s.length} water tiles. ${s.missing.length?`${s.missing.length} deck tiles missing. First gap: ${s.missing[0].x+1}, ${s.missing[0].y+1}.`:'The deck is complete.'} ${s.bankConnected.every(Boolean)?'Both bank approaches are connected.':'A bank approach is missing.'}</p><p class="fine">Span style follows the water crossing, so a damaged suspension bridge keeps its remaining towers and cable profile. Repair by dragging the matching route between dry banks. Network condition and reachable destinations still determine transport service.</p>`).join('');}
export function bridgeStructureLines(s,t){
 const lines=[],add=(a,b,color,width)=>lines.push({a,b,color,width}),coord=(along,side,height)=>s.axis==='x'?[along,t.y+side,height]:[t.x+side,along,height],v=t[s.axis],side=.22,pierBase=s.mode==='highway'?-.95:-.30;
 for(const edge of [-side,side]){
  add(coord(v-.5,edge,.08),coord(v+.5,edge,.08),'#d8d7bb',.035);
  if(s.style==='Causeway'){add(coord(v,edge,pierBase),coord(v,edge,.08),'#a5b0a3',.10);continue;}
  const [a,b]=s.towers,height=at=>at<a?Math.max(.1,1.5*(at-(s.first-.5))/(a-(s.first-.5))):at>b?Math.max(.1,1.5*((s.last+.5)-at)/((s.last+.5)-b)):.45+1.05*((at-(a+b)/2)/((b-a)/2))**2;
  if(s.towers.includes(v)){add(coord(v,edge,pierBase),coord(v,edge,1.60),'#a5b5a7',.12);if(edge<0)add(coord(v,-side,1.33),coord(v,side,1.33),'#c2cbb5',.10);}
  for(let step=0;step<4;step++){const x=v-.5+step*.25;add(coord(x,edge,height(x)),coord(x+.25,edge,height(x+.25)),'#d7cda7',.035);}
  for(const offset of [-.25,.25])add(coord(v+offset,edge,.08),coord(v+offset,edge,height(v+offset)),'#b6c1af',.02);
 }
 return lines;
}
export function drawBridgeStructure(renderer,t,mode){
 if(renderer.layer!=='city')return;const s=bridgeProfile(renderer.getCity(),t,mode);if(!s)return;
 const u=renderer.unit,base=renderer.project(t.x,t.y),origin=renderer.transform(t.x,t.y),deck=mode==='highway'?-.15:.5;
 const project=([x,y,z])=>{const q=renderer.transform(x,y),dx=q[0]-origin[0],dy=q[1]-origin[1];return{x:base.x+(dx-dy)*u,y:base.y+(dx+dy)*u/2+(deck-z)*u};};
 for(const line of bridgeStructureLines(s,t))renderer.line([project(line.a),project(line.b)],line.color,Math.max(.6,line.width*u));
}
