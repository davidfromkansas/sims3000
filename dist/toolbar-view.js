// Manual p.42: hide the information/main toolbars while hotkeys remain usable.
export function installToolbarView({root,canvas,hideButton,restoreButton,cancelGesture,isDialogOpen,markDirty,rotate}){
 let hidden=false;
 const setHidden=value=>{
  if(typeof value!=='boolean')throw Error('Choose whether toolbars are hidden.');
  if(value===hidden)return;
  cancelGesture();hidden=value;root.classList.toggle('toolbars-hidden',hidden);restoreButton.hidden=!hidden;hideButton.setAttribute('aria-pressed',String(hidden));markDirty();canvas.focus({preventScroll:true});
 };
 hideButton.onclick=()=>setHidden(true);restoreButton.onclick=()=>setHidden(false);
 return{get hidden(){return hidden;},setHidden,handleKey(event){
  if(isDialogOpen()||event.ctrlKey||event.metaKey||event.altKey||event.isComposing||event.target?.isContentEditable||event.target?.closest?.('input,textarea,select,[role="textbox"]'))return false;
  const toggle=event.key.toLowerCase()==='h',restore=event.key==='Escape'&&hidden,turn=event.key==='['?-1:event.key===']'?1:0;if(!toggle&&!restore&&!turn)return false;
  event.preventDefault();if(!event.repeat){if(turn)rotate(turn);else setHidden(toggle?!hidden:false);}return true;
 }};
}
