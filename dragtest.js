var dragging=false,movingobject,mX,mY,oX,oY,movingId;
document.body.onmousedown=function(e){
  if (!movingobject&&e.target.className.includes("block")) {
    var dragger=e.target.cloneNode(true);
    dragger.className+=" dragging";
    document.body.appendChild(dragger);
    movingobject=document.querySelector(".dragging");
    e.target.className+=" placeholder";
    oX=mX-e.target.getBoundingClientRect().left;
    oY=mY-e.target.getBoundingClientRect().top;
    movingobject.style.left=(mX-oX)+"px";
    movingobject.style.top=(mY-oY)+"px";
    movingId=e.target;
  }
}
document.body.onmouseup=function(e){
  if (movingobject&&movingobject.className.includes("dragging")) {
    document.body.removeChild(movingobject);
    document.querySelector(".placeholder").className=document.querySelector(".placeholder").className.slice(0,-12);
  }
  movingobject="";
}
document.body.onmousemove=function(e){
  mX=e.clientX;
  mY=e.clientY;
  if (movingobject) {
    movingobject.style.left=(mX-oX)+"px";
    movingobject.style.top=(mY-oY)+"px";
    var newHover=Math.floor(Number(movingobject.style.top.replace("px",""))/25);
    if (newHover>=document.querySelectorAll('.block').length) {newHover=document.querySelectorAll('.block').length-1;}
    if (newHover<0) {
      swapSibling(document.querySelectorAll('.block')[0],movingId);
    } else {
      swapSibling(movingId,document.querySelectorAll('.block')[newHover]);
    }
  }
}
/*// http://stackoverflow.com/questions/11761881/javascript-dom-find-element-index-in-container
var nodeList=Array.prototype.slice.call(document.querySelectorAll('.block')); // nodeList.indexOf(node thing)
removed for now, not needed */

// http://stackoverflow.com/questions/558614/reordering-of-divs
function swapSibling(node1, node2) {
  node1.parentNode.replaceChild(node1, node2);
  node1.parentNode.insertBefore(node2, node1); 
}