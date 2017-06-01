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
    this.undeletable=!!options.dontdelete;
    this.options=options;
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
        this.textdisplay.innerHTML=Block.addEntities(label+'\u200b');
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
    var mousedown=(e,istouch)=>{
      if (!this.moving&&(e.which===1||e.which===0)) {
        var mouse;
        if (istouch) mouse={initX:e.touches[0].clientX,initY:e.touches[0].clientY};
        else mouse={initX:e.clientX,initY:e.clientY};
        var mousemove=e=>{
          if (!this.moving&&Math.abs(mouse.initX-(istouch?e.touches[0].clientX:e.clientX))>1&&Math.abs(mouse.initY-(istouch?e.touches[0].clientY:e.clientY))>1) {
            this.moving=true;
            var t=this.parent?this.parent:false;
            if (this.type==='attr') {
              Script.attrdragger.d={x:mouse.initX-this.back.getBoundingClientRect().left,y:mouse.initY-this.back.getBoundingClientRect().top};
              Script.attrdragger.x=this.back.getBoundingClientRect().left;
              Script.attrdragger.y=this.back.getBoundingClientRect().top;
              if (options.copy) {
                options.copy=false;
                var t=new Block(type,label,Object.assign({},options));
                t.input.value=this.input.value;
                t.moving=true;
                Script.attrdragger.addchild(t);
                options.copy=true;
              } else {
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
              }
            } else {
              Script.dragger.d={x:mouse.initX-this.back.getBoundingClientRect().left,y:mouse.initY-this.back.getBoundingClientRect().top};
              Script.dragger.x=this.back.getBoundingClientRect().left;
              Script.dragger.y=this.back.getBoundingClientRect().top;
              if (options.copy) {
                options.copy=false;
                var t=new Block(type,label,Object.assign({},options));
                t.moving=true;
                if (type==='text') t.textbox.value=this.textbox.value,t.textdisplay.innerHTML=Block.addEntities((t.textbox.value||'')+'\b');
                Script.dragger.addchild(t);
                options.copy=true;
              } else {
                Script.dragger.addchild(this);
                if (t) for (var i=t[1];t[0].children&&i<t[0].children.length;) {
                  t[0].children[i].moving=true;
                  Script.dragger.addchild(t[0].children[i]);
                }
              }
            }
          }
          e.preventDefault();
        },mouseup=e=>{
          if (!this.moving) this.focus();
          if (istouch) {
            document.removeEventListener("touchmove",mousemove,{passive:false});
            document.removeEventListener("touchend",mouseup,{passive:false});
          } else {
            document.removeEventListener("mousemove",mousemove,false);
            document.removeEventListener("mouseup",mouseup,false);
          }
          if (options.copy) this.moving=false;
        };
        if (istouch) {
          document.addEventListener("touchmove",mousemove,{passive:false});
          document.addEventListener("touchend",mouseup,{passive:false});
        } else {
          document.addEventListener("mousemove",mousemove,false);
          document.addEventListener("mouseup",mouseup,false);
        }
      }
      e.preventDefault();
    };
    this.back.addEventListener("touchstart",e=>mousedown(e,true),{passive:false});
    this.back.addEventListener("mousedown",e=>mousedown(e,false),false);
    this.x=options.x||0;
    this.y=options.y||0;
  }
  get x() {return this._x;}
  set x(x) {
    this._x=x;
    this.wrapper.style.transform=`translate(${this._x}px,${this._y}px)`;
  }
  get y() {return this._y;}
  set y(y) {
    this._y=y;
    this.wrapper.style.transform=`translate(${this._x}px,${this._y}px)`;
  }
  get visualwidth() {
    if (this.type==='c') return this.back.clientWidth;
    else return this.back.clientWidth+4;
  }
  get visualheight() {
    if (this.type==='c') return this.back.clientHeight;
    else return this.back.clientHeight+4;
  }
  updateback(dummyinnerheight=false) {
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
        if (this.children.length===0&&!dummyinnerheight) {
          this.back.setAttributeNS(null,'height',30);
          this.backpath.setAttributeNS(null,'d',`M0 0H${this.label.clientWidth+14}V30H0z`);
        } else {
          var innerheight=0,j=0;
          if (dummyinnerheight) innerheight=dummyinnerheight;
          else for (var i of this.children) i.y=innerheight,innerheight+=i.visualheight,i.parent[1]=j,j++;
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
        this.textdisplay.innerHTML=Block.addEntities(this.textbox.value+'\u200b');
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
        this.textdisplay.innerHTML=Block.addEntities(this.input.value+'\u200b');
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
      if (block.parent) block.parent[0] instanceof Script?block.parent[0].removechild(block):block.parent[0].removeattr(block);
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
          for (var i=index;to.children&&i<to.children.length;) blocks[0].addchild(to.children[i]);
        if (to.children) {
          if (index===0&&to instanceof Script) t=to.visualheight;
          else if (!~index) index=to.children.length;
          for (var i=blocks.length-1;i>=0;i--) {
            blocks[i].moving=false;
            to.addchild(blocks[i],index);
          }
          if (index===0&&to instanceof Script) to.y-=to.visualheight-t;
        } else {
          t=new Script(t[0],{x:t[1],y:t[2]});
          for (var i=0;i<blocks.length;i++) {
            blocks[i].moving=false;
            t.addchild(blocks[i]);
          }
          if (index===0&&to instanceof Script) t.x-=15,t.y-=30;
        }
      },
      otherinfo=[
        this.parent[1]===this.parent[0].children.length-1, // last child?
        this.parent[0] instanceof Script? // how high?
          this.parent[0].children[this.parent[0].children.length-1].y+this.parent[0].children[this.parent[0].children.length-1].visualheight-this.y-this.visualheight:
          this.parent[0].visualheight-this.y-this.visualheight-50
      ],
      beforeheight=[false,otherinfo[1]+this.visualheight];
      switch (this.type) {
        case 'stack':
        case 'text':
          hitboxes.push(new Hitbox(back.left-15,back.top,back.left+back.width,back.top+back.height/2,[back.left,back.top,...beforeheight],blocks=>insertblocks(blocks,this.parent[0],this.parent[1])));
          hitboxes.push(new Hitbox(back.left-15,back.top+back.height,back.left+back.width,back.top+back.height/2,[back.left,back.top+back.height,...otherinfo],blocks=>insertblocks(blocks,this.parent[0],this.parent[1]+1)));
          break;
        case 'c':
          if (this.children.length) {
            for (var i of this.children) hitboxes.push(...i.hitboxes);
            hitboxes.push(new Hitbox(back.left-15,back.top,back.left+back.width,back.top+15,[back.left,back.top,...beforeheight],blocks=>insertblocks(blocks,this.parent[0],this.parent[1])));
            hitboxes.push(new Hitbox(back.left-15,back.top+30,back.left+back.width,back.top+15,[back.left+15,back.top+30,false,back.height-50],blocks=>insertblocks(blocks,this,0)));
            hitboxes.push(new Hitbox(back.left-15,back.top+back.height-20,back.left+back.width,back.top+back.height-10,[back.left+15,back.top+back.height-20,true],blocks=>insertblocks(blocks,this)));
            hitboxes.push(new Hitbox(back.left-15,back.top+back.height,back.left+back.width,back.top+back.height-10,[back.left,back.top+back.height,...otherinfo],blocks=>insertblocks(blocks,this.parent[0],this.parent[1]+1)));
          } else {
            hitboxes.push(new Hitbox(back.left-15,back.top,back.left+back.width,back.top+back.height/3,[back.left,back.top,...beforeheight],blocks=>insertblocks(blocks,this.parent[0],this.parent[1])));
            hitboxes.push(new Hitbox(back.left-15,back.top+back.height,back.left+back.width,back.top+back.height/1.5,[back.left,back.top+back.height,...otherinfo],blocks=>insertblocks(blocks,this.parent[0],this.parent[1]+1)));
            hitboxes.push(new Hitbox(back.left-15,back.top+back.height/1.5,back.left+back.width,back.top+back.height/3,[back.left+15,back.top+back.height/2,true],blocks=>insertblocks(blocks,this)));
          }
          break;
      }
      return hitboxes;
    } else return [];
  }
  get attrhitboxes() {
    if (this.parent||this.type!=='text') {
      var hitboxes=[],
      back=this.back.getBoundingClientRect();
      switch (this.type) {
        case 'c':
          for (var i of this.children) hitboxes.push(...i.attrhitboxes);
        case 'stack':
          for (var i=this.attrs.length-1;i>=0;i--) hitboxes.push(...this.attrs[i].attrhitboxes);
          hitboxes.push(new Hitbox(back.left+back.width/2,back.top,back.left+back.width*1.5,back.top+30,[back.left+back.width,back.top],attrs=>{
            for (var i=attrs.length-1;i>=0;i--) {
              attrs[i].moving=false;
              this.addattr(attrs[i],0);
            }
          }));
          break;
        case 'attr':
          hitboxes.push(new Hitbox(back.left+back.width/2,back.top,back.left+back.width*1.5,back.top+30,[back.left+back.width,back.top],attrs=>{
            if (this.parent[0] instanceof Script) for (var i=attrs.length-1;i>=0;i--) {
              attrs[i].moving=false;
              this.parent[0].addchild(attrs[i],this.parent[1]+1);
            }
            else for (var i=attrs.length-1;i>=0;i--) {
              attrs[i].moving=false;
              this.parent[0].addattr(attrs[i],this.parent[1]+1);
            }
          }));
          break;
      }
      return hitboxes;
    } else return [];
  }
  get json() {
    switch (this.type) {
      case 'text':
        return ['__TEXT__',this.textbox.value];
      case 'attr':
        return [this.label.textContent,this.input.value];
      case 'stack':
        var r=[];
        for (var i of this.attrs) r.push(i.json);
        return [this.label.textContent,r];
      case 'c':
      var r=[],t=[];
      for (var i of this.attrs) r.push(i.json);
      for (var i of this.children) t.push(i.json);
      return [this.label.textContent,r,t];
    }
  }
  get killable() {
    switch (this.type) {
      case 'text':
      case 'attr':
        return !this.undeletable;
      case 'stack':
        if (this.undeletable) return false;
        for (var i of this.attrs) if (!i.killable) return false;
        return true;
      case 'c':
        if (this.undeletable) return false;
        for (var i of this.attrs) if (!i.killable) return false;
        for (var i of this.children) if (!i.killable) return false;
        return true;
    }
  }
  doYouOwnThisBack(backelem) { // "Do you own this back?" the block's parent asked.
    if (this.type!=='c') { // Most blocks said the same thing.
      if (this.back!==backelem) { // When their backs didn't match
        if (this.back==='stack') { // the stack blocks
          var t; // would first
          for (var i of this.attrs) if (t=i.doYouOwnThisBack(backelem)) return t; // ask the same question to each of its attributes.
          return false; // But in the end, they would still return false;
        } else return false; // The other blocks were more straightforwards with their no's.
      } else return this; // But when the blocks matched, they would happily turn themselves in for recognition.
    } else { // When the C blocks were asked the question,
      if (this.back!==backelem&&this.backpath!==backelem) { // they would check both their back and the path making their back.
        var t; // Like the stack blocks,
        for (var i of this.attrs) if (t=i.doYouOwnThisBack(backelem)) return t; // the C blocks asked their attributes,
        for (var i of this.children) if (t=i.doYouOwnThisBack(backelem)) return t; // but they also asked the blocks they held in their mouth.
        return false; // Yet in the end, they'd still find nothing.
      } else return this; // But the C blocks would do the same thing as the other blocks when their backs matched.
    }
  }
  get copy() {
    switch (this.type) {
      case 'text':
        var t=new Block('text',this.textbox.value,Object.assign({},this.options,{x:this.x,y:this.y}));
        t.parent='';
        return t;
      case 'attr':
        var t=new Block('attr',this.label.textContent,Object.assign({},this.options,{x:this.x,y:this.y}));
        t.input.value=this.input.value;
        t.parent='';
        return t;
      case 'stack':
        var t=new Block('stack',this.label.textContent,Object.assign({},this.options,{x:this.x,y:this.y}));
        for (var i of this.attrs) t.addattr(i.copy);
        t.parent='';
        return t;
      case 'c':
        var t=new Block('c',this.label.textContent,Object.assign({},this.options,{x:this.x,y:this.y}));
        for (var i of this.attrs) t.addattr(i.copy);
        for (var i of this.children) t.addchild(i.copy);
        t.parent='';
        return t;
    }
  }
}
