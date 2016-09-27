var dragging=false,movingobject,mX,mY,oX,oY;
document.body.onmousedown=function(e){
  if (!movingobject&&e.target.className=="block") {
    movingobject=e.target;
    movingobject.className+=" dragging";
    oX=mX-Number(movingobject.style.left.replace('px',''));
    oY=mY-Number(movingobject.style.top.replace('px',''));
  }
}
document.body.onmouseup=function(e){
  movingobject.className="block";
  movingobject="";
}
document.body.onmousemove=function(e){
  mX=e.clientX;
  mY=e.clientY;
  if (movingobject) {
    movingobject.style.left=(mX-oX)+"px";
    movingobject.style.top=(mY-oY)+"px";
  }
}