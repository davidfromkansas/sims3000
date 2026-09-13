const CAMERA_CONTROLS='.view-controls,.speed-controls,.navigation-map,.restore-toolbars';
export function backgroundInteractionAllowed(event){
 const camera=!!event.target.closest?.(CAMERA_CONTROLS);
 if(event.type==='click')return camera;
 if(event.type!=='keydown')return false;
 // Keep browser/system shortcuts available; the game owns Ctrl/Cmd+Z (construction undo).
 if(event.ctrlKey||event.metaKey)return event.key.toLowerCase()!=='z';
 if(event.altKey||/^F(?:[1-9]|1[0-2])$/.test(event.key))return true;
 // Tab must remain available even when it moves focus to a temporarily blocked command.
 if(['Tab',' ','Home','+','-','=','Escape','h','H','[',']'].includes(event.key))return true;
 if(event.target.closest?.('.navigation-map'))return true;
 if(event.target.id==='city'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return true;
 return camera&&['Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key);
}
export const nativeSpaceTarget=target=>!!target.closest?.('button,a,input,textarea,select,summary,[role="button"]');
