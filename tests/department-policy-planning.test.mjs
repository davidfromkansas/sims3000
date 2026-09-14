import assert from 'node:assert/strict';
import {createCity,build,selection,recompute,validateSave} from '../dist/engine.js';
import {createScenario} from '../dist/scenario-setup.js';
import {serializeCity} from '../dist/save.js';
import {changeCivic} from '../dist/civic.js';
import {ADVISOR_POLICIES,analyzeOrdinances,ordinanceSnapshot} from '../dist/ordinance-analysis.js';
import {showOrdinanceAnalysis,ordinanceComparisonMarkup} from '../dist/ordinance-analysis-ui.js';
import {showDevelopmentAdvisor} from '../dist/development-advisors.js';
import {showTransportationAdvisor} from '../dist/transport-advisor.js';
assert.deepEqual(ADVISOR_POLICIES.transport,['carpool','parkingFines']);
assert.deepEqual(ADVISOR_POLICIES.environment,['cleanAir','cleanWater','trashPresort']);
assert.deepEqual(ADVISOR_POLICIES.utilities,['powerConservation','waterConservation']);
const water=createScenario('waterRecovery'),source=serializeCity(water),proposal={...water.civic.ordinances,powerConservation:true,waterConservation:true};
const result=analyzeOrdinances(water,proposal);assert.equal(serializeCity(water),source);assert.ok(result.after.waterDemand<result.before.waterDemand);assert.ok(result.after.waterUnserved>0,'conservation cannot repair the broken trunk');
const enacted=validateSave(JSON.parse(source));changeCivic(enacted,enacted.civic.funding,proposal);recompute(enacted);assert.deepEqual(ordinanceSnapshot(enacted),result.after);
const recycling=createCity('Recycling comparison',false);for(const t of recycling.tiles){t.terrain='land';t.nature=false;}
assert.ok(build(recycling,'road',selection('road',{x:12,y:20},{x:32,y:20})).ok);assert.ok(build(recycling,'coal',[{x:20,y:22}]).ok);recycling.month=240;assert.ok(build(recycling,'recycling',[{x:19,y:21}]).ok);
const waste=analyzeOrdinances(recycling,{...recycling.civic.ordinances,trashPresort:true});assert.ok(waste.before.recyclingCapacity>0);assert.equal(waste.after.recyclingCapacity,waste.before.recyclingCapacity*1.5);assert.equal(waste.before.recyclablePercent,30);assert.equal(waste.after.recyclablePercent,45);
assert.ok(build(recycling,'bulldoze',[{x:20,y:22}]).ok);assert.equal(analyzeOrdinances(recycling,{...recycling.civic.ordinances,trashPresort:true}).after.recyclingCapacity,0,'an unpowered center supplies no operating capacity');
assert.doesNotMatch(ordinanceComparisonMarkup(result,'utilities'),/Long-term targets|Operating recycling capacity/);assert.match(ordinanceComparisonMarkup(result,'utilities'),/Unserved water demand/);
const html=ordinanceComparisonMarkup(result);for(const label of ['Power delivered','Water delivered','Unserved water demand','Operating recycling capacity'])assert.ok(html.includes(label));
let body='',title='',saves=0,returns=0;const nodes=new Map();globalThis.document={querySelectorAll:()=>[],querySelector:s=>{if(!nodes.has(s))nodes.set(s,{checked:false,disabled:true});return nodes.get(s);}};
const ui={city:()=>water,dialog:(t,h)=>{title=t;body=h;nodes.clear();for(const m of h.matchAll(/id="(comparePolicy-[^"]+)" (checked)?/g))document.querySelector('#'+m[1]).checked=!!m[2];},save:()=>saves++,clearUndo:()=>{},update:()=>{},notify:()=>{}};
for(const kind of ['utilities','environment','transport']){
 if(kind==='transport'){showTransportationAdvisor(ui,()=>returns++);nodes.get('#moePolicies').onclick();}
 else{showDevelopmentAdvisor(ui,kind,()=>returns++);nodes.get('#developmentPolicies').onclick();}
 assert.equal(title,'Compare ordinances');for(const key of ADVISOR_POLICIES[kind])assert.ok(body.includes('comparePolicy-'+key));assert.ok(!body.includes('comparePolicy-watch'));
 nodes.get('#backPolicyComparison').onclick();assert.equal(title,kind==='transport'?'Moe Biehl':kind==='utilities'?'Gus Oddman':'Karen Frawl');
}
showOrdinanceAnalysis(ui,'utilities',()=>returns++);const input=nodes.get('#comparePolicy-waterConservation');input.checked=true;input.onchange();nodes.get('#comparePolicies').onclick();assert.equal(saves,0);assert.equal(serializeCity(water),source);nodes.get('#applyComparedPolicies').onclick();assert.equal(saves,1);assert.equal(water.civic.ordinances.waterConservation,true);assert.equal(water.civic.ordinances.cleanAir,false);assert.equal(water.month,0);assert.equal(validateSave(JSON.parse(serializeCity(water))).civic.ordinances.waterConservation,true);
console.log('PASS: department policy entry/return, scoped application, actual conservation delivery with unresolved disconnection, operating recycling capacity, preservation and saved enactment.');
