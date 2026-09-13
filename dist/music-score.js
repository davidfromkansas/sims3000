// Original miniature scores. No samples or melodies from the original game are used.
export const MUSIC_TRACKS={
 morning:{name:'Morning permits',description:'Warm electric keys, bass and a light brushed pulse.',bpm:88,roots:[48,45,50,43],quality:[[0,4,7,11],[0,3,7,10],[0,3,7,10],[0,4,7,10]],motif:[4,7,11,7,2,4,0,2]},
 riverside:{name:'Riverside steps',description:'A gently syncopated piano-like theme over a walking bass.',bpm:104,roots:[50,43,48,45],quality:[[0,3,7,10],[0,4,7,10],[0,4,7,11],[0,3,7,10]],motif:[7,10,12,10,7,3,2,0]},
 evening:{name:'After the last train',description:'Slow glassy keys and sustained chords for a quiet skyline.',bpm:72,roots:[45,41,48,43],quality:[[0,3,7,10],[0,4,7,11],[0,4,7,11],[0,4,7,10]],motif:[0,7,10,12,10,7,3,0]}
};
export function musicScore(id){
 const track=MUSIC_TRACKS[id];if(!track)throw Error('Unknown music selection.');
 const beat=60/track.bpm,notes=[],put=(at,duration,pitch,voice,gain)=>notes.push({at:at*beat,duration:duration*beat,pitch,voice,gain});
 for(let bar=0;bar<32;bar++){
  const change=bar%4,root=track.roots[change],chord=track.quality[change],start=bar*4,ending=bar>=28,quiet=bar<4||bar>=24,level=ending?(32-bar)/5:bar<4?.65:1;
  for(const [i,tone] of chord.entries()){
   put(start+i*.025,track.bpm===72?3.6:2.5,root+12+tone,track.bpm===72?'pad':'keys',.11*level);
   if(!quiet&&track.bpm!==72)put(start+2.5+i*.025,1.1,root+12+tone,'keys',.065*level);
  }
  for(let step=0;step<4;step++)put(start+step,.80,root-12+(step===2?7:step===3?chord[2]:0),'bass',.21*level);
  if(bar>=4&&bar<28){
   const count=track.bpm===72?4:6;
   for(let i=0;i<count;i++){
    const phrase=(i+(bar%8>=4?2:0))%track.motif.length,pitch=root+24+track.motif[phrase];
    put(start+i*(4/count)+(i%2?.10:0),track.bpm===72?.85:.42,pitch,'lead',.13*level*(i%2?.85:1));
   }
  }
  if(track.bpm!==72&&bar<28)for(let step=0;step<8;step++)put(start+step*.5,.10,0,'brush',step%2?.035:.055);
 }
 return{id,name:track.name,bpm:track.bpm,duration:128*beat+3,notes:notes.sort((a,b)=>a.at-b.at)};
}
