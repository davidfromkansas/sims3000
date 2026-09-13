import {tileIndex} from './city-grid.js?v=scripted-goal-marks-1';
import {STRUCTURE_METRICS} from './scenario-structures.js?v=scripted-goal-marks-1';
import {inScenarioArea} from './scenario-area.js?v=scripted-goal-marks-1';
import {ORDINANCES} from './ordinances.js?v=scripted-goal-marks-1';
import {LANDMARKS,landmarkRoots} from './landmarks.js?v=scripted-goal-marks-1';
import {businessRoots} from './business.js?v=scripted-goal-marks-1';
export const CUSTOM_METRICS={population:{name:'Population',direction:'at least',max:1000000,initial:400,read:c=>c.stats.population},funds:{name:'Treasury',direction:'at least',min:-1000000000,max:1000000000,initial:50000,read:c=>c.funds},education:{name:'Education',direction:'at least',max:100,initial:60,read:c=>c.civic.education},crime:{name:'Crime',direction:'at most',max:100,initial:20,read:c=>c.stats.averageCrime},pollution:{name:'Air pollution',direction:'at most',max:100,initial:10,read:c=>c.stats.averagePollution},roadCondition:{name:'Road condition',direction:'at least',max:100,initial:80,read:c=>c.finance.roadCondition},aura:{name:'Resident wellbeing',direction:'at least',max:100,initial:60,read:c=>c.stats.aura},lifeExpectancy:{name:'Life expectancy',direction:'at least',min:45,max:90,initial:70,read:c=>c.civic.lifeExpectancy}};

const homesWithout=(c,utility,area)=>c.tiles.filter(t=>inScenarioArea(t,area)&&t.type==='residential'&&t.level>0&&!t.rubble&&!t[utility]).length;
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

Object.assign(CUSTOM_METRICS,Object.fromEntries([['residential','Developed residential buildings'],['commercial','Developed commercial buildings'],['industrial','Developed industrial buildings']].map(([type,name])=>['buildings'+type[0].toUpperCase()+type.slice(1),{name,direction:'at least',max:2304,initial:10,spatial:true,integer:true,read:(c,area)=>c.tiles.filter(t=>inScenarioArea(t,area)&&t.type===type&&t.level>0&&!t.rubble&&!t.radiation&&(t.industry!=='farm'||t.farmRoot===tileIndex(t))).length}])));

Object.assign(CUSTOM_METRICS,STRUCTURE_METRICS);

CUSTOM_METRICS.abandonedBuildings={name:'Abandoned RCI buildings',direction:'at most',integer:true,max:2304,initial:0,spatial:true,read:(c,area)=>c.tiles.filter(t=>['residential','commercial','industrial'].includes(t.type)&&!t.level&&(t.abandonedLevel||t.historicalLevel)&&!t.rubble&&inScenarioArea(t,area)&&(t.industry!=='farm'||t.farmRoot===tileIndex(t))).length};

CUSTOM_METRICS.abandonedFacilities={name:'Abandoned airports and seaports',direction:'at most',integer:true,max:2304,initial:0,spatial:true,read:(c,area)=>c.stats.facilityPlots.filter(p=>p.abandoned&&inScenarioArea(c.tiles[p.root],area)).length};

CUSTOM_METRICS.completedStages={name:'Completed scenario stages',direction:'at least',integer:true,max:4,initial:1,read:c=>c.scenario?.id==='custom'&&c.scenario.definition.objectiveMode==='sequence'?c.scenario.stageCompletedMonths.length:0};

for(let i=0;i<4;i++)CUSTOM_METRICS[`variable${i+1}`]={name:`Scenario variable ${i+1}`,direction:'at least',min:-1000000,max:1000000,integer:true,initial:1,read:c=>c.scenario?.id==='custom'?(c.scenario.variables?.[i]??0):0};

CUSTOM_METRICS.challengeMonths={name:'Elapsed challenge months',direction:'at most',min:0,max:1200,integer:true,initial:12,read:c=>c.scenario?c.month-c.scenario.startMonth:0};

export const metricLimit=(metric,size=48)=>metric.max===2304?size*size:metric===CUSTOM_METRICS.farms?Math.floor(size*size/9):metric.max;
