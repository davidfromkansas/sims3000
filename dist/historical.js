import {buildingLotMembers,updateBuildingLot} from './building-lots.js?v=transport-advisor-1';
const zones=['residential','commercial','industrial'];
export const canPreserve=t=>zones.includes(t.type)&&t.industry!=='farm'&&!t.rubble&&!t.fire&&(t.level>0||t.historicalLevel>0);
export function designateHistorical(c,index,value){
 const t=c.tiles[index];if(!Number.isInteger(index)||!t||typeof value!=='boolean')return{ok:false,error:'Choose a valid building.'};
 if(value&&!canPreserve(t))return{ok:false,error:'Choose an intact residential, commercial or manufacturing building.'};
 if(!value&&!t.historicalLevel)return{ok:false,error:'This building is not historical.'};
 if(buildingLotMembers(c,t).some(u=>u.fire))return{ok:false,error:'Wait until the building is clear of fire.'};updateBuildingLot(c,t,{historicalLevel:value?(t.historicalLevel||t.level):0});return{ok:true};
}
