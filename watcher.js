class Watcher {
    constructor(vm, exp, callback) {
        this.vm = vm;
        this.exp = exp;
        this.callback = callback;

        //创建watcher的时候，触发get操作获取值，并将watcher放入该变量的dep队列中
        this.value = this.get();
    }

    get() {
        //绑定watch关联的Dep对象中
        Dep.target = this;

        //获取data中对应变量的值，触发get操作获取值，并将watcher放入该变量的dep队列中。
        let value = CompileUtil.getVal(this.vm, this.exp);

        //已添加到队列中，解绑关联
        Dep.target = null;

        return value;
    }

    //数据更新 触发
    update() {
        //获取表达式对应的新值
        let newValue = CompileUtil.getVal(this.vm, this.exp);

        let oldValue = this.value;

        console.log('触发update',oldValue,newValue)

        //如果新旧值不相等，则触发watcher的callback
        if (newValue !== oldValue) {
            this.callback(newValue);
        }
    }
}