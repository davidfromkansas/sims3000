import assert from 'node:assert/strict';
import {mountScenarioProgramEditor} from '../dist/scenario-program-editor.js';
import {createCity,tick} from '../dist/engine.js';
import {attachCustomScenario} from '../dist/custom-scenarios.js';
import {pendingScenarioPopup} from '../dist/scenario-popups.js';
class Node {constructor(tag){this.tag=tag;if(tag==='textarea')Object.defineProperty(this,'type',{get:()=> 'textarea'});this.children=[];this.textContent='';this.value='';}append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}replaceChildren(...nodes){this.children=[];this.append(...nodes);}setAttribute(){} }
globalThis.document={createElement:tag=>new Node(tag)};const root=new Node('div'),walk=n=>[n,...n.children.flatMap(walk)];
const box=title=>walk(root).find(n=>n.tag==='legend'&&n.textContent===title)?.parent;
const click=(scope,label)=>{const b=scope.children.find(n=>n.tag==='button'&&n.textContent===label);assert.ok(b,label);assert.ok(!b.disabled,label+' enabled');b.onclick();};
const control=(scope,label)=>{const wrap=walk(scope).find(n=>n.tag==='label'&&n.textContent===label);assert.ok(wrap,label);return wrap.children[0];};
const change=(scope,label,value)=>{const input=control(scope,label);input.value=String(value);(input.onchange||input.oninput)();};
let targets=[];const editor=mountScenarioProgramEditor(root,{size:96,entryTargets:()=>targets});click(root,'Add routine');change(root,'Routine name','Council');click(box('Actions'),'Add action');change(box('Actions'),'Action','variable');change(box('Actions'),'Value',3);click(box('Actions'),'Add If / Else');change(box('Condition'),'City or scenario value','variable1');change(box('Condition'),'Threshold',3);click(box('If true'),'Add action');change(box('If true'),'Action','popup');change(box('If true'),'Message text','Counter passed: {variable1}');click(box('Otherwise'),'Add action');change(box('Otherwise'),'Message text','Counter failed');
let programs=editor.read([0]);assert.equal(programs[0].steps[0].action.value,3);assert.equal(programs[0].steps[1].condition.metric,'variable1');const c=createCity();attachCustomScenario(c,{title:'Form-authored routine',months:24,objectives:[{metric:'population',target:999999}],programs,events:[{type:'program',routine:0,month:1}]});tick(c);assert.equal(c.scenario.variables[0],3);assert.equal(pendingScenarioPopup(c).message,'Counter passed: 3');
// Sparse goal rows are mapped exactly when submitting, without mutating drafts.
click(box('If true'),'Add action');const trueRows=box('If true').children.filter(n=>n.tag==='section');change(trueRows[1],'Action','addGoal');const row=box('If true').children.filter(n=>n.tag==='section')[1];change(row,'Goal row',3);assert.equal(editor.read([1,3])[0].steps[1].then[1].action.goal,1);assert.equal(editor.draft()[0].steps[1].then[1].action.goal,3);assert.throws(()=>editor.read([1]),/empty goal row/);assert.equal(editor.draft()[0].name,'Council');
// Structured conditions and action ordering use real handlers.
click(box('Condition'),'Combine conditions');assert.equal(editor.draft()[0].steps[1].condition.conditions.length,2);const steps=box('Actions').children.filter(n=>n.tag==='section');click(steps[1],'Move step up');assert.equal(editor.draft()[0].steps[0].kind,'if');
// Scheduled and call references protect deletion; unreferenced routine removal
// renumbers remaining targets through the widget's change notification.
click(root,'Add routine');const second=box('Routine 2');change(second,'Routine name','Helper');targets=[1];click(box('Routine 2'),'Delete routine');assert.equal(editor.draft().length,2);assert.match(walk(root).find(n=>n.tag==='p'&&n.textContent.includes('Remove scheduled'))?.textContent||'',/Remove scheduled/);targets=[];click(box('Routine 2'),'Delete routine');assert.equal(editor.draft().length,1);
// Reject cycles and preserve the editable draft on validation failure.
click(box('Actions'),'Add subroutine call');assert.throws(()=>editor.read([1,3]),/Recursive/);assert.equal(editor.draft()[0].steps.at(-1).kind,'call');
const reuseRoot=new Node('div'),original=[{name:'Existing',steps:[{kind:'call',routine:1}]},{name:'Helper',steps:[{kind:'action',action:{type:'announcement',message:'Reusable'}}]}],reuse=mountScenarioProgramEditor(reuseRoot,{initial:[{name:'Existing',steps:[]}],available:original});reuseRoot.children.find(n=>n.textContent==='Copy routines from current challenge').onclick();const copied=reuse.read();assert.equal(copied.length,3);assert.equal(copied[1].name,'Existing copy 1');assert.equal(copied[1].steps[0].routine,2);assert.equal(original[0].steps[0].routine,1);assert.equal(original[0].name,'Existing');
console.log('PASS: form-authored playable routine, nested branches, sparse goal mapping, draft preservation, action ordering, protected routine deletion and recursive-call rejection.');

