import assert from 'node:assert/strict';
import {createCity,build,recompute,validateSave} from '../dist/engine.js';
import {startRiot,dispatchPolice,stepRiot} from '../dist/riots.js';
import {policeResponses,automaticPoliceReport} from '../dist/police-response.js';
import {serializeCity} from '../dist/save.js';
const setup=()=>{const c=createCity();assert.ok(build(c,'police',[{x:23,y:25}]).ok);assert.ok(startRiot(c,20,20).ok);return c;};
const c=setup(),station=c.tiles[25*48+23];let responses=policeResponses(c);assert.equal(responses.length,1);assert.equal(responses[0].automatic,true);assert.equal(responses[0].station,25*48+23);assert.equal(c.emergency.policeUnits.length,0,'automatic response does not consume saved dispatch orders');
const before=serializeCity(c);automaticPoliceReport(c);policeResponses(c);assert.equal(serializeCity(c),before);
c.emergency.riot.x=47;c.emergency.riot.y=0;assert.equal(policeResponses(c).length,0,'riot outside station radius');c.emergency.riot.x=20;c.emergency.riot.y=20;
const away=validateSave(JSON.parse(before));dispatchPolice(away,40,40);dispatchPolice(away,40,40);assert.equal(policeResponses(away).filter(p=>p.automatic).length,0);stepRiot(c,()=>{});stepRiot(away,()=>{});assert.ok(c.emergency.riot.anger<away.emergency.riot.anger,'an available local squad calms faster than squads dispatched away');
const assigned=setup();dispatchPolice(assigned,20,20);dispatchPolice(assigned,20,20);assert.equal(policeResponses(assigned).length,2);assert.equal(policeResponses(assigned).filter(p=>p.automatic).length,0,'no double response from one station');
const damaged=setup();damaged.tiles[27*48+25].fire=10;assert.equal(policeResponses(damaged).length,0,'fire on a non-root member blocks dispatch before civic recomputation');dispatchPolice(damaged,20,20);assert.equal(policeResponses(damaged).length,1,'volunteers remain available');
for(const change of [c=>{c.tiles[27*48+25].powered=false;},c=>{c.finance.roadCondition=20;},c=>{c.civic.underfunded.police=6;},c=>{c.civic.funding.police=0;}]){const city=setup();change(city);assert.equal(policeResponses(city).length,0);}
const low=setup();low.civic.funding.police=25;assert.equal(policeResponses(low).length,1);low.emergency.riot.x=0;low.emergency.riot.y=20;assert.equal(policeResponses(low).length,0,'underfunding shrinks automatic response area');
const original=setup(),loaded=validateSave(JSON.parse(serializeCity(original)));for(let i=0;i<10;i++){stepRiot(original,()=>{});stepRiot(loaded,()=>{});}assert.deepEqual(loaded.emergency,original.emergency);assert.equal(original.emergency.riot,null);
console.log('PASS: automatic precinct response, coverage/funding boundaries, manual assignment exclusivity, live damaged-station readiness, volunteer fallback, read-only presentation and deterministic save continuation.');
