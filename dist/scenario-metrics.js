import {BUILDING_UTILITY_METRICS} from './scenario-building-utilities.js?v=power-allocation-1';
import {NEIGHBOR_METRICS} from './scenario-neighbor-metrics.js?v=power-allocation-1';
import {isBuildingLotRoot,buildingLotMembers} from './building-lots.js?v=power-allocation-1';
import {averageWaterPollution,averageRoadTraffic,surplusPower,surplusWater} from './city-measures.js?v=power-allocation-1';
import {outstandingLoanPayments} from './loan-debt.js?v=power-allocation-1';
import {CALENDAR_MONTHS,calendarMonthIndex} from './scenario-calendar.js?v=power-allocation-1';
import {tileIndex} from './city-grid.js?v=power-allocation-1';
import {STRUCTURE_METRICS} from './scenario-structures.js?v=power-allocation-1';
import {inScenarioArea} from './scenario-area.js?v=power-allocation-1';
import {ORDINANCES} from './ordinances.js?v=power-allocation-1';
import {LANDMARKS,landmarkRoots} from './landmarks.js?v=power-allocation-1';
import {businessRoots} from './business.js?v=power-allocation-1';
export const CUSTOM_METRICS={population:{name:'Population',direction:'at least',max:1000000,initial:400,read:c=>c.stats.population},funds:{name:'Treasury',direction:'at least',min:-1000000000,max:1000000000,initial:50000,read:c=>c.funds},education:{name:'Education',direction:'at least',max:100,initial:60,read:c=>c.civic.education},crime:{name:'Crime',direction:'at most',max:100,initial:20,read:c=>c.stats.averageCrime},pollution:{name:'Air pollution',direction:'at most',max:100,initial:10,read:c=>c.stats.averagePollution},roadCondition:{name:'Road condition',direction:'at least',max:100,initial:80,read:c=>c.finance.roadCondition},aura:{name:'Resident wellbeing',direction:'at least',max:100,initial:60,read:c=>c.stats.aura},lifeExpectancy:{name:'Life expectancy',direction:'at least',min:45,max:90,initial:70,read:c=>c.civic.lifeExpectancy}};

const homesWithout=(c,utility,area)=>c.tiles.filter(t=>inScenarioArea(t,area)&&isBuildingLotRoot(c,t)&&t.type==='residential'&&t.level>0&&!t.rubble&&buildingLotMembers(c,t).some(u=>!u[utility])).length;
Object.assign(CUSTOM_METRICS,{
 unpoweredHomes:{name:'Occupied homes without power',direction:'at most',max:2304,initial:0,spatial:true,read:(c,area)=>homesWithout(c,'powered',area)},
 unwateredHomes:{name:'Occupied homes without water',direction:'at most',max:2304,initial:0,spatial:true,read:(c,area)=>homesWithout(c,'watered',area)},
 activeAirports:{name:'Operating airports',direction:'at least',max:153,initial:1,read:c=>c.stats.activeAirports},
 activeSeaports:{name:'Operating seaports',direction:'at least',max:192,initial:1,read:c=>c.stats.activeSeaports},
 activeBusStops:{name:'Active bus stops',direction:'at least',max:2304,initial:2,read:c=>c.stats.activeBusStops},
 busRiders:{name:'Bus commuters',direction:'at least',max:1000000,initial:100,read:c=>c.stats.busRiders},
 trainRiders:{name:'Rail and subway commuters',direction:'at least',max:1000000,initial:100,read:c=>c.stats.trainRiders}
});

Object.assign(CUSTOM_METRICS,{
 businessIncome:{name:'Monthly business income',direction:'at least',max:450,initial:150,read:c=>c.stats.businessIncome},
 casinos:{name:'Placed casinos',direction:'at least',max:1,initial:1,spatial:true,read:(c,area)=>businessRoots(c).filter(t=>inScenarioArea(t,area)&&t.type==='casino').length},
 toxicWastePlants:{name:'Placed toxic-waste plants',direction:'at most',max:1,initial:0,spatial:true,read:(c,area)=>businessRoots(c).filter(t=>inScenarioArea(t,area)&&t.type==='toxicWaste').length}
});

Object.assign(CUSTOM_METRICS,{
 landmarks:{name:'Standing landmarks',direction:'at least',max:Object.keys(LANDMARKS).length,initial:1,spatial:true,read:(c,area)=>landmarkRoots(c).filter(t=>inScenarioArea(t,area)).length},
 ...Object.fromEntries(Object.entries(LANDMARKS).map(([type,d])=>[type,{name:'Standing '+d.name,direction:'at least',max:1,initial:1,spatial:true,read:(c,area)=>landmarkRoots(c).filter(t=>inScenarioArea(t,area)&&t.type===type).length}]))
});

Object.assign(CUSTOM_METRICS,{
 farms:{name:'Developed farms',direction:'at least',max:256,initial:3,spatial:true,read:(c,area)=>c.tiles.filter(t=>inScenarioArea(t,area)&&t.type==='industrial'&&t.industry==='farm'&&t.farmRoot===tileIndex(t)&&t.level>0&&!t.rubble&&!t.radiation).length},
 cleanIndustry:{name:'Clean industrial buildings',direction:'at least',max:2304,initial:10,spatial:true,read:(c,area)=>c.tiles.filter(t=>inScenarioArea(t,area)&&t.type==='industrial'&&t.industry==='clean'&&t.level>0&&!t.rubble&&!t.radiation).length}
});

