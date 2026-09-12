import assert from 'node:assert/strict';
import {CityRenderer} from '../dist/renderer.js';
import {createCity} from '../dist/engine.js';
import {centerNavigation,navigationColor} from '../dist/navigation-map.js';
const c=createCity();for(const t of c.tiles)t.elevation=(t.x+t.y)%8;
for(const rotation of [0,1,2,3])for(const zoom of [.65,1,2]){const r=Object.create(CityRenderer.prototype);Object.assign(r,{rotation,zoom,w:1000,h:600,pan:{x:175,y:-200},getCity:()=>c,tool:'residential'});const before=c.funds;for(const [rx,ry]of [[0,0],[47,47],[19,32],[-1,100]]){const p=centerNavigation(r,rx,ry),screen=r.project(p.x,p.y);assert.equal(screen.x,500);assert.ok(Math.abs(screen.y+r.unit/2-300)<1e-9);assert.ok(p.x>=0&&p.x<48&&p.y>=0&&p.y<48);assert.equal(r.tool,'residential');assert.equal(c.funds,before);}}
const t=c.tiles.find(t=>t.type==='residential');assert.notEqual(navigationColor({...t,powered:true},'power'),navigationColor({...t,powered:false},'power'));assert.notEqual(navigationColor({...t,traffic:0},'traffic'),navigationColor({...t,traffic:40},'traffic'));
console.log('PASS: navigation centering across rotations, zoom and elevation, clamped map edges, unchanged city/tool and service data colors.');
