import {readFileSync} from 'node:fs';
import {STATIONS} from '../dist/rail.js';
import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave,LABEL,ZONES} from '../dist/engine.js';
import {serializeCity} from '../dist/save.js';
import {stationDetails,stationReport} from '../dist/station-inspection.js';
import {freshDemographics} from '../dist/demographics.js';
const c=createCity('Station diagnosis',false);c.funds=100000;for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;}
const at=(x,y)=>c.tiles[y*48+x],place=(mode,x,y,xx=x,yy=y)=>assert.ok(build(c,mode,selection(mode,{x,y},{x:xx,y:yy})).ok);
Object.assign(at(12,18),{type:'residential',level:3,density:3});Object.assign(at(36,18),{type:'industrial',level:3,density:3});c.demographics=freshDemographics(64,0);recompute(c);
place('trainStation',12,19);const station=at(12,19);assert.match(stationDetails(c,station).advice,/rail directly beside/);assert.equal(stationDetails(c,station).local.residents,64);
place('rail',12,20,24,20);assert.match(stationDetails(c,station).advice,/no other station/);place('subway',24,21,36,21);place('subwayStation',36,20);assert.equal(stationDetails(c,station).connections.length,0,'adjacent rail/subway alone cannot connect stations');
place('railTransfer',24,21);let d=stationDetails(c,station);assert.equal(d.connections.length,2);assert.equal(d.railTiles,13);assert.equal(d.subwayTiles,13);assert.ok(d.activity>0);assert.ok(d.connections.some(s=>s.jobs>0));assert.match(d.advice,/handling passengers/);assert.match(stationReport(c,station),/Rail–subway connection/);assert.match(stationReport(c,station),/boarding, alighting and transfers/);
const saved=serializeCity(c),stats=JSON.stringify(c.stats);for(let i=0;i<4;i++)stationReport(c,station);assert.equal(serializeCity(c),saved);assert.equal(JSON.stringify(c.stats),stats,'inspection never reruns the mutating rail allocator');
const restored=validateSave(JSON.parse(saved));assert.deepEqual(stationDetails(restored,restored.tiles[19*48+12]),d);
place('removeSubway',30,21);d=stationDetails(c,station);assert.equal(d.connections.length,1);assert.equal(d.activity,0);assert.match(d.advice,/no developed workplaces/);place('subway',30,21);assert.ok(stationDetails(c,station).activity>0);
c.transport.funding=0;recompute(c);assert.match(stationDetails(c,station).advice,/funding is zero/);c.transport.funding=100;c.transport.underfunded=6;recompute(c);assert.match(stationDetails(c,station).advice,/on strike/);c.transport.underfunded=0;c.transport.condition=20;recompute(c);assert.match(stationDetails(c,station).advice,/equipment condition/);c.transport.condition=100;recompute(c);
place('bulldoze',36,20);assert.match(stationDetails(c,station).advice,/no developed workplaces/);assert.equal(stationDetails(c,at(0,0)),null);
// Unserved track components do not allocate report objects.
place('rail',3,3);assert.equal(Object.keys(c.stats.railNetworks).length,1);
const buttons={},ui={city:c,STATIONS,LABEL,ZONES,idx:(x,y)=>y*48+x,stationReport,$:id=>buttons[id]??={},dialog(title,html){ui.title=title;ui.html=html;},setLayer(value){ui.layer=value;},closeDialog(){ui.closed=true;},showTransit(){ui.funding=true;}};
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),source=app.slice(app.indexOf('function showTileQuery('),app.indexOf('function showIndustry(')),query=new Function('ui','with(ui){'+source+';return showTileQuery;}')(ui);query({x:12,y:19});assert.equal(ui.title,'Train station');assert.match(ui.html,/Stations on these track networks/);buttons['#stationRailMap'].onclick();assert.equal(ui.layer,'rail');buttons['#stationSubwayMap'].onclick();assert.equal(ui.layer,'subway');assert.equal(ui.closed,true);buttons['#stationTransitBudget'].onclick();assert.equal(ui.funding,true);
console.log('PASS: station track/funding diagnosis, exact connected networks including transfers, nearby residents/jobs, disconnected destinations, passenger activity, read-only inspection, save restoration and compact diagnostics.');
