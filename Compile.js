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

    }

    compileElement(){

    }

    compileText(){

    }



    /* 辅助方法  */
    //判断是否元素节点
    isElementNode(el){
        return el.nodeType === 1  // 1-元素节点   3-文本节点
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