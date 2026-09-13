import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave,tick} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {landfillRailFreight,surfaceRailGroups} from '../dist/rail-freight.js';
import {processGarbage} from '../dist/utilities.js';
import {connectionCandidates,addConnection,signDeal,importGarbage} from '../dist/region.js';
const base=()=>{const c=createCity('Rail disposal',false);c.funds=1000000;c.startYear=2050;for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;}recompute(c);return c;};
const put=(c,type,x,y,xx=x,yy=y)=>assert.ok(build(c,type,selection(type,{x,y},{x:xx,y:yy},c.size)).ok,type);
const c=base();put(c,'road',8,8,12,8);put(c,'residential',10,7);c.tiles[7*48+10].level=1;put(c,'trainStation',10,10);put(c,'rail',11,10,35,10);put(c,'landfill',35,11);recompute(c);const home=c.tiles[7*48+10],dump=c.tiles[11*48+35];home.waste=50;assert.equal(dump.roadIds.length,0);assert.equal(landfillRailFreight(c).accepts(home,dump),true);assert.equal(landfillRailFreight(c).accepts(c.tiles[10*48+22],dump),false,'bare track is not a freight loading station');assert.ok(processGarbage(c)>50);assert.equal(home.waste,0);assert.ok(dump.garbage>50);
// The same destination is not filled twice when both modes are available.
put(c,'road',12,8,35,8);home.waste=20;const storage=dump.garbage;processGarbage(c);assert.ok(Math.abs(dump.garbage-(storage-.5+20.24))<1e-7);put(c,'bulldoze',20,8);recompute(c);
for(const [key,value]of [['funding',0],['condition',20],['underfunded',6]]){const old=c.transport[key];c.transport[key]=value;recompute(c);home.waste=10;const before=dump.garbage;processGarbage(c);assert.ok(home.waste>10,key);assert.equal(dump.garbage,before-.5,key);c.transport[key]=old;recompute(c);}
put(c,'bulldoze',22,10);home.waste=15;let before=dump.garbage;processGarbage(c);assert.ok(home.waste>15);assert.equal(dump.garbage,before-.5);put(c,'rail',22,10);recompute(c);assert.ok(processGarbage(c)>15);assert.equal(home.waste,0);
dump.garbage=200;home.waste=10;processGarbage(c);assert.equal(dump.garbage,200);assert.ok(Math.abs(home.waste-9.74)<1e-7,'only decomposed space accepts new freight');
const saved=validateSave(JSON.parse(serializeCity(c)));assert.equal(landfillRailFreight(saved).accepts(saved.tiles[7*48+10],saved.tiles[11*48+35]),true);tick(c);tick(saved);assert.equal(serializeCity(c),serializeCity(saved));
// Imported garbage can go from the map edge to a siding with no local roads.
const trade=base();put(trade,'rail',30,20,47,20);put(trade,'landfill',30,21);assert.ok(addConnection(trade,connectionCandidates(trade).find(p=>p.kind==='rail')).ok);assert.ok(signDeal(trade,0,'garbage','import',25).ok);recompute(trade);importGarbage(trade);const delivered=trade.region.deals[0].delivered;assert.ok(delivered>0);assert.equal(processGarbage(trade),delivered);assert.equal(trade.tiles[21*48+30].garbage,delivered);assert.equal(trade.tiles[20*48+47].waste,0);
// A subway corridor cannot complete a surface-freight connection.
const split=base();put(split,'rail',10,10,15,10);put(split,'rail',25,10,30,10);put(split,'subway',15,10,25,10);put(split,'landfill',30,11);split.tiles[10*48+10].waste=20;recompute(split);assert.equal(landfillRailFreight(split).accepts(split.tiles[10*48+10],split.tiles[11*48+30]),false);
// Orthogonal water crossings stay separate even if their tiles touch.
const bridge=base();for(const [x,y,axis]of [[10,10,'x'],[11,10,'x'],[10,11,'y']])Object.assign(bridge.tiles[y*48+x],{rail:true,terrain:'water',railAxis:axis});const groups=surfaceRailGroups(bridge).groups;assert.equal(groups[10*48+10],groups[10*48+11]);assert.notEqual(groups[10*48+10],groups[11*48+10]);
// A real bored rail tunnel carries freight; removing a portal breaks it.
const tunnel=base();for(let x=20;x<=27;x++)tunnel.tiles[20*48+x].elevation=Math.min(x-19,28-x,3);put(tunnel,'rail',19,20,28,20);put(tunnel,'landfill',29,20);put(tunnel,'rail',0,20,19,20);assert.ok(addConnection(tunnel,connectionCandidates(tunnel).find(p=>p.kind==='rail')).ok);assert.equal(tunnel.tunnels.length,1);const entry=tunnel.tiles[20*48],destination=tunnel.tiles[20*48+29];entry.waste=30;assert.equal(landfillRailFreight(tunnel).accepts(entry,destination),true);assert.equal(processGarbage(tunnel),30);assert.equal(destination.garbage,30);put(tunnel,'removeRail',28,20);entry.waste=10;assert.equal(landfillRailFreight(tunnel).accepts(entry,destination),false);assert.equal(processGarbage(tunnel),0);
console.log('PASS: station-to-landfill rail hauling, direct rail imports, finite storage and conservation, dual-mode deduplication, track cuts/repair, transit shutdowns, subway exclusion, bridge axes and saved monthly continuity.');
