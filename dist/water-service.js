const zone=t=>['residential','commercial','industrial'].includes(t.type);
export const needsEstablishedWater=t=>t.level>1||t.waterEstablished===true;
// Low development may begin dry. Once occupied buildings have received water,
// a later interruption is a service failure even after they shrink to level one.
export function recordWaterService(c){for(const t of c.tiles)if(zone(t)&&!t.rubble&&!t.radiation&&(t.level>1||t.level>0&&t.watered))t.waterEstablished=true;}
export function clearRemovedWaterService(c){for(const t of c.tiles)if(!zone(t)||t.rubble||t.radiation||!t.level&&!t.abandonedLevel&&!t.historicalLevel)t.waterEstablished=false;}
export const waterServiceWarning=t=>t.waterEstablished&&!t.watered?'Established water service is interrupted. Restore supply before prolonged service loss causes abandonment.':'';
