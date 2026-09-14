import assert from 'node:assert/strict';
import {defaultBuildingDesign,exportBuildingDesign} from '../dist/building-designs.js';
import {readCustomBuildingLibrary,saveCustomBuildingLibrary,decodeCustomBuildingLibrary,CUSTOM_BUILDING_LIBRARY_KEY} from '../dist/custom-building-library.js';
import {mountCustomBuildingLibrary} from '../dist/custom-building-library-ui.js';
const records=new Map(),storage={getItem:key=>records.get(key)??null,setItem:(key,value)=>records.set(key,value)};
const model={...defaultBuildingDesign(0),name:'Library house'};
assert.deepEqual(readCustomBuildingLibrary(storage),[]);saveCustomBuildingLibrary([model],storage);assert.deepEqual(readCustomBuildingLibrary(storage),[model]);
const saved=records.get(CUSTOM_BUILDING_LIBRARY_KEY);assert.throws(()=>saveCustomBuildingLibrary([model,model],storage),/unique/);assert.equal(records.get(CUSTOM_BUILDING_LIBRARY_KEY),saved);
assert.throws(()=>decodeCustomBuildingLibrary('{"version":9,"buildings":[]}'),/invalid/);assert.throws(()=>decodeCustomBuildingLibrary('{"version":1,"buildings":["bad"]}'));
assert.throws(()=>saveCustomBuildingLibrary(Array(101).fill(model),storage),/100/);
let draft={...model,facade:'#123456'},selected;
const nodes=new Map(),node=key=>{if(!nodes.has(key))nodes.set(key,{});return nodes.get(key);};
const use={dataset:{customUse:'0'}},remove={dataset:{customRemove:'0'}};
const host={querySelector:node,querySelectorAll:selector=>selector==='[data-custom-use]'?[use]:selector==='[data-custom-remove]'?[remove]:[]};
mountCustomBuildingLibrary({host,footprint:{width:1,height:1},getDraft:()=>draft,selectDesign:design=>selected=design,storage});
node('[data-custom-add]').onclick();assert.equal(node('[data-custom-confirm]').hidden,false);assert.equal(records.get(CUSTOM_BUILDING_LIBRARY_KEY),saved);
node('[data-custom-dismiss]').onclick();use.onclick();assert.equal(selected.facade,model.facade);
node('[data-custom-add]').onclick();node('[data-custom-confirm]').onclick();use.onclick();assert.equal(selected.facade,'#123456');assert.equal(records.get(CUSTOM_BUILDING_LIBRARY_KEY),saved,'list edits remain drafts');
node('[data-custom-reset]').onclick();use.onclick();assert.equal(selected.facade,model.facade);
node('[data-custom-add]').onclick();node('[data-custom-confirm]').onclick();node('[data-custom-save]').onclick();assert.equal(readCustomBuildingLibrary(storage)[0].facade,'#123456');
selected.name='Mutation';assert.equal(readCustomBuildingLibrary(storage)[0].name,model.name,'preview receives an independent copy');
remove.onclick();assert.equal(readCustomBuildingLibrary(storage).length,1);node('[data-custom-save]').onclick();assert.deepEqual(readCustomBuildingLibrary(storage),[]);
draft=model;node('[data-custom-add]').onclick();storage.setItem=()=>{throw Error('Quota exceeded');};node('[data-custom-save]').onclick();assert.match(node('[data-custom-status]').textContent,/draft remains available/);assert.equal(node('[data-custom-save]').disabled,false);

// The standalone editor accepts every footprint, previews it, and stages list changes.
const {showCustomBuildingEditor}=await import('../dist/custom-building-editor-ui.js');
storage.setItem=(key,value)=>records.set(key,value);records.clear();
const editorNodes=new Map(),editorNode=key=>{if(!editorNodes.has(key))editorNodes.set(key,{setAttribute(){},querySelector:selector=>editorNode('nested:'+selector),querySelectorAll:()=>[]});return editorNodes.get(key);};
const context={beginPath(){},closePath(){},fill(){},stroke(){},moveTo(){},lineTo(){}};
globalThis.document={getElementById:editorNode,createElement:()=>({getContext:()=>context,toDataURL:()=> 'data:image/png;base64,preview'})};
let returned=0;showCustomBuildingEditor({dialog(){},back(){returned++;},storage});
const big={...defaultBuildingDesign('4@5x5'),name:'Large library model'},file=editorNode('customListFile');
file.files=[{size:100,text:async()=>exportBuildingDesign(big)}];await file.onchange();
assert.match(editorNode('customListName').textContent,/5 × 5/);assert.equal(editorNode('customListPreview').hidden,false);editorNode('customListLeft').onclick();assert.equal(editorNode('customListDirection').textContent,'West');
editorNode('nested:[data-custom-add]').onclick();assert.deepEqual(readCustomBuildingLibrary(storage),[]);editorNode('nested:[data-custom-save]').onclick();assert.equal(readCustomBuildingLibrary(storage)[0].name,big.name);
let finish;file.files=[{size:100,text:()=>new Promise(resolve=>finish=resolve)}];const reading=file.onchange();editorNode('customListBack').onclick();finish('invalid');await reading;assert.equal(returned,1);assert.equal(readCustomBuildingLibrary(storage)[0].name,big.name);
delete globalThis.document;

console.log('PASS: reusable custom-model list, portable model validation, duplicate confirmation, staged edits, preview copies, explicit persistence, removal, cancellation and quota failure recovery.');
