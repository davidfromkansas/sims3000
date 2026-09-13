// Original model contact sheet: recycling, incinerator, waste-to-energy; rotations 0–3.
import {writeFileSync} from 'node:fs';
import {deflateSync} from 'node:zlib';
import {MODELED_WASTE,rasterizeWaste} from '../dist/waste-models.js';
const w=1064,h=800,data=Buffer.alloc(w*h*4);for(let i=0;i<data.length;i+=4){data[i]=214;data[i+1]=227;data[i+2]=219;data[i+3]=255;}
for(const [row,type]of [...MODELED_WASTE].entries())for(let rotation=0;rotation<4;rotation++){
 const raster=rasterizeWaste(type,rotation).data;
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){const to=((row*264+y+8)*w+rotation*264+x+8)*4;for(let ch=0;ch<3;ch++){let sum=0;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const from=((y*2+dy)*512+x*2+dx)*4,a=raster[from+3]/255;sum+=raster[from+ch]*a+data[to+ch]*(1-a);}data[to+ch]=Math.round(sum/4);}}
}
const crc=buf=>{let c=0xffffffff;for(const b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;};
const chunk=(type,payload)=>{const name=Buffer.from(type),head=Buffer.alloc(4),tail=Buffer.alloc(4);head.writeUInt32BE(payload.length);tail.writeUInt32BE(crc(Buffer.concat([name,payload])));return Buffer.concat([head,name,payload,tail]);};
const header=Buffer.alloc(13);header.writeUInt32BE(w);header.writeUInt32BE(h,4);header[8]=8;header[9]=6;const scan=Buffer.alloc(h*(w*4+1));for(let y=0;y<h;y++)data.copy(scan,y*(w*4+1)+1,y*w*4,(y+1)*w*4);
writeFileSync(new URL('../docs/previews/waste-facility-models.png',import.meta.url),Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(scan)),chunk('IEND',Buffer.alloc(0))]));
