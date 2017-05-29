class Script {
  constructor(parent=null,options={}) {
    this.wrapper=document.createElement("div");
    this.wrapper.classList.add('blocks');
    this.wrapper.classList.add('blocks-blockwrapper');
    if (parent) parent.appendChild(this.wrapper);
    this.children=[];
    this.x=options.x||0;
    this.y=options.y||0;
    this.isattr=!!options.attrscript;
    this.children=[];
    if (!options.dragger) Script.scripts.push(this);
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
  set parent(parent) {
    parent.appendChild(this.wrapper);
  }
  updateback() { // because blocks treat scripts like c blocks
    this.updateblockpos();
  }
  updateblockpos() {
    var innerheight=0,j=0;
    if (this.isattr) for (var i of this.children) i.x=innerheight,innerheight+=i.visualwidth,i.parent[1]=j,j++;
    else for (var i of this.children) i.y=innerheight,innerheight+=i.visualheight,i.parent[1]=j,j++;
  }
  addchild(block,index=-1) {
    if (block.type!=='attr'&&!this.isattr) {
      if (block.parent) block.parent[0].removechild(block);
      block.x=0;
      if (~index&&index<this.children.length) {
        this.children.splice(index,0,block);
        block.insertTo(this.wrapper,this.wrapper.children[index]);
        block.parent=[this,index];
      } else {
        this.children.push(block);
        block.appendTo(this.wrapper);
        block.parent=[this,this.children.length-1];
      }
      this.updateblockpos();
    } else if (block.type==='attr'&&this.isattr) {
      if (block.parent) block.parent[0] instanceof Script?block.parent[0].removechild(block):block.parent[0].removeattr(block);
      block.x=0;
      if (~index) {
        this.children.splice(index,0,block);
        block.insertTo(this.wrapper,this.wrapper.children[index]);
        block.parent=[this,index];
      } else {
        this.children.push(block);
        block.appendTo(this.wrapper);
        block.parent=[this,this.children.length-1];
      }
      this.updateblockpos();
    }
  }
  removechild(block) {
    this.wrapper.removeChild(this.children[block.parent[1]].wrapper);
    this.children.splice(block.parent[1],1);
    for (var i=block.parent[1];i<this.children.length;i++) this.children[i].parent[1]=i;
    this.updateblockpos();
    block.parent='';
    if (!this.children.length) {
      this.wrapper.parentNode.removeChild(this.wrapper);
      for (var span in this) this[span]=null;
      this.dead=true;
      for (var i=0;i<Script.scripts.length;i++) if (Script.scripts[i]===this) {
        Script.scripts.splice(i,1);
        break;
      }
    }
  }
  get hitboxes() {
    var hitboxes=[],
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
    height=this.y+this.visualheight;
    for (var i of this.children) hitboxes.push(...i.hitboxes);
    hitboxes.push(new Hitbox(this.x-15,this.y,this.x+this.children[0].visualwidth,this.y-30,[this.x,this.y,false,this.visualheight],blocks=>{
      insertblocks(blocks,this,0);
    }));
    hitboxes.push(new Hitbox(this.x-15,height,this.x+this.children[this.children.length-1].visualwidth,height+30,[this.x,height,true],blocks=>{
      insertblocks(blocks,this);
    }));
    return hitboxes;
  }
  get attrhitboxes() {
    var hitboxes=[];
    for (var i of this.children) hitboxes.push(...i.attrhitboxes);
    return hitboxes;
  }
  get visualheight() {
    return this.children[this.children.length-1].y+this.children[this.children.length-1].visualheight;
  }
}
class Drag extends Script {
  constructor(parent,attrdrag=false) {
    super(parent,{attrscript:attrdrag,dragger:true});
    this.wrapper.classList.add('blocks-dragger');
    if (!attrdrag) Script.dragger=this;
    this.preview=document.createElement("div");
    this.preview.classList.add('blocks');
    this.preview.classList.add('blocks-movepreview');
    this.preview.style.display='none';
    document.body.appendChild(this.preview);
    document.addEventListener("mousemove",e=>{
      if (this.d) {
        if (!this.d.down) {
          this.d.down=true;
          this.d.hitboxes=[];
          if (attrdrag) {
            for (var i=Script.scripts.length-1;i>=0;i--) this.d.hitboxes.push(...Script.scripts[i].attrhitboxes);
          } else {
            this.preview.style.width=this.children[0].visualwidth+'px';
            for (var i=Script.scripts.length-1;i>=0;i--) this.d.hitboxes.push(...Script.scripts[i].hitboxes);
          }
        }
        this.x=e.clientX-this.d.x;
        this.y=e.clientY-this.d.y;
        if (attrdrag) {
          var t=true;
          for (var i of this.d.hitboxes) if (i.pointinhitbox(this.x,this.y)) {
            t=false;
            this.preview.style.display='block';
            this.preview.style.left=i.preview[0]+'px';
            this.preview.style.top=i.preview[1]+'px';
            break;
          }
          if (t) this.preview.style.display='none';
        } else {
          var t=true;
          for (var i of this.d.hitboxes) if (i.pointinhitbox(this.x,this.y)) {
            t=false;
            this.preview.style.display='block';
            this.preview.style.left=i.preview[0]+'px';
            this.preview.style.top=i.preview[1]+'px';
            if (this.children[0].type==='c'&&this.children[0].children.length===0) {
              if (i.preview[2]) {
                this.preview.classList.remove('blocks-cblockpreview');
                this.preview.style.height='1px';
                this.children[0].updateback();
              } else {
                this.preview.classList.add('blocks-cblockpreview');
                this.preview.style.height=i.preview[3]+'px';
                this.children[0].updateback(i.preview[3]);
              }
            }
            break;
          }
          if (t) this.preview.style.display='none';
        }
      }
    },false);
    document.addEventListener("mouseup",e=>{
      if (this.d) {
        if (!this.d.down) {
          this.d.down=true;
          this.d.hitboxes=[];
          if (attrdrag) {
            for (var i=Script.scripts.length-1;i>=0;i--) this.d.hitboxes.push(...Script.scripts[i].attrhitboxes);
          } else {
            this.preview.style.width=this.children[0].visualwidth+'px';
            for (var i=Script.scripts.length-1;i>=0;i--) this.d.hitboxes.push(...Script.scripts[i].hitboxes);
          }
        }
        this.x=e.clientX-this.d.x;
        this.y=e.clientY-this.d.y;
        if (attrdrag) {
          var t=true;
          for (var i of this.d.hitboxes) if (i.pointinhitbox(this.x,this.y)) {
            t=false;
            i.hit(this.children);
            break;
          }
          if (t) {
            var newscript=new Script(this.wrapper.parentNode,{x:0,y:0,attrscript:true});
            newscript.x=this.x-newscript.wrapper.getBoundingClientRect().left;
            newscript.y=this.y-newscript.wrapper.getBoundingClientRect().top;
            while (this.children.length) {
              this.children[0].moving=false;
              newscript.addchild(this.children[0]);
            }
          }
        } else {
          var t=true;
          for (var i of this.d.hitboxes) if (i.pointinhitbox(this.x,this.y)) {
            t=false;
            i.hit(this.children);
            break;
          }
          if (t) {
            var newscript=new Script(this.wrapper.parentNode,{x:0,y:0});
            newscript.x=this.x-newscript.wrapper.getBoundingClientRect().left;
            newscript.y=this.y-newscript.wrapper.getBoundingClientRect().top;
            while (this.children.length) {
              this.children[0].moving=false;
              newscript.addchild(this.children[0]);
            }
          }
          this.preview.classList.remove('blocks-cblockpreview');
          this.preview.style.height='1px';
        }
        this.preview.style.display='none';
        this.d=false;
      }
    },false);
  }
  removechild(block) {
    this.wrapper.removeChild(this.wrapper.children[block.parent[1]]);
    this.children.splice(block.parent[1],1);
    for (var i=block.parent[1];i<this.children.length;i++) this.children[i].parent[1]=i;
    this.updateblockpos();
    block.parent='';
  }
}
class AttrDrag extends Drag {
  constructor(parent) {
    super(parent,true);
    Script.attrdragger=this;
    this.preview.style.height='30px';
  }
}
Script.scripts=[];
