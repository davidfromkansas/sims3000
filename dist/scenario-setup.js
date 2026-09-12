import {createCity,recompute,build,planBuild,selection,idx} from './engine.js?v=emergency-navigation-1';
import {SCENARIOS,freshScenario} from './scenarios.js?v=emergency-navigation-1';
export function createScenario(id){const definition=SCENARIOS[id];if(!definition)throw Error('Unknown scenario.');const c=createCity(definition.title,id!=='growth');c.scenario=freshScenario(id);c.emergency.randomFires=false;if(id==='pollution'){c.business.toxicWaste={offered:0,accepted:true,declinedUntil:0};const site=[...c.tiles].sort((a,b)=>Math.hypot(a.x-25,a.y-20)-Math.hypot(b.x-25,b.y-20)).find(t=>planBuild(c,'toxicWaste',[t]).ok);if(!site||!build(c,'toxicWaste',[site]).ok)throw Error('Could not prepare the pollution challenge.');c.funds=10000;}if(id==='harbor')prepareHarbor(c);if(id==='streets'){c.finance.roadCondition=15;c.finance.roadFunding=25;c.funds=20000;}recompute(c);return c;}

function prepareHarbor(c){
 for(const t of c.tiles)if(t.x<10){t.terrain='water';t.waterKind='salt';t.nature=false;t.elevation=0;}
 const fresh=c.tiles[idx(25,15)];fresh.terrain='water';fresh.waterKind='fresh';fresh.nature=false;
 const place=(type,points)=>{const r=build(c,type,points);if(!r.ok)throw Error('Could not prepare harbor: '+r.error);};
 place('seaport',selection('seaport',{x:10,y:20},{x:11,y:25}));
 place('pump',[{x:24,y:15}]);place('pipe',selection('pipe',{x:24,y:15},{x:24,y:20}));place('pipe',selection('pipe',{x:11,y:20},{x:24,y:20}));
 for(const t of c.tiles.filter(t=>t.type==='seaport')){t.level=1;t.age=6;}
 place('landfill',selection('landfill',{x:33,y:28},{x:35,y:29}));
 place('removePipe',[{x:19,y:20}]);c.funds=12500;recompute(c);
}
