import assert from 'node:assert/strict';
import {createCity,build,selection,idx} from '../dist/engine.js';
import {advanceFacilities,recomputeFacilities} from '../dist/facilities.js';
import {harborPaths,harborShips} from '../dist/harbor-visuals.js';
const c=createCity('Harbor',false);for(const t of c.tiles){t.terrain='land';t.nature=false;t.elevation=0;}
assert.ok(build(c,'seaport',selection('seaport',{x:20,y:20},{x:21,y:25})).ok);
for(let x=0;x<20;x++)for(let y=19;y<27;y++)c.tiles[idx(x,y)].terrain='water';
for(const t of c.tiles.filter(t=>t.type==='seaport')){t.powered=true;t.watered=true;t.roadIds=[1];}
const recompute=()=>Object.assign(c.stats,recomputeFacilities(c));recompute();assert.equal(harborPaths(c).length,0,'zoning alone has no shipping');for(let i=0;i<6;i++){advanceFacilities(c);recompute();}assert.equal(c.stats.activeSeaports,1);const routes=harborPaths(c);assert.equal(routes.length,1);assert.equal(c.tiles[routes[0].path.at(-1)].x,0);for(const i of routes[0].path)assert.equal(c.tiles[i].terrain,'water');
const before=JSON.stringify(c),first=harborShips(c,0,routes);assert.deepEqual(harborShips(c,0,routes),first,'held visual time is stable');assert.notDeepEqual(harborShips(c,30,routes),first);assert.equal(JSON.stringify(c),before,'visual vessels do not change city economics');
for(let seconds=0;seconds<400;seconds+=.3){const [v]=harborShips(c,seconds,routes);assert.ok(v.x>=0&&v.x<20&&v.y>=19&&v.y<27);assert.equal(Math.abs(v.dx)+Math.abs(v.dy),1);}
for(let y=19;y<27;y++)c.tiles[idx(10,y)].type='road';assert.equal(harborPaths(c).length,0,'do not sail through bridges');for(let y=19;y<27;y++)c.tiles[idx(10,y)].type=null;c.tiles[idx(20,20)].watered=false;recompute();assert.equal(harborPaths(c).length,0,'service failure stops shipping');c.tiles[idx(20,20)].watered=true;recompute();assert.equal(harborPaths(c).length,1,'restored service restores visual route');for(let y=19;y<27;y++)c.tiles[idx(0,y)].terrain='land';recompute();assert.equal(c.stats.activeSeaports,0);assert.equal(harborPaths(c).length,0,'closed coast is not an export route');
console.log('PASS: operating seaport development, connected water routes, stable paused positions, movement bounds, bridge avoidance, service loss/recovery and unchanged economics.');
