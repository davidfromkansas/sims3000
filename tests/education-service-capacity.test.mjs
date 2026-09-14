import assert from 'node:assert/strict';
import {createCity,build,recompute,validateSave} from '../dist/engine.js';
import {SERVICES,recomputeCivic,civicSpending} from '../dist/civic.js';
import {civicFacilityDetails} from '../dist/civic-service-report.js';
import {serializeCity} from '../dist/save.js';
const cases=[['school',3000,500,30,0,'childEducationCoverage'],['college',7500,3000,125,1,'collegeEducationCoverage'],['library',41000,1000,50,2,'libraryEducationCoverage'],['museum',83000,1500,75,2,'museumEducationCoverage']];
for(const [type,capacity,cost,upkeep,band,field] of cases){
 assert.equal(SERVICES[type].capacity,capacity);assert.equal(SERVICES[type].cost,cost);assert.equal(SERVICES[type].upkeep,upkeep);
 const c=createCity('Education capacity',false,96),count=Math.ceil(capacity*2/64),population=count*64;
 // Isolate finite places from network routing. These are explicit compact legacy facilities.
 for(const t of c.tiles)Object.assign(t,{terrain:'land',nature:false});Object.assign(c.tiles[0],{type,root:0,civicSize:1,powered:true,roadIds:[1]});
 for(let i=1000;i<1000+count;i++)Object.assign(c.tiles[i],{type:'residential',level:3,density:3,roadIds:[1]});
 c.stats.population=population;c.demographics.cohorts=Array(8).fill(0);c.demographics.cohorts[band]=population;
 recomputeCivic(c);assert.ok(Math.abs(c.tiles[1000][field]-capacity/population*100)<1e-8);assert.equal(civicFacilityDetails(c,c.tiles[0]).capacity,capacity);assert.equal(civicSpending(c).education,upkeep);
 Object.assign(c.tiles[1],{type,root:1,civicSize:1,powered:true,roadIds:[1]});recomputeCivic(c);assert.ok(Math.abs(c.tiles[1000][field]-Math.min(100,2*capacity/population*100))<1e-8);assert.equal(civicSpending(c).education,upkeep*2);
 c.tiles[1].roadIds=[2];recomputeCivic(c);assert.ok(Math.abs(c.tiles[1000][field]-capacity/population*100)<1e-8,'disconnected facilities cannot lend places');
 const actual=createCity(),funds=actual.funds;assert.ok(build(actual,type,[{x:23,y:25}]).ok);assert.equal(actual.funds,funds-cost);assert.equal(actual.stats.spending.education,upkeep);assert.equal(actual.stats.serviceCapacities[type],capacity);
 const restored=validateSave(JSON.parse(serializeCity(actual)));assert.equal(restored.stats.serviceCapacities[type],capacity);assert.equal(restored.stats.spending.education,upkeep);
 actual.civic.funding.education=0;recompute(actual);assert.equal(actual.stats.serviceCapacities[type],0);assert.equal(actual.stats.spending.education,0);
}
console.log('PASS: education directory capacities and costs, finite cohort places, additional facilities, isolated catchments, real construction bills, shutdowns and saved reconstruction.');
