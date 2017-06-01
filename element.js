class Section { // requires Section.categories and Section.blocklist to be defined
  constructor(label,colour,blocklist) {
    this.li=document.createElement("input");
    this.li.dataset.label=label;
    this.li.style.borderLeftColor=colour;
    this.li.name='categories';
    this.li.type='radio';
    Section.categories.appendChild(this.li);
    this.h1=document.createElement("h1");
    this.h1.appendChild(document.createTextNode(label));
    this.h1.style.color=colour;
    Section.blocklist.insertBefore(this.h1,Section.blocklist.lastChild);
    this.blocks=[];
    if (typeof blocklist==='string') blocklist=Section.stringToBlockList(blocklist);
    for (var i of blocklist) {
      var s=new Script(Section.blocklist,{attrscript:i[0]==='attr',lonely:true,dontregister:true}),
      t=new Block(i[0],i[1],{colour:colour,copy:true});
      s.addchild(t);
      this.blocks.push(s);
    }
    for (var i=this.blocks.length-1;i>=0;i--) Section.blocklist.insertBefore(this.blocks[i].wrapper,this.h1.nextSibling);
    Section.blocklist.addEventListener("scroll",e=>{
      if (Section.blocklist.scrollTop-this.h1.offsetTop>=0) this.li.checked=true;
    },false);
    this.li.addEventListener("click",e=>{
      this.h1.scrollIntoView();
      Section.blocklist.scrollTop+=1;
    },false);
    this.colour=colour;
  }
  static stringToBlockList(str) {
    str=str.split(/\r?\n/);
    var r=[],key={C:'c',S:'stack',T:'text',A:'attr'};
    for (var i of str) r.push([key[i[0]],i.slice(1)]);
    return r;
  }
}
class Element { // example: new Element('c','tag name','<title %a>%b</title>',text)
  constructor(type,label,htmlpattern,section) {
    this.copyscript=new Script(Section.blocklist,{attrscript:type==='attr',lonely:true,dontregister:true});
    this.copyscript.addchild(new Block(type,label,{colour:section.colour,copy:true}));
    this.htmlpattern=htmlpattern;
    Element.elements[label]=this;
    Section.blocklist.insertBefore(this.copyscript.wrapper,section.h1.nextSibling);
  }
  tohtml(a='',b='') {
    // SELF CLOSING: <tag-name %a/>
    // NORMAL <tag-name %a>%b<tag-name>
    // ATTRIBUTE: attribute-name="%a"
    return this.htmlpattern.replace(/%a/g,a).replace(/%b/g,b);
  }
}
Element.elements={};
