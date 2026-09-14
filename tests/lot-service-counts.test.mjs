import assert from 'node:assert/strict';
import {createCity,recompute,validateSave} from '../dist/engine.js';
import {formBuildingLot,updateBuildingLot} from '../dist/building-lots.js';
import {civicFacilityDetails,civicFacilityReport} from '../dist/civic-service-report.js';
import {stationDetails,stationReport} from '../dist/station-inspection.js';
import {serializeCity} from '../dist/save.js';
import {occupancy} from '../dist/utilities.js';
for(const size of [48,96]){
 const c=createCity('Lot service counts',false,size),at=(x,y)=>c.tiles[y*size+x];
 for(const t of c.tiles)Object.assign(t,{terrain:'land',elevation:0,nature:false,type:null,level:0});
 function lot(type,x,y,w,h){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)Object.assign(at(xx,yy),{type,density:3,powered:true,watered:true,access:true});const result=formBuildingLot(c,at(x,y),w,h);assert.ok(result);updateBuildingLot(c,at(x,y),{level:2});return result;}
 const residential=lot('residential',10,10,3,3),commercial=lot('commercial',10,14,3,2);Object.assign(at(16,13),{type:'trainStation'});const station=at(16,13);
 // Only the easternmost column lies in this station's square range.
 // Its northwest origin is outside: root-only filtering would wrongly report zero.
 station.x=15;let d=stationDetails(c,station);assert.equal(d.local.homes,1);assert.equal(d.local.workplaces,1);assert.equal(d.local.residents,3*occupancy(2)*8);assert.equal(d.local.jobs,2*occupancy(2)*6);
 station.x=13;d=stationDetails(c,station);assert.equal(d.local.homes,1);assert.equal(d.local.workplaces,1);assert.equal(d.local.residents,9*occupancy(2)*8);assert.equal(d.local.jobs,6*occupancy(2)*6);station.x=16;
 const hospital=at(18,18);Object.assign(hospital,{type:'hospital',root:18*size+18,civicSize:1,powered:true,roadIds:[7],serviceActive:true});
 for(const t of c.tiles)if(t!==hospital)t.roadIds=[];
 for(const id of residential.ids)Object.assign(c.tiles[id],{roadIds:[7,8],healthCoverage:60});
 let h=civicFacilityDetails(c,hospital);assert.equal(h.homes,1);assert.equal(h.residents,9*occupancy(2)*8);assert.equal(h.combinedCoverage,60);
 for(const id of residential.ids)c.tiles[id].roadIds=c.tiles[id].x===12?[7]:[];
 h=civicFacilityDetails(c,hospital);assert.equal(h.homes,1);assert.equal(h.residents,3*occupancy(2)*8,'only connected members contribute demand');
 for(const id of residential.ids)c.tiles[id].roadIds=[];h=civicFacilityDetails(c,hospital);assert.equal(h.homes,0);assert.equal(h.residents,0);
 // Read-only reporting and portable save restoration preserve lot identity.
 recompute(c);const before=serializeCity(c);stationReport(c,station);civicFacilityReport(c,hospital);assert.equal(serializeCity(c),before);
 const restored=validateSave(JSON.parse(before));assert.deepEqual(stationDetails(restored,restored.tiles[13*size+16]),stationDetails(c,station));
 updateBuildingLot(c,c.tiles[residential.root],{level:0,abandonedLevel:2});assert.equal(stationDetails(c,station).local.homes,0,'abandoned lots do not count as occupied');assert.equal(stationDetails(c,station).local.residents,0);
 assert.equal(c.buildingLots.get(commercial.root).ids.length,6);
}
console.log('PASS: multi-tile homes and workplaces count once in civic and station reports, partial catchments retain exact simulation demand even outside lot origins, disconnected/abandoned lots are excluded, and inspection/save restoration preserve state across map sizes.');