const trade=mountScenarioProgramEditor(root);click(root,'Add routine');click(box('Actions'),'Add action');change(box('Actions'),'Action','neighborDeal');assert.equal(trade.read()[0].steps[0].action.amount,50);change(box('Actions'),'Neighbor','sea');assert.equal(trade.read()[0].steps[0].action.resource,'garbage');change(box('Actions'),'Contract command','disable');assert.equal(trade.read()[0].steps[0].action.amount,undefined);change(box('Actions'),'Contract command','enable');change(box('Actions'),'Contract units',100);assert.equal(trade.read()[0].steps[0].action.amount,100);

change(box('Actions'),'Action','earthquake');assert.equal(trade.read()[0].steps[0].action.magnitude,50);change(box('Actions'),'Earthquake magnitude (1–100)',100);assert.equal(trade.read()[0].steps[0].action.magnitude,100);change(box('Actions'),'Earthquake magnitude (1–100)',101);assert.throws(()=>trade.read(),/magnitude/);

change(box('Actions'),'Action','tornado');change(box('Actions'),'Travel direction','southwest');change(box('Actions'),'Tornado intensity (1–100)',80);change(box('Actions'),'Travel distance (tiles)',12);change(box('Actions'),'Travel speed','fast');const warning=control(box('Actions'),'Early tornado warning');warning.checked=false;warning.onchange();assert.deepEqual(trade.read()[0].steps[0].action.tornado,{direction:'southwest',intensity:80,distance:12,speed:'fast',warning:false});

