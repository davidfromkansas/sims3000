// Original guide pp.327–330: 300 cells, 360 absolute capacity, 75% police
// effectiveness without a jail or at 110% occupancy. Interpolation is tuning.
export const JAIL_CELLS=300;
export const JAIL_MAXIMUM=360;
export function jailCapacity(funding){const staff=Math.max(0,Math.min(100,funding))/100;return {cells:JAIL_CELLS,capacity:JAIL_CELLS*staff,maximum:JAIL_MAXIMUM*staff};}
export function jailStatus(need,capacity,maximum){
 const occupancy=capacity?need/capacity:0,held=Math.min(need,maximum),released=Math.max(0,need-maximum);
 const policeEffectiveness=!capacity?.75:occupancy<=1?1:occupancy<=1.1?1-(occupancy-1)*2.5:.75*1.1/occupancy;
 return {need,capacity,maximum,held,released,occupancy,overcrowded:capacity>0&&need>capacity,policeEffectiveness};
}
export function jailReport(c){const j=c.stats.jails;if(!j)return'';const n=v=>v.toLocaleString(undefined,{maximumFractionDigits:1});return `<h3>Jail capacity &amp; overcrowding</h3><p>Estimated detention demand: <strong>${n(j.need)}</strong>. Operating cells: <strong>${n(j.capacity)}</strong>. Maximum overcrowded capacity: ${n(j.maximum)}.</p><p>Estimated held: ${n(j.held)} · unable to hold: ${n(j.released)}. ${j.capacity?'Occupancy: '+n(j.occupancy*100)+'%.': 'No operating jail capacity.'} Police effectiveness from jail conditions: <strong>${n(j.policeEffectiveness*100)}%</strong>.</p><p>${j.overcrowded?'Jails are overcrowded. Add another connected, powered jail or restore inactive jails to recover police effectiveness.':!j.capacity?'An operating jail allows police to reach full effectiveness.':'Jail capacity is sufficient for current estimated demand.'} Each jail has 300 cells and can temporarily hold at most 360 inmates. Funding above 100% does not add cells; underfunding reduces usable capacity.</p><p class="fine">Detention demand currently estimates 1% of residents; these are not individually tracked arrests or sentences. Overcrowding penalties are interpolated between the guide’s thresholds.</p>`;}
