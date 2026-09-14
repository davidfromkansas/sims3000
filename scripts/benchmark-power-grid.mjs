import {performance} from 'node:perf_hooks';
import {createHash} from 'node:crypto';
import {createCity,recompute} from '../dist/engine.js';
const size=256,c=createCity('Dense power benchmark',false,size);
for(const t of c.tiles){t.terrain='land';t.nature=false;t.type=t.x%4===0||t.y%4===0?'road':(t.x%12===1&&t.y%12===1?'wind':['residential','commercial','industrial'][Math.floor(t.x/4)%3]);t.level=['residential','commercial','industrial'].includes(t.type)?3:0;t.density=3;if(t.type==='wind')t.root=t.y*size+t.x;}
const times=[];for(let i=0;i<3;i++){const start=performance.now();recompute(c);times.push(performance.now()-start);}
console.log(JSON.stringify({size,tiles:c.tiles.length,population:c.stats.population,plants:c.stats.plants,recomputeMs:times,hash:createHash('sha256').update(JSON.stringify(c)).digest('hex'),scope:'Synthetic dense grid, three Node recomputations. Not a balanced playable city, browser FPS, or a monthly simulation benchmark.'},null,2));
