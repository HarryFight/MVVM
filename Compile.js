class Compile{
    constructor(el, vm){
        //当传入的不是dom节点，则当做选择器处理
        this.el = this.isElementNode(el) ? el : document.querySelector(el);

        this.vm = vm;

        //当节点存在时，才开始进行编译
        if(this.el){
            //1. 把真实的dom移动到内存中，即放到文档碎片中（fragment）
            let fragment = this.node2fragment(this.el);

            //2. 将文档碎片中定义的{{}}等语法，进行解析编译和绑定
            this.compile(fragment);

            //3. 把内存已经编译处理好的fragment重新放回到el元素上去
            this.el.appendChild(fragment);
        }
    }

    compile(fragment){
        //将文档碎片转化为扁平的节点数组
        let childNodes = fragment.childNodes;

        //Array.from的作用是将类数组转换为数组， 这里是遍历解析数组内的节点
        Array.from(childNodes).forEach((node)=>{
            if( this.isElementNode(node)){
                //当节点为元素节点时

                //1. 递归编译子元素
                this.compile(node);

                //2. 编译当前节点
                this.compileElement(node);
            }else{
                //当节点为文本节点，直接编译
                this.compileText(node);
            }
        })


    }

    //元素节点编译
    compileElement(node){
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
            let attrName = attr.name;

            if(this.isDireactive(attrName)){
                //如果是指令， 解析出 指令方法和表达式
                let [,type] = attrName.split('-');
                let exp = attr.value;

                //todo:调用指令处理方法
            }
        })
    }

    //文本节点编译
    compileText(node){;
        //匹配{{}}
        //文本节点的内容有可能存在 “{{ }} {{ }} {{ }}”，正则匹配默认是贪婪的，为了防止第一个 “{” 和最后一个 “}” 进行匹配，所以在正则表达式中应使用非贪婪匹配。
        let reg = /\{\{([^}+])\}\}/g;
        let _text = node.textContent;

        if(reg.test(_text)){
            //todo: 处理绑定变量 
        }
    }


    /* 辅助方法  */
    //判断是否元素节点
    isElementNode(el){
        return el.nodeType === 1  // 1-元素节点   3-文本节点
    }

    //判断属性是否为指令
    isDireactive(attrName){
        return attrName.includes("v-");
    }

    /* 核心方法 */
    // 将根节点转移至文档碎片
    node2fragment(el){
        let _firstChild;
        let _fragment = document.createDocumentFragment();

        _firstChild = el.firstChild

        //当节点存在时，循环放入到文档片段中
        while(_firstChild){
            //将一个 Dom 节点内的子节点存入文档碎片的过程中，会在原来的 Dom 容器中删除这个节点
            _fragment.appendChild(_firstChild);

            //获取下一个节点
            _firstChild = el.firstChild
        }

        return _fragment;
    }
}