import assert from 'node:assert/strict';
import {backgroundInteractionAllowed,nativeSpaceTarget} from '../dist/background-controls.js';
const target=(scope,native=false)=>({closest:selector=>selector.includes(scope)&&scope?{}:native&&selector.includes('button,a,input')?{}:null});
const event=(type,key,t)=>({type,key,target:t});
for(const scope of ['.view-controls','.speed-controls','.navigation-map']){
 const t=target(scope,true);assert.equal(backgroundInteractionAllowed(event('click','',t)),true);
 for(const key of ['Tab','Enter',' ','ArrowLeft','ArrowRight','Home','+','-'])assert.equal(backgroundInteractionAllowed(event('keydown',key,t)),true,scope+' '+key);
}
const map=target(''),construction=target('.tools',true);
for(const t of [map,construction]){assert.equal(backgroundInteractionAllowed(event('click','',t)),false);for(const key of ['Enter','r','b','z','1'])assert.equal(backgroundInteractionAllowed(event('keydown',key,t)),false,'mutating shortcut '+key);for(const key of ['Tab',' ','Escape','Home','+','-'])assert.equal(backgroundInteractionAllowed(event('keydown',key,t)),true);}
assert.equal(backgroundInteractionAllowed(event('keydown','p',target('.navigation-map'))),true,'navigation select keeps native type-ahead keys');assert.equal(nativeSpaceTarget(construction),true);assert.equal(nativeSpaceTarget(target('.speed-controls',true)),true);assert.equal(nativeSpaceTarget(map),false,'map Space remains a global pause/pan gesture');
for(const key of ['r','l','w','t','c','v'])assert.equal(backgroundInteractionAllowed({...event('keydown',key,construction),ctrlKey:true}),true);assert.equal(backgroundInteractionAllowed({...event('keydown','z',construction),metaKey:true}),false);assert.equal(backgroundInteractionAllowed(event('keydown','F5',construction)),true);
console.log('PASS: background calculation retains focus traversal, camera/pause button activation and navigation-map keyboard controls while blocking construction clicks and shortcuts; native controls keep Space activation.');
