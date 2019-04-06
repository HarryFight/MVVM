let CompileUtil = {};

//文本节点的内容有可能存在 “{{ }} {{ }} {{ }}”，正则匹配默认是贪婪的，为了防止第一个 “{” 和最后一个 “}” 进行匹配，所以在正则表达式中应使用非贪婪匹配。
//正则内容：匹配{{}}中大于等于1个非}的字符串
CompileUtil.reg = /\{\{([^}]+)\}\}/g;

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
    exp = exp.split('.');

    let _value = exp.reduce((prev, next) => {
        return prev[next];
    }, vm.$data); //传入初始值，然后不停的进行对象取值

    return _value;
}

CompileUtil.setVal = function (vm, exp, newVal) {
    //将匹配的值用 . 分割开，eg: vm.data.a.b
    exp = exp.split('.');

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
    //把{{a}}替换为a变量具体的值
    let _text = exp.replace(this.reg, (...args) => {
        //这里是通过正则匹配的捕获组来 找到变量args[1]
        return this.getVal(vm, args[1])
    })

    return _text;
}

//处理v-model指令的方法
CompileUtil.model = function (node, vm, exp) {
    let updateFn = this.updater['modelUpdater'];

    //获取data中对应变量值
    let value = this.getVal(vm, exp);

    //添加观察者，当每次变量变化时，进行update
    new Watcher(vm, exp, (newValue) => {
        updateFn && updateFn(node, newValue);
    })

    //对input监听，实现双向绑定，输入变化时更新data变量值
    node.addEventListener('input', e => {
        let newValue = e.target.value;
        this.setVal(vm, exp, newValue);
    })

    //第一次触发变量替换
    updateFn && updateFn(node, value);
}

//处理文本节点
CompileUtil.text = function (node, vm, exp) {
    let updateFn = this.updater['textUpdater'];

    let value = this.getTextVal(vm, exp);

    exp.replace(this.reg, (...args) => {
        //通过正则，匹配出变量表达式
        let _exp = args[1];

        //绑定观察者
        new Watcher(vm, _exp, (newValue) => {
            updateFn && updateFn(node, newValue);
        })
    })

    updateFn && updateFn(node, value);
}