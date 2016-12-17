var script=[
  {'label':'!DOCTYPE html','color':'#ccc','type':'stack','nodrag':true}, // "THIS IS AN HTML DOCUMENT OK?"
  {'label':'html','color':'#804040','type':'c','nodrag':true,'blocks':[ // "OUR CODE IS HERE OBVIOUSLY WHERE ELSE WOULD IT BE"
    {'label':'head','color':'#804040','type':'c','nodrag':true,'blocks':[ // "SPECIAL INFO ABOUT THE PAGE ONLY THE BROWSER FUSSES ABOUT"
      {'label':'meta','color':'#804040','type':'stack','nodrag':true}, // "UNIMPORTANT INFO"
      {'label':'charset','color':'#4E6273','type':'attr','value':'UTF-8','nodrag':true},
      {'label':'title','color':'#CC6666','type':'c','blocks':[ // "PAGE NAME"
        {'label':'Block renderer','type':'text'},
      ]},
      {'label':'meta','color':'#CC6666','type':'stack'}, // "PAGE DESCRIPTION"
      {'label':'name','color':'#81A2BE','type':'attr','value':'description'},
      {'label':'content','color':'#81A2BE','type':'attr','value':'Renders blocks.'},
      {'label':'link','color':'#CC6666','type':'stack'}, // "WE HAVE A CSS PAGE AT "
      {'label':'rel','color':'#81A2BE','type':'attr','value':'stylesheet'},
      {'label':'type','color':'#81A2BE','type':'attr','value':'text/css'},
      {'label':'href','color':'#81A2BE','type':'attr','value':'style.css'},
    ]},
    {'label':'body','color':'#804040','type':'c','nodrag':true,'blocks':[ // "ACTUAL FUN STUFF HERE"
      {'label':'div','color':'#CC6666','type':'c','blocks':[ // "SECTION"
        {'label':'stuff\nmorestuff','type':'text'},
      ]},
      {'label':'id','color':'#81A2BE','type':'attr','value':'scripts'},
      {'label':'script','color':'#CC6666','type':'c','blocks':[]}, // "WE HAVE SOME SCRIPTS AT"
      {'label':'src','color':'#81A2BE','type':'attr','value':'../sheep.js'},
      {'label':'script','color':'#CC6666','type':'c','blocks':[]},
      {'label':'src','color':'#81A2BE','type':'attr','value':'rendertest.js'},
    ]},
    {'label':'comment','color':'#969896','type':'c','blocks':[ // "MENTAL NOTE"
      {'label':'MADE BY A HUMAN','type':'text'},
    ]},
  ]},
];
function render(part) {
  var inner='';
  for (var i=0;i<part.length;i++) {
    var nodrag='';
    if (part[i].nodrag) nodrag=' nodrag';
    if (part[i].type=='stack'||part[i].type=='c'&&part[i].blocks.length===0) inner+='<div class="block '+nodrag+'" style="background-color:'+part[i].color+'">'+part[i].label+'</div>';
    else if (part[i].type=='text') inner+='<span class="text block '+nodrag+'" contenteditable>'+part[i].label+'</span>';
    else if (part[i].type=='attr') {
      var value=part[i].value;
      if (!value) value=' ';
      inner+='<div class="attr block '+nodrag+'" style="background-color:'+part[i].color+'">'+part[i].label+' <span class="value"'+(nodrag?'':' contenteditable')+'>'+value+'</span></div>';
    }
    else if (part[i].type=='c') inner+='<div class="loop block '+nodrag+'" style="background-color:'+part[i].color+'"><span class="label">'+part[i].label+'</span>'+render(part[i].blocks)+'</div>';
  }
  return inner;
}
document.querySelector('#scripts').innerHTML=render(script);
document.querySelector('#scripts').oninput=function(e){
  e.target.textContent=e.target.textContent;
}
var mousefollower,placeholderInScript,mX,mY,oX,oY;
document.querySelector('#scripts').onmousedown=function(e){
  var target=e.target;
  if (target.className.includes('label')) target=target.parentNode;
  if (target.className.includes('value')) target=target.parentNode;
  if (!target.className.includes('nodrag')) {
    mousefollower=target.cloneNode(true);
    mousefollower.className+=" drag";
    oX=mX-target.getBoundingClientRect().left;
    oY=mY-target.getBoundingClientRect().top;
    mousefollower.style.left=(mX-oX)+"px";
    mousefollower.style.top=(mY-oY)+"px";
    document.body.appendChild(mousefollower);
    target.className+=' placeholder';
    placeholderInScript=target;
  }
}
document.body.onmousemove=function(e){
  mX=e.clientX+document.body.scrollLeft;
  mY=e.clientY+document.body.scrollTop;
  if (mousefollower) {
    mousefollower.style.left=(mX-oX)+"px";
    mousefollower.style.top=(mY-oY)+"px";
  }
}
document.body.onmouseup=function(e){
  if (mousefollower) {
    document.body.removeChild(mousefollower);
  }
  if (document.querySelector('.placeholder')) {
    document.querySelector('.placeholder').className=document.querySelector('.placeholder').className.replace(/placeholder/g,'');
  }
  mousefollower=false;
}