change(box('Actions'),'Action','resultText');change(box('Actions'),'Result message for','lost');const message=control(box('Actions'),'Message text');assert.equal(message.maxLength,1500);change(box('Actions'),'Message text','A different ending: {variable1}');assert.equal(trade.read()[0].steps[0].action.outcome,'lost');assert.equal(trade.read()[0].steps[0].action.message,'A different ending: {variable1}');change(box('Actions'),'Action','dialogText');assert.equal(trade.read()[0].steps[0].action.x,0);
// A cut step remains a variable reference until cleared or pasted.
const collectionRoot=new Node('div');let variableDefinitions=Array.from({length:6},(_,i)=>({name:'Counter '+(i+1),initial:0}));
const collection=mountScenarioProgramEditor(collectionRoot,{variables:()=>variableDefinitions,initial:[{name:'Score routine',steps:[{kind:'action',action:{type:'variable',variable:5,operation:'copy',metric:'variable2'}}]}]});
const initialRow=walk(collectionRoot).find(n=>n.tag==='section');click(initialRow,'Cut step');
assert.equal(collection.draft()[0].steps.length,0);
assert.throws(()=>collection.prepareVariableRemoval(variableDefinitions,5),/Cannot remove Counter 6/);
const applyRemoval=collection.prepareVariableRemoval(variableDefinitions,0);variableDefinitions.shift();applyRemoval();collection.refreshVariables();
const actionBox=walk(collectionRoot).find(n=>n.tag==='legend'&&n.textContent==='Actions').parent;click(actionBox,'Paste at end');
assert.equal(collection.draft()[0].steps[0].action.variable,4);
assert.equal(collection.draft()[0].steps[0].action.metric,'variable1');
const variableControl=control(collectionRoot,'Variable slot');assert.equal(variableControl.children.length,5);assert.equal(variableControl.children.at(-1).textContent,'Counter 6');
console.log('PASS variable collection in routine editor: named choices, copied-step deletion guard and atomic reference remapping');
// Copyable source routines retain counter identities after unused-row removal.
const sourceRoot=new Node('div');let sourceVariables=Array.from({length:6},(_,i)=>({name:'Source '+i,initial:0}));
const sourceEditor=mountScenarioProgramEditor(sourceRoot,{variables:()=>sourceVariables,available:[{name:'Source routine',steps:[{kind:'action',action:{type:'variable',variable:5,operation:'add',value:1}}]}]});
const applySourceRemoval=sourceEditor.prepareVariableRemoval(sourceVariables,0);sourceVariables.shift();applySourceRemoval();sourceEditor.refreshVariables();click(sourceRoot,'Copy routines from current challenge');
assert.equal(sourceEditor.draft()[0].steps[0].action.variable,4);
const blockedRoot=new Node('div');let blockedVariables=Array.from({length:6},(_,i)=>({name:'Source '+i,initial:0}));
const blockedEditor=mountScenarioProgramEditor(blockedRoot,{variables:()=>blockedVariables,available:[{name:'Source routine',steps:[{kind:'action',action:{type:'variable',variable:5,operation:'add',value:1}}]}]});
const applyBlockedRemoval=blockedEditor.prepareVariableRemoval(blockedVariables,5);blockedVariables.pop();applyBlockedRemoval();blockedEditor.refreshVariables();click(blockedRoot,'Copy routines from current challenge');
assert.deepEqual(blockedEditor.draft(),[]);assert.ok(walk(blockedRoot).some(n=>n.textContent.includes('source routines use a variable removed')));
// Named ending ranks retain row identity through renames, empty rows and copies.
const rankRoot=new Node('div');let rankRows=[{index:1,name:'Recovery',outcome:'won'},{index:3,name:'Harbor rescuer',outcome:'won'}];
const rankEditor=mountScenarioProgramEditor(rankRoot,{ranks:()=>rankRows,initial:[{name:'Ending',steps:[{kind:'action',action:{type:'ending',outcome:'won',rankIndex:3,message:'Rescued.'}}]}]});
assert.equal(rankEditor.read([0],[1,3])[0].steps[0].action.rankIndex,1);
assert.equal(rankEditor.draft()[0].steps[0].action.rankIndex,3);
rankRows[1].name='Coast guardian';rankEditor.refreshRanks();assert.ok(control(rankRoot,'Award rank').children.some(n=>n.textContent.includes('Coast guardian')));
const endingRow=walk(rankRoot).find(n=>n.tag==='section');click(endingRow,'Copy step');rankRows[1].name='';rankEditor.refreshRanks();
assert.equal(control(rankRoot,'Award rank').value,'3');assert.ok(control(rankRoot,'Award rank').children.some(n=>n.textContent.includes('is empty')));
assert.throws(()=>rankEditor.read([0],[1]),/empty rank row 4/);
rankRows[1].name='Coast guardian';rankEditor.refreshRanks();const endingBox=walk(rankRoot).find(n=>n.tag==='legend'&&n.textContent==='Actions').parent;click(endingBox,'Paste at end');
assert.deepEqual(rankEditor.read([0],[1,3])[0].steps.map(s=>s.action.rankIndex),[1,1]);
console.log('PASS ending-rank editor: named selections, sparse row mapping, rename, empty-row rejection and copied references');
const importRankRoot=new Node('div'),sourceRank=[{name:'Harbor award',outcome:'won'}],sourceRoutine=[{name:'Source ending',steps:[{kind:'action',action:{type:'ending',rankIndex:0,outcome:'won',message:'Done'}}]}];
let destinationRanks=[];const importRanks=mountScenarioProgramEditor(importRankRoot,{available:sourceRoutine,availableRanks:sourceRank,ranks:()=>destinationRanks});
click(importRankRoot,'Copy routines from current challenge');assert.deepEqual(importRanks.draft(),[]);assert.ok(walk(importRankRoot).some(n=>n.textContent.includes('Create a rank named Harbor award')));
destinationRanks=[{index:3,name:'Harbor award',outcome:'won'}];importRanks.refreshRanks();click(importRankRoot,'Copy routines from current challenge');
assert.equal(importRanks.draft()[0].steps[0].action.rankIndex,3);assert.equal(importRanks.read([0],[3])[0].steps[0].action.rankIndex,0);
const comparisonRoot=new Node('div');const comparisonEditor=mountScenarioProgramEditor(comparisonRoot,{initial:[{name:'Compare',steps:[{kind:'if',condition:{metric:'variable1',operator:'gte',target:7},then:[],else:[]}]}]});
change(comparisonRoot,'Compare with','metric');change(comparisonRoot,'Comparison value','variable2');
assert.equal(comparisonEditor.read()[0].steps[0].condition.right.metric,'variable2');assert.equal(Object.hasOwn(comparisonEditor.read()[0].steps[0].condition,'target'),false);
change(comparisonRoot,'Compare with','constant');assert.equal(control(comparisonRoot,'Threshold').value,'7');
change(comparisonRoot,'Compare with','metric');assert.equal(control(comparisonRoot,'Comparison value').value,'variable2');change(comparisonRoot,'City or scenario value','variable3');
assert.equal(Object.hasOwn(comparisonEditor.read()[0].steps[0].condition,'target'),false);
assert.throws(()=>comparisonEditor.prepareVariableRemoval(Array.from({length:4},(_,i)=>({name:'Counter '+i,initial:0})),1),/comparison value/);
change(comparisonRoot,'Comparison value','goalStatus4');assert.equal(comparisonEditor.read([0,3])[0].steps[0].condition.right.metric,'goalStatus2');assert.throws(()=>comparisonEditor.read([0]),/empty goal row/);
console.log('PASS live-comparison routine controls: draft retention, both operand references and sparse goal mapping');
