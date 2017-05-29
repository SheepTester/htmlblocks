class Hitbox {
  constructor(x1,y1,x2,y2,previewCoords,hitfunc) {
    this.coords=[Math.min(x1,x2),Math.min(y1,y2),Math.max(x1,x2),Math.max(y1,y2)];
    this.preview=previewCoords;
    this.hit=hitfunc;
    this.div=document.createElement("div");
    this.div.classList.add('blocks');
    this.div.classList.add('blocks-hitboxshow');
    this.div.style.left=this.coords[0]+'px';
    this.div.style.top=this.coords[1]+'px';
    this.div.style.width=(this.coords[2]-this.coords[0])+'px';
    this.div.style.height=(this.coords[3]-this.coords[1])+'px';
  }
  pointinhitbox(x,y) {
    return this.coords[0]<=x&&this.coords[2]>=x&&this.coords[1]<=y&&this.coords[3]>=y;
  }
  set show(x) {
    if (x) {
      document.body.appendChild(this.div);
    } else {
      document.body.removeChild(this.div);
    }
  }
}
class Block {
  constructor(type='stack',label='',options={}) {
    this.wrapper=document.createElement("div");
    this.wrapper.classList.add('blocks');
    this.wrapper.classList.add('blocks-blockwrapper');
    this.type=type.toLowerCase();
    switch (this.type) {
      case 'text':
        this.back=document.createElement("div");
        this.back.classList.add('blocks');
        this.back.classList.add('blocks-stackback');
        this.back.style.backgroundColor='#333';
        this.textbox=document.createElement("textarea");
        this.textbox.classList.add('blocks');
        this.textbox.classList.add('blocks-textbox');
        this.textbox.style.top='7px';
        this.textbox.style.left='7px';
        this.textbox.value=label;
        this.textbox.style.display='none';
        this.textdisplay=document.createElement("span");
        this.textdisplay.classList.add('blocks');
        this.textdisplay.classList.add('blocks-label');
        this.textdisplay.innerHTML=Block.addEntities(label+'\b');
        this.textdisplay.style.top='7px';
        this.textdisplay.style.left='7px';
        this.wrapper.appendChild(this.back);
        this.wrapper.appendChild(this.textbox);
        this.wrapper.appendChild(this.textdisplay);
        break;
      case 'c':
        this.back=document.createElementNS('http://www.w3.org/2000/svg',"svg");
        this.back.classList.add('blocks');
        this.back.classList.add('blocks-cback');
        this.back.setAttributeNS(null,'fill',options.colour||'#fff');
        this.backpath=document.createElementNS('http://www.w3.org/2000/svg',"path");
        this.label=document.createElement("span");
        this.label.classList.add('blocks');
        this.label.classList.add('blocks-label');
        this.label.innerHTML=Block.addEntities(label);
        this.label.style.top='7px';
        this.label.style.left='7px';
        this.childrenwrapper=document.createElement("div");
        this.childrenwrapper.classList.add('blocks');
        this.childrenwrapper.style.top='30px';
        this.childrenwrapper.style.left='15px';
        this.attrwrapper=document.createElement("div");
        this.attrwrapper.classList.add('blocks');
        this.attrwrapper.style.top='0';
        this.back.appendChild(this.backpath);
        this.wrapper.appendChild(this.back);
        this.wrapper.appendChild(this.label);
        this.wrapper.appendChild(this.childrenwrapper);
        this.wrapper.appendChild(this.attrwrapper);
        this.children=[];
        this.attrs=[];
        break;
      case 'attr':
        this.back=document.createElement("div");
        this.back.classList.add('blocks');
        this.back.classList.add('blocks-stackback');
        this.back.style.height='30px';
        this.back.style.backgroundColor=options.colour||'#fff';
        this.label=document.createElement("span");
        this.label.classList.add('blocks');
        this.label.classList.add('blocks-label');
        this.label.innerHTML=Block.addEntities(label);
        this.label.style.top='7px';
        this.label.style.left='7px';
        this.textdisplay=document.createElement("span");
        this.textdisplay.classList.add('blocks');
        this.textdisplay.classList.add('blocks-input');
        this.textdisplay.innerHTML=Block.addEntities((options.value||'')+'\b');
        this.textdisplay.style.top='7px';
        this.input=document.createElement("input");
        this.input.classList.add('blocks');
        this.input.classList.add('blocks-input');
        this.input.value=options.value||'';
        this.input.style.top='7px';
        this.input.style.display='none';
        this.wrapper.appendChild(this.back);
        this.wrapper.appendChild(this.label);
        this.wrapper.appendChild(this.textdisplay);
        this.wrapper.appendChild(this.input);
        break;
      default:
        this.type='stack';
        this.back=document.createElement("div");
        this.back.classList.add('blocks');
        this.back.classList.add('blocks-stackback');
        this.back.style.height='30px';
        this.back.style.backgroundColor=options.colour||'#fff';
        this.label=document.createElement("span");
        this.label.classList.add('blocks');
        this.label.classList.add('blocks-label');
        this.label.innerHTML=Block.addEntities(label);
        this.label.style.top='7px';
        this.label.style.left='7px';
        this.attrwrapper=document.createElement("div");
        this.attrwrapper.classList.add('blocks');
        this.attrwrapper.style.top='0';
        this.wrapper.appendChild(this.back);
        this.wrapper.appendChild(this.label);
        this.wrapper.appendChild(this.attrwrapper);
        this.attrs=[];
    }
    this.back.addEventListener("mousedown",e=>{
      if (!this.moving) {
        var mouse={initX:e.clientX,initY:e.clientY};
        var mousemove=e=>{
          if (!this.moving&&Math.abs(mouse.initX-e.clientX)<3&&Math.abs(mouse.initY-e.clientY)<3) {
            this.moving=true;
            var t=this.parent?this.parent:false;
            if (this.type==='attr') {
              Script.attrdragger.d={x:e.clientX-this.back.getBoundingClientRect().left,y:e.clientY-this.back.getBoundingClientRect().top};
              Script.attrdragger.addchild(this);
              if (t) {
                if (t[0].attrs) {
                  for (var i=t[1];t[0].attrs&&i<t[0].attrs.length;) {
                    t[0].attrs[i].moving=true;
                    Script.attrdragger.addchild(t[0].attrs[i]);
                  }
                } else {
                  for (var i=t[1];t[0].children&&i<t[0].children.length;) {
                    t[0].children[i].moving=true;
                    Script.attrdragger.addchild(t[0].children[i]);
                  }
                }
              }
            } else {
              Script.dragger.d={x:e.clientX-this.back.getBoundingClientRect().left,y:e.clientY-this.back.getBoundingClientRect().top};
              Script.dragger.addchild(this);
              if (t) for (var i=t[1];t[0].children&&i<t[0].children.length;) {
                t[0].children[i].moving=true;
                Script.dragger.addchild(t[0].children[i]);
              }
            }
          }
        },mouseup=e=>{
          if (!this.moving) this.focus();
          this.back.removeEventListener("mousemove",mousemove,false);
          this.back.removeEventListener("mouseup",mouseup,false);
        };
        this.back.addEventListener("mousemove",mousemove,false);
        this.back.addEventListener("mouseup",mouseup,false);
      }
    },false);
    this.x=options.x||0;
    this.y=options.y||0;
  }
  get x() {return this._x;}
  set x(x) {
    this._x=x;
    this.wrapper.style.left=this._x+'px';
  }
  get y() {return this._y;}
  set y(y) {
    this._y=y;
    this.wrapper.style.top=this._y+'px';
  }
  get visualwidth() {
    if (this.type==='c') return this.back.clientWidth;
    else return this.back.clientWidth+4;
  }
  get visualheight() {
    if (this.type==='c') return this.back.clientHeight;
    else return this.back.clientHeight+4;
  }
  updateback() {
    switch (this.type) {
      case 'stack':
        this.back.style.width=(this.label.clientWidth+14)+'px';
        this.attrwrapper.style.left=(this.label.clientWidth+14)+'px';
        break;
      case 'text':
        this.back.style.width=(this.textdisplay.clientWidth+14)+'px';
        this.back.style.height=(this.textdisplay.clientHeight+14)+'px';
        this.textbox.style.width=(this.textdisplay.clientWidth+3)+'px';
        this.textbox.style.height=(this.textdisplay.clientHeight+3)+'px';
        break;
      case 'c':
        this.back.setAttributeNS(null,'width',this.label.clientWidth+14);
        this.attrwrapper.style.left=(this.label.clientWidth+14)+'px';
        if (this.children.length===0) {
          this.back.setAttributeNS(null,'height',30);
          this.backpath.setAttributeNS(null,'d',`M0 0H${this.label.clientWidth+14}V30H0z`);
        } else {
          var innerheight=0,j=0;
          for (var i of this.children) i.y=innerheight,innerheight+=i.visualheight,i.parent[1]=j,j++;
          this.back.setAttributeNS(null,'height',this.label.clientHeight+34+innerheight);
          this.backpath.setAttributeNS(null,'d',`M0 0H${this.label.clientWidth+14}V30H15v${innerheight}H${this.label.clientWidth+14}v20H0z`);
        }
        break;
      case 'attr':
        this.back.style.width=(this.label.clientWidth+this.textdisplay.clientWidth+21)+'px';
        this.input.style.width=(this.textdisplay.clientWidth+3)+'px';
        this.input.style.left=(this.label.clientWidth+14)+'px';
        this.textdisplay.style.left=(this.label.clientWidth+14)+'px';
        break;
    }
    if (this.parent) this.parent[0].updateback();
    if (this.type==='c'||this.type==='stack') {
      var innerwidth=0;
      for (var i of this.attrs) i.x=innerwidth,innerwidth+=i.visualwidth;
    }
  }
  appendTo(elem) {
    elem.appendChild(this.wrapper);
    this.updateback();
  }
  insertTo(elem,index) {
    elem.insertBefore(this.wrapper,elem.children[index]);
    this.updateback();
  }
  focus() {
    if (this.type==='text') {
      this.textdisplay.style.opacity='0';
      this.textbox.style.display='block';
      this.textbox.focus();
      var oninput=()=>{
        this.textdisplay.innerHTML=Block.addEntities(this.textbox.value+'\b');
        this.updateback();
      },onblur=()=>{
        this.textbox.removeEventListener("input",oninput,false);
        this.textbox.removeEventListener("blur",onblur,false);
        this.textdisplay.style.opacity='1';
        this.textbox.style.display='none';
        this.textbox.blur();
      };
      this.textbox.addEventListener("input",oninput,false);
      this.textbox.addEventListener("blur",onblur,false);
    } else if (this.type==='attr') {
      this.textdisplay.classList.add('focused');
      this.input.style.display='block';
      this.input.focus();
      var oninput=()=>{
        this.textdisplay.innerHTML=Block.addEntities(this.input.value+'\b');
        this.updateback();
      },onblur=()=>{
        this.input.removeEventListener("input",oninput,false);
        this.input.removeEventListener("blur",onblur,false);
        this.textdisplay.classList.remove('focused');
        this.input.style.display='none';
        this.input.blur();
      };
      this.input.addEventListener("input",oninput,false);
      this.input.addEventListener("blur",onblur,false);
    }
  }
  addchild(block,index=-1) {
    if (this.type==='c'&&block.type!=='attr') {
      if (block.parent) block.parent[0].removechild(block);
      block.x=0;
      if (~index&&index<this.children.length) {
        this.children.splice(index,0,block);
        block.insertTo(this.childrenwrapper,this.childrenwrapper.children[index]);
        block.parent=[this,index];
      } else {
        this.children.push(block);
        block.appendTo(this.childrenwrapper);
        block.parent=[this,this.children.length-1];
      }
      this.updateback();
    }
  }
  removechild(block) {
    if (this.type==='c') {
      this.childrenwrapper.removeChild(this.children[block.parent[1]].wrapper);
      this.children.splice(block.parent[1],1);
      for (var i=block.parent[1];i<this.children.length;i++) this.children[i].parent[1]=i;
      this.updateback();
      block.parent='';
    }
  }
  addattr(block,index=-1) {
    if ((this.type==='c'||this.type==='stack')&&block.type==='attr') {
      if (block.parent) block.parent[0].removeattr(block);
      block.y=0;
      if (~index&&this.attrs.length<index) {
        this.attrs.splice(index,0,block);
        block.insertTo(this.attrwrapper,this.attrwrapper.children[index]);
        block.parent=[this,index];
      } else {
        this.attrs.push(block);
        block.appendTo(this.attrwrapper);
        block.parent=[this,this.attrs.length-1];
      }
      this.updateback();
    }
  }
  removeattr(block) {
    if ((this.type==='c'||this.type==='stack')&&block.type==='attr') {
      this.attrwrapper.removeChild(this.attrs[block.parent[1]].wrapper);
      this.attrs.splice(block.parent[1],1);
      for (var i=block.parent[1];i<this.attrs.length;i++) this.attrs[i].parent[1]=i;
      this.updateback();
      block.parent='';
    }
  }
  static addEntities(str) {
    return str.replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  get hitboxes() {
    if (this.parent) {
      var hitboxes=[],
      back=this.back.getBoundingClientRect(),
      insertblocks=(blocks,to,index=-1)=>{
        var t=[to.wrapper.parentNode,to.x,to.y];
        if (blocks[0].type==='c'&&blocks[0].children.length===0&&~index)
          for (var i=index;to.children&&i<to.children.length;) blocks[0].addchild(to.children[i],index);
        if (to.children) for (var i=blocks.length-1;i>=0;i--) {
          blocks[i].moving=false;
          to.addchild(blocks[i],index);
        } else {
          t=new Script(t[0],{x:t[1],y:t[2]});
          for (var i=0;i<blocks.length;i++) {
            blocks[i].moving=false;
            t.addchild(blocks[i]);
          }
        }
      },
      otherinfo=[
        this.parent[1]===this.parent[0].children.length, // last child?
        this.parent[0] instanceof Script? // how high?
          this.parent[0].children[this.parent[0].children.length-1].y+this.parent[0].children[this.parent[0].children.length-1].visualheight-this.y:
          this.parent[0].visualheight-this.y-20
      ];
      switch (this.type) {
        case 'stack':
        case 'text':
          hitboxes.push(new Hitbox(back.left-15,back.top,back.left+back.width,back.top+back.height/2,[back.left,back.top,...otherinfo],blocks=>insertblocks(blocks,this.parent[0],this.parent[1])));
          hitboxes.push(new Hitbox(back.left-15,back.top+back.height,back.left+back.width,back.top+back.height/2,[back.left,back.top+back.height,...otherinfo],blocks=>insertblocks(blocks,this.parent[0],this.parent[1]+1)));
          break;
        case 'c':
          if (this.children.length) {
            for (var i of this.children) hitboxes.push(...i.hitboxes);
            hitboxes.push(new Hitbox(back.left-15,back.top,back.left+back.width,back.top+15,[back.left,back.top,...otherinfo],blocks=>insertblocks(blocks,this.parent[0],this.parent[1])));
            hitboxes.push(new Hitbox(back.left-15,back.top+30,back.left+back.width,back.top+15,[back.left+15,back.top+30,...otherinfo],blocks=>insertblocks(blocks,this,0)));
            hitboxes.push(new Hitbox(back.left-15,back.top+back.height-20,back.left+back.width,back.top+back.height-10,[back.left+15,back.top+back.height-20,...otherinfo],blocks=>insertblocks(blocks,this)));
            hitboxes.push(new Hitbox(back.left-15,back.top+back.height,back.left+back.width,back.top+back.height-10,[back.left,back.top+back.height,...otherinfo],blocks=>insertblocks(blocks,this.parent[0],this.parent[1]+1)));
          } else {
            hitboxes.push(new Hitbox(back.left-15,back.top,back.left+back.width,back.top+back.height/3,[back.left,back.top,...otherinfo],blocks=>insertblocks(blocks,this.parent[0],this.parent[1])));
            hitboxes.push(new Hitbox(back.left-15,back.top+back.height,back.left+back.width,back.top+back.height/1.5,[back.left,back.top+back.height,...otherinfo],blocks=>insertblocks(blocks,this.parent[0],this.parent[1]+1)));
            hitboxes.push(new Hitbox(back.left-15,back.top+back.height/1.5,back.left+back.width,back.top+back.height/3,[back.left+15,back.top+back.height/2,...otherinfo],blocks=>insertblocks(blocks,this)));
          }
          break;
      }
      return hitboxes;
    } else return [];
  }
}
