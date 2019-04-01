class observe {
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

        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key, data[key])

             //递归添加数据监听
             this.observe(data[key])
        })
    }

    //数据响应劫持
    defineReactive(data, key, value) {

        Object.defineProperty(data, key, {
            enumerable: true, //可枚举
            configurable: false, //不可更改
            get: function () {
                return value;
            },
            set: function (newVal) {
                console.log(`set ${value} to ${newVal}`)
                value = newVal;
            }
        })
    }
}