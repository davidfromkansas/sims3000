// Simulation dates are whole months. Date queries use a numeric month index
// (year * 12 + zero-based month) so comparisons and date differences are exact.
export const CALENDAR_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
export const calendarMonthIndex=c=>(c.startYear??1950)*12+c.month;
export function dateInputValue(value){if(!Number.isInteger(value)||value<0)return '';return String(Math.floor(value/12)).padStart(4,'0')+'-'+String(value%12+1).padStart(2,'0');}
export function parseDateInput(text){if(typeof text!=='string'||!/^\d{4,5}-(0[1-9]|1[0-2])$/.test(text))return NaN;const [year,month]=text.split('-').map(Number);return year>0?year*12+month-1:NaN;}
export function formatScenarioMetric(metric,value,maxFractionDigits=1){if(metric?.date)return CALENDAR_MONTHS[value%12].slice(0,3)+' '+Math.floor(value/12);if(metric?.format==='month')return CALENDAR_MONTHS[value];return value.toLocaleString(undefined,{maximumFractionDigits:maxFractionDigits,useGrouping:metric?.format!=='year'});}
export function readMetricTarget(metric,text){return metric?.date?parseDateInput(text):text.trim()===''?NaN:Number(text);}
export function initializeMetricTarget(input,metric,city,max=metric.max){
 const min=metric.min??0,initial=metric.date?Math.max(min,Math.min(max,calendarMonthIndex(city)+12)):metric.format==='year'?Math.min(max,Math.floor(calendarMonthIndex(city)/12)+1):metric.initial;
 input.min=metric.date?dateInputValue(min):min;input.max=metric.date?dateInputValue(max):max;input.value=metric.date?dateInputValue(initial):initial;input.step=metric.integer?'1':'any';
}
