import {validateScenarioArea} from './scenario-area.js?v=architecture-collection-57';
export function focusScenarioArea(renderer,area){
 const checked=validateScenarioArea(area,{spatial:true},renderer.getCity?.()?.size||48);if(!checked)throw Error('Choose a neighborhood goal.');
 renderer.goalArea={city:renderer.getCity(),area:checked};const p=renderer.project(checked.x,checked.y);
 renderer.pan.x+=renderer.w/2-p.x;renderer.pan.y+=renderer.h/2-p.y-renderer.unit/2;renderer.hover=null;renderer.drag=null;renderer.dirty=true;
 renderer.updateGoalAreaIndicator?.();
}
export function installScenarioAreaView(renderer){
 const button=document.createElement('button');button.className='goal-area-indicator';button.hidden=true;button.type='button';button.setAttribute('aria-label','Hide highlighted scenario area');renderer.canvas.parentElement.append(button);
 renderer.updateGoalAreaIndicator=()=>{const selected=renderer.goalArea;if(selected?.city!==renderer.getCity())renderer.goalArea=null;const area=renderer.goalArea?.area;button.hidden=!area;if(area)button.textContent=`Goal area: ${area.x+1}, ${area.y+1} · radius ${area.radius} · Hide ×`;};
 button.onclick=()=>{renderer.goalArea=null;renderer.updateGoalAreaIndicator();renderer.dirty=true;renderer.canvas.focus({preventScroll:true});};
 return area=>focusScenarioArea(renderer,area);
}
