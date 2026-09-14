import {readFileSync} from 'node:fs';
import {LANDMARKS} from '../dist/landmarks.js';
import {MODELED_LANDMARKS} from '../dist/landmark-models.js';
const inventory=JSON.parse(readFileSync(new URL('../docs/landmark-inventory.json',import.meta.url),'utf8'));
const names=new Set(),mapped=new Set(),groups=new Map();
for(const entry of inventory.entries){
 if(names.has(entry.name))throw Error('Duplicate inventory entry: '+entry.name);names.add(entry.name);
 if(!inventory.sources[entry.directorySource])throw Error('Missing source: '+entry.name);
 const group=groups.get(entry.edition)??{entries:0,runtimeMappings:0};group.entries++;
 if(entry.runtimeType){
  if(!LANDMARKS[entry.runtimeType])throw Error('Stale runtime mapping: '+entry.runtimeType);
  if(mapped.has(entry.runtimeType))throw Error('Two inventory entries share one runtime type: '+entry.runtimeType);
  mapped.add(entry.runtimeType);group.runtimeMappings++;
 }
 groups.set(entry.edition,group);
}
for(const type of Object.keys(LANDMARKS))if(!mapped.has(type))throw Error('Runtime landmark is absent from the source inventory: '+type);
const result={groups:Object.fromEntries(groups),runtimeLandmarks:Object.keys(LANDMARKS).length,directionalRuntimeLandmarks:Object.keys(LANDMARKS).filter(k=>MODELED_LANDMARKS.has(k)).length,unmappedEntries:inventory.entries.filter(e=>!e.runtimeType).length,identityOrCompositionReviews:inventory.entries.filter(e=>e.review).map(e=>({name:e.name,review:e.review})),meaning:'Runtime mappings establish catalog presence only. They do not prove original dimensions, composition, architectural accuracy or browser acceptance.'};
console.log(JSON.stringify(result,null,2));
