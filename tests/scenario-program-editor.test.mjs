import assert from 'node:assert/strict';
import {mountScenarioProgramEditor} from '../dist/scenario-program-editor.js';
import {createCity,tick} from '../dist/engine.js';
import {attachCustomScenario} from '../dist/custom-scenarios.js';
import {pendingScenarioPopup} from '../dist/scenario-popups.js';
class Node {constructor(tag){this.tag=tag;this.children=[];this.textContent='';this.value='';}append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}replaceChildren(...nodes){this.children=[];this.append(...nodes);}setAttribute(){} }
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
