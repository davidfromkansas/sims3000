// Manual p.189 specifies a 1–100 magnitude control, not Richter values or a damage formula.
export const DEFAULT_QUAKE_MAGNITUDE=50;
export function validateQuakeMagnitude(value=DEFAULT_QUAKE_MAGNITUDE){if(!Number.isInteger(value)||value<1||value>100)throw Error('Earthquake magnitude must be a whole number from 1 to 100.');return value;}
export const quakeBands=(magnitude=DEFAULT_QUAKE_MAGNITUDE)=>Math.ceil(8*magnitude/50);
export function quakeDamageChance(distance,magnitude=DEFAULT_QUAKE_MAGNITUDE){return magnitude===50?1-distance*.1:Math.min(1,Math.max(0,(1-distance/(quakeBands(magnitude)*1.25))*magnitude/50));}
