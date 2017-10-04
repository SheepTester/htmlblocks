class Block {
  constructor(label="",options={}) {
    function addClasses(el,...classes) {
      for (var i=0;i<classes.length;i++) if (classes[i]) el.classList.add(classes[i]);
    }
    this.blockWrapper=document.createElement("div");
    addClasses(this.blockWrapper,'blocks','blocks-blockwrapper');
    if (options.back) {
      this.blockBack=document.createElementNS('http://www.w3.org/2000/svg',"svg");
      addClasses(this.blockBack,'blocks','blocks-svgblockback');
      this.blockBackPath=document.createElementNS('http://www.w3.org/2000/svg',"path");
      addClasses(this.blockBack,'blocks','blocks-svgblockbackpath');
      this.blockBack.appendChild(this.blockBackPath);
    } else {
      this.blockBack=document.createElement("div");
      addClasses(this.blockBack,'blocks','blocks-defaultblockback');
    }
    this.blockWrapper.appendChild(this.blockBack);
    if (typeof label==='string') label=[label];
    this.inputs=[];
    for (var i=0;i<label.length;i++) { // 'text',{stack=true,appender},{text,dropdown,insertable,list}
      if (typeof label[i]==='string') {
        var text=document.createElement("span");
        addClasses(text,'blocks','blocks-blocklabel');
        text.appendChild(document.createTextNode(label));
        this.blockWrapper.appendChild(text);
        this.inputs[i]=text;
      } else if (label[i].stack) {
        var wrapper=document.createElement("div");
        addClasses(wrapper,'blocks','blocks-scriptwrapper');
        this.blockWrapper.appendChild(wrapper);
        this.inputs[i]=wrapper;
      } else {
        var input,
        display=document.createElement("div");
        addClasses(input,'blocks','blocks-input');
        this.blockWrapper.appendChild(display);
        this.inputs[i]=[display];
        if (label[i].type) {
          input=document.createElement("input")
          input.type='text';
          input.style.display='none';
          addClasses(input,'blocks','blocks-input');
          this.inputs[i][1]=input;
        }
        this.blockWrapper.appendChild(input);
      }
    }
    if (options.appendto) options.appendto.appendChild(this.blockWrapper);
    this.options=options;
    this.options.label=label;
  }
}
