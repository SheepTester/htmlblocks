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
function render(part,inLoop) {
  var inner='',inLoop;
  if (!inLoop) inLoop='';
  for (var i=0;i<part.length;i++) {
    var nodrag='',id=inLoop+i,placeholder='';
    if (part[i].placeholder) placeholder=' placeholder';
    if (part[i].nodrag) nodrag=' nodrag';
    if (part[i].type=='stack'||part[i].type=='c'&&part[i].blocks.length===0) inner+='<div class="block '+nodrag+' '+placeholder+'" style="background-color:'+part[i].color+'" id="b'+id+'">'+part[i].label+'</div>';
    else if (part[i].type=='text') inner+='<span class="text block '+nodrag+' '+placeholder+'" contenteditable id="b'+id+'">'+part[i].label+'</span>';
    else if (part[i].type=='attr') {
      var value=part[i].value;
      if (!value) value=' ';
      inner+='<div class="attr block '+nodrag+' '+placeholder+'" style="background-color:'+part[i].color+'" id="b'+id+'">'+part[i].label+' <span class="value"'+(nodrag?'':' contenteditable')+'>'+value+'</span></div>';
    }
    else if (part[i].type=='c') inner+='<div class="loop block '+nodrag+' '+placeholder+'" style="background-color:'+part[i].color+'" id="b'+id+'"><span class="label">'+part[i].label+'</span>'+render(part[i].blocks,id+'-')+'</div>';
  }
  return inner;
}
document.querySelector('#scripts').innerHTML=render(script);
function locateBlock(id,options) {
  var indices=id.slice(1).split('-'),block=script[Number(indices[0])],options;
  if (options&&options.getParent) {
    var last=indices[indices.length-1];
    indices.splice(-1,1);
  }
  for (var i=1;i<indices.length;i++) {
    if (block&&block.blocks) block=block.blocks[Number(indices[i])];
  }
  if (options) {
    if (options.getParent) return [block,Number(last)];
    if (options.getIndices) {
      for (var i=0;i<indices.length;i++) {
        indices[i]=Number(indices[i]);
      }
      return indices;
    }
  }
  else return block;
}
document.querySelector('#scripts').oninput=function(e){
  e.target.textContent=e.target.textContent;
  var block;
  if (e.target.className.includes('value')) block=locateBlock(e.target.parentNode.id);
  else if (e.target.className.includes('text')) block=locateBlock(e.target.id);
  if (block.type=='text') block.label=e.target.textContent;
  else if (block.type=='attr') block.value=e.target.textContent;
}
var mX,mY,oX,oY,blocksBeingDragged=[];
document.querySelector('#scripts').onmousedown=function(e){
  var target=e.target;
  if (target.className.includes('label')) target=target.parentNode;
  if (target.className.includes('value')) target=target.parentNode;
  if (!target.className.includes('nodrag')) {
    var b=locateBlock(target.id);
    b.placeholder=true;
    blocksBeingDragged.push(b);
    var mousefollower=target.cloneNode(true);
    oX=mX-target.getBoundingClientRect().left;
    oY=mY-target.getBoundingClientRect().top;
    document.querySelector('#drag').style.left=(mX-oX)+"px";
    document.querySelector('#drag').style.top=(mY-oY)+"px";
    document.querySelector('#drag').appendChild(mousefollower);
    target.className+=' placeholder';
    if (target.className.includes('attr')) {
      while (target.nextElementSibling&&target.nextElementSibling.className.includes('attr')&&!target.nextElementSibling.className.includes('nodrag')) {
        target=target.nextElementSibling;
        var b=locateBlock(target.id);
        b.placeholder=true;
        blocksBeingDragged.push(b);
        var mousefollower=target.cloneNode(true);
        document.querySelector('#drag').appendChild(mousefollower);
        target.className+=' placeholder';
      }
    } else {
      while (target.nextElementSibling&&!target.nextElementSibling.className.includes('nodrag')) {
        target=target.nextElementSibling;
        var b=locateBlock(target.id);
        b.placeholder=true;
        blocksBeingDragged.push(b);
        var mousefollower=target.cloneNode(true);
        document.querySelector('#drag').appendChild(mousefollower);
        target.className+=' placeholder';
      }
    }
  }
}
function removePlaceholders(part,removeTag) {
  for (var i=0;i<part.length;i++) {
    if (part[i].placeholder) {
      if (removeTag) part[i].placeholder=false;
      else part.splice(i,1);
      i--;
    } else if (part[i].blocks) {
      part[i].blocks=removePlaceholders(part[i].blocks,removeTag);
    }
  }
  return part;
}
document.body.onmousemove=function(e){
  mX=e.clientX+document.body.scrollLeft;
  mY=e.clientY+document.body.scrollTop;
  if (document.querySelector('#drag').innerHTML) {
    document.querySelector('#drag').style.left=(mX-oX)+"px";
    document.querySelector('#drag').style.top=(mY-oY)+"px";
    script=removePlaceholders(script,false);
    document.querySelector('#drag').style.display="none";
    var elatloc=document.elementFromPoint(mX,mY);
    if (elatloc.className.includes('value')||elatloc.className.includes('label')) elatloc=elatloc.parentNode;
    var blockIndices=locateBlock(elatloc.id,{getIndices:1}),block=script[blockIndices[0]],type=locateBlock(elatloc.id);
    if (type&&type.type=='c'&&blocksBeingDragged[0].type!='attr') {
      if (blocksBeingDragged[0].type=='attr') {
        for (var i=1;i<blockIndices.length-1;i++) {
          if (block&&block.blocks) block=block.blocks[blockIndices[i]];
        }
        if (block&&block.blocks) block.blocks.splice.apply(block.blocks,[blockIndices[blockIndices.length-1],0].concat(blocksBeingDragged));
      } else {
        for (var i=1;i<blockIndices.length;i++) {
          if (block&&block.blocks) block=block.blocks[blockIndices[i]];
        }
        if (block&&block.blocks) block.blocks.splice.apply(block.blocks,[0,0].concat(blocksBeingDragged));
      }
    } else {
      //
      for (var i=1;i<blockIndices.length-1;i++) {
        if (block&&block.blocks) block=block.blocks[blockIndices[i]];
      }
      if (block&&block.blocks) block.blocks.splice.apply(block.blocks,[blockIndices[blockIndices.length-1],0].concat(blocksBeingDragged)); // http://stackoverflow.com/questions/7032550/javascript-insert-an-array-inside-another-array
    }
    document.querySelector('#drag').style.display="block";
    document.querySelector('#scripts').innerHTML=render(script);
  }
}
document.body.onmouseup=function(e){
  if (document.querySelector('#drag').innerHTML) {
    document.querySelector('#drag').innerHTML='';
  }
  if (document.querySelector('.placeholder')) {
    script=removePlaceholders(script,true);
    document.querySelector('#scripts').innerHTML=render(script);
  }
  blocksBeingDragged=[];
}
