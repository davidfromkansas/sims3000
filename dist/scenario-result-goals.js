import {validateScenarioArea} from './scenario-area.js?v=performing-arts-center-1';
export const captureResultGoals=goals=>goals.map(g=>({title:g.title,done:g.done,detail:g.detail,...(g.instructions?{instructions:g.instructions}:{}),...(g.area?{area:{...g.area}}:{})}));
export function validateResultGoals(goals,status,size,version){
 if(goals===undefined)return undefined;
 if(version<126||status==='playing'||!Array.isArray(goals)||goals.length<1||goals.length>16)throw Error('Invalid scenario result goals.');
 const text=(v,max)=>typeof v==='string'&&v.length<=max&&!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v);
 return goals.map(g=>{if(!g||Object.keys(g).some(k=>!['title','done','detail','instructions','area'].includes(k))||!text(g.title,1000)||typeof g.done!=='boolean'||!text(g.detail,2000)||g.instructions!==undefined&&!text(g.instructions,4000))throw Error('Invalid scenario result goal.');const area=validateScenarioArea(g.area,{spatial:true},size);return{title:g.title,done:g.done,detail:g.detail,...(g.instructions!==undefined?{instructions:g.instructions}:{}),...(area?{area}:{})};});
}
