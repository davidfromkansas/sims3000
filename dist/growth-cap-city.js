// Original prepared 96×96 city for the residential-capacity challenge.
export function prepareGrowthCapCity(c){
 c.startYear=2000;c.funds=20000;let homes=0,industry=0,vacancies=0,plots=0;
 for(const t of c.tiles){Object.assign(t,{terrain:'land',nature:false,elevation:0,density:1,age:12});
  if(t.x>=85&&t.x<=90&&t.y>=2&&t.y<=7)continue;
  if(t.x%5===0||t.y%5===0){t.type='road';continue;}
  if(t.x%5===1&&t.y%5===1){t.type='wind';t.elevation=2;t.root=t.y*c.size+t.x;continue;}
  if(homes<3125){t.type='residential';if(plots++%25===0&&vacancies<100){vacancies++;}else{t.level=1;homes++;}}
  else if(industry<1500){t.type='industrial';t.level=1;industry++;}
  else t.type='landfill';
 }
 if(homes!==3125||industry!==1500||vacancies!==100)throw Error('Incomplete growth-cap challenge layout.');
 c.demographics=null;
}
