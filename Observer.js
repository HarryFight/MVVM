class Observer {
    constructor(data) {
        //劫持data数据响应
        this.observe(data);
    }

    //添加数据监听
    observe(data) {
        // data为对象时，进行数据劫持
        if (!data || typeof data !== 'object') {
            return;
        }

        // 要将数据劫持，先获取到 data 的 key 和 value
        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key, data[key])

            //递归添加数据监听
            this.observe(data[key])
        })
    }

    //数据响应劫持
    defineReactive(data, key, value) {
        let self = this;

        //data中每个数据变化都对应一个watcher观察者数组
        let dep = new Dep();

        Object.defineProperty(data, key, {
            enumerable: true, //可枚举
            configurable: true, //是否可更改
            get: function () {
                //若有新建watcher，则在get值之前会绑定target关联。否则不重复添加订阅者
                Dep.target && dep.addSub(Dep.target)
                return value;
            },
            set: function (newVal) {
                //数据发生变化时才触发
                if(newVal !== value){
                    //如果新值是一个对象，则重新进行一次数据劫持
                    self.observe(newVal)
                    value = newVal;

                    //触发队列通知
                    dep.notify();
                }
            }
        })
    }
}