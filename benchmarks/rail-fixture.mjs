// Synthetic connected transit districts, deliberately rich in competing stations.
export function populateRailFixture(c,width,mode='mixed'){
 for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;t.access=false;
  if(t.x<4||t.y<4||t.x>=width+4||t.y>=width+4)continue;
  const track=t.x%12===0||t.y%12===0;
  t.rail=mode!=='subway'&&track;t.subway=mode!=='rail'&&track;
  if(t.y%12===11&&t.x%12===6)t.type=mode==='subway'?'subwayStation':'trainStation';
  else if(mode==='mixed'&&t.y%12===0&&t.x%12===0)t.type='railTransfer';
  else if(!track&&[9,10,14%12,15%12].includes(t.y%12)){t.type=t.x%3===0?'industrial':'residential';t.level=2;t.density=2;}
 }
 return c;
}
