import {JAIL_CELLS} from './jail.js?v=architecture-collection-36';
import {HOSPITAL_BEDS} from './hospital.js?v=architecture-collection-36';
export const SERVICES={police:{size:3,name:'Police station',department:'police',cost:500,upkeep:25,radius:30},fire:{size:3,name:'Fire station',department:'fire',cost:500,upkeep:25,radius:25},hospital:{size:3,name:'Hospital',department:'health',cost:1000,upkeep:40,capacity:HOSPITAL_BEDS},school:{size:3,name:'School',department:'education',cost:500,upkeep:30,capacity:3000},jail:{size:3,name:'Jail',department:'police',cost:2500,upkeep:75,capacity:JAIL_CELLS},college:{size:3,name:'College',department:'education',cost:3000,upkeep:125,capacity:7500},library:{size:2,name:'Library',department:'education',cost:1000,upkeep:50,capacity:41000},museum:{size:3,name:'Museum',department:'education',cost:1500,upkeep:75,capacity:83000}};
export const civicSize=t=>SERVICES[t.type]?(t.civicSize??1):1;
export const isCivicRoot=t=>!!SERVICES[t.type]&&(t.root==null||t.root===t.y*(t.mapSize||48)+t.x);
export const civicRoots=c=>c.tiles.filter(isCivicRoot);
export function civicRoot(c,t){return SERVICES[t.type]&&t.root!=null?c.tiles[t.root]:t;}
export function civicMembers(c,t){
 const root=civicRoot(c,t),size=civicSize(root),members=[];
 for(let y=root.y;y<root.y+size;y++)for(let x=root.x;x<root.x+size;x++)members.push(c.tiles[y*c.size+x]);
 return members;
}
export const civicIntact=(c,t)=>civicMembers(c,t).every(u=>u&&!u.fire&&!u.rubble&&!u.radiation);
export const civicRoadIds=(c,t)=>[...new Set(civicMembers(c,t).flatMap(u=>u?.roadIds||[]))];

export const civicCenter=t=>({x:t.x+(civicSize(t)-1)/2,y:t.y+(civicSize(t)-1)/2});

export function civicServiceOperating(c,t){const d=SERVICES[t.type];return !!d&&civicIntact(c,t)&&civicMembers(c,t).every(u=>u.powered)&&civicRoadIds(c,t).length>0&&c.finance.roadCondition>20&&c.civic.funding[d.department]>0&&c.civic.underfunded[d.department]<6;}
