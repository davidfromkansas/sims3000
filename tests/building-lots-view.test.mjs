import {DIRECTIONAL_BUILDINGS,drawDirectionalBuilding} from '../dist/directional-buildings.js';
import {auraReport} from '../dist/aura.js';
import {drawRecentConstruction,recentConstructionNote} from '../dist/recent-construction.js';
import {canPreserve,designateHistorical} from '../dist/historical.js';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCity,recompute,LABEL,ZONES} from '../dist/engine.js';
import {formBuildingLot,deriveBuildingLots,updateBuildingLot} from '../dist/building-lots.js';
import {buildingLotPlacement,buildingLotReport} from '../dist/building-lot-view.js';
import {CityRenderer} from '../dist/renderer.js';
import {CUSTOM_METRICS} from '../dist/scenario-metrics.js';
import {designForTile,defaultLotDesign} from '../dist/building-designs.js';
import {baseZonedSprite,cityZonedSprite,canReplaceBuilding} from '../dist/building-art.js';
import {serializeCity} from '../dist/save.js';
const c=createCity('Lot presentation',false,96);for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false});const start=c.tiles[70*96+70];for(let y=70;y<72;y++)for(let x=70;x<73;x++)Object.assign(c.tiles[y*96+x],{type:'residential',density:3,powered:true,watered:true,access:true});const lot=formBuildingLot(c,start,3,2);recompute(c);const saved=serializeCity(c);
assert.equal(CUSTOM_METRICS.buildingsResidential.read(c),1);const interior={x:72,y:71,radius:0};assert.equal(CUSTOM_METRICS.buildingsResidential.read(c,interior),0);assert.equal(CUSTOM_METRICS.buildingsResidential.read(c,{x:70,y:70,radius:0}),1);assert.equal(CUSTOM_METRICS.unpoweredHomes.read(c),1);assert.equal(CUSTOM_METRICS.unpoweredHomes.read(c,interior),0);start.powered=true;assert.equal(CUSTOM_METRICS.unpoweredHomes.read(c),1,'a supplied root does not hide unserved members');start.powered=false;
// Area syntax is separately validated by scenario-area; the selected footprint
// member below is not the building's origin and must not add another building.
const r=Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>c,rotation:0,w:1000,h:700,zoom:1,pan:{x:0,y:0}});
for(let rotation=0;rotation<4;rotation++){r.rotation=rotation;const found=lot.ids.map(i=>buildingLotPlacement(r,c.tiles[i])).filter(Boolean);assert.equal(found.length,1);assert.deepEqual(found[0].center,r.project(71,70.5));assert.equal(found[0].scale,2.5);}
const rootReport=buildingLotReport(c,start);for(const id of lot.ids)assert.equal(buildingLotReport(c,c.tiles[id]),rootReport);assert.match(rootReport,/3 × 2/);assert.match(rootReport,/<strong>48<\/strong>/);assert.match(rootReport,/lacks electricity/);assert.equal(serializeCity(c),saved);
updateBuildingLot(c,start,{level:0,abandonedLevel:1});assert.equal(CUSTOM_METRICS.abandonedBuildings.read(c),1);assert.equal(CUSTOM_METRICS.buildingsResidential.read(c),0);updateBuildingLot(c,start,{level:1,abandonedLevel:0});
// Execute the actual larger-lot renderer branch once for every member.
const source=readFileSync(new URL('../dist/renderer.js',import.meta.url),'utf8'),body=source.split('else if(t.lotRoot!=null){')[1].split('\n else if(ZONES.includes')[0].trim().slice(0,-1),calls=[],markers=[];
const actual=new Function('buildingLotPlacement','cityZonedSprite','designForTile','defaultLotDesign','drawDesignedBuilding','drawRecentConstruction','DIRECTIONAL_BUILDINGS','drawDirectionalBuilding','return function(city,t,c,u,fade){'+body+'}')(buildingLotPlacement,cityZonedSprite,designForTile,defaultLotDesign,(...args)=>calls.push(args),drawRecentConstruction,DIRECTIONAL_BUILDINGS,drawDirectionalBuilding);r.sprite=(...args)=>calls.push(args);r.layer='city';r.ctx={save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){}};const ctx={fillText:(...args)=>markers.push(args)};
for(let rotation=0;rotation<4;rotation++){r.rotation=rotation;calls.length=0;markers.length=0;for(const id of lot.ids)actual.call(r,c,c.tiles[id],ctx,r.unit,.4);assert.equal(calls.length,1);assert.equal(calls[0][1],start);assert.deepEqual(calls[0][2].footprint,{width:3,height:2});assert.equal(calls[0][3],.4);assert.equal(markers.length,1);assert.equal(markers[0][0],'ϟ');}
// Every selected member invokes the same whole-building query report.
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),querySource=app.slice(app.indexOf('function showTileQuery('),app.indexOf('function showIndustry(')),controls={};const ui={auraReport,recentConstructionNote,canReplaceBuilding,city:c,LABEL,ZONES,idx:(x,y)=>y*96+x,buildingLotReport,canPreserve:()=>false,$:id=>controls[id],dialog(name,html){ui.name=name;ui.html=html;}};const query=new Function('ui','with(ui){'+querySource+';return showTileQuery;}')(ui);for(const id of lot.ids){query(c.tiles[id]);assert.equal(ui.name,'Residential');assert.ok(ui.html.startsWith(rootReport));assert.match(ui.html,/Replace building style/);}
ui.showQuery=query;ui.canPreserve=canPreserve;ui.designateHistorical=designateHistorical;ui.recompute=recompute;ui.undo=[1];ui.AUTO='auto';let saves=0;ui.persist=()=>saves++;ui.update=()=>{};ui.notify=message=>assert.fail(message);controls['#makeHistorical']={checked:true};query(c.tiles[lot.ids.at(-1)]);controls['#makeHistorical'].onchange();assert.ok(lot.ids.every(i=>c.tiles[i].historicalLevel===1));assert.equal(saves,1);assert.deepEqual(ui.undo,[]);

// Compare the constant-time corner selection with the original painter-order definition.
for(const size of [48,96,256]){
 const grid=createCity('Corner order',false,size),renderer=Object.assign(Object.create(CityRenderer.prototype),{getCity:()=>grid,w:1000,h:700,zoom:1,pan:{x:0,y:0}});
 for(let width=1;width<=5;width++)for(let height=1;height<=5;height++){
  if(width*height===1)continue;
  const x=10,y=10,root=y*size+x,ids=[];for(let dy=0;dy<height;dy++)for(let dx=0;dx<width;dx++){const id=(y+dy)*size+x+dx;ids.push(id);grid.tiles[id].lotRoot=root;}
  const footprint={root,x,y,width,height,ids};grid.buildingLots=new Map([[root,footprint]]);
  for(let rotation=0;rotation<4;rotation++){
   renderer.rotation=rotation;const reference=ids.map(i=>grid.tiles[i]).sort((a,b)=>{const aa=renderer.transform(a.x,a.y),bb=renderer.transform(b.x,b.y);return bb[0]+bb[1]-aa[0]-aa[1]||bb[0]-aa[0];})[0];
   const drawn=ids.filter(id=>buildingLotPlacement(renderer,grid.tiles[id]));assert.deepEqual(drawn,[reference.y*size+reference.x]);
  }
 }
}
console.log('PASS: one draw per rectangular lot, query/occupancy state, and direct draw-corner selection matching sorted painter order for all 24 multi-tile footprints, four rotations and three map sizes.');
