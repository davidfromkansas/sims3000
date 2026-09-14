import {POWER_PLANTS} from './power.js?v=stadium-match-day-1';
export const POWER_SOURCES={...Object.fromEntries(Object.entries(POWER_PLANTS).map(([key,value])=>[key,value.name])),wasteEnergy:'Waste-to-energy'};
export const generationKey=key=>'powerGenerated'+key[0].toUpperCase()+key.slice(1);
export function powerMonth(c){const s=c.stats;return{powerGenerated:s.powerGenerated,powerImported:s.powerImported,powerExported:s.powerExported,powerServed:s.powerServed,...Object.fromEntries(Object.keys(POWER_SOURCES).map(key=>[generationKey(key),s.powerGenerationByType[key]||0]))};}
export function annualPower(c){
 const fields=['powerGenerated','powerImported','powerExported','powerServed',...Object.keys(POWER_SOURCES).map(generationKey)],rows=c.history.filter(h=>h.month>c.month-12&&h.month<=c.month&&fields.every(key=>Number.isFinite(h[key])));
 if(!rows.length)return null;const sum=key=>rows.reduce((n,h)=>n+h[key],0),total=sum('powerGenerated');
 return{months:rows.length,total,imported:sum('powerImported'),exported:sum('powerExported'),served:sum('powerServed'),sources:Object.entries(POWER_SOURCES).map(([key,name])=>({name,amount:sum(generationKey(key))})).filter(r=>r.amount>0).map(r=>({...r,percent:total?r.amount/total*100:0}))};
}