Object.assign(CUSTOM_METRICS,Object.fromEntries(Object.entries(ORDINANCES).map(([key,d])=>['ordinance'+key[0].toUpperCase()+key.slice(1),{name:d.name+' ordinance',direction:'equals',min:0,max:1,initial:1,integer:true,states:['Repealed','Enacted'],read:c=>c.civic.ordinances[key]?1:0}])));

Object.assign(CUSTOM_METRICS,Object.fromEntries([['residential','Developed residential buildings'],['commercial','Developed commercial buildings'],['industrial','Developed industrial buildings']].map(([type,name])=>['buildings'+type[0].toUpperCase()+type.slice(1),{name,direction:'at least',max:2304,initial:10,spatial:true,integer:true,read:(c,area)=>c.tiles.filter(t=>inScenarioArea(t,area)&&t.type===type&&t.level>0&&!t.rubble&&!t.radiation&&isBuildingLotRoot(c,t)&&(t.industry!=='farm'||t.farmRoot===tileIndex(t))).length}])));

Object.assign(CUSTOM_METRICS,STRUCTURE_METRICS);

CUSTOM_METRICS.abandonedBuildings={name:'Abandoned RCI buildings',direction:'at most',integer:true,max:2304,initial:0,spatial:true,read:(c,area)=>c.tiles.filter(t=>['residential','commercial','industrial'].includes(t.type)&&isBuildingLotRoot(c,t)&&!t.level&&(t.abandonedLevel||t.historicalLevel)&&!t.rubble&&inScenarioArea(t,area)&&(t.industry!=='farm'||t.farmRoot===tileIndex(t))).length};

CUSTOM_METRICS.abandonedFacilities={name:'Abandoned airports and seaports',direction:'at most',integer:true,max:2304,initial:0,spatial:true,read:(c,area)=>c.stats.facilityPlots.filter(p=>p.abandoned&&inScenarioArea(c.tiles[p.root],area)).length};

CUSTOM_METRICS.completedStages={name:'Completed scenario stages',direction:'at least',integer:true,max:4,initial:1,read:c=>c.scenario?.id==='custom'&&c.scenario.definition.objectiveMode==='sequence'?c.scenario.stageCompletedMonths.length:0};

for(let i=0;i<4;i++)CUSTOM_METRICS[`variable${i+1}`]={name:`Scenario variable ${i+1}`,direction:'at least',min:-1000000,max:1000000,integer:true,initial:1,read:c=>c.scenario?.id==='custom'?(c.scenario.variables?.[i]??0):0};

CUSTOM_METRICS.challengeMonths={name:'Elapsed challenge months',direction:'at most',min:0,max:1200,integer:true,initial:12,read:c=>c.scenario?c.month-c.scenario.startMonth:0};

export const metricLimit=(metric,size=48)=>metric.max===2304?size*size:metric===CUSTOM_METRICS.farms?Math.floor(size*size/9):metric.max;

Object.assign(CUSTOM_METRICS,{
 date:{name:'Calendar date',direction:'at least',integer:true,date:true,min:1900*12,max:2050*12+120000,initial:1950*12,read:calendarMonthIndex},
 year:{name:'Calendar year',direction:'at least',integer:true,format:'year',min:1900,max:12050,initial:2000,read:c=>Math.floor(calendarMonthIndex(c)/12)},
 monthOfYear:{name:'Calendar month',direction:'equals',integer:true,format:'month',states:CALENDAR_MONTHS,min:0,max:11,initial:0,read:c=>calendarMonthIndex(c)%12}
});

// Manual p. 187 economic queries. Debt uses the same remaining principal and
// interest obligations reported by the Budget window, not the treasury balance.
Object.assign(CUSTOM_METRICS,{
 landValue:{name:'Average land value',direction:'at least',min:0,max:100,initial:60,read:c=>c.stats.averageLandValue},
 totalDebt:{name:'Remaining loan payments (principal + interest)',direction:'at most',min:0,max:375000,integer:true,initial:0,read:outstandingLoanPayments},
 ...Object.fromEntries(['residential','commercial','industrial'].map(sector=>[sector+'Tax',{name:sector[0].toUpperCase()+sector.slice(1)+' tax rate (%)',direction:'at most',min:0,max:20,initial:7,read:c=>c.finance.taxes[sector]}]))
});

Object.assign(CUSTOM_METRICS,{
 waterPollution:{name:'Average water pollution',direction:'at most',min:0,max:100,initial:10,read:averageWaterPollution},
 traffic:{name:'Average road traffic (vehicles/tile)',direction:'at most',min:0,max:1000000,initial:20,read:averageRoadTraffic},
 surplusPower:{name:'Citywide power surplus (supply minus demand)',direction:'at least',min:-1000000000,max:1000000000,initial:100,read:surplusPower},
 surplusWater:{name:'Citywide water surplus (supply minus demand)',direction:'at least',min:-1000000000,max:1000000000,initial:100,read:surplusWater},
 uncollectedGarbage:{name:'Uncollected garbage (units)',direction:'at most',min:0,max:65536000000000,initial:0,read:c=>c.stats.uncollectedWaste}
});

// Manual p.188: Neighbor Connection Status Is / Neighbor Deal Status Is.
Object.assign(CUSTOM_METRICS,NEIGHBOR_METRICS);

Object.assign(CUSTOM_METRICS,BUILDING_UTILITY_METRICS);
