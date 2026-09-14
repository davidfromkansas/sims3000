import {selection} from './engine.js?v=power-overload-grace-1';
const directions={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
const pointInCity=(r,p)=>p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.y>=0&&p.x<r.getCity().size&&p.y<r.getCity().size;
function cursor(r){return pointInCity(r,r.hover)?r.hover:r.pick(r.w/2,r.h/2)||{x:Math.floor(r.getCity().size/2),y:Math.floor(r.getCity().size/2)};}
function anchor(r){const range=r.keyboardRange;if(range&&(range.city!==r.getCity()||r.drag!==range.anchor)){cancelKeyboardRange(r);return null;}return range?.anchor||null;}
export function keyboardOwnsCursor(r){return r.keyboardCursorCity===r.getCity()&&pointInCity(r,r.hover);}
export function releaseKeyboardCursor(r){r.keyboardCursorCity=null;}
export function cancelKeyboardRange(r){if(r.keyboardRange&&r.drag===r.keyboardRange.anchor)r.drag=null;r.keyboardRange=null;r.dirty=true;}
export function keepKeyboardCursorVisible(r){if(!r.hover)return;const p=r.project(r.hover.x,r.hover.y),x=p.x,y=p.y+r.unit/2,margin=Math.min(56,r.w/4,r.h/4);r.pan.x+=x<margin?margin-x:x>r.w-margin?r.w-margin-x:0;r.pan.y+=y<margin?margin-y:y>r.h-margin?r.h-margin-y:0;r.dirty=true;}
export function moveKeyboardCursor(r,key){const d=directions[key];if(!d)return null;anchor(r);const p=cursor(r),[x,y]=r.transform(p.x,p.y),[xx,yy]=r.inverse(x+d[0],y+d[1]),next={x:xx,y:yy};r.hover=pointInCity(r,next)?next:{...p};r.keyboardCursorCity=r.getCity();keepKeyboardCursorVisible(r);return r.hover;}
export function keyboardRangeAllowed(tool){return !['query','pan','ignite','earthquake','tornado','ufo','whirlpool','toxicCloud','spaceJunk','riot','locust','dispatchFire','dispatchPolice','dispatchCropDuster'].includes(tool)&&selection(tool,{x:0,y:0},{x:1,y:1}).length>1;}
export function startKeyboardRange(r,tool){if(!keyboardRangeAllowed(tool))return null;const p={...cursor(r)};r.hover=p;r.keyboardCursorCity=r.getCity();r.keyboardRange={city:r.getCity(),anchor:p};r.drag=p;keepKeyboardCursorVisible(r);return p;}
export function takeKeyboardSelection(r,tool){const start=anchor(r);if(!pointInCity(r,r.hover)){cancelKeyboardRange(r);return[];}const points=selection(tool,start||r.hover,r.hover,r.getCity().size);cancelKeyboardRange(r);return points;}
