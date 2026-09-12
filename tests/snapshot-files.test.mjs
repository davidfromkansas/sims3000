import assert from 'node:assert/strict';
import {readAlbum,exportAlbum,ALBUM_FILE_LIMIT} from '../dist/snapshot-files.js';
const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a/YQAAAAASUVORK5CYII=';
const photo={city:'River town',mayor:'Mayor',caption:'Year one <after flood>',month:12,startYear:2000,population:224,funds:42.5,created:1000,width:1,height:1,blob:new Blob([Buffer.from(png,'base64')],{type:'image/png'})};
const file=await exportAlbum([{...photo,id:37}]);const restored=await readAlbum(file);assert.equal(restored.length,1);assert.equal(restored[0].caption,photo.caption);assert.equal(restored[0].funds,42.5);assert.equal(restored[0].id,undefined);assert.deepEqual(await restored[0].blob.arrayBuffer(),await photo.blob.arrayBuffer());
const base=JSON.parse(await file.text());
for(const mutate of [d=>d.version=2,d=>d.photos=[],d=>d.photos[0].png='<svg></svg>',d=>d.photos[0].width=2,d=>d.photos[0].caption='x'.repeat(501),d=>d.photos[0].month=-1,d=>d.photos[0].funds='12']){const d=structuredClone(base);mutate(d);await assert.rejects(()=>readAlbum(new Blob([JSON.stringify(d)])));}
await assert.rejects(()=>readAlbum({size:ALBUM_FILE_LIMIT+1,text(){throw Error('must not read');}}),/100 MB/);
await assert.rejects(()=>exportAlbum([]));
console.log('PASS: portable photo roundtrip, captions and metadata, removed local IDs, PNG type/dimension validation, malformed albums and size limits.');
