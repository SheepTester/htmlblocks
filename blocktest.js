var scripts=[ // array of loose code
  [ // this is for the dragging
    [0,0],
  ],
  [ // array of blocks in first script
    [150,40], // location
    {tag:'blk'},
    {tag:'attr',val:'val'},
    {tag:'blk'},
    {tag:'txt',val:'text'},
    {tag:'cblk',blocks:[ // array of blocks inside c
      {tag:'blk'},
      {tag:'empc',blocks:[
        {tag:'txt',val:'Hi attribute!'},
        {tag:'attr',val:'Hello text node!'},
        {tag:'attr',val:'bubbles notice me!'},
        {tag:'blk'}
      ]},
      {tag:'attr',val:'val'}
    ]},
    {tag:'attr',val:'val'},
    {tag:'empc',blocks:[]}
  ]
],
colors={
  txtb:'333333',
  text:'BD806A',
  frmt:'9B6ABD',
  orgn:'6A92BC',
  frms:'6ABC88',
  mdia:'BC6AA1',
  tble:'6AB6BC',
  attr:'BDB16A',
  othr:'818181',
},
blocks={
  blk:{label:'block',color:'mdia',type:'block'},
  attr:{label:'attr',color:'attr',type:'attr'},
  txt:{label:'',color:'txtb',type:'text'},
  cblk:{label:'c block',color:'text',type:'c'},
  empc:{label:'empty c',color:'orgn',type:'c'},
  PLACEHOLDER:{type:'PLACEHOLDER'},
};
function shadeColor(color,percent) { // http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
  var f=parseInt(color,16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return (0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
function loadPalette() {
  var str='';
  for (var block in blocks) {
    switch (blocks[block].type) {
      case 'block':
        str+="<li style='background-color:#"+colors[blocks[block].color]+"' data-tag='"+block+"'>"+blocks[block].label+"</li>";
        break;
      case 'attr':
        str+="<li class='attr' style='background-color:#"+colors[blocks[block].color]+"' data-tag='"+block+"'>"+blocks[block].label+" <input type='text'/></li>";
        break;
      case 'text':
        str+="<textarea class='text' style='background-color:#"+colors[blocks[block].color]+"' data-tag='"+block+"'></textarea>";
        break;
      case 'c':
        str+="<li class='c' style='border-left-color:#"+shadeColor(colors[blocks[block].color],-0.2)+"' data-tag='"+block+"'><span class='cstart' style='background-color:#"+colors[blocks[block].color]+"'>"+blocks[block].label+"</span><ul style='border-left-color:#"+colors[blocks[block].color]+"'></ul><span class='cend' style='background-color:#"+colors[blocks[block].color]+"'></span></li>";
        break;
    }
  }
  document.querySelector('#palette').innerHTML=str;
}
loadPalette();
function render(script,data) {
  var str='',data;
  if (data) data+='-'
  else data='';
  for (var i=0;i<script.length;i++) {
    switch (blocks[script[i].tag].type) {
      case 'PLACEHOLDER':
        str+="<li class='PLACEHOLDER' data-script='"+data+i+"'></li>";
        break;
      case 'block':
        str+="<li style='background-color:#"+colors[blocks[script[i].tag].color]+"' data-script='"+data+i+"'>"+blocks[script[i].tag].label+"</li>";
        break;
      case 'attr':
        str+="<li class='attr' style='background-color:#"+colors[blocks[script[i].tag].color]+"' data-script='"+data+i+"'>"+blocks[script[i].tag].label+" <input type='text' value='"+script[i].val+"'/></li>";
        break;
      case 'text':
        str+="<textarea class='text' style='background-color:#"+colors[blocks[script[i].tag].color]+"' data-script='"+data+i+"'>"+script[i].val+"</textarea>";
        break;
      case 'c':
        str+="<li class='c' style='border-left-color:#"+shadeColor(colors[blocks[script[i].tag].color],-0.2)+"' data-script='"+data+i+"'><span class='cstart' style='background-color:#"+colors[blocks[script[i].tag].color]+"'>"+blocks[script[i].tag].label+"</span><ul style='border-left-color:#"+colors[blocks[script[i].tag].color]+"'>";
        if (script[i].blocks.length>0) str+=render(script[i].blocks,data+i);
        str+="</ul><span class='cend";
        if (script[i].blocks.length===0) str+=' emptyCend';
        str+="' style='background-color:#"+colors[blocks[script[i].tag].color]+"'></span></li>";
        break;
    }
  }
  return str;
}
function renderAll() {
  var str='';
  for (var i=1;i<scripts.length;i++) {
    str+="<ul class='script' style='left:"+scripts[i][0][0]+"px;top:"+scripts[i][0][1]+"px;' data-script='"+i+"'>"+render(scripts[i].slice(1),i)+'</ul>'
  }
  document.querySelector('#scripts').innerHTML=str;
}
renderAll();
function fitVal(elm,textarea) {
  var textarea;
  var clone=document.createElement('span');
  clone.className='getTextLength';
  clone.innerHTML=elm.value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/(?:\r\n|\r|\n)/g,'<br/>');
  clone.style.font=document.defaultView.getComputedStyle(elm).font;
  document.body.appendChild(clone);
  elm.style.width=(clone.offsetWidth+5)+'px';
  if (textarea) elm.style.height=(clone.offsetHeight)+'px';
  document.body.removeChild(clone);
}
function fit(elm) {
  var elms=elm.querySelectorAll('.attr input');
  for (var i=0;i<elms.length;i++) {
    fitVal(elms[i]);
  }
  elms=elm.querySelectorAll('textarea.text');
  for (var i=0;i<elms.length;i++) {
    fitVal(elms[i],true);
  }
  elms=elm.querySelectorAll('.c');
  for (var i=0;i<elms.length;i++) {
    // elms[i].children[2].style.width=(elms[i].children[0].offsetWidth-12)+'px';
    if (elms[i].children[1].children.length===0) elms[i].children[2].className+=' emptyCend';
  }
}
fit(document);
document.querySelector('#palette').oninput=function(e){
  if (e.target.tagName=='INPUT') fitVal(e.target);
  if (e.target.tagName=='TEXTAREA') fitVal(e.target,true);
};
document.querySelector('#scripts').oninput=function(e){
  if (e.target.tagName=='INPUT') {
    fitVal(e.target);
    identify(e.target.parentNode.dataset.script).val=e.target.value;
  }
  if (e.target.tagName=='TEXTAREA') {
    fitVal(e.target,true);
    identify(e.target.dataset.script).val=e.target.value;
  }
};
function identify(scriptlevel,mode) {
  var mode;
  if (mode) {
    if (mode=='getThis') {
      scriptlevel=scriptlevel.map(x=>Number(x));
      if (scriptlevel.length<2) return scripts[scriptlevel[0]];
      var tempScript=scripts[scriptlevel[0]][scriptlevel[1]+1];
      for (var i=2;i<scriptlevel.length;i++) {
        tempScript=tempScript.blocks[scriptlevel[i]];
      }
      return tempScript;
    }
  } else {
    var levels=scriptlevel.split('-').map(x=>Number(x)),tempScript=scripts[levels[0]][levels[1]+1];
    if (levels.length<2) return scripts[levels[0]];
    for (var i=2;i<levels.length;i++) {
      tempScript=tempScript.blocks[levels[i]];
    }
    return tempScript;
  }
}
var drag={};
document.querySelector('#palette').onmousedown=function(e){
  if (e.target.id=='palette') return;
  else if (e.target.tagName=='INPUT'||e.target.tagName=='UL'||e.target.tagName=='SPAN') drag.targ=e.target.parentNode;
  else if (e.target.id!='scripts') drag.targ=e.target;
  if (drag.targ) {
    drag.type=blocks[drag.targ.dataset.tag].type;
    switch (drag.type) {
      case 'block':
        drag.script=[{tag:drag.targ.dataset.tag}];
        break;
      case 'attr':
        drag.script=[{tag:drag.targ.dataset.tag,val:drag.targ.querySelector('input').value}];
        break;
      case 'text':
        drag.script=[{tag:drag.targ.dataset.tag,val:drag.targ.value}];
        break;
      case 'c':
        drag.script=[{tag:drag.targ.dataset.tag,blocks:[]}];
        break;
    }
    drag.offsetMX=e.clientX-e.target.getBoundingClientRect().left;
    drag.offsetMY=e.clientY-e.target.getBoundingClientRect().top;
  }
};
document.querySelector('#scripts').onmousedown=function(e){
  if (e.target.className=='script') return;
  else if (e.target.tagName=='UL'||e.target.tagName=='SPAN') drag.targ=e.target.parentNode;
  else if (e.target.id!='scripts'&&e.target.tagName!='INPUT') drag.targ=e.target;
  if (drag.targ) {
    drag.script=[identify(drag.targ.dataset.script)];
    drag.levels=drag.targ.dataset.script.split('-').map(x=>Number(x));
    drag.type=blocks[drag.script[0].tag].type;

    if (drag.levels.length>2) drag.siblings=identify(drag.levels.slice(0,-1),'getThis').blocks;
    else drag.siblings=scripts[drag.levels[0]].slice(1);
    if (drag.type=='attr') {
      var i=drag.levels[drag.levels.length-1]+1;
      while (i<drag.siblings.length&&blocks[drag.siblings[i].tag].type=='attr') {
        drag.script.push(drag.siblings[i]);
        i++;
      }
    }
    else Array.prototype.push.apply(drag.script,drag.siblings.slice(drag.levels[drag.levels.length-1]+1));

    drag.offsetMX=e.clientX-e.target.getBoundingClientRect().left;
    drag.offsetMY=e.clientY-e.target.getBoundingClientRect().top;
  }
};
document.body.onmousemove=function(e){
  if (drag.targ) {
    // document.querySelector('.script[data-script="1"]')
    if (scripts[0].length<=1) {
      drag.officiallyDragging=true;
      Array.prototype.push.apply(scripts[0],drag.script);
      document.querySelector('#drag').innerHTML=render(scripts[0].slice(1));
      fit(document.querySelector('#drag'));
      if (drag.levels) {
        // remove script from original script
        if (drag.type=='attr') {
          if (drag.levels.length<=2) {
            var i=drag.levels[drag.levels.length-1]+1;
            while (i<scripts[drag.levels[0]].length&&blocks[scripts[drag.levels[0]][i].tag].type=='attr') {
              scripts[drag.levels[0]].splice(i,1);
            }
          } else {
            var i=drag.levels[drag.levels.length-1];
            while (i<drag.siblings.length&&blocks[drag.siblings[i].tag].type=='attr') {
              drag.siblings.splice(i,1);
            }
          }
        } else {
          if (drag.levels.length<=2) scripts[drag.levels[0]].splice(drag.levels[drag.levels.length-1]+1);
          else drag.siblings.splice(drag.levels[drag.levels.length-1]);
        }
        document.querySelector('.script[data-script="'+drag.levels[0]+'"]').innerHTML=render(scripts[drag.levels[0]].slice(1),drag.levels[0]);
        fit(document.querySelector('.script[data-script="'+drag.levels[0]+'"]'));
      }
      document.querySelector('#drag').style.width=document.querySelector('#drag').offsetWidth+'px';
    }
    document.querySelector('#drag').style.left=(e.clientX-drag.offsetMX)+'px';
    document.querySelector('#drag').style.top=(e.clientY-drag.offsetMY)+'px';
    document.querySelector('#drag').style.display='none';
    if (document.querySelector('.PLACEHOLDER')) {
      var all=document.querySelectorAll('.PLACEHOLDER');
      if (all.length>1) console.warn("THERE SHOULD ONLY BE ONE OF YOU.");
      for (var i=0;i<all.length;i++) {
        var levels=all[i].dataset.script.split('-').map(x=>Number(x));
        if (levels.length>2) identify(levels.slice(0,-1),'getThis').blocks.splice(levels[levels.length-1],1);
        else identify(levels.slice(0,-1),'getThis').splice(levels[levels.length-1]+1,1);
      }
      renderAll();
      fit(document);
    }
    var newarea=document.elementFromPoint(e.clientX,e.clientY);
    if (newarea&&newarea.id!='scripts'&&newarea.className!='script'&&!newarea.dataset.tag&&!newarea.parentNode.dataset.tag) {
      if (['UL','SPAN','INPUT'].includes(newarea.tagName)) newarea=newarea.parentNode;
      if (newarea.className=='PLACEHOLDER') console.warn("SHOULDN'T YOU BE GONE BY NOW?!");
      if (drag.type=='attr') {
        //
      } else {
        try {
          var newareaLevels=newarea.dataset.script.split('-').map(x=>Number(x)),
          newareaScript=identify(newareaLevels,'getThis'),
          newareaParent=identify(newareaLevels.slice(0,-1),'getThis');
          if (newareaLevels.length>2) newareaParent=newareaParent.blocks;
          if (newareaScript.blocks) {
            if (!document.querySelector('.PLACEHOLDER')) {
              newareaScript.blocks.push({tag:'PLACEHOLDER'});
            }
          } else {
            newareaLevels[newareaLevels.length-1]=newareaLevels[newareaLevels.length-1]+1;
            if (newareaLevels.length<=2) newareaLevels[newareaLevels.length-1]++;
            var nextBlock=newareaParent[newareaLevels[newareaLevels.length-1]];
            while (nextBlock&&blocks[nextBlock.tag].type=='attr') {
              newareaLevels[newareaLevels.length-1]++;
              nextBlock=newareaParent[newareaLevels[newareaLevels.length-1]];
            }
            newareaParent.splice(newareaLevels[newareaLevels.length-1],0,{tag:'PLACEHOLDER'});
          }
        } catch (e) {
          console.log(newarea);
          console.log(newareaLevels);
          console.log(newareaScript);
          console.log(newareaParent);
          console.log(e);
        }
      }
    }
    document.querySelector('#drag').style.display='block';
    renderAll();
    fit(document);
  }
};
document.body.onmouseup=function(e){
  if (drag.officiallyDragging) {
    if (document.querySelector('.PLACEHOLDER')) {
      var all=document.querySelectorAll('.PLACEHOLDER');
      for (var i=0;i<all.length;i++) {
        var levels=all[i].dataset.script.split('-').map(x=>Number(x)),blockz;
        if (levels.length>2) blockz=identify(levels.slice(0,-1),'getThis').blocks;
        else blockz=identify(levels.slice(0,-1),'getThis');
        blockz.splice(levels[levels.length-1]+1,1);
        for (var j=drag.script.length-1;j>=0;j--) blockz.splice(levels[levels.length-1]+1,0,drag.script[j]);
      }
    } else {
      drag.script.splice(0,0,[e.clientX-drag.offsetMX,e.clientY-drag.offsetMY]);
      scripts.push(drag.script);
    }
    renderAll();
    fit(document);
  }
  if (drag) {
    scripts[0]=[[0,0]];
    drag={};
    document.querySelector('#drag').innerHTML='';
    document.querySelector('#drag').style.width='auto';
  }
};
