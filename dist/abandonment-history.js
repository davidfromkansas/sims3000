export const ABANDONMENT_CAUSES={power:'Loss of electricity',transport:'Loss of usable transport access',water:'Established water supply lost',garbage:'Uncollected garbage',landValue:'Land value below the occupied density',radiation:'Radiation',rubble:'Rubble',fire:'Active fire',demand:'Severely negative local demand',toxicCloud:'Toxic cloud evacuation'};
export function validateAbandonmentCause(t,version){
 if(version<124)return null;
 const value=t.abandonmentCause;
 if(value===null)return null;
 if(typeof value!=='string'||value.length>160||!t.abandonedLevel||t.level||t.rubble)throw Error('Invalid abandonment cause.');
 const keys=value.split(',');if(keys.some(key=>!Object.hasOwn(ABANDONMENT_CAUSES,key))||[...new Set(keys)].sort().join(',')!==value)throw Error('Invalid abandonment cause.');
 return value;
}
export function abandonmentExplanation(t){return t.abandonmentCause?`Recorded cause: ${t.abandonmentCause.split(',').map(key=>ABANDONMENT_CAUSES[key]).join('; ')}.`:'The original cause was not recorded for this building.';}
