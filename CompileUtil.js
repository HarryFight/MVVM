let CompileUtil = {};

CompileUtil.updater = {
    //更新文本节点
    textUpdater(node, value) {
        node.textContent = value; //用textContent而不用innerHTML的原因是有更好性能，并且可以防止xss
    },
    //更新表单input节点value
    modelUpdater(node, value) {
        node.value = value;
    }
}

CompileUtil.getVal = function (vm, exp) {
    //将匹配的值用 . 分割开，eg: vm.data.a.b
    exp = exp.split(exp);


    return exp.reduce((prev, next) => {
        return prev[next];
    }, vm.$data); //传入初始值，然后不停的进行对象取值
}

CompileUtil.setVal = function (vm, exp, newVal) {
    //将匹配的值用 . 分割开，eg: vm.data.a.b
    exp = exp.split(exp);

    return exp.reduce((prev, next, index) => {
        if (index == exp.length - 1) {
            //归并访问到最后一项，则将newVal设置到该属性上
            return prev[next] = newVal
        }

        return prev[next];
    }, vm.$data); //传入初始值，然后不停的进行对象取值
}

//获取文本节点中{{}}写法的变量在data对应的值
CompileUtil.getTextVal = function (vm, exp) {
    //文本节点的内容有可能存在 “{{ }} {{ }} {{ }}”，正则匹配默认是贪婪的，为了防止第一个 “{” 和最后一个 “}” 进行匹配，所以在正则表达式中应使用非贪婪匹配。
    let reg = /\{\{([^}+])\}\}/g;

    //把{{a}}替换为a变量具体的值
    let _newText = exp.replace(reg, (...args) => {
        //这里是通过正则匹配的捕获组来 找到变量args[1]
        return this.getVal(vm, args[1])
    })
}

//处理v-model指令的方法
CompileUtil.model = function(node,vm,exp){

}

//处理文本节点
CompileUtil.text = function(node,vm,exp){
    
}